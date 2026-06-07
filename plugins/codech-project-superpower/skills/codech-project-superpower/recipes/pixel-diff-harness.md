# Recipe — Pixel-Diff Harness (Phase 5)

## Stack scope

**Tool-specific to Playwright**, but the **discipline is universal** for any visual-regression tool (Cypress + cypress-image-snapshot, Percy, Chromatic, Loki, BackstopJS, …).

The stack-agnostic decisions worth keeping no matter which tool you choose:
- **Cross-platform baselines** committed in two folders, one per OS used by devs and CI
- **Match the CI runner OS to the baseline OS** — font rendering differs enough to fail
- **Generate baselines for "the other OS"** via a container image (Microsoft Playwright Noble Docker image in this recipe; equivalents exist for other tools)
- **Threshold ≈ 0.001** (0.1% pixel diff allowed) — tighter is brittle, looser hides regressions
- **Pin timezone + locale** in the test runner so date/time strings render identically
- **Wait for `document.fonts.ready` + network idle** before snapping
- **PR that changes UI without baseline updates fails CI** — this is the contract

The rest of this recipe is the Playwright implementation.

---

> The prototype is the visual contract. This recipe wires up an automated check that every screen still matches it. Without this, drift is invisible until the client demos the system.

## Goal

- Playwright runs every `*.spec.ts` in `tests/visual/`.
- Each spec navigates to a real route, mocks auth, takes a screenshot, and compares against a baseline.
- Baselines are committed in two folders so dev (Windows/macOS) and CI (Linux) can both pass.
- Diff threshold defaults to `0.001` (0.1% of pixels may differ).

## Stack

- `@playwright/test` (top-level + Linux baselines installed via Docker)
- One config: `playwright.config.ts` at the web app root
- A `tests/visual/_helpers.ts` for `seedAuth()` + viewport defaults

## File layout

```
apps/web/
├── playwright.config.ts
├── tests/
│   └── visual/
│       ├── _helpers.ts
│       ├── login.spec.ts
│       ├── dashboard.spec.ts
│       └── <screen>.spec.ts
└── tests/visual/__screenshots__/
    ├── chromium-win32/
    │   ├── login.spec.ts/
    │   │   └── login.png
    │   └── ...
    └── chromium-linux/
        ├── login.spec.ts/
        │   └── login.png
        └── ...
```

Commit BOTH `chromium-win32/` and `chromium-linux/` folders. CI uses the Linux set; local dev (on Windows) uses Win32.

## `playwright.config.ts`

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: "list",
  use: {
    baseURL: "http://localhost:5173",
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    locale: "zh-HK",
    timezoneId: "Asia/Hong_Kong",
  },
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.001,   // 0.1% of pixels may differ
      animations: "disabled",
    },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
```

## `tests/visual/_helpers.ts`

```ts
import type { Page } from "@playwright/test";

export const FAKE_JWT_PAYLOAD = {
  sub: "user_test",
  email: "tester@<client>.org",
  roles: ["admin"],
  exp: Math.floor(Date.now() / 1000) + 60 * 60,
};

export async function seedAuth(page: Page, payload = FAKE_JWT_PAYLOAD) {
  // Build a base64url JWT with the correct padding rules
  const b64u = (obj: unknown) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");
  const token = `${b64u({ alg: "none", typ: "JWT" })}.${b64u(payload)}.`;

  // IMPORTANT: addInitScript closures do NOT capture outer scope after serialization.
  // Pass the token via the second-arg payload.
  await page.addInitScript(({ token }) => {
    window.localStorage.setItem("cgg.access_token", token);
  }, { token });
}

export async function waitForStableLayout(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");
}
```

## Example spec (`tests/visual/dashboard.spec.ts`)

```ts
import { expect, test } from "@playwright/test";
import { seedAuth, waitForStableLayout } from "./_helpers";

test("dashboard matches prototype", async ({ page }) => {
  await seedAuth(page);
  await page.goto("/dashboard");
  await waitForStableLayout(page);

  // Use exact-match selectors. text= substring matches cause flake.
  await expect(
    page.getByRole("button", { name: "新增訂單", exact: true })
  ).toBeVisible();

  await expect(page).toHaveScreenshot("dashboard.png");
});
```

## Generating cross-platform baselines

**Windows host generating Linux baselines** (the part that bit us):

```powershell
# From the apps/web folder
docker run --rm `
  -v "${PWD}:/work" `
  -w /work `
  --network host `
  mcr.microsoft.com/playwright:v1.46.1-noble `
  bash -c "
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g pnpm@11 && \
    pnpm install --frozen-lockfile && \
    pnpm test:visual --update-snapshots
  "

# CRITICAL: re-install node_modules locally — Docker overwrote them with Linux binaries
pnpm install --frozen-lockfile
```

**Linux baselines must be committed alongside Win32 baselines.** CI uses the Linux ones.

## CI workflow

```yaml
# .github/workflows/visual.yml
jobs:
  visual:
    runs-on: ubuntu-24.04   # MUST match the noble Docker image used for baselines
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "22.13" }
      - uses: pnpm/action-setup@v3
        with: { version: 11 }
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm test:visual
```

## Failure modes (and what to check)

| Symptom | Likely cause | Fix |
|---|---|---|
| CI fails with "expected" vs "actual" font hints | CI runner ≠ baseline platform | Match runner OS to Docker image (noble → ubuntu-24.04) |
| Local pass, CI fail on antialiasing edges | Threshold too tight | Bump to 0.001 if you're below it; do NOT raise above 0.005 |
| Flake on first run | Fonts not loaded | Use `await document.fonts.ready` |
| Flake on dynamic data | Timestamps, IDs in DOM | Pin timezone in `use.timezoneId` + mock `Date.now()` if needed |
| `text=label` fails intermittently | Substring match | Use `getByRole("button", { name, exact: true })` |
| `addInitScript` token missing in browser | Closure didn't capture | Pass data via second-arg payload |

## When UI legitimately changes

1. Update the UI code.
2. Regenerate **both** baselines (Win32 locally, Linux via Docker).
3. Visually diff old vs new baselines yourself — confirm the change is intentional.
4. Commit code + both baseline sets in the same PR.
5. PR description: link the relevant FSD feature ID + screenshot of the change.

## What NOT to do

- Do not commit only Win32 baselines and let CI fail — fix it before pushing.
- Do not raise the threshold to mask drift; investigate the cause.
- Do not skip the timezone pin in `playwright.config.ts` — date/time strings render differently per locale and break diffs.
- Do not screenshot the whole page when you mean to screenshot a component — full-page shots break on any layout shift elsewhere.
