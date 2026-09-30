# Master Unified Sources Catalog — AI & Cloud Certifications

> **Document Version:** 2.0.0 · **Updated:** 2026-09-30  
> **Exams Covered:**  
> 1. `cca-f` — Claude Certified Architect — Foundations (Active · 1,130 questions)  
> 2. `terraform-associate` (`TA-004`) — HashiCorp Certified: Terraform Associate (004) (Onboarding · Tests Terraform 1.12+)  
> 3. `ccar-p` — Claude Certified Architect — Professional (Planned · 63 questions · 120 min)  
> 4. `ccdv-f` — Claude Certified Developer — Foundations (Planned · 53 questions · 120 min)  
>
> **Methodology:** HTTPS sources only. All URLs are cataloged for automated or guided ingestion.  
> **Zero-AI Generation Mandate:** Questions are strictly extracted from verified sources; the AI never synthesizes or hallucinates questions, distractors, or explanations.  
> **Deduplication:** Questions pass through token-similarity filtering ($>0.85$ threshold) before admission into `data/questions/<exam-id>/questions.json`.  
> **Zero External Link Leakage:** All source URLs remain in internal registries (`.agent/cert-prep-curator/sources.json` and this plan). No raw affiliate or external outbound links are leaked into public Hugo rendered pages.

---

## 1. Source Trust Tiers & Credibility Framework

Sources are classified into four trust tiers based on their provenance, validation rigor, and alignment with actual Pearson VUE exam items:

| Trust Tier | Description | Exam Item Credibility | Ingestion Policy |
|---|---|---|---|
| **Tier 1 (Official)** | Vendor-published documentation, official exam guides, blueprint objectives, and vendor sample questions (Anthropic, HashiCorp/IBM). | **Direct Authority** (defines exact objectives and question styling) | Direct automated ingestion into `content/` and `data/questions/`. |
| **Tier 2 (Verified Standards)** | Recognized industry gold-standard authors, verified instructors (e.g., Bryan Krausen, Jon Bonso / Tutorials Dojo, Szymon Paluch), and peer-reviewed timed mock exams. | **Very High Likelihood** (matches real exam difficulty, scenarios, and question formats) | Ingestion into question banks after schema validation and deduplication. |
| **Tier 2 (Curated API)** | Curated testing engines and question streams (e.g., CertyIQ) with per-paper pagination. | **High Scenario Relevance** | API-driven ingestion via dedicated adapters. |
| **Tier 3 (Community / Open)** | Public GitHub open-source repositories, community discussion threads (ExamTopics candidate voting), flashcards, and cheat sheets. | **High Historical Recall** | Filtered ingestion; requires duplicate checking and answer consensus verification. |
| **Commercial / Reference** | Paid platforms (Udemy, Whizlabs, Skilljar) used as benchmark references to ensure objective completeness. | **Benchmark Standard** | Used for curriculum alignment and manual verification against our free mock engine. |

---

## 2. HashiCorp Certified: Terraform Associate (004) — `terraform-associate`

The **Terraform Associate (004)** exam evaluates foundational infrastructure-as-code principles, Terraform CLI workflows, state management, module architecture, and HCP Terraform (formerly Terraform Cloud) governance using **Terraform 1.12+**.

### 2.1 Official HashiCorp Sources (Tier 1 — Free)

