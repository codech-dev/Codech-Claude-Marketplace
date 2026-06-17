# Banned terms & required-state checklist

Canonical list for de-risking a crypto/payment/fintech marketing site. Use it two ways: (1) while editing, to know what to remove/replace; (2) while verifying, to grep the built HTML.

## 1. Remove entirely (market-maker / trading-venue signals)

These make the platform look like it operates a dealing desk, quotes prices, or runs a trading venue:

- **Live price / rate displays:** any concrete number presented as a current price or FX rate (e.g. `0.6482`, `1 AUD = 0.6482 USD`, `62,848.00`).
- **Liveness indicators:** `Live`, `Live rate`, `Updated just now`, `Real-time rate`, pulsing "live" dots, auto-refresh timers.
- **Spread / volatility metrics:** `spread`, `0.15% spread`, `+1.24%`, `24h change`, `▲ / ▼` change arrows, price sparklines/charts with a y-axis of prices.
- **Trading actions:** `Buy BTC`, `Sell BTC`, `Buy`/`Sell` buttons, `Order filled`, `Order`, order book, `Trade now`, "trading terminal".
- **Price-superlatives:** `market price`, `best price`, `best rate`, `guaranteed rate`.

**Replace a trading-terminal visual with:** a non-priced compliance *process* card. The proven 4-step flow: **Transaction request → Compliance review (KYC/KYB · sanctions · risk) → Provider terms (disclosed by partner) → Settlement approval (subject to internal approval).** Reuse existing card/step CSS classes so layout is unchanged.

**Replace an FX-rate widget with:** provider-facilitation wording, no numbers. e.g. "Exchange rates are determined by the relevant service provider at the time of the transaction and may vary depending on market conditions, transaction size, jurisdiction, provider availability and applicable fees." Keep the currency-pair chips (AUD ⇄ USD) — they show *capability*, not a *quote* — but delete the rate.

## 2. Re-label as not-yet-available (unlaunched-service signals)

Never show these as live/operational unless business+compliance have confirmed launch:

- **Status words to remove from unlaunched services:** `Active`, `Settled`, `Available`, `Currently available`, `Complete`, `Enabled`.
- **Guaranteed settlement times to remove:** `Instant`, `T+1`, `T+2`, `<2h`, `Same day`, any SLA-style ETA — unless there's a provable partner SLA.
- **Apply instead:** `Coming soon`, `Not currently available`, `Not yet available`, `Where available`, `Availability varies`, `Subject to availability`, `Subject to partner availability and compliance approval`.
- **Services this applies to:** virtual accounts, IBAN, virtual cards, settlement/payment rails (SWIFT/SEPA/BSB/ACH tables), any "future" product.
- **Illustrations:** if a card shows a mock account number / IBAN / card number, mask it (`AU•• •••• •••• ••••`) and label it "Illustrative example only" so it doesn't read as an issued, live account.

## 3. Required explicit negative statements

Must appear (usually footer + FAQ), verbatim from counsel where supplied:

- **No banking:** "BNEVA does not provide deposit-taking or banking services." (Critical — virtual accounts/IBANs read as bank accounts.)
- **No advice:** "does not provide investment, legal or tax advice" (some reviews also want "personal financial product advice").
- **Registration ≠ endorsement:** "AUSTRAC registration should not be regarded as an endorsement of [company] or its services." (Swap AUSTRAC for the relevant regulator: FCA, MAS, FinCEN, etc.)
- **Future-services disclaimer:** see `disclaimer-library.md`.

## 4. Re-frame scope claims as indicative

- "Supported assets / currencies / rails" → "**Indicative** assets, currencies and rails" + "listed items may not all be currently available; availability depends on jurisdiction, partner availability, regulatory requirements, transaction type and internal compliance approval."

## 5. Don't add (no-AFSL / pre-license stage)

Until the license is granted, avoid anything that reads as regulated financial-product advice:

- Product recommendations, investment strategies, market forecasts/commentary, personalised guidance, yield/return figures, "speculative opportunity" framing.

## 6. Registration / license numbers

- Show them with the **correct register name**. (BNEVA example: AUSTRAC "DCE" → "VASP" with value `DCE100880663-001`; "IND" → "REMITTANCE" with value `IND100880663-001`.) Get the exact label + format from the client; register naming changes over time.
- Flag to the user if two different registrations share an identical number — that's unusual and worth a double-check, but apply what the client specified.

## 7. Pre-launch checklist (grep the BUILT HTML)

```
☐ No live FX rate / price / spread / % change / 24h change anywhere
☐ No Buy / Sell / Order filled / trading-terminal buttons or statuses
☐ Virtual account / IBAN clearly "Not currently available / Coming soon"
☐ Virtual card clearly "Not currently available / Coming soon"
☐ Payment rails: no Active / Settled / Instant / T+1 / <2h
☐ Supported assets/currencies/rails marked "indicative only" + "availability varies"
☐ Footer: "registration is not an endorsement" retained
☐ Footer: no investment/legal/tax advice retained
☐ Explicit: "does not provide deposit-taking or banking services"
☐ Page <title>, meta description, OG/Twitter tags de-risked
☐ Final review by compliance lead / lawyer on the rebuilt page  ← HUMAN, cannot automate
```
