<p align="center">
  <img src="https://img.shields.io/badge/CoreText-Executive_OS-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQyIDAtOC0zLjU4LTgtOHMzLjU4LTggOC04IDggMy41OCA4IDgtMy41OCA4LTggOHoiLz48L3N2Zz4=&labelColor=0f172a" alt="CoreText Executive OS" />
  <img src="https://img.shields.io/badge/version-2.1.0-10b981?style=for-the-badge&labelColor=0f172a" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-a78bfa?style=for-the-badge&labelColor=0f172a" alt="License" />
  <img src="https://img.shields.io/badge/python-3.11+-3b82f6?style=for-the-badge&logo=python&logoColor=white&labelColor=0f172a" alt="Python" />
  <img src="https://img.shields.io/badge/react-18-61dafb?style=for-the-badge&logo=react&logoColor=white&labelColor=0f172a" alt="React" />
</p>

<h1 align="center">CoreText Executive OS</h1>

<p align="center">
  <strong>The Shareholder Asset Compounding Suite</strong><br/>
  <em>Enterprise-grade full-stack command center for autonomous content portfolio management, predictive SEO intelligence, and multi-site revenue compounding.</em>
</p>

---

## 🎯 What is CoreText?

CoreText Executive OS is a **fully autonomous content portfolio management system** that transforms you from an operator into a **Shareholder**. You establish your asset compounding parameters once, review prioritized multi-dimensional content portfolios, and trigger fully predictive AI webhook engines that compound your enterprise asset valuation permanently.

### The Shareholder Mental Model

| Role | Responsibility |
|------|---------------|
| **Shareholder** (You) | Set strategy. Review briefings. Approve Tier 3/4 decisions. |
| **CoreText Executive OS** | Executes Tier 1/2 autonomously. Predicts decay. Intercepts trends. Compounds revenue. |

### Live URL

Production deployment: **https://coretext-eight.vercel.app**

---

## ✨ Key Features

### 🌅 Morning Briefing Engine
Autonomous overnight situation reports per asset — revenue pacing, strategic decisions queued, 30-day forecasts, and compounding metrics. One screen, full portfolio awareness.

### 🧠 3-Layer Nervous System Stack
- **Layer 1** — Real-time crawl budget, CTR micro-dip detection, and predictive health scoring
- **Layer 2** — Industry velocity analysis, algorithm weather, and emerging topic cluster interception
- **Layer 3** — Persistent AI memory per site: audience posture, tone calibration, monetization rules

### 🔀 Intelligent Decision Routing (4-Tier)

| Tier | Description | Execution |
|-----|-------------|-----------|
| **T1** | Broken links, meta updates, schema fixes | Fully autonomous |
| **T2** | Statistic refreshes, FAQ injections | Autonomous + notification |
| **T3** | New content clusters, link restructuring | Human approval required |
| **T4** | Strategic pivots, product launches | Human discussion required |

### 📊 Content Portfolio Optimizer
Multi-dimensional scoring engine (demand × GEO × monetization × competitive gap × authority fit) with one-click **Atomization Studio** — instantly fragments a pillar into newsletter, LinkedIn carousel, Twitter thread, YouTube script, and podcast outline.

### 🌐 GEO Engine Visibility (Generative Engine Optimization)
Track and optimize your citation footprint across **ChatGPT Search**, **Perplexity Pro**, and **Claude** — deploy structured AI Answer Baits and run citability audits.

### 🛡️ Preemptive Content Decay Shield
Predictive decay probability scoring with autonomous refresh briefing generation. Catch ranking erosion 14–30 days before it hits.

### 💰 Revenue Maximizer
Per-article RPM tracking, untapped affiliate gap detection, digital product creation opportunities, and live affiliate program radar.

### 🏟️ Competitive Intelligence & Trend Interception
Real-time competitor publishing velocity monitoring with autonomous fast-response brief generation for viral trend windows (X/Twitter, Reddit, HackerNews, GitHub Trending).

### 🐝 Hive Mind Cross-Pollination
Transfer winning strategies between portfolio sites — conversion tactics, content formats, and engagement patterns that compound across your entire asset network.

