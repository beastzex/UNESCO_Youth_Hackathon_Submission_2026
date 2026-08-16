▤ **System Architecture**
[Docs Home](README.md) · [← 01 Overview](01-overview.md) · **02** · [03 Data Model →](03-data-model.md)

---

# ▤ System Architecture

**One Next.js app, zero required configuration, and one deliberate decision that shapes everything: the API key never touches the browser.**

## Layer Model

V0ICE is a single Next.js 14 App Router application. There is no separate backend
service — the three API route handlers run inside the same deployment and exist only
to keep the Groq API key off the client.

```
┌───────────────────────────────────────────────────────────────────────┐
│ PRESENTATION                                                          │
│ app/*/page.tsx · components/*.tsx                                     │
│ All role consoles are "use client". No Server Components below layout.│
├───────────────────────────────────────────────────────────────────────┤
│ STATE & CONTEXT                                                       │
│ lib/store.ts (useVoisStore)  ·  context/{Language,Role,Theme}Context  │
│ React state + localStorage. No Redux, no Zustand, no server actions.  │
├───────────────────────────────────────────────────────────────────────┤
│ DOMAIN LOGIC                                                          │
│ lib/groq.ts — classification, strain matching, heuristic fallbacks    │
│ lib/store.ts — clustering rules, immunity arithmetic                  │
├───────────────────────────────────────────────────────────────────────┤
│ SERVER BOUNDARY                                                       │
│ app/api/classify · app/api/match-strain · app/api/domi                │
│ Node runtime. Only place process.env.GROQ_API_KEY resolves.           │
├───────────────────────────────────────────────────────────────────────┤
│ PERSISTENCE                                                           │
│ localStorage (authoritative)  ·  Supabase PostgreSQL (mirror)         │
└───────────────────────────────────────────────────────────────────────┘
```

---

## ▸ Render Model

```
app/layout.tsx                       ← the only Server Component
  └─ <html class="dark ...fonts">
       └─ <body>
            └─ ThemeProvider          "use client"
                 └─ LanguageProvider  "use client"
                      └─ RoleProvider "use client"
                           ├─ <VoisNavbar />    fixed, z-40
                           ├─ <main>{children}</main>
                           ├─ <DomiChat />      fixed, z-50, global Ctrl+K
                           └─ <VoisFooter />
```

Provider nesting order matters: `VoisNavbar` consumes all three contexts, `DomiChat`
consumes Language and Theme, `VoisFooter` consumes Language. Fonts are loaded through
`next/font/google` and exposed as the CSS variables `--font-manrope` and
`--font-cormorant`.

Source: [`app/layout.tsx`](../app/layout.tsx)

