---
title: "Blog Claude Certified Architect Foundations Exam Guide"
meta: "ClaudeCertificationGuide lesson"
tags: ["study", "claudecertificationguide"]
---

# Claude Certified Architect (Foundations): Exam Guide and Blueprint | Claude Certification Guide

> source: https://claudecertificationguide.com/blog/claude-certified-architect-foundations-exam-guide

JOURNAL
/
CLAUDE CERTIFIED ARCHITECT (FOUNDATIONS): EXAM GUIDE AND BLUEPRINT
Claude Certified Architect (Foundations): Exam Guide and Blueprint
Claude Certification Guide
·
24 July 2026
·
8 min read

The Claude Certified Architect (Foundations) exam, code CCAR-F, is the certification this site was built around and the one you can prepare for in full, for free, today. It's aimed at solution architects who design and implement production applications with Claude, and it's the only one of Anthropic's four certifications that is scenario-based. That format tells you a lot about what it's really testing: not whether you've memorised the docs, but whether you can make the right architectural call when a realistic situation puts several plausible options in front of you.

This is the blueprint. If you want the week-by-week study plan and the specific traps, read the companion study guide after this.

The format: four scenarios from a bank of six

Most certification exams throw isolated questions at you. Architect (Foundations) works differently. You're presented with four scenarios drawn from a bank of six, and the questions attach to those scenarios. The six are:

Customer Support Resolution Agent
Code Generation with Claude Code
Multi-Agent Research System
Developer Productivity with Claude
Claude Code for Continuous Integration
Structured Data Extraction

Because you don't know which four you'll get, there's no shortcut. You have to be comfortable reasoning about all six. Each one is a small production design problem, and the exam wants to see whether you'd build it the way an experienced architect would.

The rest of the mechanics match the wider programme: 60 items, 120 minutes, a scaled score of 720 on a 100 to 1,000 scale to pass, and a credential valid for 12 months. The guide is Version 1.0, effective July 2026.

Who it's for

The target candidate is a solution architect who has actually shipped things with Claude, not someone who has only read about it. The guide describes roughly six months of practical experience across the Claude APIs, the Agent SDK, Claude Code, and MCP. In practice that means you've written multi-agent orchestration with subagent delegation, configured Claude Code with CLAUDE.md and Agent Skills, designed MCP tools and resources, prompted for structured output, and wired Claude into CI/CD with sensible escalation and reliability patterns.

If that sounds like your job, this is your exam. If you're earlier in the journey, the free curriculum below closes the gap faster than you'd expect.

The five domains

The weighting is uneven, and it rewards you to know where the marks are.

Domain	Weight	What it tests
Agentic Architecture & Orchestration	27%	Agentic loops, orchestration patterns, guardrails, the Agent SDK
Claude Code Configuration & Workflows	20%	Settings hierarchy, CLAUDE.md, hooks, permissions, CI/CD
Prompt Engineering & Structured Output	20%	System prompts, few-shot patterns, output validation
Tool Design & MCP Integration	18%	Tool schemas, MCP servers and clients, tool routing
Context Management & Reliability	15%	Context windows, caching, long conversations, reliability

Domain 1 alone is over a quarter of the exam. Agentic architecture and orchestration is where the most questions live and where candidates most often bleed marks, usually by mishandling the agentic loop or reaching for a complex fix when a simple one was on offer. If your study time is limited, weight it here first.

The one pattern that runs through the whole exam

Across every domain, the exam favours the simplest fix that works. When a scenario describes a tool being called at the wrong moment, the answer is almost always "write a clearer tool description," not "add a routing classifier." When output is inconsistent, it's usually "give the model explicit, measurable criteria," not "bolt on another model to check the first one." Learn to spot the answer that solves the stated problem with the least machinery, and you'll pick correctly far more often than not.

How to prepare, for free

This is the cert with the complete free curriculum behind it:

The full curriculum covers all five domains across 30 lessons, each with an explanation, an exam trap, a practice scenario, and a build exercise.
The diagnostic is a short test that pinpoints which domains you're weakest in before you sink hours into revision.
The mock exam runs at the real exam's pace, with weighted scoring out of 1,000 and the same 720 pass mark, so a practice score means something.
Quick-reference sheets give you one page per domain for last-minute review.

For the study strategy that pulls all of this together, week by week, read the complete study guide.

Where this sits in the programme

Architect (Foundations) is one of four Claude certifications. It's the design-focused Foundations exam. If your work runs deeper into governance, stakeholder management, and owning a production system end to end, the Architect (Professional) tier is built for that. Neither requires the other first.

Ready to find out where you stand? Take the diagnostic, then work through Domain 1. When you feel solid, sit a full mock exam.

This is an independent community resource, not affiliated with or endorsed by Anthropic.

Related articles
10 MIN READ
Anthropic's Claude Certifications: All Four Exams Explained (2026)

Anthropic's Claude Certification Program now spans four exams. Here's what each one tests, who it's for, and how to choose the right track.

24 JULY 2026
12 MIN READ
How to Pass the Claude Certified Architect Exam: Complete Study Guide

A practical, no-filler guide to the Claude Certified Architect (Foundations) exam. Covers all 5 domains, weighted study strategy, common traps, and the resources that actually matter.

18 MARCH 2026
8 MIN READ
Claude Certified Architect (Professional): Exam Guide and Blueprint

The Claude Certified Architect (Professional) exam: seven domains, senior audience, governance and lifecycle focus, and how it differs from Foundations.

24 JULY 2026