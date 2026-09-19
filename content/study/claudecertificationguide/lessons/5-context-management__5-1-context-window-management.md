---
title: "5 Context Management__5 1 Context Window Management"
meta: "ClaudeCertificationGuide lesson"
tags: ["study", "claudecertificationguide"]
---

# 5.1 — Context Window Management | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/5-context-management/5-1-context-window-management

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
05
Context Management & Reliability
5.1
Context Window Management
5.2
Escalation & Ambiguity Resolution
5.3
Error Propagation in Multi-Agent Systems
5.4
Codebase Exploration & Context Degradation
5.5
Human Review & Confidence Calibration
5.6
Information Provenance & Multi-Source Synthesis

PRACTICE

Build Exercises
Diagnostic Test

LOOK UP

Quick Reference
Glossary
LEARN
/
CONTEXT MANAGEMENT & RELIABILITY
/
5.1
DOMAIN 5
TASK 5.1
Mark Complete
Context Window Management
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

Context window management is the foundation of reliable Claude-based systems. Every multi-turn conversation, every multi-agent pipeline, every long-document extraction task depends on what you let into the context window. Get it wrong and the failures are concrete: your support agent forgets refund amounts, your research pipeline drops citations, your extraction system loses precision on the fields that matter most.

The Progressive Summarisation Trap

When conversations grow long, a common strategy is to summarise earlier turns to free up token budget. This is a trap. Progressive summarisation systematically destroys the most critical information in customer-facing and data-processing systems: numerical values, dates, percentages, and customer-stated expectations.

Here is how it plays out. A customer contacts support about a refund:

Copy
Turn 3: "I'd like a refund of $247.83 for order #8891 placed on March 3rd"


After summarisation, this becomes:

Copy
Summary: "Customer wants a refund for a recent order"


The amount, order number, and date — the three facts the agent needs to process the refund — are gone. And that is not a fringe case. It is what summarisation does to transactional data by default.

The fix: persistent case facts blocks. Extract transactional facts (amounts, dates, order numbers, statuses) into a structured block that is included in every prompt, outside the summarised history. This block is never summarised. It persists across every turn regardless of what happens to the conversation history.

JSON
Copy
{
  "caseFactsBlock": {
    "customerId": "C-4421",
    "issues": [
      {
        "orderId": "#8891",
        "orderDate": "2024-03-03",
        "refundAmount": "$247.83",
        "status": "pending_refund",
        "itemDescription": "Wireless headphones — defective"
      }
    ]
  }
}


For multi-issue sessions where a customer raises several problems in one conversation, extract and persist structured issue data into a separate context layer. Each issue gets its own entry with order IDs, amounts, and statuses. This prevents cross-contamination between issues during summarisation.

The "Lost in the Middle" Effect

Models process information at the beginning and end of long inputs reliably. Findings buried in the middle of a long context may be missed or given less weight. This is a well-documented phenomenon in large language models and it directly affects how you structure aggregated inputs.

The fix is structural, not prompt-based. Place key findings summaries at the beginning of aggregated inputs. Organise detailed results with explicit section headers throughout. If you are feeding a synthesis agent the output of three research subagents, start with a "Key Findings Summary" section, then provide the detailed outputs with clear section boundaries.

Copy
## Key Findings Summary
- Source A: 12% market growth in renewable sector (2023)
- Source B: Patent filings increased 34% year-on-year
- Source C: Regulatory framework delayed until Q3 2025

## Detailed Findings

### Source A: Market Analysis Report
[Full details here...]

### Source B: Patent Database Analysis
[Full details here...]

### Source C: Regulatory Review
[Full details here...]

Tool Result Trimming

Tool results are a silent context budget killer. An order lookup might return 40+ fields: internal audit timestamps, warehouse codes, shipping carrier IDs, fulfilment centre identifiers, and dozens of other fields irrelevant to the customer's refund request. You need 5 fields. Those other 35 fields consume tokens in every subsequent turn as the conversation history grows.

Trim verbose tool outputs to only relevant fields before they accumulate in context. Skip it and multi-turn systems slowly drown in stale tool output. It is not a nice-to-have.

PYTHON
Copy
def trim_order_result(raw_result, relevant_fields=None):
    if relevant_fields is None:
        relevant_fields = [
            "order_id", "order_date", "total_amount",
            "return_eligible", "item_description"
        ]
    return {k: v for k, v in raw_result.items() if k in relevant_fields}


