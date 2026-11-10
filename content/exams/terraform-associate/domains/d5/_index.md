---
title: "D5: Terraform Modules"
description: "Master module sourcing protocols, variable scoping encapsulation, calling syntax, and version pinning."
domain: "D5"
layout: "single"
---

Domain 5 accounts for **12% (approx. 7 questions)** of the TA-004 exam. It validates your ability to package, structure, and consume reusable infrastructure modules across local directories, the public Terraform Registry, GitHub/GitLab repositories, and private registries.

## What to practice

- Explain module source protocols: local relative paths (`./modules/vpc`), Terraform Registry (`hashicorp/consul/aws`), and Git URLs (HTTPS, SSH, specific git tags/branches with `?ref=v1.2.0`).
- Understand variable scoping: child modules cannot directly inherit variables from parent modules; every input must be passed explicitly into the `module {}` calling block.
- Read child module outputs from the root configuration using `module.<MODULE_NAME>.<OUTPUT_NAME>`.
- Pin module versions using the `version` argument (valid for registry sources) to guarantee deterministic builds.
- Understand how `terraform init` caches module code locally inside `.terraform/modules/`.

---

[Read the study guides](/ai-certification-preparation/exams/terraform-associate/study-guides/) · [Practice D5 questions](/ai-certification-preparation/exams/terraform-associate/sample-questions/?domain=D5) · [All domains](/ai-certification-preparation/exams/terraform-associate/domains/)