### 💬 AI Co-Director Chat
Context-aware strategic dialogue powered by OpenRouter (any model), OpenAI GPT-4o, or Anthropic Claude, with full Layer 3 memory access for every asset in your portfolio.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│              FRONTEND (React 18)                │
│  Vite · TypeScript · Tailwind CSS · Recharts    │
│  Lucide Icons · Axios                           │
│  Deployed via Vercel                            │
├─────────────────────────────────────────────────┤
│             /api  REST API prefix               │
├─────────────────────────────────────────────────┤
│              BACKEND (FastAPI)                  │
│  Python 3.11+ · SQLAlchemy ORM · Pydantic v2    │
│  OpenRouter SDK · OpenAI SDK · Anthropic SDK     │
│  JWT Auth · TOTP 2FA · DB-backed rate limiter   │
│  Deployed via Vercel Serverless Functions       │
├─────────────────────────────────────────────────┤
│             PERSISTENCE (Neon Postgres)          │
│  SQLite fallback for local dev                   │
└─────────────────────────────────────────────────┘
```

### Backend (`backend/app/`)

| File | Purpose |
|------|---------|
| `main.py` | FastAPI app, CORS, lifespan bootstrap |
| `models.py` | SQLAlchemy ORM models (16+ tables including `DBUser`, `DBUserSettings`, `DBRateLimit`) |
| `schemas.py` | Pydantic validation schemas |
| `security.py` | JWT, bcrypt, TOTP 2FA (encrypted secrets), Fernet encryption, backup codes |
| `ai_engine.py` | OpenRouter → OpenAI → Anthropic → template fallback |
| `init_db.py` | Database bootstrap with migration helpers + demo seeding |
| `database.py` | DB engine config (SQLite local, Postgres prod) |
| `routers/` | Modular API routers (auth, sites, briefing, chat, monetization, geo, etc.) |

### Frontend (`frontend/src/`)

| File | Purpose |
|------|---------|
| `App.tsx` | Root app with auth gate, state, tab routing |
| `api.ts` | Typed Axios API client (JWT interceptor) |
| `types.ts` | Full TypeScript interface definitions |
| `components/` | Login, Header, Sidebar, SettingsModal, AddSuiteModal, AtomizeModal, Toast |
| `components/tabs/` | 10 specialized tab components (Briefing, NervousSystem, Decisions, Portfolios, GEO, Decay, Monetization, Competitors, Hive, Chat) |

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.11+** with `pip`
- **Node.js 18+** with `npm`
- For local Postgres testing: Neon account (optional — falls back to SQLite)

### 1. Clone & Install

```bash
git clone https://github.com/fxinfo24/CoreText.git
cd CoreText
```

### 2. Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m app.init_db              # Seeds demo data + creates tables
python run.py                      # Starts at http://localhost:8000
```

Verify: `curl http://localhost:8000/api/health` → `{"status":"ok"}`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev                        # Starts at http://localhost:3000
```

### 4. Sign In

Default dev credentials (change in production):
- **Owner:** Set `OWNER_EMAIL` + `OWNER_PASSWORD` in env (owner is pinned to `fxinfo24@gmail.com`)
- **Admin:** `admin@coretext.local` / `changeme123` (seeded by `INITIAL_ADMIN_EMAIL`/`INITIAL_ADMIN_PASSWORD`)
- Sign in at `http://localhost:3000`, or the production URL

---

## ⚙️ Configuration

### Environment Variables (Vercel / local)

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Prod | Postgres connection (Neon). Omit for local SQLite. |
| `JWT_SECRET` | Yes | ≥32 random bytes for JWT signing |
| `OWNER_EMAIL` | Yes | Pinned super-admin email (default: `fxinfo24@gmail.com`) |
| `OWNER_PASSWORD` | Strongly | Owner's login password (set once on every boot) |
| `FERNET_KEY` | ✅ 2FA | 32-byte url-safe base64 for encrypting TOTP secrets at rest |
| `INITIAL_ADMIN_EMAIL` | Recommended | Content admin email (default: `admin@coretext.local`) |
| `INITIAL_ADMIN_PASSWORD` | Recommended | Content admin password (default: `changeme123`) |
| `CORS_ORIGINS` | Prod | Comma-separated allowed origins |
| `OPENROUTER_API_KEY` | Optional | For live LLM via Settings UI (or paste in-app) |

### AI Engine API Keys

Open **Settings** (⚙️ icon in sidebar) to configure:

| Provider | Models Used | Purpose |
|----------|------------|---------|
| **OpenRouter** (preferred) | Any of 100+ models | Live chat, content atomization, strategic analysis |
| **OpenAI** | `gpt-4o`, `gpt-4o-mini` | Fallback AI engine |
| **Anthropic** | `claude-sonnet`, `claude-haiku` | Fallback AI engine |

> CoreText works fully without API keys — all core features (briefings, portfolios, decay shields, GEO audits) operate on deterministic logic. AI keys unlock enhanced chat and atomization quality.

---

## 🔐 Security Features

### Authentication
- **JWT-based**: HS256 tokens (24h expiry) stored in `localStorage`
- **Two-step login**: Password → if 2FA enabled → TOTP code or backup code → JWT
- **RBAC (3 tiers)**: `owner` > `admin` (content only) > `viewer` (read-only)
- **Registration**: Invite-code gated; disposable email blocked; rate-limited

### Two-Factor Authentication (TOTP)
- Enable in **Settings** → "Two-Factor Authentication"
- Any authenticator app (Google Authenticator, 1Password, Authy)
- TOTP secret is **Fernet-encrypted at rest** (never plaintext in DB)
- **10 one-time backup codes** generated on enable — shown exactly once, bcrypt-hashed thereafter
- Backup codes are single-use (reuse returns 401); regenerate anytime
- **Requires `FERNET_KEY` env var** in production

