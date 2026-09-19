# 1.1 — Agentic Loops | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/1-agentic-architecture/1-1-agentic-loops

STUDY TOOLS

Progress Dashboard
Drill Mode

CURRICULUM

01
Agentic Architecture & Orchestration
1.1
Agentic Loops
1.2
Multi-Agent Orchestration
1.3
Subagent Invocation and Context Passing
1.4
Workflow Enforcement and Handoff
1.5
Agent SDK Hooks
1.6
Task Decomposition Strategies
1.7
Session State and Resumption
02
Tool Design & MCP Integration
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
AGENTIC ARCHITECTURE & ORCHESTRATION
/
1.1
DOMAIN 1
TASK 1.1
Mark Complete
Agentic Loops
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

An agentic loop is the core execution cycle behind every Claude-based agent. It's deterministic control flow, defined in code. Not a prompt trick, not a retry loop, not a chatbot turn. Get this lifecycle right and most of Domain 1 falls into place; get it wrong and your agent stops halfway through a task in production.

The Agentic Loop Lifecycle

The loop follows four steps, repeated until completion:

Send a request to Claude via the Messages API. This includes the conversation history (system prompt, prior messages, and any tool results from the previous iteration).

Inspect the stop_reason field in the response. This field is the authoritative signal for what happens next. It has two values relevant to agentic loops:

"tool_use" — Claude wants to call one or more tools. The loop continues.
"end_turn" — Claude has finished its work. The loop terminates.

If stop_reason is "tool_use": execute the requested tool(s), append the tool results to the conversation history as a new message, and send the updated conversation back to Claude.

If stop_reason is "end_turn": the agent has finished. Present the final response to the user.

Step 3 is where loops break. Tool results must be appended to conversation history. Miss that, and Claude can't reason about the new information on the next iteration — the model never sees what the tool returned, so it has nothing new to act on.

KEY CONCEPT

The stop_reason field is the only reliable signal for loop control. It is deterministic and unambiguous. Never use natural language parsing, text content checks, or arbitrary iteration caps as your primary stopping mechanism.

CURRENT STATE: BEYOND THE TWO EXAM VALUES

