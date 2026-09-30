# Implementation Plan: Question Normalization & Pearson VUE-Style Fullscreen Mock Exam

> **Document Version:** 2.0.0 · **Date:** 2026-09-30<br>
> **Status:** Proposal & Plan for Review<br>
> **Targets:**
> 1. Question Prompt Sanitization & Section/Metadata Separation across `data/questions/cca-f/` (Query 1)
> 2. Fullscreen Pearson VUE Proctored Mock Exam Experience & Full Feature Suite (Query 2)

---

## 1. Problem Analysis & Current State

### Query 1: Metadata Leaked into Question Prompts
Analysis of [data/questions/cca-f/questions.json](file:///Users/ashishchawla/Documents/My-DIY-Projects/n8-rev-build/neighter/data/questions/cca-f/questions.json) reveals that **385 out of 1,130 questions** have raw upstream parser metadata inadvertently prepended to their `prompt` string:

| Upstream Source | Contaminated Count | Pattern in `prompt` | Root Cause |
|---|:---:|---|---|
| `claude-architect-guide-257` | **246** | `5.5 human-review-calibration / stratified-sampling · **Difficulty:** application · scenario: s6 A legal document...` | Parser took raw lesson outline and scenario tags as part of the question prompt. |
| `situational-scenarios-88` | **88** | `(Scenario: Customer Support Agent) Situation:** The agent resolves only...` | Markdown scenario header syntax was unparsed. |
| `cca-prep-170-qu` | **51** | `133 · D4 Prompt Engineering & Structured Output · [intermediate] A team generates...` | Upstream question number, domain name, and difficulty bracket were concatenated into the question text. |

### Query 2: Non-Standard Timed Mock Exam Presentation
In [static/js/mock-test.js](file:///Users/ashishchawla/Documents/My-DIY-Projects/n8-rev-build/neighter/static/js/mock-test.js#L212-L216):
During the live, active timed examination, the question card renders:
```html
<div class="question-header">
  <span class="question-domain">D1 Agentic Architecture & Orchestration</span>
  <span>[intermediate]</span>
</div>
```
#### Why This Fails Real Exam Standards:
1. **Unrealistic Exam Experience:** Official Pearson VUE, OnVUE, AWS, HashiCorp, and Anthropic certification exams **never** display the domain or difficulty to candidates during an active timed test. Doing so introduces cognitive bias and gives away hints about what specific topic is being evaluated.
2. **Double Header Display:** When combined with Query 1's contaminated prompts, candidates see the domain and difficulty twice (once above the card, once inside the question prompt).
3. **Missing Critical Proctor Features:** Real exams feature **Fullscreen Proctored Mode**, a **Flag for Review** button, a **Question Review Matrix**, **Review Incomplete / Review Flagged** filters, and an **Unanswered Warning Modal**.

---

## 2. Proposed Architecture & Solutions

### Solution 1: Clean Question Prompts & Separate Metadata

We will implement an automated sanitization and extraction engine (`scripts/clean-question-prompts.mjs`) that processes all questions in [data/questions/cca-f/questions.json](file:///Users/ashishchawla/Documents/My-DIY-Projects/n8-rev-build/neighter/data/questions/cca-f/questions.json):

```
[Raw Contaminated Prompt]
   │
   ├─► Pattern A: `133 · D4 Prompt Engineering... · [intermediate] A team generates...`
   │      ├── Extract Question ID index: 133
   │      ├── Extract Domain: `D4 Prompt Engineering & Structured Output`
   │      ├── Extract Difficulty: `intermediate`
   │      └── Clean Prompt: `A team generates code with Claude and then uses the same Claude session...`
   │
   ├─► Pattern B: `5.5 human-review-calibration / stratified-sampling · **Difficulty:** application · scenario: s6 A legal...`
   │      ├── Extract Section/Topic: `5.5 human-review-calibration / stratified-sampling`
   │      ├── Extract Difficulty: `application` → map to `intermediate`
   │      ├── Extract Scenario ID: `s6`
   │      └── Clean Prompt: `Scenario: A legal document extraction pipeline has been running for three months...`
   │
   └─► Pattern C: `(Scenario: Customer Support Agent) Situation:** The agent resolves...`
          └── Clean Prompt: `Scenario: Customer Support Agent. Situation: The agent resolves only 55% of issues...`
```

#### Structured Question Schema Preservation:
To preserve the section and topic taxonomy without polluting the prompt, we add structured metadata fields:
* `section`: e.g. `"5.5 human-review-calibration"`
* `topic`: e.g. `"stratified-sampling"`
* `scenarioTag`: e.g. `"s6"` or `"Customer Support Agent"`
* `prompt`: **100% clean, natural question text only**.

---

### Solution 2: Fullscreen Pearson VUE Proctored Mock Exam

We will transform [static/js/mock-test.js](file:///Users/ashishchawla/Documents/My-DIY-Projects/n8-rev-build/neighter/static/js/mock-test.js) and its styling into a true **Pearson VUE / OnVUE** simulation.

#### 1. Fullscreen Proctored Environment (Fullscreen API)
* **Automatic Fullscreen:** Clicking **"Start Mock Exam"** triggers `document.documentElement.requestFullscreen()`, expanding the simulator to fill the entire monitor and hiding browser distractions and standard website navigation.
* **Fullscreen Control:** Top-right `⛶ Toggle Fullscreen` button allows candidates to toggle fullscreen at will.
* **Exit Warning:** If the candidate exits fullscreen during an active exam (pressing `Esc`), a top warning banner appears:<br>
  *⚠️ Exam Mode: Fullscreen was minimized. [Click to Return to Fullscreen]*

#### 2. Pearson VUE Proctor Status Header (Top Bar)
* **Left:** Exam Code & Title: `Claude Certified Architect — Foundations (CCAF)`
* **Center:**
  - `Question 14 of 60`
  - Answered / Unanswered Counter: `52 Answered · 8 Unanswered`
* **Right:**
  - **Timer:** High-visibility digital countdown `⏱ 01:45:12` (turns amber at <10 mins, pulsing red at <5 mins).
  - **Flag for Review Button (`⚑ Flag for Review`):** Toggleable state that highlights the question on the navigator and review screen.

#### 3. Zero Metadata Spoilers During the Exam
* **No Category / Domain Badge:** Domain `D1 Agentic Architecture & Orchestration` is strictly hidden during the live test.
* **No Difficulty Tag:** `[intermediate]` is strictly hidden during the live test.
* Candidates see only the clean question prompt and answer choices.

#### 4. Pearson VUE Navigation & Bottom Action Bar
* `◄ Previous`: Navigates to preceding question (disabled on Q1).
* `Next ►`: Navigates to subsequent question.
* `Review Screen`: Opens the comprehensive Pearson VUE Review Screen.
* `End Exam`: Opens the pre-submission confirmation dialog.

#### 5. Pearson VUE Question Review Screen (Hallmark Feature)
A dedicated review screen that candidates can open at any time or automatically upon finishing Question 60:
* Displays a 60-question review table:
  - **Question Number:** `Question 1` to `Question 60`
  - **Status:** `Answered` (with selected letter `B`) or `Unanswered`
  - **Flagged Status:** `⚑ Flagged` icon
* **Three Dedicated Review Modes:**
  1. **Review All:** Steps sequentially through all 60 questions.
  2. **Review Incomplete (Unanswered):** Cycles *only* through unanswered questions, saving critical exam time!
  3. **Review Flagged:** Cycles *only* through flagged questions for double-checking!
  4. Direct Jump: Clicking any question row jumps directly into that question.

#### 6. Pre-Submission Confirmation Modal
When clicking "End Exam" or finishing review:
* An official confirmation dialog appears:
  > **Submit Exam Confirmation**<br>
  > Total Questions: 60<br>
  > Questions Answered: 56<br>
  > Questions Unanswered: 4 ⚠️<br>
  > Questions Flagged for Review: 3 ⚑<br>
  >
  > *Are you sure you want to end your exam? Once submitted, you cannot change your answers.*<br>
  > `[ Return to Exam ]` &nbsp;&nbsp; `[ Confirm & Submit Exam ]`

#### 7. Keyboard Shortcuts (Real Exam Speed & Accessibility)
* `Alt + N` / `ArrowRight`: Next question
* `Alt + P` / `ArrowLeft`: Previous question
* `Alt + F`: Toggle Flag for review
* Keys `A`, `B`, `C`, `D` or `1`, `2`, `3`, `4`: Select option

#### 8. Post-Exam Results Screen (Where Categories & Analytics Belong)
Only **after** submission is the full diagnostic scorecard presented:
* **Official Pass/Fail Badge:** Score percentage vs 72% pass threshold.
* **Domain Breakdown Table:** Performance breakdown across each domain (D1 to D5 percentages and raw counts).
* **Question Review List:** Shows Your Answer, Correct Answer, Full Rationale, and reveals the Domain Category and Difficulty tag for learning.

---

## 3. Practice Mode vs Mock Test Comparison

| Feature | Practice Mode (`question-reveal.js`) | Pearson VUE Mock Test (`mock-test.js`) |
|---|:---:|:---:|
| **Display Mode** | Standard Page View | **Fullscreen Proctored View (`⛶`)** |
| **Domain Category Header** | Visible (for topical study) | **Hidden (Zero Spoilers)** |
| **Difficulty Tags** | Visible (for filtering) | **Hidden (Zero Spoilers)** |
| **Instant Answer Reveal** | Yes (Reveal Button) | **No (All hidden until submission)** |
| **Timer** | None | **120-minute countdown with alert thresholds** |
| **Flag for Review** | No | **Yes (`⚑` toggle)** |
| **Review Matrix** | Pagination | **Pearson VUE Review Screen (All / Incomplete / Flagged)** |
| **Question Balancing** | All questions | **Domain-weighted 60-question official quota** |
| **Results & Domain Scorecard** | None | **Comprehensive Pass/Fail & D1–D5 breakdown** |

---

## 4. Implementation Plan & Steps

1. **Step 1: Question Data Sanitization (`scripts/clean-question-prompts.mjs`)**
   - Clean all 385 contaminated prompts in `data/questions/cca-f/questions.json`.
   - Separate section/topic/scenario metadata into structured fields.
   - Run schema validation via `npm run validate`.
2. **Step 2: Upstream Extractor Update (`.agent/cert-prep-curator/extract-materials.mjs`)**
   - Apply clean regex sanitization in extraction adapters to prevent regression.
3. **Step 3: Fullscreen Mock Test Overhaul (`static/js/mock-test.js` & CSS)**
   - Add Fullscreen API integration with fallback & resume banner.
   - Remove category and difficulty from active test view.
   - Build Pearson VUE Review Screen with "Review Incomplete" and "Review Flagged".
   - Build Pre-submission confirmation modal.
   - Add keyboard navigation support (`Alt+N`, `Alt+P`, `Alt+F`, `A-D`).
4. **Step 4: Build & Live Testing**
   - Run `node scripts/build-browser-artifacts.mjs` to refresh `public/` shards.
   - Run `npm run build` to verify 100% build integrity.
