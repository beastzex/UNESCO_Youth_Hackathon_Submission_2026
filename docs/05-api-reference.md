⇄ **API Reference**
[Docs Home](README.md) · [← 04 AI Pipeline](04-ai-pipeline.md) · **05** · [06 Routes & Roles →](06-routes-and-roles.md)

---

# ⇄ API Reference

**Three endpoints. Malformed input gets a 400. Everything else gets a 200 — on purpose.**

Three route handlers, all `POST`, all under [`app/api/`](../app/api/). They run on the
Node runtime inside the same Next.js deployment and exist for one reason: to keep
`GROQ_API_KEY` off the client.

| Endpoint | Purpose | Called by the UI |
|---|---|---|
| [`POST /api/classify`](#-post-apiclassify) | Classify submitted content | ○ no |
| [`POST /api/match-strain`](#-post-apimatch-strain) | Compare a submission to a strain | ○ no |
| [`POST /api/domi`](#-post-apidomi) | D0MI conversational turn | ● yes |

▲ Only `/api/domi` has a caller. The other two are fully implemented and reachable,
but [`lib/store.ts`](../lib/store.ts) imports the domain functions directly instead of
fetching them — which is why classification runs on heuristics in the browser. See
[AI Pipeline](04-ai-pipeline.md#-the-key-resolution-problem--why-groq-never-answers-the-browser).

---

## ▸ Shared Conventions

**Method.** `POST` only. No `GET`, `PUT`, or `DELETE` handlers are exported, so other
verbs receive Next.js's default `405`.

**Content type.** `application/json` in and out.

**Authentication.** None. All three endpoints are unauthenticated and unrate-limited.
Anything deployed publicly is an open proxy to your Groq quota — see
[API Reference](05-api-reference.md#-operational-notes).

**Error philosophy.** Malformed *input* returns `400`. Downstream *failure* returns
`200` with a usable fallback payload. The rationale: the UI should degrade, not break.
The cost: a client cannot distinguish "the model answered" from "the model failed and
this is a default", except by inspecting the optional `error` field on the classify
and match responses.

**CORS.** No headers are set, so the browser same-origin policy applies. Cross-origin
callers need a proxy.

---

## ▸ `POST /api/classify`

Classifies a piece of suspicious content into a manipulation technique with an intent,
confidence score, and plain-language summary.

**Source:** [`app/api/classify/route.ts`](../app/api/classify/route.ts) →
[`classifySubmission()`](../lib/groq.ts)

### Request

```json
{ "text": "Leaked audio of the health minister ordering hospitals to hide oxygen shortages" }
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `text` | `string` | ● | Must be a non-empty string. No length limit is enforced. |

### Response `200`

```json
{
  "technique": "cloned_voice",
  "intent": "Fabricating synthetic speech to impersonate civic authorities",
  "confidence": 0.94,
  "summary": "Audio recording alleging the health minister ordered hospitals to conceal oxygen shortages."
}
```

| Field | Type | Range | Notes |
|---|---|---|---|
| `technique` | `TechniqueType` | six-member union | Defaults to `"other"` |
| `intent` | `string` | — | Short motive phrase |
| `confidence` | `number` | `0.0`–`1.0` | Defaults to `0.88` if the model omits it |
| `summary` | `string` | — | Falls back to `text.slice(0, 120)` |
| `error` | `string` | — | Present **only** on the outer-catch fallback |

### Response `400`

```json
{ "error": "Missing or invalid text parameter" }
```

Returned when `text` is absent or not a string.

### Fallback `200`

If the handler itself throws — malformed body, unexpected exception — it returns a
neutral classification with an `error` field, rather than a `500`:

```json
{
  "technique": "other",
  "intent": "Manipulate public perception",
  "confidence": 0.82,
  "summary": "Misinformation claim submitted for analysis",
  "error": "…exception message…"
}
```

Note the layering: a *Groq* failure is absorbed inside `classifySubmission` by the
heuristic engine and returns a normal response with no `error` field. Only a *handler*
failure produces the payload above.

### Example

```bash
curl -X POST http://localhost:3000/api/classify \
  -H "Content-Type: application/json" \
  -d '{"text":"Viral screenshot shows the central bank freezing all ATM withdrawals for 72 hours"}'
```

```json
{
  "technique": "doctored_screenshot",
  "intent": "Fabricating institutional announcements or financial panic",
  "confidence": 0.89,
  "summary": "Viral screenshot shows the central bank freezing all ATM withdrawals for 72 hours"
}
```

Behaviour details, prompts, and the heuristic ladder:
[AI Pipeline · Classification](04-ai-pipeline.md#-capability-1--content-classification).

---

## ▸ `POST /api/match-strain`

Determines whether a new submission expresses the same underlying false claim as an
existing strain — tolerant of rewording, translation, and format change.

**Source:** [`app/api/match-strain/route.ts`](../app/api/match-strain/route.ts) →
[`isSameStrain()`](../lib/groq.ts)

### Request

```json
{
  "submissionText": "Forwarded message says all ATMs shut down tonight for three days",
  "existingStrainSummary": "Falsified screenshot of a central bank notice claiming automated teller machines and digital wire transfers will be suspended for 72 hours."
}
```

| Field | Type | Required |
|---|---|---|
| `submissionText` | `string` | ● |
| `existingStrainSummary` | `string` | ● |

Both are truthiness-checked, so empty strings are rejected as missing.

### Response `200`

```json
{
  "same_strain": true,
  "confidence": 0.93,
  "reason": "Both claim a multi-day suspension of ATM and transfer services attributed to the central bank."
}
```

| Field | Type | Notes |
|---|---|---|
| `same_strain` | `boolean` | Coerced with `Boolean()` |
| `confidence` | `number` | `0.0`–`1.0`; defaults to `0.85` if omitted by the model |
| `reason` | `string` | Defaults to `"Semantic overlap in core claim."` |
| `error` | `string` | Present only on handler-level failure |

### Response `400`

```json
{ "error": "Missing submissionText or existingStrainSummary" }
```

### Fallback `200`

```json
{
  "same_strain": false,
  "confidence": 0.5,
  "reason": "Evaluation completed with fallback",
  "error": "…exception message…"
}
```

Defaulting to `same_strain: false` is the conservative choice — a handler failure
creates a new strain rather than silently merging unrelated reports.

### Consumer semantics

[`confirmSubmission`](../lib/store.ts) applies a **0.70 confidence floor** and selects
the highest-confidence match across all strains. A `same_strain: true` at confidence
`0.65` is discarded. See
[AI Pipeline · Clustering](04-ai-pipeline.md#-the-clustering-algorithm).

### Example

```bash
curl -X POST http://localhost:3000/api/match-strain \
  -H "Content-Type: application/json" \
  -d '{
        "submissionText":"Photos of the dam breaking, houses already flooded",
        "existingStrainSummary":"Viral images claiming the Coastal Hydro-Dam has suffered a structural wall collapse, causing emergency evacuations."
      }'
```

---

## ▸ `POST /api/domi`

A conversational turn with D0MI. The only endpoint the UI calls, and the only place
live model inference happens in normal operation.

**Source:** [`app/api/domi/route.ts`](../app/api/domi/route.ts)
**Client:** [`components/DomiChat.tsx`](../components/DomiChat.tsx)

### Request

```json
{
  "messages": [
    { "role": "user",      "content": "How does the herd immunity score work?" },
    { "role": "assistant", "content": "It is the ratio of distributed vaccines…" },
    { "role": "user",      "content": "What counts as an active strain?" }
  ],
  "userLanguage": "FR"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `messages` | `Array<{role, content}>` | ● | `role` is `"user"` or `"assistant"`. Must be an array. |
| `userLanguage` | `LanguageCode` | ○ | Defaults to `"EN"`. Appended to the system prompt. |

The client sends the **entire** transcript; the handler truncates to
`messages.slice(-10)` before calling the model. The system prompt is injected
server-side and is never accepted from the client.

### Response `200`

```json
{
  "role": "assistant",
  "content": "### Herd Immunity\n\nThe score is…\n\n- See the [Outbreak Radar](/map)\n"
}
```

`content` is markdown, rendered by the in-component parser described in
[AI Pipeline · The markdown renderer](04-ai-pipeline.md#the-markdown-renderer).
Internal `/…` links become client-side navigation pills.

### Response `400`

```json
{ "error": "Invalid messages array" }
```

The only `4xx` this handler emits — returned when `messages` is not an array.

### Response `200` — key missing

```json
{
  "role": "assistant",
  "content": "⚠️ Groq API key is missing. Please add `GROQ_API_KEY` to your `.env.local` to enable live GPT-OSS-120B intelligence for D0MI."
}
```

Deliberately `200` with an in-character setup instruction, so an unconfigured
deployment renders guidance in the chat bubble instead of an error state.

### Response `200` — total failure

```json
{
  "role": "assistant",
  "content": "I encountered a momentary communication glitch (Inference timeout). Please try asking your question again!"
}
```

### Model parameters

| | Primary | Rate-limit fallback |
|---|---|---|
| Model | `openai/gpt-oss-120b` | `llama-3.3-70b-versatile` |
| Temperature | `0.7` | `0.7` |
| Max tokens | `1024` | `800` |
| History window | last 10 turns | last 6 turns |
| Trigger | default | `error.status === 429` or `/rate/` in the message |

### Example

```bash
curl -X POST http://localhost:3000/api/domi \
  -H "Content-Type: application/json" \
  -d '{
        "messages":[{"role":"user","content":"Explain pre-bunking in two sentences."}],
        "userLanguage":"EN"
      }'
```

---

## ▸ Status Code Summary

| Code | Emitted by | Condition |
|---|---|---|
| `200` | all three | Success, **and** every downstream failure mode |
| `400` | `/api/classify` | `text` missing or not a string |
| `400` | `/api/match-strain` | Either text field missing or empty |
| `400` | `/api/domi` | `messages` is not an array |
| `405` | all three | Any method other than `POST` (Next.js default) |
| `500` | — | Never intentionally emitted |

---

## ▸ Operational Notes

**No streaming.** All three handlers await the complete model response before
returning. D0MI's replies appear at once rather than token by token. Adding streaming
would require switching to `stream: true` and returning a `ReadableStream` — the Node
runtime supports this natively with no configuration.

**No caching.** Every call reaches the model. Identical classification requests are
recomputed. A content-hash cache in front of `/api/classify` would be a cheap win once
that endpoint is actually wired to the store.

**No rate limiting.** Nothing bounds request volume. Any public deployment should sit
behind platform-level rate limiting or a bot filter before these endpoints are exposed.

**No request logging.** Failures go to `console.error`; successful requests leave no
trace. There is no audit trail of what was classified or asked.

**Timeouts.** No explicit timeout is configured on the SDK. The platform's function
timeout governs; a hung Groq connection will hold the handler until that fires.

---

## ▸ Integration Checklist

To route the store through these endpoints instead of calling the domain functions
directly — the change that activates live inference across the whole pipeline:

**1 ·** In [`lib/store.ts`](../lib/store.ts) `addSubmission`, replace
`await classifySubmission(data.content_text)` with a `fetch("/api/classify")` call.
The response shape already matches `ClassificationResult` exactly.

**2 ·** In `confirmSubmission`, replace the per-strain `await isSameStrain(...)` with
`fetch("/api/match-strain")`. Note this makes the *n* sequential calls network calls —
consider adding a batch endpoint that accepts an array of summaries and returns the
best match in one round-trip.

**3 ·** Remove the `import { isSameStrain, classifySubmission } from "./groq"` line so
`lib/groq.ts` is no longer pulled into the client bundle. This also removes the
`dangerouslyAllowBrowser: true` surface from the browser entirely — see
[AI Pipeline](04-ai-pipeline.md#-the-key-resolution-problem--why-groq-never-answers-the-browser).

**4 ·** Add a request-failure fallback at the call site so a network error still
produces a submission — the current heuristic engine can be lifted into a small local
module for exactly this.

---

[Docs Home](README.md) · [← 04 AI Pipeline](04-ai-pipeline.md) · **05** · [06 Routes & Roles →](06-routes-and-roles.md)