### Rate Limiting
- **DB-backed sliding-window** (survives restarts, shared across serverless instances)
- Login: 10 attempts per 5 minutes per IP
- Registration: 5 attempts per 10 minutes per IP
- OpenRouter free-tier: 20 RPM on chat endpoint

### Protection Rules
- Pinned owner (`OWNER_EMAIL`) cannot be demoted, deactivated, or deleted
- `CORS_ORIGINS` env-driven — **not `*` in prod**
- Env secrets never hardcoded; keys entered via Settings UI

---

## 📡 API Reference (Key Endpoints)

All endpoints prefixed with `/api/`. Interactive docs at `/api/docs` (Swagger UI) when running.

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login (password → 2FA step if enabled) |
| `POST` | `/api/auth/2fa/setup` | Generate TOTP secret (requires `FERNET_KEY`) |
| `POST` | `/api/auth/2fa/enable` | Confirm code, activate 2FA + return backup codes |
| `POST` | `/api/auth/2fa/verify` | Second login step (temp_token + code → JWT) |
| `POST` | `/api/auth/2fa/backup-codes` | Regenerate backup codes |
| `POST` | `/api/auth/2fa/disable` | Disable 2FA on your account |
| `GET` | `/api/auth/me` | Current user profile (incl. `backup_codes_remaining`) |
| `GET` | `/api/auth/users` | List users (owner-only) |
| `POST` | `/api/auth/register` | Register with invite code |

### Core Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/sites` | List all shareholder suites |
| `GET` | `/api/briefing/{site_id}` | Morning briefing |
| `GET` | `/api/nervous-system/{site_id}` | 3-layer nervous system |
| `GET` | `/api/decisions/{site_id}` | 4-tier decision queue |
| `POST` | `/api/decisions/execute/{id}` | Execute decision |
| `GET` | `/api/portfolios/{site_id}` | Content portfolios |
| `POST` | `/api/portfolios/atomize` | Atomize content |
| `GET` | `/api/geo/{site_id}` | GEO visibility data |
| `GET` | `/api/decay/{site_id}` | Decay predictions |
| `POST` | `/api/decay/shield/{id}` | Deploy decay shield |
| `GET` | `/api/monetization/{site_id}` | Revenue intelligence |
| `GET` | `/api/competitors/{site_id}` | Competitive intelligence |
| `GET` | `/api/hive` | Hive mind cross-pollinations |
| `POST` | `/api/chat` | AI Co-Director chat |
| `GET` | `/api/settings` | Get user settings |
| `POST` | `/api/settings` | Update user settings |
| `GET` | `/api/health` | Health check (unauthenticated) |

---

## 🧪 Testing

```bash
cd backend
.venv/bin/python test_smoke_api.py    # 33 prod-parity smoke checks
```

The smoke test exercises login, 2FA gate flow, backup codes, rate limiting, settings persistence, CTB endpoints, chat, and RBAC — all against an isolated SQLite database.

---

## 🗂️ Project Structure

```
CoreText/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry
│   │   ├── models.py            # SQLAlchemy models (18+)
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── security.py          # JWT + bcrypt + TOTP + Fernet + backup codes
│   │   ├── ai_engine.py         # AI integration (OpenRouter → OpenAI → Anthropic)
│   │   ├── init_db.py           # Bootstrap + migrations + demo seed
│   │   ├── database.py          # DB engine config
│   │   ├── limiter.py           # Rate-limit helpers (deprecated — body in auth.py)
│   │   └── routers/             # 12 modular API routers
│   ├── requirements.txt
│   ├── run.py
│   └── test_smoke_api.py        # 33-check prod-parity smoke test
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Auth gate + tab routing
│   │   ├── api.ts               # Typed axios client
│   │   ├── types.ts             # TS interfaces
│   │   └── components/
│   │       ├── Login.tsx        # Login with 2FA step
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       ├── SettingsModal.tsx # Model selection + 2FA enable/disable
│   │       ├── AddSuiteModal.tsx
│   │       ├── AtomizeModal.tsx
│   │       ├── Toast.tsx
│   │       └── tabs/            # 10 tab components
│   └── ...
├── vercel.json                   # Serverless function config + /api route prefix
└── HANDOVER.md                   # Status ledger for agents
```

---

## 🗺️ Roadmap

- [x] Multi-user authentication (JWT + RBAC + DB-backed rate limiting)
- [x] TOTP 2FA with encrypted secrets + single-use backup codes
- [x] Neon Postgres production deployment (Vercel Serverless)
- [x] OpenRouter multi-model chat
- [x] DB-backed sliding-window rate limiter
- [ ] Webhook integrations (Stripe, PartnerStack, Impact)
- [ ] Scheduled autonomous briefing emails (SendGrid/Resend)
- [ ] Real-time Google Search Console API integration
- [ ] Live Perplexity/ChatGPT citation tracking
- [ ] Docker Compose deployment configuration
- [ ] Progressive Web App (PWA) shell

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>CoreText Executive OS v2.1.0</strong><br/>
  <em>Stop operating. Start compounding.</em>
</p>