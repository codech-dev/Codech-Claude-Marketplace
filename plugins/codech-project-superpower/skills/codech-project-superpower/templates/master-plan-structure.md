# Master Implementation Plan — Structure Template

> Phase 5 starts with **one** Master Plan at `docs/Implementation_Master_Plan.md`. It is the index and contract for all sub-plans. Every sub-plan must trace back to this document.

## File header

```markdown
# <Project Name> — Implementation Master Plan

**Project:** <client + project codename>
**Status:** In progress — Sub-plan <NN> shipped, sub-plan <NN+1> in flight
**Last updated:** YYYY-MM-DD
**Sources of truth:** FSD v<x>, SAD v<x>, TDD v<x>, SRS v<x>, Prototype.html v<x>

---
```

## Mandatory sections

### §1 Purpose

One paragraph. What does this plan exist to govern? Why one master plan instead of N independent plans?

### §2 Sources of truth

Table linking every authoritative doc and the rule for resolving conflicts.

| Doc | Path | Authority for |
|---|---|---|
| FSD | `docs/Feature_Scope_Document.md` | Feature scope, module list, acceptance criteria |
| SAD | `docs/System_Architecture_Document.md` | Topology, ADRs, deployment, infra |
| TDD | `docs/Technical_Design_Document.md` | Module code structure, data model |
| SRS | `docs/Software_Requirements_Specification.md` | REQ IDs, validation rules, traceability |
| Prototype | `docs/Prototype.html` | Pixel-level UI contract |

**Conflict resolution:** SRS REQ IDs win. Document any deviation in §6.2.

### §3 Repo structure

ASCII tree of the monorepo. Include every top-level folder + every `apps/<x>` and `packages/<x>` subtree. Inline notes on what each folder is for.

### §4 Traceability map

Table — workstream → FSD features → SRS REQs.

| Workstream | FSD § | SRS REQ IDs | Status |
|---|---|---|---|
| Foundation / scaffold | (infra) | (n/a) | Shipped |
| Auth / RBAC / DB | §2.1 | REQ-AUTH-* | Shipped |
| Master data (admin) | §2.2 | REQ-ADM-* | Shipped |
| <Module 1> | §2.3 | REQ-MOD1-* | Planned |
| ... | ... | ... | ... |

### §5 Workstream sequence + approval gates

Numbered list. For each workstream: short description + entry gate + exit gate.

```
1. Foundation
   Entry: Phase 1–4 accepted.
   Exit: Local dev up; first baseline pixel-diff accepted; CI green.

2. Auth / RBAC / DB baseline
   Entry: Foundation merged.
   Exit: Login flow + JWT + 2FA + audit table live; login screen pixel-diff clean.

3. Master data (admin module)
   Entry: Auth merged.
   Exit: All admin master screens functional + pixel-diff clean.

4–N. Domain modules (one workstream each)
   Entry: Auth + master data merged.
   Exit: Module CRUD + reports + integrations + pixel-diff clean.

N+1. Hardening
   Entry: All FSD modules done.
   Exit: Performance + observability + e2e smoke + runbook.

N+2. UAT + Production cutover
   Entry: Hardening passed.
   Exit: Client UAT sign-off + production live.
```

### §6 Sub-plan index

#### §6.1 Delivery breakdown

For every sub-plan that has shipped, what did it actually deliver? Honest record — counts matter (test count, file count, screens covered).

```markdown
- **Sub-plan 01 — Foundation** (`docs/superpowers/plans/YYYY-MM-DD-foundation.md`) — SHIPPED
  - Monorepo scaffold: uv (Python) + pnpm 11 workspace
  - Apps: api (FastAPI) + web (React/Vite)
  - Packages: shared (types/utils) + ui (atoms)
  - Pixel-diff harness: Playwright + Win32 + Linux baselines
  - CI: ubuntu-24.04, Node 22.13, full lint/test/build
  - Tests: api 5 + shared 6 + ui 4 + web unit 2 + visual 1
  - 25 tasks delivered

- **Sub-plan 02 — Auth/RBAC/DB** — SHIPPED
  - JWT + bcrypt (pinned 4.0.1) + pyotp 2FA + HttpOnly refresh cookie
  - Lockout after 5 attempts, recorded in audit table
  - Alembic baseline + first 4 migrations
  - Frontend: api.ts fetch wrapper + 401→/auth/refresh→retry
  - Tests: api +18 + web unit +7 + visual +5 (login, totp, lockout, refresh, dashboard)
  - 18 tasks delivered

- **Sub-plan 03 — Master data (admin)** — SHIPPED
  - 6 master screens via shared `<MasterTable>` + `<MasterModal>` abstraction
  - makeCrud<TRow,TCreate,TUpdate>() factory in hooks
  - Tests: api +0 (covered by smoke) + web unit +13 + visual +6
  - 20 tasks delivered
```

