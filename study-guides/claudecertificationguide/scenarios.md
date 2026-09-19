# Claude Certification Guide — CCAR-F Scenarios (10)

> Source: https://claudecertificationguide.com — the scenario bank used by the mock exams.
> The real exam draws 4 of 6 published scenarios per sitting.

## S1 — Customer Support Resolution Agent

**Primary domains:** D1 (Agentic Architecture), D2 (Tool Design & MCP), D5 (Context Management)

**Context:**

A financial services company is building a customer support agent on Claude. It handles account enquiries and refunds, escalates the tricky cases, and talks to several backend systems through MCP tools.

---

## S2 — Multi-Agent Research System

**Primary domains:** D1 (Agentic Architecture), D2 (Tool Design & MCP), D5 (Context Management)

**Context:**

A consulting firm is rolling out a multi-agent research system. Web search, document analysis, and synthesis agents work under a coordinator that turns a sprawl of sources into finished market research reports.

---

## S3 — Code Generation with Claude Code

**Primary domains:** D3 (Claude Code Configuration), D5 (Context Management)

**Context:**

A software engineering team uses Claude Code to write, review, and test code in a large TypeScript monorepo: 200+ packages, tests co-located with the source they cover, and several deployment targets.

---

## S4 — Developer Productivity Tools

**Primary domains:** D1 (Agentic Architecture), D2 (Tool Design & MCP), D3 (Claude Code Configuration)

**Context:**

A platform engineering team is building internal developer tools on Claude. Automated code review, documentation generation, and codebase exploration, all wired into their CI/CD pipeline.

---

## S5 — CI/CD Pipeline Integration

**Primary domains:** D3 (Claude Code Configuration), D4 (Prompt Engineering)

**Context:**

A DevOps team has wired Claude Code into their CI/CD pipeline. It reviews PRs, generates tests, runs security scans, and checks deployments across a polyglot codebase with Terraform underneath.

---

## S6 — Structured Data Extraction Pipeline

**Primary domains:** D4 (Prompt Engineering), D5 (Context Management)

**Context:**

A legal tech startup is building a pipeline that pulls structured data out of contracts, invoices, and regulatory filings. Claude with tool_use does the extraction, which guarantees the output matches the schema.

---

## S7 — Enterprise Data Platform with Federated Queries

**Primary domains:** D2 (Tool Design & MCP), D5 (Context Management)

**Context:**

An enterprise analytics team is building a data platform that queries Snowflake, PostgreSQL, and third-party APIs through MCP tools. Result sets get big. Context management is the real work here: caching, summarisation, and deciding what happens when a multi-source response won't fit in the context window.

---

## S8 — Large-Scale Codebase Refactoring with Multi-Agent Claude Code

**Primary domains:** D1 (Agentic Architecture), D3 (Claude Code Configuration)

**Context:**

A development team is breaking a legacy Java monolith into microservices with Claude Code's multi-agent features. Specialist subagents are configured through CLAUDE.md, custom hooks enforce lint rules, and agentic delegation patterns coordinate changes across hundreds of files.

---

## S9 — Technical Documentation Maintenance System

**Primary domains:** D3 (Claude Code Configuration), D5 (Context Management)

**Context:**

A documentation team maintains API reference docs, architecture guides, and runbooks for a 500,000-line codebase with Claude Code. Context limits bite constantly, so the team leans on targeted file selection, session persistence, and processing the larger documentation sets incrementally.

---

## S10 — Content Moderation and Classification System

**Primary domains:** D1 (Agentic Architecture), D4 (Prompt Engineering)

**Context:**

A social media platform is building a content moderation system on agentic loops: classify, escalate, action. Prompts with few-shot examples and structured output schemas keep the moderation decisions consistent and auditable across every category.

---

