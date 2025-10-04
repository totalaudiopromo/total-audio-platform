#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DEFAULT_TEMPLATE_DIR="$REPO_ROOT/apps/tap-saas-template"

RAW_TARGET="${1:-$DEFAULT_TEMPLATE_DIR}"
if [[ "$RAW_TARGET" != /* ]]; then
  TARGET_DIR="$REPO_ROOT/$RAW_TARGET"
else
  TARGET_DIR="$RAW_TARGET"
fi

if [[ ! -d "$TARGET_DIR" ]]; then
  echo "❌ Target directory '$TARGET_DIR' not found. Pass an absolute path or repo-relative path." >&2
  exit 1
fi

pushd "$TARGET_DIR" > /dev/null

if [[ ! -f ".env.local" ]]; then
  if [[ -f ".env.local.example" ]]; then
    echo "📄 Copying .env.local.example → .env.local"
    cp .env.local.example .env.local
  else
    echo "⚠️  No .env.local.example found; skipping env copy." >&2
  fi
else
  echo "✅ .env.local already present (skipping copy)"
fi

echo "📦 Installing dependencies"
npm install >/dev/null

echo "🧹 Running lint to ensure template is ready"
npm run lint >/dev/null || {
  echo "⚠️  Lint reported issues. Review output above." >&2
}

echo "🚀 Development server: npm run dev"

popd > /dev/null
