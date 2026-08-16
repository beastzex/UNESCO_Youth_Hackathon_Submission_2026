◉ **AI Pipeline**
[Docs Home](README.md) · [← 03 Data Model](03-data-model.md) · **04** · [05 API Reference →](05-api-reference.md)

---

# ◉ AI Pipeline

Three inference capabilities, all served by Groq's OpenAI-compatible endpoint through
the official `openai` SDK.

| Capability | Function | Model | Live today |
|---|---|---|---|
| Content classification | `classifySubmission()` | `openai/gpt-oss-120b` | ◐ heuristic in browser |
| Strain matching | `isSameStrain()` | `openai/gpt-oss-120b` | ◐ heuristic in browser |
| Conversational assistant | `POST /api/domi` | `openai/gpt-oss-120b` → `llama-3.3-70b-versatile` | ● live |

---

## ▸ Client Configuration

[`lib/groq.ts`](../lib/groq.ts) constructs the OpenAI SDK against Groq's compatibility
layer:

```ts
new OpenAI({
  apiKey: process.env.GROQ_API_KEY || "dummy_key",
  baseURL: "https://api.groq.com/openai/v1",
  dangerouslyAllowBrowser: true,
});
```

The module-level `groq` export is never used — each function constructs its own client
after resolving a key. `"dummy_key"` acts as a sentinel: both functions test
`apiKey !== "dummy_key"` before attempting a network call.

