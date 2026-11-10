---
title: "D4: Terraform Configuration"
description: "Master HCL blocks, variable types, precedence rules, custom validation conditions, lifecycle meta-arguments, and sensitive/ephemeral data handling."
domain: "D4"
layout: "single"
---

Domain 4 is the largest domain on the exam, making up **20% (approx. 12 questions)**. It tests your ability to write clean, idiomatic HCL2 syntax, manipulate complex collections, enforce custom validation rules, orchestrate resource lifecycles, and handle sensitive attributes securely.

## What to practice

- Contrast `resource` blocks (create/manage infrastructure) with `data` blocks (read-only queries against existing infrastructure outside Terraform's lifecycle).
- Construct variable blocks with types (`string`, `number`, `bool`, `list`, `map`, `object`, `tuple`), default values, and enforce variable precedence rules (CLI flag > `-var-file` > `terraform.tfvars` > env vars `TF_VAR_*`).
- Define input variable custom `validation {}` blocks using boolean `condition` expressions and human-readable `error_message` strings (key 004 objective).
- Use built-in functions (`lookup`, `element`, `concat`, `merge`, `length`, `jsonencode`, `try`, `can`) and dynamic block constructs (`for_each`, `dynamic "content" {}`).
- Configure resource lifecycle meta-arguments: `create_before_destroy`, `prevent_destroy`, `ignore_changes`, and explicit dependency declarations (`depends_on`).
- Handle secret protection: mark input variables and outputs as `sensitive = true`, understand how sensitive values are masked in CLI logs but retained in state, and contrast with write-only/ephemeral arguments (004 additions).

---

[Read the study guides](/ai-certification-preparation/exams/terraform-associate/study-guides/) · [Practice D4 questions](/ai-certification-preparation/exams/terraform-associate/sample-questions/?domain=D4) · [All domains](/ai-certification-preparation/exams/terraform-associate/domains/)
