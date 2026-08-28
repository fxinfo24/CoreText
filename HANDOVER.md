# HANDOVER.md — CoreText Executive OS

**Date:** 2026-08-27
**Status:** Authentication implemented + verified. Repo is in a clean, deployable state (uncommitted/pending push — see "Git state").

## What was done in this session
Implemented **multi-user JWT authentication** end-to-end (the previously unchecked roadmap item
"Multi-user authentication (JWT + role-based access)"), plus anti-spam registration controls and
full user management.

### Backend
- `backend/app/models.py` — added `DBUser` (email, hashed_password, full_name, role, is_active).
- `backend/app/schemas.py` — `Token`, `TokenData`, `UserPublic`, `LoginRequest`, `RegisterRequest`,
  `UserUpdate`.
- `backend/app/security.py` (NEW) — JWT create/verify, bcrypt hashing (passlib, bcrypt<4.1),
  `get_current_user`, `require_role`.
- `backend/app/blocklist.py` (NEW) — disposable/temp-mail domain blocklist (~140 providers).
- `backend/app/routers/auth.py` (NEW) — `POST /api/auth/login`, `POST /api/auth/register`
  (temp-mail blocked + rate-limited), `GET /api/auth/me`, `POST /api/auth/logout`, and admin-only
  `GET/POST /api/auth/users`, `PUT /api/auth/users/{id}`, `DELETE /api/auth/users/{id}`.
- All existing routers (`sites`, `briefing`, `routing`, `portfolio`, `geo`, `decay`,
  `monetization`, `competitors`, `hive`, `chat`) now require `Depends(get_current_user)`.
- `backend/app/main.py` — includes auth router; added open `GET /api/health`.
- `backend/app/init_db.py` — seeds first admin from `INITIAL_ADMIN_EMAIL`/`INITIAL_ADMIN_PASSWORD`
  (dev default `admin@coretext.local` / `changeme123`); idempotent.
- `backend/requirements.txt` — added `pyjwt`, `passlib`, `bcrypt<4.1`.
- `backend/.venv` was REBUILT (the previous venv's interpreter symlink pointed at a deleted
  uv-managed Python and was broken). New venv uses Python 3.12.

### Frontend
- `src/types.ts` — `User`, `LoginRequest`, `AuthToken`, `UserUpdate`.
- `src/api.ts` — token storage in `localStorage`, axios request interceptor (attaches bearer),
  response interceptor (clears token on 401), `login`/`logout`/`getCurrentUser` + `listUsers`/
  `createUser`/`updateUser`/`deleteUser`.
- `src/components/Login.tsx` (NEW) — themed login screen.
- `src/components/UserManagementModal.tsx` (NEW) — admin user directory (add/edit/delete) + viewer
  self-profile edit; guards surfaced as errors.
- `src/components/Header.tsx` — Users/Profile button + user chip + logout button.
- `src/App.tsx` — auth gate (`<Login>` until authenticated), session restore from stored token,
  logout resets state.

### Docs / metadata
- `README.md` — roadmap item checked off; Security Notes rewritten to reflect real auth; local-run
  instructions with env vars.
- `AGENTS.md` (NEW) — agent/ contributor guide (architecture, auth specifics, gotchas).
- `.gitignore` — `implementation_plan.md` ignored (earlier session).

## Verification performed (real, not claimed)
- Backend imports clean; `npm run build` passes (tsc + vite).
- Auth smoke test (TestClient): login 200, wrong pw 401, protected route 401 without token / 200
  with token, `/api/health` open, register 200, bad token 401.
- Feature test: temp-mail register → 422; real register → 200; viewer listing users → 403;
  admin promote/demote/delete with last-admin & self-delete guards → correct 400/200; registration
  rate limit → 429 on 6th attempt.
- `init_db` seed with `INITIAL_ADMIN_EMAIL`/`PASSWORD` → admin created + demo sites; seeded admin
  logs in; viewer blocked from `/api/auth/users` (403).

## What is NOT done / still gaps
- **The "AI" remains templated** (string templates, no real model call). This is the biggest
  product gap vs. the README's claims.