This trimming should happen in a PostToolUse hook or in the tool implementation itself, before the result enters the conversation history. Once verbose data is in the context, it stays there for every subsequent turn.

Full Conversation History

The Claude API is stateless. Each request must include the complete conversation history. Omit earlier messages and the model loses conversational coherence. There's no session state on the server side, so every turn has to carry everything the model needs to follow the conversation.

This creates a tension with context limits: you need the full history for coherence, but the history grows with every turn. The persistent case facts block resolves this by separating critical facts from summarisable narrative, letting you summarise the conversation flow while preserving every transactional detail.

Upstream Agent Optimisation

In multi-agent systems, upstream agents often return verbose reasoning chains and raw content that downstream agents do not need. When a research subagent sends its full thought process to a synthesis agent with a limited context budget, the synthesis agent wastes tokens on reasoning it cannot use.

Modify upstream agents to return structured data — key facts, citations, relevance scores — instead of verbose content and reasoning chains. Require subagents to include metadata (dates, source locations, methodological context) in structured outputs to support accurate downstream synthesis.

JSON
Copy
{
  "findings": [
    {
      "claim": "Renewable energy investment grew 12% in 2023",
      "source": "IEA World Energy Report 2024",
      "sourceUrl": "https://example.com/report",
      "relevanceScore": 0.92,
      "publicationDate": "2024-01-15"
    }
  ]
}


Tokens aren't the only win here. Structured outputs from upstream agents let downstream agents process findings without re-parsing verbose prose.

KEY CONCEPT

The persistent case facts block is the single most important pattern in context window management. Extract transactional facts (amounts, dates, order numbers) into a structured block that is included in every prompt and never summarised. This is the fix for progressive summarisation and the foundation for reliable multi-turn systems.

Prompt Caching

Prompt caching is the other half of context economics. Instead of trimming what the model sees, you avoid paying to reprocess the parts that don't change. Mark a stable prefix with a cache_control breakpoint and the API stores that processed prefix, then reuses it on the next request, charging a fraction of the input cost for the cached tokens.

Caching matches from the start of the prompt, prefix by prefix, so layout decides whether you get a hit. Put the content that stays constant first: system instructions, tool definitions, long reference documents. Place the cache_control breakpoint at the end of that static block. Put the volatile content, the user's latest message and anything that changes per request, after the breakpoint.

The static block belongs in the top-level system parameter, not in messages. There is no "system" role for input messages in the Messages API — messages takes "user" and "assistant" turns only.

PYTHON
Copy
response = client.messages.create(
    model="claude-sonnet-5",
    max_tokens=4096,
    system=[
        {"type": "text", "text": LONG_STATIC_INSTRUCTIONS},
        {"type": "text", "text": REFERENCE_DOC,
         "cache_control": {"type": "ephemeral"}},
    ],
    messages=[
        {"role": "user", "content": dynamic_user_message},
    ],
)


Get the order wrong and you lose the benefit entirely. If dynamic content sits before the static block, the prefix changes on every request, nothing matches, and every call pays full price. An ephemeral breakpoint lasts about five minutes since last use; a {"type": "ephemeral", "ttl": "1h"} breakpoint lasts an hour at a higher write cost. A request may carry at most four breakpoints.

SCOPE

The guide's out-of-scope list excludes "prompt caching implementation details (beyond knowing it exists)", so nothing beyond the existence and purpose of caching is tested. The mechanics above are here for real work, not for the exam.

Exam Traps
EXAM TRAP

Thinking progressive summarisation is safe for transactional data

Summarisation systematically destroys numerical values, dates, and specific identifiers. A persistent case facts block must hold these outside summarised history.

EXAM TRAP

Assuming the 'lost in the middle' effect is solved by telling the model to pay attention to everything

The fix is structural: place key findings at the beginning of inputs and use explicit section headers. Prompt-based reminders are unreliable for position effects.

EXAM TRAP

Keeping full tool results in context because 'the model might need them later'

Untrimmed tool results from 40+ field lookups exhaust the token budget across turns. Trim to relevant fields before results enter the conversation history.

EXAM TRAP

Believing conversation history can be selectively truncated without consequences

