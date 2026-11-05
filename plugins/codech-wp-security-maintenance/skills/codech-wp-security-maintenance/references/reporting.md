# Reporting — approval report, changelog, handover

## Who hears what, when

| When | To | What |
|---|---|---|
| After the audit, before any change | Boss | Findings report (below) — asks for decisions |
| Before a client-visible step (2FA, deletions, downtime risk) | Boss → client | What will happen, when, what they need to do |
| As you work | Changelog file | One row per change, with undo |
| End of each day | Boss | Done / pending / needs decision, 5–10 lines |
| Incident (something broke) | Boss first, immediately | What broke, since when, already rolled back?, cause, prevention |

The boss tells the client. Don't message the client directly unless asked.

## Findings report (round 1)

Plain language, one table, decisions at the top. A shareable page (Artifact) works well.

1. **Decisions needed** — e.g. licence renewals for plugins with known vulnerabilities, deleting
   large public backups, who handles root-only items, 2FA timing.
2. **Findings** — `# · finding · risk (high/med/low) · proposed fix · undo · needs client?`
3. **Plan** — the rounds, with the window and that each step is backed up and reversible.
4. **Will not change** — and why (licence, builder pin, custom edits).
5. **Needs root / hosting** — PHP version, server packages, firewall, real log rotation.

Never put secrets, full credential values, or exploit details in the report; "hardcoded DB password
in functions.php" is enough.

## Changelog

Copy `templates/CHANGELOG.md` into the project's `maintenance/` folder. Record times in the
client's timezone. Log **what you didn't change** too — it answers "was it you?" as fast as what you did.

## Handover (round 8)

- What changed (link the changelog), what's pending, what's waiting on whom.
- "Never update" list with the reason for each pin.
- Dates: firewall learning-mode end, 2FA grace deadline, SMTP secret expiry, backup clean-up date.
- Monitor: what it sends, where, and how to re-baseline.
- Side effects the client will notice (2FA prompts, no more auto-publish, reset e-mails gone).
- Save the project notes/memory so the next session starts from them.

## After an incident

Write the lesson into `references/gotchas.md` of this skill (symptom / cause / fix), bump the patch
version, and open a PR — that is how this skill got its rules.
