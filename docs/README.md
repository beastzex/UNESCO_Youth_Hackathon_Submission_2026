# V0ICE — Documentation

**The MIL Immune System** · UNESCO Youth Hackathon 2026
*Play Your Part: Youth Designing the Future of Media and Information Literacy*

> Misinformation spreads like a virus. We built the immune system.

**◈ Live platform — [voice-beta-five.vercel.app](https://voice-beta-five.vercel.app/)**
No configuration required; the deployment runs the seeded corpus described in
[Data Model](03-data-model.md#-seed-corpora).

This is the documentation root. Every document below was written by reading the
source tree directly, so specifications here describe **what the code does**, not
only what it aims to do. Where the implementation diverges from what the project's
own README or interface claims, the divergence is marked `▲` in place.

---

## ◈ Documentation Map

| # | Document | Covers |
|---|---|---|
| 01 | [Overview & Vision](01-overview.md) | Problem statement, epidemiological model, the 5-role protocol |
| 02 | [System Architecture](02-architecture.md) | Layers, render model, data flow, module graph |
| 03 | [Data Model](03-data-model.md) | Types, Postgres schema, seed corpora, region definitions |
| 04 | [AI Pipeline](04-ai-pipeline.md) | Groq inference, classification, strain matching, heuristic fallback, D0MI |
| 05 | [API Reference](05-api-reference.md) | The three route handlers, contracts, error semantics |
| 06 | [Routes & Roles](06-routes-and-roles.md) | Every page, every role, end-to-end user journeys |
| 07 | [Component Catalog](07-component-catalog.md) | All 18 components, wired vs. orphaned, props |
| 08 | [State Management](08-state-management.md) | The store hook, three React contexts, persistence keys |
| 09 | [Internationalization](09-internationalization.md) | 24 languages, 151 keys, lookup chain, encoding audit |
| 10 | [Design System](10-design-system.md) | Palette, typography, theming, motion, Tailwind config |
| 11 | [Setup & Operations](11-setup-and-operations.md) | Install, env, database provisioning, seeding, build, deploy |

---

## ◈ Reading Paths

**▸ Evaluating in 5 minutes, hands-on**
Open the [live site](https://voice-beta-five.vercel.app/) and walk
[the end-to-end journey](06-routes-and-roles.md#-end-to-end-journey) — submit, triage,
synthesize, broadcast, observe.

**▸ New contributor, 15 minutes**
[Overview](01-overview.md) → [Architecture](02-architecture.md) → [Setup](11-setup-and-operations.md)

**▸ Evaluating the submission**
[Overview](01-overview.md) → [Routes & Roles](06-routes-and-roles.md) → [AI Pipeline](04-ai-pipeline.md)

**▸ Extending the platform**
[Architecture](02-architecture.md) → [Data Model](03-data-model.md) → [State Management](08-state-management.md) → [Component Catalog](07-component-catalog.md)

**▸ Deploying to production**
[Setup & Operations](11-setup-and-operations.md) → [Architecture](02-architecture.md)

---

## ◈ System at a Glance

```
                        ┌──────────────────────────────────────────┐
                        │  Next.js 14 App Router · React 18 · TS   │
                        └──────────────────────────────────────────┘
                                          │
        ┌─────────────────┬───────────────┼───────────────┬─────────────────┐
        ▼                 ▼               ▼               ▼                 ▼
   ┌─────────┐      ┌──────────┐    ┌──────────┐    ┌───────────┐    ┌──────────┐
   │ SPOTTER │  →   │ ANALYST  │ →  │ VACCINE  │ →  │  FIELD    │ →  │  RADAR   │
   │ /submit │      │ /analyst │    │ /vaccine │    │/distribute│    │  /map    │
   └─────────┘      └──────────┘    └──────────┘    └───────────┘    └──────────┘
        │                 │               │               │                 │
        └─────────────────┴───────────────┴───────────────┴─────────────────┘
                                          │
                          ┌───────────────▼───────────────┐
                          │  useVoisStore()  lib/store.ts │
                          │  local-first reactive store   │
                          └───────────────┬───────────────┘
                            ┌─────────────┴─────────────┐
                            ▼                           ▼
                     ┌─────────────┐           ┌────────────────┐
                     │ localStorage│           │ Supabase (PG)  │
                     │  (primary)  │           │  (optional)    │
                     └─────────────┘           └────────────────┘

                          ┌───────────────────────────────┐
                          │  Groq · openai/gpt-oss-120b   │
                          │  classify · match · D0MI chat │
                          └───────────────────────────────┘
```

---

## ◈ Live Deployment

**https://voice-beta-five.vercel.app/** — Vercel, Node runtime, App Router.

| Route | Live URL | Role |
|---|---|---|
| `/` | [voice-beta-five.vercel.app](https://voice-beta-five.vercel.app/) | Landing — 7 scenes |
| `/submit` | [/submit](https://voice-beta-five.vercel.app/submit) | 01 · Spotter |
| `/analyst` | [/analyst](https://voice-beta-five.vercel.app/analyst) | 02 · Analyst |
| `/vaccine` | [/vaccine](https://voice-beta-five.vercel.app/vaccine) | 03 · Vaccine Maker |
| `/distribute` | [/distribute](https://voice-beta-five.vercel.app/distribute) | 04 · Field Health Worker |
| `/map` | [/map](https://voice-beta-five.vercel.app/map) | 05 · Surveillance Lead |
| `/strains` | [/strains](https://voice-beta-five.vercel.app/strains) | Public strain directory |

D0MI is available on every route via <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>K</kbd>.

State is per-browser (`localStorage`), so anything you submit on the live site is
yours alone and resets when you clear site data. Full behaviour:
[State Management](08-state-management.md).

▲ Before treating the deployment as production, review
[Setup & Operations](11-setup-and-operations.md#pre-deploy-checklist) — the inference
endpoints are unauthenticated and the Supabase migration ships without row-level
security.

---

## ◈ Fast Facts

| Property | Value |
|---|---|
| Live deployment | [voice-beta-five.vercel.app](https://voice-beta-five.vercel.app/) |
| Package name | `outbreak-mil-immune-system` |
| Framework | Next.js `14.2.7` (App Router) |
| Language | TypeScript `5.5.4`, `strict: true` |
| React | `18.3.1` |
| Styling | Tailwind CSS `3.4.10`, class-based dark mode |
| Inference | Groq via `openai` SDK `4.58.1` |
| Database | Supabase `2.45.4` (PostgreSQL) — optional at runtime |
| Tracked source files | 55 (excluding lockfile) |
| Total source lines | ~12,000 |
| Public routes | 9 (7 static, 1 dynamic, 3 API) |
| Languages supported | 24 × 151 keys = 3,624 strings |
| Runtime-required env vars | 0 — the app boots with no configuration |

---

## ◈ Icon Legend

Plain geometric glyphs, used consistently across all documents. No emoji anywhere in
this documentation set — anything that looks like one inside a fenced code block is
verbatim source or program output.

**Status markers**

| Icon | Meaning |
|---|---|
| `●` | Implemented and wired into a live route |
| `○` | Present in the tree but not imported by anything |
| `◐` | Partially implemented — works, but not as specified |
| `▲` | Verified divergence between the written spec and the code |
| `×` | Absent / not supported |
| `▸` | Navigation or sequence step |
| `→` | Data flow or transition |

**Document markers**

| Icon | Document |
|---|---|
| `◈` | Index, overview |
| `▤` | Architecture |
| `▦` | Data model |
| `◉` | AI pipeline |
| `⇄` | API reference |
| `▸` | Routes and roles |
| `▧` | Component catalog |
| `⊙` | State management |
| `⊕` | Internationalization |
| `◐` | Design system |
| `▣` | Setup and operations |

---

*© 2026 V0ICE Initiative · Open Citizen Surveillance Protocol*
[voice-beta-five.vercel.app](https://voice-beta-five.vercel.app/) · [Repository README](../README.md)
