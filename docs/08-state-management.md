⊙ **State Management**
[Docs Home](README.md) · [← 07 Component Catalog](07-component-catalog.md) · **08** · [09 Internationalization →](09-internationalization.md)

---

# ⊙ State Management

**No Redux. No Zustand. One hook, three contexts, and `localStorage` as the source of truth.**

Four state containers. One custom hook holding domain data, three React contexts
holding cross-cutting UI preferences. No Redux, no Zustand, no server actions, no
external state library.

| Container | Kind | Scope | Persisted as |
|---|---|---|---|
| [`useVoisStore()`](#-usevoisstore--the-domain-store) | Custom hook | Per-caller | `vois_strains_v1`, `vois_submissions_v1` |
| [`LanguageContext`](#-languagecontext) | React context | Global | `vois_language` |
| [`RoleContext`](#-rolecontext) | React context | Global | `vois_current_role` |
| [`ThemeContext`](#-themecontext) | React context | Global | `vois_theme` |

---

# ▸ `useVoisStore()` — the domain store

[`lib/store.ts`](../lib/store.ts) · 389 lines

A single hook returning state and five mutators. It is **not** a context — see
[Scope and isolation](#-scope-and-isolation).

## Public interface

```ts
const {
  isLoaded,                  // boolean — hydration complete
  strains,                   // Strain[]
  submissions,               // Submission[]
  regions,                   // DEMO_REGIONS from lib/seed-data.ts

  addSubmission,             // async — SPOTTER
  confirmSubmission,         // async — ANALYST
  attachVaccine,             // sync  — VACCINE MAKER
  toggleDistribution,        // sync  — FIELD WORKER
  getRegionImmunityScore,    // sync  — RADAR
  resetToSeed,               // sync  — demo reset
} = useVoisStore();
```

Each mutator maps to exactly one role in the pipeline. The store *is* the protocol.

---

## ▸ Hydration

```
useState(INITIAL_STRAINS) / useState(INITIAL_SUBMISSIONS)   ← synchronous, SSR-safe
        │
        ▼  useEffect([fetchCloudData]) on mount
   try {
     localStorage.getItem("vois_strains_v1")      ─ present ─▸ JSON.parse → setStrains
                                                  ─ absent  ─▸ write INITIAL_STRAINS
     localStorage.getItem("vois_submissions_v1")  ─ present ─▸ JSON.parse → setSubmissions
                                                  ─ absent  ─▸ write INITIAL_SUBMISSIONS
   } catch { console.warn("Storage access failed, using memory state") }
        │
        ▼
   setIsLoaded(true)
        │
        ▼  if (isSupabaseConfigured)
   fetchCloudData()
```

Initializing state directly from the seed constants means the first render is always
populated — no loading skeleton, no hydration mismatch, and a fully functional demo
even if `localStorage` throws. `isLoaded` is exposed but no page currently reads it.

### Cloud hydration

`fetchCloudData()` issues three queries — strains, vaccine content, and submissions —
then joins vaccines onto strains through a `Map<strain_id, VaccineContent>`:

```ts
const vaccineMap = new Map<string, VaccineContent>();
cloudVaccines.forEach(v => vaccineMap.set(v.strain_id, v));
// …
vaccine: vaccineMap.get(st.id) || undefined
```

One pass, no N+1. ▲ It assumes at most one vaccine per strain — a second row silently
overwrites the first.

**Cloud wins only when non-empty.** Both branches are guarded by
`data && data.length > 0`, so a provisioned-but-unseeded database never blanks the
local demo. On success, the fetched data is written back to `localStorage`, making the
cache a mirror of the last successful sync.

Every nullable column is defaulted during normalization — the full mapping table is in
[Data Model · Cloud hydration](03-data-model.md#-cloud-hydration-mapping).

---

## ▸ `saveState` — the write primitive

```ts
const saveState = (updatedStrains: Strain[], updatedSubmissions: Submission[]) => {
  setStrains(updatedStrains);
  setSubmissions(updatedSubmissions);
  try {
    localStorage.setItem(STORAGE_KEYS.STRAINS, JSON.stringify(updatedStrains));
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updatedSubmissions));
  } catch (e) { console.warn("Saving to localStorage failed", e); }
};
```

Every mutator funnels through this. React state and durable storage move together, so
a reload never loses a completed action. Supabase writes happen *after* `saveState`,
outside it, and are never awaited.

▲ Both arrays are serialized on every write, even when only one changed. At demo scale
this is microseconds; at thousands of records it becomes a visible main-thread stall.

---

## ▸ Mutator 1 · `addSubmission` — Spotter

```ts
async addSubmission({ content_text, region, language, image_url? })
  → { submission: Submission, classification: ClassificationResult }
```

```
1  await classifySubmission(content_text)          → technique, intent, confidence, summary
2  build Submission
     id:        `sub-${Date.now()}`
     status:    "pending_review"
     ai_*:      from the classification
     created_at: new Date().toISOString()
3  saveState(strains, [newSub, ...submissions])     ← prepended; newest first
4  if (isSupabaseConfigured) → insert, fire-and-forget
5  return { submission, classification }             ← the UI renders the diagnosis card
```

The submission is prepended, so the analyst queue is newest-first without sorting.
Returning the classification lets [`/submit`](../app/submit/page.tsx) render the
diagnosis without re-reading state.

---

## ▸ Mutator 2 · `confirmSubmission` — Analyst

```ts
async confirmSubmission(submissionId, overrides?: { technique, name, intent, summary })
  → { matchedStrainId: string, isNew: boolean } | undefined
```

The most complex operation in the codebase.

```
1  find submission; return undefined if absent
2  resolve fields — overrides ?? AI suggestion ?? raw content
       technique = overrides.technique || sub.ai_suggested_technique || "other"
       summary   = overrides.summary   || sub.ai_summary || sub.content_text
       intent    = overrides.intent    || "Civic misinformation vector"
3  for each existing strain (sequential, no early exit):
       await isSameStrain(sub.content_text, strain.summary)
       keep the highest confidence where same_strain && confidence > 0.70
4  matched?
       YES → report_count += 1
             regions_affected ∪= { sub.region }        (dedup checked)
       NO  → create Strain { id: `str-${Date.now()}`, report_count: 1,
                             regions_affected: [sub.region],
                             distributed_regions: [], has_vaccine: false }
             prepend to strains; matchedStrainId = newStrain.id
5  submission.status = "confirmed"; submission.strain_id = matchedStrainId
6  saveState(...)
7  if (isSupabaseConfigured) → upsert strain, update submission
8  return { matchedStrainId, isNew: !matchedStrainId }
```

**Best-match selection.** The loop scans every strain rather than stopping at the
first hit, keeping the highest-confidence match above `0.70`. Accurate, and *O(n)* LLM
round-trips per confirmation with no batching and no early termination — the primary
scalability constraint in the system. See
[AI Pipeline · Clustering](04-ai-pipeline.md#-the-clustering-algorithm).

**▲ `isNew` is always `false`.** Step 4's create branch assigns `matchedStrainId`, so
`!matchedStrainId` can never be `true` at step 8. The analyst console's "New strain
created" message is unreachable. Fix: track the branch explicitly.

```ts
let isNew = false;
// …in the create branch:
isNew = true;
// …
return { matchedStrainId, isNew };
```

[AI Pipeline](04-ai-pipeline.md#-the-clustering-algorithm)

**▲ Closure assignment inside `.map()`.** `createdOrUpdatedStrain` is assigned from
within a `map` callback and later cast with `as Strain` to satisfy TypeScript's
narrowing. It works, but it is the kind of pattern that breaks silently under
refactoring. Building the updated strain before the map, then referencing it inside,
is clearer.

---

## ▸ Mutator 3 · `attachVaccine` — Vaccine Maker

```ts
attachVaccine(strainId, title, explainer) → VaccineContent
```

Synchronous — no inference involved.

```
1  build VaccineContent { id: `vac-${Date.now()}`, strain_id, title, explainer, created_at }
2  map strains → set has_vaccine = true and embed vaccine on the matching strain
3  saveState(updatedStrains, submissions)
4  if (isSupabaseConfigured) → insert vaccine_content AND update strains.has_vaccine
5  return newVaccine
```

Two Supabase writes, both fire-and-forget and unordered. If the vaccine insert
succeeds and the strain update fails, the cloud ends up with counter-content attached
to a strain still flagged `has_vaccine = false`. A single transaction, or an RPC,
would close this.

▲ There is no guard against attaching a second vaccine to a strain that already has
one. The client embed is overwritten; the cloud accumulates rows, and hydration then
picks whichever the `Map` saw last.

---

## ▸ Mutator 4 · `toggleDistribution` — Field Worker

```ts
toggleDistribution(strainId, regionName) → void
```

```ts
const distributed = st.distributed_regions.includes(regionName)
  ? st.distributed_regions.filter(r => r !== regionName)   // remove
  : [...st.distributed_regions, regionName];               // add
```

Idempotent by construction, no duplicates possible. The updated array is captured in
an outer `targetDistributed` variable for the Supabase write — the same closure pattern
noted above.

This is the mutator with the most immediate visible effect: the herd-immunity ticker
on [`/distribute`](../app/distribute/page.tsx) and the region tiles on
[`/map`](../app/map/page.tsx) recompute on the same render.

---

## ▸ Selector · `getRegionImmunityScore`

```ts
getRegionImmunityScore(regionName: string): number
```

```ts
const activeStrainsInRegion = strains.filter(s => s.regions_affected.includes(regionName));
if (activeStrainsInRegion.length === 0) return 100;

const distributedCount = activeStrainsInRegion.filter(s =>
  s.distributed_regions.includes(regionName)
).length;

return Math.round((distributedCount / activeStrainsInRegion.length) * 100);
```

**The zero-strain case returns 100.** A region with no active outbreak is fully
protected by definition — the alternative (`0/0`) would render `NaN`. This is a
deliberate and correct choice, but it means a 100% score is ambiguous: it can mean
"every strain here is countered" or "nothing has been reported here yet". The UI
disambiguates by showing the active-strain count alongside the score.

**Distribution counts only where affected.** A vaccine broadcast to a region with no
active strain of that type does not raise the score — the numerator filters within
`activeStrainsInRegion`. Broadcasting to unaffected regions is a no-op for the metric.

`Math.round` means a score can read 100% while a strain is still uncovered — e.g.
199/200 rounds to 100. Not reachable at demo scale.

---

## ▸ `resetToSeed`

```ts
const resetToSeed = () => saveState(INITIAL_STRAINS, INITIAL_SUBMISSIONS);
```

Restores the demo corpus locally. ▲ It does **not** clear Supabase, so a configured
deployment re-hydrates cloud state on the next mount. It is also not exposed in any
UI — reachable only from the console or a future debug affordance.

---

## ▸ Scope and isolation

`useVoisStore` is a plain hook, not a provider. **Every caller gets an independent copy
of state.**

```
app/map/page.tsx        ──▸ useVoisStore()  ─┐
                                             ├── two separate useState pairs
components/LeafletMap.tsx ──▸ useVoisStore() ─┘
```

Both read the same `localStorage` on mount, so they agree at load time and after any
reload. But a mutation in one instance does **not** re-render the other. Today this
never surfaces, because in each of the two co-mounting cases the child is the only
mutator on that page. It is nonetheless a real constraint: adding a second mutating
consumer to any route will produce a stale sibling.

**Two ways to fix it, when needed:**

**▸ Promote to a context** — wrap the app in a `VoisStoreProvider` in
[`app/layout.tsx`](../app/layout.tsx) and turn `useVoisStore` into a `useContext`
reader. Minimal call-site changes; matches the pattern already used by the other three
containers.

**▸ Cross-instance sync** — listen for the `storage` event, which also synchronizes
across browser tabs:

```ts
useEffect(() => {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEYS.STRAINS && e.newValue) setStrains(JSON.parse(e.newValue));
    if (e.key === STORAGE_KEYS.SUBMISSIONS && e.newValue) setSubmissions(JSON.parse(e.newValue));
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}, []);
```

Note the `storage` event does not fire in the tab that wrote the value, so this solves
multi-tab but not same-tab sibling instances.

---

# ▸ `LanguageContext`

[`context/LanguageContext.tsx`](../context/LanguageContext.tsx) · 3,818 lines
(3,700 of them dictionary data)

```ts
const { language, setLanguage, t } = useLanguage();
```

| Member | Type | Behaviour |
|---|---|---|
| `language` | `LanguageCode` | Defaults to `"EN"`; hydrated from `vois_language` on mount |
| `setLanguage` | `(lang) => void` | Sets state and writes `localStorage` |
| `t` | `(key: string) => string` | Three-tier lookup |

### The lookup chain

```ts
const t = (key: string): string => {
  const langDict = TRANSLATIONS[language] || TRANSLATIONS.EN;
  return langDict[key] || TRANSLATIONS.EN[key] || key;
};
```

1. Current language dictionary
2. English fallback
3. **The key itself** — a missing key renders as `radar_stable` rather than crashing
   or showing blank. Loud enough to notice in review, quiet enough not to break the
   page.

Hydration validates against the dictionary (`if (saved && TRANSLATIONS[saved])`), so a
tampered `localStorage` value falls back to English rather than producing `undefined`
lookups.

▲ `t` is recreated on every render and the context value is an inline object literal,
so every consumer re-renders whenever any provider state changes. With three providers
and a shallow tree this is not measurable, but `useMemo`/`useCallback` would be
correct if the tree grows.

Full details, the encoding audit, and the key inventory:
[Internationalization](09-internationalization.md).

---

# ▸ `RoleContext`

[`context/RoleContext.tsx`](../context/RoleContext.tsx) · 106 lines

```ts
const { role, roleInfo, setRole } = useRole();
```

`ROLES` is a `Record<RoleType, RoleInfo>` where each entry carries `id`, `title`,
`badge`, `description`, `href`, and `color` — a self-describing navigation model that
[`VoisNavbar`](../components/VoisNavbar.tsx) renders directly, with no hardcoded role
list in the component.

Defaults to `public_view`. Persisted to `vois_current_role`, validated on hydration
against the `ROLES` record.

**Advisory, not authoritative.** No route checks the role before rendering. It drives
the navbar indicator and gives the pipeline a sense of progression. Every "next step"
link in the app calls `setRole(...)` alongside navigation, so the badge tracks the
journey naturally.

▲ `RoleType` here declares `field_health_worker`; [`types/index.ts`](../types/index.ts)
declares `field_worker` for the same role. This context's definition is the operative
one — see [Data Model · RoleType](03-data-model.md#roletype).

▲ The colours in `ROLES` differ from the V0ICE accent palette used by the landing page
and hero — see [Design System · Two competing palettes](10-design-system.md#-two-competing-palettes).

---

# ▸ `ThemeContext`

[`context/ThemeContext.tsx`](../context/ThemeContext.tsx) · 76 lines

```ts
const { theme, toggleTheme, setTheme } = useTheme();
```

Defaults to `"dark"`. Persisted to `vois_theme`.

### `applyTheme` — direct DOM manipulation

```ts
const applyTheme = (t: Theme) => {
  const root = document.documentElement;
  if (t === "light") {
    root.classList.remove("dark"); root.classList.add("light");
    document.body.style.backgroundColor = "#fbfbfb";
    document.body.style.color = "#0a0a0a";
  } else {
    root.classList.remove("light"); root.classList.add("dark");
    document.body.style.backgroundColor = "#000000";
    document.body.style.color = "#ffffff";
  }
};
```

The class toggle on `<html>` is what drives Tailwind's `dark:` variants
(`darkMode: "class"` in [`tailwind.config.ts`](../tailwind.config.ts)).

▲ **Two issues.**

**1 · Inline body styles beat Tailwind.** Writing `document.body.style` sets inline
styles at the highest specificity, permanently overriding the `bg-black text-white`
utilities declared in [`app/layout.tsx`](../app/layout.tsx). The two mechanisms fight;
the inline styles always win. It works, but the layout's body classes are effectively
dead.

**2 · Light mode is `#fbfbfb`, not `#ffffff`.** The applied light background is
`studio-50` off-white, while [`app/globals.css`](../app/globals.css) declares
`body { background-color: #ffffff }` and the documentation promises "Pure White
`#FFFFFF`". A small but real divergence — see
[Design System](10-design-system.md#-the-light-mode-background-discrepancy).

**3 · No system preference detection.** Despite the claim of "system sync", there is
no `matchMedia("(prefers-color-scheme: dark)")` anywhere. A first-time visitor always
gets dark mode regardless of OS setting.

### Theme flash

[`app/layout.tsx`](../app/layout.tsx) hardcodes `<html className="dark …">` and
`<body className="bg-black text-white …">` in the server-rendered markup.
`ThemeProvider` only corrects this in a mount effect — so a returning light-mode
visitor sees a dark frame before the swap.

The standard remedy is a small blocking script in `<head>` that reads `localStorage`
and stamps the class before first paint. See
[Design System](10-design-system.md#-theme-flash).

---

## ▸ Storage Key Reference

| Key | Written by | Value | Validated on read |
|---|---|---|---|
| `vois_strains_v1` | [`lib/store.ts`](../lib/store.ts) | `Strain[]` JSON | × `JSON.parse` only |
| `vois_submissions_v1` | [`lib/store.ts`](../lib/store.ts) | `Submission[]` JSON | × `JSON.parse` only |
| `vois_language` | [`LanguageContext`](../context/LanguageContext.tsx) | `LanguageCode` | ● against `TRANSLATIONS` |
| `vois_current_role` | [`RoleContext`](../context/RoleContext.tsx) | `RoleType` | ● against `ROLES` |
| `vois_theme` | [`ThemeContext`](../context/ThemeContext.tsx) | `"dark" \| "light"` | ● explicit equality |
| `VOIS_GROQ_API_KEY` | ▲ never written | — | read by [`lib/groq.ts`](../lib/groq.ts) |

The `_v1` suffix on the two data keys is a deliberate migration hook: a breaking shape
change becomes `_v2`, and stale caches are ignored rather than parsed into broken
objects.

▲ The two data keys are `JSON.parse`d with no schema validation. Corrupt or tampered
storage produces malformed objects that flow straight into rendering. The parse itself
is inside a `try/catch`, so a syntax error is survivable — but a *valid* JSON document
of the wrong shape is not caught. A runtime schema check at the hydration boundary
would close this.

---

## ▸ Data Flow Summary

```
                    ┌──────────────────────────────────────┐
                    │  localStorage  (source of truth)      │
                    └───────────┬──────────────────┬────────┘
                    read on mount│                  │write on every mutation
                                ▼                  │
   INITIAL_STRAINS ──▸ ┌────────────────────────────┴──┐
   INITIAL_SUBMISSIONS─▸│      useVoisStore()          │
                        │  strains · submissions       │
                        └──┬────────────────────────┬──┘
                           │ read                   │ fire-and-forget mirror
                           ▼                        ▼
              ┌────────────────────────┐   ┌──────────────────┐
              │ /submit  /analyst      │   │ Supabase (PG)    │
              │ /vaccine /distribute   │   │ optional, silent │
              │ /map /strains /        │   │ on failure       │
              └────────────────────────┘   └──────────────────┘
                           ▲
                           │ cross-cutting
              ┌────────────┴─────────────────────────────┐
              │ ThemeContext · LanguageContext · RoleContext │
              └──────────────────────────────────────────┘
```

---

[Docs Home](README.md) · [← 07 Component Catalog](07-component-catalog.md) · **08** · [09 Internationalization →](09-internationalization.md)