#### §6.2 Deviations

Document every place where the codebase differs from the prototype or pre-dev docs. Each deviation needs: what, why, rationale, status.

```markdown
- **Master data screens — shared abstraction vs verbatim port**
  - **What:** Built one `<MasterTable>` + `<MasterModal>` reused across 6 master screens.
  - **Why prototype shows:** Each master screen as a unique table layout.
  - **Why we deviated:** Verbatim port would have meant ~6× the code with no functional difference; the shared abstraction is design-token-faithful and visually within pixel-diff threshold.
  - **Status:** Accepted by team; client review pending on screen 3.
```

### §7 Pixel-diff discipline

- Threshold: `0.001` (0.1% pixel diff allowed)
- Baselines: `chromium-win32/` + `chromium-linux/` (CI uses Linux)
- Regeneration: cross-platform via official Playwright Noble Docker image
- Failure policy: PR that changes UI without baseline updates fails CI

Link to `recipes/pixel-diff-harness.md` for the full setup.

### §8 Stack decisions (locked)

Table of ADRs in effect + any framework version pins.

| ADR / pin | Decision | Rationale |
|---|---|---|
| ADR-001 | Monorepo via uv + pnpm 11 | Workspace types across api/web/shared/ui |
| ADR-007 | Field-level encryption: AES-256-GCM (random) + AES-256-SIV (deterministic) | PDPO; deterministic for indexed lookups |
| bcrypt 4.0.1 (pinned) | 5.x breaks passlib 1.7.4 | Pin until passlib 1.8 lands |
| Node 22.13 + .nvmrc | pnpm 11 needs `node:sqlite` | 20.x silently broken in CI |
| ubuntu-24.04 CI runner | Matches `noble` Playwright Docker baselines | Font rendering parity |
| Postgres 5433 in dev | Avoid clash with native install on 5432 | Documented in docker-compose.dev.yml |

### §9 Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Prototype drift as design evolves | M | H | Pixel-diff gate; regenerate baselines together with UI changes |
| Bcrypt/passlib upgrade breaks login | L | H | Pin both; smoke test on dependency bumps |
| ... | ... | ... | ... |

### §10 Definition of Done

Per workstream, what does "done" mean?

```markdown
- **Foundation done when:** Lint, typecheck, unit + visual tests green; baseline images committed; CI green on `main`.
- **Auth done when:** Login (with TOTP) + lockout + refresh tokens all work end-to-end on a fresh DB; audit trail visible; visual baselines for login + 2fa + lockout match prototype.
- **Module done when:** All CRUD routes covered by tests; UI matches prototype within threshold; audit events written; route-level RBAC enforced.
- **UAT done when:** Client signs off in writing on all FSD modules + full SRS traceability matrix + runbook + first production migration dry-run.
```

### §11 Maintenance & roadmap

Post-cutover plan:
- Patch cadence (security vs feature)
- On-call / SLA referenced from proposal
- Documented "next phase" candidates (not committed; just visibility)

---

## Authoring rules

- **No placeholders.** Every section either has real content or is explicitly marked TBD with a target date.
- **Living document.** Update §6.1 every time a sub-plan completes. Update §6.2 every time you accept a deviation. Update §8 when a pin changes.
- **Index, not implementation.** The Master Plan does not contain code or task-level steps — those live in the sub-plans.
- **Sub-plans are the contract for execution.** The Master Plan is the contract between sub-plans.
