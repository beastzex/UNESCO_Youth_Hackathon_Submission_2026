▦ **Data Model**
[Docs Home](README.md) · [← 02 Architecture](02-architecture.md) · **03** · [04 AI Pipeline →](04-ai-pipeline.md)

---

# ▦ Data Model

**Three tables, two relationships, and one derived number that everything else exists to produce.**

## Entity Relationships

Three entities, two relationships, one derived metric.

```
┌──────────────────────────┐
│  Submission              │   one citizen sighting
│──────────────────────────│
│ id            string     │
│ content_text  string     │
│ image_url?    string     │
│ region        string     │──── free-text region name, matched by string equality
│ language      string     │
│ ai_suggested_technique   │
│ ai_confidence number     │
│ ai_summary    string     │
│ status        enum       │   pending_review | confirmed | rejected
│ strain_id?    string ────┼──┐
│ created_at    ISO string │  │
└──────────────────────────┘  │  many-to-one
                              │
                              ▼
┌──────────────────────────────────────┐
│  Strain                              │   a clustered false claim
│──────────────────────────────────────│
│ id                 string            │
│ name               string            │
│ technique          TechniqueType     │
│ intent             string            │
│ summary            string            │
│ report_count       number            │   incremented on each cluster hit
│ regions_affected   string[]          │   union of contributing submission regions
│ distributed_regions string[]         │   where the vaccine has been broadcast
│ has_vaccine        boolean           │
│ created_at         ISO string        │
│ vaccine?           VaccineContent ───┼──┐
└──────────────────────────────────────┘  │  one-to-one (embedded client-side,
                              ▲           │  separate table server-side)
                              │           ▼
                              │  ┌──────────────────────────┐
                              └──│  VaccineContent          │
                        strain_id│──────────────────────────│
                                 │ id         string        │
                                 │ strain_id  string        │
                                 │ title      string        │
                                 │ explainer  string        │
                                 │ created_at ISO string    │
                                 └──────────────────────────┘

  Derived, never stored:
  herdImmunity(region) = |{s : region ∈ s.distributed_regions}|
                       ÷ |{s : region ∈ s.regions_affected}|  × 100
```

`regions_affected` and `distributed_regions` are denormalized string arrays on the
strain rather than a join table. Region identity is by **exact name string** — the
literal `"Capital Area"`, not an ID. Every producer and consumer must agree on
spelling.

---

## ▸ Enumerations

Defined in [`types/index.ts`](../types/index.ts) and mirrored structurally in
[`lib/seed-data.ts`](../lib/seed-data.ts).

### TechniqueType

```ts
type TechniqueType =
  | "deepfake"              // synthetic video or photo of a real person
  | "out_of_context_image"  // authentic media, false time/place attribution
  | "fabricated_statistic"  // invented numbers, fake studies, pseudo-infographics
  | "cloned_voice"          // synthesized speech impersonating an authority
  | "doctored_screenshot"   // forged notices, altered posts, fake institutional comms
  | "other";                // catch-all; the classifier's default
```

The union is closed and appears in six places: the type file, the seed-data types, the
Groq system prompt, the analyst override `<select>`, the strain-directory filter bar,
and the heuristic fallback ladder. Adding a member requires editing all six.

### SubmissionStatus

```ts
type SubmissionStatus = "pending_review" | "confirmed" | "rejected";
```

