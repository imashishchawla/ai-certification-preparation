---
title: "D8: HCP Terraform"
description: "Master HCP Terraform architecture, workspaces vs local directories, project organization, run triggers, and team governance."
domain: "D8"
layout: "single"
---

Domain 8 accounts for **8% (approx. 4 questions)** of the TA-004 exam. It tests HCP Terraform (formerly Terraform Cloud) cloud workflows, workspace isolation models, organization and project structures, remote speculative plans, and team-based role access controls.

## What to practice

- Explain the value proposition of HCP Terraform: managed remote execution, centralized state locking, private module registry, team access controls, and policy as code (Sentinel / OPA).
- Differentiate HCP Terraform workspaces (which represent distinct environments like dev/staging/prod with their own state and variables) from local CLI workspace state switches (`terraform workspace new/select`).
- Understand project hierarchies in HCP Terraform: organizing workspaces under Projects for granular team permissions and role-based access control (RBAC).
- Configure HCP Terraform integrations: VCS-driven workflows (GitHub/GitLab PR speculative plans), CLI-driven runs via the `cloud {}` configuration block, and run triggers between workspaces.

---

[Read the study guides](/ai-certification-preparation/exams/terraform-associate/study-guides/) · [Practice D8 questions](/ai-certification-preparation/exams/terraform-associate/sample-questions/?domain=D8) · [All domains](/ai-certification-preparation/exams/terraform-associate/domains/)