- No email verification, password reset, or 2FA.
- Registration rate limiter is in-memory (per-process) — not effective across serverless instances.
- CORS is `*` — tighten via env-driven allowed origins for production.
- No CI; `backend/test_api.py` not executed in a pipeline.
- Neon MCP was evaluated and NOT required — the backend already supports Postgres via `DATABASE_URL`;
  SQLAlchemy creates tables, so no MCP was needed to implement auth.

## Env vars required for production
```
INITIAL_ADMIN_EMAIL=...        # seed admin (first boot only)
INITIAL_ADMIN_PASSWORD=...     # strong
JWT_SECRET=...                 # >=32 bytes random
DATABASE_URL=postgresql://...  # Neon (optional; defaults to SQLite)
JWT_EXPIRE_MINUTES=1440        # optional
REGISTER_RATE_LIMIT=5         # optional
REGISTER_RATE_WINDOW=600      # optional
INVITATION_CODES=CODE1,CODE2  # optional; valid invite codes for self-signup.
                               # Empty/missing => self-registration disabled (admin-provisioned only).
```

## Git state
Committed and pushed to `origin/main` (HEAD `d2c2a81`). Live at `coretext-eight.vercel.app`,
deployed via Vercel MCP (auto-deploy from `main`). Env vars `JWT_SECRET` + `INITIAL_ADMIN_*`
set in Vercel dashboard. Self-signup is gated by admin-generated invite codes (DB-backed);
`INVITATION_CODES` env no longer used.

## Real LLM
`ai_engine.py` now calls OpenAI (gpt-4o-mini) then Anthropic (claude-3-5-haiku) when a key is
present — key from `DBUserSettings.openai_api_key`/`anthropic_api_key` (Settings UI) or
`OPENAI_API_KEY`/`ANTHROPIC_API_KEY` env. Falls back to the original templated output on missing
key / call error (UI never breaks). To activate real AI: paste a key in Settings (Header ->
gear) or set the env var, then redeploy.

## One-line summary for the next session
Auth + gated invite-code signup + real-LLM integration + Super-Admin owner tier + OpenRouter
model-select + CORS hardening + public Landing page are all implemented and live.
Open items: delete the leftover fallback admin `admin@coretext.local`/`changeme123` via User
Management if still present (your real account is now auto-promoted to owner on boot);
register rate-limit is in-memory (per-instance); no email-verify/2FA.

- 2026-08-28 | HEAD 1b69161 | Super-Admin owner tier + OpenRouter model-select + CORS tighten + public Landing. RBAC: owner (fxinfo24@gmail.com pinned) > admin (content only) > viewer; user-mgmt/invites owner-only; owner email-pinned (no demote/delete). OpenRouter is preferred LLM with model dropdown in Settings. CORS now env-driven (verified live returns specific origin, not '*'). Public Landing page explains product to unauth visitors. init_db._ensure_owner guarantees a super-admin always exists. Local RBAC test passed: owner 200, admin /users 403, admin cannot demote owner 403, admin /sites 200. Frontend build clean. | OPEN: delete leftover fallback admin via User Management if still present; prod owner role now auto-promoted on boot; register rate-limit in-memory; no email-verify/2FA.
- 2026-08-28 | HEAD 9f51be4 | FIX: Owner dashboard 500/'Loading Executive Briefing…' + Settings button dead. Root cause: prod user_settings table seeded before openrouter_api_key/llm_model columns existed; create_all does not add columns to existing tables → /api/settings 500 aborted bootOS. Added _migrate_settings_columns() (SQLAlchemy inspect, portable Postgres+SQLite) that ALTERs the missing columns on boot. Verified on a simulated old schema: columns added, /settings → 200 with new fields. Fallback admin@coretext.local deleted by owner; CORS_ORIGINS set in Vercel (verified foreign origin rejected). | NEXT: owner to promote newuser@realmail.com → admin in User Mgmt UI; paste OpenRouter key into Settings (openrouter_api_key) or OPENROUTER_API_KEY env (do NOT hardcode).
