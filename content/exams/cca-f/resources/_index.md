---
title: "Resources, Anti-Patterns & Flashcards"
description: "Exam scenario breakdowns, common anti-patterns to avoid, term glossary, and external study resources."
layout: "single"
---

Welcome to the **Resources & Anti-Patterns** section. Learn key architecture anti-patterns and study exam scenario breakdowns.

---

## 1. Canonical Anti-Patterns & Pitfalls

<div class="card-grid">
  <div class="question-card" style="border-left: 6px solid #dc2626;">
    <span class="badge" style="background: #dc2626; color: #fff;">ANTI-PATTERN #1</span>
    <h3 style="margin-top: 0.5rem;">Unbounded Tool Execution Loops</h3>
    <p>Allowing an autonomous agent to execute tools infinitely without a maximum iteration guard or budget cap, causing API cost overruns and hanging processes.</p>
  </div>

  <div class="question-card" style="border-left: 6px solid #dc2626;">
    <span class="badge" style="background: #dc2626; color: #fff;">ANTI-PATTERN #2</span>
    <h3 style="margin-top: 0.5rem;">Oversized Context Accumulation</h3>
    <p>Passing full raw file contents and entire execution transcripts back into prompt memory instead of summarizing, resulting in context window overflow.</p>
  </div>

  <div class="question-card" style="border-left: 6px solid #dc2626;">
    <span class="badge" style="background: #dc2626; color: #fff;">ANTI-PATTERN #3</span>
    <h3 style="margin-top: 0.5rem;">Ambiguous Tool Descriptions</h3>
    <p>Providing generic tool names and underspecified JSON schema descriptions, causing the model to hallucinate invalid arguments or pick wrong tools.</p>
  </div>

  <div class="question-card" style="border-left: 6px solid #dc2626;">
    <span class="badge" style="background: #dc2626; color: #fff;">ANTI-PATTERN #4</span>
    <h3 style="margin-top: 0.5rem;">Hardcoded Production Secrets</h3>
    <p>Embedding API keys or tokens inside system prompts, CLAUDE.md files, or custom scripts rather than using environment variable injection.</p>
  </div>
</div>

---

## 2. Exam Scenarios & Scenario Exercises

* 🎯 <a href="/ai-certification-preparation/exams/cca-f/study-guides/cca-prep-exam-scenarios/"><strong>CCAF Exam Scenario Exercises & Analysis</strong></a> — Detailed scenario walkthroughs.
* 📚 <a href="/ai-certification-preparation/exams/cca-f/study-materials/"><strong>Official Anthropic Documentation & PDFs</strong></a> — Scraped engineering docs and official PDFs.
