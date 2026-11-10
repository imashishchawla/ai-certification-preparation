---
title: "D2: Cluster Architecture, Installation & Configuration"
description: "Master RBAC, cluster bootstrapping with kubeadm, version upgrade lifecycles, and etcd snapshot backup/restore."
domain: "D2"
layout: "single"
---

Domain 2 accounts for **25% (approx. 4–5 tasks)** of the CKA exam. It validates your core systems administration skills: bootstrapping clusters from bare infrastructure using `kubeadm`, executing rolling version upgrades, securing cluster APIs with RBAC, and taking reliable `etcd` database snapshots.

## What to practice

- Create and manage Roles, ClusterRoles, RoleBindings, and ClusterRoleBindings to restrict user and ServiceAccount API access.
- Bootstrap a Kubernetes control plane and join worker nodes using `kubeadm init` and `kubeadm join`.
- Perform zero-downtime cluster version upgrades using `kubeadm upgrade plan`, `kubeadm upgrade apply`, draining nodes (`kubectl drain --ignore-daemonsets`), upgrading `kubelet`/`kubectl`, and uncordoning (`kubectl uncordon`).
- Create and restore `etcd` snapshots using `etcdctl snapshot save` and `etcdctl snapshot restore` with proper PKI certificates (`--cacert`, `--cert`, `--key`).
- Use Helm and Kustomize to template and deploy cluster components, and understand CNI/CSI/CRI interfaces.

---

[Read the study guides](/ai-certification-preparation/exams/cka/study-guides/) · [Practice D2 tasks](/ai-certification-preparation/exams/cka/sample-questions/?domain=D2) · [All CKA domains](/ai-certification-preparation/exams/cka/domains/)
