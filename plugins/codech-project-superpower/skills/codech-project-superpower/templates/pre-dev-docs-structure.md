# Pre-Development Documents Structure

> The 4-document set that follows proposal sign-off. Each builds on the prior — generate in order.

## Document hierarchy

```
Project Proposal (vision + commercial)
        ↓
Feature Scope Document (FSD) — what we're building
        ↓
System Architecture Document (SAD) — high-level how
        ↓
Technical Design Document (TDD) — implementation how
        ↓
Software Requirements Specification (SRS) — atomic build contract
        ↓
[Code]
```

Filename conventions (project root):
- `Feature_Scope_Document.md`
- `System_Architecture_Document.md`
- `Technical_Design_Document.md`
- `Software_Requirements_Specification.md`

---

## Document 1: Feature Scope Document (FSD)

**Audience:** BAs, QA, Product, Client Stakeholders
**Purpose:** Define WHAT the system does in business terms
**Length:** ~700–1,000 lines

### Required sections

1. **Document Information** (table with doc ID, version, date, owner, audience, parent docs)
2. **Document Purpose** — relationship to other documents
3. **Definitions & Conventions**
   - Priority levels: MoSCoW (M / S / C / W)
   - Feature ID scheme: `F<module>.<sequence>` (e.g., `F1.5`, `F2.3.2`)
   - User story format: "As a <persona>, I want <action> so that <outcome>."
4. **User Personas** — P1, P2, P3... with description + primary channel
5. **Cross-cutting Capabilities** (F0.x) — auth, audit, i18n, responsive, real-time
6. **Module sections** (one section per module from proposal §6)
   - Module goals
   - Primary persona(s)
   - Feature table with columns: ID / Feature / Priority / User Story
   - Key screens list
   - Business rules table (BR-N.M)
7. **AI Chatbot Feature Scope** (if applicable) — separate section due to distinct UX
8. **QR Code & Field Operations** (if applicable)
9. **Notifications** (if applicable)
10. **Administration & Settings**
11. **Out of Scope** — explicit exclusions with reason
12. **Acceptance Matrix** — per-module count of Must features + acceptance method
13. **Document Sign-Off** table

### Feature ID examples

```
F0.1   Authentication
F0.2   Audit Logging

F1.1   New Sale Entry          (POS module 1, feature 1)
F1.1.1   Customer search/select  (sub-feature)
F1.1.2   Multi-line items
F1.5   Order Status Workflow
F1.5.1   State machine

F2.1   Batch Creation          (Seedling module 2, feature 1)
F2.2   Status Updates
F2.3   Withered / Replant Logic
```

Numbering is dense (no gaps). When you remove a feature, renumber subsequent ones or leave deprecated markers.

### Business rule format

```markdown
| Rule | Description |
|---|---|
| BR-1.1 | Stock deducted at order creation, reversed on cancel |
| BR-1.2 | Backorder lines do not deduct stock until fulfillment |
| BR-1.3 | Receipt # cannot be edited after print |
```

Module-prefixed (BR-1.x for POS, BR-2.x for Seedling, etc.).

---

## Document 2: System Architecture Document (SAD)

**Audience:** Architects, DevOps, Security, Senior Engineers
**Purpose:** Define HOW the system is structured at a high level
**Length:** ~700–900 lines

### Required sections

1. **Architectural Goals & Constraints**
   - Drivers table (with impact on architecture)
   - Quality attributes (prioritized)
   - Constraints C-01 to C-NN
2. **Architecture Principles** (P1–P10)
3. **Architecture Overview**
   - Reference view (high-level diagram, can be ASCII in MD, SVG in HTML)
   - Style summary (monolith / microservices / hybrid + WHY)
4. **Logical Component Architecture**
   - One subsection per major component (Frontend / Backend / AI / etc.)
   - Sub-component tables
5. **Data Architecture**
   - Data stores table
   - Data domains (bounded contexts) diagram
   - Master data management
   - Data flow examples (≥2 end-to-end flows)
   - Data retention policy table
6. **Integration Architecture**
   - External integrations table
   - Internal API patterns
   - API versioning strategy
   - Webhook handling
7. **AI Subsystem Architecture** (if applicable)
   - Component map
   - Model choices (from ADR)
   - Tool-use contract
   - RAG pipeline
   - Eval harness
8. **Deployment Architecture**
   - Environments table (dev/staging/prod)
   - Deployment topology diagram
   - Container strategy
   - CI/CD pipeline
   - Hardware-specific deployment (e.g., on-prem DGX)
9. **Security Architecture**
   - Threat model (STRIDE)
   - Identity & access
   - Data protection
   - Compliance controls (PDPO/GDPR/HIPAA per locale)
   - Component-specific security (chatbot, etc.)
   - Pen test scope
