#!/bin/bash

# Script to add analytics tracking to all PSEO pages

# Array of pages with their metadata
declare -A pages
pages[bbc-radio-1-contact-enrichment]="bbc-radio-1:1200:1"
pages[bbc-radio-6-music-contact-enrichment]="bbc-6-music:800:1"
pages[bbc-radio-1xtra-contact-enrichment]="bbc-1xtra:600:2"
pages[spotify-editorial-playlist-contacts]="spotify-editorial:2000:1"
pages[apple-music-editorial-contacts]="apple-music-editorial:1500:1"
pages[bbc-radio-2-contact-enrichment]="bbc-radio-2:500:2"
pages[kerrang-radio-contact-enrichment]="kerrang-radio:350:2"
pages[absolute-radio-contact-enrichment]="absolute-radio:300:2"

for page in "${!pages[@]}"; do
  IFS=':' read -r topic volume tier <<< "${pages[$page]}"
  file="app/blog/${page}/page.tsx"

  echo "Adding analytics to $page (topic: $topic, volume: $volume, tier: $tier)"

  # Add import at top if not already present
  if ! grep -q "PSEOPageWrapper" "$file"; then
    sed -i '' '1s/^/import { PSEOPageWrapper } from "@\/app\/components\/PSEOPageWrapper";\n/' "$file"
  fi

  # Add wrapper opening after function return statement
  sed -i '' "s/export default function.*{$/&\n  return (\n    <PSEOPageWrapper\n      pageName=\"${page}\"\n      topic=\"${topic}\"\n      searchVolume={${volume}}\n      tier={${tier}}\n    >/" "$file"

  # Add closing wrapper before final closing braces
  sed -i '' 's/^    <\/article>$/&\n    <\/PSEOPageWrapper>/' "$file"

  echo "✓ Done: $page"
done

echo ""
echo "✅ Analytics added to all 8 PSEO pages!"
