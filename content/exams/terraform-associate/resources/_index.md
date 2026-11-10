---
title: "Resources, Anti-Patterns & Reference Guides"
description: "Terraform exam scenario breakdowns, common anti-patterns to avoid, state traps, and external reference guides."
layout: "single"
---

Welcome to the **Resources & Anti-Patterns** section. Learn key architecture anti-patterns and study exam scenario breakdowns to avoid common traps on the TA-004 exam.

---

## 1. Canonical Anti-Patterns & Pitfalls

<div class="card-grid">
  <div class="question-card" style="border-left: 6px solid #dc2626;">
    <span class="badge" style="background: #dc2626; color: #fff;">ANTI-PATTERN #1</span>
    <h3 style="margin-top: 0.5rem;">Committing State Files to Git</h3>
    <p>Storing <code>terraform.tfstate</code> in version control exposes plain-text secrets (passwords, private keys) and invites disastrous race conditions. Always configure an encrypted remote backend with locking.</p>
  </div>

  <div class="question-card" style="border-left: 6px solid #dc2626;">
    <span class="badge" style="background: #dc2626; color: #fff;">ANTI-PATTERN #2</span>
    <h3 style="margin-top: 0.5rem;">Ignoring or .gitignoring the Lock File</h3>
    <p>Omitting <code>.terraform.lock.hcl</code> from git leads to non-deterministic builds across team members and CI pipelines when upstream providers release breaking minor updates.</p>
  </div>

  <div class="question-card" style="border-left: 6px solid #dc2626;">
    <span class="badge" style="background: #dc2626; color: #fff;">ANTI-PATTERN #3</span>
    <h3 style="margin-top: 0.5rem;">Manual State File Tampering</h3>
    <p>Opening <code>terraform.tfstate</code> in a text editor to delete or rename resources corrupts JSON serial numbers and state line schemas. Always use <code>terraform state rm</code> or <code>terraform state mv</code>.</p>
  </div>

  <div class="question-card" style="border-left: 6px solid #dc2626;">
    <span class="badge" style="background: #dc2626; color: #fff;">ANTI-PATTERN #4</span>
    <h3 style="margin-top: 0.5rem;">Monolithic Single-Root Configurations</h3>
    <p>Defining an entire multi-tier enterprise architecture in a single root module causes bloated dependency graphs, extreme plan latency, and high blast radius on failure. Break configs into modular workspaces.</p>
  </div>
</div>

---

## 2. Reference Guides & Practice Links

* 📚 [HashiCorp Certified: Terraform Associate (004) Objectives](/ai-certification-preparation/exams/terraform-associate/study-materials/) — Official objectives list.
* ⚡ [Domain Summaries & Cheat Sheets](/ai-certification-preparation/exams/terraform-associate/exam-notes/) — High-yield exam notes for all 8 domains.
* 🎯 [Sample Practice Questions](/ai-certification-preparation/exams/terraform-associate/sample-questions/) — Practice questions filtered by domain.
* ⏱️ [Timed Mock Test Simulator](/ai-certification-preparation/exams/terraform-associate/mock-test/) — Full 57-question, 60-minute simulated exam environment.
