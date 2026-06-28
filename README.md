# Codech Claude Marketplace

> Codech's internal collection of Claude Code plugins — workflows, skills, and tools used across client engagements.

A Claude Code [marketplace](https://docs.claude.com/en/docs/claude-code/plugin-marketplaces) installable by anyone on the Codech team.

---

## Available Plugins

| Plugin | Version | Description |
|---|---|---|
| [`codech-project-superpower`](./plugins/codech-project-superpower) | `1.0.0` | End-to-end pre-development workflow: requirements docs → bilingual proposal (MD/HTML/PDF) → FSD/SAD/TDD/SRS → interactive React prototype |
| [`codech-client-proposal`](./plugins/codech-client-proposal) | `1.0.0` | Packages a Codech engagement into a deployed, client-shareable HTML proposal. Applies a per-client design system to the canonical proposal anatomy, captures prototype screenshots via Playwright, deploys to Cloudflare Pages with a `*.pages.dev` URL |

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

### Step 2 — Install a plugin

Install whichever plugins you need. Example for the pre-development workflow:

```
/plugin install codech-project-superpower@codech-marketplace
```

Or for the deployed-proposal delivery workflow:

```
/plugin install codech-client-proposal@codech-marketplace
```

Both are installable side-by-side — they compose: `codech-project-superpower` produces the prototype + design system, and `codech-client-proposal` packages those into a deployed proposal site.

That's it. Restart Claude Code and the skill will activate automatically based on trigger phrases (see each plugin's README).

### Verify installation

```
/plugin list
```

You should see the installed plugins listed under `codech-marketplace`.

---

## Usage

Once installed, the skills activate automatically based on what you say.

### `codech-project-superpower` triggers on:

- _"Generate a project proposal from these requirement docs"_
- _"Scope this project"_
- _"Draft the FSD / SAD / TDD / SRS"_
- _"Build a PoC prototype"_
- _"Convert the proposal to HTML and PDF"_

Or when Claude detects a `Requirements doc/` folder in your project.

See [`plugins/codech-project-superpower/README.md`](./plugins/codech-project-superpower/README.md) for the full skill documentation.

### `codech-client-proposal` triggers on:

- _"Build a proposal"_ / _"draft a client proposal"_
- _"Make a proposal site"_ / _"deploy the proposal"_
- _"Cloudflare Pages proposal"_ / _"package as proposal"_
- _"Capture mockup screenshots for the proposal"_
- _"Add password protection to the proposal"_

Or when Claude detects a `design-system.md` and `prototype-app/*.html` files in your project.

See [`plugins/codech-client-proposal/README.md`](./plugins/codech-client-proposal/README.md) for the full skill documentation.

### Composing the two plugins

The typical Codech engagement uses both in sequence:

```
codech-project-superpower      codech-client-proposal
─────────────────────────  →   ─────────────────────────
Requirements → FSD/SRS         design-system + prototype
+ React prototype              + content → deployed
                               *.pages.dev URL
```

---

## Updates

Plugins are updated whenever new lessons are learned from real engagements. To pull the latest versions:

```
/plugin marketplace update codech-marketplace
/plugin update codech-project-superpower
/plugin update codech-client-proposal
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
│   └── marketplace.json              # Marketplace manifest (lists all plugins)
├── plugins/
│   ├── codech-project-superpower/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json           # Plugin manifest
│   │   ├── README.md                 # Plugin docs
│   │   └── skills/
│   │       └── codech-project-superpower/
│   │           ├── SKILL.md          # Main orchestrator
│   │           ├── gotchas.md        # Battle-tested fixes
│   │           ├── templates/        # Document structures
│   │           └── recipes/          # Reusable commands
│   └── codech-client-proposal/
│       ├── .claude-plugin/
│       │   └── plugin.json           # Plugin manifest
│       ├── README.md                 # Plugin docs
│       └── skills/
│           └── codech-client-proposal/
│               ├── SKILL.md          # 6-step workflow entry point
│               ├── references/       # Anatomy, idioms, deploy, voice
│               ├── scripts/          # Playwright + wrangler runners
│               ├── assets/           # Logo, closing section, skeleton
│               └── examples/         # JY Global worked reference
├── LICENSE                            # MIT
├── CHANGELOG.md                       # Version history
├── CONTRIBUTING.md                    # How to update plugins
└── README.md                          # This file
```

---

## For Maintainers — How to Update a Plugin

Each plugin's content lives in **`plugins/<plugin-name>/skills/<skill-name>/`**.

To improve a plugin based on a new engagement:

1. Clone this repo (if you haven't):
   ```bash
   git clone https://github.com/codech-dev/Codech-Claude-Marketplace.git
   cd Codech-Claude-Marketplace
   ```
2. Edit the relevant file(s) inside the plugin's skill folder
3. Bump the version in BOTH:
   - `.claude-plugin/marketplace.json` → the matching `plugins[].version`
   - `plugins/<plugin-name>/.claude-plugin/plugin.json` → `version`
4. Add an entry to `CHANGELOG.md`
5. Commit and push:
   ```bash
   git add -A
   git commit -m "feat(<plugin-name>): <what changed>"
   git push
   ```
6. Notify the team to run `/plugin marketplace update codech-marketplace` followed by `/plugin update <plugin-name>`

Versioning follows [Semantic Versioning](https://semver.org/):
- **Patch (1.0.x):** Bug fixes, typo corrections, gotcha additions
- **Minor (1.x.0):** New references, new recipes, new templates
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
