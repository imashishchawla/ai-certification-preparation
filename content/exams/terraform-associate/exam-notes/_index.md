---
title: "Exam Notes & Domain Cheat Sheets"
description: "High-yield exam notes, CLI cheat sheets, state command reference, and 004 delta breakdowns for the Terraform Associate (004) exam."
layout: "single"
---

Welcome to the **Exam Notes & Domain Cheat Sheets** section. These notes synthesize the essential CLI flags, lifecycle arguments, state operations, variable precedence orders, and 004-specific additions needed to pass the HashiCorp Certified Terraform Associate (004) exam.

---

## 1. Quick-Reference Domain Cheat Sheets

<div class="card-grid">
  <div class="question-card" style="border-left: 6px solid var(--accent);">
    <span class="tag">DOMAIN 1 · 8%</span>
    <h3>IaC Concepts & Multi-Cloud Notes</h3>
    <p>Declarative vs imperative paradigms, idempotency, state tracking, and cloud-agnostic provider abstractions.</p>
    <a href="/ai-certification-preparation/exams/terraform-associate/domains/d1/" class="btn" style="margin-top: 0.5rem; display: inline-block;">Read D1 Notes →</a>
  </div>

  <div class="question-card" style="border-left: 6px solid var(--accent);">
    <span class="tag">DOMAIN 2 · 12%</span>
    <h3>Fundamentals & Provider Notes</h3>
    <p>Provider block syntax, version constraints (`~>`, `>=`, `=`), provider aliases, and the `.terraform.lock.hcl` lock file.</p>
    <a href="/ai-certification-preparation/exams/terraform-associate/domains/d2/" class="btn" style="margin-top: 0.5rem; display: inline-block;">Read D2 Notes →</a>
  </div>

  <div class="question-card" style="border-left: 6px solid var(--accent);">
    <span class="tag">DOMAIN 3 · 18%</span>
    <h3>Core Workflow Notes</h3>
    <p>Init, validate, plan, apply, destroy, and fmt. Understand plan symbols (`+`, `~`, `-`, `-+/+`) and execution plan flags.</p>
    <a href="/ai-certification-preparation/exams/terraform-associate/domains/d3/" class="btn" style="margin-top: 0.5rem; display: inline-block;">Read D3 Notes →</a>
  </div>

  <div class="question-card" style="border-left: 6px solid var(--accent);">
    <span class="tag">DOMAIN 4 · 20%</span>
    <h3>Configuration & 004 Delta Notes</h3>
    <p>Variable precedence, custom variable validation (`validation {}`), lifecycle meta-arguments, and sensitive vs ephemeral handling.</p>
    <a href="/ai-certification-preparation/exams/terraform-associate/domains/d4/" class="btn" style="margin-top: 0.5rem; display: inline-block;">Read D4 Notes →</a>
  </div>

  <div class="question-card" style="border-left: 6px solid var(--accent);">
    <span class="tag">DOMAIN 5 · 12%</span>
    <h3>Modules & Encapsulation Notes</h3>
    <p>Registry vs Git sources, explicit variable passing, child module output referencing (`module.<name>.<output>`), and versioning.</p>
    <a href="/ai-certification-preparation/exams/terraform-associate/domains/d5/" class="btn" style="margin-top: 0.5rem; display: inline-block;">Read D5 Notes →</a>
  </div>

  <div class="question-card" style="border-left: 6px solid var(--accent);">
    <span class="tag">DOMAIN 6 · 16%</span>
    <h3>State Management & Locking Notes</h3>
    <p>Backend types, remote locking mechanisms, state drift detection, `terraform refresh`, and safe backend migration.</p>
    <a href="/ai-certification-preparation/exams/terraform-associate/domains/d6/" class="btn" style="margin-top: 0.5rem; display: inline-block;">Read D6 Notes →</a>
  </div>

  <div class="question-card" style="border-left: 6px solid var(--accent);">
    <span class="tag">DOMAIN 7 · 6%</span>
    <h3>Maintain & Operations Notes</h3>
    <p>CLI state commands (`list`, `show`, `rm`, `mv`), `terraform import` mechanics, and debugging levels with `TF_LOG`.</p>
    <a href="/ai-certification-preparation/exams/terraform-associate/domains/d7/" class="btn" style="margin-top: 0.5rem; display: inline-block;">Read D7 Notes →</a>
  </div>

  <div class="question-card" style="border-left: 6px solid var(--accent);">
    <span class="tag">DOMAIN 8 · 8%</span>
    <h3>HCP Terraform & Cloud Notes</h3>
    <p>Cloud workspaces vs CLI workspaces, project-level RBAC, VCS speculative plans, run triggers, and team governance.</p>
    <a href="/ai-certification-preparation/exams/terraform-associate/domains/d8/" class="btn" style="margin-top: 0.5rem; display: inline-block;">Read D8 Notes →</a>
  </div>
</div>

---

## 2. High-Yield Command & Delta Summaries

* ⚡ **Variable Precedence Order (Lowest to Highest)**: Environment variables (`TF_VAR_name`) → `terraform.tfvars` file → `*.auto.tfvars` (alphabetical) → CLI `-var` and `-var-file` flags.
* ⚡ **CLI Log Levels (`TF_LOG`)**: `TRACE` (most verbose) > `DEBUG` > `INFO` > `WARN` > `ERROR`. Setting `TF_LOG_PATH` directs logs to a file.
* ⚡ **004 New Objectives**: Variable `validation {}` block with `condition` and `error_message`; ephemeral values / write-only arguments; HCP Terraform Project hierarchies.
* ⚡ **State Command Golden Rule**: Never edit `terraform.tfstate` directly in a text editor; always manipulate items via `terraform state rm` or `terraform state mv`.