10. **Scalability & Performance**
    - Scaling strategy
    - Performance targets (per endpoint type)
    - Caching strategy
    - DB optimization
11. **Reliability & Disaster Recovery**
    - Availability targets
    - Failure modes & responses
    - Backup strategy
    - DR drills
12. **Observability**
    - Logging
    - Metrics (RED, USE, business, AI)
    - Tracing
    - Alerting
13. **Architecture Decision Records (ADRs)** — Status: Accepted/Proposed/Superseded

### ADR format

```markdown
### ADR-001 — <decision title>
**Context:** Why this decision needs to be made
**Decision:** What we chose
**Consequence:** Trade-offs (positive + negative)
**Status:** Accepted (or Proposed, Superseded)
```

Number ADRs sequentially across the project lifetime. Don't renumber if superseded — link from new ADR.

---

## Document 3: Technical Design Document (TDD)

**Audience:** Engineers (FE, BE, AI), DevOps
**Purpose:** Define HOW each component is implemented
**Length:** ~1,200–1,800 lines

### Required sections

1. **Tech Stack & Toolchain** — concrete library/version table for each layer
2. **Repository Structure** — full directory tree
3. **Coding Standards & Conventions**
   - TypeScript / Python style
   - File naming conventions
   - Commit convention
   - PR rules
4. **Database Design**
   - Schema overview
   - **Full DDL skeleton** (CREATE TABLE statements for ALL tables — this is the bulk of TDD)
   - Field-level encryption table (if PII)
   - Migrations strategy
   - ERD (text-tree or SVG)
5. **API Design**
   - Conventions (URL, JSON casing, pagination)
   - Standard response envelopes (success/collection/error)
   - HTTP status code usage
   - **Endpoint catalog** organized by module (≥50 endpoints typically)
   - OpenAPI generation strategy
   - WebSocket events
6. **Backend Implementation**
   - Service layer pattern
   - Example: critical business flow (e.g., order creation transaction)
   - Inventory reservation (FIFO with `FOR UPDATE`)
   - Receipt number generation (gap-free sequence)
   - Error handling
   - Logging standards
7. **Frontend Implementation**
   - Routing structure
   - State architecture (TanStack Query + Zustand)
   - Form architecture (react-hook-form + zod)
   - i18n
   - Component library
   - Printing (receipts, reports)
8. **AI Subsystem Implementation** (if applicable)
   - FastAPI entry
   - LangGraph state machine
   - Tool implementations
   - RAG pipeline (with ingestion CLI)
   - NIM client
   - Eval harness with YAML schema
   - System prompt loading + versioning
   - Guardrails
9. **Integration Implementation**
   - WhatsApp adapter
   - SMS adapter
   - QR code generation
10. **Auth & Security Implementation**
    - Login flow diagram
    - JWT structure
    - Password hashing
    - Field-level encryption (Prisma middleware example)
    - Rate limiting
    - CSRF/XSS/SQL injection prevention
11. **Background Jobs**
    - Queue architecture (BullMQ)
    - Scheduled jobs (cron)
    - Retry strategy
12. **Testing Strategy**
    - Test pyramid
    - Coverage targets
    - E2E examples
    - AI eval as CI gate
    - Performance testing
13. **DevOps & Infrastructure as Code**
    - IaC approach
    - Environment variables
    - Docker images
    - CI pipeline (full YAML example)
    - Deployment pipeline
14. **Migration & Seeding**
    - Legacy data migration
    - Database seeding
15. **Definition of Done** — checklist a story must clear before shipping

### DDL conventions

```sql
-- Always:
id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
deleted_at      TIMESTAMPTZ,  -- if soft-delete

-- Indexes on:
-- 1. All foreign keys
-- 2. All status columns (with WHERE filter)
-- 3. All searchable fields (phone, email, name)
-- 4. Time-series partitioning (audit_log monthly)

-- Conventions:
-- snake_case for columns
-- plural for table names (customers, orders)
-- CITEXT for case-insensitive (emails)
-- Numeric types: NUMERIC(12,2) for money, INT for counts
```

---

## Document 4: Software Requirements Specification (SRS)

**Audience:** Everyone (this is the build contract)
**Purpose:** Atomic, testable requirements that prove the system meets the spec
**Length:** ~1,000–1,500 lines

### Required sections

1. **Introduction** — purpose, scope, definitions, references
2. **Document Conventions**
   - **REQ ID scheme:** `REQ-<MODULE>-<TYPE>-<###>`
     - Module codes: SYS, AUTH, POS, SEED, PROC, CERT, FARM, RPT, CHAT, NOTIF, ADMIN, INTEG
     - Type codes: FUN, DAT, VAL, ERR, STA, INT, PRF, SEC, USB, RLB, MNT, PRT
   - Priority inheritance from FSD
   - Traceability rule: every REQ traces to ≥1 FSD feature
