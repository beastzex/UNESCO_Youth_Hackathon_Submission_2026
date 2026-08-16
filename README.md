<div align="center">

# V0ICE

### The MIL Immune System

**A citizen immuno-surveillance platform for media and information literacy.**
Report a rumour, cluster it into a strain, synthesize a two-sentence vaccine, broadcast it, watch herd immunity rise.

[![Live demo](https://img.shields.io/badge/live%20demo-voice--beta--five.vercel.app-22C55E?style=flat&logo=vercel&logoColor=white&labelColor=333)](https://voice-beta-five.vercel.app/)
[![YouTube Video Demo](https://img.shields.io/badge/video%20walkthrough-YouTube-FF0000?style=flat&logo=youtube&logoColor=white&labelColor=333)](https://youtu.be/Tzlrb1JIgyo?si=JBEu2I9SuoxrrKx1)
[![Proposal](https://img.shields.io/badge/read-the%20proposal-EF4444?style=flat&logo=markdown&logoColor=white&labelColor=333)](PROPOSAL.md)
[![Docs](https://img.shields.io/badge/docs-11%20documents-8B5CF6?style=flat&logo=readthedocs&logoColor=white&labelColor=333)](docs/README.md)
[![Hackathon](https://img.shields.io/badge/UNESCO-Youth%20Hackathon%202026-3B82F6?style=flat&logo=unesco&logoColor=white&labelColor=333)](https://www.unesco.org/)
[![Setup](https://img.shields.io/badge/setup-zero%20config-EAB308?style=flat&logo=gnubash&logoColor=white&labelColor=333)](docs/11-setup-and-operations.md#-zero-config-mode--what-works-with-no-credentials-at-all)

[![Next.js](https://img.shields.io/badge/Next.js-14.2.7-white?style=flat&logo=nextdotjs&logoColor=white&labelColor=333)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=white&labelColor=333)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5%20strict-3178C6?style=flat&logo=typescript&logoColor=white&labelColor=333)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat&logo=tailwindcss&logoColor=white&labelColor=333)](https://tailwindcss.com)

[![Groq](https://img.shields.io/badge/Groq-gpt--oss--120b-F55036?style=flat&logo=openai&logoColor=white&labelColor=333)](https://console.groq.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%2015-3ECF8E?style=flat&logo=supabase&logoColor=white&labelColor=333)](https://supabase.com)
[![Leaflet](https://img.shields.io/badge/Leaflet-OpenStreetMap-199900?style=flat&logo=leaflet&logoColor=white&labelColor=333)](https://leafletjs.com)
[![Vercel](https://img.shields.io/badge/deployed-Vercel-black?style=flat&logo=vercel&logoColor=white&labelColor=333)](https://vercel.com)

[![Languages](https://img.shields.io/badge/languages-24-8B5CF6?style=flat&labelColor=333)](docs/09-internationalization.md)
[![Roles](https://img.shields.io/badge/civic%20roles-5-3B82F6?style=flat&labelColor=333)](docs/06-routes-and-roles.md)
[![Techniques](https://img.shields.io/badge/manipulation%20techniques-6-EF4444?style=flat&labelColor=333)](docs/03-data-model.md#techniquetype)
[![Strings](https://img.shields.io/badge/translated%20strings-3%2C624-22C55E?style=flat&labelColor=333)](docs/09-internationalization.md)

[Live Platform](https://voice-beta-five.vercel.app/) &nbsp;·&nbsp;
[Video Walkthrough (YouTube)](https://youtu.be/Tzlrb1JIgyo?si=JBEu2I9SuoxrrKx1) &nbsp;·&nbsp;
[Documentation](docs/README.md) &nbsp;·&nbsp;
[Proposal (PDF)](submission/V0ICE_Proposal_UNESCO_Youth_Hackathon_2026.pdf) &nbsp;·&nbsp;
[Quick Start](#quick-start) &nbsp;·&nbsp;
[Architecture](docs/02-architecture.md)

</div>

---

> **"Misinformation spreads like a virus. We built the immune system."**

**Theme —** *Play Your Part: Youth Designing the Future of Media and Information Literacy (MIL)*

Traditional fact-checking is structurally too slow. An article takes 24–72 hours to
publish; a forwarded voice note peaks in the first two hours. V0ICE inverts the model:
instead of correcting after infection, it **inoculates before exposure**, through a
distributed network of citizens rather than a centralized editorial desk.

---

## Try It in 60 Seconds

Walk the full public-health loop in order — every step is a live link. No sign-up, no
configuration; the deployment ships with a seeded outbreak already in progress.

| | Step | Open |
|---|---|---|
| **01** | Report a suspicious claim (click a sample to autofill) | [**/submit**](https://voice-beta-five.vercel.app/submit) |
| **02** | Triage it and watch the AI cluster it into a strain | [**/analyst**](https://voice-beta-five.vercel.app/analyst) |
| **03** | Write the two-sentence plain-language vaccine | [**/vaccine**](https://voice-beta-five.vercel.app/vaccine) |
| **04** | Broadcast it to regions and move the immunity score | [**/distribute**](https://voice-beta-five.vercel.app/distribute) |
| **05** | Watch the outbreak radar respond | [**/map**](https://voice-beta-five.vercel.app/map) |
| — | Browse the verified strain directory | [**/strains**](https://voice-beta-five.vercel.app/strains) |

Press <kbd>Ctrl</kbd> + <kbd>K</kbd> anywhere to open **D0MI**, the embedded AI assistant.

---

## Documentation

Full technical documentation lives in **[`docs/`](docs/README.md)** — eleven
interlinked documents written against the source tree.

| | | |
|---|---|---|
| [Overview & Vision](docs/01-overview.md) | [System Architecture](docs/02-architecture.md) | [Data Model](docs/03-data-model.md) |
| [AI Pipeline](docs/04-ai-pipeline.md) | [API Reference](docs/05-api-reference.md) | [Routes & Roles](docs/06-routes-and-roles.md) |
| [Component Catalog](docs/07-component-catalog.md) | [State Management](docs/08-state-management.md) | [Internationalization](docs/09-internationalization.md) |
| [Design System](docs/10-design-system.md) | [Setup & Operations](docs/11-setup-and-operations.md) | |

**Start here:** [`docs/README.md`](docs/README.md) — index, reading paths, and a
system-at-a-glance diagram.

> **▲ Before deploying** — read
> [Setup & Operations → Database Provisioning](docs/11-setup-and-operations.md#-database-provisioning).
> The Supabase migration requires a primary-key correction, and row-level security must
> be enabled manually.

---

## The 5-Role Public Health Response Loop

```
  01              02               03                04                05
┌────────┐   ┌──────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────┐
│SPOTTER │──▸│ ANALYST  │──▸│VACCINE MAKER │──▸│ FIELD WORKER │──▸│  RADAR   │
└────────┘   └──────────┘   └──────────────┘   └──────────────┘   └──────────┘
 /submit      /analyst          /vaccine          /distribute         /map

 ingest    →  classify     →   synthesize     →   broadcast      →  measure
 raw text     + cluster        2-sentence         per-region        herd
 + region     into strain      pre-bunk           distribution      immunity
```

| Step | Role | Route | Function |
|---|---|---|---|
| **01** | **Spotter** | [`/submit`](https://voice-beta-five.vercel.app/submit) | Citizen frontline intake for unverified screenshots, deepfakes, and audio clips. |
| **02** | **Analyst** | [`/analyst`](https://voice-beta-five.vercel.app/analyst) | Diagnostic verification reviewing AI confidence scores and semantic strain clustering. |
| **03** | **Vaccine Maker** | [`/vaccine`](https://voice-beta-five.vercel.app/vaccine) | Synthesizes concise two-sentence plain-language pre-bunk inoculations. |
| **04** | **Field Worker** | [`/distribute`](https://voice-beta-five.vercel.app/distribute) | Deploys verified explainers to community chat hubs, raising regional herd immunity. |
| **05** | **Surveillance Lead** | [`/map`](https://voice-beta-five.vercel.app/map) | Real-time outbreak radar monitoring infection velocity and containment indices. |

Full walkthrough: [Routes & Roles](docs/06-routes-and-roles.md).

---

## D0MI — Autonomous Platform Assistant

**D0MI** (Digital Operations & Media Intelligence) is mounted globally and powered by
Groq `openai/gpt-oss-120b`, with automatic fallback to `llama-3.3-70b-versatile`.

- **Interactive navigation** — guides citizens through every tool with clickable in-app route pills
- **UNESCO MIL expertise** — the 5 Laws of MIL, Global MIL Week, IPDC, WHO infodemic management
- **Forensic intelligence** — deepfake artifacting, voice cloning, botnet astroturfing, C2PA provenance
- **In-chat language selector** — switch between 24 languages inside the chat window
- **Toggle shortcut** — <kbd>Ctrl</kbd> + <kbd>K</kbd> or <kbd>Cmd</kbd> + <kbd>K</kbd> anywhere on the site

Architecture: [AI Pipeline](docs/04-ai-pipeline.md#-capability-3--d0mi-conversational-assistant).

---

## 24-Language Global Translation Matrix

3,624 translated strings across 24 dictionaries.

**Primary** — English `EN`

**European** — French `FR` · German `DE` · Italian `IT` · Spanish `ES` · Portuguese `PT` ·
Dutch `NL` · Swedish `SV` · Polish `PL` · Greek `EL` · Danish `DA` · Finnish `FI` ·
Czech `CS` · Romanian `RO` · Hungarian `HU` · Russian `RU`

**World** — Hindi `HI` · Mexican Spanish `MX` · Japanese `JA` · Chinese `ZH` ·
Korean `KO` · Brazilian Portuguese `BR` · Swahili `SW` · Arabic `AR`

Details: [Internationalization](docs/09-internationalization.md).

---

## Design System

A brutalist-editorial system: pure monochrome ground, heavy geometric display type,
hairline rules, and five saturated accents used exclusively as functional signals.

| Letter | Hex | Role |
|---|---|---|
| **V** | `#8B5CF6` violet | Spotter — discovery |
| **0** | `#3B82F6` blue | Analyst — diagnostic triage |
| **I** | `#22C55E` green | Vaccine Maker — inoculation |
| **C** | `#EAB308` yellow | Field Worker — regional broadcast |
| **E** | `#EF4444` red | Surveillance Lead — outbreak warning |

The same five colours carry the herd-immunity gauge, so learning the wordmark teaches
the status legend. Full tokens: [Design System](docs/10-design-system.md).

---

## Architecture & Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14.2.7 App Router, React 18.3 |
| Language | TypeScript 5.5.4, `strict: true` |
| Styling | Tailwind CSS 3.4.10, class-based dark mode |
| Inference | Groq via the `openai` SDK — `gpt-oss-120b`, `llama-3.3-70b-versatile` |
| Database | Supabase PostgreSQL — optional; the app runs local-first |
| State | Custom reactive store with `localStorage` persistence and cloud mirroring |
| Icons | Lucide React |
| Deployment | Vercel, Node runtime |

Full module graph and data-flow diagrams: [System Architecture](docs/02-architecture.md).

---

## Quick Start

```bash
git clone <repository-url>
cd UNESCO_Youth_Hackathon_Submission_2026
npm install
npm run dev
```

Open **http://localhost:3000**. Five strains, eight submissions, and three pending
triage items are already loaded — **no environment variables required**.

<details>
<summary><b>Optional — enable live AI and cloud persistence</b></summary>

```bash
cp .env.example .env.local
```

```env
# Groq AI key — https://console.groq.com
GROQ_API_KEY=gsk_...

# Supabase — https://supabase.com  (Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Then provision the database and seed it:

```bash
# 1. run supabase/migrations/001_init.sql in the Supabase SQL editor
# 2. apply the primary-key correction and RLS policies from the docs
# 3. seed
npm run seed
```

Both correction scripts are given in full in
[Setup & Operations → Database Provisioning](docs/11-setup-and-operations.md#-database-provisioning).

**Never prefix `GROQ_API_KEY` with `NEXT_PUBLIC_`** — it would be embedded in the client
bundle.

</details>

| Command | Action |
|---|---|
| `npm run dev` | Development server on `:3000` |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint |
| `npm run seed` | Seed the Supabase database |
| `npx tsc --noEmit` | Type-check |

---

## Herd Immunity Calculation

$$\text{Herd Immunity Score} = \left( \frac{\text{Strains distributed to region}}{\text{Strains active in region}} \right) \times 100$$

| Band | Status | Colour |
|---|---|---|
| **70–100%** | Stable community inoculation | `#22C55E` green |
| **35–69%** | Inoculation in progress | `#EAB308` amber |
| **0–34%** | Critical vector outbreak | `#EF4444` red |

A region with zero active strains scores 100 by definition. Implementation:
[State Management](docs/08-state-management.md#-selector--getregionimmunityscore).

---

## UNESCO Youth Hackathon 2026 Deliverables

- 🌐 **Live Production Deployment**: [voice-beta-five.vercel.app](https://voice-beta-five.vercel.app/)
- 🎥 **Video Walkthrough (YouTube)**: [youtu.be/Tzlrb1JIgyo](https://youtu.be/Tzlrb1JIgyo?si=JBEu2I9SuoxrrKx1)
- 📄 **Proposal Document (PDF)**: [`submission/V0ICE_Proposal_UNESCO_Youth_Hackathon_2026.pdf`](submission/V0ICE_Proposal_UNESCO_Youth_Hackathon_2026.pdf)
- 👁️ **Live Spotter Ingestion**: [`/submit`](https://voice-beta-five.vercel.app/submit)
- 🔬 **Analyst Triage & AI Clustering**: [`/analyst`](https://voice-beta-five.vercel.app/analyst)
- 💉 **Vaccine Lab Synthesis**: [`/vaccine`](https://voice-beta-five.vercel.app/vaccine)
- 🩺 **Regional Deployment Matrix**: [`/distribute`](https://voice-beta-five.vercel.app/distribute)
- 🌐 **Outbreak Radar Telemetry**: [`/map`](https://voice-beta-five.vercel.app/map)
- 📋 **Verified Strain Taxonomy**: [`/strains`](https://voice-beta-five.vercel.app/strains)
- 🤖 **D0MI AI Assistant**: Integrated across all routes (<kbd>Ctrl</kbd> + <kbd>K</kbd>)
- 📚 **Technical Documentation**: [11 Comprehensive Guides](docs/README.md)

---

<div align="center">

**Made with ❤️ for the UNESCO Youth Hackathon 2026**

[Live Platform](https://voice-beta-five.vercel.app/) &nbsp;·&nbsp; [Video Walkthrough](https://youtu.be/Tzlrb1JIgyo?si=JBEu2I9SuoxrrKx1) &nbsp;·&nbsp; [Documentation](docs/README.md)

</div>
