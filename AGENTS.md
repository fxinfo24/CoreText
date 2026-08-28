# AGENTS.md — CoreText Executive OS

> Agent/contributor guide. Source of truth for architecture, auth specifics, and
> gotchas. Keep in sync with HANDOVER.md.

## 1. What this is

CoreText Executive OS — a multi-tenant *executive briefing* web app: an owner/admins
curate "Shareholder Asset Compounding Suites" (sites) with signals, briefings,
portfolios, geo visibility, decay, monetization, competitors, and a chat assistant
backed by a real LLM.

- **Backend:** FastAPI (Python 3.12 venv at `backend/.venv`), SQLAlchemy ORM.
- **Frontend:** React + Vite + TypeScript (`frontend/`), axios, Tailwind.
- **DB:** Neon Postgres in prod (via `DATABASE_URL`); SQLite locally.
- **Deploy:** Vercel, auto-deploys from `main`. `vercel.json` uses
  `experimentalServices` with `backend.routePrefix: "/api"`, so the FastAPI app is
  served under `/api` (e.g. `/api/auth/login`, `/api/sites`). Do NOT mount routes at
  root. The frontend (`src/api.ts`) already calls `/api/...` (relative, baseURL `''`),
  which is correct for this config.
- **Repo:** `fxinfo24/CoreText` (branch `main`), local `/Volumes/ByteSmith/BuildLab/CoreText`.

## 2. Architecture

```
frontend/ (React/Vite/TS)
  App.tsx            auth gate: <Landing> (unauth) -> <Login> -> dashboard; bootOS()
  api.ts             localStorage token, axios interceptor, all REST calls
  types.ts           User, UserSettings (incl. openrouter_api_key, llm_model)
  components/
    Landing.tsx      public marketing page for unauthenticated visitors
    Login.tsx        owner/admin/viewer login (+ sign-up toggle + 2FA step)
    Header.tsx       nav; Users/Invitations buttons gated to owner
    SettingsModal.tsx  OpenRouter key + model select + 2FA enable/disable + backup codes
    UserManagementModal.tsx  owner-only user directory (CRUD) / self profile
    InvitationsModal.tsx     owner-only single-use invite-code generation

backend/app/
  main.py            FastAPI app, CORS (env-driven), lifespan -> init_database()
  database.py        engine + SessionLocal from DATABASE_URL
  models.py          DBUser, DBUserSettings, DBSite, DBRateLimit + all domain tables
  schemas.py         Pydantic request/response models (incl. 2FA)
  security.py        JWT, bcrypt, TOTP (pyotp), Fernet encryption, backup codes
  blocklist.py       ~140 disposable/temp-mail domains
  init_db.py         bootstrap: create_all + migrate cols + seed + ensure owner
  ai_engine.py       LLM call: OpenRouter -> OpenAI -> Anthropic -> template
  routers/
    auth.py          login (two-step), register, 2fa CRUD, backup codes, user/invite mgmt
    sites.py         sites, settings GET/POST
    briefing.py routing.py portfolio.py geo.py decay.py monetization.py
    competitors.py hive.py chat.py nervous_system.py
```

## 3. Auth flow

```
POST /api/auth/login (email, password)
  ├── rate-limit check (DB-backed, 10/300s per IP)
  ├── authenticate -> 401 / continue
  ├── [if totp_enabled]:
  │     ├── totp_code provided in body -> verify (or backup code) -> 401/200 JWT
  │     └── no totp_code yet -> 200 {totp_required, temp_token}
  └── [2FA off] -> 200 {access_token}
```

- Temp tokens are short-lived (5 min, `totp_pending: True`) — only accepted by `/api/auth/2fa/verify`.
- All data routers depend on `get_current_user` (401 if missing/invalid/expired).
- `POST /auth/register` requires a valid single-use invite code (SHA-256 hashed at rest;
  raw code shown only at generation). Temp-mail blocked; **DB-backed** rate limit (5/10 min).

