---
title: "2 Tool Design Mcp__2 1 Tool Schema Design"
meta: "ClaudeCertificationGuide lesson"
tags: ["study", "claudecertificationguide"]
---

# 2.1 — Tool Interface Design | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/2-tool-design-mcp/2-1-tool-schema-design

STUDY TOOLS

Progress Dashboard
Drill Mode

CURRICULUM

01
Agentic Architecture & Orchestration
02
Tool Design & MCP Integration
2.1
Tool Interface Design
2.2
Structured Error Responses
2.3
Tool Distribution & Tool Choice
2.4
MCP Server Integration
2.5
Built-in Tools
03
Claude Code Configuration & Workflows
04
Prompt Engineering & Structured Output
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
TOOL DESIGN & MCP INTEGRATION
/
2.1
DOMAIN 2
TASK 2.1
Mark Complete
Tool Interface Design
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

Tool descriptions are the PRIMARY mechanism LLMs use for tool selection. Not supplementary metadata. Not an afterthought. When a model receives a set of tools, it reads the descriptions to decide which one to call — and if those descriptions are minimal, something like "Retrieves customer information", it has no way to tell apart tools that serve overlapping purposes.

What Makes a Good Tool Description

A production-grade tool description includes five elements:

What the tool does — its primary purpose, stated unambiguously
What inputs it expects — data types, formats, constraints, and required versus optional fields
Example queries it handles well — concrete use cases that anchor the model's understanding
Edge cases and limitations — what the tool does NOT do, and what happens when inputs fall outside expected ranges
Explicit boundaries — when to use THIS tool versus similar tools in the same toolkit

Here is the difference between a minimal and a production-grade description:

Minimal (causes misrouting):

TEXT
Copy
get_customer: "Retrieves customer information"
lookup_order: "Retrieves order details"


Production-grade (reliable selection):

TEXT
Copy
get_customer: "Looks up a customer account by email address,
phone number, or customer ID. Returns customer profile
(name, contact details, account status, loyalty tier).
Use this when you need to verify who the customer is.
Do NOT use for order-specific queries — use lookup_order
for those."

