---
title: "Certified Kubernetes Administrator (CKA)"
description: "Exam guide, study materials, performance tasks, and hands-on practice for the Certified Kubernetes Administrator (CKA) certification."
layout: "single"
---

## Exam Specifications

| Specification | Value |
|---|---|
| **Exam code** | CKA (Certified Kubernetes Administrator) |
| **Questions / Tasks** | 15–20 performance-based hands-on tasks in live terminal clusters |
| **Testing time** | 120 minutes (2 hours) |
| **Total seat time** | About 135 minutes, including verification, check-in, and survey |
| **Passing Score** | 66% |
| **Exam Fee** | $395 USD (includes one free retake within 12 months) |
| **Provider** | Cloud Native Computing Foundation (CNCF) & The Linux Foundation |
| **Delivery Partner** | PSI (Remote live proctoring via browser-based terminal) |
| **Tested Version** | Active Kubernetes releases (v1.31 / v1.32) |

---

## Official Exam Domains & Weights

<div class="domains-row" style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin: 1.5rem 0;">
  <div style="flex: 1; min-width: 130px; padding: 0.85rem; border: 2px solid var(--border); background: var(--bg); text-align: center;">
    <div style="font-size: 1.8rem; font-weight: bold; font-family: var(--font-heading); color: var(--accent);">30%</div>
    <div style="font-size: 0.8rem; font-weight: bold; margin-top: 0.25rem;">D1 Troubleshooting</div>
    <div style="font-size: 0.72rem; color: var(--muted); margin-top: 0.25rem;">≈5–6 Tasks</div>
  </div>
  <div style="flex: 1; min-width: 130px; padding: 0.85rem; border: 2px solid var(--border); background: var(--bg); text-align: center;">
    <div style="font-size: 1.8rem; font-weight: bold; font-family: var(--font-heading); color: var(--accent);">25%</div>
    <div style="font-size: 0.8rem; font-weight: bold; margin-top: 0.25rem;">D2 Cluster Arch &amp; Install</div>
    <div style="font-size: 0.72rem; color: var(--muted); margin-top: 0.25rem;">≈4–5 Tasks</div>
  </div>
  <div style="flex: 1; min-width: 130px; padding: 0.85rem; border: 2px solid var(--border); background: var(--bg); text-align: center;">
    <div style="font-size: 1.8rem; font-weight: bold; font-family: var(--font-heading); color: var(--accent);">20%</div>
    <div style="font-size: 0.8rem; font-weight: bold; margin-top: 0.25rem;">D3 Services &amp; Network</div>
    <div style="font-size: 0.72rem; color: var(--muted); margin-top: 0.25rem;">≈3–4 Tasks</div>
  </div>
  <div style="flex: 1; min-width: 130px; padding: 0.85rem; border: 2px solid var(--border); background: var(--bg); text-align: center;">
    <div style="font-size: 1.8rem; font-weight: bold; font-family: var(--font-heading); color: var(--accent);">15%</div>
    <div style="font-size: 0.8rem; font-weight: bold; margin-top: 0.25rem;">D4 Workloads &amp; Sched</div>
    <div style="font-size: 0.72rem; color: var(--muted); margin-top: 0.25rem;">≈2–3 Tasks</div>
  </div>
  <div style="flex: 1; min-width: 130px; padding: 0.85rem; border: 2px solid var(--border); background: var(--bg); text-align: center;">
    <div style="font-size: 1.8rem; font-weight: bold; font-family: var(--font-heading); color: var(--accent);">10%</div>
    <div style="font-size: 0.8rem; font-weight: bold; margin-top: 0.25rem;">D5 Storage</div>
    <div style="font-size: 0.72rem; color: var(--muted); margin-top: 0.25rem;">≈1–2 Tasks</div>
  </div>
  <div style="flex: 1; min-width: 130px; padding: 0.85rem; border: 2px solid var(--accent); background: rgba(0,0,0,0.03); text-align: center;">
    <div style="font-size: 1.8rem; font-weight: bold; font-family: var(--font-heading); color: var(--fg);">100%</div>
    <div style="font-size: 0.8rem; font-weight: bold; margin-top: 0.25rem;">Total Exam</div>
    <div style="font-size: 0.72rem; color: var(--muted); margin-top: 0.25rem;">15–20 Tasks</div>
  </div>
</div>

---

## 1. Study Material

<div class="card-grid">
  <a href="/ai-certification-preparation/exams/cka/study-guides/" class="card">
    <span class="tag" style="background: var(--accent); color: var(--accent-contrast);">IN PREPARATION</span>
    <h3>Study Guides & Lessons</h3>
    <p>Comprehensive domain lessons covering cluster bootstrapping with kubeadm, etcd recovery, Ingress and Gateway API, and system diagnostics.</p>
  </a>

  <a href="/ai-certification-preparation/exams/cka/domains/" class="card">
    <span class="tag">5 DOMAIN PATHS</span>
    <h3>Explore the Five Domains</h3>
    <p>Targeted overviews for each of the 5 official CNCF exam domains, detailing core competencies, command flags, and what to practice.</p>
  </a>

  <a href="/ai-certification-preparation/exams/cka/exam-notes/" class="card">
    <span class="tag">NOTES & CHEATSHEETS</span>
    <h3>Exam Notes & kubectl Cheatsheet</h3>
    <p>High-yield kubectl imperative one-liners, JSONPath syntax patterns, etcdctl snapshot commands, and troubleshooting decision trees.</p>
  </a>

  <a href="/ai-certification-preparation/exams/cka/articles/" class="card">
    <span class="tag">ARTICLES & STRATEGY</span>
    <h3>Technical Articles</h3>
    <p>Exam time management strategies, terminal aliases and vim configurations, and real terminal scenario walkthroughs.</p>
  </a>

  <a href="/ai-certification-preparation/exams/cka/study-materials/" class="card">
    <span class="tag">OFFICIAL DOCS</span>
    <h3>Official Documents & References</h3>
    <p>Links to the authoritative CNCF curriculum repository, Kubernetes official documentation, and the Linux Foundation Candidate Handbook.</p>
  </a>

  <a href="/ai-certification-preparation/exams/cka/resources/" class="card">
    <span class="tag">RESOURCES & SCENARIOS</span>
    <h3>Resources & Anti-Patterns</h3>
    <p>Common Kubernetes production anti-patterns, broken cluster scenarios, and terminal survival playbooks.</p>
  </a>
</div>

---

## 2. Practice Library

<div class="card-grid">
  <a href="/ai-certification-preparation/exams/cka/sample-questions/" class="card" style="border-left: 6px solid var(--accent);">
    <span class="tag">IN PREPARATION</span>
    <h3>Sample Performance Tasks</h3>
    <p>Scenario-based Kubernetes administration challenges categorized across all 5 domains, with step-by-step imperative and declarative solutions.</p>
  </a>

  <a href="/ai-certification-preparation/exams/cka/mock-test/" class="card" style="border-left: 6px solid var(--focus-ring);">
    <span class="tag">TIMED PRACTICE</span>
    <h3>Timed Mock Exam (17 Tasks / 120M)</h3>
    <p>Simulate the live performance exam experience with 17 randomized scenario tasks and a 2-hour countdown timer.</p>
  </a>
</div>

<p class="muted" style="margin-top: 3rem; padding-top: 1rem; border-top: 1px dashed var(--border); font-size: 0.85rem;">Disclaimer: This is an unofficial, independent preparation handbook. Certified Kubernetes Administrator (CKA) is a registered trademark of The Linux Foundation. This site is not affiliated with or endorsed by The Linux Foundation or the CNCF.</p>
