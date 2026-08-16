▸ **Routes & Roles**
[Docs Home](README.md) · [← 05 API Reference](05-api-reference.md) · **06** · [07 Component Catalog →](07-component-catalog.md)

---

# ▸ Routes & Roles

**Nine routes, five civic roles, and a loop you can walk end to end in under three minutes.**

## Route Map

```
/                    landing · 7 scenes · interactive pipeline · live radar
├── /submit          ROLE 01 · Spotter          · intake form + AI diagnosis card
├── /analyst         ROLE 02 · Analyst          · triage queue + clustering + override modal
├── /vaccine         ROLE 03 · Vaccine Maker    · strain picker + synthesis console
├── /distribute      ROLE 04 · Field Worker     · immunity ticker + region toggle matrix
├── /map             ROLE 05 · Surveillance     · outbreak radar + region dossier
├── /strains         public  · searchable strain directory + vaccine modal
├── /works           ⚠ out of domain · case-study index
│   └── /works/[slug]  ⚠ out of domain · case-study detail
└── /api
    ├── /classify        POST · content classification
    ├── /match-strain    POST · semantic strain comparison
    └── /domi            POST · D0MI conversational turn
```

Global on every route: [`VoisNavbar`](../components/VoisNavbar.tsx),
[`VoisFooter`](../components/VoisFooter.tsx), and
[`DomiChat`](../components/DomiChat.tsx) (`Ctrl/Cmd + K`).

---

## ▸ The Five Roles

Defined in [`context/RoleContext.tsx`](../context/RoleContext.tsx) as the `ROLES`
record. The active role persists to `localStorage` under `vois_current_role` and
defaults to `public_view`.

| Key | Title | Badge | Route | Colour |
|---|---|---|---|---|
| `spotter` | Spotter | `EYE / SENTRY` | `/submit` | `#3B82F6` blue |
| `analyst` | Analyst | `LAB / TRIAGE` | `/analyst` | `#8B5CF6` violet |
| `vaccine_maker` | Vaccine Maker | `SYNTHESIS / COUNTER` | `/vaccine` | `#10B981` emerald |
| `field_health_worker` | Field Health Worker | `DEPLOYMENT / HERD` | `/distribute` | `#F59E0B` amber |
| `public_view` | Public / Regional Lead | `OVERVIEW / SURVEILLANCE` | `/map` | `#FFFFFF` white |

