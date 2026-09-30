# Unified Master Implementation Plan: Question Normalization, Fullscreen Pearson VUE Mock Exam & Weekly Metrics Automation

> **Document Version:** 3.0.0 · **Date:** 2026-09-30<br>
> **Status:** Consolidated Master Plan for Review<br>
> **Scope:** Merges Question Data Sanitization (Query 1), Fullscreen Pearson VUE Mock Exam Simulator (Query 2), and Autonomous Weekly Metrics & Email Reporting.

---

## 1. Executive Summary & Architecture

This unified plan brings together three core platform evolutions designed to elevate the **Certification Prep** library to enterprise proctored testing standards and establish an automated weekly growth audit:

```
                                  [PLATFORM ENHANCEMENTS]
                                             │
      ┌──────────────────────────────────────┼──────────────────────────────────────┐
      ▼                                      ▼                                      ▼
[MODULE A: Question Normalization]  [MODULE B: Pearson VUE Mock Exam]  [MODULE C: Weekly Metrics Automation]
• Sanitize 385 contaminated prompts • Browser Fullscreen API (⛶)      • Track PDFs, Docs, Pages, Questions
• Strip headers (133 · D4 · [...])  • Hide Domain/Difficulty spoilers  • Persistent data/weekly-ledger.json
• Extract Section/Topic/Scenario    • Flag for Review (⚑) persistent   • Auto-update README.md table
• Clean "Scenario: ... Situation:"  • Review Screen (Incomplete/Flagged)• Email digest (Resend/SMTP)
• Harden upstream extractors        • Post-exam Domain Scorecard D1–D5 • GitHub Actions CI/CD step summary
```

---

## 2. Module A: Question Normalization & Section Separation

### 2.1 The Problem
An audit of [data/questions/cca-f/questions.json](file:///Users/ashishchawla/Documents/My-DIY-Projects/n8-rev-build/neighter/data/questions/cca-f/questions.json) revealed that **385 out of 1,130 questions** have raw upstream parser metadata inadvertently prepended to their `prompt` string:

| Upstream Source | Contaminated Count | Example Leaked String in `prompt` | Root Cause |
|---|:---:|---|---|
| `claude-architect-guide-257` | **246** | `5.5 human-review-calibration / stratified-sampling · **Difficulty:** application · scenario: s6 A legal document...` | Parser incorporated curriculum outline numbering and difficulty annotations directly into prompt text. |
| `situational-scenarios-88` | **88** | `(Scenario: Customer Support Agent) Situation:** The agent resolves only...` | Markdown scenario headings and unescaped asterisks were left unparsed. |
| `cca-prep-170-qu` | **51** | `133 · D4 Prompt Engineering & Structured Output · [intermediate] A team generates...` | Question counter, domain label, and difficulty brackets were concatenated into the question text. |

### 2.2 Sanitization & Extraction Engine (`scripts/clean-question-prompts.mjs`)
The normalization script will parse every question in `data/questions/cca-f/questions.json` and apply targeted regex extractors:

```
[Raw Contaminated Prompt]
   │
   ├─► Pattern 1 (cca-prep-170-qu): `^\s*\d+\s*·\s*D\d+[^·]+·\s*\[(basic|intermediate|advanced)\]\s*`
   │      ├── Extract Domain: `D4 Prompt Engineering & Structured Output` → assign to q.domain
   │      ├── Extract Difficulty: `intermediate` → assign to q.difficulty
   │      └── Strip prefix → Clean prompt begins immediately with natural question text.
   │
   ├─► Pattern 2 (claude-architect-guide-257): `^\s*(\d+\.\d+)\s+([^/]+)/([^\s·]+)\s*·\s*\*\*Difficulty:\*\*\s*([^\s·]+)\s*·\s*scenario:\s*(\w+)\s*`
   │      ├── Extract Section: `5.5 human-review-calibration` → assign to q.section
   │      ├── Extract Topic: `stratified-sampling` → assign to q.topic
   │      ├── Extract Difficulty: `application` → map to `intermediate`
   │      ├── Extract Scenario Tag: `s6` → assign to q.scenarioTag
   │      └── Clean prompt: `Scenario: A legal document extraction pipeline has been running...`
   │
   └─► Pattern 3 (situational-scenarios-88): `^\(Scenario:\s*([^)]+)\)\s*Situation:\*\*\s*`
          └── Format cleanly: `Scenario: Customer Support Agent. Situation: The agent resolves only 55% of issues with a target of 80%...`
```