| # | Source Name & Entity | Access | Credibility | Description / Questions | Ingestion Destination |
|---|---|:---:|:---:|---|---|
| **TA-1** | [HashiCorp Official Sample Questions (004)](https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-questions-004) | **Free** | **Direct Authority** | Official review question set directly authored by HashiCorp's exam team. Tests multi-select, flag syntax, and state locking. | `data/questions/terraform-associate/questions.json` |
| **TA-2** | [HashiCorp Official Study Guide (004)](https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-study-004) | **Free** | **Direct Authority** | Comprehensive tutorial map covering all 8 exam domains for Terraform 1.12. | `content/exams/terraform-associate/study-materials/` |
| **TA-3** | [HashiCorp Official Review Guide (004)](https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-review-004) | **Free** | **Direct Authority** | High-level summary of exam objectives, core CLI commands, and state lifecycle. | `content/exams/terraform-associate/study-guides/` |
| **TA-4** | [HashiCorp Exam Objectives (004 Blueprint)](https://developer.hashicorp.com/certifications/infrastructure-automation/terraform-associate-004) | **Free** | **Direct Authority** | Canonical 8-domain syllabus: IaC concepts, CLI, modules, state, configuration, HCP Terraform. | `data/objectives/terraform-associate.json` |
| **TA-5** | [Terraform Language Documentation](https://developer.hashicorp.com/terraform/language) | **Free** | **Tier 1 Docs** | Providers, resources, data sources, variables, outputs, expressions, backend configuration. | `content/exams/terraform-associate/study-materials/` |
| **TA-6** | [Terraform CLI Command Reference](https://developer.hashicorp.com/terraform/cli) | **Free** | **Tier 1 Docs** | Complete command options for `init`, `plan`, `apply`, `destroy`, `import`, `state`, `workspace`, `fmt`, `validate`. | `content/exams/terraform-associate/study-materials/` |

### 2.2 Paid Industry Gold Standards & Benchmark Banks (Tier 2 — Commercial)

These courses and banks are universally regarded as the closest simulation to the real Pearson VUE examination.

| # | Source & Author | Platform / Access | Credibility | Content Scope | Value to Neighter Platform |
|---|---|:---:|:---:|---|---|
| **TA-7** | **Bryan Krausen** — *HashiCorp Certified: Terraform Associate (004) Practice Exam* | Paid (~$15-$20 on Udemy) | **#1 Industry Benchmark** | **6 Practice Exams · 340+ questions**. Rated 4.8/5. Renowned as the most accurate replica of actual Pearson VUE questions, multi-select styling, and scenario traps. | Benchmark reference for question quality, domain weighting, and distractor plausibility. |
| **TA-8** | **Tutorials Dojo (Jon Bonso)** — *HashiCorp Certified Terraform Associate Practice Exams* | Paid (~$12-$15 on TutorialsDojo.com) | **Top Tier Simulation** | **Timed & Review Mock Exams**. In-depth visual explanations, reference diagrams, and trap detection. | Benchmark for detailed explanations and objective mapping. |
| **TA-9** | **Zeal Vora** — *HashiCorp Certified Terraform Associate (004)* | Paid (~$15-$20 on Udemy) | **Very High** | Complete video curriculum + full practice tests covering Terraform 1.12+ features. | Validation of edge-case CLI flags and HCP Terraform features. |
| **TA-10** | **Whizlabs** — *HashiCorp Certified Terraform Associate Practice Tests* | Paid (~$15 subscription) | **High** | **200+ unique questions**, sandbox test environment, diagnostic scorecards. | Comparative domain difficulty balancing. |

### 2.3 Community, Open-Source & Discussion Banks (Tier 2 & Tier 3 — Free / Freemium)

| # | Source Name & Repository | Platform / Access | Credibility | Description / Questions | Ingestion Destination |
|---|---|:---:|:---:|---|---|
| **TA-11** | [ExamTopics Terraform-Associate Discussion Bank](https://www.examtopics.com/exams/hashicorp/terraform-associate/) | Freemium / Community | **Very High Recall** | **358 real exam questions** with active community voting, candidate consensus discussions, and debate on tricky questions. | Filtered ingestion after verification against Terraform 1.12 behavior. |
| **TA-12** | [susu10-10 / TF004-PocketGuide](https://github.com/susu10-10/TF004-PocketGuide) | **Free (MIT / Open)** | **High Quality** | Concise Terraform 004 revision notes, domain checklists, and common command gotchas. | `content/exams/terraform-associate/resources/` |
| **TA-13** | [bradmccoydev / terraform-cert-practice-questions](https://github.com/bradmccoydev/terraform-cert-practice-questions) | **Free (Open)** | **High Quality** | **100+ scenario practice questions** categorized by domain with markdown answer keys. | Candidate for ingestion into `data/questions/terraform-associate/`. |
| **TA-14** | [rfitzhugh / terraform-associate](https://github.com/rfitzhugh/terraform-associate) | **Free (Open)** | **Good Review** | Study notes, CLI flashcards, and conceptual cheat sheets for Terraform certification. | `content/exams/terraform-associate/resources/` |
| **TA-15** | [CertyIQ Terraform Associate Streams](https://certyiq.com) | Curated API | **Tier 2 Curated** | Automated question stream across TA-004 (4 pages), TA-003, and legacy papers. | `data/questions/terraform-associate/questions.json` |

---

## 3. Claude Certified Architect — Foundations (`CCA-F` / `CCAR-F`)

The **Claude Certified Architect — Foundations** exam tests enterprise agentic architecture, Model Context Protocol (MCP), Claude Code workflows, prompt engineering, and context management across 5 domains.

### 3.1 Official Anthropic Documentation (Tier 1 — Free)

| # | Source Name | Format | Trust Tier | Scope & Primary Materials | Destination in Repo |
|---|---|:---:|:---:|---|---|
| **CCA-1** | [Anthropic Official Exam Guide v1.0](https://everpath-course-content.s3-accelerate.amazonaws.com/Claude+Certified+Architect+%E2%80%93+Foundations+Certification+Exam+Guide.pdf) | PDF | **Tier 1 (Official)** | 40-page v1.0 Exam Guide, 5 domain weightings, task statements, test format. | `content/exams/cca-f/study-materials/` |
| **CCA-2** | [Anthropic Partner Academy (Skilljar)](https://anthropic-partners.skilljar.com) | LMS / HTML | **Tier 1 (Official)** | Official curriculum, registration details, Pearson VUE proctoring rules. | `content/exams/cca-f/study-materials/` |
| **CCA-3** | [Claude Code CLI Documentation](https://code.claude.com) | Markdown / Web | **Tier 1 (Official)** | CLI architecture, subagents, memory files (`CLAUDE.md`), hooks, MCP integration. | `content/exams/cca-f/study-materials/` |
| **CCA-4** | [Anthropic Platform & Agent SDK](https://docs.anthropic.com) | Markdown / Web | **Tier 1 (Official)** | Messages API, tool use, prompt caching rules, streaming, computer use. | `content/exams/cca-f/study-materials/` |
| **CCA-5** | [Model Context Protocol (MCP) Official Spec](https://modelcontextprotocol.io) | Markdown / Web | **Tier 1 (Official)** | Protocol specs, tool discovery, sampling, client-server lifecycle, transports. | `content/exams/cca-f/study-materials/` |
| **CCA-6** | [Anthropic Research: Building Effective Agents](https://docs.anthropic.com/en/build-with-claude/tool-use) | Markdown / Web | **Tier 1 (Official)** | Patterns: Prompt Chaining, Routing, Orchestrator-Workers, Evaluator-Optimizer. | `content/exams/cca-f/study-guides/` |

### 3.2 Practice Questions & High-Credibility Mocks (Tier 2 & 3 — Free / Open Source)

| # | Source Name & Entity | Access | Credibility | Description & Materials | Destination in Repo |
|---|---|:---:|:---:|---|---|
| **CCA-7** | [Szymon Paluch 60-Question Mock Exam](https://github.com/hculap/claude-certified-architect-practice-exam) | **Free (MIT License)** | **Very High (Score: 833/1000)** | **60-question timed practice exam** authored by a certified practitioner. Realistic scenario questions with complete rationales. | `data/questions/cca-f/questions.json` |
| **CCA-8** | [Claude Certification Guide Platform](https://claudecertificationguide.com) | Web / Free | **Tier 2 Verified** | **257 questions** with per-option explanations, 30 lessons, 10 complex scenarios. | `data/questions/cca-f/questions.json` & `content/exams/cca-f/study-guides/` |
| **CCA-9** | [claudecertifiedarchitects.com](https://claudecertifiedarchitects.com) | Web / Free | **Tier 2 Verified** | **400 scenario-based questions** spanning all 5 exam domains. | `data/questions/cca-f/questions.json` |
| **CCA-10** | [Architect & Associate Exam Prep Bank](https://raw.githubusercontent.com/amey-thakur/claude-architect/main/questions.json) | **Free (GitHub)** | **Tier 2 Verified** | **320 raw questions**, 3 timed mock exams (15Q / 30M each). | `data/questions/cca-f/questions.json` |
| **CCA-11** | [cca-prep (claudecertprep.com)](https://claudecertprep.com) | Web / Free | **Tier 2 Verified** | **170 questions**, 17 anti-patterns, 45 flashcards, 29 cheat sheets. | `data/questions/cca-f/questions.json` & `content/exams/cca-f/resources/` |
| **CCA-12** | [CertyIQ Anthropic Stream](https://certyiq.com) | API / Free | **Tier 2 Curated** | Automated question stream for Claude Foundations certification. | `data/questions/cca-f/questions.json` |
| **CCA-13** | Architecture Scenario & Theory Guide | Git / Markdown | **Tier 2 Verified** | **3,400-line theory guide**, 88 scenario Qs, Anki test deck. | `content/exams/cca-f/study-guides/` |
| **CCA-14** | Community Architecture Foundations Guide | PDF / Markdown | **Tier 2 Verified** | **83-page study guide** + 5 domain deep dives. | `content/exams/cca-f/study-guides/` |
| **CCA-15** | [Spectrum AI Labs](https://spectrumailab.com) | Web / Blog | **Tier 2 Verified** | 4-exam blueprint, domain weightings, exam-taking strategy. | `content/exams/cca-f/articles/` |
| **CCA-16** | [Claude Architect Guide (Tokenomics)](https://claudearchitectguide.com) | Web / Free | **Tier 2 Verified** | Cost analysis, prompt caching break-even math, context budgeting. | `content/exams/cca-f/articles/` |

### 3.3 Commercial & Paid Standards (Benchmark Reference)

| # | Source & Entity | Platform | Scope | Value to Project |
|---|---|:---:|---|---|
| **CCA-17** | **Tutorials Dojo Claude Track** | TutorialsDojo.com (Paid) | Comprehensive mock tests in exam simulation mode. | Gold standard question structuring and feedback review. |
| **CCA-18** | **Whizlabs Claude Certified Architect** | Whizlabs (Paid) | Practice question banks with domain-level analytics. | Difficulty calibration. |
| **CCA-19** | **Isha Training Solutions** | Training LMS (Paid) | Instructor-led live preparation and scenario walkthroughs. | Architecture case studies. |

---

## 4. Claude Certified Architect — Professional (`CCAR-P`) [Planned]

The **Professional** exam requires in-depth mastery of enterprise deployment, multi-agent orchestration, complex security guardrails, token optimization, and governance (63 questions, 120 minutes).

| # | Source Name & Entity | Type / Access | Credibility | Key Focus Areas |
|---|---|:---:|:---:|---|
| **CCAR-P-1** | [Anthropic Enterprise Best Practices](https://docs.anthropic.com/en/docs/enterprise) | Official / Free | **Direct Authority** | Multi-tenant security, VPC endpoints, audit logging, latency management. |
| **CCAR-P-2** | [Tutorials Dojo CCAR-P Practice Exams](https://tutorialsdojo.com) | Commercial / Paid | **Very High** | High-complexity multi-tier agent scenarios, error-recovery loops. |
| **CCAR-P-3** | [Claude Certification Guide — Professional](https://claudecertificationguide.com) | Curated / Free | **Tier 2 Verified** | Multi-agent coordination patterns (Supervisor-Worker, Swarm, Hierarchical). |
| **CCAR-P-4** | [Preporato Claude Certified Architect Professional](https://preporato.com) | Commercial Mock | **High** | 63-question timed practice simulation with domain scoring. |
| **CCAR-P-5** | [Isha Training Solutions Advanced Claude Track](https://ishatrainingsolutions.com) | Paid Course | **High** | Enterprise architecture case studies and security implementations. |

---

## 5. Claude Certified Developer — Foundations (`CCDV-F`) [Planned]

The **Developer Foundations** exam focuses on hands-on software development using Claude APIs, SDKs (Python, TypeScript), tool implementation, structured outputs, streaming, and error handling (53 questions, 120 minutes).

| # | Source Name & Entity | Type / Access | Credibility | Key Focus Areas |
|---|---|:---:|:---:|---|
| **CCDV-F-1** | [Anthropic API Reference & SDKs](https://docs.anthropic.com/en/api) | Official / Free | **Direct Authority** | Python SDK (`anthropic`), TypeScript SDK, JSON schema validation, tool execution. |
| **CCDV-F-2** | [Anthropic Cookbook Repositories](https://github.com/anthropics/anthropic-cookbook) | Official / Open | **Direct Authority** | Real code recipes for streaming, embeddings, tool integration, and evaluations. |
| **CCDV-F-3** | [Preporato CCDV-F Developer Practice Tests](https://preporato.com) | Commercial Mock | **High** | 53-question timed developer mock tests. |
| **CCDV-F-4** | [CertSafari Claude Developer Exam Bank](https://certsafari.com) | Freemium Mock | **High** | Coding and API call question banks, parameter debugging questions. |
| **CCDV-F-5** | [Claude Certification Guide — Developer Track](https://claudecertificationguide.com) | Web / Free | **Tier 2 Verified** | Developer-focused practice questions and SDK code snippets. |

---

## 6. Documented Paywalled / Blocked Sources (Audited, Excluded from Automated Pulls)

These sources were audited during intelligence gathering but are excluded from automated scraping due to technical or legal barriers:

| Source Host / URL | Barrier Type | Description & Policy |
|---|:---:|---|
| `claudecertified.io` | 🔒 Login Wall | Claims 1,374 questions; requires authenticated session cookies. Cannot be automated via public CI. |
| `claude.termidy.com` (ClaudePrep) | 🔒 Moodle LMS | 1,068 questions across 4 certifications behind university/course authentication. |
| `claudecertifications.com` | 🚫 HTTP 451 | Blocked by Cloudflare due to legal/trademark complaints. |
| `claudetestprep.com` | 🔒 Gated Form | 609-question bank requiring lead-generation registration. |
| `ccafoundations.com` | 💰 £49 Paywall | Paid PDF and desktop testing engine. |
| `examtopics.com` (Full Contributor Access) | 🔒 Paywall | First ~50% of questions are visible publicly; remainder require paid contributor subscription. |

---

## 7. Master Comparison Matrix across All 4 Exams

| Exam ID | Code | Status | Question Bank Size (Current) | Target Question Bank Size | Primary Question Ingestion Sources |
|---|---|:---:|:---:|:---:|---|
| **`cca-f`** | `CCAF` | **Active** | **1,130** | 1,200+ | Szymon Paluch (60Q), Claude Cert Guide (257Q), CCA Architects (400Q), Amey Thakur (320Q), CCA-Prep (170Q), CertyIQ |
| **`terraform-associate`** | `TA-004` | **Onboarding** | **0** (Scaffolded) | **350+** | HashiCorp Official Questions 004, ExamTopics (358Q), Brad McCoy (100Q), Bryan Krausen (Benchmark), CertyIQ |
| **`ccar-p`** | `CCAR-P` | **Planned** | 0 | 250+ | Anthropic Enterprise Docs, Tutorials Dojo, Preporato, Claude Cert Guide Professional |
| **`ccdv-f`** | `CCDV-F` | **Planned** | 0 | 200+ | Anthropic API/Cookbook, Preporato, CertSafari, Claude Cert Guide Developer |

---

## 8. Question Intake & Ingestion Pipeline Workflow

```
[Approved Source (URL / Doc)]
            │
            ▼
[Parser Adapter (http-generic / certyiq-api / html-parser)]
            │
            ▼
[Schema Validation (.agent/schemas/question.schema.json)]
            │
            ▼
[Deduplication Engine (Token Jaccard / Levenshtein > 0.85)]
            ├── Duplicate Found ──> [Reject & Log to Deduplication Ledger]
            │
            └── Unique Question ──> [Normalize IDs & Assign Exam Domains]
                                              │
                                              ▼
                        [Save to data/questions/<exam-id>/questions.json]
                                              │
                                              ▼
                        [Hugo Pre-Build & Browser Artifact Generation]
                                              │
                                              ▼
                        [Live Verification & Zero Link Leakage Audit]
```

### Ingestion Checklist for Any New Question Source
1. **Source Registration:** Add entry with unique `id`, `url`, `trust_tier`, `publication_mode`, and domain mappings to `.agent/cert-prep-curator/sources.json`.
2. **Schema Compliance:** Must satisfy `.agent/schemas/source.schema.json`.
3. **Preflight Check:** Run `npm run preflight <exam-id>` to ensure directories, configs, and schemas align.
4. **Clean Extraction:** Extract only verified question text, options, correct answers, and objective tags. Never use AI to invent synthetic questions or fake distractors.
5. **Deduplication:** Run `npm run dedup <exam-id>` to eliminate redundant items before committing to main.