### 2FA (TOTP) endpoints

| Endpoint | Flow |
|----------|------|
| `POST /auth/2fa/setup` | Returns `otpauth://` URI + base32 secret (plaintext, shown once). Secret encrypted via Fernet before storage. Requires `FERNET_KEY`. |
| `POST /auth/2fa/enable` | Verify code, activate 2FA, return 10 single-use backup codes (plaintext ONCE — bcrypt hashes stored). |
| `POST /auth/2fa/disable` | Clears secret + backup codes, deactivates. |
| `POST /auth/2fa/backup-codes` | Regenerates 10 new codes, invalidates old batch. |
| `POST /auth/2fa/verify` | Exchanges `temp_token` + code (TOTP or backup) for real JWT. |

### RBAC (3 tiers)

| Role   | Can do                                                        |
|--------|---------------------------------------------------------------|
| owner  | Everything. **Only** role that manages OTHER users & invites. |
| admin  | Content only (sites, briefings, portfolios…). No user CRUD.   |
| viewer | Read-only.                                                    |

- **Owner is pinned by email** via `OWNER_EMAIL` env (default `fxinfo24@gmail.com`),
  defined in `security.py` (`OWNER_EMAILS`). The owner is a superuser: `require_role`
  short-circuits to allow owner for ANY role requirement.
- Owner is **protected**: cannot be demoted, deactivated, or deleted
  (`auth.py` guards using `is_protected_owner`).
- User-management + invite endpoints are `require_role("owner")` only.
- `init_db._ensure_owner()` guarantees exactly one owner on every boot: promotes the
  pinned `OWNER_EMAIL` to owner even over a stale competing owner, then demotes all
  other `owner` accounts to `admin`. Also applies `OWNER_PASSWORD` if the env is set.
- `_seed_admin()` seeds the env account (`INITIAL_ADMIN_EMAIL`) as **content `admin`**
  (NOT owner) — do not change this back to owner or the owner-precedence bug recurs.

### Backup codes

- 10 codes (`XXXX-XXXX` format, unambiguous alphabet) generated on `/2fa/enable`.
- Stored as bcrypt hashes in `DBUser.totp_backup_codes` (JSON list).
- **Single-use**: matched code is consumed (dropped from hash list). Reuse -> 401.
- Accepted at both `/login` and `/2fa/verify` as the second factor.
- Regeneration via `/2fa/backup-codes` invalidates the entire old batch.

## 4. LLM

`ai_engine.generate_chat_reply` / `atomize_brief` call a real model when a key is
present, else fall back to templated text (UI never breaks). Priority:
**OpenRouter (model from `DBUserSettings.llm_model`) -> OpenAI -> Anthropic -> template**.

Errors now surface in-chat (redacting any API keys shown in the error) instead of
silently swallowing exceptions.

## 5. CORS

Env-driven `CORS_ORIGINS` (comma-separated). Falls back to the Vercel domain +
localhost. **Not `*` in prod.** Foreign origins are rejected.

## 6. Database bootstrap (`init_db.init_database`)

Runs on every cold start (FastAPI `lifespan` in `main.py` calls it):

1. `Base.metadata.create_all` — creates tables (does NOT add columns to existing tables).
2. `_migrate_settings_columns(db)` — ALTERs missing `openrouter_api_key` / `llm_model`
   onto `user_settings` using SQLAlchemy `inspect()` (portable Postgres + SQLite).
3. `_migrate_user_2fa_columns(db)` — ALTERs missing `totp_secret`, `totp_enabled`,
   `totp_backup_codes` onto `users` table (same fix pattern as step 2).
4. `_seed_admin(db)` — seeds `INITIAL_ADMIN_EMAIL` as content `admin` (idempotent).
5. `_ensure_owner(db)` — guarantees exactly one owner (pinned email wins; applies
   `OWNER_PASSWORD` if env set).
