# AGENTS.md — CoreText (BuildLab/CoreText)

> Operational guide for AI coding agents and contributors working on CoreText Executive OS.
> Last updated: 2026-08-27. Stack: FastAPI + React 18 + Vite + TypeScript + Tailwind + SQLite/Postgres.

## What this project is
A full-stack "shareholder asset compounding" dashboard for managing content-portfolio sites
(SEO/GEO intelligence, briefing, decay shields, monetization, competitors, chat). It is a
**real, functional dashboard app** — NOT an autonomous money-maker despite the marketing copy.

## Hard facts an agent must know (read before changing anything)
1. **Authentication IS implemented** (added 2026-08-27). All `/api` data routes require a JWT
   bearer token. Public routes: `GET /`, `GET /api/health`, `POST /api/auth/login`,
   `POST /api/auth/register`, `POST /api/auth/logout`, `GET /api/auth/me`.
2. **The "AI" is templated, NOT wired to a real model.** `backend/app/ai_engine.py` builds replies
   with string templates + keyword matching. The `openai_key`/`anthropic_key` params are accepted
   but never used — no SDK call is made even though `openai`/`anthropic` are dependencies. Do not
   claim the chat/atomize features are "real AI." To make them real, call the SDKs inside
   `ai_engine.py` (the seam already exists).
3. **Seeding**: `init_db.py` seeds 3 demo sites + an admin user. Admin email/password come from
   `INITIAL_ADMIN_EMAIL` / `INITIAL_ADMIN_PASSWORD` env (default `admin@coretext.local` /
   `changeme123` for local dev only).
4. **Route paths have NO `/api` prefix in code** (e.g. `/sites`). Vercel's `vercel.json`
   `routePrefix: "/api"` adds it in production; the local Vite dev proxy also maps `/api`. Keep
   frontend calls as `/api/...` and backend routes as `/...` — DO NOT "fix" this mismatch, it is
   intentional for both environments.
5. **DB**: `database.py` switches SQLite ↔ Postgres via `DATABASE_URL`. Tables are defined on
   `models.Base` (NOT `database.Base` — `database.Base` is unused for table registration). Always
   call `models.Base.metadata.create_all` (done in `init_db.py`).

## Project layout
```
backend/app/
  main.py            # FastAPI app, CORS, router includes, /api/health
  database.py        # engine + SessionLocal (SQLite/Postgres via DATABASE_URL)
  models.py          # SQLAlchemy ORM tables (users, sites, ...)
  schemas.py         # Pydantic request/response models (incl. auth)
  security.py        # JWT create/verify, bcrypt hashing, get_current_user, require_role
  blocklist.py       # disposable/temp-mail domain blocklist
  init_db.py         # seed admin + demo data
  routers/
    auth.py          # login/register/me/logout + admin user CRUD (THIS FILE IS AUTH)
    sites.py, briefing.py, ...  # feature routers; each route Depends(get_current_user)
frontend/src/
  api.ts             # axios client + token storage + interceptors + auth fns
  types.ts           # TS types (incl. User, LoginRequest, AuthToken, UserUpdate)
  App.tsx            # auth gate (Login vs dashboard), session restore, logout
  components/Login.tsx, UserManagementModal.tsx, Header.tsx
  components/tabs/*  # the 10 feature tabs
```

## Auth implementation specifics
- **Tokens**: HS256 JWT, `JWT_SECRET` env (default `change-me-in-production` — MUST be overridden).
  Expiry `JWT_EXPIRE_MINUTES` (default 1440 = 24h).
- **Passwords**: bcrypt via `passlib`; `bcrypt` pinned to `<4.1` (passlib 1.7.x incompatibility with
  bcrypt 4.1+). Hashing truncates to 72 bytes defensively.
- **Roles**: `admin` | `viewer`. `require_role("admin")` guards user-management endpoints.
- **Self-registration**: open but (a) blocks disposable/temp-mail domains (`blocklist.py`),
  (b) rate-limited 5 / 10 min per IP (in-memory; swap for Redis if scaling).
- **User management** (admin only): list/create/update/delete. Guards: cannot delete/disable the
  last active admin; cannot delete your own account.
- **Frontend**: token in `localStorage`; axios interceptor attaches `Authorization` and clears the
  token on 401. `App.tsx` shows `<Login>` until authenticated. Header has Users/Profile + logout.

## How to run locally
```bash
cd backend && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
cd frontend && npm install
export INITIAL_ADMIN_EMAIL=you@company.com INITIAL_ADMIN_PASSWORD='strong' JWT_SECRET='32+ bytes'
./run_coretext.sh   # backend :8000, frontend :3000
```
Note: `run_coretext.sh` references `/home/user/...` in the README-era copy — the committed version uses
relative paths. If it fails, run `backend/run.py` and `frontend npm run dev` separately.

## Conventions
- Add new backend routes behind `Depends(get_current_user)` unless intentionally public.
- Add matching `UserUpdate`/`schemas` entries for any new auth payloads.
- Frontend: typed `api.ts` functions; never put secrets in code.
- Conventional commits (`feat:`/`fix:`/`chore:`/`docs:`).

## Known gaps / caveats
- No email verification, no password reset, no 2FA.
- In-memory rate limiter resets on restart / doesn't share across Vercel instances.
- CORS is `*` in code — tighten for production (env-driven allowed origins).
- No tests CI. `backend/test_api.py` exists but is not wired to a CI runner.
