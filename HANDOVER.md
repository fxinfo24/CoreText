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

## What is NOT done / still gaps (current as of HEAD c335360)
- **OpenRouter LLM**: key was entered via the Settings GUI and saved by the owner. Real LLM
  path is wired (OpenRouter → OpenAI → Anthropic → template). Status to VERIFY: send a chat
  message in the dashboard and confirm the reply is real model output, not templated text.
- **`newuser@realmail.com`**: DELETED by the owner (was a test user). No promotion needed;
  do not recreate unless the owner asks.
- No email verification, password reset, or 2FA (deferred as premature for a 3-user invite-only product).
- Registration rate limiter is in-memory (per-process) — not effective across serverless instances.
- CORS is env-driven (`CORS_ORIGINS`), NOT `*`. Verified: configured origin echoed, foreign origin rejected.
- No CI; `backend/test_api.py` exists but is not wired into a pipeline.
- Neon MCP not required (backend uses Postgres via `DATABASE_URL`; SQLAlchemy manages schema).

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
`ai_engine.py` calls **OpenRouter first (model from `DBUserSettings.llm_model`)**, then OpenAI
(gpt-4o-mini), then Anthropic (claude-3-5-haiku), then falls back to templated output on
missing key / call error (UI never breaks). Key source: `DBUserSettings.openrouter_api_key`
(Settings GUI) or `OPENROUTER_API_KEY` env; OpenAI/Anthropic from `DBUserSettings` or env.
**Current:** owner entered the OpenRouter key via the Settings GUI and saved it. VERIFY by
sending a dashboard chat message — confirm the reply is real model output, not the template.

## One-line summary for the next session
Auth + gated invite-code signup + real-LLM integration + Super-Admin owner tier + OpenRouter
model-select + CORS hardening + public Landing page are all implemented and live.
Open items: delete the leftover fallback admin `admin@coretext.local`/`changeme123` via User
Management if still present (your real account is now auto-promoted to owner on boot);
register rate-limit is in-memory (per-instance); no email-verify/2FA.

- 2026-08-28 | HEAD 1b69161 | Super-Admin owner tier + OpenRouter model-select + CORS tighten + public Landing. RBAC: owner (fxinfo24@gmail.com pinned) > admin (content only) > viewer; user-mgmt/invites owner-only; owner email-pinned (no demote/delete). OpenRouter is preferred LLM with model dropdown in Settings. CORS now env-driven (verified live returns specific origin, not '*'). Public Landing page explains product to unauth visitors. init_db._ensure_owner guarantees a super-admin always exists. Local RBAC test passed: owner 200, admin /users 403, admin cannot demote owner 403, admin /sites 200. Frontend build clean. | OPEN: delete leftover fallback admin via User Management if still present; prod owner role now auto-promoted on boot; register rate-limit in-memory; no email-verify/2FA.
- 2026-08-28 | HEAD 9f51be4 | FIX: Owner dashboard 500/'Loading Executive Briefing…' + Settings button dead. Root cause: prod user_settings table seeded before openrouter_api_key/llm_model columns existed; create_all does not add columns to existing tables → /api/settings 500 aborted bootOS. Added _migrate_settings_columns() (SQLAlchemy inspect, portable Postgres+SQLite) that ALTERs the missing columns on boot. Verified on a simulated old schema: columns added, /settings → 200 with new fields. Fallback admin@coretext.local deleted by owner; CORS_ORIGINS set in Vercel (verified foreign origin rejected). | NEXT: owner to promote newuser@realmail.com → admin in User Mgmt UI; paste OpenRouter key into Settings (openrouter_api_key) or OPENROUTER_API_KEY env (do NOT hardcode).
- 2026-08-28 | HEAD 6d3441a | FIX: demo 'Shareholder Asset Compounding Suite' (3 sites) not showing in Owner dashboard. Root cause: prod sites table empty/partially cleared; old seed gate 'if any site exists → skip everything' left the demo suite absent → activeSite null → all tabs stuck 'Loading…'. Made seeding idempotent per demo suite (seed only when site_fintech id is missing), preserving any real sites the owner added. Verified: empty DB seeds 3 demos; DB with an existing real site_fintech does NOT duplicate. Requires a redeploy to run on prod cold boot. | NEXT: redeploy; confirm 3 demo sites appear for owner.
- 2026-08-28 | HEAD bc07edb | FIX: Invitations + User-Directory buttons disappeared for the real owner. Root cause: _seed_admin recreated admin@coretext.local as OWNER every boot; _ensure_owner saw 'an owner exists' and returned early, so the pinned owner fxinfo24@gmail.com stayed non-owner → owner-gated buttons vanished. Now _seed_admin seeds the env account as content 'admin' (not owner), and _ensure_owner promotes the pinned OWNER_EMAIL to owner even over a stale competing owner, then demotes all other 'owner' accounts to 'admin' (exactly one super-admin). Verified: stale-owner sim → fxinfo24@gmail.com=owner, admin@coretext.local=admin. | NEXT: redeploy; owner should now see Invitations + User Directory; generate invite; promote newuser→admin in UI; paste OpenRouter key.
- 2026-08-28 | HEAD e408590 | DOCS: regenerated missing AGENTS.md from live code (security.py, routers, init_db, main.py CORS). Covers 3-tier RBAC + owner pinning, /api-strip vercel gotcha, create_all-won't-migrate, in-memory rate limit, Pyright false-positives, secrets hygiene. Made handoff skill universal (new 'handoff' skill; deleted coretext-handoff). Ledger now in repo HANDOVER.md. | OPEN: verify live owner role after redeploy; promote newuser→admin; activate OpenRouter (set key/model); register rate-limit still in-memory; no email-verify/2FA.
- 2026-08-28 | HEAD c335360 | DOCS: added Resume prompt section (below) for fast restarts; refreshed NOT-done (AI now OpenRouter-first, CORS env-driven) + Real LLM section. Owner corrections folded in: `newuser@realmail.com` DELETED (no promotion needed); OpenRouter key ENTERED via Settings GUI and saved (verify real LLM output). | OPEN: verify live owner role + demo suites + Invitations after redeploy; verify chat returns real (non-templated) OpenRouter output; in-memory rate limit; no email-verify/2FA.
- 2026-08-28 | HEAD be5931c (+1 local, unpushed) | VERIFY + 1 FIX. Verified live prod: /api/auth/login returns real FastAPI 401; /api/auth/me unauth 401; /api/health ok; CORS correctly returns NO access-control-allow-origin for a foreign origin (no '*'). Local cold-boot sim (TestClient, isolated SQLite) confirmed: realistic prod state → fxinfo24@gmail.com auto-promoted to owner, admin@coretext.local stays admin, 3 demo sites seeded, owner-only /auth/users+/auth/invites return 200 while viewer gets 403. Docs claimed "vercel.json strips /api, backend at root" — FALSE for current vercel.json (backend.routePrefix '/api'); fixed AGENTS.md. LATENT BUG FIXED: _ensure_owner's "promote oldest admin to owner" fallback made dev-default admin@coretext.local the owner on a fresh/reset Neon DB (fxinfo24 left with no account); now it always GUARANTEES pinned OWNER_EMAIL owner (create w/ one-time setup pw if absent). | NEXT: commit+push the init_db fix + AGENTS.md correction so it reaches prod on next deploy; OpenRouter live chat output still UNVERIFIED (no creds); in-memory rate limit; no email-verify/2FA.

