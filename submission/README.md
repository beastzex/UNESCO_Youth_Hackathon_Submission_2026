# Submission Files

**UNESCO Youth Hackathon 2026** — required deliverable: *one project proposal in PDF or
Microsoft Word format, maximum 10 MB.*

| File | Format | Size | Pages |
|---|---|---|---|
| **[V0ICE_Proposal_UNESCO_Youth_Hackathon_2026.pdf](V0ICE_Proposal_UNESCO_Youth_Hackathon_2026.pdf)** | PDF 1.4 | 389 KB | 11 |
| **[V0ICE_Proposal_UNESCO_Youth_Hackathon_2026.docx](V0ICE_Proposal_UNESCO_Youth_Hackathon_2026.docx)** | Word (Office Open XML) | 49 KB | 9 |

**Upload the PDF** unless the portal specifically requires Word. Both carry identical
content; the PDF preserves the full cover design and colour system.

Both files are **far** under the 10 MB ceiling — 389 KB and 49 KB respectively.

The repository link appears in three places in the PDF: on the cover under the live link,
in the closing card, and in the **Repository & Live Platform** block on the final page —
all three clickable.

---

## What's inside

| | Section |
|---|---|
| — | The One-Sentence Version |
| — | The Uncomfortable Truth |
| 1 | Truth Is Losing a Race It Never Agreed to Run |
| 2 | Stop Writing Articles. Start Running an Immune System. |
| 3 | This Is Not a Pitch Deck. It Is Deployed. |
| 4 | Why Nothing Else Does This |
| 5 | The Math of Going Wide |
| 6 | The Road From Here |
| 7 | Built on UNESCO's Own Blueprint |
| 8 | How This Could Fail (And What We Did About It) |
| 9 | What We Are Asking For |
| 10 | The Last Word |
| — | References |

---

## Regenerating

The Markdown source of record is **[`../PROPOSAL.md`](../PROPOSAL.md)**.

The PDF was rendered from a styled print-source HTML (`proposal-print-source.html`) with
headless Chrome. That intermediate file is no longer kept in the repository, so a full
rebuild means restyling from `../PROPOSAL.md` and re-rendering:

```bash
chrome --headless=new --no-pdf-header-footer \
  --print-to-pdf="V0ICE_Proposal_UNESCO_Youth_Hackathon_2026.pdf" \
  proposal-print-source.html
```

The Word file is generated natively with `python-docx` — it is a real Word document with
live styles and tables, not an HTML import, so a judge can edit it directly.

---

**Source code —** [github.com/beastzex/UNESCO_Youth_Hackathon_Submission_2026](https://github.com/beastzex/UNESCO_Youth_Hackathon_Submission_2026)
**Live platform —** [voice-beta-five.vercel.app](https://voice-beta-five.vercel.app/)
**Documentation —** [`../docs/`](../docs/README.md)
