# Gates and QA

Two human gates protect the irreversible and taste-sensitive steps. Both are hard
stops. The plugin never skips them, even when the user seems to be in a hurry.

## GATE 1 - after design, before conversion

When phase 3 has produced `artifact/DESIGN-SYSTEM.md` + `artifact/prototype/`:

1. Open the prototype and present it for visual review (screenshot the
   `index.html` and any other page types at desktop + mobile).
2. Summarise the design decisions: palette in use, section structure, motion
   level.
3. Ask the user to approve or give feedback.
4. **Do not proceed to conversion until the user approves.** On rejection, loop
   back to phase 3 with the feedback and re-present. Iterate until approved.

## GATE 2 - before deploy

When an adapter has produced a deploy-ready build:

1. State exactly what will happen: the target stack, the destination (domain /
   project / host), and the deploy command the adapter will run.
2. Ask the user to confirm.
3. **Deploy NEVER runs without explicit approval.** If the user does not
   confirm, stop at the built artifact and hand them the manual steps.

## Post-deploy QA

After a deploy:

1. Take a live screenshot of the deployed URL with Playwright (desktop + mobile).
2. Compare it against the approved prototype from GATE 1. Note any divergence.
3. Report the live URL and the comparison.
4. Remind the user to hard-refresh (Ctrl+F5) since caches/CDNs may serve stale
   assets.

If the live result diverges from the approved prototype in a way the adapter did
not document as intentional, treat it as a bug and fix before declaring done.
