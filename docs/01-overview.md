◈ **Overview & Vision**
[Docs Home](README.md) · **01** · [02 Architecture →](02-architecture.md)

---

# ◈ Overview & Vision

**Why we stopped writing corrections and started running an immune system.**

## The Thesis

Fact-checking loses because it is structurally too slow. An article takes 24–72 hours
to publish; a forwarded voice note peaks in the first two hours. By the time the
correction lands, belief has already formed — and correcting a formed belief triggers
the backfire effect, which can entrench the falsehood further.

V0ICE inverts the model. Instead of correcting after infection, it **inoculates before
exposure** — and it does so through a distributed network of citizens rather than a
centralized editorial desk.

The organizing metaphor is epidemiological, and it is carried all the way down into
the data model and the UI vocabulary:

| Public health concept | V0ICE implementation |
|---|---|
| Pathogen | **Strain** — a clustered false claim ([`Strain`](../types/index.ts)) |
| Case report | **Submission** — one citizen sighting ([`Submission`](../types/index.ts)) |
| Diagnosis | Groq classification into one of six manipulation techniques |
| Contact tracing | `isSameStrain()` semantic clustering of reworded variants |
| Vaccine | **Vaccine content** — a two-sentence plain-language pre-bunk |
| Vaccination campaign | Distribution of a vaccine to a named region |
| Herd immunity | `(distributed ÷ active strains) × 100` per region |
| Outbreak map | The surveillance radar at [`/map`](../app/map/page.tsx) |

---

## Hackathon Framing

- **Event** — UNESCO Youth Hackathon 2026
- **Theme** — *Play Your Part: Youth Designing the Future of Media and Information Literacy*
- **Position** — youth as active architects of information integrity, not passive targets

### The four challenges addressed

**▸ 1. Synthetic media proliferation**
Generative deepfakes, cloned voices, and doctored screenshots now appear in elections
and crises at scale. V0ICE encodes these as first-class taxonomy members — the
[`TechniqueType`](../types/index.ts) union is `deepfake | out_of_context_image |
fabricated_statistic | cloned_voice | doctored_screenshot | other`, and every
submission is auto-tagged against it.

**▸ 2. Speed asymmetry**
Falsehoods outrun truth. The counter is sub-second inference: Groq's
`openai/gpt-oss-120b` classifies intent, technique, and confidence in a single
round-trip, and a deterministic heuristic engine answers instantly when the model is
unavailable. See [AI Pipeline](04-ai-pipeline.md).

**▸ 3. Language and regional inequity**
Verification tooling is overwhelmingly English-only. V0ICE ships a 24-language
dictionary covering every string in the interface — 3,624 translated values. See
[Internationalization](09-internationalization.md).

**▸ 4. The passive consumer mindset**
Reading a debunk is passive. V0ICE gives every citizen a *role* with a console, a
queue, and a measurable regional effect. See [Routes & Roles](06-routes-and-roles.md).

---

## The Response Protocol

Five roles form a directed pipeline. Each has a dedicated route, a distinct accent
colour, and a store action that advances platform state.

```
  01              02               03                04                05
┌────────┐   ┌──────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────┐
│SPOTTER │──▸│ ANALYST  │──▸│VACCINE MAKER │──▸│ FIELD WORKER │──▸│  RADAR   │
└────────┘   └──────────┘   └──────────────┘   └──────────────┘   └──────────┘
 /submit      /analyst          /vaccine          /distribute         /map
 violet        blue              green             yellow              red
 #8B5CF6      #3B82F6           #22C55E           #EAB308            #EF4444

 ingest    →  classify     →   synthesize     →   broadcast      →  measure
 raw text     + cluster        2-sentence         per-region        herd
 + region     into strain      pre-bunk           distribution      immunity

 addSubmission confirmSubmission attachVaccine  toggleDistribution getRegionImmunityScore
```

### ▸ 01 · Spotter — frontline intake

Any citizen submits a suspicious claim: a forwarded message, a voice-note transcript,
a screenshot description, an image URL, plus the affected region and content language.
The submission is auto-classified on arrival — technique, likely intent, confidence
score (0.00–1.00), and a one-sentence plain-language summary — and lands in the
analyst queue with status `pending_review`.

Route: [`app/submit/page.tsx`](../app/submit/page.tsx)

### ▸ 02 · Analyst — triage and strain clustering