lookup_order: "Retrieves order details by order number
(format: #NNNNN) or tracking ID. Returns order status,
items, shipping details, and refund eligibility.
Use this when a customer asks about a specific order.
Do NOT use for customer identity verification —
use get_customer for that."


The second version gives the model explicit disambiguation. It knows which identifiers each tool accepts, what each returns, and crucially, when NOT to use each tool.

The Misrouting Problem

Two tools with overlapping or near-identical descriptions cause selection confusion. The exam guide's sample Question 2 presents exactly this scenario: get_customer and lookup_order with minimal descriptions, causing the agent to route "check my order #12345" to the wrong tool.

The exam tests whether you can spot the correct fix. Four plausible options, three of them wrong:

Expand descriptions — correct. Low effort, high leverage, directly addresses the root cause.
Few-shot examples — wrong. Adds token overhead without fixing why the model is confused. You're treating symptoms, not the disease.
Routing classifier — wrong. Over-engineered as a first step. Bypasses the LLM's natural language understanding and adds infrastructure complexity.
Tool consolidation — wrong as a first step. It's a valid architectural choice long-term, but it costs far more effort than expanding descriptions.

The exam consistently favours low-effort, high-leverage fixes. Better descriptions before routing classifiers. Scoped access before full access. Community servers before custom builds.

Tool Splitting

Generic tools with broad responsibilities create ambiguity. The fix: split them into purpose-specific tools with defined input/output contracts.

Before splitting:

TEXT
Copy
analyze_document: "Analyses a document and returns results"


After splitting:

TEXT
Copy
extract_data_points: "Extracts structured data fields
(dates, amounts, names) from a document"

summarize_content: "Produces a concise summary of a
document's key arguments and conclusions"

verify_claim_against_source: "Checks whether a specific
claim is supported by the source document, returning
supporting/contradicting evidence"


Each resulting tool does one narrow, clearly described job. The model can pick the right one based on what the user actually needs.

Tool Renaming for Clarity

When two tools have confusingly similar names, renaming fixes the overlap at the interface level. Rename analyze_content to extract_web_results, give it a web-specific description, and the tool's purpose becomes unambiguous — without touching its implementation.

System Prompt Interactions

Keyword-sensitive instructions in system prompts can create unintended tool associations that override well-written descriptions. If your system prompt says "always check customer details before proceeding", the model may route any customer-related query to get_customer no matter what the descriptions say.

So after updating tool descriptions, reread your system prompt for conflicts. It's a subtle failure mode, and the exam tests it.

KEY CONCEPT

Tool descriptions are the primary mechanism LLMs use for tool selection. When misrouting is caused by weak descriptions, improving them is the first fix — not few-shot examples, routing classifiers, or tool consolidation.

Read the condition on that, because the exam tests both halves. Descriptions are the fix when the agent has a workable number of tools and simply cannot tell two of them apart. They are not the fix when the toolkit itself is the problem: past roughly 4-5 tools per agent, selection degrades on decision complexity alone, and rewriting 22 descriptions leaves that untouched. Diagnose which one you are looking at before reaching for a remedy. Task Statement 2.3 covers the overload threshold and what to do instead.

Exam Traps
EXAM TRAP

Choosing few-shot examples to fix tool misrouting caused by minimal descriptions

Few-shot examples add token overhead without addressing the root cause. The model is confused because descriptions do not differentiate the tools — fix the descriptions first.

EXAM TRAP

Implementing a routing classifier as the first step to fix tool selection

A routing classifier is over-engineered as a first response. It bypasses the LLM's natural language understanding and adds infrastructure the exam does not consider proportionate.

EXAM TRAP

Consolidating similar tools into one as the first step

Tool consolidation is a valid long-term architectural choice, but it requires more effort than expanding descriptions. The exam favours low-effort, high-leverage first steps.

EXAM TRAP

Ignoring system prompt wording after updating tool descriptions

Keyword-sensitive instructions in system prompts can silently override well-written tool descriptions, creating unintended tool associations.

Practice Scenario

Production logs show an agent frequently calls get_customer when users ask about orders (e.g. 'check my order #12345'), instead of calling lookup_order. Both tools have minimal descriptions ('Retrieves customer information' / 'Retrieves order details') and accept similar identifier formats. What is the most effective first step to improve tool selection reliability?

OPTION A
Add 5-8 few-shot examples to the system prompt demonstrating correct tool selection patterns for order-related queries.
OPTION B
Expand each tool description to include input formats, example queries, edge cases, and boundaries explaining when to use it versus similar tools.
OPTION C
Consolidate both tools into a single lookup_entity tool that accepts any identifier and internally determines which backend to query.
OPTION D
Implement a routing layer that parses user input before each turn and pre-selects the appropriate tool based on detected keywords.
Check Answer
Build Exercise
BUILD EXERCISE
Design Tool Descriptions That Eliminate Misrouting
Difficulty
30 MINUTES

WHAT YOU'LL LEARN

Understand that tool descriptions are the primary mechanism LLMs use for tool selection
Write production-grade descriptions with purpose, inputs, examples, edge cases, and boundaries
Diagnose misrouting caused by ambiguous or overlapping descriptions
Identify system prompt conflicts that override well-written tool descriptions
Create two MCP tools with intentionally ambiguous descriptions (e.g. get_customer: Retrieves customer information and lookup_order: Retrieves order details)

WHY: Reproducing a misrouting scenario first-hand builds intuition for why minimal descriptions fail. The exam tests your ability to identify ambiguous descriptions as the root cause of tool selection errors.

YOU SHOULD SEE: Two tool definitions registered with your MCP server, each having a single-sentence description that does not mention input formats, example queries, or boundaries.

Stuck? Get a nudge
Test with 10 queries covering different user intents and log which tool the model selects for each

WHY: Quantifying selection accuracy before and after description changes gives you concrete evidence of the impact. The exam expects you to know that description quality directly affects selection reliability.

YOU SHOULD SEE: A log showing at least 2-3 misrouted queries where the model selected get_customer for order-related queries or vice versa, demonstrating the ambiguity problem.

Stuck? Get a nudge
Rewrite both descriptions to include: purpose, expected inputs with formats, example queries, edge cases, and explicit boundaries against the other tool

WHY: This is the core exam skill — the lowest-effort, highest-leverage fix for misrouting. Production-grade descriptions include all five elements: purpose, inputs, examples, edge cases, and boundaries.

YOU SHOULD SEE: Each tool description is 3-5 sentences long, explicitly states accepted identifier formats, gives example queries, and includes a boundary statement like "Do NOT use for order-specific queries — use lookup_order for those."

Stuck? Get a nudge
Re-run the same 10 queries and compare selection accuracy before and after

WHY: Measuring improvement validates that description quality is the root cause. The exam expects you to understand that better descriptions produce measurably better selection without any architectural changes.

YOU SHOULD SEE: Selection accuracy improves to 9/10 or 10/10 correct, with previously misrouted queries now hitting the correct tool. A clear before/after comparison showing the improvement.

Stuck? Get a nudge
Review your system prompt for keyword-sensitive instructions that could override the improved descriptions

WHY: System prompt conflicts are a subtle failure mode the exam tests. Keywords like "always check customer details" can create unintended tool associations that override even well-written descriptions.

YOU SHOULD SEE: A list of any keyword-sensitive phrases in your system prompt that could trigger incorrect tool associations, along with rewritten versions that avoid the conflict.

Stuck? Get a nudge
Sources
Claude Certified Architect Foundations Exam Guide — Domain 2, Task Statement 2.1 — Anthropic
Tool use — Anthropic API Documentation — Anthropic
Model Context Protocol Specification — Tools — Model Context Protocol
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
Session State and Resumption
NEXT LESSON
Structured Error Responses