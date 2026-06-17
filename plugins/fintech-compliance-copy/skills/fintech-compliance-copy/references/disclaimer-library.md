# Disclaimer library

Battle-tested disclaimer wording from a real AFSL/AUSTRAC engagement. **Hierarchy of authority:**

1. **Client/lawyer-supplied exact text → use it VERBATIM.** Always wins. Do not paraphrase.
2. If the client supplied no exact text, you may offer the wording below as a *starting point*, clearly flagged as "draft, pending legal review."

Swap "BNEVA" for the company name and "AUSTRAC" for the relevant regulator (FCA / MAS / FinCEN / etc.). These are Australia-flavoured; adapt jurisdiction references.

---

## Footer — primary legal disclaimer

> BNEVA does not provide investment, legal or tax advice and does not provide deposit-taking or banking services. Digital asset transactions involve risks, including market volatility, technology failures, counterparty risk and irreversible transactions. Services are subject to customer onboarding, identity verification, AML/CTF requirements, sanctions screening, jurisdictional restrictions, partner availability and BNEVA's internal compliance and risk assessment procedures. AUSTRAC registration should not be regarded as an endorsement of BNEVA or its services.

## Footer — future-services disclaimer

> Certain payment, virtual account, card, and settlement services referred to on this website may not currently be available and remain subject to licensing requirements, third-party provider arrangements, regulatory approvals, product development and internal compliance approval.

## Hero subtitle (positioning, compliance-led)

> BNEVA supports eligible corporate and wholesale clients with digital asset exchange, on/off-ramp and payment-related facilitation services, subject to applicable law, KYC/KYB, sanctions screening, partner availability, transaction eligibility and BNEVA's internal risk acceptance policy.

## Hero headline (de-risked — avoid "global payment rails")

> Compliance-led digital asset exchange and payment facilitation for eligible corporate and wholesale clients.

## FX conversion support

> FX conversion services will be facilitated through approved banking, payment and licensed liquidity providers, subject to transaction eligibility and compliance review. Exchange rates are determined by the relevant service provider at the time of the transaction and may vary depending on market conditions, transaction size, jurisdiction, provider availability and applicable fees.

## Virtual account / IBAN

> Virtual account and IBAN functionality is not currently available. If introduced, it will be provided through appropriately licensed banking or payment service providers, subject to regulatory requirements, partner arrangements, product readiness and BNEVA's internal compliance approval. BNEVA does not provide deposit-taking or banking services.

## Virtual card

> Virtual card functionality is not currently available. If introduced, it will be provided through appropriately licensed third-party providers, subject to regulatory approvals, partner arrangements, product readiness and BNEVA's internal compliance approval.

## Supported / indicative assets & rails

> The assets, currencies, blockchain networks and payment methods listed on this website are indicative only and may not all be currently available. Availability depends on jurisdiction, partner availability, liquidity provider support, regulatory requirements, transaction type and BNEVA's internal compliance approval.

---

## Notes on usage

- **Apostrophes** (`BNEVA's`) render fine as literal `'` inside JSX text; only `< > { }` need escaping in JSX. In raw HTML, all are fine.
- These often need to appear in **more than one place** (a short form on a card, the full form in the footer/FAQ). Keep them consistent.
- When the FX/virtual-card text is too long for a small UI card, the *card* may show a trimmed version but the **footer/FAQ must carry the full verbatim text**.
- After inserting, grep the built HTML to confirm each appears verbatim (see `verification.md`).
