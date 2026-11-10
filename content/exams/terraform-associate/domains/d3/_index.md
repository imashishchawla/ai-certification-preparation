---
title: "D3: Core Terraform Workflow"
description: "Master the core CLI cycle: init, validate, plan, apply, destroy, and fmt styling conventions."
domain: "D3"
layout: "single"
---

Domain 3 represents **18% (approx. 10 questions)** of the TA-004 exam. It evaluates your practical fluency with the primary CLI commands and their execution phases: initialization, syntax and type checking, speculative execution planning, infrastructure convergence, and teardown.

## What to practice

- Understand the sequence and responsibilities of the core workflow: Write → Init → Plan → Apply.
- Identify the exact actions performed during `terraform init`: downloading provider plugins, initializing child modules, and configuring the backend.
- Contrast `terraform validate` (static syntax and attribute validity check without remote API or state access) with `terraform plan` (state refresh and speculative execution graph generation).
- Understand execution plan mechanics: speculative changes (`+` create, `~` update in-place, `-` destroy, `-+/+` replace), saving plan files with `-out`, and passing approved plans to `terraform apply <planfile>`.
- Use `terraform destroy` safely, understand how dependency graphs order resource destruction, and use `terraform fmt` (`-check`, `-recursive`, `-diff`) for standard styling.

---

[Read the study guides](/ai-certification-preparation/exams/terraform-associate/study-guides/) · [Practice D3 questions](/ai-certification-preparation/exams/terraform-associate/sample-questions/?domain=D3) · [All domains](/ai-certification-preparation/exams/terraform-associate/domains/)
