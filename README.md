# Codech Claude Marketplace

> Codech's internal collection of Claude Code plugins — workflows, skills, and tools used across client engagements.

A Claude Code [marketplace](https://docs.claude.com/en/docs/claude-code/plugin-marketplaces) installable by anyone on the Codech team.

---

## Available Plugins

| Plugin | Version | Description |
|---|---|---|
| [`codech-project-superpower`](./plugins/codech-project-superpower) | `1.0.0` | End-to-end pre-development workflow: requirements docs → bilingual proposal (MD/HTML/PDF) → FSD/SAD/TDD/SRS → interactive React prototype |

More plugins will be added over time.

---

## Installation

### Step 1 — Add the marketplace (one-time)

In Claude Code (any project), run:

```
/plugin marketplace add codech-dev/Codech-Claude-Marketplace
```

> If the repo is **private**, see [Private Repo Setup](#private-repo-setup) below.

Claude Code will fetch `.claude-plugin/marketplace.json` and confirm the marketplace was added.

### Step 2 — Install the plugin

```
/plugin install codech-project-superpower@codech-marketplace
```

That's it. Restart Claude Code and the skill will activate automatically based on trigger phrases (see plugin README).

### Verify installation

```
/plugin list
```

You should see `codech-project-superpower` listed under `codech-marketplace`.

---

## Usage

Once installed, the skill activates automatically when you say things like:

- _"Generate a project proposal from these requirement docs"_
- _"Scope this project"_
- _"Draft the FSD / SAD / TDD / SRS"_
- _"Build a PoC prototype"_
- _"Convert the proposal to HTML and PDF"_

Or when Claude detects a `Requirements doc/` folder in your project.

See [`plugins/codech-project-superpower/README.md`](./plugins/codech-project-superpower/README.md) for the full skill documentation.

---

## Updates

The plugin is updated whenever new lessons are learned from real engagements. To pull the latest version:

```
/plugin marketplace update codech-marketplace
/plugin update codech-project-superpower
```

Run this periodically — especially before starting a new client project.

---

## Private Repo Setup

If this marketplace is hosted on a **private** GitHub repo, your team members need a GitHub token configured in Claude Code before they can install:

1. Generate a fine-grained Personal Access Token at <https://github.com/settings/tokens?type=beta>
   - **Repository access:** Only this repository (`Codech-Claude-Marketplace`)
   - **Permissions → Contents:** Read-only
2. In Claude Code, set the token via environment variable:
   ```powershell
   # Windows PowerShell
   [Environment]::SetEnvironmentVariable("GITHUB_TOKEN", "ghp_xxxxx", "User")
   ```
   ```bash
   # macOS / Linux
   echo 'export GITHUB_TOKEN="ghp_xxxxx"' >> ~/.zshrc   # or ~/.bashrc
   source ~/.zshrc
   ```
3. Restart Claude Code, then run the `/plugin marketplace add` command above.

---

## Repository Structure

```
Codech-Claude-Marketplace/
├── .claude-plugin/
│   └── marketplace.json              # Marketplace manifest
├── plugins/
│   └── codech-project-superpower/
│       ├── .claude-plugin/
│       │   └── plugin.json           # Plugin manifest
│       ├── README.md                 # Plugin docs
│       └── skills/
│           └── codech-project-superpower/
│               ├── SKILL.md          # Main orchestrator
│               ├── gotchas.md        # Battle-tested fixes
│               ├── templates/        # Document structures
│               │   ├── proposal-structure.md
│               │   ├── pre-dev-docs-structure.md
│               │   └── poc-prototype-html.md
│               └── recipes/          # Reusable commands
│                   ├── pdf-export.md
│                   └── architecture-diagram.md
├── LICENSE                            # MIT
├── CHANGELOG.md                       # Version history
├── CONTRIBUTING.md                    # How to update the skill
└── README.md                          # This file
```

---

## For Maintainers — How to Update the Skill

The skill content lives in **`plugins/codech-project-superpower/skills/codech-project-superpower/`**.

To improve the skill based on a new project:

1. Clone this repo (if you haven't):
   ```bash
   git clone https://github.com/codech-dev/Codech-Claude-Marketplace.git
   cd Codech-Claude-Marketplace
   ```
2. Edit the relevant file(s) in `plugins/codech-project-superpower/skills/codech-project-superpower/`
3. Bump the version in BOTH:
   - `.claude-plugin/marketplace.json` → `plugins[0].version`
   - `plugins/codech-project-superpower/.claude-plugin/plugin.json` → `version`
4. Add an entry to `CHANGELOG.md`
5. Commit and push:
   ```bash
   git add -A
   git commit -m "feat(superpower): <what changed>"
   git push
   ```
6. Notify the team to run `/plugin marketplace update codech-marketplace` followed by `/plugin update codech-project-superpower`

Versioning follows [Semantic Versioning](https://semver.org/):
- **Patch (1.0.x):** Bug fixes, typo corrections, gotcha additions
- **Minor (1.x.0):** New templates, new recipes, new screens in prototype scaffold
- **Major (x.0.0):** Breaking changes to workflow phases or naming conventions

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidance.

---

## Roadmap

Potential future plugins for this marketplace:

- `codech-contract-templates` — MSA, SOW, DPA generation
- `codech-ai-prompt-library` — Reusable production-grade system prompts
- `codech-deployment-runbook` — Standard Codech deployment patterns
- `codech-uat-test-generator` — Auto-generate UAT scripts from SRS REQ IDs

Suggestions welcome — open an issue or PR.

---

## License

[MIT](./LICENSE) — use freely within Codech and beyond. Attribution appreciated but not required.

---

## Contact

- **Team:** Codech Engineering
- **Email:** team@codech.dev
- **Issues:** [GitHub Issues](https://github.com/codech-dev/Codech-Claude-Marketplace/issues)
