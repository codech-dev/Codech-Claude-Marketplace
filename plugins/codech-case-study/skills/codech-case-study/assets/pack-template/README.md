# {{Product name}} — portfolio asset pack

Everything needed to design a portfolio case study for {{Product name}}. **Start with `PROJECT_BRIEF.md`**: it has the story, features, stack, numbers and engineering highlights.

```
{{pack-folder}}/
├── PROJECT_BRIEF.md          ← the case-study content (read first)
├── README.md                 ← this file
├── stats.json                raw numbers behind "By the numbers" (from gather_stats.py)
├── brand/                    logos, favicon, login/hero images, design tokens (CSS)
├── screenshots/
│   ├── app-walkthrough/      full-app screenshots (JPG, 2x), best for hero/gallery use
│   ├── ui-screens/           component/screen captures (PNG), e.g. from the visual-regression suite
│   ├── mobile/               phone-width screens
│   └── early-mockups/        pre-build proposal mockups (good for a "process" section)
├── prototype/                the client-approved clickable prototype (+ its local assets) and user guide
├── proposal/                 the proposal site we pitched with (HTML) or its URL in LINKS.md
├── docs/                     design system + requirements/architecture specs (internal reference; redacted)
└── extras/                   next-phase proposals and anything else
```

## Brand quick reference

| Token | Value | Use |
|---|---|---|
| {{Primary}} | `{{#hex}}` | {{use}} |
| Font | **{{font}}** | |

Full token list: `brand/design-tokens.css`.

## Suggested hero shots

- `screenshots/app-walkthrough/{{file}}`: {{what it shows}}

## Notes

- {{CDN dependencies of the prototype, how to open it}}
- Confirm with the client what may be published (see the end of `PROJECT_BRIEF.md`).
- `scan_pack.py` report from {{date}}: {{summary of what was redacted / needs a decision}}.
