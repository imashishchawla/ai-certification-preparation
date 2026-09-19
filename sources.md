# Sources — Claude Certified Architect (Foundations) Exam Pack

> **Compiled:** 2026-09-19 · **Exam:** Claude Certified Architect — Foundations (`CCAR-F` / `CCA-F`)
> **Method:** HTTPS sources only. Every URL below was fetched and its HTTP status recorded on the date above.
> **Local root:** `ccaf-exam/` — see [`README.md`](README.md) for the full inventory.

Legend: ✅ downloaded · 📚 rendered to markdown · 🔒 account/paywall/login-gated · 🚫 blocked (451/403) · 🗄️ recovered from Wayback Machine

---

## 1. Official Anthropic sources

| Source | Status | What we saved |
|---|---|---|
| `https://everpath-course-content.s3-accelerate.amazonaws.com/.../Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf` | ✅ 200 (583 KB) | `pdfs/official-exam-guide-nehasharma.pdf` + `pdfs/official-exam-guide-39page-webb.archive.pdf` — the **official 40-page v1.0 exam guide** (originally 403; recovered via Wayback, now direct-200) |
| `https://everpath-course-content.s3-accelerate.amazonaws.com/.../Claude+Certified+Architect+–+Professional+Exam+Guide.pdf` | ✅ 200 (358 KB) | `pdfs/official-exam-guide-ccar-professional.pdf` — the sibling **CCAR-P v1.0 guide** (11 pp, bonus) |
| `https://anthropic-partners.skilljar.com/page/partner-certifications` | ✅ 200 (1.3 MB) | exam programme + registration facts (content login-gated) |
| `https://anthropic-partners.skilljar.com/page/faq-certifications` | ✅ 200 (1.4 MB) | certification FAQ |
| `https://claude.com/blog/four-role-based-claude-certifications` | ✅ 200 | Anthropic's official announcement of all four certs (July 2026) |
| `https://www.anthropic.com/engineering/building-effective-agents` | ✅ 200 / 📚 | `study-guides/official-docs/anthropic-com-engineering-building-effective-agents.md` |
| `https://www.anthropic.com/engineering/claude-code-best-practices` | ✅ 200 / 📚 | `study-guides/official-docs/anthropic-com-engineering-claude-code-best-practices.md` |

### Official documentation (scraped to markdown → `study-guides/official-docs/`)
All fetched 200; `.md` endpoints used where available (Mintlify), else rendered.

- `code.claude.com/docs/en/` — `memory`, `skills`, `hooks`, `cli-reference`, `mcp`, `tools`, `github-actions`, `settings`, `permissions`, `agent-sdk/sessions`
- `platform.claude.com/docs/en/` (via `docs.anthropic.com/en/*.md`) — `agent-sdk/overview`, `agent-sdk/hooks`, `agents-and-tools/tool-use/overview`, `build-with-claude/tool-use`, `build-with-claude/prompt-engineering/claude-prompting-best-practices`, `build-with-claude/batch-processing`, `api/messages`
- `modelcontextprotocol.io/` — `docs/concepts/tools`, `docs/concepts/resources`, `specification`
- Documentation indexes: `code.claude.com/docs/llms.txt`, `docs.anthropic.com/llms.txt`, `modelcontextprotocol.io/llms.txt` (saved as `INDEX-*.txt`)

---

## 2. Community study & practice sites

