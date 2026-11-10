---
title: "D3: Services & Networking"
description: "Master Service routing types, Ingress controllers, Gateway API, NetworkPolicies, and CoreDNS."
domain: "D3"
layout: "single"
---

Domain 3 represents **20% (approx. 3–4 tasks)** of the CKA exam. It tests your comprehension of the Kubernetes networking model: how Pods communicate across node boundaries, how internal and external Services expose workloads, and how to restrict traffic flows with NetworkPolicies.

## What to practice

- Configure and troubleshoot Service types: `ClusterIP` (internal), `NodePort` (node-level port mapping), `LoadBalancer` (cloud provider integration), and inspect underlying `Endpoints` / `EndpointSlices`.
- Create and manage `NetworkPolicy` resources to enforce ingress and egress isolation based on `podSelector`, `namespaceSelector`, and `ipBlock`.
- Configure `Ingress` resources with host-based and path-based routing rules, pointing to target backend services.
- Understand modern Kubernetes Gateway API abstractions (`GatewayClass`, `Gateway`, `HTTPRoute`).
- Troubleshoot CoreDNS configurations in the `kube-system` namespace, verifying upstream nameservers in `/etc/resolv.conf`.

---

[Read the study guides](/ai-certification-preparation/exams/cka/study-guides/) · [Practice D3 tasks](/ai-certification-preparation/exams/cka/sample-questions/?domain=D3) · [All CKA domains](/ai-certification-preparation/exams/cka/domains/)
