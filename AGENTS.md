# AGENTS.md — CoreText Executive OS

> Agent/contributor guide. Source of truth for architecture, auth specifics, and
> gotchas. Keep in sync with HANDOVER.md. Generated from live code on 2026-08-28
> (HEAD 1d88dfc).

## 1. What this is
CoreText Executive OS — a multi-tenant *executive briefing* web app: an owner/admins
curate "Shareholder Asset Compounding Suites" (sites) with signals, briefings,
portfolios, geo visibility, decay, monetization, competitors, and a chat assistant
backed by a real LLM.

- **Backend:** FastAPI (Python 3.12 venv at `backend/.venv`), SQLAlchemy ORM.
- **Frontend:** React + Vite + TypeScript (`frontend/`), axios, Tailwind.
- **DB:** Postgres in prod (Neon, via `DATABASE_URL`); SQLite locally.
- **Deploy:** Vercel, auto-deploys from `main`. `vercel.json` strips `/api` (so
  routes are mounted at root, e.g. `/auth/login` not `/api/auth/login`).
- **Repo:** `fxinfo24/CoreText` (branch `main`), local `/Volumes/ByteSmith/BuildLab/CoreText`.

## 2. Architecture
```
frontend/ (React/Vite/TS)
  App.tsx            auth gate: <Landing> (unauth) -> <Login> -> dashboard; bootOS()
  api.ts             localStorage token, axios interceptor, all REST calls
  types.ts           User, UserSettings (incl. openrouter_api_key, llm_model)
  components/
    Landing.tsx      public marketing page for unauthenticated visitors
    Login.tsx        owner/admin/viewer login (+ invite-code sign-up toggle)
    Header.tsx       nav; Users/Invitations buttons gated to owner
    SettingsModal.tsx  OpenRouter key + model dropdown + director/brand settings
    UserManagementModal.tsx  owner-only user directory (CRUD) / self profile
    InvitationsModal.tsx     owner-only single-use invite-code generation

backend/app/
  main.py            FastAPI app, CORS (env-driven), lifespan -> init_database()
  database.py        engine + SessionLocal from DATABASE_URL
  models.py          DBUser, DBUserSettings, DBSite, + all domain tables
  schemas.py         Pydantic request/response models
  security.py        JWT, bcrypt, get_current_user, require_role, owner pinning
  blocklist.py       ~140 disposable/temp-mail domains (registration blocked)
  init_db.py         bootstrap: create_all + migrate cols + seed + ensure owner
  ai_engine.py       LLM call: OpenRouter (selected model) -> OpenAI -> Anthropic -> template
  routers/
    auth.py          login/register/me/logout + owner-only user & invite CRUD
    sites.py         sites, settings GET/POST (settings NOT role-gated)
    briefing.py routing.py portfolio.py geo.py decay.py monetization.py
    competitors.py hive.py chat.py nervous_system.py
```

### Auth flow
- `POST /auth/login` → JWT (HS256, `JWT_SECRET`, 24h). Token stored in
  `localStorage` (`api.ts`), attached via axios interceptor; cleared on 401.
- All data routers depend on `get_current_user` (401 if missing/invalid/expired).
- `POST /auth/register` requires a valid single-use invite code (SHA-256 hashed
  at rest; the raw code is shown only at generation time). Temp-mail blocked;
  in-memory rate limit (5 / 10 min per IP).

### RBAC (3 tiers)
| Role   | Can do                                                        |
|--------|--------------------------------------------------------------|
| owner  | Everything. **Only** role that manages OTHER users & invites. |
| admin  | Content only (sites, briefings, portfolios…). No user CRUD.   |
| viewer | Read-only.                                                   |

- **Owner is pinned by email** via `OWNER_EMAIL` env (default `fxinfo24@gmail.com`),
  defined in `security.py` (`OWNER_EMAILS`). The owner is a superuser: `require_role`
  short-circuits to allow owner for ANY role requirement.
- Owner is **protected**: cannot be demoted, deactivated, or deleted
  (`auth.py` guards using `is_protected_owner`).
- User-management + invite endpoints are `require_role("owner")` only.
- `init_db._ensure_owner()` guarantees exactly one owner on every boot: promotes the
  pinned `OWNER_EMAIL` to owner even over a stale competing owner, then demotes all
  other `owner` accounts to `admin`.
- `_seed_admin()` seeds the env account (`INITIAL_ADMIN_EMAIL`) as **content `admin`**
  (NOT owner) — do not change this back to owner or the owner-precedence bug recurs.