The exam guide (v1.0) keys tool_use and end_turn, the two values a basic loop branches on. The live Messages API returns others that a production loop must handle: pause_turn (continue a long-running server-tool turn), max_tokens, stop_sequence, refusal (current models such as Fable 5 can decline on an otherwise-normal 200 response), and model_context_window_exceeded (the response filled the model's context window; handle it like max_tokens truncation). Treat any value other than end_turn as "not finished, check why" rather than assuming tool_use. (Verified against the Messages API docs, July 2026.)

Model-Driven Decision-Making

In an agentic loop, Claude decides which tool to call from the current context. That's model-driven decision-making — the model reads the task, weighs the available tools, and picks one. Compare that to pre-configured decision trees or fixed tool sequences, where the developer hard-codes which tool runs when.

The exam favours model-driven approaches because they flex. Claude adapts to situations the developer never mapped out, handles edge cases, and chains tools in orders nobody planned. There's one exception worth memorising: when business logic demands deterministic compliance — financial operations, security checks, regulatory requirements — programmatic enforcement overrides that flexibility. Task Statement 1.4 covers this in detail.

The Three Anti-Patterns

Three anti-patterns show up again and again for loop termination. Learn to spot all three.

Anti-Pattern 1: Parsing natural language signals. Checking if Claude said "I'm done" or "task complete" to determine whether the loop should end. This is wrong because natural language is inherently ambiguous. Claude might say "I've finished analysing the first file" while intending to continue with more files. The stop_reason field exists precisely to eliminate this ambiguity.

Anti-Pattern 2: Arbitrary iteration caps as the primary stopping mechanism. Setting "stop after 10 loops" as the main way to terminate the agent. This is wrong because it either cuts off useful work (if the task genuinely needs 12 iterations) or runs unnecessary iterations (if the task finishes in 3). The model signals completion via stop_reason — use that signal. Iteration caps are acceptable as a safety net (a maximum bound to prevent runaway agents), but never as the primary control mechanism.

Anti-Pattern 3: Checking for assistant text content as a completion indicator. Using response.content[0].type == "text" to decide the loop is finished. This is wrong because Claude can return text alongside tool_use blocks. A response might contain explanatory text ("I'll now search for the customer's order history") immediately followed by a tool call. Checking for text presence does not tell you whether the agent is finished.

COMMON EXAM DISTRACTOR

The exam frequently presents iteration caps as a plausible fix for premature termination. Reject these answers. Caps address runaway loops, not premature exits. The fix for premature termination is always to check stop_reason correctly.

Practical Example: The Premature Termination Bug

A developer builds a customer support agent. It works for simple queries but sometimes stops mid-task on complex requests. The code checks if response.content[0].type == "text" to determine completion.

The bug: Claude returns a text explanation ("Let me look up your order") alongside a tool_use block requesting the lookup_order tool. The code sees text in position [0], concludes the agent is finished, and returns the incomplete response to the user.

The fix: replace the content-type check with a stop_reason check. Continue the loop when stop_reason == "tool_use", terminate when stop_reason == "end_turn". This works regardless of what content types appear in the response.

Exam Traps
EXAM TRAP

Using response.content[0].type == 'text' to determine loop completion

Claude can return text alongside tool_use blocks in the same response. Text presence does not indicate completion. The stop_reason field is the authoritative signal.

EXAM TRAP

Setting arbitrary iteration caps (e.g., 'stop after 10 loops') as the primary stopping mechanism

Iteration caps either cut off useful work or run unnecessary iterations. They are acceptable as a safety net, not as the primary loop control. Use stop_reason instead.

EXAM TRAP

Parsing natural language phrases like 'I'm done' or 'task complete' to decide loop termination

Natural language is ambiguous and unreliable. The stop_reason field provides a deterministic, unambiguous signal for loop control.

EXAM TRAP

Forcing tool_choice to 'any' to prevent the agent from returning text

This forces tool use even when the agent is genuinely finished, creating an infinite loop. The correct approach is to let the model signal completion naturally via stop_reason.

Practice Scenario

A developer's agent sometimes terminates prematurely when Claude returns text alongside a tool call. Their loop checks response.content[0].type == 'text' to determine if the agent is finished. Users report incomplete responses on complex queries. What should the developer change?

OPTION A
Add an iteration cap of 15 loops to ensure the agent runs long enough for complex queries
OPTION B
Check the stop_reason field instead of content type — continue when stop_reason is tool_use, terminate when end_turn
OPTION C
Set tool_choice to any so Claude always calls a tool instead of returning text
OPTION D
Parse the assistant text for completion phrases like I have finished before terminating the loop
Check Answer
Build Exercise
BUILD EXERCISE
Build a Multi-Tool Agent Loop
Difficulty
45 MINUTES

WHAT YOU'LL LEARN

How the agentic loop lifecycle works with the Messages API
Why stop_reason is the authoritative signal for loop control
How to handle tool_use and end_turn stop_reason values correctly
How to append tool results to conversation history for multi-turn execution
When safety iteration caps are appropriate versus inappropriate as stopping mechanisms
Set up a Claude API client with two tools: a calculator tool (accepts expression, returns result) and a web search stub (accepts query, returns mock results)

WHY: Multi-tool setups expose model-driven decision-making — Claude must select the right tool based on context, which is core to agentic architecture.

YOU SHOULD SEE: Two tool definitions registered with proper JSON Schema input_schema, each with name, description, and parameters.

Stuck? Get a nudge
Implement the agentic loop that sends requests to Claude and inspects stop_reason after each response

WHY: The agentic loop is the core execution pattern — the exam tests whether you use stop_reason (deterministic) versus content-type checks or natural language parsing (unreliable).

YOU SHOULD SEE: A while loop that calls client.messages.create() and checks response.stop_reason after each iteration.

Stuck? Get a nudge
Handle the tool_use stop_reason by executing the requested tool, creating a tool result message, and appending it to conversation history

WHY: This is the critical handoff in the loop — the exam specifically tests whether you correctly extract tool calls, execute them, and return results in the right message format.

YOU SHOULD SEE: When Claude requests a tool, your code extracts the tool_use block, runs the corresponding function, and appends both the assistant response and a user message with tool_result to the conversation.

Stuck? Get a nudge
Handle the end_turn stop_reason by extracting and returning the final response

WHY: end_turn is Claude signal that it has completed the task — extracting the final text response correctly closes the loop and returns the result to the user.

YOU SHOULD SEE: When stop_reason is end_turn, your loop exits and returns the text content from the final response.

Stuck? Get a nudge
Test with a prompt that requires multiple sequential tool calls (e.g., search for a value then calculate something with it) and verify the loop continues correctly through all iterations

WHY: Sequential tool calls test the full loop lifecycle — the agent must complete one tool call, receive the result, reason about it, and decide to call another tool before finally returning.

YOU SHOULD SEE: At least two tool call iterations before end_turn. The agent searches first, uses the search result in a calculation, then returns the combined answer.

Stuck? Get a nudge
Add a safety iteration cap of 20 as a maximum bound (not the primary stopping mechanism) and log a warning if it triggers

WHY: The exam distinguishes safety caps (acceptable as a fallback) from using caps as the primary stopping mechanism (an anti-pattern). Your cap should never trigger in normal operation.

YOU SHOULD SEE: A MAX_ITERATIONS constant, a counter that increments each loop, and a warning log if the cap is hit. Normal queries should terminate via stop_reason well before reaching 20.

Stuck? Get a nudge
Sources
Claude Agent SDK Overview — Anthropic
Messages API Reference — Anthropic
Building with Claude API (Skilljar) — Anthropic
Drill This Domain
Quick Reference
Mark Complete
NEXT LESSON
Multi-Agent Orchestration