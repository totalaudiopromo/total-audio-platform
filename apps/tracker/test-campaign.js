// Test campaign creation with correct schema
const testCampaign = {
  name: 'BBC Radio 1 - Test Campaign',
  platform: 'BBC Radio',
  genre: 'Electronic',
  start_date: '2025-10-04',
  budget: 450,
  target_reach: 20,
  actual_reach: 25,
  status: 'active',
};

console.log('Test campaign data:');
console.log(JSON.stringify(testCampaign, null, 2));

// This matches the database schema:
// - name ✓
// - platform ✓ (BBC Radio, Commercial Radio, Playlists, Blog, PR)
// - genre ✓ (Electronic, Indie, Jazz, Pop, Rock, Hip-Hop, R&B, Country, Other)
// - start_date ✓
// - budget ✓ (DECIMAL - will be converted via parseFloat in API)
// - target_reach ✓ (INTEGER - will be converted via parseInt in API)
// - actual_reach ✓ (INTEGER - will be converted via parseInt in API)
// - status ✓ (active or completed)
// - notes field optional ✓
