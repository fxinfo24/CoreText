<p align="center">
  <img src="https://img.shields.io/badge/CoreText-Executive_OS-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQyIDAtOC0zLjU4LTgtOHMzLjU4LTggOC04IDggMy41OCA4IDgtMy41OCA4LTggOHoiLz48L3N2Zz4=&labelColor=0f172a" alt="CoreText Executive OS" />
  <img src="https://img.shields.io/badge/version-2.0.0-10b981?style=for-the-badge&labelColor=0f172a" alt="Version" />
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
|---|---|
| **Shareholder** (You) | Set strategy. Review briefings. Approve Tier 3/4 decisions. |
| **CoreText Executive OS** | Executes Tier 1/2 autonomously. Predicts decay. Intercepts trends. Compounds revenue. |

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
|---|---|---|
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
Context-aware strategic dialogue powered by OpenAI GPT-4o and Anthropic Claude, with full Layer 3 memory access for every asset in your portfolio.

### ➕ Dynamic Suite Management
Add and remove Shareholder Suites on the fly via the UI — no database resets, no code changes. Scale from 1 to unlimited portfolio assets dynamically.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                  FRONTEND (React 18)            │
│  Vite · TypeScript · Tailwind CSS · Recharts    │
│  Lucide Icons · Axios                           │
│  Port: 3000                                     │
├─────────────────────────────────────────────────┤
│                   REST API                      │
├─────────────────────────────────────────────────┤
│                BACKEND (FastAPI)                │
│  Python 3.11+ · SQLAlchemy ORM · Pydantic v2    │
│  OpenAI SDK · Anthropic SDK                     │
│  Port: 8000                                     │
├─────────────────────────────────────────────────┤
│              PERSISTENCE (SQLite)               │
│  coretext.db — zero-config local database       │
└─────────────────────────────────────────────────┘
```

### Backend (`backend/`)

| File | Purpose |
|---|---|
| `app/main.py` | FastAPI application with CORS and router registration |
| `app/models.py` | SQLAlchemy ORM models (16 tables) |
| `app/schemas.py` | Pydantic validation schemas |
| `app/ai_engine.py` | OpenAI + Anthropic integration with autonomous fallbacks |
| `app/init_db.py` | Database seeding with production-grade demo data |
| `app/database.py` | SQLite engine and session management |
| `app/routers/` | Modular API routers (sites, briefing, chat, etc.) |

### Frontend (`frontend/`)

| File | Purpose |
|---|---|
| `src/App.tsx` | Root application with state management and tab routing |
| `src/api.ts` | Typed Axios API client |
| `src/types.ts` | Full TypeScript interface definitions |
| `src/components/Header.tsx` | Executive dashboard header with live stats |
| `src/components/Sidebar.tsx` | Navigation module switcher |
| `src/components/AddSuiteModal.tsx` | Dynamic suite creation modal |
| `src/components/tabs/` | 10 specialized tab components |

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+** with `pip`
- **Node.js 18+** with `npm`

### 1. Clone & Install

```bash
git clone https://github.com/fxinfo24/CoreText.git
cd CoreText
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

Backend starts at **http://localhost:8000** — verify with `curl http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at **http://localhost:3000** — open in browser.

### 4. One-Command Launch (macOS/Linux)

```bash
chmod +x run_coretext.sh
./run_coretext.sh
```

---

## ⚙️ Configuration

### AI Engine API Keys

Open **Settings** (⚙️ icon in header) to configure:

| Provider | Models Used | Purpose |
|---|---|---|
| **OpenAI** | `gpt-4o` | Content atomization, chat, strategic analysis |
| **Anthropic** | `claude-3-5-sonnet` | Fallback AI engine, deep reasoning tasks |

> **Note:** CoreText works fully without API keys — all core features (briefings, portfolios, decay shields, GEO audits) operate on deterministic logic. AI keys unlock enhanced chat and atomization quality.

---

## 📡 API Reference

All endpoints are prefixed with `/api/`. Full interactive docs at **http://localhost:8000/docs** (Swagger UI).

### Sites & Suites

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/sites` | List all shareholder suites |
| `GET` | `/api/sites/{id}` | Get single suite |
| `POST` | `/api/sites` | **Create new suite** (dynamic) |
| `DELETE` | `/api/sites/{id}` | **Decommission suite** (cascade) |

### Intelligence Modules

| Method | Endpoint | Description |
|---|---|---|
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
| `GET` | `/api/competitors/{site_id}` | Competitive intel |
| `GET` | `/api/hive` | Hive mind learnings |
| `POST` | `/api/chat` | AI Co-Director chat |

---

## 🗂️ Project Structure

```
CoreText/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry
│   │   ├── models.py            # 16 SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── database.py          # DB engine config
│   │   ├── ai_engine.py         # AI integration layer
│   │   ├── init_db.py           # Seed data
│   │   └── routers/             # 11 modular API routers
│   ├── requirements.txt
│   ├── run.py
│   └── coretext.db
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── components/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       ├── AddSuiteModal.tsx
│   │       ├── SettingsModal.tsx
│   │       ├── AtomizeModal.tsx
│   │       ├── Toast.tsx
│   │       └── tabs/             # 10 tab components
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── run_coretext.sh
├── .gitignore
└── README.md
```

---

## 🔐 Security Notes

- API keys are stored locally in SQLite — never committed to version control
- CORS is configured for local development (`*`) — restrict for production
- No authentication layer by default — add JWT/OAuth for deployment
- All AI calls use official SDKs with proper error handling

---

## 🗺️ Roadmap

- [ ] Multi-user authentication (JWT + role-based access)
- [ ] PostgreSQL migration for production workloads
- [ ] Webhook integrations (Stripe, PartnerStack, Impact)
- [ ] Scheduled autonomous briefing emails (SendGrid/Resend)
- [ ] Real-time Google Search Console API integration
- [ ] Live Perplexity/ChatGPT citation tracking
- [ ] Docker Compose deployment configuration
- [ ] Mobile-responsive PWA shell

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>CoreText Executive OS v2.0.0</strong><br/>
  <em>Stop operating. Start compounding.</em>
</p>
