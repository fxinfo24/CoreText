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
All changes are **uncommitted** on `main` (local `CoreText` repo, currently 1 commit ahead of
`origin/main` from the earlier `.gitignore` commit). Nothing has been pushed. Recommended next step:
commit the auth work and push, then deploy to Vercel with the env vars above set in the Vercel
dashboard (especially `JWT_SECRET` and `INITIAL_ADMIN_PASSWORD`, since the old deploy had NO auth).

## One-line summary for the next session
Auth is real and verified; the live Vercel site must be redeployed with `JWT_SECRET` +
`INITIAL_ADMIN_PASSWORD` set, otherwise it keeps serving the old (open) build. The remaining
"fake AI" is the only major unbuilt claim.