6. Demo seed — seeds the 3 demo sites only when `site_fintech` is missing (idempotent).

## 7. Env vars (Vercel dashboard)

```ini
# Required
JWT_SECRET=                          # >=32 random bytes for JWT signing
OWNER_EMAIL=fxinfo24@gmail.com       # Pinned super-admin email

# Database (omit for local SQLite)
DATABASE_URL=postgresql://...        # Neon connection string

# Production creds (override defaults)
OWNER_PASSWORD=...                   # Owner login password (set every boot)
INITIAL_ADMIN_EMAIL=...              # Content admin email (default admin@coretext.local)
INITIAL_ADMIN_PASSWORD=...           # Content admin password (default changeme123)

# 2FA — REQUIRED to enable 2FA in Settings
FERNET_KEY=...                       # 32-byte url-safe base64

# CORS
CORS_ORIGINS=https://coretext-eight.vercel.app

# Optional AI keys (can also paste in Settings UI)
OPENROUTER_API_KEY=...               # Preferred — routes to 100+ models
OPENAI_API_KEY=...                   # Fallback
ANTHROPIC_API_KEY=...                # Fallback
```

⚠️ NEVER hardcode secrets in code. Any OpenRouter key pasted in chat is compromised.

## 8. Gotchas / known sharp edges

- **`/api` prefix**: `vercel.json` sets `backend.routePrefix: "/api"`. Do NOT add `/api`
  to backend route strings. Requests to non-`/api` paths fall through to the static SPA.
- **`create_all` won't migrate columns**: Adding a `Column` to an existing model does NOT
  appear on existing prod tables. Always add a migration helper using SQLAlchemy `inspect()`.
  Two already exist: `_migrate_settings_columns` and `_migrate_user_2fa_columns`.
- **2FA FERNET_KEY fail-closed**: Without `FERNET_KEY`, `/auth/2fa/setup` returns 503.
  The TOTP secret is never stored unencrypted.
- **SQLite read-staleness in TestClient**: Under SQLite + TestClient, `totp_enabled` can
  read as `False` in response payload despite DB storing `1` (connection-pool transaction
  snapshot). The **login gate** (authoritative control) reads correctly. On Postgres (prod)
  each request opens a fresh connection. This is a test-harness artifact only.
- **Pyright false positives**: `Column[str]` vs `str` across `models.py`/`routers` —
  SQLAlchemy typing quirks; runtime is correct. Do not retype.
- **Owner-precedence bug (fixed)**: `_ensure_owner` used to fall back to "promote oldest
  admin" when pinned owner was absent. Now guarantees the pinned OWNER_EMAIL is owner.
  NEVER revert `_seed_admin` back to owner.
- **Secrets in chat**: Any key that appeared in chat is compromised — rotate it.
- **Rate limit is DB-backed** (not in-memory): Login (10/300s) and register (5/600s).
  Survives restarts. Shared across serverless instances. Tunable via env vars.
- **`OWNER_PASSWORD` env**: applied on every boot in `_ensure_owner`. Not a "one-time"
  setup password — it resets on each deploy, so keep it stable in Vercel env.

## 9. How to run locally

```bash
# backend
cd backend && JWT_SECRET=dev-secret-minimum-32-bytes OWNER_PASSWORD=test123 .venv/bin/python run.py
# frontend
cd frontend && npm run dev
```

To test 2FA locally:
```bash
export FERNET_KEY=$(python3 -c "import base64, os; print(base64.urlsafe_b64encode(os.urandom(32)).decode())")
```

Tests: `cd backend && .venv/bin/python test_smoke_api.py` -> 33 checks.

## 10. Redis / external services
None required. LLM via HTTP; DB via SQLAlchemy; 2FA via pyotp (no email/SMS).

## 11. Open items (see HANDOVER.md Status Ledger for full history)
- In-memory chat throttle still open (free-tier only — low urgency)
- Email-verify / password reset not implemented
- Regenerate this file when architecture changes materially