A fact-checker reviews the raw content alongside the AI's suggested diagnosis. On
confirm, the system runs `isSameStrain()` against every existing confirmed strain.
A match above 0.70 confidence clusters the report into that strain — incrementing its
report count and extending its affected-region set. No match creates a new strain.
The analyst may override technique, title, and summary before confirming.

Route: [`app/analyst/page.tsx`](../app/analyst/page.tsx)

### ▸ 03 · Vaccine Maker — plain-language inoculation

An educator or communicator writes the counter-content against a confirmed strain,
following a two-part formula:

> **Sentence 1** names the manipulation technique.
> **Sentence 2** supplies the verified factual anchor.

The output must survive being forwarded through a messaging app — short, concrete,
free of jargon and of hedging.

Route: [`app/vaccine/page.tsx`](../app/vaccine/page.tsx)

### ▸ 04 · Field Health Worker — grassroots broadcast

A community leader toggles distribution of a ready vaccine into named regions —
WhatsApp groups, Telegram channels, school networks. Each toggle mutates
`distributed_regions` on the strain, which immediately moves that region's herd
immunity score.

Route: [`app/distribute/page.tsx`](../app/distribute/page.tsx)

### ▸ 05 · Surveillance Lead — outbreak radar

The public view. Per-region immunity scores, active strain lists, vaccine status, and
a colour-coded containment gauge.

$$\text{Herd Immunity} = \left(\frac{\text{strains distributed to region}}{\text{strains active in region}}\right) \times 100$$

| Band | Status | Colour |
|---|---|---|
| 70–100% | Stable community inoculation | `#22C55E` green |
| 35–69% | Inoculation in progress | `#EAB308` amber |
| 0–34% | Critical vector outbreak | `#EF4444` red |

A region with zero active strains scores 100 by definition — see
[`getRegionImmunityScore`](../lib/store.ts) in [State Management](08-state-management.md).

Routes: [`app/map/page.tsx`](../app/map/page.tsx), [`app/strains/page.tsx`](../app/strains/page.tsx)

---

## D0MI — the embedded assistant

**D0MI** (Digital Operations & Media Intelligence) is mounted globally in the root
layout and reachable from every route via `Ctrl/Cmd + K`. It is the only part of the
system that talks to a live model on every interaction, because it routes through a
server-side handler that holds the API key.

It is briefed on the platform's own navigation graph, UNESCO's MIL framework, and
synthetic-media forensics, and it renders full markdown — tables, code blocks,
blockquotes, numbered steps, and clickable in-app route pills.

Details: [AI Pipeline · D0MI](04-ai-pipeline.md#-capability-3--d0mi-conversational-assistant) ·
[API Reference](05-api-reference.md#-post-apidomi)

---

## Design Principles in Force

**▸ Local-first, cloud-optional.**
The app boots and runs a complete demonstration with zero environment variables.
Supabase and Groq are progressive enhancements, each behind a configuration guard.
This is deliberate — a hackathon judge, a workshop participant on airport Wi-Fi, and
a field volunteer with no credentials all get a working system.

**▸ Every AI call has a deterministic fallback.**
Classification and strain matching both degrade to keyword and lexical-overlap
heuristics rather than failing. The interface never blocks on inference.

**▸ Optimistic UI.**
State is written to React state and `localStorage` first, then pushed to Supabase in
a fire-and-forget promise. Cloud errors are logged, never surfaced as blocking
failures.

**▸ Role as first-class navigation.**
The active role persists across sessions and drives the navbar's role strip. Moving
through the pipeline is an explicit act, not an implicit one.

---

## Where This Document Ends

The conceptual model above is fully realized in code with three material exceptions,
each documented rather than glossed over:

| ▲ | Divergence | Detail |
|---|---|---|
| 1 | The live map is not Leaflet | The rendered radar is a CSS grid; the Leaflet implementation exists but is orphaned — [Component Catalog](07-component-catalog.md#-mapcomponent--mapwrapper) |
| 2 | Browser-side classification is heuristic-only | The Groq key is server-only by design, so the client path falls through — [AI Pipeline](04-ai-pipeline.md#-the-key-resolution-problem--why-groq-never-answers-the-browser) |
| 3 | Supabase sync fails on ID type | The migration declares `UUID` primary keys; the store generates prefixed strings — [Data Model](03-data-model.md#-two-defects-in-this-migration) |

---

[Docs Home](README.md) · **01** · [02 Architecture →](02-architecture.md)
