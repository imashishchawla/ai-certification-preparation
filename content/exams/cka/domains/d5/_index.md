---
title: "D5: Storage"
description: "Master StorageClasses, dynamic volume provisioning, Persistent Volumes (PVs), Persistent Volume Claims (PVCs), and volume access modes."
domain: "D5"
layout: "single"
---

Domain 5 accounts for **10% (approx. 1–2 tasks)** of the CKA exam. It evaluates your ability to manage stateful data lifecycles in Kubernetes clusters: configuring storage providers, provisioning Persistent Volumes, binding Persistent Volume Claims, and mounting storage into workload Pods.

## What to practice

- Create and configure `StorageClass` objects and understand dynamic volume provisioning with CSI provisioners.
- Define `PersistentVolume` (PV) resources with capacity, access modes (`ReadWriteOnce`, `ReadOnlyMany`, `ReadWriteMany`), and reclaim policies (`Retain`, `Delete`).
- Create `PersistentVolumeClaim` (PVC) resources to claim storage from matching PVs or dynamic StorageClasses.
- Mount claimed volumes into Pod containers under `spec.volumes` and `spec.containers.volumeMounts`.

---

[Read the study guides](/ai-certification-preparation/exams/cka/study-guides/) · [Practice D5 tasks](/ai-certification-preparation/exams/cka/sample-questions/?domain=D5) · [All CKA domains](/ai-certification-preparation/exams/cka/domains/)
