⊕ **Internationalization**
[Docs Home](README.md) · [← 08 State Management](08-state-management.md) · **09** · [10 Design System →](10-design-system.md)

---

# ⊕ Internationalization

**24 languages. 3,624 strings. And an encoding bug we found by counting bytes.**

24 languages × 151 keys = **3,624 translated strings**, held in a single
dictionary-driven React context.

**Source:** [`context/LanguageContext.tsx`](../context/LanguageContext.tsx) —
3,818 lines, of which ~3,700 are dictionary data.

---

## ▸ Why It Matters Here

Challenge 3 of the [problem statement](01-overview.md#the-four-challenges-addressed)
is language and regional inequity: verification tooling is overwhelmingly English-only,
which leaves exactly the communities most exposed to forwarded-message disinformation
without defenses. Shipping 24 languages is not a feature checkbox in this project — it
is the response to a stated challenge.

The submission form separately captures the language *of the reported content*
(see [`/submit`](06-routes-and-roles.md#-submit--spotter)), so a Hindi voice note
reported by a Swahili-speaking analyst is representable end to end.

---

## ▸ The 24 Languages

Ordered as they appear in `GLOBAL_LANGUAGES`, which is also their order in the navbar
picker. The strip inserts vertical `EUR` and `WORLD` dividers before `FR` and `HI`.

### Primary

| Code | Label | Native |
|---|---|---|
| `EN` | English | English |

### European — `EUR` (15)

| Code | Label | Native |
|---|---|---|
| `FR` | French | Français |
| `DE` | German | Deutsch |
| `IT` | Italian | Italiano |
| `ES` | Spanish | Español |
| `PT` | Portuguese | Português |
| `NL` | Dutch | Nederlands |
| `SV` | Swedish | Svenska |
| `PL` | Polish | Polski |
| `EL` | Greek | Ελληνικά |
| `DA` | Danish | Dansk |
| `FI` | Finnish | Suomi |
| `CS` | Czech | Čeština |
| `RO` | Romanian | Română |
| `HU` | Hungarian | Magyar |
| `RU` | Russian | Русский |

### World — `WORLD` (8)

| Code | Label | Native |
|---|---|---|
| `HI` | Hindi | हिन्दी |
| `MX` | Mexican Spanish | Español (México) |
| `JA` | Japanese | 日本語 |
| `ZH` | Chinese | 中文 |
| `KO` | Korean | 한국어 |
| `BR` | Brazilian Portuguese | Português (Brasil) |
| `SW` | African Swahili | Kiswahili |
| `AR` | Arabian | العربية |

**Regional variants are first-class.** `MX` and `BR` are separate dictionaries from
`ES` and `PT`, not aliases — recognizing that Mexican Spanish and Brazilian Portuguese
diverge enough in idiom to matter for plain-language public-health messaging.

▲ `AR` is present in the dictionary but the document direction is never switched.
There is no `dir="rtl"` anywhere in the codebase — the `<html>` element in
[`app/layout.tsx`](../app/layout.tsx) is fixed at `lang="en"`. Arabic renders as
correct glyphs in a left-to-right layout. See
[Internationalization](09-internationalization.md#-the-24-languages).

---

## ▸ Architecture

```
GLOBAL_LANGUAGES: LanguageMeta[]           24 entries — code, label, native
TRANSLATIONS: Record<LanguageCode,         24 dictionaries × 151 keys
                     Record<string,string>>
        │
        ▼
LanguageProvider                            mounted in app/layout.tsx
        │  language: LanguageCode           default "EN"
        │  ← localStorage "vois_language"   validated against TRANSLATIONS
        ▼
useLanguage() → { language, setLanguage, t }
        │
        ├──▸ VoisNavbar     nav labels, role strip, buttons, language picker
        ├──▸ VoisFooter     statements, role loop, credits
        ├──▸ app/page.tsx   all seven scenes
        ├──▸ LeafletMap     radar labels, strain statuses, legend
        └──▸ DomiChat       reads `language` only, to pass as userLanguage
```

### The lookup chain

```ts
const t = (key: string): string => {
  const langDict = TRANSLATIONS[language] || TRANSLATIONS.EN;
  return langDict[key] || TRANSLATIONS.EN[key] || key;
};
```

Three tiers, each a genuine safety net:

| Tier | Condition | Result |
|---|---|---|
| 1 | Key exists in the active dictionary | Translated string |
| 2 | Key missing, exists in `EN` | English string |
| 3 | Key missing everywhere | **The key itself** |

Tier 3 is the important design choice. A typo in `t("radar_stabel")` renders the
literal text `radar_stabel` — visible enough that a reviewer catches it, quiet enough
that it never crashes a page or leaves a blank region in the UI.

All 24 dictionaries currently contain all 151 keys, so tier 2 is never exercised in
practice. It becomes load-bearing the moment a new key is added.

### Persistence

```ts
useEffect(() => {
  const saved = localStorage.getItem("vois_language") as LanguageCode;
  if (saved && TRANSLATIONS[saved]) setLanguageState(saved);
}, []);
```

Validated against the dictionary, so a tampered or stale value falls back to English
rather than producing `undefined` lookups. Every `localStorage` call is wrapped in
`try/catch`.

---

## ▸ Key Inventory

151 keys in ten functional groups.

| Group | Count | Consumer | Sample keys |
|---|---|---|---|
| Chrome & controls | 5 | Navbar | `scroll_explore`, `theme_light`, `theme_dark`, `menu`, `close` |
| Navigation | 15 | Navbar drawer | `nav_radar` + `nav_radar_meta` × 6 routes, `nav_protocols`, `nav_active_role`, `nav_languages` |
| Hero & status | 9 | Landing, Footer | `hero_tag`, `hero_subtag`, `status_protocol`, `status_operational`, `hero_statement_1/2`, `hero_desc`, `btn_report`, `btn_map` |
| Telemetry card | 10 | Landing Scene 2 | `card_surveillance_telemetry`, `card_vector_defense`, `card_contained`, `card_mean_time`, `card_minutes`, `card_unesco_framework` |
| Metrics | 15 | Landing Scene 3 | `metrics_detections`, `metrics_confirmed`, `metrics_vaccines`, `metrics_pending`, `metric_sub_*` |
| Protocol & roles | 27 | Landing Scene 4 | `protocol_heading`, `stage_protocol`, `launch_console`, `role_spotter` + `_title`/`_tagline`/`_desc` × 5 |
| Radar | 13 | Landing Scene 5, `LeafletMap` | `radar_tag`, `radar_regional_report`, `radar_active_strains`, `radar_stable`, `radar_moderate`, `radar_critical` |
| Strains | 12 | Landing Scene 6 | `strains_heading`, `filter_all`, `filter_vaccinated`, `filter_deepfake`, `reports_count`, `vaccine_active`, `no_vaccine` |
| UNESCO & pledge | 8 | Landing Scene 7 | `unesco_heading`, `unesco_desc`, `pledge_registry`, `unesco_cta`, `pledge_activated` |
| Footer | 12 | Footer | `footer_immune_system`, `footer_heading`, `footer_theme_desc`, `footer_engine_desc`, `footer_copyright` |
| Mock telemetry | 25 | Landing Scene 4 | `mock1_type` … `mock5_action` — 5 stages × 5 fields |

### The `mock*` block

25 of 151 keys — a sixth of the entire translation surface — render the pipeline stage
cards on the landing page. Each stage has five fields:

| Field | Purpose | English example (stage 1) |
|---|---|---|
| `type` | Stage label | `CONTENT INTAKE` |
| `badge` | Status chip | `Deepfake Alert` |
| `specimen` | The sample artifact | `Doctored video clip of a municipal election official` |
| `ai` | Simulated diagnosis | `Groq AI classified: 94% synthetic lip-sync manipulation.` |
| `action` | Outcome line | `Flagged within 120ms into the triage queue` |

◐ These are illustrative copy, not live model output — see
[AI Pipeline · Simulated intelligence](04-ai-pipeline.md#-simulated-intelligence--labelled-honestly).
They are also where nearly all of the encoding damage below is concentrated.

---

## ▸ ▲ Encoding Audit — 22 of 24 Dictionaries Are Damaged

**22 of 24 dictionaries contain mojibake** — UTF-8 bytes that were decoded as Latin-1
and then re-encoded as UTF-8, producing sequences like `Ã©` where `é` was intended.

Only `EN` and `HI` are clean.

| Language | Damaged sequences | Affected keys (of 151) | Severity |
|---|---|---|---|
| `HU` Hungarian | 81 | 24 | ▰▰▰▰▰ |
| `CS` Czech | 48 | 23 | ▰▰▰▰▰ |
| `FR` French | 34 | 19 | ▰▰▰▰▱ |
| `FI` Finnish | 31 | 16 | ▰▰▰▰▱ |
| `SV` Swedish | 20 | 19 | ▰▰▰▰▱ |
| `PT` Portuguese | 18 | 28 | ▰▰▰▰▱ |
| `BR` Brazilian Portuguese | 17 | 29 | ▰▰▰▰▱ |
| `DE` German | 14 | 12 | ▰▰▰▱▱ |
| `ES` Spanish | 14 | 13 | ▰▰▰▱▱ |
| `MX` Mexican Spanish | 13 | 12 | ▰▰▰▱▱ |
| `RO` Romanian | 6 | 13 | ▰▰▱▱▱ |
| `DA` Danish | 3 | 12 | ▰▰▱▱▱ |
| `PL` Polish | 9 | 8 | ▰▰▱▱▱ |
| `NL` Dutch | 3 | 5 | ▰▱▱▱▱ |
| `IT` Italian | 3 | 5 | ▰▱▱▱▱ |
| `EL` Greek | 4 | 4 | ▰▱▱▱▱ |
| `RU` `JA` `ZH` `KO` `SW` `AR` | 3 each | 3 each | ▰▱▱▱▱ |
| `EN` `HI` | 0 | 0 | clean |

### Two distinct patterns

**▸ The universal three.** Every non-English dictionary — including Japanese, Chinese,
Korean, Russian, Swahili, and Arabic, whose own scripts are otherwise intact — has
exactly three damaged keys:

```
mock2_action    mock3_ai    mock5_specimen
```

All three contain the middle-dot separator `·`, which appears as `Â·`. These strings
were clearly authored once in English and copied into every dictionary, carrying the
corruption with them.

**▸ Accented-Latin damage.** Languages whose alphabets use accented Latin characters
show far broader damage, concentrated in the `mock*` block:

| Language | Intended | Renders as |
|---|---|---|
| `FR` | `Français`, `détecté` | `FranÃ§ais`, `dÃ©tectÃ©` |
| `HU` | `választási`, `Ã–nkormányzati` | `vÃ¡lasztÃ¡si`, `Ã–nkormÃ¡nyzati` |
| `SV` | `Övervakade`, `påverkan` | `Ã–vervakade`, `pÃ¥verkan` |
| `CS` | `zprávy`, `příklad` | `zprÃ¡vy`, `pÅ™Ã­klad` |
| `FI` | `Alueellinen`, `jäljitys` | `Alueellinen`, `jÃ¤ljitys` |

`PT` and `BR` are the widest by key count (28 and 29 keys) — their damage extends past
the `mock*` block into `hero_subtag`, `card_surveillance_telemetry`, and
`footer_copyright`, which are visible on the landing page above the fold.

### Diagnosis

The signature is unambiguous: a text pipeline read UTF-8 source as Latin-1 (or
Windows-1252) and wrote it back out as UTF-8. Typical causes are an editor saving
without a declared encoding, a copy-paste through a tool with a codepage default, or a
script processing the file with the wrong `encoding=` argument.

The damage is **in the source file**, not in the rendering. `t()` returns exactly what
is stored.

### Repair

The transformation is losslessly reversible for the standard `Ã`/`Â` sequences:

```python
# scripts/fix-encoding.py
import io, re

path = "context/LanguageContext.tsx"
src = io.open(path, encoding="utf-8").read()

def repair(m):
    s = m.group(0)
    try:
        return s.encode("latin-1").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return s   # leave untouched if it does not round-trip

# match mojibake runs: a lead byte Ã/Â/â followed by continuation-range chars
fixed = re.sub(r"[ÃÂâ][\x80-\xBFĀ-ſƒˆ†-›]+", repair, src)

io.open(path, "w", encoding="utf-8", newline="\n").write(fixed)
```

**Verification** after running — this should print nothing:

```bash
grep -nP '[ÃÂâ][\x80-\xBF]' context/LanguageContext.tsx
```

Then spot-check rendered output for `FR`, `HU`, `CS`, `PT`, and `BR` in the browser.
A handful of sequences in `BR`, `PT`, `CS`, `FI`, and `RO` involve a replacement
character (`�`) where the original byte was already lost — those need manual
retranslation, not automated repair.

Tracked as [Internationalization](09-internationalization.md#--encoding-audit--22-of-24-dictionaries-are-damaged).

---

## ▸ Coverage Gaps

The dictionary is complete — all 24 languages have all 151 keys. What is *not* complete
is the set of surfaces that consume it.

### ● Fully translated

| Surface | Notes |
|---|---|
| [`VoisNavbar`](../components/VoisNavbar.tsx) | Every string except the `V0ICE` wordmark and the literal `"Paris"` |
| [`VoisFooter`](../components/VoisFooter.tsx) | Complete |
| [`app/page.tsx`](../app/page.tsx) | All seven scenes |
| [`LeafletMap`](../components/LeafletMap.tsx) | Complete — the only role-facing component that is |

### ○ Not translated — hardcoded English

| Surface | Examples |
|---|---|
| [`/submit`](../app/submit/page.tsx) | `"Report A Suspected Misinformation Strain"`, all form labels, all three sample buttons |
| [`/analyst`](../app/analyst/page.tsx) | `"Misinformation Triage Queue"`, `"CONFIRM STRAIN"`, the entire edit modal |
| [`/vaccine`](../app/vaccine/page.tsx) | `"Synthesize Digital Vaccines"`, `"AI Auto-Draft"`, both console labels |
| [`/distribute`](../app/distribute/page.tsx) | `"Deploy Counter-Content To Affected Territories"`, `"ACTIVE VECTOR"` |
| [`/strains`](../app/strains/page.tsx) | `"Confirmed Misinformation Strains"`, filter pills, search placeholder |
| [`/map`](../app/map/page.tsx) | Header and the three explainer panels (the embedded map *is* translated) |
| [`DomiChat`](../components/DomiChat.tsx) | Greeting, four starter prompts, all UI chrome |

**The pattern is clean and unfortunate:** the landing page — the surface a judge or
first-time visitor sees — is fully localized, while the working consoles where a
non-English-speaking citizen would actually spend time are English-only.

Closing this requires roughly 120 additional keys across the five consoles. The
architecture supports it with no changes; only the dictionaries and the JSX need
editing.

### D0MI's separate path

D0MI does not use `t()` for its replies. It passes the active `language` code to
`/api/domi` as `userLanguage`, and the system prompt instructs the model to reply
fluently in that language. Its *interface* strings remain English; its *content* is
model-translated on demand — a different and arguably more scalable mechanism, since
it covers arbitrary user input rather than a fixed key set.

The in-chat language picker also injects a localized confirmation turn into the
transcript, so switching language is visibly acknowledged.

---

## ▸ Adding a Language

**1 ·** Extend the union in [`context/LanguageContext.tsx`](../context/LanguageContext.tsx):

```ts
export type LanguageCode = "EN" | "HI" | /* … */ | "VI";
```

**2 ·** Add the metadata entry in the correct section of `GLOBAL_LANGUAGES` — the
navbar's `EUR`/`WORLD` dividers key off the positions of `FR` and `HI`, so insertion
order determines which section it appears in:

```ts
{ code: "VI", label: "Vietnamese", native: "Tiếng Việt" },
```

**3 ·** Add a complete 151-key dictionary to `TRANSLATIONS`. Copy the `EN` block as a
template so no key is missed. **Save as UTF-8 without BOM** — this is precisely the
step that produced the corruption documented above.

**4 ·** Verify:

```bash
# key parity across all dictionaries
node -e "const{TRANSLATIONS}=require('./context/LanguageContext.tsx');" 2>/dev/null || \
python -c "
import re,io,collections
src=io.open('context/LanguageContext.tsx',encoding='utf-8').read()
langs=re.findall(r'^  ([A-Z]{2}): \{',src,re.M)
blocks=re.split(r'^  [A-Z]{2}: \{',src,flags=re.M)[1:]
en=None
for l,b in zip(langs,blocks):
    keys=set(re.findall(r'^    (\w+):',b.split('\n  },')[0],re.M))
    if l=='EN': en=keys
    print(l, len(keys), 'missing:', sorted(en-keys) if en else '')
"

# encoding check — should print nothing
grep -nP '[ÃÂâ][\x80-\xBF]' context/LanguageContext.tsx
```

**5 ·** Confirm `t()` resolves and, for RTL scripts, note that
[Internationalization](09-internationalization.md#-the-24-languages).

---

## ▸ Scaling Considerations

**File size.** At 3,818 lines, the dictionary is 30% of the entire codebase and ships
in full to every client — all 24 languages are in the JavaScript bundle regardless of
which one is selected. At 48 languages this would be a real payload problem.

The remedy is dynamic imports per language:

```
context/
├── LanguageContext.tsx        provider + type + GLOBAL_LANGUAGES
└── translations/
    ├── en.ts   hi.ts   fr.ts   de.ts   …
```

```ts
const dict = await import(`./translations/${language.toLowerCase()}`);
```

This also makes each dictionary independently reviewable by a native speaker and makes
encoding damage attributable to a single file rather than a 3,800-line monolith.

**Interpolation.** `t()` returns static strings with no parameter substitution.
Anything dynamic is composed in JSX — `{regions.length} {t("radar_monitored")}` — which
breaks for languages whose word order differs. A `t(key, params)` signature with
`{count}` placeholders would fix this.

**Pluralization.** No plural rules exist. `t("reports_count")` renders the same string
for 1 and for 12. Slavic languages (`RU`, `PL`, `CS`) have three plural forms and
Arabic has six; none are representable today.

---

[Docs Home](README.md) · [← 08 State Management](08-state-management.md) · **09** · [10 Design System →](10-design-system.md)