The API is stateless. Each request needs complete conversation history. Selective truncation breaks conversational coherence. Use case facts blocks and summarisation instead of truncation.

Practice Scenario

A customer support agent handles a multi-issue session. After several turns, the agent refers to 'your recent refund request' instead of the specific $247.83 refund for order #8891. The conversation history is being summarised between turns to manage context length. What is the most effective fix?

OPTION A
Instruct the model to preserve all numerical values verbatim whenever it summarises the conversation history
OPTION B
Extract transactional facts (amounts, dates, order numbers) into a persistent case facts block included in every prompt, outside summarised history
OPTION C
Store the full conversation history in an external database and retrieve the relevant turns on demand whenever the agent needs to recall an earlier detail
OPTION D
Increase the context window size so the full conversation history fits and summarisation never needs to run
Check Answer
Build Exercise
BUILD EXERCISE
Build a Persistent Case Facts Context Manager
Difficulty
45 MINUTES

WHAT YOU'LL LEARN

Implement the persistent case facts block pattern to protect transactional data from summarisation
Trim verbose tool results to relevant fields before they accumulate in context
Recognise and mitigate the progressive summarisation trap for numerical values, dates, and identifiers
Apply the lost-in-the-middle mitigation by placing key findings at the beginning of aggregated inputs
Understand that the Claude API is stateless and each request must include complete conversation history
Create a case facts extractor that identifies transactional data (amounts, dates, order numbers, statuses) from tool results

WHY: The persistent case facts block is the single most important pattern in context window management. Extracting transactional facts into a structured block that is never summarised prevents the progressive summarisation trap from destroying critical numerical values and identifiers.

YOU SHOULD SEE: A function that takes raw tool output and returns a structured object containing only the transactional facts: customer ID, order numbers, amounts, dates, and statuses. Non-transactional narrative content should be excluded.

Stuck? Get a nudge
Implement a persistent case facts block that is prepended to every prompt, outside summarised history

WHY: The case facts block must persist across every turn regardless of what happens to the conversation history. It sits outside the summarised portion of the context, ensuring amounts, dates, and order numbers survive even when earlier conversation turns are compressed.

YOU SHOULD SEE: A prompt construction function that always includes the case facts block at the top of every message, followed by any summarised history, followed by the current turn. The case facts block should be clearly delimited with a section header.

Stuck? Get a nudge
Build a tool result trimmer that filters order lookup responses from 40+ fields to only the 5 relevant return-related fields

WHY: Untrimmed tool results are a silent context budget killer. An order lookup returning 40+ fields consumes tokens in every subsequent turn as conversation history grows. Trimming to relevant fields before results enter context is essential, not optional.

YOU SHOULD SEE: A trimming function that takes a raw tool result object and returns only the fields needed for the current task. The trimmed result should be 80-90% smaller than the original.

Stuck? Get a nudge
Test with a multi-turn conversation where summarisation occurs and verify that transactional facts survive intact across all turns

WHY: This validates that the persistent case facts pattern actually works. The exam tests whether you understand that progressive summarisation destroys specific amounts and dates, and the case facts block is the fix. You need to verify this empirically.

YOU SHOULD SEE: A 6-8 turn conversation where summarisation occurs after turn 4. After summarisation, the agent should still reference the exact refund amount ($247.83), order number (#8891), and date (March 3rd) from the case facts block. Without the block, these values would be lost to summarisation.

Stuck? Get a nudge
Add key findings placement logic that positions summaries at the beginning of aggregated inputs to mitigate the lost-in-the-middle effect

WHY: Models process information at the beginning and end of long inputs reliably, but findings buried in the middle may be missed. Placing key findings summaries at the start of aggregated inputs is a structural fix for this well-documented phenomenon.

YOU SHOULD SEE: An aggregation function that places a Key Findings Summary section at the top of combined inputs, followed by detailed results with explicit section headers. The key findings should be concise bullet points drawn from the detailed content.

Stuck? Get a nudge
Sources
Claude Certified Architect Foundations Exam Guide — Domain 5, Task Statement 5.1 — Anthropic
Anthropic API Documentation — Messages — Anthropic
Anthropic Prompt Engineering — Long Context Tips — Anthropic
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
Multi-Instance and Multi-Pass Review
NEXT LESSON
Escalation & Ambiguity Resolution