3. **Overall Description**
   - Product perspective
   - Functions summary (cross-reference FSD)
   - User characteristics
   - Operating environment
   - Design & implementation constraints
   - Assumptions & dependencies
4. **Functional Requirements**
   - Module-by-module, REQ-by-REQ
   - Each REQ: atomic, testable, single statement
   - Right-most column: FSD feature traced
5. **Data Dictionary**
   - Field-level specs for major entities
   - Each row: name / type / format / required / unique / PII / notes
6. **Validation Rules**
   - Common field validators (V-PHONE-001, V-EMAIL-001, etc.)
   - Cross-field validators (V-XF-001)
   - Business validators (V-BIZ-001)
7. **Error Handling**
   - Standard error codes (HTTP status mapping)
   - Module-specific error codes (with UI messages in target language)
   - Error response format
   - User-facing error display patterns
8. **State Machines** — for every entity with non-trivial states (orders, batches, certs, etc.)
9. **Use Case Specifications** — at least 4 critical use cases fully elaborated:
   - Actor
   - Preconditions
   - Main flow (numbered steps)
   - Postconditions
   - Alternate flows (A1, A2, ...)
   - Exceptions (E1, E2, ...)
10. **Non-Functional Requirements**
    - Performance
    - Reliability
    - Security
    - Usability
    - Maintainability
    - Portability
11. **External Interface Requirements**
    - User interfaces
    - Hardware interfaces
    - Software interfaces (per integration)
    - Communication interfaces
12. **Business Rules Catalog** — consolidated from FSD
13. **Constraints & Assumptions** — inherited from §2 + open items table
14. **Traceability Matrix** — FSD feature → SRS REQ IDs (the audit trail)
15. **Document Sign-Off**

### REQ examples

```markdown
| REQ ID | Requirement | FSD |
|---|---|---|
| REQ-AUTH-FUN-001 | The System SHALL authenticate users via email and password. | F0.1 |
| REQ-POS-FUN-001 | The System SHALL allow creation of a new sale with one or more line items in a single transaction. | F1.1 |
| REQ-POS-VAL-001 | Quantity SHALL be > 0 and SHALL support 2 decimal places (e.g., 0.50, 0.75). | F1.1.2 |
| REQ-CHAT-SEC-001 | Personal-data lookups SHALL require identity verification: registered phone + 4-digit code delivered via WhatsApp/SMS to that phone. | F7.5 |
```

### State machine ASCII

```
                  ┌──────────────┐
                  │  processing  │  (default on create)
                  └──────┬───────┘
                         │ all non-backorder lines stocked
                         ▼
              ┌──────────────────┐
              │     ready        │
              └─────┬────────┬───┘
        picked_up  │        │  cancelled
                   ▼        ▼
            ┌──────────┐  ┌────────────┐
            │ picked_up│  │ cancelled  │ (terminal)
            └─────┬────┘  └────────────┘
```

### Use case format

```markdown
### UC-1: <title>

**Actor:** <persona>
**Preconditions:** <list>

**Main Flow:**
1. ...
2. ...

**Postconditions:** <list>

**Alternate Flows:**
- **A1 — <case>:** ...
- **A2 — <case>:** ...

**Exceptions:**
- **E1:** ...
```

---

## Common sections across all 4 docs

### Document Information table (top of every doc)

```markdown
| Item | Value |
|---|---|
| **Document ID** | <PROJECT>-<TYPE>-001 |
| **Version** | v1.0 |
| **Date** | YYYY-MM-DD |
| **Status** | Draft for Phase 1 Review |
| **Owner** | <role> |
| **Audience** | <list> |
| **Parent Documents** | <list> |
```

### Sign-off table (bottom of every doc)

```markdown
| Role | Name | Date | Signature |
|---|---|---|---|
| Client — Project Sponsor | _______ | _______ | _______ |
| Client — Operations Lead | _______ | _______ | _______ |
| Vendor — Project Manager | _______ | _______ | _______ |
| Vendor — Business Analyst | _______ | _______ | _______ |
```

Roles vary by document type. SRS requires the most signatures (it's the build contract).

---

## Quality bar

Before considering all 4 docs "done":

- [ ] FSD: every Must feature is testable
- [ ] SAD: every architecture decision has an ADR (or references the proposal's ADR)
- [ ] TDD: full DDL present, ≥50 API endpoints cataloged
- [ ] SRS: every FSD M-feature has ≥1 REQ; traceability matrix complete
- [ ] All 4: sign-off tables present
- [ ] Cross-references work (clicking F1.5 in SRS finds it in FSD)
- [ ] Same locale conventions across all 4 (Trad Chinese stays Trad Chinese)
