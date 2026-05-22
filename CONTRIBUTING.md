# Contributing to Codech Claude Marketplace

> How to improve plugins in this marketplace based on lessons from real engagements.

This marketplace is **maintained by the team for the team.** Every project we work on generates new gotchas, new templates, and new patterns. This document explains how to feed those improvements back into the skills so the next project benefits.

---

## The core principle

> **If a problem cost you more than 30 minutes to debug, it belongs in the skill.**

The whole point of `gotchas.md` is to prevent future-you (or future-teammate) from making the same mistake. Don't hoard the knowledge.

---

## How to contribute

### 1. Clone the repo

```bash
git clone https://github.com/codech-dev/Codech-Claude-Marketplace.git
cd Codech-Claude-Marketplace
```

### 2. Make your change

The plugin source lives at:

```
plugins/codech-project-superpower/skills/codech-project-superpower/
```

#### Adding a gotcha

Open `gotchas.md` and add a new entry under the appropriate section (HTML Proposals / Prototype HTML / PDF Export / etc.). Follow the format:

```markdown
### <Symptom you saw>

**Symptom:** What did you observe? (Be specific — error messages, visual artifacts)

**Cause:** What was the root reason?

**Fix:** The actual code change.

```code
example
```
```

If there's no good section, add a new one — but think carefully about whether it really belongs here vs. in a template.

#### Improving a template

Open the relevant template (e.g., `templates/proposal-structure.md`) and edit the section. If you're adding a new section convention, update the "Required sections" table at the top.

#### Adding a new recipe

Create a new file under `recipes/` (e.g., `recipes/docx-extract.md`). Update `SKILL.md`'s table of templates/recipes to reference it.

#### Updating the workflow itself

If a phase needs reordering or a new gate is needed, edit `SKILL.md`. This is the biggest change category — discuss with the team first if it affects the canonical workflow.

### 3. Test your changes locally

Before pushing, test the skill on a real or hypothetical project:

1. Symlink (or copy) the changed plugin into your local skills directory:
   ```bash
   # Windows
   rm -r "$env:USERPROFILE\.claude\skills\codech-project-superpower"
   xcopy /E /I "plugins\codech-project-superpower\skills\codech-project-superpower" `
              "$env:USERPROFILE\.claude\skills\codech-project-superpower"
   ```
   ```bash
   # macOS / Linux
   rm -rf ~/.claude/skills/codech-project-superpower
   ln -s "$(pwd)/plugins/codech-project-superpower/skills/codech-project-superpower" \
         ~/.claude/skills/codech-project-superpower
   ```
2. Restart Claude Code
3. Try to invoke the skill with the triggers your change affects
4. Verify the output

### 4. Bump the version

Update **both** manifests:

`.claude-plugin/marketplace.json`:
```json
{
  "plugins": [
    {
      "name": "codech-project-superpower",
      "version": "1.0.1",    // ← bump this
      ...
    }
  ]
}
```

`plugins/codech-project-superpower/.claude-plugin/plugin.json`:
```json
{
  "version": "1.0.1",        // ← match
  ...
}
```

Versioning rules:
- **Patch (1.0.X):** Bug fixes, typos, gotcha additions, minor template polish
- **Minor (1.X.0):** New templates, new recipes, new screens in prototype, new industry/locale adaptations
- **Major (X.0.0):** Breaking changes to workflow phases, file conventions, or skill name

### 5. Add a CHANGELOG entry

Edit `CHANGELOG.md` and add a new section under the plugin:

```markdown
### [1.0.1] — 2026-MM-DD

**Fixed:**
- gotcha: <description>

**Added:**
- recipe: <description>
```

### 6. Commit and push

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
git add -A
git commit -m "fix(superpower): add gotcha for Babel JSX blank page"
# or
git commit -m "feat(superpower): add recipe for docx extraction"
# or
git commit -m "docs(superpower): clarify bilingual file naming"
```

Push to `main` (or open a PR if your team uses code review):

```bash
git push origin main
```

### 7. Notify the team

Post in your team channel:

```
codech-project-superpower v1.0.1 released.

Changes:
- Added gotcha for <X>
- Improved template for <Y>

To update: /plugin marketplace update codech-marketplace && /plugin update codech-project-superpower
```

---

## What NOT to contribute

- **Project-specific content.** If something is unique to one client, it doesn't belong in the skill. Put it in that project's CLAUDE.md.
- **Speculative additions.** Features "we might need someday" make the skill harder to use. Add when there's a real second project demanding it.
- **Personal preferences without justification.** "I like 4-space indents" is not a contribution. "Switching to 4-space indents because most templates use 4-space and mixing causes Markdown rendering issues" is.
- **Copy-pasted real client data.** Anonymize. Sample data should look real but not BE real.

---

## When to create a new plugin (vs. edit `codech-project-superpower`)

Create a new plugin when the workflow is fundamentally different:

| Workflow | Plugin |
|---|---|
| Take requirements → produce proposal + specs + prototype | `codech-project-superpower` (this one) |
| Draft commercial documents (MSA, SOW, DPA) | `codech-contract-templates` (future) |
| Generate reusable production system prompts | `codech-ai-prompt-library` (future) |
| Apply a standard deployment runbook | `codech-deployment-runbook` (future) |
| Auto-generate UAT test scripts from SRS REQs | `codech-uat-test-generator` (future) |

To add a new plugin:

1. Create `plugins/<new-plugin-name>/` with the standard structure
2. Add an entry to `.claude-plugin/marketplace.json` under `plugins`
3. Follow the same SKILL.md conventions as `codech-project-superpower`
4. Add to the marketplace's top-level README "Available Plugins" table
5. Add to CHANGELOG.md
6. Bump marketplace version (minor)

---

## Code review expectations

For changes affecting the workflow itself (`SKILL.md`):
- At least one other team member reviews
- Discuss in team channel before merging
- Tag as `breaking` if it changes file naming or phase order

For gotchas, templates, recipes:
- Self-merge is fine if it follows the format
- Be honest about what was actually tested

---

## Maintainer responsibilities

If you're listed as a maintainer:

- Review PRs within 3 business days
- Bump versions correctly
- Keep CHANGELOG current
- Quarterly: review the entire skill for outdated info (e.g., library versions in `poc-prototype-html.md`)
- Annual: re-test the full workflow on a fresh project and update battle-tested defaults

---

## Questions?

Open an issue or post in the team channel.