| Source | Status | What we saved |
|---|---|---|
| **claudecertificationguide.com** — free, fully-open CCAR-F track by "Walter" | ✅ 200 | 📚 `study-guides/claudecertificationguide/` (30 lessons, 5 quick-refs, 5 glossaries, 10 scenarios, mock/drill/diagnostic pages) + **`practice-questions/claudecertificationguide-257-question-bank.md`** (257 Qs, per-option explanations, answer key, rationale, difficulty, task-statement mapping) |
| **github.com/dnacenta/claude-certified-architect** (+ GitHub Pages) | ✅ 200 | `study-guides/dnacenta-claude-certified-architect/` (main guide + 5 domain deep-dives + 3 other-cert guides) + `pdfs/dnacenta-guide_en.pdf` (83 pp) |
| **claudecertifiedarchitects.com** | ✅ 200 | **`practice-questions/claudecertifiedarchitects-400-question-bank.md`** — full 400-Q bank extracted from the public client bundle `app.js` (site normally gates it behind an account) |
| **claudecertprep.com** | ✅ 200 | `practice-questions/cca-prep-*` (170-Q bank, 17 anti-patterns, 45 flashcards, cheat sheet) — already in pack |
| **spectrumailab.com/blog/claude-certification-exams-2026** | ✅ 200 | `study-guides/articles/spectrumailab-all-4-exams-explained-2026.md` (official facts, verified July 2026) |
| **claudearchitectguide.com/certifications** | ✅ 200 | `study-guides/articles/claudearchitectguide-certifications-and-cost.md` |
| **claudearchitectcertification.com/exam-guide** | ✅ 200 | `pdfs/cca-f-exam-guide-claudearchitectcert.pdf`, `pdfs/claude-certifications-companion.pdf`, `practice-questions/claudearchitectcertification-20-antipatterns.md` |
| **claude.ajithkumarr.com/claude-certification-guide** | ✅ 200 | independent four-cert guide (free; practice section free) — *not mirrored* |
| **claudepractice.com** | ✅ 200 | four-cert marketing/blueprint site; questions behind "Start free" account — *not mirrored* |
| **ccafoundations.com** | ✅ 200 (paid £49) | InfoSecAI 9-part manual + 250-Q test engine — **paywalled**, not mirrored |

---

## 3. Account / paywall / legally blocked (documented, not downloaded)

| Source | Status | Note |
|---|---|---|
| **claudecertified.io** | 🔒 login | Claims **1,374 practice questions** + full mock + domain study guides; questions load only after sign-in (runtime API). Page shells saved only. |
| **claude.termidy.com** (ClaudePrep) | 🔒 login | Moodle LMS; **1,068 questions** across 4 certs (360 for CCAR-F) behind course login. Home saved: `study-guides/articles/termidy-claudeprep-home.md` |
| **claudecertifications.com/** | 🚫 451 | Cloudflare "Unavailable For Legal Reasons" (error 451). Free 12-week plan + 25 Qs inaccessible from this network. |
| **claudetestprep.com** | 🔒 gated | 609-question bank (signup) |
| **ccafoundations.com** | 💰 £49 | Paid manual/test engine |
| **anthropic-partners.skilljar.com** (Anthropic Academy courses) | 🔒 login | Free courses, account required; certificates ≠ proctored cert |
| **git-scm.com/docs/git-worktree** | ✅ 200 | Cited by question banks; generic reference, not mirrored |

---

## 4. Recovered / special

- **Wayback Machine** — `https://web.archive.org/web/20260314145708if_/<official Foundations PDF>` → recovered the official guide when the live URL returned **403**. Snapshot digest `BKBDI7C3QIOR3SVBW6HZVUBEWNUYWIGQ`.
- **Public JS bundle mining** — the claudecertifiedarchitects 400-question bank was not an API call; it ships inside `app.js` and was parsed with a JS-literal scanner. See `practice-questions/claudecertifiedarchitects-400-question-bank.md`.
- **Next.js RSC payload mining** — the claudecertificationguide 257-question bank + 10 scenarios ride along in the server-rendered payload of `/mock-exam/start`; extracted from `self.__next_f.push(...)` flight data.

## 5. Aggregate question count in this pack

| Bank | Questions | Answer key | Per-option explanations |
|---|---|---|---|
| claudecertificationguide.com | 257 | ✅ | ✅ |
| claudecertifiedarchitects.com | 400 | ✅ | ✅ (single explanation) |
| amey-thakur (community) | 320 | ✅ | ✅ |
| cca-prep (claudecertprep.com) | 170 | ✅ | ✅ |
| paullarionov guide | 88 | ✅ | — |
| amey-thakur mocks (3) | ~60 | ✅ | ✅ |
| **Total** | **~1,295+** | | |

> Fees/facts cross-checked against the official v1.0 guides (July 2026): 60 items · 120 min · pass 720/1000 · 5 domains (27/18/20/20/15) · 4 scenarios from a bank of 6 · $125 · valid 12 months · Pearson VUE proctored.
