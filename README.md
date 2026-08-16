# V0ICE — The MIL Immune System
### UNESCO Youth Hackathon 2026
**Theme:** *Play Your Part: Youth Designing the Future of Media and Information Literacy (MIL)*

> **"Misinformation spreads like a virus. We built the immune system."**

V0ICE transforms passive digital consumption into an active, community-driven epidemiological immune protocol. Rather than relying solely on reactive, slow fact-checking, V0ICE empowers citizens, youth, educators, and journalists to detect unverified vectors, verify threat techniques using Groq AI (`openai/gpt-oss-120b`), synthesize 2-sentence plain-language pre-bunk inoculations, and broadcast vaccines to community networks before viral falsehoods take root.

---

## 🌟 The 5-Role Public Health Response Loop

V0ICE operationalizes a five-stage public health epidemiological protocol:

| Step | Role | Route | Description |
|---|---|---|---|
| **01** | **👁️ Spotter** | [`/submit`](/submit) | Citizen frontline intake queue for unverified screenshots, deepfakes, and audio clips. |
| **02** | **🔬 Analyst** | [`/analyst`](/analyst) | Diagnostic verification node reviewing Groq AI confidence scores & semantic strain clustering. |
| **03** | **💉 Vaccine Maker** | [`/vaccine`](/vaccine) | Synthesizes concise 2-sentence plain-language pre-bunk inoculations. |
| **04** | **🩺 Field Worker** | [`/distribute`](/distribute) | Deploys verified explainers to community WhatsApp hubs, raising regional herd immunity. |
| **05** | **🌐 Surveillance Lead** | [`/map`](/map) | Global real-time Outbreak Radar monitoring infection velocity and containment indices. |

---

## 🤖 D0MI — Autonomous Platform AI Assistant

V0ICE features **D0MI** (Digital Operations & Media Intelligence), an in-app companion powered by **Groq `openai/gpt-oss-120b`**:
- **Interactive Navigation & Walkthroughs**: Guides citizens through all platform tools with clickable in-app routes.
- **UNESCO MIL Framework Expertise**: In-depth understanding of the 5 Laws of MIL, UNESCO Global MIL Week, and youth resilience.
- **Geopolitical Information Warfare**: Real-time forensic explanations on deepfake artifacting, voice cloning, and botnet astroturfing.
- **Dedicated In-Chat Language Selector**: Switch between 24 global languages instantly right inside the chat window.
- **Toggle Shortcut**: Press <kbd>Ctrl + K</kbd> or <kbd>Cmd + K</kbd> anywhere on the site.

---

## 🌍 24-Language Global Translation Matrix

V0ICE provides a 100% localized experience across 24 global languages:
- 🇬🇧 **Primary**: English (`EN`)
- 🇪🇺 **European Languages**: French (`FR`), German (`DE`), Italian (`IT`), Spanish (`ES`), Portuguese (`PT`), Dutch (`NL`), Swedish (`SV`), Polish (`PL`), Greek (`EL`), Danish (`DA`), Finnish (`FI`), Czech (`CS`), Romanian (`RO`), Hungarian (`HU`), Russian (`RU`)
- 🌐 **Other World Languages**: Hindi (`HI`), Mexican Spanish (`MX`), Japanese (`JA`), Chinese (`ZH`), Korean (`KO`), Brazilian Portuguese (`BR`), African Swahili (`SW`), Arabian (`AR`)

---

## 🌓 Pure Monochrome Dark & Light Theme Inversion

- **Dark Mode**: Architectural Surveillance Terminal (pure `#000000` background with crisp white typography and neon accent lenses).
- **Light Mode**: Clean Architectural Laboratory (pure `#FFFFFF` background with pitch black typography).
- **5 Accent Spectrum**: Violet (`V`), Blue (`0`), Green (`I`), Yellow (`C`), Red (`E`).

---

## 🛠️ Architecture & Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript + React 18
- **Styling**: Tailwind CSS + Custom Design System tokens
- **AI Inference**: Groq API (`openai/gpt-oss-120b` & `llama-3.3-70b-versatile`)
- **Database & Realtime**: Supabase (PostgreSQL) with local-first cache fallback
- **Cartography**: OpenStreetMap + Leaflet.js

---

## 🚀 Quickstart & Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/vois-mil-immune-system.git
cd vois-mil-immune-system
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your API credentials:
```env
# Groq AI Key (https://console.groq.com)
GROQ_API_KEY=gsk_...

# Supabase Credentials (https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 3. Database Provisioning (Supabase)
Run the SQL migration script located at `supabase/migrations/001_init.sql` in your Supabase SQL Editor to create the `strains`, `submissions`, and `vaccine_content` tables with Row Level Security.

### 4. Database Seeding (Optional)
```bash
npx tsx scripts/seed.ts
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📐 Herd Immunity Calculation

Regional immunity is calculated using the public health epidemiological formula:
$$\text{Herd Immunity Score} = \left( \frac{\text{Distributed Vaccines in Region}}{\text{Total Active Strains in Region}} \right) \times 100$$
- **70–100%:** Stable Community Inoculation (Green)
- **35–69%:** Vaccination in Progress (Amber)
- **0–34%:** Critical Viral Vector (Red)

---

## 🏆 UNESCO Youth Hackathon 2026 Deliverables
- **Live Spotter Ingestion**: `/submit`
- **Analyst Triage & AI Clustering**: `/analyst`
- **Vaccine Lab Synthesis**: `/vaccine`
- **Regional Deployment Matrix**: `/distribute`
- **Outbreak Radar Telemetry**: `/map`
- **Verified Strain Taxonomy**: `/strains`
- **D0MI AI Assistant**: Integrated across all routes (<kbd>Ctrl + K</kbd>)

---

### © 2026 V0ICE Initiative · Open Citizen Surveillance Protocol
*Built for the UNESCO Youth Hackathon 2026: Youth Designing the Future of Media and Information Literacy.*
