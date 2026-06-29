# Gates and QA

Three human gates protect the taste-sensitive and irreversible steps:
GATE 1 (home page), GATE 2 (remaining pages), GATE 3 (deploy, optional). They are
hard stops. The plugin never skips them, even when the user seems to be in a
hurry. (GATE 2 is skipped only when the site is a single page; GATE 3 only runs
if the user opts to deploy.)

## GATE 1 - confirm the HOME PAGE, before writing the design system

GATE 1 sits between Step A (home page prototype) and Step B (design system) of
phase 3. The design system is written only AFTER the home page is confirmed, so
it documents what was actually approved (see 03-design-handoff.md).

When Step A has produced `artifact/prototype/index.html` (home page only, no
design system yet):

1. Open the home page and present it for visual review (screenshot `index.html`
   at desktop + mobile).
2. Summarise the design decisions: palette in use, section structure, motion
   level.
3. Ask the user to approve or give feedback.
4. **Do not write the design system or build other pages until the user
   approves.** On feedback, loop back into Step A and re-present. Iterate until
   approved. Only then proceed to Step B (design system + remaining pages).

## GATE 2 - confirm the REMAINING pages, before conversion

After Step B has written the design system and built the other page types (most
projects are multi-page):

1. Present each additional page for review (screenshot at desktop + mobile).
2. Check each one is consistent with the approved home page and the design system
   (shared header/footer, components, tokens, spacing, motion).
3. Ask the user to approve or give feedback.
4. **Do not proceed to conversion until the user approves the remaining pages.**
   On feedback, fix the pages (and the design system if a real pattern gap is
   found) and re-present. Iterate until approved.

Skip this gate only if the site is a single page (nothing beyond the home page).

## GATE 3 - before deploy (deploy is OPTIONAL)

Deployment is not a compulsory phase. The converted, ready-to-deploy build is a
complete deliverable on its own.

When an adapter has produced a deploy-ready build:

1. **First ask whether to deploy at all.** Many users only want the built site
   (to deploy themselves, hand to a client, or review locally). If they do not
   want to deploy, stop here, hand them the build plus the adapter's deploy
   instructions, and treat the task as done.
2. If they do want to deploy: state exactly what will happen - the target stack,
   the destination (domain / project / host), and the deploy command.
3. Ask the user to confirm.
4. **Deploy NEVER runs without explicit approval.** If the user does not
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
