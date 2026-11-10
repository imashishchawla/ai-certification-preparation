---
title: "D2: Terraform Fundamentals"
description: "Master provider architecture, plugin installation, version constraint operators, and state fundamentals."
domain: "D2"
layout: "single"
---

Domain 2 represents **12% (approx. 7 questions)** of the TA-004 exam. It covers Terraform's provider plugin architecture, how `terraform init` locates and caches provider binaries, version constraints in `terraform.required_providers`, and multi-provider configurations (aliases).

## What to practice

- Install and version Terraform providers via `required_providers` blocks using exact (`=`), pessimistic (`~>`), and comparison (`>=`, `<=`) constraints.
- Explain how the dependency lock file (`.terraform.lock.hcl`) locks provider checksums and why it must be committed to version control.
- Write Terraform configuration using provider aliases to deploy resources to multiple cloud regions or target distinct accounts within one project.
- Explain the foundational role of Terraform state: mapping declared resources to real-world infrastructure and caching provider metadata.

---

[Read the study guides](/ai-certification-preparation/exams/terraform-associate/study-guides/) · [Practice D2 questions](/ai-certification-preparation/exams/terraform-associate/sample-questions/?domain=D2) · [All domains](/ai-certification-preparation/exams/terraform-associate/domains/)
