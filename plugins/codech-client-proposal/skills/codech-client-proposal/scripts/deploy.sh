#!/bin/bash
# Deploy a proposal to Cloudflare Pages.
#
# Usage:
#   ./deploy.sh PROPOSAL_FILE PROJECT_NAME [--create]
#
# Example:
#   ./deploy.sh "Client Name Proposal.html" client-proposal
#   ./deploy.sh "Client Name Proposal.html" client-proposal --create   # first deploy
#
# Assumes:
#   - wrangler is installed and authenticated
#   - codech-logo.png exists in the same folder as PROPOSAL_FILE
#   - screenshots/ folder (if any) exists in the same folder
#
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "usage: $0 PROPOSAL_FILE PROJECT_NAME [--create]"
  exit 1
fi

PROPOSAL_FILE="$1"
PROJECT_NAME="$2"
CREATE_FLAG="${3:-}"

if [[ ! -f "$PROPOSAL_FILE" ]]; then
  echo "error: proposal file not found: $PROPOSAL_FILE"
  exit 1
fi

# Create deploy folder
mkdir -p _deploy/screenshots

# Copy proposal as index.html
cp "$PROPOSAL_FILE" _deploy/index.html

# Copy Codech logo
if [[ -f "codech-logo.png" ]]; then
  cp codech-logo.png _deploy/
else
  echo "warning: codech-logo.png not found in current directory — closing section will 404"
fi

# Copy screenshots if folder exists
if [[ -d "screenshots" ]]; then
  cp screenshots/*.png _deploy/screenshots/ 2>/dev/null || echo "  (no screenshots to copy)"
fi

# Create project on first deploy
if [[ "$CREATE_FLAG" == "--create" ]]; then
  echo "→ creating Cloudflare Pages project: $PROJECT_NAME"
  wrangler pages project create "$PROJECT_NAME" --production-branch=main
fi

# Deploy
echo "→ deploying _deploy/ to $PROJECT_NAME"
wrangler pages deploy _deploy \
  --project-name="$PROJECT_NAME" \
  --branch=main \
  --commit-dirty=true

echo ""
echo "✨ Production URL: https://$PROJECT_NAME.pages.dev"
