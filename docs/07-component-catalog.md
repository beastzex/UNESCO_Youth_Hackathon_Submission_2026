▧ **Component Catalog**
[Docs Home](README.md) · [← 06 Routes & Roles](06-routes-and-roles.md) · **07** · [08 State Management →](08-state-management.md)

---

# ▧ Component Catalog

**Eighteen components. Six are running the platform. This is what the other twelve are doing — and why that matters.**

Eighteen files in [`components/`](../components/). Six are wired into live routes;
twelve are not. This document covers all of them, because knowing what is *not*
running is as useful as knowing what is.

## Inventory

| Component | Lines | Status | Consumer |
|---|---|---|---|
| [`DomiChat`](#-domichat) | 884 | ● live | `app/layout.tsx` |
| [`VoisNavbar`](#-voisnavbar) | 326 | ● live | `app/layout.tsx` |
| [`LeafletMap`](#-leafletmap) | 204 | ● live | `app/page.tsx`, `app/map/page.tsx` |
| [`MaskedHeroType`](#-maskedherotype) | 192 | ● live | `app/page.tsx` |
| [`VoisFooter`](#-voisfooter) | 102 | ● live | `app/layout.tsx` |
| [`MapComponent`](#-mapcomponent--mapwrapper) | 207 | ○ orphaned | — |
| [`ManifestoVideoBlock`](#-orphaned-visual-components) | 119 | ○ orphaned | — |
| [`NothinNavbar`](#-out-of-domain-surface) | 153 | ○ orphaned | — |
| [`FluidGlass`](#-orphaned-visual-components) | 155 | ○ orphaned | — |
| [`NothinFooter`](#-out-of-domain-surface) | 105 | ○ orphaned | — |
| [`StatsHeader`](#-statsheader) | 97 | ○ orphaned | — |
| [`Badge`](#-badge) | 96 | ○ transitively orphaned | `MapComponent` only |
| [`TactileObjectLayer`](#-orphaned-visual-components) | 76 | ○ orphaned | — |
| [`Footer`](#-legacy-re-export-shims) | 69 | ○ orphaned | — |
| [`KineticMarquee`](#-out-of-domain-surface) | 35 | ○ orphaned | — |
| [`MapWrapper`](#-mapcomponent--mapwrapper) | 27 | ○ orphaned | — |
| [`FluidGlassHero`](#-legacy-re-export-shims) | 3 | ○ shim | — |
| [`Navbar`](#-legacy-re-export-shims) | 2 | ○ shim | — |

Every component is `"use client"` except [`Badge`](../components/Badge.tsx), which is
pure presentational and has no directive.

---

# ● Live Components

## ▸ `DomiChat`

[`components/DomiChat.tsx`](../components/DomiChat.tsx) · 884 lines · the largest
component in the project

Mounted once globally in [`app/layout.tsx`](../app/layout.tsx). Renders a floating
launcher pill in the bottom-right and, when opened, an expandable conversation
terminal.

### Composition

The file exports one component and contains two additional module-level functions:

| Symbol | Lines | Role |
|---|---|---|
| `DomiChat` | 61–529 | Launcher, modal, header, transcript, composer |
| `RichMarkdownRenderer` | 531–654 | Block dispatch → React elements |
| `parseMarkdownBlocks` | 666–804 | Line scanner → `MarkdownBlock[]` |
| `renderInlineTokens` | 807–884 | Inline regex → bold / italic / code / links |

### State

```ts
isOpen, isExpanded, langMenuOpen, input, loading, copiedId
messages: Message[]   // { id, role, content, timestamp }
```

Seeded with a rich markdown greeting listing D0MI's four capability areas, each with
in-app links. Conversation history is **session-only** — never persisted.

### Behaviour

| Feature | Implementation |
|---|---|
| Global shortcut | `Ctrl/Cmd + K` toggles, `Escape` closes, both via a window `keydown` listener |
| Size modes | Inline `w-[500px] h-[680px]` ⇄ expanded `inset-4 sm:inset-8 md:inset-12` |
| Language picker | Calls `setLanguage()` **and** appends a localized confirmation turn to the transcript |
| Starter prompts | 4 one-click seeds with Lucide icons: Compass, ShieldCheck, Globe2, Flame |
| Copy | Per-message clipboard write with a 2-second `copiedId` confirmation |
| Clear | Resets to a fresh greeting |
| Autoscroll | `scrollIntoView({ behavior: "smooth" })` on `[messages, isOpen, loading]` |
| Focus | Input focused 150 ms after open |

### The markdown engine

Hand-written rather than a dependency. `parseMarkdownBlocks` is a single-pass line
scanner with fixed precedence:

```
1  ``` fenced code      → dark panel, terminal icon, language label
2  --- *** ___          → hairline rule
3  # ## ###             → H1 violet bar · H2 blue bar · H3 violet uppercase + star
4  >  blockquote        → violet callout with info icon, consecutive lines joined
5  | table |            → bordered, striped, hover, overflow-x-auto
6  1. / - * •  list     → numbered circle badges / violet bullets
7  paragraph            → consecutive non-block lines joined with spaces
```

`renderInlineTokens` uses one alternation regex for `` `code` ``, `**bold**`,
`*italic*`, `[text](url)`. Links branch on destination:

- **internal** `/…` → Next.js `<Link>` as a violet pill with a right-arrow — real
  client-side navigation
- **external** → `<a target="_blank" rel="noopener noreferrer">` as a blue pill with
  an external-link glyph

This is why [the D0MI system prompt](04-ai-pipeline.md#-capability-3--d0mi-conversational-assistant)
insists on markdown link syntax — it is the mechanism by which the assistant can move
the user through the platform rather than merely describe it.

**Unsupported:** nested lists, inline HTML, reference links, strikethrough, task
lists. Tables require a separator row (data rows are read from index 2 onward).

---

## ▸ `VoisNavbar`

[`components/VoisNavbar.tsx`](../components/VoisNavbar.tsx) · 326 lines · consumes all
three contexts

A fixed header plus a left-sliding drawer.

### Header — always visible

```
┌────────────────────────────────────────────────────────────────────┐
│ V0ICE            [☀ Light] [🌐 EN (English) ▾] [☰ MENU]            │
└────────────────────────────────────────────────────────────────────┘
```

- **Theme toggle** — Sun icon in dark mode (amber), Moon in light mode (violet), with
  a `title` announcing the target state
- **Language dropdown** — a 320–420 px panel containing a horizontally scrollable
  strip of all 24 languages, with vertical `EUR` and `WORLD` section dividers injected
  before `FR` and `HI` respectively, plus chevron buttons that `scrollBy(±180px)`
- **Menu** — opens the drawer

The two dropdowns are mutually exclusive — opening either closes the other.

### Drawer — `w-full sm:w-[480px] md:w-[540px]`

Slides in with `cubic-bezier(0.16, 1, 0.3, 1)` over 500 ms behind a blurred backdrop.

**Navigation protocols** — six numbered routes, each with a translated label and a
one-line meta description:

| | Route | Label key |
|---|---|---|
| 01 | `/map` | `nav_radar` |
| 02 | `/strains` | `nav_strains` |
| 03 | `/submit` | `nav_report` |
| 04 | `/analyst` | `nav_analyst` |
| 05 | `/vaccine` | `nav_vaccine` |
| 06 | `/distribute` | `nav_field` |

**Active citizen role** — all five roles as selectable cards showing title and
description, with a check on the current one and a live emerald indicator in the
section header.

Every string except the `V0ICE` wordmark and the literal `"Paris"` in the drawer
footer flows through `t()`.

---

## ▸ `LeafletMap`

[`components/LeafletMap.tsx`](../components/LeafletMap.tsx) · 204 lines

▲ **The name is misleading.** This component imports no Leaflet and renders no
geography. It is a two-pane CSS layout — a responsive grid of region tiles on the left
and a detail dossier on the right.

### Left pane — region grid

Per tile: a coloured score bar, a zero-padded index (`01`…`05`), the score percentage
in the band colour, the region name, and the active-strain count. Selection is local
`useState`, defaulting to `"Capital Area"`.

```ts
const scoreColor = (score: number) => {
  if (score >= 70) return "#22C55E";  // accent-i green
  if (score >= 35) return "#EAB308";  // accent-c yellow
  return "#EF4444";                    // accent-e red
};
```

A three-swatch legend sits below, labelled via `t("radar_stable")`,
`t("radar_moderate")`, `t("radar_critical")`.

### Right pane — region dossier

Region name, immunity bar and percentage, then the active strain list. Each strain
card shows its technique badge, report count, name, a two-line clamped summary, and a
vaccine status line that resolves three ways:

| Condition | Display |
|---|---|
| `has_vaccine && distributed_regions.includes(region)` | `t("radar_distributed")` with shield, emerald |
| `has_vaccine` only | `t("radar_vaccine_ready")` with shield, emerald |
| no vaccine | `t("no_vaccine")` in rose, plus a `Synthesize →` link to `/vaccine` |

Footer actions link to `/distribute` and `/strains`.

**This is the only role-facing component that is both fully theme-aware and fully
translated.** Every string routes through `t()`; every surface has a `dark:` variant.

The genuine Leaflet implementation lives in [`MapComponent`](#-mapcomponent--mapwrapper)
and is not wired in — see
[Component Catalog](07-component-catalog.md#-mapcomponent--mapwrapper).

---

## ▸ `MaskedHeroType`

[`components/MaskedHeroType.tsx`](../components/MaskedHeroType.tsx) · 192 lines · the
signature visual

A two-layer masked-typography effect. Both layers render the identical `V 0 I C E`
letterform geometry; only their colours differ.

```
LAYER 1 — base           full-bleed, monochrome
  dark mode:  black background, all letters #FFFFFF
  light mode: white background, all letters #000000

LAYER 2 — accent lens    clipped to a circle that follows the cursor
  dark mode:  white  panel, letters in the V0ICE accent palette
  light mode: black  panel, letters in the V0ICE accent palette
```

The lens is a `clip-path: circle(Rpx at Xpx Ypx)` updated every frame.

### The animation loop

A `requestAnimationFrame` loop with exponential damping — frame-rate independent
because the coefficient derives from elapsed time:

```ts
const posDamp = 1 - Math.exp(-18 * delta);   // position follow
currentX += (mouseX - currentX) * posDamp;

const radiusDamp = 1 - Math.exp(-16 * delta); // radius follow
currentRadius += (targetRadius - currentRadius) * radiusDamp;
```

`delta` is clamped to `0.05 s` so a backgrounded tab does not produce a jump on return.

### Proximity-driven radius

The lens grows as the cursor nears the wordmark. Distance is computed to the word's
bounding *rectangle*, not its centre:

```ts
const dx = Math.max(wLeft - mouseX, 0, mouseX - wRight);
const dy = Math.max(wTop - mouseY, 0, mouseY - wBottom);
const distance = Math.sqrt(dx*dx + dy*dy);

if (distance === 0)            targetRadius = 75;                       // inside
else if (distance < 40) {
  const t = 1 - distance / 40;
  targetRadius = 20 + t*t*(3 - 2*t) * 55;                               // smoothstep
} else                         targetRadius = 20;                        // far
```

`t*t*(3-2*t)` is the classic smoothstep polynomial — C¹ continuous, so the growth has
no visible kink at the falloff boundary.

### Entrance

Letters rise from `translateY(115%)` behind an `overflow: hidden` mask, staggered
90 ms apart, over 900 ms with `cubic-bezier(0.16, 1, 0.3, 1)`. Triggered by an 80 ms
`setTimeout` after mount so the transition registers.

### Cleanup

`clearTimeout`, `cancelAnimationFrame`, and `removeEventListener` are all called on
unmount — correct under `reactStrictMode: true`, which double-invokes effects in
development.

▲ `mouseleave` is registered with an inline arrow function, so its `removeEventListener`
is never matched. One stale listener persists per unmount. Harmless in practice —
the component mounts once — but a genuine leak. See
[Component Catalog](07-component-catalog.md#-maskedherotype).

---

## ▸ `VoisFooter`

[`components/VoisFooter.tsx`](../components/VoisFooter.tsx) · 102 lines

Restates the thesis at full display size (`hero_statement_1` / `hero_statement_2`),
offers the two primary CTAs, and lists the five roles as a numbered "public health
loop" — `01 / Spotter →` through `05 / Regional Lead →`.

A three-column credit block closes it: **Project** (V0ICE, hackathon tag), **Theme**
(the UNESCO 2026 theme), **Engine** (`footer_engine_desc`), and the copyright line.

▲ `footer_engine_desc` reads *"Groq AI (GPT-OSS-120B) + Leaflet OpenStreetMap"* in
every one of the 24 language dictionaries. Leaflet is not rendered on any live route —
see [Component Catalog](07-component-catalog.md#-mapcomponent--mapwrapper).

Fully theme-aware and fully translated.

---

# ○ Orphaned Components — Built, Never Wired

Present in the tree, imported by nothing.

## ▸ `MapComponent` & `MapWrapper`

[`components/MapComponent.tsx`](../components/MapComponent.tsx) · 207 lines
[`components/MapWrapper.tsx`](../components/MapWrapper.tsx) · 27 lines

The real Leaflet implementation — complete, correct, and disconnected.

`MapWrapper` is the SSR guard: it wraps `MapComponent` in
`dynamic(() => import(...), { ssr: false })` with a loading placeholder reading
*"Loading Epidemiological Outbreak GIS… Calibrating OpenStreetMap geospatial tiles"*.
This is required because Leaflet touches `window` at module scope.

`MapComponent` renders:

| Feature | Detail |
|---|---|
| Base layer | OpenStreetMap raster tiles with attribution |
| Center / zoom | `[21.5, 78.5]` at zoom 5; `scrollWheelZoom` disabled |
| Ambient radius | `CircleMarker`, radius 32 → 45 when selected, dashed border when selected |
| Pins | Custom `L.divIcon` — active-strain count in a coloured disc, an `N% Immune` label above, and a pulsing halo |
| Fly-to | `MapController` calls `map.flyTo(coords, 6, { duration: 1.2 })` on selection change |
| Popups | Region name, population estimate, active strains, vaccinated inoculations, herd immunity chip, primary vector, and an *Inspect Regional Vector Dossier →* action |
| Legend | Floating bottom-left panel with the three immunity bands |
| Mount guard | Renders a spinner until `useEffect` sets `mounted` |

### Why it is disconnected

It expects `regionStats: Record<string, RegionStats>` — a shape nothing computes. The
store exposes `getRegionImmunityScore(name)` but no aggregate. Wiring it in requires:

```ts
const regionStats = Object.fromEntries(regions.map(r => {
  const active = strains.filter(s => s.regions_affected.includes(r.name));
  const distributed = active.filter(s => s.distributed_regions.includes(r.name));
  const score = getRegionImmunityScore(r.name);
  return [r.name, {
    region: r.name,
    totalConfirmedStrains: active.length,
    distributedStrainsCount: distributed.length,
    herdImmunityScore: score,
    activeStrains: active,
    topStrain: active.sort((a,b) => b.report_count - a.report_count)[0],
    status: score >= 70 ? "protected" : score >= 35 ? "moderate" : "critical",
  }];
}));
```

Then swap `<LeafletMap />` for `<MapWrapper regionStats={regionStats} … />` in
[`app/map/page.tsx`](../app/map/page.tsx).

▲ Two further mismatches to resolve first: `MapComponent` reads coordinates from
[`lib/regions.ts`](../lib/regions.ts), whose North District and Rural Belt differ from
the live [`lib/seed-data.ts`](../lib/seed-data.ts) by 230 km and 680 km respectively
([Data Model](03-data-model.md#-region-definitions)); and it uses **70 / 40** immunity
thresholds where the rest of the app uses **70 / 35**
([Design System](10-design-system.md#-design-tokens--quick-reference)).

`MapComponent` also imports `Strain`, `HerdScoreBadge`, `TechniqueBadge`,
`ShieldCheck`, `AlertTriangle`, `Syringe`, `ExternalLink`, `Info`, and `Link` without
using them — dead imports inside dead code.

---

## ▸ `StatsHeader`

[`components/StatsHeader.tsx`](../components/StatsHeader.tsx) · 97 lines

A four-metric telemetry bar taking `{ strains, submissions }` and computing spotter
reports, active strains, synthesized vaccines, and an **overall** herd immunity figure
using a different formula from the per-region one:

```ts
totalDistributedPoints = Σ strain.distributed_regions.length
totalPossiblePoints    = Σ max(1, strain.regions_affected.length)
overallHerdImmunity    = round(totalDistributedPoints / totalPossiblePoints × 100)
```

This is a global coverage ratio across all strain–region pairs, not an average of
regional scores. A legitimate and arguably more informative metric — it is simply
never rendered. The landing page computes its own inline metrics instead.

---

## ▸ `Badge`

[`components/Badge.tsx`](../components/Badge.tsx) · 96 lines · imported only by
`MapComponent`, itself orphaned

Three presentational badges:

| Export | Input | Output |
|---|---|---|
| `TechniqueBadge` | `TechniqueType \| string` | Coloured pill per technique — deepfake rose, cloned voice purple, doctored screenshot amber, … |
| `StatusBadge` | `SubmissionStatus` | `Confirmed Strain` emerald · `Dismissed / Noise` slate · `Pending Triage` amber with `animate-pulse` |
| `HerdScoreBadge` | `number` | `{score}%` plus a label — `Inoculated / Protected` ≥70, `Moderate Resistance` ≥40, `Critical Vulnerability` below |

`StatusBadge` is the only place in the codebase that renders the `"rejected"` status —
which no code path ever sets ([Data Model](03-data-model.md#submissionstatus)).
`HerdScoreBadge` carries the 70 / **40** thresholds.

The live pages inline their own badge markup rather than importing these. Adopting
them would remove real duplication across `/analyst`, `/vaccine`, `/strains`, and
`/distribute`.

---

## ▸ Orphaned visual components

**`FluidGlass`** — [`components/FluidGlass.tsx`](../components/FluidGlass.tsx) ·
155 lines. A Three.js refraction effect built on `@react-three/fiber` and `drei`,
supporting `lens` / `bar` / `cube` modes with `MeshTransmissionMaterial`, `useFBO`
render-to-texture, and `ScrollControls`. **This is the sole importer of `three`,
`@react-three/fiber`, `@react-three/drei`, and `maath`** — four dependencies that
contribute nothing to any live route. It was superseded by
[`MaskedHeroType`](#-maskedherotype), which achieves a comparable effect with a
`clip-path` circle and no 3D runtime.

**`TactileObjectLayer`** — [`components/TactileObjectLayer.tsx`](../components/TactileObjectLayer.tsx) ·
76 lines. Floating decorative objects with mouse-parallax — a chrome sphere built from
a radial gradient with inset shadows, plus additional shapes, offset by
`(cursor − centre) × 30` and animated with the `float-slow` / `float-reverse`
keyframes defined in [`tailwind.config.ts`](../tailwind.config.ts). Those keyframes
are otherwise unused.

**`ManifestoVideoBlock`** — [`components/ManifestoVideoBlock.tsx`](../components/ManifestoVideoBlock.tsx) ·
119 lines. A video player with play/pause, mute, a `standard` / `reflect` variant
toggle, and fullscreen. No video source is referenced anywhere in the repository.

---

## ▸ Out-of-domain surface

A self-contained island belonging to a different project — a Paris design studio
called *"nothin'"*.

| File | Contents |
|---|---|
| [`components/NothinNavbar.tsx`](../components/NothinNavbar.tsx) | `N'` wordmark, EN/FR toggle, `isLight` prop |
| [`components/NothinFooter.tsx`](../components/NothinFooter.tsx) | Studio footer |
| [`components/KineticMarquee.tsx`](../components/KineticMarquee.tsx) | Scrolling ticker: *"we are nothin'"*, *"refuse the generic"*, *"paris 24.26"*, *"perspective over style"* |
| [`lib/nothin-data.ts`](../lib/nothin-data.ts) | `CASE_STUDIES` — Utopia, In Cognita, … with Unsplash imagery |
| [`app/works/page.tsx`](../app/works/page.tsx) | Case-study index ▲ **routable** |
| [`app/works/[slug]/page.tsx`](../app/works/%5Bslug%5D/page.tsx) | Case-study detail ▲ **routable** |

`KineticMarquee` is the only consumer of the `marquee` / `marquee-reverse` animations
and of the `studio-*` and `chrome-*` colour scales in the Tailwind theme — meaning
those theme extensions exist entirely for dead code.

The two `works` routes are live URLs. They are not linked from the navbar, footer, or
D0MI's navigation graph, but a visitor who types `/works` reaches a design-studio
portfolio inside a UNESCO misinformation platform. Removing this island is the single
cleanest deletion available: 4 components, 1 data file, 2 routes, and several Tailwind
theme entries.

---

## ▸ Legacy re-export shims

Three files exist only to preserve old import paths:

```ts
// components/Navbar.tsx — 2 lines
export { VoisNavbar as Navbar } from "./VoisNavbar";
export { VoisNavbar } from "./VoisNavbar";

// components/FluidGlassHero.tsx — 3 lines
export { MaskedHeroType as FluidGlassHero, MaskedHeroType } from "./MaskedHeroType";
```

[`components/Footer.tsx`](../components/Footer.tsx) is not a shim — it is a complete
69-line legacy footer from an earlier iteration branded **"OUTBREAK: The MIL Immune
System"** in a slate/teal palette, predating the V0ICE identity and the monochrome
design system.

▲ [`MaskedHeroType.tsx`](../components/MaskedHeroType.tsx) also self-aliases on its
final line (`export { MaskedHeroType as FluidGlassHero }`), making the shim file
redundant twice over.

---

## ▸ Recommended Cleanup

Ordered by benefit-to-risk. Nothing here changes live behaviour.

| Action | Removes | Risk |
|---|---|---|
| Delete the `nothin'`/`works` island | 4 components, 1 lib, 2 routes, 2 Tailwind colour scales, 2 animations | None — nothing links to it |
| Delete `FluidGlass.tsx` | 4 npm dependencies (`three`, `@react-three/fiber`, `@react-three/drei`, `maath`) | None — superseded by `MaskedHeroType` |
| Delete `Footer.tsx`, `Navbar.tsx`, `FluidGlassHero.tsx` | 3 files | None |
| Delete `TactileObjectLayer`, `ManifestoVideoBlock` | 2 files | None |
| Delete [`lib/initial-data.ts`](../lib/initial-data.ts) | Duplicate seed corpus | None |
| **Wire in** `MapWrapper` / `MapComponent` | — | Fixes [Component Catalog](07-component-catalog.md#-mapcomponent--mapwrapper) |
| **Adopt** `Badge` exports across the four consoles | ~80 lines of duplicated markup | Low — visual diff needs review |
| **Adopt** `StatsHeader` on `/analyst` or `/distribute` | — | Low |

Deleting the first five rows removes 12 of 18 components and 4 of 13 runtime
dependencies without touching a single live code path.

---

[Docs Home](README.md) · [← 06 Routes & Roles](06-routes-and-roles.md) · **07** · [08 State Management →](08-state-management.md)
