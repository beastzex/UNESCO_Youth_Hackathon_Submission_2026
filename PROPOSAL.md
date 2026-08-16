<div align="center">

# V0ICE

## Misinformation spreads like a virus.
## So we built the immune system.

**A proposal to stop treating disinformation as a content problem
and start treating it as a public health emergency.**

**UNESCO Youth Hackathon 2026**
*Play Your Part: Youth Designing the Future of Media and Information Literacy*

[![Live demo](https://img.shields.io/badge/live%20now-voice--beta--five.vercel.app-22C55E?style=flat&logo=vercel&logoColor=white&labelColor=333)](https://voice-beta-five.vercel.app/)
[![Source code](https://img.shields.io/badge/source-github.com%2Fbeastzex-3B82F6?style=flat&logo=github&logoColor=white&labelColor=333)](https://github.com/beastzex/UNESCO_Youth_Hackathon_Submission_2026)
[![Demo video](https://img.shields.io/badge/demo-watch%20on%20youtube-EF4444?style=flat&logo=youtube&logoColor=white&labelColor=333)](https://youtu.be/Tzlrb1JIgyo?si=JBEu2I9SuoxrrKx1)

*For the best experience, view this video on mobile.*
[![Status](https://img.shields.io/badge/status-deployed%2C%20not%20a%20mockup-3B82F6?style=flat&labelColor=333)](https://voice-beta-five.vercel.app/)
[![Languages](https://img.shields.io/badge/languages-24%20at%20launch-8B5CF6?style=flat&labelColor=333)](docs/09-internationalization.md)
[![Latency](https://img.shields.io/badge/diagnosis-under%201%20second-EF4444?style=flat&labelColor=333)](docs/04-ai-pipeline.md)
[![Cost](https://img.shields.io/badge/cost%20to%20run-%240-EAB308?style=flat&labelColor=333)](docs/11-setup-and-operations.md#-zero-config-mode--what-works-with-no-credentials-at-all)

</div>

---

## ▣ The One-Sentence Version

**We turned media literacy from a school subject into a live public-health metric —
and shipped it in 24 languages for free.**

---

## ▣ The Uncomfortable Truth

Every institution fighting disinformation today is organised like a newspaper.
A small expert desk. One claim at a time. Corrections published days later.

**That's fighting cholera by writing articles about cholera.**

The work isn't bad. The *shape* is wrong. You cannot beat a transmission problem with
a publishing schedule.

Public health figured this out a century ago. Not with better pamphlets — with
**surveillance networks, case reporting, strain typing, vaccine production, and
distributed immunisation.** A system where ordinary people are the sensors *and* the
delivery mechanism. Where protection isn't a personal virtue — it's a **number on a
map that goes up when the community acts.**

> ### V0ICE is that system, rebuilt for the information ecosystem.
> **Five roles. One protocol. A number that tells you if it's working.**

| | |
|---|---|
| Any citizen is a **case reporter** | No credentials. No training. No gatekeeper. |
| Every report is **diagnosed in under a second** | An open-weight 120-billion-parameter model, not a queue |
| Rumours are **typed into strains** | Across language, wording, and format — the way pathogens are typed |
| Counter-content is a **two-sentence vaccine** | Engineered to survive being forwarded |
| Protection is **measured live** | The Herd Immunity Index, per region, right now |

**And here's the part that matters:** it is not a concept, a deck, or a mockup.
It is **deployed, public, and running right now** at
**[voice-beta-five.vercel.app](https://voice-beta-five.vercel.app/)** — in 24 languages,
with zero configuration and zero cost.

You can break it yourself in the next three minutes.

---

## ▣ 1 · Truth Is Losing a Race It Never Agreed to Run

### The six-times problem

Vosoughi, Roy and Aral analysed roughly 126,000 cascades on Twitter (*Science*, 2018).
The finding is brutal:

> **False news reached 1,500 people six times faster than true news.**
> It spread farther, deeper, and faster across every category.
> And it was driven by **humans, not bots.**

Novelty beats correction. That is not a moderation bug to be patched — it is a property
of the medium itself.

**Any response running on a slower clock than the pathogen loses by definition.**

```
    reach
      │        ╭─────────────────── falsehood plateaus · belief has formed
      │      ╭─╯
      │    ╭─╯
      │  ╭─╯
      │╭─╯                     ┌──────────────────── the correction finally arrives
      ╰┴──────────────────────┬┴──────────────────▸ time
       0h        2h           24–72h

       ↑ the entire transmission     ↑ institutions show up
         window — conceded             to an argument already over
```

### Five reasons the current model can't close the gap

| | |
|---|---|
| **Centralised** | A desk of 5–20 people is the bottleneck for a population of millions. Throughput can never scale to the threat. |
| **Reactive** | Work starts *after* a claim goes viral. The first two hours — the whole fight — are given away for free. |
| **Long-form** | A 1,500-word debunk does not travel through the channels a 15-second clip travels through. Format mismatch is fatal. |
| **English-first** | Verification tooling clusters in high-resource languages, leaving the communities most dependent on forwarded voice notes structurally undefended. |
| **Unmeasured** | No fact-checking organisation on earth can tell you how protected a specific district is *today*. Without a metric there is no operations — only output. |

### What the science actually says

The dramatic "backfire effect" has weakened under replication — Wood & Porter (2019)
found corrections generally *do* move beliefs. But something more stubborn survived:
the **continued influence effect**. Retracted misinformation keeps shaping how people
reason *even after they accept the correction.*

Meanwhile, **prebunking works.** Inoculation theory — showing someone a weakened dose of
a manipulation *technique* before they meet the real thing — has produced durable,
scalable effects in field experiments delivered as short video (Roozenbeek, van der
Linden et al., *Science Advances*, 2022).

> **The evidence points one direction: get there first, and teach the trick, not just
> the fact.**
>
> No deployed platform is organised around that principle. **This one is.**

---

## ▣ 2 · Stop Writing Articles. Start Running an Immune System.

### The reframe

> **Media and Information Literacy isn't a curriculum. It's an immune system.**

| Public health | V0ICE |
|---|---|
| Pathogen | **Strain** — a clustered false claim |
| Case report | **Submission** — one citizen sighting |
| Diagnosis | AI classification into one of six manipulation techniques |
| Strain typing | Semantic clustering across rewording, translation, and format |
| Vaccine | A **two-sentence** plain-language prebunk |
| Immunisation campaign | Distribution into a named region's community channels |
| **Herd immunity** | **A live per-region protection score** |
| Outbreak map | The surveillance radar |

**Every row above is implemented in code today.** Not planned. Not mocked. Running.

### Five roles. Anyone can hold one.

```
  01              02               03                04                05
┌────────┐   ┌──────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────┐
│SPOTTER │──▸│ ANALYST  │──▸│VACCINE MAKER │──▸│ FIELD WORKER │──▸│  RADAR   │
└────────┘   └──────────┘   └──────────────┘   └──────────────┘   └──────────┘
  anyone      fact-checker      educator          community          public
                                communicator      leader             official

  ingest   →   classify    →   synthesize    →   broadcast     →    measure
  60 sec       under 1 sec      2 sentences       per region        live index
```

**Here's the design insight everyone else misses.** Each role is a *small, separate,
finishable job.*

A student is a Spotter in sixty seconds. A teacher is a Vaccine Maker in five minutes.
A community leader is a Field Worker with the phone already in their hand.

**Nobody has to be an expert at the whole chain — which is exactly why the chain can
scale to a population when a monolithic "fact-checker" role never could.**

### The number that changes everything

$$\text{Herd Immunity}(r) = \left( \frac{\text{strains with a vaccine delivered to } r}{\text{strains active in } r} \right) \times 100$$

| Band | Status |
|---|---|
| **70–100%** | Stable community inoculation |
| **35–69%** | Inoculation in progress |
| **0–34%** | Critical vector outbreak |

**This is the most important thing in this document.**

Every other MIL intervention produces *outputs* — lessons delivered, articles published,
workshops run. Activity metrics. Attendance sheets.

This produces an **outcome that moves in real time and can be targeted.**

- A ministry opens a map and sees which district sits at 12%.
- A school network watches its own number climb week over week.
- A funder measures a programme against something other than a headcount.

> **It converts media literacy from advocacy into operations.**
> You cannot manage what you cannot measure. We built the measurement.

---

## ▣ 3 · This Isn't a Pitch Deck. It's Deployed.

Most proposals describe what will be built. **This one describes what is already running.**

| Capability | Status |
|---|---|
| Five role consoles, end to end | ● Complete |
| AI classification into 6 techniques with confidence scoring | ● Complete |
| Semantic strain clustering across rewording and language | ● Complete |
| Herd Immunity Index, live-computed | ● Complete |
| Outbreak radar with per-region dossiers | ● Complete |
| **24-language interface — 3,624 translated strings** | ● Complete |
| D0MI — embedded AI assistant, MIL-briefed, multilingual | ● Complete |
| Deterministic offline fallback for every AI call | ● Complete |
| Runs with **zero configuration, zero cost** | ● Complete |
| Full technical documentation — 11 documents | ● Complete |

**Go test it:** [voice-beta-five.vercel.app](https://voice-beta-five.vercel.app/)

A seeded outbreak — five strains across five regions — is already in progress. Submit a
rumour. Triage it. Write a vaccine. Broadcast it. **Watch the index move.**
Three minutes, start to finish.

### Three engineering calls that make the claims real

**▸ Sub-second diagnosis.**
Classification runs on `openai/gpt-oss-120b` via Groq's LPU inference. That's the
difference between a citizen seeing a verdict *while they're still suspicious* and being
told to check back tomorrow. **Latency isn't a spec here. It's the whole thesis.**

**▸ It works when nothing works.**
Every AI call has a deterministic fallback — a keyword-ladder classifier and a
lexical-overlap strain matcher. The platform degrades. It never dies.
**Resilience infrastructure that needs reliable infrastructure isn't resilience
infrastructure.**

**▸ Local-first, cloud-optional.**
State lives in the browser and mirrors to Postgres when configured. The consequence is
radical: **the barrier to running V0ICE is zero dollars and zero accounts.**
A teacher in any country can open it in a classroom this afternoon.

---

## ▣ 4 · Why Nothing Else Does This

| | Fact-check desks | Platform moderation | MIL curricula | **V0ICE** |
|---|---|---|---|---|
| Response time | 24–72 h | Hours to days | A semester | **Under 1 second** |
| Who participates | ~10 experts | Platform staff | Enrolled students | **Anyone** |
| Output | 1,500-word article | A label | A lesson plan | **2-sentence forwardable dose** |
| Timing | After virality | After a report | Before, generically | **Before, against the live strain** |
| Languages | Usually 1–3 | Uneven | Local only | **24 at launch** |
| Cross-platform | — | One platform only | — | **Channel-agnostic by design** |
| Measures protection | × | × | Survey proxies | **● Live regional index** |
| Cost to operate | Salaried desk | Corporate scale | Institutional | **$0 to start** |

> **Look at the last two rows.**
> Nothing else in this space produces a live protection metric.
> Nothing else can be stood up by a school or a youth club, for free, this week.

---

## ▣ 5 · The Math of Going Wide

> **These are projections from stated assumptions — not measured results.**
> V0ICE has not yet run a field pilot. Establishing these numbers empirically *is*
> Phase 2. We would rather show our arithmetic than quote a number we haven't earned.

**Assumptions.** One trained Field Worker maintains ~4 community groups of ~150 members.
A vaccine reaches ~40% of a group within 24 hours of posting. Prebunk retention follows
the published inoculation literature — meaningful effect persisting on the order of weeks.

| Deployment | Field workers | Groups | People reached, per strain |
|---|---|---|---|
| One school club | 20 | 80 | **~4,800** |
| One district network | 250 | 1,000 | **~60,000** |
| One national youth programme | 5,000 | 20,000 | **~1,200,000** |

This scales the way vaccination campaigns scale — **through people already trusted
inside the channel**, not through paid reach. That is precisely why we chose the
epidemiological model over a media model.

> ### The asymmetry we're exploiting
> A strain-specific prebunk costs one educator **five minutes.**
> The misinformation cost the adversary **five minutes.**
>
> **For the first time, defence and offence run on the same clock.**

---

## ▣ 6 · The Road From Here

### Phase 1 · Harden it — months 0–3

| Work | Outcome |
|---|---|
| Route all inference through server handlers | Live model classification across the entire pipeline |
| Authentication and per-role authorisation | The five roles become real permission boundaries |
| Row-level security, audit trail, moderation queue | Safe to deploy with real citizen data |
| Localise the five role consoles | Working surfaces reach the 24 languages the landing page already has |
| RTL layout support | Arabic rendered correctly — not merely present |
| Encoding repair across the dictionaries | Every language displays cleanly |

### Phase 2 · Prove it — months 3–9

- **Three pilot sites**, deliberately unlike each other: one high-resource urban school
  network, one multilingual rural district, one youth organisation in a language current
  fact-checking infrastructure ignores.
- **Test the index against reality.** The essential scientific question is whether the
  Herd Immunity Index correlates with *measured belief resistance*. Paired pre/post
  instruments against a matched control region.
- **Publish the methodology openly — including negative results.**

> **This phase matters more than any other.**
> If the index doesn't predict real resilience, it gets redesigned.
> We would rather learn that in a pilot than after scale.

### Phase 3 · Federate — months 9–24

| Track | What it unlocks |
|---|---|
| **Strain exchange protocol** | Independent deployments share strain intelligence across borders. A deepfake technique detected in one country becomes a prebunk template in six others **within hours.** |
| **Messaging-channel integration** | Vaccines delivered directly into WhatsApp, Telegram, and Signal — where the pathogen already lives |
| **Embeddings-based clustering** | Vector retrieval replaces linear scanning; directories in the tens of thousands |
| **Public API** | Newsrooms, election commissions, and health ministries consume the outbreak feed |
| **Curriculum bridge** | Aligned to the UNESCO MIL Curriculum, so classroom work produces **real defensive output**, not exercises |

> ### Where this ends up
> **A federated, youth-operated surveillance network in which a manipulation technique
> first seen anywhere is neutralised everywhere — inside the same news cycle.**

---

## ▣ 7 · Built on UNESCO's Own Blueprint

### The Five Laws of MIL, turned into software

| Law | How V0ICE implements it |
|---|---|
| Information, communication, media and digital content are equal in stature | The taxonomy treats text, image, video, audio and screenshot as peer vectors |
| Every citizen is a creator of information and has a message | Every citizen is a case reporter — and a potential Vaccine Maker |
| Information may be used for good or ill; its value is contextual | The classifier reports **technique and intent** — it teaches mechanism, not verdict |
| Citizens want to know and understand new information | D0MI answers, in 24 languages, at the moment of curiosity |
| MIL is a lived, dynamic experience and process | The protocol is a continuous loop — never a completed course |

### Wider alignment

- **WHO infodemic management** — surveillance, case reporting, and response is the WHO's
  own infodemic vocabulary. V0ICE is a working implementation of it.
- **IPDC** — open source, freely deployable, designed for low-resource communication
  environments.
- **Global MIL Week** — a live platform participants *operate*, not a demo they watch.
- **SDG 16.10** — public access to verified information as a governance outcome.

### Why youth, specifically

Young people are simultaneously **the most exposed cohort to synthetic media and the
most fluent in the channels where it spreads.**

Every existing response treats them as the population to be *protected*.

> **V0ICE treats them as the network that does the protecting.**

That inversion *is* the meaning of *Play Your Part* — and it's encoded directly into the
software. **The first role in the protocol requires no credential at all.**

---

## ▣ 8 · How This Could Fail (And What We Did About It)

We'd rather say these out loud than have them found.

| Risk | Severity | What we did |
|---|---|---|
| **Weaponisation** — coordinated actors flood the queue to bury real strains, or report true information as false | **High** | Analyst confirmation is a **mandatory human gate**. No submission becomes a strain automatically. Phase 1 adds authentication, rate limiting, and an audit trail; Phase 2 adds reputation weighting. |
| **The index gets gamed** — distribution marked without real delivery | **High** | The metric is deliberately self-reported at prototype stage. Phase 2 introduces delivery attestation and spot-audit sampling. **A metric that can't be verified will be treated as an indicator — never a certification.** |
| **Model error at scale** | Medium | The AI *suggests*; a human *confirms*. Every classification shows its confidence score. Analysts override technique, title and summary before anything commits. |
| **The index doesn't predict real resilience** | **High** | This is the explicit falsification test of Phase 2. **Published either way.** |
| **Institutional capture** — a state actor runs a deployment to launder its own narrative | Medium | Open source, federated by design, no central authority. The strain exchange protocol carries provenance so consumers can weight sources. |
| **Volunteer burnout** | Medium | Roles are deliberately small and separable. Nobody carries the whole chain. |

> **One thing we will never claim:** that this platform is a neutral arbiter of truth.
> It is a coordination and measurement layer for **human judgement.**
> The Analyst gate is not a bottleneck we intend to remove — **it is the ethical
> architecture.**

---

## ▣ 9 · What We're Asking For

**Right now, costing nothing:** open
[voice-beta-five.vercel.app](https://voice-beta-five.vercel.app/) and run the loop.
Three minutes. **The argument in this document is either obvious in the product or it
isn't.**

**For the hackathon:** judge us on one claim — that **MIL should be measurable
infrastructure** — and on whether the Herd Immunity Index is a credible first attempt
at that measurement.

**To take it further, we need four things:**

| Need | Why |
|---|---|
| **Three pilot partners** | School networks or youth organisations to run Phase 2 — ideally including one non-Latin-script language community |
| **Methodological review** | Inoculation-theory researchers to critique and co-design the index validation instrument |
| **Regional MIL expertise** | Native speakers to audit the 24 dictionaries and shape culturally-fitted vaccine templates |
| **Modest infrastructure** | It runs on free tiers today; pilots need managed hosting and inference quota |

> **We are not asking for a mandate or an endorsement.
> We are asking for the chance to be tested.**

---

## ▣ 10 · The Last Word

Every generation gets an information technology it isn't yet immune to.

Print gave us a century of religious war before the institutions caught up.
Broadcast gave us propaganda states.

We are early in the synthetic-media era — and the institutional response is currently
**a newspaper column arriving three days late.**

The thing that beat cholera was never better writing about cholera.

> It was **a network of ordinary people who knew what to look for, a system that told
> them what they'd found, and a number that told everyone whether it was working.**

---

<div align="center">

# Misinformation spreads like a virus.
# We built the immune system.

### It's running right now, in 24 languages, and it costs nothing to try.

**[voice-beta-five.vercel.app](https://voice-beta-five.vercel.app/)**

**Source code —
[github.com/beastzex/UNESCO_Youth_Hackathon_Submission_2026](https://github.com/beastzex/UNESCO_Youth_Hackathon_Submission_2026)**

[Documentation](docs/README.md) · [Architecture](docs/02-architecture.md) · [AI Pipeline](docs/04-ai-pipeline.md) · [Repository](https://github.com/beastzex/UNESCO_Youth_Hackathon_Submission_2026)

**© 2026 V0ICE Initiative** · Open Citizen Surveillance Protocol

[![Made for UNESCO](https://img.shields.io/badge/made%20with%20love%20for-UNESCO%20Youth%20Hackathon%202026-EF4444?style=for-the-badge&labelColor=333)](https://voice-beta-five.vercel.app/)

</div>

---

### References

1. Vosoughi, S., Roy, D., & Aral, S. (2018). *The spread of true and false news online.* **Science**, 359(6380), 1146–1151.
2. Roozenbeek, J., van der Linden, S., Goldberg, B., Rathje, S., & Lewandowsky, S. (2022). *Psychological inoculation improves resilience against misinformation on social media.* **Science Advances**, 8(34).
3. Lewandowsky, S., Cook, J., Ecker, U. K. H., et al. (2020). *The Debunking Handbook 2020.*
4. Wood, T., & Porter, E. (2019). *The elusive backfire effect: Mass attitudes' steadfast factual adherence.* **Political Behavior**, 41, 135–163.
5. UNESCO. *Media and Information Literacy Curriculum for Educators and Learners*; *Five Laws of Media and Information Literacy.*
6. World Health Organization. *Infodemic management: a public health approach.*
