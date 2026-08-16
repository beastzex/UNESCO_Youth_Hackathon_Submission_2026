▣ **Setup & Operations**
[Docs Home](README.md) · [← 10 Design System](10-design-system.md) · **11**

---

# ▣ Setup & Operations

**It runs with zero configuration and zero cost. This document is everything else.**

## ▸ Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | 18.17+ or 20+ | Next.js 14 minimum |
| npm | 9+ | `yarn` and `pnpm` work; the lockfile is npm |
| Groq API key | — | Optional. Free tier at [console.groq.com](https://console.groq.com) |
| Supabase project | — | Optional. Free tier at [supabase.com](https://supabase.com) |

**Both credentials are optional.** The application boots and runs a complete
demonstration with zero configuration — see [Zero-config mode](#-zero-config-mode--what-works-with-no-credentials-at-all).

---

## ▸ Quickstart

```bash
git clone <repository-url>
cd UNESCO_Youth_Hackathon_Submission_2026
npm install
npm run dev
```

Open **http://localhost:3000**. Five strains, eight submissions, and three pending
triage items are already loaded.

---

## ▸ Zero-Config Mode — What Works With No Credentials At All

What works, and what does not, without any environment variables:

| Capability | Status | Mechanism |
|---|---|---|
| All 9 routes | ● full | — |
| 5 seed strains, 8 submissions | ● full | [`lib/seed-data.ts`](../lib/seed-data.ts) |
| Submit → classify | ● full | ◐ heuristic keyword engine, not Groq |
| Analyst → cluster | ● full | ◐ lexical overlap, not Groq |
| Vaccine synthesis | ● full | Template auto-draft + human authoring |
| Distribution & immunity | ● full | Pure client arithmetic |
| Outbreak radar | ● full | Live store data |
| Persistence across reloads | ● full | `localStorage` |
| 24-language switching | ● full | Bundled dictionaries |
| Theme toggle | ● full | — |
| **D0MI assistant** | × | Returns an in-character "add `GROQ_API_KEY`" message |
| **Cross-device sync** | × | Requires Supabase |

This is deliberate. A judge opening the repository, a workshop participant on
conference Wi-Fi, and a field volunteer without credentials all get a working system.
See [Architecture · Configuration guards](02-architecture.md#-configuration-guards).

---

## ▸ Environment Variables

Copy the template and fill in what you have:

```bash
cp .env.example .env.local
```

```env
# Groq — powers openai/gpt-oss-120b for D0MI and the server classification routes
# Free key at https://console.groq.com
GROQ_API_KEY=gsk_your_key_here

# Supabase — PostgreSQL persistence and cross-device sync
# Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

| Variable | Scope | Required | Used by |
|---|---|---|---|
| `GROQ_API_KEY` | **server only** | no | [`/api/domi`](../app/api/domi/route.ts), [`/api/classify`](../app/api/classify/route.ts), [`/api/match-strain`](../app/api/match-strain/route.ts) |
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | no | [`lib/supabase.ts`](../lib/supabase.ts), [`scripts/seed.ts`](../scripts/seed.ts) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server | no | [`lib/supabase.ts`](../lib/supabase.ts) |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | no | [`scripts/seed.ts`](../scripts/seed.ts) only |

▲ **Never prefix `GROQ_API_KEY` with `NEXT_PUBLIC_`.** [`lib/groq.ts`](../lib/groq.ts)
runs in the browser with `dangerouslyAllowBrowser: true`, so a public-prefixed key
would be embedded in the client bundle and readable by anyone. Its server-only scope
is the reason no key currently leaks. See
[AI Pipeline](04-ai-pipeline.md#-the-key-resolution-problem--why-groq-never-answers-the-browser).

▲ `SUPABASE_SERVICE_ROLE_KEY` bypasses row-level security entirely. It is used only by
the local seeder and must never reach a client bundle or a deployed environment that
does not need it.

`.gitignore` covers `.env*` — verified. See
[Setup & Operations](11-setup-and-operations.md#-environment-variables).

---

## ▸ Database Provisioning

Only needed for cross-device persistence.

### 1 · Run the migration

Supabase Dashboard → **SQL Editor** → paste
[`supabase/migrations/001_init.sql`](../supabase/migrations/001_init.sql) → **Run**.

Creates `strains`, `submissions`, `vaccine_content`, and four indexes.

### 2 · ▲ Apply the primary-key correction

**This step is mandatory.** The migration declares `UUID` primary keys, but the
application generates prefixed string IDs (`str-…`, `sub-…`, `vac-…`). Without this
correction **every write silently fails** with
`22P02 invalid input syntax for type uuid`, and the app runs entirely on
`localStorage` while appearing to sync.

Run this in the SQL Editor immediately after the migration:

```sql
-- drop FKs so the column types can change
ALTER TABLE submissions     DROP CONSTRAINT IF EXISTS submissions_strain_id_fkey;
ALTER TABLE vaccine_content DROP CONSTRAINT IF EXISTS vaccine_content_strain_id_fkey;

-- widen the keys to TEXT
ALTER TABLE strains         ALTER COLUMN id TYPE TEXT, ALTER COLUMN id DROP DEFAULT;
ALTER TABLE submissions     ALTER COLUMN id TYPE TEXT, ALTER COLUMN id DROP DEFAULT;
ALTER TABLE vaccine_content ALTER COLUMN id TYPE TEXT, ALTER COLUMN id DROP DEFAULT;
ALTER TABLE submissions     ALTER COLUMN strain_id TYPE TEXT;
ALTER TABLE vaccine_content ALTER COLUMN strain_id TYPE TEXT;

-- restore referential integrity
ALTER TABLE submissions ADD CONSTRAINT submissions_strain_id_fkey
  FOREIGN KEY (strain_id) REFERENCES strains(id) ON DELETE SET NULL;
ALTER TABLE vaccine_content ADD CONSTRAINT vaccine_content_strain_id_fkey
  FOREIGN KEY (strain_id) REFERENCES strains(id) ON DELETE CASCADE;
```

Details: [Data Model](03-data-model.md#-two-defects-in-this-migration) ·
[Data Model](03-data-model.md#-two-defects-in-this-migration)

### 3 · Grant table access

```sql
GRANT ALL ON TABLE strains, submissions, vaccine_content TO anon, authenticated, service_role;
```

### 4 · ▲ Enable row-level security

The migration ships **no RLS and no policies**, despite
[`README.md`](../README.md) previously claiming otherwise.
With the grants above and RLS disabled, anyone holding the public anon key — which is
in the client bundle by design — can read, modify, and delete every row.

For a public demo, at minimum make writes append-only and reads public:

```sql
ALTER TABLE strains         ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccine_content ENABLE ROW LEVEL SECURITY;

-- public read
CREATE POLICY "public read strains"     ON strains         FOR SELECT USING (true);
CREATE POLICY "public read submissions" ON submissions     FOR SELECT USING (true);
CREATE POLICY "public read vaccines"    ON vaccine_content FOR SELECT USING (true);

-- public insert (citizen participation)
CREATE POLICY "public insert submissions" ON submissions     FOR INSERT WITH CHECK (true);
CREATE POLICY "public insert strains"     ON strains         FOR INSERT WITH CHECK (true);
CREATE POLICY "public insert vaccines"    ON vaccine_content FOR INSERT WITH CHECK (true);

-- updates needed by the analyst and field-worker flows
CREATE POLICY "public update strains"     ON strains     FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "public update submissions" ON submissions FOR UPDATE USING (true) WITH CHECK (true);

-- no DELETE policy → deletes are blocked for anon
```

Full discussion, including why `USING (true)` on `UPDATE` is still weak:
[Setup & Operations](11-setup-and-operations.md#4---enable-row-level-security).

### 5 · Seed

```bash
npm run seed        # or: npx tsx scripts/seed.ts
```

```
--------------------------------------------------
  VoIS: Seeding Cloud Supabase Database...
--------------------------------------------------
1. Seeding 5 confirmed misinformation strains...
2. Seeding 8 citizen submissions...
--------------------------------------------------
✓ Cloud Supabase Database successfully seeded! 🎉
--------------------------------------------------
```

The seeder POSTs directly to PostgREST with `Prefer: resolution=merge-duplicates`, so
re-running is safe and idempotent. It prefers `SUPABASE_SERVICE_ROLE_KEY`, falling back
to the anon key.

▲ The seeder prints per-record errors but **still exits `0` and prints the success
banner**. Read the output, do not trust the exit code. If step 2 was skipped you will
see a wall of `22P02` errors above the checkmark.

### 6 · Verify

Restart the dev server and check the browser console for
`Could not sync with Supabase cloud, using local cache` — its absence means sync is
working. Then confirm rows exist:

```sql
SELECT count(*) FROM strains;          -- expect 5
SELECT count(*) FROM submissions;      -- expect 8
SELECT count(*) FROM vaccine_content;  -- expect 3
```

---

## ▸ Scripts

| Command | Action |
|---|---|
| `npm run dev` | Dev server on `:3000` with HMR |
| `npm run build` | Production build |
| `npm run start` | Serve the production build (requires `build` first) |
| `npm run lint` | `next lint` |
| `npm run seed` | `tsx scripts/seed.ts` — seed Supabase |
| `npx tsc --noEmit` | Type-check without emitting |

---

## ▸ Verification Checklist

Run before any submission or deploy.

```bash
npx tsc --noEmit      # must be clean — strict: true
npm run lint
npm run build
```

Then walk the pipeline manually:

| # | Route | Check |
|---|---|---|
| 1 | `/` | Hero lens follows the cursor; all 7 scenes reveal on scroll |
| 2 | `/` | Language picker → switch to `FR`, `HI`, `JA` — strings change |
| 3 | `/` | Theme toggle inverts the landing page and chrome |
| 4 | `/submit` | Click Sample 01 → submit → diagnosis card shows technique + confidence |
| 5 | `/analyst` | The new report is at the top; **Confirm** clusters or creates |
| 6 | `/vaccine` | Unvaccinated strains listed; AI Auto-Draft fills both fields; attach works |
| 7 | `/distribute` | Immunity ticker moves the instant a region button is toggled |
| 8 | `/map` | Region tiles show scores; dossier updates on selection |
| 9 | `/strains` | Search and technique filters combine correctly |
| 10 | any | `Ctrl+K` opens D0MI; send a message; markdown and link pills render |
| 11 | any | Reload — all state survives |
| 12 | DevTools | No console errors beyond expected Supabase warnings |

**Known cosmetic findings that are not regressions** — expect these, they are
documented, not new:

- Role consoles do not follow the theme toggle
  ([Design System](10-design-system.md#-theme-coverage))
- The analyst always reports "Matched & clustered", never "New strain"
  ([AI Pipeline](04-ai-pipeline.md#-the-clustering-algorithm))
- Accented characters render incorrectly in several languages
  ([Internationalization](09-internationalization.md#--encoding-audit--22-of-24-dictionaries-are-damaged))
- The `/map` radar is a grid, not a geographic map
  ([Component Catalog](07-component-catalog.md#-mapcomponent--mapwrapper))

---

## ▸ Deployment

### Vercel — recommended

Next.js App Router deploys with no configuration.

```bash
npm i -g vercel
vercel
```

Then set the environment variables:

```bash
vercel env add GROQ_API_KEY production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel --prod
```

Do **not** add `SUPABASE_SERVICE_ROLE_KEY` — it is only needed by the local seeder.

The three API routes run as Vercel Functions on the Node runtime. No `runtime = "edge"`
directive is present, which is correct: the Node runtime supports the `openai` SDK
fully and imposes no compatibility constraints.

### Other platforms

| Platform | Notes |
|---|---|
| Netlify | Requires `@netlify/plugin-nextjs` |
| Docker | `node:20-alpine`, `npm ci && npm run build && npm start`, expose `3000` |
| Self-hosted | `npm run build && npm run start` behind a reverse proxy |

### Pre-deploy checklist

- [ ] `.env.local` is not committed — `git check-ignore -v .env.local` should report the ignore rule
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is not set in the deployment environment
- [ ] `GROQ_API_KEY` has **no** `NEXT_PUBLIC_` prefix
- [ ] RLS enabled with policies ([step 4](#4---enable-row-level-security))
- [ ] Primary-key correction applied ([step 2](#2---apply-the-primary-key-correction))
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run build` succeeds
- [ ] Rate limiting configured in front of `/api/*` — the routes are unauthenticated
      ([API Reference](05-api-reference.md#-operational-notes))
- [ ] `next.config.mjs` image `hostname: '**'` narrowed if remote images are used
      ([Architecture](02-architecture.md#-build--type-configuration))

---

## ▸ Troubleshooting

**D0MI replies "Groq API key is missing"**
`GROQ_API_KEY` is absent from the server environment. Locally, confirm `.env.local`
exists and restart `npm run dev` — Next.js reads env files only at startup.

**D0MI replies "momentary communication glitch"**
The Groq call threw. Check the server console for `D0MI API error:`. Common causes: an
invalid key, an exhausted quota, or network egress blocked. A `429` triggers the
`llama-3.3-70b-versatile` fallback automatically; seeing this message means the
fallback also failed.

**Classification always returns the same technique**
Expected without correction — browser-side classification uses the heuristic keyword
ladder, not Groq, because the key is server-only. The ladder is deterministic. See
[AI Pipeline · Key resolution](04-ai-pipeline.md#-the-key-resolution-problem--why-groq-never-answers-the-browser) and
[AI Pipeline](04-ai-pipeline.md#-the-key-resolution-problem--why-groq-never-answers-the-browser).

**Console: `Could not sync with Supabase cloud, using local cache`**
Either Supabase is unconfigured (harmless — check `isSupabaseConfigured`) or the query
failed. Verify the URL and anon key, and confirm the tables exist.

**Console: `Supabase submission sync error: … invalid input syntax for type uuid`**
The primary-key correction was not applied. See
[step 2](#2---apply-the-primary-key-correction).

**Seeder prints errors but says "successfully seeded"**
The script does not propagate per-record failures to its exit code. Read the output
above the banner. Almost always the UUID mismatch.

**State will not reset**
Clear site data, or run in the console:

```js
localStorage.removeItem("vois_strains_v1");
localStorage.removeItem("vois_submissions_v1");
location.reload();
```

Note `resetToSeed()` clears local state only — a configured Supabase re-hydrates on the
next mount.

**Fonts look wrong / monospace is Courier**
Expected. JetBrains Mono is declared in Tailwind but never loaded, so `font-mono`
falls back to Courier New. See
[Design System · Typography](10-design-system.md#-typography).

**Dark flash on load in light mode**
Expected. The layout hardcodes `class="dark"` server-side; `ThemeProvider` corrects it
on mount. See [Design System](10-design-system.md#-theme-flash).

**Build fails on `lib/regions.ts` or `components/Badge.tsx`**
Both import from [`types/index.ts`](../types/index.ts), which declares stricter
optional fields than [`lib/seed-data.ts`](../lib/seed-data.ts). If you have changed
imports, see [Data Model · The two type sources](03-data-model.md#-the-two-type-sources--and-which-one-actually-runs).

---

## ▸ Dependency Inventory

### Runtime

| Package | Version | Live use |
|---|---|---|
| `next` | ^14.2.7 | ● framework |
| `react` / `react-dom` | ^18.3.1 | ● |
| `openai` | ^4.58.1 | ● Groq client |
| `@supabase/supabase-js` | ^2.45.4 | ● persistence |
| `lucide-react` | ^0.439.0 | ● all icons |
| `leaflet` | ^1.9.4 | ○ orphaned — [Component Catalog](07-component-catalog.md#-mapcomponent--mapwrapper) |
| `react-leaflet` | ^4.2.1 | ○ orphaned |
| `three` | ^0.185.1 | ○ `FluidGlass` only |
| `@react-three/fiber` | ^8.17.10 | ○ `FluidGlass` only |
| `@react-three/drei` | ^9.117.3 | ○ `FluidGlass` only |
| `@types/three` | ^0.185.4 | ○ misplaced — belongs in devDependencies |
| `maath` | ^0.10.8 | ○ `FluidGlass` only |
| `clsx` | ^2.1.1 | ○ never imported |
| `tailwind-merge` | ^2.5.2 | ○ never imported |

**Eight of fourteen runtime dependencies have no live import path.** Deleting
[`FluidGlass.tsx`](../components/FluidGlass.tsx) alone removes five
(`three`, `@react-three/*`, `@types/three`, `maath`). See
[Component Catalog · Recommended cleanup](07-component-catalog.md#-recommended-cleanup).

### Development

`typescript` ^5.5.4 · `tailwindcss` ^3.4.10 · `postcss` ^8.4.41 ·
`autoprefixer` ^10.4.20 · `tsx` ^4.19.0 · `dotenv` ^16.4.5 ·
`@types/{node,react,react-dom,leaflet}`

---

## ▸ Repository Layout

```
UNESCO_Youth_Hackathon_Submission_2026/
├── .env.example              template — safe to commit
├── .gitignore                covers .env*, .next/, node_modules/
├── README.md                 GitHub landing page
├── next.config.mjs           strict mode, remote image patterns
├── package.json              manifest and scripts
├── postcss.config.mjs        Tailwind + autoprefixer
├── tailwind.config.ts        theme, fonts, keyframes
├── tsconfig.json             strict, bundler resolution, @/* alias
│
├── docs/                     ← this documentation set
│   ├── README.md             index and reading paths
│   └── 01-overview.md … 11-setup-and-operations.md
│
├── app/
│   ├── layout.tsx            root shell, providers, global chrome
│   ├── globals.css           tokens, fonts, reveal animations
│   ├── page.tsx              landing — 7 scenes
│   ├── submit/ analyst/ vaccine/ distribute/ map/ strains/
│   ├── works/ works/[slug]/  ⚠ out of domain
│   └── api/classify/ api/match-strain/ api/domi/
│
├── components/               18 files — 6 live, 12 orphaned
├── context/                  Language · Role · Theme
├── lib/                      groq · store · supabase · seed-data · regions
│                             · initial-data ○ · nothin-data ○
├── scripts/seed.ts           Supabase seeder
├── supabase/migrations/001_init.sql
└── types/index.ts            ⚠ secondary type source
```

---

[Docs Home](README.md) · [← 10 Design System](10-design-system.md) · **11**
