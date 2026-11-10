---
title: "D7: Maintain Infrastructure with Terraform"
description: "Master resource imports, state inspection CLI commands, and diagnostic logging with TF_LOG."
domain: "D7"
layout: "single"
---

Domain 7 accounts for **6% (approx. 3 questions)** of the TA-004 exam. It tests operational maintenance: bringing pre-existing infrastructure under Terraform management, safely inspecting state contents via the CLI, and troubleshooting errors using logging.

## What to practice

- Import existing cloud resources into Terraform state using `terraform import <ADDRESS> <ID>` and understand the generation of corresponding HCL blocks (`import {}` blocks in modern Terraform).
- Inspect state files safely using the CLI without manual file editing: `terraform state list`, `terraform state show <ADDRESS>`, `terraform state rm <ADDRESS>`, and `terraform state mv <SOURCE> <DESTINATION>`.
- Control verbose execution logging using the `TF_LOG` environment variable (`TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, `OFF`) and redirect log output to files with `TF_LOG_PATH`.

---

[Read the study guides](/ai-certification-preparation/exams/terraform-associate/study-guides/) · [Practice D7 questions](/ai-certification-preparation/exams/terraform-associate/sample-questions/?domain=D7) · [All domains](/ai-certification-preparation/exams/terraform-associate/domains/)
