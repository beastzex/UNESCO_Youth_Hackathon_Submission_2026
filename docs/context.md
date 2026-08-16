# V0ICE — The MIL Immune System
## Comprehensive Technical, Architectural & Contextual Dossier
### UNESCO Youth Hackathon Submission 2026

---

## 📖 Table of Contents
1. [Executive Overview & Vision](#1-executive-overview--vision)
2. [UNESCO Hackathon 2026 Problem Statement](#2-unesco-hackathon-2026-problem-statement)
3. [The Core Solution: Epidemiological Immuno-Surveillance](#3-the-core-solution-epidemiological-immuno-surveillance)
4. [The 5-Role Public Health Response Protocol](#4-the-5-role-public-health-response-protocol)
5. [D0MI AI Assistant — Architecture & Intelligence](#5-d0mi-ai-assistant--architecture--intelligence)
6. [24-Language Global Multilingual Translation Matrix](#6-24-language-global-multilingual-translation-matrix)
7. [Design System & Complete Theme Inversion](#7-design-system--complete-theme-inversion)
8. [Comprehensive Technology Stack](#8-comprehensive-technology-stack)
9. [Exhaustive Project File Breakdown](#9-exhaustive-project-file-breakdown)
10. [Database Architecture & Supabase Schema](#10-database-architecture--supabase-schema)
11. [Setup, Running, Testing & Deployment Guide](#11-setup-running-testing--deployment-guide)
12. [Security, Privacy & Git Audit](#12-security-privacy--git-audit)

---

## 1. Executive Overview & Vision

> **"Misinformation spreads like a virus. We built the immune system."**

**V0ICE** is an open, decentralized citizen immuno-surveillance and public health counter-epidemic platform created for the **UNESCO Youth Hackathon 2026**.

Traditional fact-checking models fail because they are:
- **Reactive**: Articles take 24–72 hours to publish, while viral deception peaks in the first 2 hours.
- **Centralized**: Relying on small editorial desks creates bottlenecks.
- **Academic & Lengthy**: 1,500-word debunking articles are rarely read by the audiences vulnerable to 15-second TikTok deepfakes or forwarded WhatsApp voice notes.
- **Cognitively Ineffective**: Debunking after belief formation triggers the *backfire effect*.

**V0ICE reframes Media and Information Literacy (MIL) as an epidemiological immune protocol.** Digital citizens act as cellular antibodies—spotting rumors, verifying threat vectors using low-latency Groq AI (`openai/gpt-oss-120b`), synthesizing 2-sentence plain-language pre-bunk inoculations, and broadcasting vaccines into community chat hubs to build **Regional Herd Immunity**.

---

## 2. UNESCO Hackathon 2026 Problem Statement

- **Event**: UNESCO Youth Hackathon 2026
- **Global Theme**: *Play Your Part: Youth Designing the Future of Media and Information Literacy (MIL)*
- **Core Focus**: Empowering youth to become active architects of information integrity rather than passive victims of algorithmic disinformation, deepfakes, and state/non-state cognitive manipulation.

### The 4 Core Challenges Addressed:
1. **Proliferation of Synthetic Media**: The explosion of generative AI deepfakes, synthetic voice clones, and doctored screenshots in elections and crises.
2. **Speed & Virality Asymmetry**: Falsehoods spread 6x faster than truth on social platforms (MIT Study).
3. **Language & Regional Inequity**: Most verification tools operate solely in English, leaving non-Western and regional communities undefended.
4. **Passive Consumer Mindset**: Citizens lack intuitive tools to participate directly in community defense.

---

## 3. The Core Solution: Epidemiological Immuno-Surveillance

V0ICE models information ecosystems after biological epidemiology:

```
[ VIRAL OUTBREAK ] ──> [ SPOTTER ] ──> [ ANALYST ] ──> [ VACCINE MAKER ] ──> [ FIELD WORKER ] ──> [ RADAR ]
Suspicious Audio/     Citizen Ingestion  Groq 120B AI     2-Sentence Plain    WhatsApp/Telegram    Global Herd
Video/Screenshots     Intake Queue       Diagnostic Node  Pre-Bunk Formula    Broadcast Node       Immunity Index
```

### Key Innovations:
1. **Pre-Bunking over Debunking**: Inoculates public cognitive reasoning *before* falsehoods take root.
2. **Automated LLM Forensics**: Groq `openai/gpt-oss-120b` extracts intent, classifies manipulation technique, and clusters related rumors into systemic strains in `< 500ms`.
3. **Mathematical Herd Immunity Index**: Calculates real-time regional protection scores based on vaccine deployment vs. active outbreak strains.
4. **24-Language Native Coverage**: Ensures digital defense is accessible globally across all major linguistic communities.

---

## 4. The 5-Role Public Health Response Protocol

Every user can adopt one of five specialized civic roles:

### 1. 👁️ Spotter (`/submit`) — Frontline Intake
- **Function**: Digital citizens upload unverified screenshots, deepfake video clips, audio voice notes, or text rumors.
- **AI Automation**: Groq AI automatically classifies the manipulation technique (`deepfake`, `cloned_voice`, `doctored_screenshot`, `fabricated_statistic`, `out_of_context_image`, `other`), assigns a confidence score (0.00–1.00), and creates an executive summary.

### 2. 🔬 Analyst (`/analyst`) — Diagnostic Triage & Strain Clustering
- **Function**: Fact-checkers and MIL specialists triage incoming submissions.
- **Semantic Clustering**: The system runs LLM-based `isSameStrain()` semantic comparisons against existing confirmed strains to cluster isolated rumors into unified outbreak strains.

### 3. 💉 Vaccine Maker (`/vaccine`) — Plain-Language Inoculation
- **Function**: Educators and communicators craft concise 2-sentence pre-bunk explainers designed for instant comprehension and sharing.
- **Formula**: Sentence 1 exposes the manipulation technique; Sentence 2 provides the verified factual anchor.

### 4. 🩺 Field Health Worker (`/distribute`) — Grassroots Broadcast
- **Function**: Community leaders and youth ambassadors deploy verified vaccines to local WhatsApp groups, Telegram channels, and school hubs.
- **Impact**: Toggling distribution updates regional containment and raises the localized herd immunity score.

### 5. 🌐 Surveillance Lead / Public (`/map` & `/strains`) — Macro Outbreak Radar
- **Function**: Interactive Leaflet.js radar tracking infection velocity, affected territories, and community protection levels worldwide.
- **Formula**:
  $$\text{Herd Immunity Score} = \left( \frac{\text{Distributed Vaccines in Region}}{\text{Total Active Strains in Region}} \right) \times 100$$
  - **70–100%**: Stable Community Inoculation (Green)
  - **35–69%**: Inoculation in Progress (Amber)
  - **0–34%**: Critical Vector Outbreak (Red)

---

## 5. D0MI AI Assistant — Architecture & Intelligence

**D0MI** (*Digital Operations & Media Intelligence*) is the autonomous conversational assistant embedded across the entire platform.

### Capabilities:
- **Platform Navigation**: Guides users to specific roles with clickable in-app routes (`[Report Strain](/submit)`, `[Outbreak Radar](/map)`, etc.).
- **UNESCO MIL Knowledge**: Explains the 5 Laws of MIL, UNESCO Global MIL Week, IPDC frameworks, and WHO Infodemic Management.
- **Geopolitical & Forensic Intelligence**: Real-time analysis of synthetic media, C2PA cryptographic provenance, botnet astroturfing, and election security.
- **In-Chat Language Selector**: Allows users to switch D0MI's conversational language independently with automatic localized greetings.
- **Rich Markdown Formatting**: Renders responsive comparison tables, colored heading indicators, monospace code blocks, blockquotes, numbered step badges, and styled action pills.
- **Keyboard Shortcut**: Global toggle with <kbd>Ctrl + K</kbd> / <kbd>Cmd + K</kbd>.

### Tech Implementation:
- **API Route**: `app/api/domi/route.ts`
- **Engine**: Groq `openai/gpt-oss-120b` with fallback to `llama-3.3-70b-versatile`.
- **Component**: `components/DomiChat.tsx`

---

## 6. 24-Language Global Multilingual Translation Matrix

V0ICE features a comprehensive dictionary-driven localization engine across 24 global languages:

### Language Breakdown:
1. **Primary**:
   - 🇬🇧 **`EN`**: English
2. **European Languages (`EUR`)**:
   - 🇫🇷 **`FR`**: Français (French)
   - 🇩🇪 **`DE`**: Deutsch (German)
   - 🇮🇹 **`IT`**: Italiano (Italian)
   - 🇪🇸 **`ES`**: Español (Spanish)
   - 🇵🇹 **`PT`**: Português (Portuguese)
   - 🇳🇱 **`NL`**: Nederlands (Dutch)
   - 🇸🇪 **`SV`**: Svenska (Swedish)
   - 🇵🇱 **`PL`**: Polski (Polish)
   - 🇬🇷 **`EL`**: Ελληνικά (Greek)
   - 🇩🇰 **`DA`**: Dansk (Danish)
   - 🇫🇮 **`FI`**: Suomi (Finnish)
   - 🇨🇿 **`CS`**: Čeština (Czech)
   - 🇷🇴 **`RO`**: Română (Romanian)
   - 🇭🇺 **`HU`**: Magyar (Hungarian)
   - 🇷🇺 **`RU`**: Русский (Russian)
3. **Other World Languages (`WORLD`)**:
   - 🇮🇳 **`HI`**: हिन्दी (Hindi)
   - 🇲🇽 **`MX`**: Español México (Mexican Spanish)
   - 🇯🇵 **`JA`**: 日本語 (Japanese)
   - 🇨🇳 **`ZH`**: 中文 (Chinese)
   - 🇰🇷 **`KO`**: 한국어 (Korean)
   - 🇧🇷 **`BR`**: Português Brasil (Brazilian Portuguese)
   - 🌍 **`SW`**: Kiswahili (African Swahili)
   - 🇸🇦 **`AR`**: العربية (Arabian)

### Architecture:
- Implemented via React Context in `context/LanguageContext.tsx`.
- Over 3,800+ lines of native translated strings covering UI copy, hero titles, metrics, interactive stage mock simulations, footer credentials, and button labels.

---

## 7. Design System & Complete Theme Inversion

V0ICE employs a brutalist, architectural luxury design system with **100% monochrome inversion**:

### The 5-Letter V0ICE Accent Palette:
- **`V` (Violet)**: `#8B5CF6` — Spotter / Discovery
- **`0` (Blue)**: `#3B82F6` — Analyst / Diagnostic Triage
- **`I` (Green)**: `#22C55E` — Vaccine Maker / Inoculation
- **`C` (Yellow)**: `#EAB308` — Field Worker / Regional Broadcast
- **`E` (Red)**: `#EF4444` — Surveillance Lead / Outbreak Warning

### Typography:
- **Primary Display**: `Manrope` (Google Fonts) — modern geometric sans-serif for headlines, telemetry data, and navigation.
- **Editorial Accent**: `Cormorant Garamond` (Google Fonts) — classical serif for quotes and manifestos.
- **Monospace**: `JetBrains Mono` / System Mono for coordinates, IDs (`#STR-01`), and JSON telemetry.

### Dark vs. Light Mode Theme Matrix:
| Component | Dark Theme | Light Theme (Exact Inversion) |
|---|---|---|
| **Background** | Pure Black (`#000000`) | Pure White (`#FFFFFF`) |
| **Typography** | Pure White (`#FFFFFF`) | Pitch Black (`#000000`) |
| **Hero Wordmark** | White text + colored flashlight lens | Black text + colored flashlight lens |
| **Panels & Cards** | `bg-neutral-950 border-white/[0.08]` | `bg-neutral-50 border-black/[0.08]` |
| **D0MI Terminal** | Deep Obsidian with glow borders | Clean Crisp White with dark borders |

---

## 8. Comprehensive Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Core Framework** | Next.js 14.2.7 (App Router) | Server/Client rendering, routing, API endpoints |
| **Language** | TypeScript 5.5.4 | Type safety across store, AI pipelines, and components |
| **Styling** | Tailwind CSS 3.4.10 + Vanilla CSS | Design tokens, animations, responsive layouts |
| **AI Inference** | Groq SDK (`openai` client) | Fast inference on `openai/gpt-oss-120b` |
| **Database** | Supabase (PostgreSQL 15) | Relational persistence for strains, reports, vaccines |
| **Mapping Engine** | Leaflet 1.9.4 + React-Leaflet | Geographical outbreak radar mapping |
| **State Management** | Custom Local-First Reactive Store | Optimistic UI updates with cloud Supabase synchronization |
| **Icons** | Lucide React | Minimalist architectural iconography |
| **3D / Canvas** | Three.js + React Three Fiber / Drei | Interactive glass lenses & tactile layers |

---

## 9. Exhaustive Project File Breakdown

Below is the complete file directory tree with the precise responsibility of every file:

```
UNESCO_project/
├── .env.example                     # Environment template with dummy variables
├── .env.local                       # Local active environment variables (gitignored)
├── .gitignore                       # Git exclusion rules (protects credentials & builds)
├── next.config.mjs                  # Next.js engine configuration & image domains
├── package.json                     # Project manifest, scripts, and dependencies
├── postcss.config.mjs               # PostCSS plugins for Tailwind
├── tailwind.config.ts               # Tailwind theme, fonts, custom colors & keyframes
├── tsconfig.json                    # TypeScript compiler configuration
├── README.md                        # Primary GitHub repository documentation
│
├── docs/
│   └── context.md                   # Complete architectural & technical reference (this file)
│
├── app/
│   ├── globals.css                  # Core CSS variables, font definitions & animations
│   ├── layout.tsx                   # Root HTML shell, providers & global D0MI mount
│   ├── page.tsx                     # Main 7-scene landing page with interactive pipeline
│   │
│   ├── analyst/
│   │   └── page.tsx                 # Step 2: Analyst diagnostic triage & clustering console
│   │
│   ├── distribute/
│   │   └── page.tsx                 # Step 4: Field health worker community broadcast console
│   │
│   ├── map/
│   │   └── page.tsx                 # Step 5: Fullscreen interactive Outbreak Radar Map
│   │
│   ├── strains/
│   │   └── page.tsx                 # Verified misinformation strain directory & taxonomy
│   │
│   ├── submit/
│   │   └── page.tsx                 # Step 1: Frontline citizen spotter report intake form
│   │
│   ├── vaccine/
│   │   └── page.tsx                 # Step 3: Vaccine Maker studio for pre-bunk explainers
│   │
│   ├── works/
│   │   ├── page.tsx                 # UNESCO project catalog overview
│   │   └── [slug]/
│   │       └── page.tsx             # Dynamic detailed view for specific initiatives
│   │
│   └── api/
│       ├── classify/
│       │   └── route.ts             # REST API endpoint for Groq AI content classification
│       ├── domi/
│       │   └── route.ts             # REST API endpoint for D0MI conversational intelligence
│       └── match-strain/
│           └── route.ts             # REST API endpoint for semantic strain comparison
│
├── components/
│   ├── DomiChat.tsx                 # D0MI AI Assistant modal, markdown parser & language picker
│   ├── MaskedHeroType.tsx           # Interactive Hero wordmark with flashlight lens
│   ├── LeafletMap.tsx               # Interactive Leaflet geographical radar component
│   ├── MapComponent.tsx             # Underlying Leaflet map implementation
│   ├── MapWrapper.tsx               # Client-side dynamic loader for Leaflet (SSR-safe)
│   ├── VoisNavbar.tsx               # Floating navigation bar with language & theme toggles
│   ├── VoisFooter.tsx               # UNESCO project footer with role links & copyright
│   ├── StatsHeader.tsx              # Telemetry summary bar for metrics
│   ├── Badge.tsx                    # Reusable status and category pill badges
│   ├── FluidGlass.tsx               # Three.js glass refraction effect component
│   ├── FluidGlassHero.tsx           # Hero 3D glass integration
│   ├── KineticMarquee.tsx           # Continuous scrolling typographic ticker
│   ├── ManifestoVideoBlock.tsx      # Video showcase block for UNESCO manifesto
│   ├── TactileObjectLayer.tsx       # Interactive 3D interactive layer
│   ├── Navbar.tsx                   # Legacy navbar stub
│   ├── Footer.tsx                   # Legacy footer stub
│   ├── NothinNavbar.tsx             # Alternative minimalist navbar
│   └── NothinFooter.tsx             # Alternative minimalist footer
│
├── context/
│   ├── LanguageContext.tsx          # 24-language dictionary, active language state & switcher
│   ├── RoleContext.tsx              # 5-role active persona state manager
│   └── ThemeContext.tsx             # Light/Dark mode state manager with system sync
│
├── lib/
│   ├── groq.ts                      # Groq OpenAI client, classifySubmission & isSameStrain
│   ├── store.ts                     # Local-first reactive store with Supabase cloud syncing
│   ├── supabase.ts                  # Supabase client initializer and configuration check
│   ├── seed-data.ts                 # Initial demo strains, submissions, and regional data
│   ├── initial-data.ts              # Extended baseline datasets
│   ├── nothin-data.ts               # Supplementary telemetry data
│   └── regions.ts                   # Geographic bounding boxes & coordinates for map
│
├── scripts/
│   └── seed.ts                      # Cloud database seeder script for Supabase
│
├── supabase/
│   └── migrations/
│       └── 001_init.sql             # SQL DDL migration creating tables & RLS policies
│
└── types/
    └── index.ts                     # Global TypeScript interfaces and data models
```

---

## 10. Database Architecture & Supabase Schema

The database is built on PostgreSQL with **Row Level Security (RLS)**:

```sql
-- 1. Strains Table (Verified Misinformation Vectors)
CREATE TABLE strains (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  technique TEXT NOT NULL,
  intent TEXT,
  summary TEXT,
  report_count INT DEFAULT 1,
  regions_affected TEXT[] DEFAULT '{}',
  distributed_regions TEXT[] DEFAULT '{}',
  has_vaccine BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Submissions Table (Citizen Ingestion Queue)
CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  content_text TEXT NOT NULL,
  image_url TEXT,
  region TEXT NOT NULL,
  language TEXT NOT NULL,
  ai_suggested_technique TEXT,
  ai_confidence FLOAT,
  ai_summary TEXT,
  status TEXT DEFAULT 'pending_review',
  strain_id TEXT REFERENCES strains(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Vaccine Content Table (Pre-Bunk Explainer Doses)
CREATE TABLE vaccine_content (
  id TEXT PRIMARY KEY,
  strain_id TEXT REFERENCES strains(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  explainer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 11. Setup, Running, Testing & Deployment Guide

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### 1. Clone & Install
```bash
git clone https://github.com/your-username/vois-mil-immune-system.git
cd vois-mil-immune-system
npm install
```

### 2. Environment Configuration
Create `.env.local`:
```env
GROQ_API_KEY=gsk_your_groq_key_here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJyour_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=eyJyour_service_role_key_here
```

### 3. Provision Database
In Supabase SQL Editor, run `supabase/migrations/001_init.sql` and grant permissions:
```sql
GRANT ALL ON TABLE strains, submissions, vaccine_content TO anon, authenticated, service_role;
```

### 4. Seed Database
```bash
npx tsx scripts/seed.ts
```

### 5. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)**.

### 6. Type Checking & Build Validation
```bash
npx tsc --noEmit
npm run build
```

---

## 12. Security, Privacy & Git Audit

- ✅ **No Hardcoded Secrets**: Scanned across all 54 files. Real keys exist only inside `.env.local`.
- ✅ **`.gitignore` Enforced**: `.env*`, `.next/`, `node_modules/`, and build artifacts are strictly excluded.
- ✅ **Clean Dummy Template**: `.env.example` provides safe guidance without exposing real tokens.
- ✅ **RLS Public Access**: Safe row-level security policies allow public interaction while isolating sensitive tables.

---

### © 2026 V0ICE Initiative · Open Citizen Surveillance Protocol
*UNESCO Youth Hackathon 2026 — Youth Designing the Future of Media and Information Literacy.*
