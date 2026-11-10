---
title: "Resources & Kubernetes Anti-Patterns"
description: "Key Kubernetes production anti-patterns, troubleshooting gotchas, and scenario breakdowns for CKA candidates."
layout: "single"
---

Welcome to the **Resources & Anti-Patterns** section. In performance exams, avoiding common operational pitfalls saves valuable minutes.

---

## 1. Canonical Kubernetes Anti-Patterns & Pitfalls

<div class="card-grid">
  <div class="question-card" style="border-left: 6px solid #dc2626;">
    <span class="badge" style="background: #dc2626; color: #fff;">ANTI-PATTERN #1</span>
    <h3 style="margin-top: 0.5rem;">Forgetting to Drain Before Node Maintenance</h3>
    <p>Upgrading or rebooting a worker node without first running <code>kubectl drain &lt;node&gt; --ignore-daemonsets</code> causes sudden pod terminations, dropped client connections, and pod eviction stalls.</p>
  </div>

  <div class="question-card" style="border-left: 6px solid #dc2626;">
    <span class="badge" style="background: #dc2626; color: #fff;">ANTI-PATTERN #2</span>
    <h3 style="margin-top: 0.5rem;">Misaligned Service TargetPort &amp; ContainerPort</h3>
    <p>Defining a Service where <code>spec.ports[].targetPort</code> does not match the actual listening port of the pod container causes silent routing drops while pods appear healthy.</p>
  </div>

  <div class="question-card" style="border-left: 6px solid #dc2626;">
    <span class="badge" style="background: #dc2626; color: #fff;">ANTI-PATTERN #3</span>
    <h3 style="margin-top: 0.5rem;">Missing Namespaces in kubectl Contexts</h3>
    <p>Executing commands without verifying the task's required namespace or active cluster context. Always inspect task headers for the specified namespace (e.g. <code>-n marketing</code>) and context (e.g. <code>kubectl config use-context cluster1</code>).</p>
  </div>

  <div class="question-card" style="border-left: 6px solid #dc2626;">
    <span class="badge" style="background: #dc2626; color: #fff;">ANTI-PATTERN #4</span>
    <h3 style="margin-top: 0.5rem;">Writing YAML from Scratch</h3>
    <p>Hand-crafting YAML manifests by memory under tight exam time pressure invites indentation errors. Always use imperative generators (<code>kubectl create ... --dry-run=client -o yaml</code>) or copy examples from the allowed official docs.</p>
  </div>
</div>

---

## 2. Reference Guides & Practice Links

* 📚 [CNCF Official CKA Curriculum & Documents](/ai-certification-preparation/exams/cka/study-materials/) — Official objectives list.
* ⚡ [CKA Exam Notes & Cheatsheet](/ai-certification-preparation/exams/cka/exam-notes/) — High-yield commands and quick references.
* 🎯 [Sample Performance Tasks](/ai-certification-preparation/exams/cka/sample-questions/) — Scenario challenges with step-by-step walkthroughs.
* ⏱️ [Timed Mock Exam Simulator](/ai-certification-preparation/exams/cka/mock-test/) — 17-task, 120-minute timed environment.
