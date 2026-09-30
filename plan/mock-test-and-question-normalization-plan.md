# Implementation Plan: Question Normalization & Timed Mock Exam Overhaul

> **Document Version:** 1.0.0 · **Date:** 2026-09-30
> **Status:** Proposal & Plan for Review
> **Targets:**
> 1. Question Prompt Sanitization & Section/Metadata Separation across `data/questions/cca-f/`
> 2. Real-Exam Simulation Overhaul for Timed Mock Test (`static/js/mock-test.js` & layouts)

---

## 1. Problem Analysis & Current State

### Query 1 Findings: Metadata Pollution in Question Prompts
Analysis of [data/questions/cca-f/questions.json](file:///Users/ashishchawla/Documents/My-DIY-Projects/n8-rev-build/neighter/data/questions/cca-f/questions.json) reveals that **385 out of 1,130 questions** have raw upstream metadata inadvertently prepended to their `prompt` string:

| Upstream Source | Contaminated Count | Pattern in `prompt` | Root Cause |
|---|:---:|---|---|
| `claude-architect-guide-257` | **246** | `5.5 human-review-calibration / stratified-sampling · **Difficulty:** application · scenario: s6 A legal document...` | Parser took raw lesson outline and scenario tags as part of the question prompt. |
| `situational-scenarios-88` | **88** | `(Scenario: Customer Support Agent) Situation:** The agent resolves only...` | Markdown scenario header syntax was unparsed. |
| `cca-prep-170-qu` | **51** | `133 · D4 Prompt Engineering & Structured Output · [intermediate] A team generates...` | Upstream question number, domain name, and difficulty bracket were concatenated into the question text. |

### Query 2 Findings: Non-Standard Timed Mock Exam Presentation
In [static/js/mock-test.js](file:///Users/ashishchawla/Documents/My-DIY-Projects/n8-rev-build/neighter/static/js/mock-test.js#L212-L216):
During the live, active timed examination, the question card renders:
```html
<div class="question-header">
  <span class="question-domain">D1 Agentic Architecture & Orchestration</span>
  <span>[intermediate]</span>
</div>
```
#### Why This Is A Problem:
1. **Unrealistic Exam Experience:** Official Pearson VUE, Anthropic, AWS, and HashiCorp certification exams **never** display the domain or difficulty to candidates during an active timed test. Doing so introduces cognitive bias and gives away hints about what specific topic is being evaluated.
2. **Double Header Display:** When combined with Query 1's contaminated prompts, candidates see the domain and difficulty twice (once above the card, once inside the question prompt).
3. **Missing Standard Proctor Features:** Real exams feature a **Flag for Review** button, a **Question Navigator Grid (1–60)**, and clear answered/unanswered tracking.

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

#### New Question Object Schema Additions:
To preserve the section and topic taxonomy without polluting the prompt, we add optional structured metadata fields:
* `section`: e.g. `"5.5 human-review-calibration"`
* `topic`: e.g. `"stratified-sampling"`
* `scenarioTag`: e.g. `"s6"` or `"Customer Support Agent"`
* `prompt`: **100% clean, natural question text only**.

---

### Solution 2: Timed Mock Exam Overhaul (Pearson VUE Simulation)

We will transform [static/js/mock-test.js](file:///Users/ashishchawla/Documents/My-DIY-Projects/n8-rev-build/neighter/static/js/mock-test.js) into a high-fidelity proctored exam simulator:

#### A. During the Active Test (Live View):
1. **Hide Category & Difficulty Completely:**
   - Remove `<span class="question-domain">` and `<span>[intermediate]</span>`.
   - The test interface presents purely neutral, distraction-free questions.
2. **Top Exam Command Bar:**
   - **Exam Info:** `Question 14 of 60`
   - **Status Counters:** `Answered: 13` · `Unanswered: 47` · `Flagged: 2`
   - **Timer:** Real-time countdown (`⏱ 01:45:12`) with pulsing amber/red warning under 10 minutes.
   - **Flag for Review Action:** Toggleable `⚑ Flag for Review` button to mark questions to revisit.
3. **Question Card Layout:**
   - Question header: `Question 14` (clean, bold heading)
   - Question text: Clean prompt with preserved scenario formatting.
   - Standardized options: 4 distinct choices (`A`, `B`, `C`, `D`) with full-card selection states.
4. **Interactive Question Navigation Grid (1–60):**
   - Collapsible/docked drawer with buttons `1` through `60`.
   - Color-coded state indicators:
     - ⚪ **Unanswered** (default gray)
     - 🔵 **Answered** (accent color)
     - 🟡 **Flagged for Review** (amber with flag marker)
     - 🟢 **Current Question** (focused outline)
   - Allows instant jumping to any question at any point during the test.
5. **Review Screen Before Final Submission:**
   - When the candidate clicks "End Exam" or reaches Question 60, display an interactive confirmation dialog:
     > *"You have 4 unanswered questions and 2 questions flagged for review. Would you like to review them or submit your exam?"*

#### B. Post-Submission (Results & Review View):
*This is where the domain breakdown and analytics belong:*
1. **Official Pass/Fail Card:**
   - Total Score: `52 / 60 (86.7%)` vs 72% Target (`PASS`).
   - Time elapsed vs allowed time.
2. **Domain Performance Scorecard:**
   - D1 Agentic Architecture & Orchestration: `14 / 16 (87.5%)`
   - D2 Tool Design & MCP Integration: `10 / 11 (90.9%)`
   - D3 Claude Code Configuration & Workflows: `11 / 12 (91.7%)`
   - D4 Prompt Engineering & Structured Output: `9 / 12 (75.0%)`
   - D5 Context Management & Reliability: `8 / 9 (88.9%)`
3. **Comprehensive Question Review:**
   - Shows Candidate Answer vs Correct Answer.
   - Displays full architectural rationale and documentation references.
   - **Domain and difficulty are revealed here** for learning and retrospective analysis.

---

### Solution 3: Practice Mode (Sample Questions) Separation

In **Practice Mode** ([static/js/question-reveal.js](file:///Users/ashishchawla/Documents/My-DIY-Projects/n8-rev-build/neighter/static/js/question-reveal.js)):
- Because practice mode is for topical study (not timed simulation), the top domain filters (`D1`–`D5`) and difficulty selectors (`basic`, `intermediate`, `advanced`) are retained.
- The question prompts will now be completely clean (no more `133 · D4 · [intermediate]`), while the question card header displays the clean domain badge.

---

## 3. Implementation Roadmap

```
Phase 1: Question Data Cleaning Script
  ├── Develop scripts/clean-question-prompts.mjs
  ├── Audit all 1,130 prompts and strip regex metadata patterns
  ├── Extract domain, difficulty, section, topic into JSON fields
  ├── Format scenarios: "(Scenario: X) Situation:** Y" → "Scenario: X. Situation: Y"
  └── Run dry-run validation against .agent/schemas/question.schema.json

Phase 2: Upstream Parser Adapter Hardening
  ├── Update .agent/cert-prep-curator/extract-materials.mjs
  └── Ensure future extractions never leak header text into prompts

Phase 3: Timed Mock Exam Engine Redesign
  ├── Update static/js/mock-test.js:
  │     ├── Remove domain/difficulty headers from active exam view
  │     ├── Implement Flag for Review state tracking
  │     ├── Add 1–60 Question Navigator Grid (Answered/Unanswered/Flagged)
  │     └── Add pre-submit verification modal
  └── Retain full domain breakdown and difficulty tags on Results View

Phase 4: Site Verification & Build
  ├── Run node scripts/clean-question-prompts.mjs
  ├── Run node scripts/build-browser-artifacts.mjs
  ├── Run npm run build
  └── Verify mock exam UI in browser
```

---

## 4. Verification & Testing Criteria

1. **Prompt Sanitization Audit:**
   - `grep -E '^\d+\s*·|·\s*\[(basic|intermediate|advanced)\]|\*\*Difficulty:\*\*' data/questions/cca-f/questions.json` must return **0 results**.
   - All 1,130 questions must pass `npm run validate`.
2. **Mock Test UI Verification:**
   - Active question cards show **zero** domain or difficulty indicators.
   - Question 1 to 60 buttons update dynamically upon answering or flagging.
   - Timer counts down accurately and auto-submits upon expiry.
   - Results view accurately calculates domain breakdown percentages.
3. **Build & Integrity:**
   - `npm run build` passes with 0 broken links and 0 errors.
