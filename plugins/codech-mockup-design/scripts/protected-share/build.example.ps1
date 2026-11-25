# Example per-project build script. Copy to <project>/tools/build.ps1 together with protect-build.mjs,
# middleware.template.js, tracking-schema.sql and package.json, then edit the CONFIG block.
# Run from the PROJECT ROOT (a shell whose cwd is inside dist/ makes the rebuild fail with EPERM):
#   powershell -ExecutionPolicy Bypass -File .\tools\build.ps1                  # build only
#   powershell -ExecutionPolicy Bypass -File .\tools\build.ps1 -Deploy          # build + deploy
#   powershell -ExecutionPolicy Bypass -File .\tools\build.ps1 -Deploy -Expires 2026-12-07T23:59:59+08:00   # extend
param([switch]$Deploy, [string]$Expires = '2026-12-01T23:59:59+08:00')
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$utf8 = New-Object Text.UTF8Encoding $false

# ---------------- CONFIG ----------------
$code   = 'ACME'                                   # short client code used in the fingerprint ref
$tz     = 'Asia/Hong_Kong'                         # timezone shown on the /_stats dashboard
$about  = 'the ACME website preview link'          # used in the "request extension" WhatsApp message
$d1Name = 'cdx-proposal-tracking'                  # one shared D1 database for all Codech proposals
$d1Id   = '<database_id from: wrangler d1 info cdx-proposal-tracking>'
$sites  = [ordered]@{                              # pages project name -> fingerprint suffix
  'acme-design-direction' = 'DD'
  'acme-website-proposal' = 'PR'
}
# ----------------------------------------

function New-SiteFolder($dir) {
  if (Test-Path $dir) { Remove-Item -Recurse -Force $dir }
  New-Item -ItemType Directory -Force $dir | Out-Null
  Copy-Item -Recurse "$root\prototype-app" "$dir\prototype"
  if (Test-Path "$dir\prototype\_src") { Remove-Item -Recurse -Force "$dir\prototype\_src" }
  Set-Content -Path "$dir\_headers" -Value "/*`n  X-Robots-Tag: noindex, nofollow" -Encoding ascii
  Set-Content -Path "$dir\robots.txt" -Value "User-agent: *`nDisallow: /" -Encoding ascii
}

# 1) Assemble READABLE site folders in deploy/<project> (never deploy these directly).
#    Showcase pages reference ../../prototype-app/ in source; rewrite to the served prototype/ path.
$dd = "$root\deploy\acme-design-direction"
New-SiteFolder $dd
[IO.File]::WriteAllText("$dd\index.html", [IO.File]::ReadAllText("$root\docs\design\design-direction-client.html").Replace('../../prototype-app/', 'prototype/'), $utf8)
Copy-Item "$root\proposal\og-direction.jpg" "$dd\og-image.jpg"
Copy-Item "$root\proposal\favicon.png" $dd

$pr = "$root\deploy\acme-website-proposal"
New-SiteFolder $pr
Copy-Item "$root\proposal\index.html", "$root\proposal\og-image.jpg", "$root\proposal\favicon.png" $pr
New-Item -ItemType Directory -Force "$pr\design" | Out-Null
[IO.File]::WriteAllText("$pr\design\index.html", [IO.File]::ReadAllText("$root\docs\design\design-showcase.html").Replace('../../prototype-app/', '../prototype/'), $utf8)

# 2) Protected builds -> dist/<project>/{public,functions}
$stamp = Get-Date -Format 'yyMMdd'
foreach ($site in $sites.Keys) {
  node "$root\tools\protect-build.mjs" --src "$root\deploy\$site" --out "$root\dist\$site" `
    --ref "CDX-$code-$($sites[$site])-$stamp" --expires $Expires --site $site --sites "$root\tools\sites.json" `
    --tz $tz --about $about
  $toml = "name = `"$site`"`npages_build_output_dir = `"public`"`ncompatibility_date = `"2026-11-01`"`n`n[[d1_databases]]`nbinding = `"DB`"`ndatabase_name = `"$d1Name`"`ndatabase_id = `"$d1Id`"`n"
  [IO.File]::WriteAllText("$root\dist\$site\wrangler.toml", $toml, $utf8)
}

# 3) Deploy from dist/ (Functions + D1 binding come from wrangler.toml)
if ($Deploy) {
  foreach ($site in $sites.Keys) {
    Push-Location "$root\dist\$site"
    wrangler pages deploy --branch=main --commit-dirty=true
    Pop-Location
  }
}
