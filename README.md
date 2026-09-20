# Claude Certified Architect - Foundations (CCA-F / CCAR-F) Exam Prep

Prepared for the **Claude Certified Architect - Foundations** exam (60 questions, 120 min, 720/1000 passing, 5 domains).

**Domain weights:**  
· D1 Agentic Architecture & Orchestration 27%  
· D2 Tool Design & MCP 18%  
· D3 Claude Code Config & Workflows 20%  
· D4 Prompt Engineering & Structured Output 20%  
· D5 Context Management & Reliability 15%

> Full provenance for every URL checked is in the non-published planning file **[`plan/sources.md`](plan/sources.md)**.

---

## Quick start (1 week)

1. Read the official exam guide: `pdfs/official-exam-guide-nehasharma.pdf` + `pdfs/exam-guide-amey-thakur.pdf`
2. Read the full theory study guide: `study-guides/paullarionov-guide_en.md` (3400 lines)
3. Do 40-50 questions/day from `practice-questions/cca-prep-170-question-bank.md` (worked answers included)
4. Work through the two big banks: `claudecertificationguide-257-question-bank.md` and `claudecertifiedarchitects-400-question-bank.md`
5. Review the anti-patterns: `practice-questions/claudearchitectcertification-20-antipatterns.md`
6. Time yourself on `practice-questions/amey-thakur-mock-exam-*.md` (3 timed mocks)
7. Drill with `practice-questions/cca-prep-flashcards.md` + Anki deck

---

## PDFs (`pdfs/`)

| File | What it is |
| --- | --- |
| `official-exam-guide-nehasharma.pdf` | Anthropic's **official 40-page v1.0 EXAM GUIDE** (format, domains, task statements, sample Qs) |
| `official-exam-guide-39page-webb.archive.pdf` | Same official guide recovered from the Wayback Machine (identical, kept as a backup) |
| `official-exam-guide-ccar-professional.pdf` | **Official CCAR-P v1.0 guide** (11 pp) — bonus |
| `exam-guide-amey-thakur.pdf` | Official v1.0 exam-guide printout (39 pp): $125 fee, validity, task statements |
| `dnacenta-guide_en.pdf` | dnacenta community study guide (83 pp) |
| `cca-f-exam-guide-claudearchitectcert.pdf` | 12-page CCA-F guide: concept checklist, two-week plan, test-day checklist |
| `guide_en-github.pdf` | Paullarionov community study guide PDF (full guide also in md) |
| `claude-certifications-companion.pdf` | Printable companion covering all four Claude certs (2.1 MB) |

## Practice questions & mocks (`practice-questions/`)

| File | Content |
| --- | --- |
| `claudecertificationguide-257-question-bank.md` | **257 questions** (all 5 domains) with answer key, rationale, per-option explanations, difficulty + task-statement mapping |
| `claudecertifiedarchitects-400-question-bank.md` | **400 questions** (all 5 domains) with answer key + explanation, extracted from the site's public JS bundle |
| `cca-prep-170-question-bank.md` | 170 scenario questions (all 5 domains, 4 difficulty tiers), every answer explained with why-the-others-are-wrong + doc links |
| `amey-thakur-arch-foundations-80q.md` | 80 architect questions with rationale (from the 320-Q JSON bank) |
| `paullarionov-guide-questions.md` | 88 situation-based questions grouped by exam scenario |
| `amey-thakur-practice-questions.md` | 35 original practice questions in the six published scenarios |
| `amey-thakur-mock-exam-1.md` / `-2.md` / `-3.md` | 3 timed mock exams (15 Q / 30 min each, answer keys) |
| `claudecertifiedarchitects-5-sample-questions.md` | 5 worked sample questions + 7-day / 14-day study plans |
| `claudearchitectcertification-20-antipatterns.md` | 20 canonical wrong-answer patterns (critical/common/edge) |
| `cca-prep-antipatterns.md` | 17 anti-patterns with exam tips |
| `cca-prep-flashcards.md` | 45 flip cards |
| `flashcards.md` | 110 flashcards (Amey-Thakur, all 4 certs) |
| `paullarionov-anki-practical-test.apkg` | Anki deck - import directly into Anki |
| `amey-thakur-question-bank.json` | Raw 320-question JSON bank |
| `cca-prep-*.ts` | Original TypeScript data files (questions, anti-patterns, flashcards) |

## Study guides (`study-guides/`)

| File / folder | Content |
| --- | --- |
| `paullarionov-guide_en.md` | **Full 3400-line theory guide**: API, tools/tool_use, Agent SDK loops, hub-and-spoke, hooks, MCP, Claude Code, sessions + exercises |
| `claudecertificationguide/` | **Complete free CCAR-F course**: 30 lessons, 5 quick-refs, 5 glossaries, 10 scenarios, mock/drill/diagnostic pages |
| `dnacenta-claude-certified-architect/` | Community guide + 5 domain deep-dives + guides for the other 3 certs |
| `official-docs/` | **23 official Anthropic docs** scraped to markdown (Claude Code, Agent SDK, tool use, MCP, prompting) + 3 `INDEX-*.txt` doc indexes |
| `articles/` | Independent 2026 explainers: Spectrum AI Labs (all 4 exams), Claude Architect Guide (costs), Termidy (ClaudePrep) |
| `cca-prep-docs/` | 20 per-topic deep-dives across all 5 domains |
| `cca-prep-exam-scenarios.md` | The six published exam scenarios |
| `cca-prep-cheatsheet.md` | 29-entry printable cheat sheet with code examples |
| `amey-thakur-*.md` | Domain task statements, one-page cheat sheet, maintainer's notes |

---

## Question-bank totals

| Bank | Questions |
| --- | --- |
| claudecertificationguide.com | 257 |
| claudecertifiedarchitects.com | 400 |
| Amey-Thakur (JSON) | 320 |
| cca-prep (claudecertprep.com) | 170 |
| Paullarionov | 88 |
| Amey-Thakur mocks (3) | ~60 |
| **Total** | **~1,295** |

---

## Sources at a glance (see `plan/sources.md` for the full table)

- **Official:** Anthropic exam guides (Foundations + Professional), Anthropic blog, engineering docs, Anthropic Academy/Skilljar, 23 official docs pages.
- **Community/free:** claudecertificationguide.com, github.com/dnacenta, claudecertifiedarchitects.com, claudecertprep.com, spectrumailab.com, claudearchitectguide.com, claudearchitectcertification.com, claude.ajithkumarr.com, claudepractice.com.
- **Account/paywall-gated (not mirrored):** claudecertified.io (1,374 Qs), claude.termidy.com (Moodle, 1,068 Qs), claudetestprep.com (609 Qs), ccafoundations.com (£49).
- **Blocked:** claudecertifications.com returns HTTP 451 (legal).

## Need more practice while offline?

Ask me to quiz you — I can generate fresh scenario questions per domain from the material above, or build a randomized timed mock exam from the 1,295-question pool (answers hidden until you submit).
