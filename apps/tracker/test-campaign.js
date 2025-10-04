// Test campaign creation with correct schema
const testCampaign = {
  name: 'BBC Radio 1 - Test Campaign',
  platform: 'radio',
  genre: 'Electronic',
  start_date: '2025-10-04',
  budget: 450,
  target_reach: 20,
  actual_reach: 25,
  status: 'active'
};

console.log('Test campaign data:');
console.log(JSON.stringify(testCampaign, null, 2));

// This matches the database schema:
// - name ✓
// - platform ✓ (radio, playlist, blog, pr)
// - genre ✓ (Electronic, Indie, etc.)
// - start_date ✓
// - budget ✓
// - target_reach ✓ (instead of target_metric)
// - actual_reach ✓ (instead of actual_metric)
// - status ✓
// - NO notes field ✓
