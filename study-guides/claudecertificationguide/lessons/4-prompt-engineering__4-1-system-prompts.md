# 4.1 — System Prompts with Explicit Criteria | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/4-prompt-engineering/4-1-system-prompts

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
4.1
DOMAIN 4
TASK 4.1
Mark Complete
System Prompts with Explicit Criteria
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

The single biggest mistake in production prompt engineering is relying on vague instructions. "Be conservative." "Only report high-confidence findings." "Use your best judgement." None of these give the model an actionable decision boundary. They sound reasonable, which is exactly why the exam uses them as distractors.

The correct approach is explicit categorical criteria that define precisely what the model should flag and what it should skip. Compare these two system prompts for a CI/CD code review pipeline:

Wrong approach:

Copy
Review this code. Be conservative. Only report high-confidence findings.


Correct approach:

Copy
Flag comments only when claimed behaviour contradicts actual code behaviour.
Report bugs and security vulnerabilities.
Skip minor style preferences and local patterns.


The first gives the model no criteria to apply. "Conservative" means different things in different contexts, and "high-confidence" is a subjective threshold the model cannot calibrate. The second provides concrete categories: what to report (bugs, security), what to skip (style, local patterns), and a specific trigger for comment flags (claimed vs actual behaviour contradiction).

The False Positive Trust Problem

High false positive rates in one category destroy developer trust in all categories. The exam leans on this hard. If your "documentation mismatch" findings are wrong 40% of the time, developers stop reading your "security vulnerability" findings too, even when those run at 98% accuracy. Trust isn't category-specific. It bleeds across the whole output.

The fix feels backwards: temporarily disable the high false-positive categories while you rework their prompts. Trust in the categories that already work comes back straight away. Then you iterate on the broken category with concrete code examples, switching it back on only once precision improves.

You're not abandoning the category. You're putting system-wide trust ahead of category completeness.

Severity Calibration with Code Examples

Defining severity levels requires concrete code examples, not prose descriptions. Compare:

Prose description (insufficient):

Copy
Critical: Issues that could cause system failures or data loss
Minor: Issues that affect code readability but not functionality


Code example approach (correct):

Copy
Critical — Unsanitised user input in SQL query:
  query = f"SELECT * FROM users WHERE id = {user_input}"

Minor — Inconsistent variable naming:
  userName vs user_name in the same module


The prose description forces the model to interpret what "could cause system failures" means. The code example removes ambiguity entirely. When the model sees actual code patterns classified at each severity level, it produces consistent classification across invocations.

KEY CONCEPT

Explicit categorical criteria always outperform vague instructions. Define what to flag (bugs, security vulnerabilities) and what to skip (style preferences, local patterns) using concrete code examples for each severity level. Never rely on "be conservative" or confidence-based filtering.

Why Confidence-Based Filtering Fails

The exam frequently presents "only report high-confidence findings" as a tempting answer. It sounds like good engineering: filter by confidence, keep only the strong signals. But LLM self-reported confidence is poorly calibrated. The model is often sure about wrong findings and hesitant about right ones. Confidence scores earn their keep in routing (sending low-confidence findings to human review, as covered in Task Statement 4.6), but they're no substitute for explicit criteria that define what counts as a valid finding in the first place.

The hierarchy is: explicit criteria first, confidence-based routing second. Never skip the first step.

Exam Traps
EXAM TRAP

Choosing 'be conservative' or 'only report high-confidence findings' as valid prompt improvements

Vague instructions do not improve precision. The model has no actionable interpretation of 'conservative.' Specific categorical criteria defining exactly what to flag and what to skip are the correct approach.

EXAM TRAP

Assuming confidence thresholds fix false positive problems

LLM self-reported confidence is poorly calibrated. Explicit criteria with concrete code examples produce better results than confidence-based filtering. Confidence routing is useful but only after criteria are defined.

EXAM TRAP

Keeping all review categories active while iterating on high false-positive categories