### 2.3 JSON Data Schema Preservation
To preserve deep pedagogical indexing without polluting the candidate-facing prompt, the question schema in `.agent/schemas/question.schema.json` will formally support:
* `section`: string (e.g. `"5.5 human-review-calibration"`)
* `topic`: string (e.g. `"stratified-sampling"`)
* `scenarioTag`: string (e.g. `"Customer Support Agent"`)
* `prompt`: **Clean, unpolluted question text only**.

### 2.4 Upstream Parser Hardening
Update [.agent/cert-prep-curator/extract-materials.mjs](file:///Users/ashishchawla/Documents/My-DIY-Projects/n8-rev-build/neighter/.agent/cert-prep-curator/extract-materials.mjs) so that subsequent curation runs (`npm run curate` or `sync all`) automatically execute sanitization before admitting new items into the database.

---

## 3. Module B: Pearson VUE Fullscreen Proctored Mock Exam

### 3.1 Overview of Pearson VUE Simulation
In official certification exams (Pearson VUE, OnVUE, AWS, HashiCorp, Anthropic), the interface is engineered to simulate realistic proctored conditions:
1. It runs in **Fullscreen Mode**, eliminating browser tabs, notifications, and website menus.
2. It **never reveals** the domain category or difficulty during the live exam.
3. It provides professional test-taker utilities: **Flag for Review**, **Question Review Matrix**, **Targeted Review Filters**, and **Pre-Submission Confirmation**.

### 3.2 Full Feature Specification for `static/js/mock-test.js`

#### 1. Fullscreen Proctored Mode (Fullscreen API)
- Clicking **"Start Mock Exam"** calls `document.documentElement.requestFullscreen()`, instantly taking over the display.
- Top bar includes a dedicated `⛶ Toggle Fullscreen` button.
- If the candidate exits fullscreen (`Esc`), the timer continues and a non-intrusive banner appears:<br>
  *⚠️ Exam Mode: Fullscreen was minimized. [Click to Return to Fullscreen]*

#### 2. Proctor Status Header (Top Bar)
- **Exam Title:** `Claude Certified Architect — Foundations (CCAF)`
- **Question Counter:** `Question 14 of 60`
- **Answered Counter:** `52 Answered · 8 Unanswered`
- **Digital Timer:** `⏱ 01:45:12` (turns amber at <10 mins, pulsing red at <5 mins, auto-submits at 00:00:00).
- **Flag for Review Action:** Toggleable `⚑ Flag for Review` button with active indicator.

#### 3. Zero Metadata Spoilers
- Strictly remove `<span class="question-domain">` and `<span>[intermediate]</span>` from the active question screen.
- Candidates see only the clean question text and choices (A, B, C, D).

#### 4. Pearson VUE Bottom Navigation
- `◄ Previous`: Steps to previous question (disabled on Question 1).
- `Next ►`: Steps to next question.
- `Review Screen`: Opens the comprehensive question matrix.
- `End Exam`: Triggers the pre-submission confirmation dialog.

#### 5. Pearson VUE Question Review Screen
A dedicated review screen that candidates can open at any time or automatically upon finishing Question 60:
- Displays a 60-question review table:
  - **Question #:** `Question 1` to `Question 60`
  - **Status:** `Answered (Choice B)` or `Unanswered`
  - **Flag:** `⚑ Flagged`
- **3 Targeted Review Actions:**
  - `Review All (60)`: Steps sequentially through all questions.
  - `Review Incomplete (N)`: Steps *only* through unanswered questions (saves critical exam time!).
  - `Review Flagged (M)`: Steps *only* through flagged questions.
  - Clicking any row jumps directly to that question.

#### 6. Pre-Submission Confirmation Dialog
Prevents accidental submission:
> **Submit Exam Confirmation**<br>
> Total Questions: 60<br>
> Questions Answered: 56<br>
> Questions Unanswered: 4 ⚠️<br>
> Questions Flagged for Review: 3 ⚑<br>
>
> *Are you sure you want to end your exam? Once submitted, you cannot change your answers.*<br>
> `[ Return to Exam ]` &nbsp;&nbsp; `[ Confirm & Submit Exam ]`

#### 7. Keyboard Navigation
- `Alt + N` / `ArrowRight`: Next question
- `Alt + P` / `ArrowLeft`: Previous question
- `Alt + F`: Toggle Flag for review
- Keys `A`, `B`, `C`, `D` or `1`, `2`, `3`, `4`: Select option

#### 8. Post-Exam Results Screen (Where Domain Analytics Belong)
Revealed **only after submission**:
- **Official Score Badge:** `52 / 60 (86.7%)` vs 72% Target (`PRACTICE PASS`).
- **Domain Breakdown Table:** Percentage and raw scores across all 5 domains (D1 to D5).
- **Question Review List:** Shows Your Answer, Correct Answer, Rationale, and reveals the Domain Category and Difficulty tag for learning review.

---

## 4. Module C: Automated Weekly Growth & Metrics Reporting System

### 4.1 Tracked Metrics Specification
| Metric | Detection Method | Baseline (2026-W40) |
|---|---|:---:|
| 📄 **PDF Compendiums** | Files matching `static/assets/**/pdfs/*.pdf` | **8 PDFs** |
| 📚 **Curriculum Documents** | Files matching `content/**/*.md` (lessons, notes, guides) | **114 documents** |
| 🌐 **Rendered Web Pages** | Files matching `public/**/*.html` | **128 pages** |
| ❓ **Verified Questions** | Sum of questions in `data/questions/*/questions.json` | **1,130 questions**<br>*(CCA-F: 1,130 · TA-004: 0)* |

### 4.2 Historical Ledger Schema (`data/weekly-ledger.json`)
Maintains a versioned JSON array of weekly snapshots:
```json
{
  "version": "1.0.0",
  "history": [
    {
      "week_id": "2026-W39",
      "date": "2026-09-23T00:00:00Z",
      "commit_sha": "154aaad",
      "metrics": {
        "pdfs": 8,
        "documents": 100,
        "rendered_pages": 116,
        "questions_total": 1130,
        "questions_by_exam": { "cca-f": 1130, "terraform-associate": 0 },
        "sources_synced": 16
      }
    },
    {
      "week_id": "2026-W40",
      "date": "2026-09-30T11:04:26Z",
      "commit_sha": "5645010",
      "metrics": {
        "pdfs": 8,
        "documents": 114,
        "rendered_pages": 128,
        "questions_total": 1130,
        "questions_by_exam": { "cca-f": 1130, "terraform-associate": 0 },
        "sources_synced": 23
      },
      "delta": {
        "pdfs": 0,
        "documents": 14,
        "rendered_pages": 12,
        "questions_total": 0,
        "highlights": [
          "Cataloged HashiCorp Certified: Terraform Associate 004 in master source registry",
          "Cached 23 official HashiCorp 004 documentation and sample question endpoints",
          "Generated subpath-aligned certification landing pages and catalog views"
        ]
      }
    }
  ]
}
```

### 4.3 Self-Updating `README.md`
The reporter script updates the metrics table in [README.md](file:///Users/ashishchawla/Documents/My-DIY-Projects/n8-rev-build/neighter/README.md) using safe regex substitution between sentinels:

```markdown
<!-- WEEKLY-METRICS:START -->
### 📈 Weekly Platform Pulse (Week 40 · 2026)

| Tracked Metric | Last Week (W39) | This Week (W40) | Net Growth | Status |
|---|---:|---:|---:|:---:|
| 📄 **Official PDFs & Guides** | 8 | 8 | — | ✅ Synchronized |
| 📚 **Lessons & Study Docs** | 100 | 114 | **+14** | 🚀 Active |
| 🌐 **Rendered Web Pages** | 116 | 128 | **+12** | 🚀 Expanded |
| ❓ **Active Practice Questions** | 1,130 | 1,130 | — | 🛡️ Verified |

> *Last Automated Sync:* `2026-09-30 11:04 UTC` · *Commit:* [`5645010`](https://github.com/imashishchawla/ai-certification-preparation/commit/5645010)
<!-- WEEKLY-METRICS:END -->
```

### 4.4 Email Digest & GitHub Actions Dispatch
- **Engine (`scripts/generate-weekly-report.mjs`):** Generates both HTML and text email bodies.
- **Dispatch Channels:**
  - **Primary:** Resend REST API (via secret `RESEND_API_KEY` + variable `NOTIFICATION_EMAIL`).
  - **Fallback:** GitHub Action SMTP (`dawidd6/action-send-mail`).
  - **Fail-Open:** Missing email credentials log a notice, update `README.md`, write to `$GITHUB_STEP_SUMMARY`, and exit cleanly without failing the build.

---

## 5. Execution Roadmap

```
Phase 1: Question Prompt Sanitization
  ├── Create scripts/clean-question-prompts.mjs
  ├── Run batch cleanup across all 1,130 questions in data/questions/cca-f/questions.json
  ├── Validate with npm run validate
  └── Update .agent/cert-prep-curator/extract-materials.mjs

Phase 2: Pearson VUE Mock Exam Simulator
  ├── Overhaul static/js/mock-test.js:
  │     ├── Fullscreen API integration (requestFullscreen, exit banner, toggle button)
  │     ├── Remove domain/difficulty headers from active question card
  │     ├── Implement Flag for Review (⚑) persistent state
  │     ├── Build Pearson VUE Review Screen (Review All / Incomplete / Flagged)
  │     ├── Build Pre-Submission Confirmation Dialog
  │     └── Implement keyboard shortcuts (Alt+N, Alt+P, Alt+F, A-D)
  └── Update theme CSS for proctored top/bottom bars and review table

Phase 3: Weekly Metrics & Reporting Engine
  ├── Create data/weekly-ledger.json with baseline W39 and W40 records
  ├── Create scripts/generate-weekly-report.mjs
  ├── Inject sentinel markers into README.md
  └── Test local execution via npm run report:weekly

Phase 4: CI/CD Pipeline Integration
  ├── Update .github/workflows/curate-certifications.yml:
  │     ├── Run scripts/clean-question-prompts.mjs
  │     ├── Run scripts/generate-weekly-report.mjs
  │     ├── Include README.md and data/weekly-ledger.json in automated commit
  │     └── Add email dispatch step
  └── Add npm script shortcuts in package.json

Phase 5: End-to-End Build & Validation
  ├── Run node scripts/build-browser-artifacts.mjs
  ├── Run npm run build (audit rendered pages, SEO spider, zero external link check)
  └── Verify fullscreen mock test and cleaned questions in browser
```

---

## 6. Acceptance & Verification Criteria

1. **Question Prompt Sanitization:**
   - Zero questions in `data/questions/cca-f/questions.json` match `^\d+\s*·`, `·\s*\[(basic|intermediate|advanced)\]`, or `\*\*Difficulty:\*\*`.
   - `npm run validate` passes with 100% valid question schema.
2. **Pearson VUE Mock Exam Simulator:**
   - "Start Mock Exam" expands into Fullscreen mode.
   - Zero domain category or difficulty tags shown during live test.
   - Review Screen shows all 60 questions and filters by Incomplete and Flagged.
   - Pre-submission modal warns of unanswered questions.
   - Domain Breakdown (D1–D5) and rationales appear accurately on Results Screen.
3. **Weekly Growth Automation:**
   - `data/weekly-ledger.json` accurately reflects deltas.
   - `README.md` self-updates between sentinels.
   - Email dispatch executes or fails open safely.
   - `npm run build` generates 100% valid static site with 0 errors.
