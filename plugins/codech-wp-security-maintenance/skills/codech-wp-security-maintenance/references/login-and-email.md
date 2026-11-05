# Rounds 5 + 7 — Site e-mail, security plugin, 2FA, password-reset noise

Order matters: **e-mail → security plugin → 2FA**. 2FA setup, monitor alerts and password resets
all depend on mail actually being delivered.

## 1. Site e-mail

Check the SMTP plugin's log (audit "Mail" section). `failed` rows mean nothing is reaching anyone —
often for months, unnoticed.

FluentSMTP / WP Mail SMTP with **Microsoft 365 (OAuth / Graph API)** — typical failure:
- the Azure app's **client secret** expired or was deleted → token refresh fails
  (`AADSTS7000215 Invalid client secret`).
- Fix (client's M365 admin): Azure → App registrations → the app → new client secret → paste the
  secret **Value** (not the Secret ID) into the SMTP plugin → "Authenticate with Office365" as the
  sending mailbox → paste the access code **immediately** (it expires in minutes:
  `AADSTS70008`) → Save → send a test.
- Redirect URI that must exist in the Azure app: `https://<host>/wp-json/fluent-smtp/outlook_callback` (FluentSMTP).
- Diagnose a token refresh with the **decrypted** connection from the plugin's own settings model;
  passing the raw stored option gives a misleading `AADSTS9002313`.
- Note the secret's expiry date in the handover — it will break again on that date.

Give the client a short illustrated guide for the Azure step rather than asking for their admin login.

## 2. Security plugin (Wordfence free)

Install + activate, then immediately:
- **All Options → untick "Disable WordPress application passwords"** — it is ON by default and
  cuts off the MCP (401). Have a wp-admin session open while activating.
- Activation can rebuild rewrite rules → re-check sitemaps (Settings → Permalinks → Save).
- Firewall starts in **learning mode** (~1 week). Note the end date; watch for false blocks after it
  (page-builder saves, admin imports, large form posts).
- Alerts → the team inbox, not the client. Turn **off** "password recovery attempted" alerts or
  you get every bot reset.
- On small servers enable low-resource scanning.
- First scan lists known-vulnerable plugins: put the ones you can't update into the report with
  their scores — licence decision for the boss.

## 3. 2FA (Wordfence Login Security)

Only after e-mail works and the boss says go. Lockout risk is real.
1. Test first with a **test user** (your own e-mail, Editor role) and require 2FA for Editor only.
   Delete the user and switch the Editor requirement off afterwards (the client gets a "password
   changed" e-mail about it — warn them, or avoid by not changing its password).
2. Give every administrator a **grace period** *before* making 2FA required for the administrator
   role — Wordfence gives admins zero grace by default, and enforcement starts once one admin has
   2FA active. Set it on each user, then require 2FA for administrator + any custom admin role.
3. Send the staff message (deadline date + steps) — through the boss.
4. Shared account (e.g. the agency's own login): scan the QR on all phones in the same session.
5. "Code does not match": the setup page creates a **new secret on every reload** — delete the
   authenticator entry and rescan without refreshing.
6. After the deadline, users without 2FA are blocked → Login Security → Users → reset grace.
7. Check the MCP's application password still works after the MCP account turns on 2FA.
   Application passwords authenticate REST/MCP calls **without** the 2FA code, by design — that's
   why the MCP keeps working, and also why that password is as powerful as a full admin login:
   store it only in the MCP config, never in chat or notes, and revoke it (Users → Profile →
   Application Passwords) when the engagement ends.

## 4. Bot password-reset e-mails

Once e-mail works, bots requesting resets for `admin` reach the client's inbox.
- Best fix: **rename the `admin` login** (direct `$wpdb` update of `user_login` + `user_nicename`;
  e-mail, password and role stay; the person can still log in with the e-mail). Save the old row
  first. Afterwards a reset request for `admin` sends nothing.
- Make sure author archives / REST users don't leak the new login (public-data snippet).
- Temporary alternative: a `retrieve_password_notification_email` filter that redirects that one
  account's reset e-mails to the team inbox (deactivate once renamed).