▲ These colours are **not** the V0ICE accent palette used on the landing page and in
the hero wordmark. The two systems assign different colours to the same roles — see
[Design System](10-design-system.md#-two-competing-palettes).

**Role is advisory, not enforced.** Nothing gates a route on the active role. Any
visitor can open any console. The role drives the navbar's active-role indicator and
provides a sense of progression through the pipeline; it is not an authorization
mechanism. Every "continue to the next step" link calls `setRole(...)` alongside
navigation, so moving through the pipeline updates the badge naturally.

---

## ▸ `/` — Landing Page

[`app/page.tsx`](../app/page.tsx) · 756 lines · client component · fully theme-aware

Seven scenes, separated by hairline borders, revealed on scroll by an
`IntersectionObserver` hook (`useScrollReveal`, threshold `0.1`, unobserve after
first intersection — animations play once).

### Scene 1 · Hero

Full-viewport [`MaskedHeroType`](../components/MaskedHeroType.tsx) — the V0ICE
wordmark with a cursor-tracked "flashlight lens" that reveals per-letter accent
colours through a monochrome base layer. Below it, an animated scroll cue that
smooth-scrolls to the manifesto.

### Scene 2 · Editorial Manifesto

Status bar (`hero_tag` / `hero_subtag` / protocol / operational), then a 12-column
split: an 8-column typographic statement with a violet→emerald→amber gradient on the
second line, and a 4-column "Surveillance Telemetry" card showing vector defense
(94.8% contained), mean inoculation time (14.2 minutes), and the UNESCO framework
badge. Primary CTAs: *Report a Strain* → `/submit`, *View Outbreak Map* → `/map`,
each setting the corresponding role.

### Scene 3 · Bio-Immune Telemetry Console

Four live metrics computed from the store — total detections, confirmed strains,
vaccines synthesized, pending triage — with sub-labels. These read real state, so they
move as the visitor uses the pipeline.

### Scene 4 · Interactive 5-Role Transmission Chamber

The centrepiece. Five selectable stage cards driven by `activePipelineRole` state.
Each stage carries an icon, an accent colour from the V0ICE palette, a title, a
tagline, a description, and a four-field mock telemetry panel (`type`, `badge`,
`specimen`, `aiDiagnosis`, `action`) sourced from `mock1_*`…`mock5_*` translation keys.

◐ The mock panels are illustrative copy, not live inference — see
[AI Pipeline · Simulated intelligence](04-ai-pipeline.md#-simulated-intelligence--labelled-honestly).

### Scene 5 · Surveillance Radar

Embeds the live [`LeafletMap`](../components/LeafletMap.tsx) component — real store
data, real immunity scores.

### Scene 6 · Specimen Dossier

Filterable strain cards (`all` · `vaccinated` · `deepfake` · technique) reading the
live strain list, with affected territories and vaccine status.

### Scene 7 · UNESCO Initiative & Citizen Stamp

Theme framing plus an interactive pledge: a counter starting at `14,829` that
increments once per session and issues a `CALLSIGN-VOICE-####` confirmation.

◐ Pledge state is component-local and not persisted — a reload resets it.

---

## ▸ `/submit` — Spotter

[`app/submit/page.tsx`](../app/submit/page.tsx) · 303 lines · ▲ hardcoded light theme

### Flow

```
[form]  content_text (required, textarea)
        region        (select, from store.regions — 5 options)
        language      (select — English, Hindi, Spanish, French, Regional Dialect)
        image_url     (optional url input)
             │
             ▼  submit
        addSubmission({...})  ──▸ classifySubmission()  ──▸ diagnosis
             │
             ▼
[result card]  submission ID · detected technique · confidence bar
               detected intent · AI claim summary (serif, quoted)
                    │
                    ├──▸ [SUBMIT ANOTHER REPORT]  → resets the form
                    └──▸ [SWITCH TO ANALYST DASHBOARD] → /analyst, setRole("analyst")
```

### Details worth knowing

- **Three sample buttons** autofill text, region, and language — written to trigger
  three different rules in the heuristic ladder, so an unconfigured demo still shows
  three distinct techniques. See
  [AI Pipeline · Heuristic fallback](04-ai-pipeline.md#the-heuristic-fallback-engine).
- **Loading state** shows `DIAGNOSING STRAIN...` with a spinner; the submit button is
  disabled while empty or in flight.
- **The language list here is a different set** from the 24-language UI switcher — it
  describes the language *of the reported content*, not the interface. Five options,
  including `"Regional Dialect"`.
- **`image_url` accepts a URL only** — there is no file upload. The field is plumbed
  through the store and into the Postgres column, so adding Supabase Storage would not
  require a schema change.
- **Confidence bar** renders `classification.confidence * 100` as both a percentage
  and a fill width.

---

## ▸ `/analyst` — Analyst

[`app/analyst/page.tsx`](../app/analyst/page.tsx) · 383 lines · ▲ hardcoded light theme

### Layout

```
┌─ header ─────────────────────────────────────────────────────┐
│ ROLE: ANALYST — TRIAGE & CLUSTERING LAB                      │
│ [N PENDING REVIEW]  [M CONFIRMED STRAINS]                    │
└──────────────────────────────────────────────────────────────┘
   clustering notice (dismissible, emerald left border)
┌─ Incoming Citizen Reports (N) ───────────────────────────────┐
│  per card:  region badge · language · submission ID          │
│             AI confidence % + violet bar                     │
│             raw submitted content (quoted block)             │
│             suggested technique │ diagnosed claim summary    │
│             ┌ "Confirming triggers Groq LLM strain-matching  │
│             │  against N active strains."                   │
│             [Edit & Confirm]  [CONFIRM STRAIN]               │
└──────────────────────────────────────────────────────────────┘
┌─ Active Clustered Strains (M) ── 2-col grid ─────────────────┐
│  technique badge · clustered report count · name · summary   │
│  affected regions · VACCINATED | NEEDS VACCINE               │
└──────────────────────────────────────────────────────────────┘
```

### Two confirmation paths

**One-click confirm** — `confirmSubmission(sub.id)` with no overrides. The AI's
technique and summary are accepted as-is; clustering runs against every existing
strain.

**Edit & confirm** — opens a modal with three editable fields: technique (`<select>`
over the six-member union), strain title (prefilled with the first 45 characters of
the AI summary), and refined claim summary. On save, `confirmSubmission(id, overrides)`
runs the same clustering with human-corrected metadata.

Both paths show `CLUSTERING...` with a spinner during the *n* sequential match calls.

### ▲ The clustering notice is always wrong for new strains

```tsx
res.isNew
  ? `New strain created from submission [${sub.id}].`
  : `Matched & clustered into existing strain vector [${res.matchedStrainId}]. Report count incremented.`
```

`isNew` is computed as `!matchedStrainId` in the store, but the create branch assigns
`matchedStrainId` before returning — so `isNew` is always `false` and the "new strain"
message is unreachable. Full analysis in
[AI Pipeline](04-ai-pipeline.md#-the-clustering-algorithm).

### ▲ No reject action

The queue offers only confirm paths. `SubmissionStatus` declares `"rejected"` but no
UI or store action sets it — see
[Data Model](03-data-model.md#submissionstatus).

### Empty state

When the queue clears, the page shows *"Queue Clear"* with a link back to `/submit`,
switching the role to `spotter` — closing the loop rather than dead-ending.

---

## ▸ `/vaccine` — Vaccine Maker

[`app/vaccine/page.tsx`](../app/vaccine/page.tsx) · 308 lines · ▲ hardcoded light theme

### Flow

```
Unvaccinated Strains (N)          ─── 2-col grid, click to select
        │  [COMPOSE VACCINE →]
        ▼
Synthesis Console  (dark panel, inverted against the light page)
        │  [AI Auto-Draft]  ◐ 600ms template, not a model call
        │  VACCINE HEADLINE / CORE TRUTH        (required)
        │  PLAIN-LANGUAGE EXPLAINER (2–3 SENTENCES)  (required)
        │  [CANCEL]              [ATTACH VACCINE TO STRAIN →]
        ▼
attachVaccine(strainId, title, explainer)
        │
        ▼
Success alert ──▸ [DEPLOY TO REGIONS (FIELD HEALTH WORKER) →] → /distribute
        │
        ▼
Ready Vaccines (M) ─── catalog with distribution counts
```

### Details

- **Two counters in the header** — red `N NEED COUNTER-CONTENT`, green
  `M VACCINES READY` — give the maker an immediate sense of backlog.
- **Selecting a strain prefills** the title as `Verification: {strain.name}` and a
  generic explainer, so the field is never blank.
- **AI Auto-Draft** branches on technique: `cloned_voice` → "synthesized using
  commercial AI voice clone filters", `out_of_context_image` → "an archived image from
  an unrelated historical incident", everything else → "fabricated without official
  regulatory grounding". A 600 ms `setTimeout` simulates latency. ◐ Not inference.
- **The synthesis console inverts** to `bg-neutral-900 text-white` against the light
  page — a deliberate "lab terminal" signal that this is the authoring surface.
- **`attachVaccine` is synchronous** — unlike `addSubmission` and `confirmSubmission`,
  it performs no inference, so there is no loading state.
- **Empty state** — when every strain is inoculated, the page shows *"All Strains
  Inoculated"* with a link forward to `/distribute`.

### The two-sentence formula

The interface asks for 2–3 sentences and the label reinforces the structure:

> **Sentence 1** exposes the manipulation technique.
> **Sentence 2** provides the verified factual anchor.

The seed vaccines model this precisely — e.g. `vac-02`: *"Water levels at the Coastal
Dam remain in the standard green zone at 64% capacity. Reverse image search confirms
the viral photograph is from a 2017 dam spillway test in Taiwan, not local
infrastructure."*

---

## ▸ `/distribute` — Field Health Worker

[`app/distribute/page.tsx`](../app/distribute/page.tsx) · 192 lines · ▲ hardcoded light theme

### Layout

```
┌─ Live Regional Herd Immunity Radar ──────────────────────────┐
│ Formula: (Distributed Vaccines ÷ Active Strains) × 100       │
│ ┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐   5-col            │
│ │Region││Region││Region││Region││Region│   name + % badge    │
│ │ 50%  ││ 50%  ││ 50%  ││ 50%  ││  0%  │   active count      │
│ │▰▰▰▱▱ ││▰▰▰▱▱ ││▰▰▰▱▱ ││▰▰▰▱▱ ││▱▱▱▱▱ │   progress bar      │
│ └──────┘└──────┘└──────┘└──────┘└──────┘                     │
└──────────────────────────────────────────────────────────────┘
┌─ Ready Vaccines Deployment Matrix (M) ───────────────────────┐
│ per strain:  technique badge · name · affected vectors       │
│              broadcast rebuttal text (title + explainer)     │
│              DISTRIBUTE VACCINE TO REGIONAL CHANNELS:        │
│              [Capital ✓] [North ● ACTIVE VECTOR] [South] …   │
└──────────────────────────────────────────────────────────────┘
```

### The three-state region button

The most information-dense control in the application. Each button encodes two
independent booleans:

| State | Condition | Styling | Meaning |
|---|---|---|---|
| Distributed | `distributed_regions.includes(region)` | emerald fill, white text, check icon | Vaccine broadcast here |
| Active vector | affected but not distributed | white, rose border and text, `ACTIVE VECTOR` tag | Outbreak here, no counter-content yet — **the priority target** |
| Neutral | neither | white, black border | Unaffected region |

Clicking toggles `toggleDistribution(strainId, regionName)`, which mutates
`distributed_regions` and immediately recomputes the immunity ticker above. The
feedback loop is instantaneous and is the clearest demonstration of the herd-immunity
mechanic in the whole product.

### Score bands

```ts
let badgeColor = "bg-rose-500 text-white";        // < 35
if (score >= 70) badgeColor = "bg-emerald-500 text-black";
else if (score >= 35) badgeColor = "bg-amber-400 text-black";
```

▲ These thresholds (70 / 35) match the specification and
[`LeafletMap`](../components/LeafletMap.tsx). The orphaned
[`MapComponent`](../components/MapComponent.tsx) uses 70 / 40 instead — a third
inconsistency documented in
[Design System](10-design-system.md#-design-tokens--quick-reference).

### Empty state

No ready vaccines → *"No Vaccines Ready For Deployment"* with a link back to
`/vaccine`, role switched to `vaccine_maker`.

---

## ▸ `/map` — Outbreak Radar

[`app/map/page.tsx`](../app/map/page.tsx) · 86 lines · ▲ hardcoded dark theme

The only role console rendered dark rather than light. A thin shell: header, the
[`LeafletMap`](../components/LeafletMap.tsx) component, and a three-panel public-health
explainer strip covering the herd immunity metric, the pre-bunking paradigm, and field
deployment.

### ▲ The radar is not a map

Despite the component name, [`LeafletMap.tsx`](../components/LeafletMap.tsx) imports no
Leaflet and renders no geography. It is a two-pane CSS layout:

```
┌─ Region Grid (left) ─────────────────┬─ Region Dossier (right) ──┐
│  ● LIVE   5 monitored regions        │  REGIONAL REPORT          │
│  ┌────────┐┌────────┐┌────────┐      │  Capital Area      50%    │
│  │▰▰▰▱▱▱▱ ││▰▰▰▱▱▱▱ ││▰▰▰▱▱▱▱ │      │  ▰▰▰▰▰▱▱▱▱▱               │
│  │01   50%││02   50%││03   50%│      │                           │
│  │Capital ││North   ││South   │      │  ACTIVE STRAINS (2)       │
│  │2 reports││2 reports││2 reports│    │  ┌──────────────────────┐ │
│  └────────┘└────────┘└────────┘      │  │ doctored_screenshot  │ │
│  ┌────────┐┌────────┐                │  │ Apex Bank Liquidity… │ │
│  │04      ││05       │               │  │ ✓ Distributed        │ │
│  └────────┘└────────┘                │  └──────────────────────┘ │
│  ● 70–100 stable ● 35–69 ● 0–34      │  [DEPLOY VACCINES →]      │
└──────────────────────────────────────┴───────────────────────────┘
```

Clicking a region tile updates the right-hand dossier: immunity bar, active strain
list with per-strain vaccine status (`Distributed` / `Vaccine Ready` / `No vaccine`),
and links onward to `/distribute` and `/strains`.

The genuine Leaflet implementation — OpenStreetMap tiles, `CircleMarker` radius
overlays, custom `divIcon` pins with immunity badges, `flyTo` on selection, and
popups with population estimates — exists in
[`MapComponent.tsx`](../components/MapComponent.tsx) and
[`MapWrapper.tsx`](../components/MapWrapper.tsx) but is imported by nothing. Wiring it
in requires computing a `Record<string, RegionStats>` from the store. See
[Component Catalog](07-component-catalog.md#-mapcomponent--mapwrapper).

This component is fully theme-aware and fully translated — it is the only role-facing
surface that calls `t()`.

---

## ▸ `/strains` — Strain Directory

[`app/strains/page.tsx`](../app/strains/page.tsx) · 235 lines · ▲ hardcoded light theme

The public reference index. No role required.

### Filtering

**Search** matches case-insensitively across three fields simultaneously — strain
name, summary, and any affected region name:

```ts
strain.name.toLowerCase().includes(q) ||
strain.summary.toLowerCase().includes(q) ||
strain.regions_affected.some(r => r.toLowerCase().includes(q))
```

**Technique filter** — seven pills (`ALL` plus the six union members), rendered with
underscores replaced by spaces. Combines with search via `AND`.

### Card anatomy

Technique badge · report count · serif name · summary · affected regions ·
distributed regions (or `"None yet"`) · action bar.

The action bar branches on vaccine status: a vaccinated strain gets a green
`INSPECT VACCINE EXPLAINER` button opening a modal; an unvaccinated strain gets a
`Synthesize Vaccine →` link to `/vaccine` with the role switched. Every card is
therefore a call to action, not a dead end.

### Vaccine modal

Target deception name, the vaccine headline and explainer in a bordered panel,
distribution list (or *"Pending regional broadcast"*), and a
`Broadcast to Regions →` link to `/distribute`.

### Empty state

*"No matching misinformation strains found. Try modifying the search query or filter
tags."*

---

## ▸ `/works` and `/works/[slug]` — ▲ Out of Domain

[`app/works/page.tsx`](../app/works/page.tsx) · [`app/works/[slug]/page.tsx`](../app/works/%5Bslug%5D/page.tsx)

A case-study archive for a Paris design studio — *"Brand identities, sensory editorial
installations, and generative AI systems created in Paris"* — reading from
[`lib/nothin-data.ts`](../lib/nothin-data.ts) (`CASE_STUDIES`: Utopia, In Cognita, …)
with Unsplash hero images.

These routes have no connection to misinformation surveillance and are not linked from
the navbar, the footer, or D0MI's navigation prompt. They are template residue from a
different project. Reachable only by typing the URL.

They are also the only consumers of `lib/nothin-data.ts` and — with
[`NothinNavbar`](../components/NothinNavbar.tsx) and
[`NothinFooter`](../components/NothinFooter.tsx), which nothing imports at all — form
a self-contained out-of-domain island. See
[Component Catalog · Out-of-domain surface](07-component-catalog.md#-out-of-domain-surface).

---

## ▸ End-to-End Journey

The complete pipeline, as a first-time visitor experiences it:

```
1  /              Read the manifesto, watch the telemetry, click through
                  the 5-stage chamber. Click REPORT A STRAIN.
                                                        role → spotter
2  /submit        Click "Sample 01" to autofill, or write a real claim.
                  Choose region and language. Submit.
                  → classifySubmission() runs
                  → diagnosis card: technique, confidence, intent, summary
                  Click SWITCH TO ANALYST DASHBOARD.
                                                        role → analyst
3  /analyst       The new report sits at the top of the queue with three
                  seed items below it. Click CONFIRM STRAIN.
                  → isSameStrain() runs against all existing strains
                  → clusters into a match above 0.70, or creates a new strain
                  Scroll to Active Clustered Strains, note NEEDS VACCINE.
                  Click Go to Vaccine Lab.
                                                        role → vaccine_maker
4  /vaccine       Pick the unvaccinated strain. Click AI Auto-Draft for a
                  scaffold, edit both fields, ATTACH VACCINE TO STRAIN.
                  Click DEPLOY TO REGIONS.
                                                        role → field_health_worker
5  /distribute    The strain now appears in the deployment matrix. Its
                  affected regions are flagged ACTIVE VECTOR in rose.
                  Click those region buttons.
                  → herd immunity ticker moves immediately
                  Click VIEW OUTBREAK RADAR MAP.
                                                        role → public_view
6  /map           The region tile shows the raised score and the strain
                  now reads "Distributed".
                  Click VIEW ALL STRAINS.

7  /strains       The strain appears with its vaccine attached and its
                  distribution list populated. Click INSPECT VACCINE
                  EXPLAINER to read the counter-content as a citizen would.

   Ctrl+K         Ask D0MI to explain any step at any point.
```

Every state change along that path survives a page reload — it is written to
`localStorage` synchronously. Clearing site data, or calling `resetToSeed()`, returns
the demo to its initial corpus.

---

[Docs Home](README.md) · [← 05 API Reference](05-api-reference.md) · **06** · [07 Component Catalog →](07-component-catalog.md)