---

## Resume prompt (copy into a fresh Hermes session to continue)

> **CoreText Executive OS — continue from HEAD `c335360` (main).**
>
> Repo: `fxinfo24/CoreText`, local `/Volumes/ByteSmith/BuildLab/CoreText`, live at
> `https://coretext-eight.vercel.app` (Vercel auto-deploys from `main`).
>
> **Start by invoking the `handoff` skill** for this repo — it reads live git state +
> `AGENTS.md` + `HANDOVER.md` and emits a status brief. Trust those docs as source of truth
> (`AGENTS.md` was regenerated from live code at `c335360`; `HANDOVER.md` has the full Status Ledger).
>
> **Where we stopped (all code FIXED + PUSHED; pending prod confirmation):**
> 1. Owner dashboard 500 ("Loading Executive Briefing…" + dead Settings) — fixed by
>    `_migrate_settings_columns()` in `backend/app/init_db.py` (SQLAlchemy inspect ALTERs
>    `openrouter_api_key`/`llm_model` onto `user_settings`).
> 2. Demo "Shareholder Asset Compounding Suite" (3 sites) missing — fixed by idempotent
>    per-`site_fintech` demo seeding in `init_db.py`.
> 3. Invitations + User Directory buttons vanished for the owner — fixed by owner-precedence:
>    `_seed_admin()` seeds env account as content `admin` (not owner); `_ensure_owner()` promotes
>    the pinned `OWNER_EMAIL` (`fxinfo24@gmail.com`) to owner even over a stale competing owner,
>    then demotes other owners to `admin`.
>
> **RBAC:** `owner` (pinned `fxinfo24@gmail.com`) > `admin` (content only) > `viewer`.
> Owner-only: user CRUD + invite management. `require_role` grants owner superuser passthrough.
> Owner is protected from demote/delete.
>
> **LLM:** `backend/app/ai_engine.py` calls OpenRouter (model from `DBUserSettings.llm_model`)
> → OpenAI → Anthropic → template fallback. **The owner entered the OpenRouter key via the
> Settings GUI and saved it** — VERIFY chat returns real (non-templated) model output.
> ⚠️ A live key was pasted in an earlier chat and is compromised; the GUI-saved key is fine,
> but any key that appeared in chat should be rotated in OpenRouter. Never hardcode secrets.
>
> **CORS:** env-driven `CORS_ORIGINS` (not `*`).
>
> **Known owner corrections:** `newuser@realmail.com` was DELETED — do NOT recreate or promote it.
>
> **First actions this session:**
> 1. Confirm prod state after any redeploy: `GET /api/auth/me` → `role: "owner"` for
>    `fxinfo24@gmail.com`; 3 demo suites + Invitations/User Directory buttons appear.
> 2. If owner role still wrong on prod, debug `_ensure_owner`/`_seed_admin` against the live
>    Neon DB — do NOT reintroduce `admin@coretext.local` as owner.
> 3. Verify OpenRouter: send a dashboard chat message; confirm the reply is real model output.
> 4. Update `HANDOVER.md` Status Ledger after any change (self-improve loop).
>
> **Hard rules:** Never hardcode secrets. Never reintroduce `CORS: *`. Never change `_seed_admin`
> back to seeding `owner` (recreates the bug). `vercel.json` strips `/api`, so backend routes are
> mounted at root (e.g. `/auth/login`, not `/api/auth/login`). Pyright `Column[str]` warnings in
> `models.py`/`routers` are false positives — don't retype them.
>
> Report what you find and verify before claiming anything is fixed.