High false positive rates in one category destroy trust in ALL categories. Temporarily disabling problematic categories while improving their prompts restores system-wide trust.

Practice Scenario

Your CI/CD code review pipeline has a 40% false positive rate on 'documentation mismatch' findings, causing developers to ignore ALL review categories including accurate security findings. What is the most effective fix?

OPTION A
Temporarily disable the documentation mismatch category while refining its prompts with explicit criteria and code examples
OPTION B
Increase the model temperature to produce more varied review runs, then filter out findings that appear only once
OPTION C
Add a second model pass that re-examines each documentation finding and discards any it cannot verify before the report reaches developers
OPTION D
Add "only report high-confidence documentation issues" to the system prompt so the model filters its own weaker findings
Check Answer
Build Exercise
BUILD EXERCISE
Build an Explicit Criteria Code Review Prompt
Difficulty
45 MINUTES

WHAT YOU'LL LEARN

Understand why vague instructions (be conservative, high-confidence only) fail in production prompts
Design explicit categorical criteria that define what to flag and what to skip
Calibrate severity levels using concrete code examples rather than prose descriptions
Measure false positive rates and apply the trust recovery strategy of disabling problematic categories
Recognise the hierarchy: explicit criteria first, confidence-based routing second
Write a system prompt with vague instructions (be conservative, only flag important issues) and test it against 5 code snippets containing known bugs, security issues, and style nitpicks

WHY: Establishing a baseline with vague instructions demonstrates the false positive problem the exam tests. You need empirical evidence that phrases like be conservative give the model no actionable decision boundary.

YOU SHOULD SEE: Inconsistent classification across the 5 snippets: some style nitpicks flagged as critical, some genuine bugs missed or marked minor, and different results if you run the same snippets twice.

Stuck? Get a nudge
Rewrite the prompt with explicit categorical criteria: define exactly which issues to report (bugs, security vulnerabilities) and which to skip (style preferences, local patterns)

WHY: Explicit categorical criteria are the correct approach tested on the exam. This step demonstrates that concrete categories eliminate the ambiguity that causes false positives.

YOU SHOULD SEE: The rewritten prompt has clear categories: report bugs and security vulnerabilities, skip style preferences and local patterns, flag comments only when claimed behaviour contradicts actual code behaviour.

Stuck? Get a nudge
Add concrete code examples for each severity level — critical, major, minor — showing actual code patterns, not prose descriptions

WHY: The exam specifically tests that code examples outperform prose descriptions for severity calibration. Prose like issues that could cause system failures forces the model to interpret, while code examples remove ambiguity entirely.

YOU SHOULD SEE: Your prompt now contains at least one code snippet per severity level, each showing the actual pattern that defines that severity, not a prose description of what that severity means.

Stuck? Get a nudge
Compare false positive rates between the two versions on the same test set and document which approach produces more consistent classification

WHY: Quantifying the improvement validates the explicit criteria approach and builds the evaluation skill the exam expects. You should be able to articulate why one approach outperforms the other with data, not intuition.

YOU SHOULD SEE: A clear reduction in false positives with the explicit criteria version. The vague prompt should produce 30-50% inconsistency while the explicit criteria version should be below 15%. Classification should be stable across repeated runs.

Stuck? Get a nudge
Temporarily disable any category with above 25% false positive rate and document the criteria refinements needed before re-enabling

WHY: The trust recovery strategy is a key exam concept: high false positive rates in one category destroy developer trust in ALL categories. Disabling problematic categories restores system-wide trust while you iterate on their criteria.

YOU SHOULD SEE: A document listing which categories exceed the 25% threshold, what specific criteria refinements are needed (e.g., add code examples for edge cases), and a re-enablement plan with target false positive rates.

Stuck? Get a nudge
Sources
Claude Certified Architect Foundations Exam Guide — Task Statement 4.1 — Anthropic
Prompt Engineering Overview — Anthropic
Building with Claude API (Skilljar) — Anthropic
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
CI/CD Integration
NEXT LESSON
Few-Shot Prompting