▲ `dangerouslyAllowBrowser: true` disables the SDK's guard against running in a
browser context. See [AI Pipeline](04-ai-pipeline.md#-the-key-resolution-problem).

---

## ▸ The Key Resolution Problem

Both functions resolve their key identically:

```ts
const apiKey = process.env.GROQ_API_KEY
  || (typeof window !== "undefined" ? localStorage.getItem("VOIS_GROQ_API_KEY") : "");
```

This has a decisive consequence. `lib/groq.ts` is imported by
[`lib/store.ts`](../lib/store.ts), which is `"use client"`. Next.js only inlines
environment variables prefixed `NEXT_PUBLIC_` into client bundles, so in the browser
`process.env.GROQ_API_KEY` evaluates to `undefined`. The fallback reads
`localStorage.getItem("VOIS_GROQ_API_KEY")` — and **no code anywhere in the repository
writes that key**.

```
Execution context           process.env.GROQ_API_KEY   localStorage   Result
─────────────────────────   ────────────────────────   ───────────    ──────────────────
/api/classify handler       ✓ resolves                  n/a           ● live Groq call
/api/match-strain handler   ✓ resolves                  n/a           ● live Groq call
/api/domi handler           ✓ resolves                  n/a           ● live Groq call
Browser via useVoisStore    ✗ undefined                 ✗ null        ◐ heuristic fallback
```

The two server handlers that *would* run live inference are never called by any
component — the only `fetch` to an internal API in the entire codebase is
`DomiChat.tsx → /api/domi`.

**Net effect:** in normal use, spotter classification and analyst clustering run on
the deterministic heuristic engines below. D0MI runs on the real model.

**The fix**, in one place — replace the direct import in `lib/store.ts` with calls to
the existing handlers:

```ts
// lib/store.ts — instead of: import { classifySubmission } from "./groq"
const classification = await fetch("/api/classify", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: data.content_text }),
}).then(r => r.json());
```

The handler's response shape is byte-identical to `ClassificationResult`, so nothing
downstream changes. Tracked as
[AI Pipeline](04-ai-pipeline.md#-the-key-resolution-problem).

---

## ▸ Capability 1 · Content Classification

**Signature** — [`lib/groq.ts`](../lib/groq.ts)

```ts
async function classifySubmission(text: string): Promise<ClassificationResult>

interface ClassificationResult {
  technique: TechniqueType;   // one of the six
  intent: string;             // short phrase describing likely motive
  confidence: number;         // 0.0 – 1.0
  summary: string;            // one-sentence plain-language restatement
}
```

**System prompt** — verbatim from the source:

> You are an MIL (Media and Information Literacy) public-health misinformation analyst
> for VoIS. Classify the submitted content and respond in strict JSON only, with no
> markdown fences, no formatting, and no extra commentary:
> ```
> {
>   "technique": "deepfake" | "out_of_context_image" | "fabricated_statistic"
>              | "cloned_voice" | "doctored_screenshot" | "other",
>   "intent": "short phrase describing likely intent
>             (e.g., civic confusion, financial scam, political polarization, health panic)",
>   "confidence": number between 0.0 and 1.0,
>   "summary": "one sentence plain-language summary of the claim"
> }
> ```

**Request parameters**

| Parameter | Value |
|---|---|
| `model` | `openai/gpt-oss-120b` |
| `response_format` | `{ type: "json_object" }` — enforces parseable JSON |
| `temperature` | unset (provider default) |
| `messages` | system prompt + raw submission text as user turn |

**Response defensiveness.** Every field is defaulted after parse, so a malformed or
partial response still yields a usable object:

```ts
technique:  parsed.technique  || "other"
intent:     parsed.intent     || "Civic confusion / emotional manipulation"
confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.88
summary:    parsed.summary    || text.slice(0, 120)
```

`JSON.parse` is called on `response.choices[0].message.content ?? "{}"`. A parse throw
is caught by the surrounding `try` and falls through to the heuristic engine — so
malformed JSON degrades rather than crashes.

### The heuristic fallback engine

A deterministic keyword ladder, evaluated top to bottom on the lowercased input. First
match wins.

| Order | Trigger keywords | Technique | Confidence | Assigned intent |
|---|---|---|---|---|
| 1 | `audio`, `voice`, `recording`, `leaked call` | `cloned_voice` | 0.94 | Fabricating synthetic speech to impersonate civic authorities |
| 2 | `video`, `face`, `deepfake`, `speech` | `deepfake` | 0.92 | Electoral interference and synthetic persona generation |
| 3 | `screenshot`, `tweet`, `whatsapp`, `bank`, `balance` | `doctored_screenshot` | 0.89 | Fabricating institutional announcements or financial panic |
| 4 | `%`, `percent`, `study shows`, `survey`, `numbers` | `fabricated_statistic` | 0.88 | Misleading citizens with pseudoscientific quantitative claims |
| 5 | `flood`, `photo`, `picture`, `dam`, `fire` | `out_of_context_image` | 0.91 | Recycling historical disaster imagery to trigger acute regional panic |
| — | no match | `other` | 0.86 | Manipulating public sentiment & spreading unverified claims |

Summary falls back to truncation: `text.slice(0, 97) + "..."` when longer than 100
characters, otherwise the text verbatim.

**Ordering is load-bearing.** The ladder is ordered by discriminative power, not
alphabetically. A submission containing both "video" and "screenshot" classifies as
`deepfake` because rule 2 precedes rule 3. The three sample submissions on
[`/submit`](../app/submit/page.tsx) are written to hit rules 1, 3, and 5 respectively,
so a demo without credentials still shows three distinct techniques.

**Known blind spot.** `bank` in rule 3 catches financial-panic text generally, so a
*statistic* about a bank ("87% of bank deposits at risk") classifies as
`doctored_screenshot` rather than `fabricated_statistic`.

---

## ▸ Capability 2 · Semantic Strain Matching

**Signature**

```ts
async function isSameStrain(
  submissionText: string,
  existingStrainSummary: string
): Promise<StrainMatchResult>

interface StrainMatchResult {
  same_strain: boolean;
  confidence: number;   // 0.0 – 1.0
  reason: string;       // short explanation, surfaced in the analyst notice
}
```

**System prompt**

> Determine if a new submission represents the same underlying misinformation strain
> as an existing one (same core false claim, even if reworded, translated, or in a
> different format). Respond in strict JSON only:
> `{"same_strain": boolean, "confidence": number between 0.0 and 1.0, "reason": "short explanation"}`

The parenthetical is the substance of the capability. Clustering must survive
paraphrase, translation, and format change — the same claim arriving as a voice note
in Hindi and a screenshot in English is one strain, not two. Naive string matching
cannot do this; a language model can.

**User turn**

```
New submission: {submissionText}

Existing strain summary: {existingStrainSummary}
```

### The heuristic fallback

Jaccard-style lexical overlap on words longer than three characters:

```ts
const subWords    = new Set(submissionText.toLowerCase().split(/\W+/).filter(w => w.length > 3));
const strainWords = new Set(existingStrainSummary.toLowerCase().split(/\W+/).filter(w => w.length > 3));

let overlap = 0;
subWords.forEach(w => { if (strainWords.has(w)) overlap++; });

const ratio   = overlap / Math.max(1, Math.min(subWords.size, strainWords.size));
const isMatch = ratio > 0.35;
```

The denominator is the **smaller** of the two sets, which makes the ratio generous
toward short submissions — a five-word report sharing two words with a long strain
summary scores 0.40 and matches. This is a deliberate bias toward clustering: a false
merge is visible and correctable in the UI, a missed merge silently fragments the
strain directory.

**Confidence** is `min(0.95, 0.6 + ratio × 0.4)` on match, flat `0.2` on miss —
capped so heuristic results never claim near-certainty.

**Reason strings** are written to be readable in the analyst's clustering notice:

- match → `Shared thematic keywords detected across regional outbreak vectors (N matching lexical tokens).`
- miss → `Distinct narrative structures and claim entities.`

**Limitations by construction.** Purely lexical, so it fails exactly where the LLM
path is designed to succeed: cross-language matching (a Hindi report against an
English summary shares zero tokens), and heavy paraphrase.

---

## ▸ The Clustering Algorithm

Where `isSameStrain` is actually used — [`confirmSubmission`](../lib/store.ts):

```
analyst clicks CONFIRM on submission S
        │
        ▼
matchedStrainId = null ; highestConfidence = 0
        │
        ├──▸ for each strain in strains:                    ← sequential, no early exit
        │        result = await isSameStrain(S.content_text, strain.summary)
        │        if result.same_strain
        │           && result.confidence > 0.70
        │           && result.confidence > highestConfidence:
        │               matchedStrainId  = strain.id
        │               highestConfidence = result.confidence
        │
        ├── matchedStrainId set?
        │      ├─ YES ─▸ cluster:  report_count += 1
        │      │                   regions_affected ∪= { S.region }
        │      └─ NO  ─▸ create:   new Strain, report_count = 1,
        │                          regions_affected = [S.region],
        │                          distributed_regions = [], has_vaccine = false
        │                          matchedStrainId = newStrain.id
        │
        ├──▸ submission.status = "confirmed" ; submission.strain_id = matchedStrainId
        ├──▸ saveState(...)
        └──▸ if (isSupabaseConfigured) upsert strain + update submission
```

**Selection rule.** Best-match, not first-match — the loop scans every strain and keeps
the highest-confidence hit above the 0.70 threshold. Correct for accuracy, expensive
for latency.

**Cost.** *n* sequential LLM round-trips per confirmation, where *n* is the total
strain count. At five seed strains that is five calls; at five hundred it is five
hundred, serially. Batching all summaries into one prompt, or pre-filtering candidates
by technique and region before invoking the model, are the obvious remedies.

▲ **The `isNew` flag is always false.** The function returns:

```ts
return { matchedStrainId, isNew: !matchedStrainId };
```

But the create branch assigns `matchedStrainId = newStrain.id` before returning, so
`matchedStrainId` is always truthy and `isNew` is always `false`. The analyst console
consumes this directly:

```tsx
res.isNew
  ? `New strain created from submission [${sub.id}].`
  : `Matched & clustered into existing strain vector [${res.matchedStrainId}]. Report count incremented.`
```

Every confirmation — including one that just created a brand-new strain — reports
"Matched & clustered into existing strain vector". A one-line fix: capture the branch
taken in a local `let isNew = false` and set it in the create path. Tracked as
[AI Pipeline](04-ai-pipeline.md#-the-clustering-algorithm).

---

## ▸ Capability 3 · D0MI Conversational Assistant

**Handler** — [`app/api/domi/route.ts`](../app/api/domi/route.ts)
**Client** — [`components/DomiChat.tsx`](../components/DomiChat.tsx)

The only capability that reaches a live model in normal operation, because it executes
server-side.

### Knowledge domains in the system prompt

**1 · Platform navigation.** Every role, its step number, and its route, formatted as
markdown links so the renderer turns them into clickable in-app pills:
`[Report a Strain](/submit)`, `[Analyst Triage](/analyst)`, `[Vaccine Lab](/vaccine)`,
`[Field Deployment](/distribute)`, `[Outbreak Radar](/map)`, `[Strain Directory](/strains)`.

**2 · UNESCO and the UN system.** UNESCO (Paris HQ), the 2026 hackathon theme, the
5 Laws of MIL, Global MIL Week, IPDC; plus WHO infodemic management, UNICEF youth
digital safety, ITU AI for Good, UNODC cybercrime, UNDP democratic resilience.

**3 · Geopolitics and synthetic media forensics.** Deepfake artifacts (lip-sync
artifacting, specular reflection inconsistencies, biometric anomalies, diffusion
signatures), coordinated inauthentic behaviour, astroturfing botnets, algorithmic
micro-targeting, narrative hijacking, and provenance standards — C2PA, the Content
Authenticity Initiative, cryptographic media signing.

### Response guidelines given to the model

- **Tone** — brilliant, analytical, empowering, empathetic, articulate
- **Formatting** — clean markdown; bold, bullets, numbered steps, code and quote blocks
- **Navigation** — always emit platform links in markdown form
- **Multilingual** — reply fluently in the user's language (French, Spanish, Hindi,
  Russian, Arabic, Japanese, Chinese, Swahili, …)
- **Conciseness** — thorough and structured, without filler

The active platform language is appended at request time:
`User's current platform language setting: {userLanguage}`.

### Request handling

| Behaviour | Implementation |
|---|---|
| History window | `messages.slice(-10)` — last 10 turns, bounding token cost |
| Temperature | `0.7` |
| Max tokens | `1024` (primary), `800` (fallback) |
| Validation | non-array `messages` → `400` |
| Missing key | `200` with an in-character setup instruction, not a `500` |

### Failure ladder

```
POST /api/domi
      │
      ▼
  openai/gpt-oss-120b  ·  temp 0.7  ·  max_tokens 1024  ·  last 10 turns
      │
      ├─ success ─────────────────────────────▸ { role: "assistant", content }
      │
      └─ error
            │
            ├─ status === 429 or /rate/ in message
            │      └─▸ llama-3.3-70b-versatile · max_tokens 800 · last 6 turns
            │              ├─ success ─▸ 200 { content }
            │              └─ failure ─▸ falls through ↓
            │
            └─▸ 200 { content: "I encountered a momentary communication glitch (…).
                                Please try asking your question again!" }
```

Every branch returns HTTP 200. The chat surface is designed never to show an error
state — a degraded reply is preferred to a broken component. The trade-off is that
genuine outages are indistinguishable from model reticence in the UI; the real cause
is always in the server log via `console.error("D0MI API error:", error)`.

▲ The fallback client is constructed with the module-scope `groqApiKey` rather than
the request-scope `apiKey` resolved in the try block. They are identical today, so
this is a latent inconsistency rather than a live bug.

### Client-side behaviour

| Feature | Implementation |
|---|---|
| Global toggle | `Ctrl/Cmd + K` with `preventDefault`; `Escape` closes |
| Expand | Inline `540×680` panel ⇄ near-fullscreen `inset-4/8/12` |
| Language switch | In-chat picker that calls `setLanguage()` **and** injects a localized confirmation message into the transcript |
| Starter prompts | 4 one-click seeds — Platform Walkthrough, UNESCO MIL Framework, Geopolitics & Disinformation, Outbreak Radar & Vaccines |
| Copy | Per-message clipboard with a 2-second confirmation state |
| Clear | Resets the transcript to a fresh greeting |
| Autoscroll | `scrollIntoView({ behavior: "smooth" })` on message change |
| Focus | Input focused 150 ms after open |

Conversation state is component-local `useState` — **not persisted**. Closing the panel
retains history for the session; a page reload discards it.

### The markdown renderer

D0MI ships a hand-written markdown engine rather than pulling a dependency — roughly
350 lines across three functions in [`DomiChat.tsx`](../components/DomiChat.tsx).

`parseMarkdownBlocks(md) → MarkdownBlock[]` — a single-pass line scanner recognizing,
in precedence order:

| Order | Block | Syntax | Rendering |
|---|---|---|---|
| 1 | Code | ` ``` lang ` | Dark panel, terminal icon, language label, horizontal scroll |
| 2 | Rule | `---` `***` `___` | Hairline divider |
| 3 | Heading | `#` `##` `###` | H1 violet bar · H2 blue bar · H3 violet uppercase with a four-point star glyph |
| 4 | Blockquote | `> ` | Violet-tinted callout with info icon; consecutive lines joined |
| 5 | Table | `\| … \|` | Bordered, striped, hover states, `overflow-x-auto` |
| 6 | List | `1. ` or `-` `*` `•` | Ordered → numbered circle badges; unordered → violet bullets |
| 7 | Paragraph | anything else | Consecutive non-block lines joined with spaces |

`renderInlineTokens(text) → ReactNode[]` — a single alternation regex handling
`` `code` ``, `**bold**`, `*italic*`, and `[text](url)`. Links branch on destination:

- **internal** (`/…`) → Next.js `<Link>` styled as a violet pill with a right-arrow —
  client-side navigation, no reload
- **external** → `<a target="_blank" rel="noopener noreferrer">` as a blue pill with
  an external-link glyph

This is why the system prompt insists on markdown link syntax: it is the mechanism by
which the assistant can *navigate the user*, not merely describe navigation.

**Renderer limits.** No nested lists, no inline HTML, no reference-style links, no
strikethrough, no task lists, and a table requires its separator row to be present
(rows are taken from index 2 onward).

---

## ▸ Model Selection Rationale

| Model | Role | Why |
|---|---|---|
| `openai/gpt-oss-120b` | Primary, all three capabilities | Open-weight 120B on Groq's LPU inference; sub-second latency at high quality, with native JSON-mode support the classification contract depends on |
| `llama-3.3-70b-versatile` | D0MI rate-limit fallback | Smaller, separately rate-limited pool; conversational quality holds without JSON-mode requirements |

Latency is the architectural justification. The premise in
[Overview](01-overview.md#the-thesis) is that inoculation must beat virality, and a
multi-second classification round-trip would put a visible stall between a citizen
pressing *Submit* and seeing a diagnosis.

---

## ▸ Simulated Intelligence — labelled honestly

Two surfaces present as AI but perform no inference.

**◐ Vaccine Lab "AI Auto-Draft"** — [`app/vaccine/page.tsx`](../app/vaccine/page.tsx)

```ts
const handleSynthesizeAI = (strain: Strain) => {
  setIsGenerating(true);
  setTimeout(() => {
    setVaccineTitle(`Fact-Check: Disproving ${strain.name}`);
    setExplainer(`Analysis by verified fact-checking desks reveals that the viral claim is ${
      strain.technique === "cloned_voice"      ? "synthesized using commercial AI voice clone filters."
      : strain.technique === "out_of_context_image" ? "an archived image from an unrelated historical incident."
      : "fabricated without official regulatory grounding."
    } Primary public services continue normal uninterrupted operations.`);
    setIsGenerating(false);
  }, 600);
};
```

A technique-branched template with a 600 ms artificial delay. It is a genuinely useful
starting scaffold for the human writer — and it is not a model call. Wiring it to
`/api/domi` or a dedicated `/api/synthesize` handler is a contained change; the
component already has the loading state.

**◐ Landing-page pipeline mockups** — [`app/page.tsx`](../app/page.tsx) Scene 4

The five interactive stage cards render `mock1_*` … `mock5_*` translation keys —
pre-written illustrative telemetry ("Groq AI classified: 94% synthetic lip-sync
manipulation"), not live output. Correct for a marketing surface; noted here so the
distinction is never ambiguous.

---

## ▸ Testing the Pipeline

**Without credentials** — the heuristic path. Load [`/submit`](../app/submit/page.tsx)
and click the three sample buttons; each is written to trigger a different rule in the
keyword ladder. Confirm on [`/analyst`](../app/analyst/page.tsx) to exercise lexical
clustering against the five seed strains.

**With `GROQ_API_KEY` set** — the server handlers go live immediately:

```bash
curl -X POST http://localhost:3000/api/classify \
  -H "Content-Type: application/json" \
  -d '{"text":"Leaked audio of the health minister ordering hospitals to hide oxygen shortages"}'

curl -X POST http://localhost:3000/api/match-strain \
  -H "Content-Type: application/json" \
  -d '{"submissionText":"ATM withdrawals frozen for 72 hours","existingStrainSummary":"Falsified screenshot of a central bank notice claiming ATMs will be suspended for 72 hours"}'
```

D0MI goes live through the UI at `Ctrl/Cmd + K` with no further configuration.
Full contracts in [API Reference](05-api-reference.md).

---

[Docs Home](README.md) · [← 03 Data Model](03-data-model.md) · **04** · [05 API Reference →](05-api-reference.md)