▲ `"rejected"` is declared but unreachable — no code path in the application sets it.
The analyst console offers *Confirm* and *Edit & Confirm*, with no reject action.
Rejection is a schema affordance awaiting a UI. See
[Data Model](03-data-model.md#submissionstatus).

### RoleType

▲ Two incompatible definitions exist.

| Source | Members |
|---|---|
| [`types/index.ts`](../types/index.ts) | `spotter · analyst · vaccine_maker · field_worker · public_view` |
| [`context/RoleContext.tsx`](../context/RoleContext.tsx) | `spotter · analyst · vaccine_maker · field_health_worker · public_view` |

The fourth member differs: `field_worker` versus `field_health_worker`. The
application imports `RoleType` from `RoleContext`, so `field_health_worker` is the
operative value and the persisted `vois_current_role` string. The `types/index.ts`
variant is dead. See [Data Model](03-data-model.md#-the-two-type-sources--and-which-one-actually-runs).

---

## ▸ The Two Type Sources — and Which One Actually Runs

The most consequential structural fact about the data layer: `Strain`, `Submission`,
and `VaccineContent` are each declared **twice**, in files with different consumers.

| | [`types/index.ts`](../types/index.ts) | [`lib/seed-data.ts`](../lib/seed-data.ts) |
|---|---|---|
| Imported by | `Badge`, `StatsHeader`, `MapComponent`, `lib/regions`, `lib/initial-data` | `lib/store`, `/analyst`, `/vaccine`, `/strains`, `scripts/seed` |
| Live? | ○ reachable only via orphaned components | ● the operative definition |
| `ai_suggested_technique` | `TechniqueType?` — optional, typed | `string` — required, untyped |
| `ai_confidence` | `number?` optional | `number` required |
| `ai_summary` | `string?` optional | `string` required |
| `strain_id` | `string \| null \| undefined` | `string \| undefined` |
| `Strain.intent` | `string?` optional | `string` required |
| `Strain.submissions_count` | present | absent |
| Extra types | `RegionInfo`, `RegionStats`, `AIClassificationResponse`, `AIStrainMatchResponse` | `DEMO_REGIONS` (different shape) |

The practical consequence is visible in [`app/analyst/page.tsx`](../app/analyst/page.tsx),
which renders `sub.ai_confidence * 100` and `sub.ai_summary.slice(...)` with no
optional guards — safe only because it imports the seed-data variant where both fields
are required. Swapping the import to `@/types` would break the build under
`strict: true`.

**Recommendation:** consolidate on [`types/index.ts`](../types/index.ts), make the
`ai_*` fields required to match runtime reality, and have `lib/seed-data.ts` import
rather than redeclare.

---

## ▸ Region Definitions

Also declared twice, with **different coordinates and different shapes**.

### `DEMO_REGIONS` in [`lib/seed-data.ts`](../lib/seed-data.ts) ● live

```ts
{ id: "north",   name: "North District",  lat: 28.7041, lng: 77.1025 }
{ id: "south",   name: "South District",  lat: 12.9716, lng: 77.5946 }
{ id: "coastal", name: "Coastal Region",  lat: 18.9220, lng: 72.8347 }
{ id: "capital", name: "Capital Area",    lat: 28.6139, lng: 77.2090 }
{ id: "rural",   name: "Rural Belt",      lat: 25.5941, lng: 85.1376 }
```

Re-exported by the store as `regions` and consumed by `/submit`, `/distribute`,
`/map`, and `LeafletMap`. Flat `lat`/`lng` numbers; no description or population.

### `DEMO_REGIONS` in [`lib/regions.ts`](../lib/regions.ts) ○ orphaned

```ts
{
  id: "capital-area",
  name: "Capital Area",
  coordinates: [28.6139, 77.2090],   // [lat, lng] tuple — Leaflet's format
  description: "Dense metropolitan administrative and media hub…",
  populationEstimate: "18.5M",
  bounds?: [[lat,lng],[lat,lng]]
}
```

Richer `RegionInfo` records with narrative descriptions and population estimates,
consumed only by the orphaned [`MapComponent`](../components/MapComponent.tsx). Also
exports `DEMO_LANGUAGES` (5 entries) and a `getRegionByName()` lookup — neither used.

### The divergences

| Region | seed-data | regions.ts | Same? |
|---|---|---|---|
| Capital Area | 28.6139, 77.2090 | 28.6139, 77.2090 | ● |
| South District | 12.9716, 77.5946 | 12.9716, 77.5946 | ● |
| Coastal Region | 18.9220, 72.8347 | 18.9220, 72.8347 | ● |
| North District | 28.7041, 77.1025 | 30.7333, 76.7794 | ▲ ~230 km apart |
| Rural Belt | 25.5941, 85.1376 | 24.5854, 78.4350 | ▲ ~680 km apart |

Region **IDs** also differ (`north` vs `north-district`), though names match — and
names are what the strain arrays key on, so the data still joins correctly. Only the
map pins would land in different places.

---

## ▸ PostgreSQL Schema

[`supabase/migrations/001_init.sql`](../supabase/migrations/001_init.sql), 46 lines,
executed once in the Supabase SQL editor.

```sql
CREATE TABLE IF NOT EXISTS strains (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 TEXT NOT NULL,
  technique            TEXT NOT NULL,
  intent               TEXT,
  summary              TEXT,
  report_count         INT DEFAULT 1,
  regions_affected     TEXT[] DEFAULT '{}',
  distributed_regions  TEXT[] DEFAULT '{}',
  has_vaccine          BOOLEAN DEFAULT FALSE,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submissions (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_text           TEXT NOT NULL,
  image_url              TEXT,
  region                 TEXT NOT NULL,
  language               TEXT NOT NULL,
  ai_suggested_technique TEXT,
  ai_confidence          FLOAT,
  ai_summary             TEXT,
  status                 TEXT DEFAULT 'pending_review',
  strain_id              UUID REFERENCES strains(id) ON DELETE SET NULL,
  created_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vaccine_content (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strain_id  UUID REFERENCES strains(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  explainer  TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submissions_status       ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_strain_id    ON submissions(strain_id);
CREATE INDEX IF NOT EXISTS idx_strains_has_vaccine      ON strains(has_vaccine);
CREATE INDEX IF NOT EXISTS idx_vaccine_content_strain_id ON vaccine_content(strain_id);
```

**Referential integrity.** `submissions.strain_id → strains.id ON DELETE SET NULL`
orphans reports rather than deleting them. `vaccine_content.strain_id → strains.id
ON DELETE CASCADE` removes counter-content with its target — correct, since a vaccine
has no meaning without its strain.

**Indexes.** Four B-trees covering the analyst queue filter (`status`), the
submissions-per-strain lookup, the vaccine-maker's unvaccinated filter
(`has_vaccine`), and the vaccine join.

### ▲ Two defects in this migration

**1 · Primary keys are `UUID`; the application generates prefixed strings.**

| Producer | Generated ID | Valid UUID? |
|---|---|---|
| [`lib/store.ts`](../lib/store.ts) `addSubmission` | `sub-1755385200000` | × |
| [`lib/store.ts`](../lib/store.ts) `confirmSubmission` | `str-1755385200000` | × |
| [`lib/store.ts`](../lib/store.ts) `attachVaccine` | `vac-1755385200000` | × |
| [`lib/seed-data.ts`](../lib/seed-data.ts) | `str-01` … `sub-08`, `vac-01` | × |
| [`scripts/seed.ts`](../scripts/seed.ts) | posts the above verbatim | × |

Every insert fails with `22P02 invalid input syntax for type uuid`. Because store
writes are fire-and-forget with `console.warn` handlers, the failure is silent and the
app continues on `localStorage`. The seeder does report the error — it prints the
PostgREST body — but exits `0`.

The fix is to widen the columns to `TEXT`, matching the IDs the application actually
produces:

```sql
ALTER TABLE submissions      DROP CONSTRAINT submissions_strain_id_fkey;
ALTER TABLE vaccine_content  DROP CONSTRAINT vaccine_content_strain_id_fkey;
ALTER TABLE strains          ALTER COLUMN id        TYPE TEXT, ALTER COLUMN id DROP DEFAULT;
ALTER TABLE submissions      ALTER COLUMN id        TYPE TEXT, ALTER COLUMN id DROP DEFAULT;
ALTER TABLE submissions      ALTER COLUMN strain_id TYPE TEXT;
ALTER TABLE vaccine_content  ALTER COLUMN id        TYPE TEXT, ALTER COLUMN id DROP DEFAULT;
ALTER TABLE vaccine_content  ALTER COLUMN strain_id TYPE TEXT;
ALTER TABLE submissions      ADD CONSTRAINT submissions_strain_id_fkey
  FOREIGN KEY (strain_id) REFERENCES strains(id) ON DELETE SET NULL;
ALTER TABLE vaccine_content  ADD CONSTRAINT vaccine_content_strain_id_fkey
  FOREIGN KEY (strain_id) REFERENCES strains(id) ON DELETE CASCADE;
```

Tracked as [Data Model](03-data-model.md#-two-defects-in-this-migration).

**2 · No row-level security.** The migration contains no
`ALTER TABLE … ENABLE ROW LEVEL SECURITY` and no `CREATE POLICY`, despite both
[`README.md`](../README.md) stating RLS is configured.
See [Setup & Operations](11-setup-and-operations.md#4---enable-row-level-security).

### Absent from the schema

`status` and `technique` are plain `TEXT` with no `CHECK` constraint — any string is
accepted. There is no unique constraint on strain name, no author column, no
`updated_at`, and no soft-delete flag.

---

## ▸ Seed Corpora

Two exist. One is live.

### ● `lib/seed-data.ts` — the operative corpus

5 strains, 8 submissions, 3 embedded vaccines. Timestamps are computed relative to
`Date.now()` at module evaluation, so the demo always reads as "recent".

| ID | Strain | Technique | Reports | Affected | Distributed | Vaccine |
|---|---|---|---|---|---|---|
| `str-01` | Apex Bank Liquidity Freeze Hoax | doctored_screenshot | 5 | Capital, North, Coastal | Capital, North | ● |
| `str-02` | Coastal Dam Breach Catastrophe Imagery | out_of_context_image | 4 | Coastal, South | Coastal | ● |
| `str-03` | Electoral Ballot Scanner Tamper Audio | cloned_voice | 3 | Rural, North | — | ○ |
| `str-04` | Synthetic Tap Water Toxicity Study | fabricated_statistic | 2 | South, Rural | South | ● |
| `str-05` | Deepfake Mayoral Curfew Declaration | deepfake | 1 | Capital | — | ○ |

Submissions `sub-01`–`sub-05` are `confirmed` and linked to `str-01`–`str-05`.
Submissions `sub-06`–`sub-08` are `pending_review` — these are what populate the
analyst queue on a fresh load, giving an evaluator three items to triage immediately.

The corpus is deliberately shaped so that all five techniques and all five regions
appear, and so that the herd-immunity gauge shows all three colour bands at once:

| Region | Active | Distributed | Score | Band |
|---|---|---|---|---|
| Capital Area | str-01, str-05 | str-01 | 50% | amber |
| North District | str-01, str-03 | str-01 | 50% | amber |
| Coastal Region | str-01, str-02 | str-02 | 50% | amber |
| South District | str-02, str-04 | str-04 | 50% | amber |
| Rural Belt | str-03, str-04 | — | 0% | red |

### ○ `lib/initial-data.ts` — orphaned duplicate

221 lines, `str-001`-style IDs, different strain names ("Synthetic Ministry Emergency
Grid Shutdown Alert", "Cloned Mayor Voice Note on Tap Water Contamination"). Imports
its types from `@/types` rather than `./seed-data`. Nothing imports it. It appears to
be an earlier draft superseded by `seed-data.ts`. Safe to delete.

### The seeder

[`scripts/seed.ts`](../scripts/seed.ts) — Node, run via `npm run seed`. Loads
`.env.local` through `dotenv`, then POSTs each record to the PostgREST endpoint
directly with `fetch` (not the Supabase SDK), using
`Prefer: resolution=merge-duplicates` for idempotent upserts. Prefers
`SUPABASE_SERVICE_ROLE_KEY`, falling back to the anon key.

▲ It omits `image_url` from the submission payload — harmless, since no seed record
has one — and blocked entirely by the UUID mismatch above.

---

## ▸ ID Generation

```ts
`sub-${Date.now()}`   // submissions
`str-${Date.now()}`   // strains
`vac-${Date.now()}`   // vaccine content
```

Millisecond-resolution timestamps with a type prefix. Readable and sortable, but:

- **Collision risk** — two submissions in the same millisecond collide. Single-user
  interaction makes this improbable; concurrent multi-user use makes it real.
- **No global uniqueness** — two browsers acting independently will generate
  identical IDs. The local-first model makes this a genuine merge hazard once cloud
  sync works.
- **Enumerable** — IDs leak creation time and ordering.

`crypto.randomUUID()` would fix all three and satisfy the existing `UUID` schema
without a migration. The trade-off is losing the readable `str-`/`sub-`/`vac-` prefix
that currently makes console output and the analyst's clustering notice legible.

---

## ▸ Cloud Hydration Mapping

[`fetchCloudData()`](../lib/store.ts) normalizes Postgres rows into client shapes,
applying defaults for every nullable column:

| Column | Client field | Default when null |
|---|---|---|
| `intent` | `intent` | `""` |
| `summary` | `summary` | `""` |
| `report_count` | `report_count` | `1` |
| `regions_affected` | `regions_affected` | `[]` |
| `distributed_regions` | `distributed_regions` | `[]` |
| `has_vaccine` | `has_vaccine` | `Boolean(...)` coercion |
| `ai_suggested_technique` | `ai_suggested_technique` | `"other"` |
| `ai_confidence` | `ai_confidence` | `0.85` |
| `ai_summary` | `ai_summary` | `""` |
| `status` | `status` | `"pending_review"` |
| `strain_id` | `strain_id` | `undefined` |

Vaccines are fetched as a flat list and joined client-side through a
`Map<strain_id, VaccineContent>` — a single pass, no N+1. Note this assumes **one
vaccine per strain**; if a strain ever has two rows, the later one silently wins.

---

[Docs Home](README.md) · [← 02 Architecture](02-architecture.md) · **03** · [04 AI Pipeline →](04-ai-pipeline.md)
