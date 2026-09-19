---
title: "4 Prompt Engineering__4 2 Few Shot Prompting"
meta: "ClaudeCertificationGuide lesson"
tags: ["study", "claudecertificationguide"]
---

# 4.2 — Few-Shot Prompting | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/4-prompt-engineering/4-2-few-shot-prompting

STUDY TOOLS

Progress Dashboard
Drill Mode

CURRICULUM

01
Agentic Architecture & Orchestration
02
Tool Design & MCP Integration
03
Claude Code Configuration & Workflows
04
Prompt Engineering & Structured Output
4.1
System Prompts with Explicit Criteria
4.2
Few-Shot Prompting
4.3
Structured Output with Tool Use
4.4
Validation, Retry, and Feedback Loops
4.5
Batch Processing Strategies
4.6
Multi-Instance and Multi-Pass Review
05
Context Management & Reliability

PRACTICE

Build Exercises
Diagnostic Test

LOOK UP

Quick Reference
Glossary
LEARN
/
PROMPT ENGINEERING & STRUCTURED OUTPUT
/
4.2
DOMAIN 4
TASK 4.2
Mark Complete
Few-Shot Prompting
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

Few-shot examples are the most effective technique for achieving consistent, well-formatted output from Claude. Not more instructions. Not confidence thresholds. Not temperature adjustments. When your output is inconsistent, few-shot examples are the first tool to reach for.

This is a direct exam principle. The exam presents scenarios where detailed instructions produce inconsistent results and tests whether you choose "add more instructions" or "add few-shot examples." The correct answer is almost always the latter.

When to Deploy Few-Shot Examples

Three specific triggers tell you few-shot examples are needed:

1. Detailed instructions alone produce inconsistent formatting. You have written a thorough prompt specifying the output format, but the model produces different structures across invocations — sometimes a bulleted list, sometimes a table, sometimes prose. More instructions will not fix this. A few examples showing the exact format you want will.

2. The model makes inconsistent judgement calls on ambiguous cases. For a code review tool, the model flags variable shadowing as "critical" in one file and "minor" in another. For a tool selection agent, it routes "check my order" to different tools depending on phrasing. These ambiguous cases need examples demonstrating the correct judgement, with reasoning.

3. Extraction tasks produce empty/null fields for information that exists in the document. The information is present but in an unexpected format — embedded in narrative text rather than a structured table, or split across multiple paragraphs. Few-shot examples showing extraction from varied document structures resolve this.

How to Construct Effective Examples

The rules are tight:

Use 2-4 targeted examples. Fewer than 2 doesn't establish a pattern. More than 4 wastes tokens without proportional benefit. Point your examples at the specific ambiguous scenarios causing problems.

Each example must show reasoning. Don't just show input-output pairs. Show why one action was chosen over plausible alternatives. That teaches the model to generalise its judgement to novel patterns, not just match the specific cases in your examples.

