---
title: "D1: Troubleshooting"
description: "Master cluster and node failure diagnostics, control plane component health, container logs, and networking fixes."
domain: "D1"
layout: "single"
---

Troubleshooting is the single most heavily weighted domain on the CKA exam, accounting for **30% (approx. 5–6 tasks)**. It evaluates your systematic ability to diagnose and repair broken worker nodes, unresponsive control plane services, failing containers, and misrouted network traffic.

## What to practice

- Diagnose failing worker nodes (`kubectl get nodes`, `systemctl status kubelet`, `journalctl -u kubelet`, `/var/log/pods`).
- Repair broken control plane static pods in `/etc/kubernetes/manifests` (`kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, `etcd`).
- Monitor cluster and pod resource consumption using `kubectl top nodes` and `kubectl top pods`.
- Inspect container output streams, evaluate container exit codes (OOMKilled, CrashLoopBackOff), and use `kubectl logs` (with `--previous` and `-c <container>`).
- Troubleshoot cluster DNS resolution failures (`nslookup`, CoreDNS configmap and endpoint verification).

---

[Read the study guides](/ai-certification-preparation/exams/cka/study-guides/) · [Practice D1 tasks](/ai-certification-preparation/exams/cka/sample-questions/?domain=D1) · [All CKA domains](/ai-certification-preparation/exams/cka/domains/)
