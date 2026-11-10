---
title: "D6: Terraform State Management"
description: "Master local vs remote backends, state locking mechanisms, backend migration, and drift detection."
domain: "D6"
layout: "single"
---

Domain 6 represents **16% (approx. 9 questions)** of the TA-004 exam. State is Terraform's core record of truth. This domain covers backend types, concurrency locking, backend migration workflows, drift detection, and why state files should never be checked into source control.

## What to practice

- Contrast the default `local` backend (`terraform.tfstate`) with standard remote backends (e.g., S3 + DynamoDB, Azure Blob, Google Cloud Storage, HCP Terraform).
- Explain state locking: how remote backends prevent simultaneous concurrent writes and corruption, which backends natively support locking, and how to force-unlock if a process crashes (`terraform force-unlock <LOCK_ID>`).
- Configure remote backend blocks in HCL, run `terraform init -migrate-state` when changing backends, and understand partial configuration (`-backend-config`).
- Understand infrastructure drift: how external manual changes create discrepancies between state and reality, how `terraform refresh` or `terraform plan -refresh-only` detects drift, and how `terraform apply` reconciles differences.

---

[Read the study guides](/ai-certification-preparation/exams/terraform-associate/study-guides/) · [Practice D6 questions](/ai-certification-preparation/exams/terraform-associate/sample-questions/?domain=D6) · [All domains](/ai-certification-preparation/exams/terraform-associate/domains/)