Copy
Example: Tool selection for "check my order #12345"
Input: "check my order #12345"
Selected tool: lookup_order
Reasoning: The user provides an order number (#12345), indicating
they want order-specific information. Even though this could be
interpreted as a general customer query, the specific order
identifier makes lookup_order the correct choice over get_customer.


Without the reasoning, the model learns only "queries mentioning order numbers go to lookup_order." With the reasoning, the model learns the general principle: specific identifiers route to specific lookup tools.

Cover the failing scenarios. If your extraction works on tables but fails on narrative text, your examples should show correct extraction from narrative text. If your code review is inconsistent on variable shadowing, your examples should classify variable shadowing scenarios at different severity levels with reasoning.

The Hallucination Reduction Effect

Few-shot examples have a useful side effect: they cut hallucination in extraction tasks. When the model sees examples of correct extraction from varied document structures — inline citations vs bibliographies, narrative descriptions vs structured tables, headers vs embedded text — it learns to handle structural variety without inventing data.

This matters most for documents with inconsistent formatting. A financial report might list expenses in a table on one page and bury them in a paragraph on the next. Without examples, the model often nails the table but returns empty fields for the narrative section, or worse, fabricates values. Show it both structures and extraction quality climbs.

Few-Shot for Reducing False Positives

In code review and analysis, few-shot examples pull double duty: they show both what to flag and what to ignore. Examples that separate acceptable code patterns from genuine issues cut false positives while still catching the real problems.

TEXT
Copy
Example: Variable shadowing assessment
Code: function process(items) {
  const result = items.map(item => {
    const result = transform(item);  // shadows outer 'result'
    return result;
  });
  return result;
}
Severity: minor
Reasoning: The inner 'result' shadows the outer variable but
within a limited scope (arrow function). The code is still readable
and the shadow does not cause a bug. This is a style preference,
not a defect. Flag as minor only if style consistency is in scope.


This example teaches the model to distinguish genuine bugs from benign patterns, reducing false positives while preserving the ability to generalise to genuinely problematic shadowing cases.

KEY CONCEPT

Few-shot examples are the most effective technique for consistency. Use 2-4 targeted examples that include reasoning for decisions, not just input-output pairs. Deploy them when instructions alone produce inconsistent results, ambiguous judgements, or empty extraction fields for data that exists.

Few-Shot vs Other Techniques

The exam tests whether you can distinguish when few-shot examples are the right solution versus when another technique applies:

Problem	Correct Technique
Inconsistent output formatting	Few-shot examples
Malformed JSON output	tool_use with JSON schemas
Fabricated values for missing fields	Optional/nullable schema fields
Wrong tool selection	Better tool descriptions (first), then few-shot
Model misses information in narrative text	Few-shot examples showing narrative extraction
Extraction sum does not match total	Validation-retry loop
Exam Traps
EXAM TRAP

Choosing 'add more detailed instructions' when output formatting is inconsistent

If detailed instructions already exist and output is still inconsistent, adding more instructions will not fix the problem. Few-shot examples demonstrating the exact desired format are more effective for consistency.

EXAM TRAP

Thinking few-shot examples only teach literal pattern-matching

When examples include reasoning for why decisions were made, they teach the model to generalise to novel patterns. The model learns the decision principle, not just the specific case.

EXAM TRAP

Using confidence thresholds to fix inconsistent judgement calls

Confidence thresholds are poorly calibrated and do not address the root cause. Few-shot examples showing the correct judgement for ambiguous cases directly teach consistent decision-making.

Practice Scenario

Your extraction pipeline correctly identifies research data in structured tables but returns empty fields when the same information appears in narrative paragraphs. Detailed instructions already specify all required fields and their formats. What should you try first?

OPTION A
Add a pre-processing step to convert all narrative text into structured tables before extraction
OPTION B
Increase the model context window to process more of each document
OPTION C
Add few-shot examples showing correct extraction from both structured tables and narrative paragraphs
OPTION D
Add a post-processing retry that re-extracts any fields returned as empty
Check Answer
Build Exercise
BUILD EXERCISE
Build a Few-Shot Enhanced Extraction Prompt
Difficulty
45 MINUTES

WHAT YOU'LL LEARN

Identify the three triggers for deploying few-shot examples: inconsistent formatting, ambiguous judgement calls, and empty fields for existing data
Construct effective few-shot examples with reasoning, not just input-output pairs
Use 2-4 targeted examples covering the specific failing scenarios
Distinguish when few-shot examples are the right technique versus schema changes or validation loops
Measure the impact of few-shot examples on empty field rates and format consistency
Create a base extraction prompt with detailed instructions but no examples and test it against 10 documents with varied structures: tables, narrative paragraphs, mixed formats

WHY: Establishing a baseline without examples demonstrates the consistency problem the exam tests. Detailed instructions alone produce inconsistent output across varied document structures, which is the exact trigger for deploying few-shot examples.

YOU SHOULD SEE: Inconsistent extraction results across the 10 documents: fields extracted correctly from tables but empty or wrong from narrative paragraphs, different output formats across runs, and inconsistent handling of edge cases.

Stuck? Get a nudge
Record which fields are consistently empty or inconsistent across document structures

WHY: Identifying the specific failure patterns tells you exactly what your few-shot examples need to demonstrate. The exam tests whether you can diagnose the problem before prescribing the solution.

YOU SHOULD SEE: A table or log showing which fields fail on which document types. Typical pattern: dates extracted correctly from tables but missed in narrative text, amounts inconsistent when written in words rather than digits, line items empty when embedded in paragraphs.

Stuck? Get a nudge
Create 3 few-shot examples targeting the failing patterns — each must include reasoning explaining why the extraction was done that way

WHY: Examples with reasoning teach the model to generalise to novel patterns, not just match specific cases. Without reasoning, the model learns only surface-level pattern matching. The exam specifically tests that reasoning-included examples outperform input-output pairs.

YOU SHOULD SEE: Three examples, each showing a different document structure (table, narrative, mixed), with the correct extraction AND a reasoning section explaining how the data was located and why the extraction decisions were made.

Stuck? Get a nudge
Re-run the same 10 documents with the few-shot enhanced prompt and compare: empty field rate, format consistency, and extraction accuracy

WHY: Quantifying the improvement demonstrates the effectiveness of few-shot examples as the first-choice technique for consistency problems. The exam expects you to know that few-shot examples outperform additional instructions for this class of problem.

YOU SHOULD SEE: A measurable reduction in empty fields (especially on narrative documents), improved format consistency across document types, and higher overall extraction accuracy. The improvement should be most dramatic on the document types that previously failed.

Stuck? Get a nudge
Document which structural patterns benefit most from few-shot examples and which require different techniques like schema changes

WHY: The exam tests whether you can match the right technique to the right problem. Few-shot examples fix consistency and structural variety issues, but malformed JSON needs tool_use, fabricated values need nullable schemas, and sum discrepancies need validation loops.

YOU SHOULD SEE: A decision matrix showing which problem types improved with few-shot examples and which still need other interventions. Narrative extraction and format consistency should improve. Fabrication of missing data should not improve and needs schema changes instead.

Stuck? Get a nudge
Sources
Claude Certified Architect Foundations Exam Guide — Task Statement 4.2 — Anthropic
Prompt Engineering Overview — Anthropic
Building with Claude API (Skilljar) — Anthropic
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
System Prompts with Explicit Criteria
NEXT LESSON
Structured Output with Tool Use