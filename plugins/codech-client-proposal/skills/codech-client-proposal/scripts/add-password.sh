#!/bin/bash
# Add HTTP Basic Auth password protection to a deployed Cloudflare Pages proposal.
#
# Usage:
#   ./add-password.sh PROJECT_NAME [USERNAME]
#
# The script:
#   1. Creates _deploy/functions/_middleware.js with Basic Auth gate
#   2. Prompts you (the human) for the password — does NOT invent one
#   3. Uploads the password as a Pages secret
#   4. Reminds you to redeploy
#
# Example:
#   ./add-password.sh client-proposal jyglobal
#
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: $0 PROJECT_NAME [USERNAME=client]"
  exit 1
fi

PROJECT_NAME="$1"
USERNAME="${2:-client}"

# Create middleware folder
mkdir -p _deploy/functions

# Write the middleware
cat > _deploy/functions/_middleware.js <<'EOF'
// HTTP Basic Auth gate. Reads PROPOSAL_USERNAME + PROPOSAL_PASSWORD from env.
// If PROPOSAL_PASSWORD is unset, allows all requests (graceful fallback).
export async function onRequest(context) {
  const { request, env, next } = context;
  const realm = 'Client Proposal';

  const username = env.PROPOSAL_USERNAME || 'client';
  const password = env.PROPOSAL_PASSWORD;

  if (!password) return next();

  const auth = request.headers.get('Authorization') || '';
  if (auth.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const sep = decoded.indexOf(':');
      const providedUser = decoded.slice(0, sep);
      const providedPass = decoded.slice(sep + 1);
      if (providedUser === username && providedPass === password) return next();
    } catch (_) {}
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${realm}", charset="UTF-8"`,
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
EOF

echo "✓ Created _deploy/functions/_middleware.js"
echo ""

# Set username
echo "→ Setting PROPOSAL_USERNAME=$USERNAME"
echo "$USERNAME" | wrangler pages secret put PROPOSAL_USERNAME --project-name="$PROJECT_NAME"
echo ""

# Prompt for password (don't invent one; user must provide)
echo "Now set the password. You'll be prompted for it (won't echo):"
wrangler pages secret put PROPOSAL_PASSWORD --project-name="$PROJECT_NAME"
echo ""

echo "✨ Password protection configured."
echo "Next step: redeploy to activate the middleware:"
echo ""
echo "  ./deploy.sh PROPOSAL_FILE $PROJECT_NAME"
echo ""
echo "After redeploy, the site will prompt for username/password on first visit."
