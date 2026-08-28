# CoreText Executive OS — User Guide

> **Version 2.1.0** | For owners, admins, and viewers of the Shareholder Asset Compounding Suite.

---

## Table of Contents

1. [What is CoreText?](#what-is-coretext)
2. [Getting Started](#getting-started)
3. [Dashboard Overview](#dashboard-overview)
4. [Managing Settings](#managing-settings)
5. [AI Co-Director Chat](#ai-co-director-chat)
6. [Content Portfolios](#content-portfolios)
7. [GEO Engine Visibility](#geo-engine-visibility)
8. [Revenue & Monetization](#revenue--monetization)
9. [Competitive Intelligence](#competitive-intelligence)
10. [Hive Mind Cross-Pollination](#hive-mind-cross-pollination)
11. [Two-Factor Authentication (2FA)](#two-factor-authentication-2fa)
12. [User Management (Owner Only)](#user-management-owner-only)
13. [Invitation Codes (Owner Only)](#invitation-codes-owner-only)
14. [Troubleshooting](#troubleshooting)
15. [FAQ](#faq)

---

## What is CoreText?

CoreText Executive OS is an **autonomous content portfolio management system** designed for digital asset owners who manage multiple websites. Rather than logging into separate analytics dashboards, CMS panels, and affiliate networks, CoreText gives you a single command center that:

- Generates **daily morning briefings** per asset
- Executes low-level optimizations **autonomously** (broken links, stale statistics, meta refreshes)
- **Predicts content decay** 14–30 days before rankings drop
- **Tracks citation share** across ChatGPT Search, Perplexity Pro, and Claude
- **Compounds revenue** per article with actionable monetization recommendations
- Lets you **chat with an AI Co-Director** that knows every asset's Layer 3 memory context

### The Shareholder Mental Model

| Your Role | What you do |
|-----------|-------------|
| **Shareholder** | Set strategy. Review briefings. Approve major decisions. |
| **CoreText OS** | Executes daily optimizations autonomously. Notifies you on results. |

---

## Getting Started

### Signing In

1. Navigate to your CoreText deployment URL.
2. Enter your **email** and **password**.
3. If you have **2FA enabled** on your account, you'll be prompted for a 6-digit code from your authenticator app (or a backup code).
4. Upon successful login, you'll land on the **Dashboard**.

> **First time?** If you're the owner (`fxinfo24@gmail.com` by default), your password was set via `OWNER_PASSWORD` environment variable by your deployment administrator. If you're an admin or viewer, you'll need an **invite code** (see Owner) or an admin to create your account.

### Resetting Your Password

Password reset is not yet self-service. Contact your owner to update your password via **User Management** in the header.

---

## Dashboard Overview

The dashboard is organized into two main areas:

### Sidebar (Left Navigation)

The sidebar contains all major modules. Click any item to switch tabs:

| Icon | Module | Description |
|------|--------|-------------|
| 📊 | Dashboard | Main landing page (morning brief overview) |
| 🌅 | Morning Briefing | Per-site overnight executive summary |
| 🧠 | Nervous System | 3-layer site health + AI/algorithm visibility |
| 🔀 | Decisions Queue | 4-tier autonomous/human decisions |
| 📦 | Content Portfolios | Multi-dimensional content scoring + Atomization Studio |
| 🌐 | GEO Visibility | Citation share across AI engines |
| 🛡️ | Decay Shield | Preemptive decay predictions + refresh briefs |
| 💰 | Monetization | Revenue per article, RPM, affiliate gaps |
| 🏟️ | Competitors | Competitor monitoring + trend interception |
| 🐝 | Hive Mind | Cross-portfolio strategy transfers |
| 💬 | Co-Director | AI strategic chat with full memory access |
| ⚙️ | Settings | API keys, model selection, 2FA |

### Header (Top Bar)

- **Site switcher** — select which Shareholder Suite you're viewing
- **Compounding metrics** — live revenue, growth, asset value
- **Users / Invitations** — (owner only) manage accounts and invite codes
- **Profile** — view your role and account details

---

## Managing Settings

Open **Settings** (⚙️ icon in sidebar) to configure:

### API Keys & Model

CoreText uses a three-provider AI cascade: **OpenRouter → OpenAI → Anthropic → template fallback**.

| Field | Purpose |
|-------|---------|
| **OpenRouter API Key** | **Preferred.** One key gives access to 100+ models. Routes to the selected model below. |
| **OpenAI API Key** | Fallback if OpenRouter is not configured. |
| **Anthropic API Key** | Second fallback. |
| **Active LLM Model** | Any OpenRouter model slug (e.g. `nvidia/nemotron-3-ultra-550b-a55b:free`). Preset dropdown with common options. |

> CoreText works without any API key — all briefings, portfolios, decay shields, GEO audits, and revenue data use deterministic logic. AI keys unlock enhanced chat quality and content atomization.

### Shareholder Director Name & Asset Compounding Posture

These personalize your AI Co-Director's tone and strategy:

- **Director Name** — How the AI addresses you (default: "Alexander Vance")
- **Posture** — Choose your compounding philosophy:
  - *Aggressive Compounder* (maximize asset valuation alpha)
  - *Stable Dividend Fiduciary* (maximize net monthly margin)
  - *Topical Moat Defender* (strict authority dominance)

### Two-Factor Authentication (2FA)

See the [dedicated 2FA section](#two-factor-authentication-2fa) below.

---

## AI Co-Director Chat

The Co-Director is a context-aware strategic AI assistant that has full access to each site's **Layer 3 memory** — including your posture, audience, tone calibration, and monetization rules.

### Using Chat

1. Select a site from the dropdown in the header.
2. Open the **Co-Director** tab in the sidebar.
3. Type your directive or question.

**Example prompts:**
- *"Analyze our content gaps against Bankrate's Wealth section."*
- *"Generate a 5-article structural brief for the AI Direct Indexing cluster."*
- *"What's the revenue opportunity in the High-Yield Cash Vaults pillar?"*
- *"Deploy an autonomous T1 fix for the 14 broken links in our tax calculator pages."*

### Error Handling

If the LLM fails (provider down, key expired, rate limit hit), the chat shows a clear error message:

> *"Co-Director Offline — LLM Call Failed. A model key was configured but the provider returned no response. Check the server logs for details — common causes: invalid/revoked key, model ID not available on your tier, or rate limit."*

API keys are **redacted** from any error messages shown in the UI.

---

## Content Portfolios

The Content Portfolio Optimizer scores potential articles across five dimensions:

| Score | What it measures | Range |
|-------|-----------------|-------|
| **Demand Score** | Search volume and user intent | 0–100 |
| **GEO Score** | Likelihood of AI engine citation | 0–100 |
| **Monetization Score** | Revenue potential per article | 0–100 |
| **Competitive Gap Score** | How much opportunity is undefended | 0–100 |
| **Authority Fit** | How well it matches your site's topical authority | 0–100 |

An **Opportunity Score** (0–100) rolls these up. Portfolios with the highest scores should ship first.

### Atomization Studio

Once a portfolio is "Ready for Atomized Deployment", you can click **Atomize** to instantly generate:

- Google SGE / AI Overview optimized snippet
- Perplexity deep-answer citation block
- Newsletter deep-dive draft
- LinkedIn carousel hooks
- Twitter/X thread
- Podcast outline / YouTube script

---

## GEO Engine Visibility

CoreText tracks your citation share across three generative AI engines:

| Engine | What it measures |
|--------|-----------------|
| **ChatGPT Search** | % share of AI answer citations in your niche |
| **Perplexity Pro** | Frequency and depth of citation in Pro answers |
| **Claude** | Share of conceptual / framework-level citations |

### AI Answer Baits

Create structured content blocks specifically designed to get picked up by AI engines. These are short, highly structured answer blocks optimized for extraction.

### Citability Audits

Audits flag articles where AI engines are likely skipping your content (missing structured data, weak lead paragraphs, ambiguous citations) and suggest specific remediation.

---

## Revenue & Monetization

The monetization module gives you a complete revenue picture per article:

- **Per-article RPM** (revenue per 1,000 visits)
- **Attribution** — which pages drive what revenue
- **Untapped Affiliate Gaps** — opportunities you're leaving on the table
- **Digital Product Creation Opportunities** — medium-to-high value recommendations
- **Monetization Radar** — live affiliate program updates matched to your niches

### Click-to-Benefit (CTB) Actions

When you see a CTB button (purple action pill), clicking it will immediately trigger the recommended action — e.g. capturing an affiliate gap, deploying a trend intercept brief, or transferring a winning strategy.

---

## Competitive Intelligence

Monitor competitors by site, with:

- **Publishing velocity** (articles/week)
- **Threat level** (Moderate / High Alignment / High Authority / Massive Volume)
- **Topic overlap** percentage
- **Open gaps** — specific weaknesses you can exploit

### Trend Interception

When CoreText detects a viral trend relevant to your niche (from X/Twitter, Reddit, HackerNews, or GitHub), it generates a **Fast Response Brief** with:

- Urgency window & demand spike percentage
- Recommended title and structure
- CTB button to deploy the brief immediately

---

## Hive Mind Cross-Pollination

Winning strategies from one of your sites are automatically surfaced for adaptation to other sites. Each hive learning includes:

- **Origin site** — where the strategy worked
- **Target site** — where it could work next
- **Learning summary** — what was proven
- **Adaptation plan** — how to replicate it
- **Projected lift** — expected impact

---

## Two-Factor Authentication (2FA)

> **Prerequisite:** Your deployment administrator must have set `FERNET_KEY` in the environment. Without it, 2FA setup returns a 503 error.

### Enabling 2FA

1. Open **Settings** → **Two-Factor Authentication** section.
2. Click **"Enable Two-Factor Authentication"**.
3. A QR code appears on screen. **Scan it** with your authenticator app:
   - Google Authenticator (iOS/Android)
   - 1Password
   - Authy
   - Any TOTP-compatible app
4. The **manual key** is shown below the QR if you can't scan it.
5. Enter the 6-digit code from your authenticator app.
6. Click **"Confirm & Enable 2FA"**.

### ⚠️ Save Your Backup Codes

After enabling, **10 one-time backup/recovery codes** appear on screen. These are the **only way** to regain access if you lose your authenticator app.

- **SAVE THEM NOW** — they are shown only once.
- Click **"Copy all"** and store them in a password manager.
- Click **"I saved them — done"** to proceed.
- Each code is **single-use** — after one is used, it cannot be reused.
- Check remaining codes anytime via **Settings** → (badge shows count under "✓ Enabled").

### Using a Backup Code to Log In

If you don't have your authenticator app:

1. Enter your email and password as usual.
2. When prompted for a 6-digit code, type one of your saved backup codes instead.
3. The code is consumed on use. Next time you'll use a different one.

### Regenerating Backup Codes

In **Settings** (while 2FA is enabled), click **"New recovery codes"**. The old batch is immediately invalidated. Save the new codes.

### Disabling 2FA

In **Settings**, click **"Disable"** under the 2FA section. Your TOTP secret and all backup codes are permanently removed.

---

## User Management (Owner Only)

The owner can manage all user accounts (admin/viewer) via the **Users** button in the header.

### Creating Users

1. Click **Users** → **"Create User"**.
2. Enter email, full name, and assign a role (`admin` or `viewer`).
3. Set a temporary password.
4. The new user can sign in immediately.

### Editing Users

Click a user in the list to edit:
- **Role changes** — promote or demote
- **Password reset** — set a new password
- **Deactivation** — deactivate without deleting

> The **pinned owner** (`fxinfo24@gmail.com` by default) cannot be demoted or deleted.

### Deleting Users

Delete a user account permanently. You cannot delete the pinned owner or yourself.

---

## Invitation Codes (Owner Only)

For self-registration, owners can generate **single-use invite codes**.

1. Click **Invitations** in the header.
2. Specify count (how many codes) and role (viewer by default).
3. Copy the generated codes and distribute them.
4. Each code can be used exactly once. An invite can also be revoked.

Invite codes are useful for:
- Granting vendor/contractor access with a limited role
- Allowing self-signup without manual account creation
- Temporary access

---

## Troubleshooting

### Login Issues

| Symptom | Likely Cause | What To Do |
|---------|-------------|------------|
| 500 error on login | DB missing 2FA columns (post-upgrade) | Admin should redeploy (auto-migrates now). |
| 429 on login | Too many attempts | Wait 5 minutes and try again. |
| "Invalid two-factor code" | Wrong TOTP code or expired | Try a fresh code from your authenticator app. |
| "Account state changed" | 2FA disabled between login steps | Sign in again from scratch. |

### 2FA Setup Returns 503

`FERNET_KEY` is not configured. Contact your deployment administrator to set it.

### Chat Returns "LLM Call Failed"

| Message | Cause |
|---------|-------|
| "Invalid/revoked key" | API key is wrong or was rotated. Check Settings. |
| "Model not available on your tier" | The selected model requires a paid OpenRouter tier. Try `gpt-4o-mini` or another free model. |
| "Rate limit (free tier: 20 RPM)" | You hit OpenRouter's free-tier throttle. Wait ~1 minute. |
| "Provider returned no response" | Provider-side outage. Try again later. |

### Dashboard Stuck at "Loading Executive Briefing…"

- Check that your backend is running and reachable.
- Check your browser console for API errors.
- If you just enabled 2FA and the page reloaded, wait for the token refresh.

---

## FAQ

**Q: Is my TOTP secret visible in the database?**

No. It is **encrypted at rest** using Fernet (`FERNET_KEY`). Even with direct DB access, an attacker cannot recover the secret.

**Q: What if I lose my phone AND all my backup codes?**

Contact the deployment administrator. They can disable 2FA from the database (clearing `totp_enabled` and `totp_secret` on your user row) so you can log in with password only and re-enable 2FA.

**Q: Can I have 2FA on an admin or viewer account?**

Yes. Each user manages 2FA independently via **Settings**. It's recommended for any account with login access.

**Q: How do I know how many backup codes I have left?**

Open **Settings** — under "Two-Factor Authentication", the enabled badge shows `N unused recovery codes remaining`.

**Q: What models can I use with OpenRouter?**

Any model available at [openrouter.ai/models](https://openrouter.ai/models). Some popular free models: `gpt-4o-mini`, `claude-3.5-haiku`, `nvidia/nemotron-3-ultra-550b-a55b:free`, `meta-llama/llama-3.1-70b-instruct`.

**Q: What happens if I set multiple API keys?**

CoreText cascades: OpenRouter → OpenAI → Anthropic → template. If OpenRouter fails, it tries the next provider.

**Q: Can I add my own websites (Shareholder Suites)?**

Yes. If you're the owner, click **"Add Suite"** from the dashboard. You'll need to provide the site's name, niche, URL, and estimated asset/revenue values.

**Q: Does CoreText support Google Search Console integration?**

Not yet (roadmap). Currently crawl budget metrics are based on predictive modeling, not live GSC data.

---

<p align="center">
  <strong>CoreText Executive OS v2.1.0</strong><br/>
  <em>Stop operating. Start compounding.</em>
</p>