▲ The `<html>` element hardcodes `className="dark"` and `<body>` hardcodes
`bg-black text-white`. `ThemeProvider` corrects this on mount, so a light-mode user
sees a dark flash on first paint. See [Design System](10-design-system.md#-theme-flash).

---

## ▸ Module Dependency Graph

Solid arrows are live imports. `○` marks modules present in the tree that nothing
imports.

```
app/layout.tsx
  ├──▸ context/ThemeContext.tsx
  ├──▸ context/LanguageContext.tsx ──────┐
  ├──▸ context/RoleContext.tsx           │
  ├──▸ components/VoisNavbar.tsx ────────┤ (all three contexts)
  ├──▸ components/VoisFooter.tsx ────────┤
  └──▸ components/DomiChat.tsx ──────────┘
             └──▸ POST /api/domi ──▸ openai SDK ──▸ api.groq.com

app/page.tsx  (landing, 7 scenes)
  ├──▸ lib/store.ts
  ├──▸ context/RoleContext.tsx
  ├──▸ context/LanguageContext.tsx
  ├──▸ components/LeafletMap.tsx
  └──▸ components/MaskedHeroType.tsx ──▸ context/ThemeContext.tsx

app/submit/page.tsx    ──▸ lib/store.ts, lib/groq.ts (types), context/RoleContext
app/analyst/page.tsx   ──▸ lib/store.ts, lib/seed-data.ts (types), context/RoleContext
app/vaccine/page.tsx   ──▸ lib/store.ts, lib/seed-data.ts (types), context/RoleContext
app/distribute/page.tsx──▸ lib/store.ts, context/RoleContext
app/strains/page.tsx   ──▸ lib/store.ts, lib/seed-data.ts (types), context/RoleContext
app/map/page.tsx       ──▸ lib/store.ts, components/LeafletMap.tsx, context/RoleContext
app/works/page.tsx     ──▸ lib/nothin-data.ts
app/works/[slug]/page  ──▸ lib/nothin-data.ts

lib/store.ts
  ├──▸ lib/seed-data.ts      (types + INITIAL_STRAINS + INITIAL_SUBMISSIONS + DEMO_REGIONS)
  ├──▸ lib/groq.ts           (classifySubmission, isSameStrain)
  └──▸ lib/supabase.ts       (supabase client, isSupabaseConfigured)

app/api/classify/route.ts     ──▸ lib/groq.ts
app/api/match-strain/route.ts ──▸ lib/groq.ts
scripts/seed.ts               ──▸ lib/seed-data.ts  (Node, raw fetch to PostgREST)

○ components/MapWrapper.tsx   ──▸ components/MapComponent.tsx
○ components/MapComponent.tsx ──▸ lib/regions.ts, types/index.ts, components/Badge.tsx
○ components/StatsHeader.tsx  ──▸ types/index.ts
○ components/FluidGlass.tsx   ──▸ three, @react-three/fiber, @react-three/drei, maath
○ components/TactileObjectLayer.tsx
○ components/KineticMarquee.tsx
○ components/ManifestoVideoBlock.tsx
○ components/NothinNavbar.tsx · components/NothinFooter.tsx
○ components/Footer.tsx       (legacy "OUTBREAK" footer)
○ components/Navbar.tsx       (2-line re-export of VoisNavbar)
○ components/FluidGlassHero.tsx (1-line re-export of MaskedHeroType)
○ lib/initial-data.ts         (second, unused seed corpus)
```

Consequences worth knowing:

- `lib/regions.ts`, `components/Badge.tsx`, and `types/index.ts` are reachable **only**
  through the orphaned `MapComponent`. The live application's type surface comes from
  [`lib/seed-data.ts`](../lib/seed-data.ts), not [`types/index.ts`](../types/index.ts).
- `three`, `@react-three/fiber`, `@react-three/drei`, `maath`, `leaflet`,
  `react-leaflet`, and `clsx`/`tailwind-merge` are declared dependencies with no live
  import path. See [Setup & Operations](11-setup-and-operations.md#-dependency-inventory).

---

## ▸ The Write Path

Every state mutation follows the same optimistic shape. `addSubmission` is the fullest
example:

```
Spotter fills form
        │
        ▼
addSubmission({ content_text, region, language, image_url })   lib/store.ts
        │
        ├─▸ await classifySubmission(text)              lib/groq.ts
        │      ├─ key present? ─▸ Groq gpt-oss-120b, JSON mode ─▸ parsed result
        │      └─ else / on throw ─▸ keyword heuristic engine ─▸ result
        │
        ├─▸ build Submission { id: `sub-${Date.now()}`, status: "pending_review", …ai_* }
        │
        ├─▸ saveState(strains, [newSub, ...submissions])
        │      ├─ setStrains / setSubmissions        ← UI updates here, synchronously
        │      └─ localStorage.setItem(×2)           ← durable here
        │
        └─▸ if (isSupabaseConfigured)
               supabase.from("submissions").insert({...}).then(({error}) => console.warn)
                                                          └── fire-and-forget, never awaited
```

The UI never waits on the network for persistence. Supabase failures surface only in
the console — which is why the primary-key type mismatch documented in
[Data Model](03-data-model.md#-two-defects-in-this-migration)
is silent in normal use.

---

## ▸ The Read Path

```
Component mounts
        │
        ▼
useVoisStore()  →  useState(INITIAL_STRAINS / INITIAL_SUBMISSIONS)   ← immediate, SSR-safe
        │
        ▼ useEffect on mount
   localStorage has vois_strains_v1 / vois_submissions_v1 ?
        ├─ yes ─▸ hydrate from cache
        └─ no  ─▸ write the seed corpus into localStorage
        │
        ▼ isSupabaseConfigured ?
        └─ yes ─▸ fetchCloudData()
                    ├─ select * from strains        (desc by created_at)
                    ├─ select * from vaccine_content
                    ├─ select * from submissions    (desc by created_at)
                    ├─ join vaccines onto strains by strain_id (Map lookup)
                    └─ if rows returned: setState + overwrite localStorage
```

Cloud data wins when present and non-empty. An empty table is treated as "no cloud
data" and leaves the local cache intact — so a provisioned-but-unseeded database
never blanks the demo.

Every store instance is independent. `useVoisStore()` is a plain hook, not a shared
singleton: two components calling it hold two separate copies of state. In practice
each route mounts one consumer, so this is invisible — but it is a real constraint on
future composition. See [State Management](08-state-management.md#-scope-and-isolation).

---

## ▸ The Inference Path — and the One Fact That Explains Everything

Two distinct topologies, and the difference is the single most important architectural
fact in the system.

**D0MI — server-mediated, always live**

```
DomiChat.tsx  ──fetch POST /api/domi──▸  route handler (Node)
                                             │ process.env.GROQ_API_KEY  ✓ resolves
                                             ▼
                                     openai/gpt-oss-120b
                                             │ on 429 ─▸ llama-3.3-70b-versatile
                                             ▼
                                     { role, content } ──▸ RichMarkdownRenderer
```

**Classification & matching — client-direct, key-starved**

```
submit/analyst page ──▸ useVoisStore ──▸ lib/groq.ts (runs in the browser)
                                             │ process.env.GROQ_API_KEY → undefined
                                             │ localStorage VOIS_GROQ_API_KEY → null
                                             ▼
                                     heuristic engine (deterministic)
```

`lib/groq.ts` is imported by a `"use client"` module, so it is bundled for the
browser. Next.js only inlines `NEXT_PUBLIC_`-prefixed variables into client bundles,
so `process.env.GROQ_API_KEY` is `undefined` there. The fallback reads
`localStorage.getItem("VOIS_GROQ_API_KEY")` — a key **no code in the repository ever
writes**. The net effect: browser-initiated classification always takes the heuristic
branch.

The server handlers [`/api/classify`](../app/api/classify/route.ts) and
[`/api/match-strain`](../app/api/match-strain/route.ts) *do* have the key and *would*
run live inference — but no component calls them. Routing the store through them is
the single highest-leverage fix in the codebase; see
[AI Pipeline](04-ai-pipeline.md#-the-key-resolution-problem--why-groq-never-answers-the-browser).

▲ [`lib/groq.ts`](../lib/groq.ts) sets `dangerouslyAllowBrowser: true` on all three
client constructions. Today no key reaches the browser, so nothing leaks — but the
guard rail is off, and any future `NEXT_PUBLIC_GROQ_API_KEY` would exfiltrate
silently. See [AI Pipeline](04-ai-pipeline.md#-the-key-resolution-problem--why-groq-never-answers-the-browser).

---

## ▸ Persistence Strategy

| Store | Keys | Written by | Lifetime |
|---|---|---|---|
| `localStorage` | `vois_strains_v1` | [`lib/store.ts`](../lib/store.ts) | Until cleared |
| `localStorage` | `vois_submissions_v1` | [`lib/store.ts`](../lib/store.ts) | Until cleared |
| `localStorage` | `vois_language` | [`LanguageContext`](../context/LanguageContext.tsx) | Until cleared |
| `localStorage` | `vois_current_role` | [`RoleContext`](../context/RoleContext.tsx) | Until cleared |
| `localStorage` | `vois_theme` | [`ThemeContext`](../context/ThemeContext.tsx) | Until cleared |
| `localStorage` | `VOIS_GROQ_API_KEY` | ▲ read by [`lib/groq.ts`](../lib/groq.ts), never written | — |
| PostgreSQL | `strains`, `submissions`, `vaccine_content` | [`lib/store.ts`](../lib/store.ts) mirrors, [`scripts/seed.ts`](../scripts/seed.ts) seeds | Persistent |

Every `localStorage` access in the codebase is wrapped in `try/catch` with a
`console.warn` fallback, so private-browsing modes and storage-disabled environments
degrade to in-memory state rather than crashing.

---

## ▸ Configuration Guards

Two boolean gates determine which enhancements are active. Both fail safe.

```ts
// lib/supabase.ts
export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey &&
  supabaseUrl.startsWith("http") && !supabaseUrl.includes("placeholder")
);
```

The Supabase client is always constructed — with a placeholder URL when unconfigured —
so imports never throw. Every call site checks the flag before issuing a query.

```ts
// app/api/domi/route.ts
if (!apiKey) return NextResponse.json({ role: "assistant", content: "⚠ Groq API key is missing…" }, { status: 200 });
```

A missing key returns HTTP 200 with an in-character explanation rather than a 500, so
the chat UI renders guidance instead of an error state.

---

## ▸ Route Inventory

| Path | File | Rendering | Store | Theme-aware |
|---|---|---|---|---|
| `/` | [`app/page.tsx`](../app/page.tsx) | Client | ● | ● |
| `/submit` | [`app/submit/page.tsx`](../app/submit/page.tsx) | Client | ● | ▲ light only |
| `/analyst` | [`app/analyst/page.tsx`](../app/analyst/page.tsx) | Client | ● | ▲ light only |
| `/vaccine` | [`app/vaccine/page.tsx`](../app/vaccine/page.tsx) | Client | ● | ▲ light only |
| `/distribute` | [`app/distribute/page.tsx`](../app/distribute/page.tsx) | Client | ● | ▲ light only |
| `/strains` | [`app/strains/page.tsx`](../app/strains/page.tsx) | Client | ● | ▲ light only |
| `/map` | [`app/map/page.tsx`](../app/map/page.tsx) | Client | ● | ▲ dark only |
| `/works` | [`app/works/page.tsx`](../app/works/page.tsx) | Client | — | ▲ light only |
| `/works/[slug]` | [`app/works/[slug]/page.tsx`](../app/works/%5Bslug%5D/page.tsx) | Client | — | ▲ light only |
| `POST /api/classify` | [`route.ts`](../app/api/classify/route.ts) | Node | — | — |
| `POST /api/match-strain` | [`route.ts`](../app/api/match-strain/route.ts) | Node | — | — |
| `POST /api/domi` | [`route.ts`](../app/api/domi/route.ts) | Node | — | — |

Only the landing page and the global chrome (navbar, footer, D0MI) honour the theme
toggle. The role consoles pin themselves to a fixed palette. Full breakdown in
[Design System](10-design-system.md#-theme-coverage) and
[Design System](10-design-system.md#-theme-coverage).

`/works` and `/works/[slug]` are a case-study template carried over from an unrelated
design-studio project and are not part of the V0ICE domain. See
[Component Catalog](07-component-catalog.md#-out-of-domain-surface).

---

## ▸ Build & Type Configuration

| Setting | Value | File |
|---|---|---|
| Module resolution | `bundler` | [`tsconfig.json`](../tsconfig.json) |
| Target | `es2020`, `downlevelIteration: true` | [`tsconfig.json`](../tsconfig.json) |
| Strictness | `strict: true`, `isolatedModules: true` | [`tsconfig.json`](../tsconfig.json) |
| Path alias | `@/*` → repo root | [`tsconfig.json`](../tsconfig.json) |
| React mode | `reactStrictMode: true` | [`next.config.mjs`](../next.config.mjs) |
| Remote images | `protocol: https`, `hostname: '**'` ▲ | [`next.config.mjs`](../next.config.mjs) |
| Dark mode | `class` strategy | [`tailwind.config.ts`](../tailwind.config.ts) |
| Tailwind content | `./pages`, `./components`, `./app` — ▲ omits `./context` | [`tailwind.config.ts`](../tailwind.config.ts) |

`reactStrictMode: true` double-invokes effects in development. This is worth knowing
when reading [`MaskedHeroType`](../components/MaskedHeroType.tsx), which registers a
`requestAnimationFrame` loop and window listeners — its cleanup function is complete,
so the double-invoke is handled correctly.

▲ The Tailwind `content` globs do not include `./context/**`. Class strings written
inside [`LanguageContext.tsx`](../context/LanguageContext.tsx) translation values
would not be generated. No current translation contains class names, so this is latent
rather than active.

---

## ▸ Extension Points

Ordered by how cleanly they slot into the existing structure.

**▸ Route classification through the server.** Replace the direct `classifySubmission`
import in [`lib/store.ts`](../lib/store.ts) with `fetch("/api/classify")`. The handler
already exists and matches the return shape exactly. This activates live Groq
inference across the whole pipeline.

**▸ Batch strain matching.** `confirmSubmission` currently issues one `isSameStrain`
call per existing strain, sequentially, with no early exit. A single prompt carrying
all strain summaries would collapse *n* round-trips to one.

**▸ Real geography.** Wire the orphaned [`MapWrapper`](../components/MapWrapper.tsx)
into [`/map`](../app/map/page.tsx) by computing a `Record<string, RegionStats>` from
the store. `MapComponent` is complete and expects exactly that shape.

**▸ Media upload.** `Submission.image_url` is plumbed end to end — form, store,
Postgres column — but only accepts a pasted URL. Supabase Storage would fill the gap
without a schema change.

**▸ Authentication and audit trail.** No table carries an author column. Adding
`created_by` to all three tables and enabling RLS (see
[Setup & Operations](11-setup-and-operations.md#4---enable-row-level-security)) is the prerequisite
for any multi-tenant deployment.

---

[Docs Home](README.md) · [← 01 Overview](01-overview.md) · **02** · [03 Data Model →](03-data-model.md)
