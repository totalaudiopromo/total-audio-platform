#!/usr/bin/env bash
set -euo pipefail

BOT_TOKEN="${TELEGRAM_BOT_TOKEN:?Missing bot token}"
CHAT_ID="${TELEGRAM_CHAT_ID:?Missing chat id}"
REPO_NAME="${GITHUB_REPOSITORY##*/}"

if [[ "$REPO_NAME" == "total-audio-platform" ]]; then
  PREFIX="🎧 [Platform]"
elif [[ "$REPO_NAME" == "totalaud.io" ]]; then
  PREFIX="🌌 [Totalaud.io]"
else
  PREFIX="💡 [${REPO_NAME}]"
fi

MSG="${1:-${MESSAGE:-No message provided}}"

curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
  -d chat_id="${CHAT_ID}" \
  -d parse_mode="Markdown" \
  --data-urlencode text="${PREFIX} ${MSG}"