### LLM
`ai_engine.generate_chat_reply` / `atomize_brief` call a real model when a key is
present, else fall back to templated text (UI never breaks). Priority:
**OpenRouter (model from `DBUserSettings.llm_model`) → OpenAI → Anthropic → template**.
Keys come from `DBUserSettings` (Settings UI) or env (`OPENROUTER_API_KEY`,
`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`).

### CORS
Env-driven `CORS_ORIGINS` (comma-separated). `_cors_origins()` in `main.py` falls back
to the Vercel domain + localhost. **Not `*` in prod.** Foreign origins are rejected
(verified: configured origin echoed, evil origin gets no `access-control-allow-origin`).

## 3. Database bootstrap (`init_db.init_database`)
Runs on every cold start (FastAPI `lifespan` in `main.py` calls it):
1. `Base.metadata.create_all` — creates tables (does NOT add columns to existing tables).
2. `_migrate_settings_columns(db)` — ALTERs missing `openrouter_api_key` / `llm_model`
   onto `user_settings` using SQLAlchemy `inspect()` (portable Postgres + SQLite).
   **Why:** a DB seeded before those columns existed 500s on `/api/settings`, which
   aborted `bootOS()` in the frontend (Settings button dead, briefing stuck).
3. `_seed_admin(db)` — seeds `INITIAL_ADMIN_EMAIL` as content `admin` (idempotent).
4. `_ensure_owner(db)` — guarantees exactly one owner (pinned email wins).
5. Demo seed — seeds the 3 "Shareholder Asset Compounding Suite" sites **only when
   `site_fintech` is missing** (idempotent per demo suite; preserves real sites you add).

## 4. Env vars (Vercel dashboard)
```
DATABASE_URL=postgresql://...      # Neon
JWT_SECRET=<32+ random bytes>
INITIAL_ADMIN_EMAIL=...            # seeded as content admin (NOT owner)
INITIAL_ADMIN_PASSWORD=...         # strong
OWNER_EMAIL=fxinfo24@gmail.com     # pinned super-admin
CORS_ORIGINS=https://coretext-eight.vercel.app
OPENROUTER_API_KEY=...             # optional; or paste in Settings UI
OPENAI_API_KEY=...                 # optional fallback
ANTHROPIC_API_KEY=...              # optional fallback
```
⚠️ NEVER hardcode secrets in code. The OpenRouter key the owner pasted in chat was
exposed — it should be set via Settings UI or `OPENROUTER_API_KEY` env, and rotated.

## 5. Gotchas / known sharp edges
- **`vercel.json` strips `/api`** — backend routes are mounted at root. If you add a
  route, do NOT prefix with `/api` (it works locally but 404s in prod).
- **`create_all` won't migrate** — adding a column needs a migration step (see
  `_migrate_settings_columns`). Don't assume a new `Column` appears in prod automatically.
- **Secrets in chat** — user has pasted live keys in conversation; treat as compromised,
  prefer env/Settings, rotate.
- **Register rate limit is in-memory** — ineffective across serverless instances. Acceptable
  for a closed invite-only system; revisit if self-signup opens up.
- **No email-verify / password reset / 2FA** — deferred as premature for a 3-user
  invite-only product.
- **Pyright false positives** across `models.py`/`routers` (`Column[str]` vs `str`) —
  these are SQLAlchemy typing quirks; runtime is correct. Don't "fix" by retyping.
- **Bootstrap is destructive-guarded but not self-healing for data** — `_ensure_owner`
  demotes competing owners to admin; if you ever want multiple owners, change the model.

## 6. How to run locally
```bash
# backend
cd backend && .venv/bin/python run.py   # needs DATABASE_URL/JWT_SECRET or uses SQLite
# frontend
cd frontend && npm install && npm run dev
```
Tests: `backend/test_api.py` exists (run with the venv); not wired into CI.

## 7. Redis / external services
None required. LLM via HTTP; DB via SQLAlchemy. No Neon MCP needed.

## 8. Open items (see HANDOVER.md Status Ledger for history)
- Confirm a fresh Vercel redeploy picks up the owner-precedence + demo-seed + settings
  migration fixes (all pushed; verify live `/api/auth/me` returns `role: "owner"`).
- Promote `newuser@realmail.com` to `admin` in the UI (owner-only).
- Activate real LLM: set OpenRouter key + model in Settings (or env).
- Regenerate this file whenever architecture changes materially.
