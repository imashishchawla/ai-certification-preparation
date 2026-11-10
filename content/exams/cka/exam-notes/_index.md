---
title: "Exam Notes & kubectl Cheatsheets"
description: "High-yield CKA command cheatsheets, imperative one-liners, JSONPath snippets, etcd snapshot commands, and troubleshooting decision trees."
layout: "single"
---

Welcome to the **CKA Exam Notes & Cheatsheets** section. In a performance-based exam where time is the primary constraint (approx. 6–7 minutes per task), speed and muscle memory with `kubectl` imperative commands and JSONPath filters are paramount.

---

## 1. Quick-Reference Domain Cheat Sheets

<div class="card-grid">
  <div class="question-card" style="border-left: 6px solid var(--accent);">
    <span class="tag">DOMAIN 1 · 30%</span>
    <h3>Troubleshooting & Diagnostics Notes</h3>
    <p>Node failure triage (`journalctl -u kubelet`), static pod recovery in `/etc/kubernetes/manifests`, `kubectl top`, and container exit codes.</p>
    <a href="/ai-certification-preparation/exams/cka/domains/d1/" class="btn" style="margin-top: 0.5rem; display: inline-block;">Read D1 Notes →</a>
  </div>

  <div class="question-card" style="border-left: 6px solid var(--accent);">
    <span class="tag">DOMAIN 2 · 25%</span>
    <h3>Architecture, kubeadm &amp; etcd Notes</h3>
    <p>RBAC Role/ClusterRole syntax, `kubeadm upgrade apply`, node drain/uncordon workflow, and `etcdctl snapshot save/restore` flags.</p>
    <a href="/ai-certification-preparation/exams/cka/domains/d2/" class="btn" style="margin-top: 0.5rem; display: inline-block;">Read D2 Notes →</a>
  </div>

  <div class="question-card" style="border-left: 6px solid var(--accent);">
    <span class="tag">DOMAIN 3 · 20%</span>
    <h3>Services &amp; Networking Notes</h3>
    <p>Service port mapping (`port` vs `targetPort`), Ingress route specifications, Gateway API HTTPRoute, NetworkPolicy rules, and CoreDNS checks.</p>
    <a href="/ai-certification-preparation/exams/cka/domains/d3/" class="btn" style="margin-top: 0.5rem; display: inline-block;">Read D3 Notes →</a>
  </div>

  <div class="question-card" style="border-left: 6px solid var(--accent);">
    <span class="tag">DOMAIN 4 · 15%</span>
    <h3>Workloads &amp; Scheduling Notes</h3>
    <p>Imperative deployment generators (`--dry-run=client -o yaml`), rolling restart/history/undo, ConfigMap/Secret volume mounts, and affinity rules.</p>
    <a href="/ai-certification-preparation/exams/cka/domains/d4/" class="btn" style="margin-top: 0.5rem; display: inline-block;">Read D4 Notes →</a>
  </div>

  <div class="question-card" style="border-left: 6px solid var(--accent);">
    <span class="tag">DOMAIN 5 · 10%</span>
    <h3>Storage &amp; Volume Notes</h3>
    <p>PersistentVolume definitions, PVC claims, StorageClass provisioners, and volume mount configurations.</p>
    <a href="/ai-certification-preparation/exams/cka/domains/d5/" class="btn" style="margin-top: 0.5rem; display: inline-block;">Read D5 Notes →</a>
  </div>
</div>

---

## 2. Essential CLI Aliases & Time-Saving Shortcuts

* ⚡ **Shell Setup**: `alias k=kubectl` and `export do="--dry-run=client -o yaml"`.
* ⚡ **Generate YAML Instantly**: `k run nginx --image=nginx $do > pod.yaml` or `k create deploy web --image=nginx --replicas=3 $do > deploy.yaml`.
* ⚡ **Fast Deletion**: `k delete pod <pod-name> --now` or `--grace-period=0 --force`.
* ⚡ **etcd Snapshot Backup**:
  `ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 --cacert=/etc/kubernetes/pki/etcd/ca.crt --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key snapshot save /tmp/etcd-backup.db`
* ⚡ **JSONPath Formatting**: `k get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="InternalIP")].address}'`.
