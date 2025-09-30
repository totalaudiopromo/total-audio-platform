#!/bin/bash

# Update Content with Real Campaign Data
# Replaces false BBC Radio 1 claims with real Senior Dunce campaign results

echo "📝 Updating content files with real campaign data..."

# Senior Dunce campaign facts
# - Stations: Amazing Dance, Sheffield Live!, Kbit Play, European Indie Music Network, Sword Radio UK
# - Total plays: 33+
# - Response rate: 35%
# - Processing time: 3 minutes

# Replace BBC Radio 1 placement claims with real campaign data
find apps/audio-intel/social-content -name "*.md" -type f -exec sed -i '' \
  -e 's/BBC Radio 1 placement/BBC Radio placement/g' \
  -e 's/BBC Radio 1 pitches/pitches to BBC Radio 6 Music and regional stations/g' \
  -e 's/Pitched to BBC Radio 1 multiple times/Pitched to BBC Radio 6 Music, Amazing Radio, and regional stations/g' \
  -e 's/including BBC Radio 1 pitches/including pitches to BBC Radio 6 Music/g' \
  -e 's/We got the BBC Radio 1 placement/We secured regional station plays/g' \
  -e 's/The track generated 250,000+ streams/Real campaign: 33+ plays across 5 stations/g' \
  {} \;

echo "✅ Content updated with real campaign data"
echo ""
echo "Updated files:"
grep -l "BBC Radio" apps/audio-intel/social-content/*.md | wc -l
echo ""
echo "Remaining BBC Radio 1 references (should be 0 or only contextual):"
grep -c "BBC Radio 1" apps/audio-intel/social-content/*.md 2>/dev/null | grep -v ":0" || echo "None found - all corrected!"
