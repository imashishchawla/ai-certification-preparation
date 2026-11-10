---
title: "D4: Workloads & Scheduling"
description: "Master Deployments, rolling updates, rollbacks, ConfigMaps, Secrets, Horizontal Pod Autoscaling, and node scheduling rules."
domain: "D4"
layout: "single"
---

Domain 4 accounts for **15% (approx. 2–3 tasks)** of the CKA exam. It evaluates your fluency with application lifecycle primitives: orchestrating rolling updates and rollbacks, managing configuration and sensitive data, scaling workloads, and placing pods onto specific nodes using scheduling rules.

## What to practice

- Create and update `Deployment` workloads, observe rollout history (`kubectl rollout status`, `kubectl rollout history`), and execute instantaneous rollbacks (`kubectl rollout undo`).
- Externalize configuration using `ConfigMap` and secure credentials with `Secret` (mounting as environment variables or volume projections).
- Configure horizontal workload autoscaling (`HorizontalPodAutoscaler` / `kubectl autoscale`).
- Deploy specialized workloads: `StatefulSets` for ordered storage, `DaemonSets` for node-level agents, and batch `Jobs` / `CronJobs`.
- Control pod scheduling using `nodeSelector`, `nodeAffinity` (preferred vs required), `podAffinity`/`podAntiAffinity`, and `taints` and `tolerations`.

---

[Read the study guides](/ai-certification-preparation/exams/cka/study-guides/) · [Practice D4 tasks](/ai-certification-preparation/exams/cka/sample-questions/?domain=D4) · [All CKA domains](/ai-certification-preparation/exams/cka/domains/)
