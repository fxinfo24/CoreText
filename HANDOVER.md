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
- 2026-08-28 | HEAD be5931c (+1 local, unpushed) | VERIFY + 1 FIX. Verified live prod: /api/auth/login returns real FastAPI 401; /api/auth/me unauth 401; /api/health ok; CORS correctly returns NO access-control-allow-origin for a foreign origin (no '*'). Local cold-boot sim (TestClient, isolated SQLite) confirmed: realistic prod state → fxinfo24@gmail.com auto-promoted to owner, admin@coretext.local stays admin, 3 demo sites seeded, owner-only /auth/users+/auth/invites return 200 while viewer gets 403. Docs claimed "vercel.json strips /api, backend at root" — FALSE for current vercel.json (backend.routePrefix '/api'); fixed AGENTS.md. LATENT BUG FIXED: _ensure_owner's "promote oldest admin to owner" fallback made dev-default admin@coretext.local the owner on a fresh/reset Neon DB (fxinfo24 left with no account); now it always GUARANTEES pinned OWNER_EMAIL owner (create w/ one-time setup pw if absent).
- 2026-08-28 | HEAD 7a0d186 | USER-REPORTED: owner login works; chat tab 'not found'; CTB 'not working'. INVESTIGATED via live curl + TestClient sim. Root cause NOT backend: all CTB endpoints (/monetization/capture, /competitors/intercept, /geo/fix, /hive/transfer) + /chat return 200 against seeded data (verified). TWO FRONTEND DEFECTS: (1) Sidebar used justify-between with no overflow scroll → 10th tab (Conversational Co-Director / chat) clipped below fold, unclickable; fixed with flex-1 + overflow-y-auto. (2) CTB handlers in App.tsx had NO try/catch → any error swallowed silently so a click 'did nothing'; wrapped all in try/catch with success+error toasts. Added backend/test_smoke_api.py (prod-parity: 14 checks incl. owner login, viewer 403, CTB 200, chat reply) — 14/14 pass. Frontend npm build clean. | NEXT: open dashboard, scroll sidebar to 'Conversational Co-Director' to use chat; CTB buttons now give toast feedback. OpenRouter LIVE output still UNVERIFIED (no creds); in-memory rate limit; no email-verify/2FA.
- 2026-08-28 | HEAD aab38c6 | ROOT CAUSE of instant templated chat reply FOUND + FIXED. User pasted OpenRouter key + selected nvidia/nemotron-3-ultra-550b-a55b:free in Settings GUI, but chat returned the _templated_chat_reply 'Shareholder Strategic Synthesis' instantly (real LLM takes 1-5s). Cause: routers/sites.py update_user_settings saved openai_api_key + anthropic_api_key but DROPPED openrouter_api_key and llm_model — so the GUI-saved key never persisted to user_settings; chat read an empty key → instant template. Also the bare except in _chat_via_openrouter swallowed provider errors. FIX: persist all 4 key/model fields in update_user_settings; _chat_via_openrouter now sends OpenRouter referer/title headers + logs the real error type; generate_chat_reply returns an explicit 'Co-Director Offline — LLM Call Failed' (with model id + common causes) when a key is present but the call returns nothing, instead of fake content. Smoke test now has POST/GET /settings roundtrip guard for both fields — 17/17 pass. | NEXT (owner action): on prod, RE-ENTER the OpenRouter key + re-select the model in Settings and SAVE (the old save was dropped), then send a chat message — it should now take ~1-5s and return real model HTML (not the synthesis template). If it still fails, the reply will now say exactly why. Rotation note: any OpenRouter key pasted in earlier chat is compromised; the GUI key is fine.
- 2026-08-28 | HEAD 6507c86 | CONTINUED LLM diagnosis. After aab38c6 the honest 'LLM Call Failed' message appears (code path correct). But the real provider error was only in server logs, not the chat. FIX: refactored _llm_text + 3 provider fns to return (text, error); generate_chat_reply now shows the ACTUAL provider error (e.g. 'AuthenticationError: 401 Missing Authentication header') in-chat, sanitized by _safe_err to redact sk-/Bearer keys (verified: dummy key not leaked). MOST LIKELY PROD CAUSE: stored openrouter key is empty/malformed (the pre-fix save dropped it; fix only affects future saves) → OpenRouter 401 'Missing Authentication header'. | NEXT (owner action): in prod Settings, RE-PASTE the OpenRouter key + re-select model + SAVE. Then send a chat msg; if still failing the reply will now print the exact provider error to diagnose (rate limit / model unavailable / key). Any key pasted in earlier chat is compromised — rotate at OpenRouter; the GUI key is fine.
- 2026-08-28 | HEAD b05d8fc | VERIFIED WORKING. Owner re-pasted OpenRouter key + model in Settings and Saved (the original pre-fix save had dropped the field → empty key → 401). After re-save, chat returned REAL model output from nvidia/nemotron-3-ultra-550b-a55b:free ('Signal Confirmed' — specific strategic synthesis with real numbers, not the template). LLM path fully confirmed end-to-end. Earlier failures were ALL caused by the dropped-field persistence bug in update_user_settings (fixed aab38c6) + the silent except (fixed 6507c86). | DONE: (1) sidebar chat tab reachable; (2) CTB handlers hardened w/ toasts; (3) OpenRouter key+model now persist; (4) real LLM errors surface in chat redacting secrets; (5) prod-parity smoke test 17/17. OPEN: in-memory rate limit; no email-verify/2FA; free-tier 20 RPM throttle on chat.
- 2026-08-28 | HEAD 4dd3f2b | HARDENING: replaced volatile in-memory rate limiter with a DB-backed sliding-window limiter (new model DBRateLimit). Previously the limiter was per-process (reset on every Vercel deploy/cold-start, not shared across serverless instances) AND only guarded /auth/register (already invite-gated), leaving /auth/login with NO brute-force throttle. Now _rate_ok(db, scope, key, limit, window) is applied to BOTH /auth/login (10/300s) and /auth/register (5/600s); counters persist in Postgres so they survive restarts and are shared across instances; tunable via LOGIN_RATE_* / REGISTER_RATE_* env. Smoke test gained login brute-force throttle regression — 19/19 pass. | NEXT priority: 2FA (TOTP) on owner login is the remaining high-value auth hardening; in-memory chat throttle also still open (free-tier only).
- 2026-08-28 | HEAD 73fa4d8 | FEATURE: TOTP 2FA (encrypted-at-rest secrets, two-step login, settings UI). models.DBUser gained totp_secret (Fernet-encrypted, never plaintext) + totp_enabled. Login is now two-step: password -> {totp_required, temp_token} -> POST /auth/2fa/verify -> JWT; wrong code 401. Owner self-service /auth/2fa/setup|enable|disable. SettingsModal shows Enable/QR/Confirm/Disable. New deps: cryptography, pyotp, qrcode. Smoke test 27/27 incl. full 2FA gate flow (setup->enable->login requires 2FA->wrong 401->correct token->disable). SECURITY/PROD NOTE: 2FA requires FERNET_KEY env (32-byte url-safe base64) in Vercel or /auth/2fa/setup returns 503. Secrets fail-closed (never stored plaintext). Under SQLite+TestClient the totp_enabled read can look stale (connection reuse) but the login GATE is the authoritative control and is correct on Postgres. | NEXT: set FERNET_KEY in Vercel; optionally backup/recovery codes; in-memory chat throttle still open.
- 2026-08-28 | HEAD ff0c5b5 | FEATURE: 2FA backup/recovery codes — 2FA is now safe to rely on. 10x XXXX-XXXX codes generated on /2fa/enable and returned IN PLAINTEXT EXACTLY ONCE (only bcrypt hashes stored in DBUser.totp_backup_codes); POST /2fa/backup-codes regenerates a batch (old invalid); login and /2fa/verify both accept a backup code as second factor and CONSUME it (single-use, reuse -> 401); /2fa/disable clears codes; /auth/me exposes backup_codes_remaining. Frontend: SettingsModal shows codes once post-enable with Copy-all + 'I saved them' ack (reload happens only after ack), 'New recovery codes' button + remaining-count badge on enabled panel. Smoke test +6 checks (enable returns 10, backup login works, reuse 401, regen invalidates old, new works) => 33/33 pass. | NEXT: set FERNET_KEY in Vercel (REQUIRED before 2FA can be enabled in prod — see 73fa4d8 note); in-memory chat throttle still open (free-tier only).

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
