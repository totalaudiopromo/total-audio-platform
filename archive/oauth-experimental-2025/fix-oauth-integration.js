#!/usr/bin/env node

/**
 * Fix OAuth Integration - Action Plan
 *
 * Provides step-by-step guidance to resolve Google OAuth integration
 */

const { checkOAuthStatus } = require('./oauth-status-check');

console.log('🔧 Fix OAuth Integration - Action Plan\n');

// Get current status
const status = checkOAuthStatus();

console.log('\n' + '='.repeat(60));
console.log('🎯 ACTION PLAN: Fix Google OAuth Integration');
console.log('='.repeat(60));

if (status.credentials && status.tokens) {
  console.log('✅ OAuth is already working! No action needed.');
  console.log('\n🧪 Test with:');
  console.log('   node radio-promo-agent.js find-liberty-campaigns-gmail');
  process.exit(0);
}

console.log('\n📋 REQUIRED GOOGLE CLOUD CONSOLE UPDATES:\n');

console.log('1️⃣  OAuth Consent Screen Configuration');
console.log('    🔗 https://console.cloud.google.com/apis/credentials/consent?project=gleaming-realm-471715-p3');
console.log('    ✅ Add authorized domains: localhost, 127.0.0.1');
console.log('    ✅ Set app type to "External" if testing');
console.log('    ✅ Add test users if needed\n');

console.log('2️⃣  OAuth Credentials Configuration');
console.log('    🔗 https://console.cloud.google.com/apis/credentials?project=gleaming-realm-471715-p3');
console.log('    ✅ Edit OAuth Client ID: 309298460159-4gcfsvpup4og77r0mifta91s8f651875.apps.googleusercontent.com');
console.log('    ✅ Add redirect URIs:');
console.log('       - http://localhost:8080');
console.log('       - http://127.0.0.1:8080');
console.log('       - postmessage (already exists)');
console.log('       - urn:ietf:wg:oauth:2.0:oob\n');

console.log('3️⃣  Enable Required APIs');
console.log('    Gmail API:    https://console.cloud.google.com/apis/library/gmail.googleapis.com?project=gleaming-realm-471715-p3');
console.log('    Drive API:    https://console.cloud.google.com/apis/library/drive.googleapis.com?project=gleaming-realm-471715-p3');
console.log('    Calendar API: https://console.cloud.google.com/apis/library/calendar-json.googleapis.com?project=gleaming-realm-471715-p3\n');

console.log('📝 AFTER GOOGLE CLOUD CONSOLE UPDATES:\n');

console.log('4️⃣  Test OAuth Flow');
console.log('    💻 Run: node simple-oauth-test.js');
console.log('    🌐 Open generated OAuth URL in browser');
console.log('    📋 Copy authorization code from browser');
console.log('    🔄 Run: node simple-oauth-test.js YOUR_AUTH_CODE\n');

console.log('5️⃣  Verify Integration');
console.log('    🧪 Test: node radio-promo-agent.js find-liberty-campaigns-gmail');
console.log('    ✅ Should connect successfully to Gmail, Drive, and Calendar\n');

console.log('🆘 FALLBACK OPTIONS:\n');

console.log('🔄 MCP Server (Already Available)');
console.log('   The agent can use the MCP server fallback until OAuth is configured');
console.log('   This provides the same Gmail/Drive/Calendar functionality\n');

console.log('🚨 COMMON ERRORS & SOLUTIONS:\n');

console.log('❌ "invalid_client" Error');
console.log('   → OAuth consent screen not configured');
console.log('   → Check step 1️⃣  above\n');

console.log('❌ "no registered origin" Error');
console.log('   → Missing redirect URIs');
console.log('   → Check step 2️⃣  above\n');

console.log('❌ "invalid_grant" Error');
console.log('   → Authorization code expired or incorrect');
console.log('   → Get fresh code from OAuth URL\n');

console.log('❌ "Access blocked" Error');
console.log('   → APIs not enabled');
console.log('   → Check step 3️⃣  above\n');

console.log('📚 DOCUMENTATION:\n');
console.log('   📄 oauth-setup-guide.md   - Detailed setup instructions');
console.log('   🔍 oauth-status-check.js  - Check current status');
console.log('   🧪 simple-oauth-test.js   - Test OAuth flow');
console.log('   🤖 radio-promo-agent.js   - Main agent (can use MCP fallback)\n');

console.log('🎯 NEXT IMMEDIATE ACTION:\n');
console.log('   1. Complete Google Cloud Console updates (steps 1️⃣ -3️⃣ )');
console.log('   2. Test OAuth flow (step 4️⃣ )');
console.log('   3. Verify integration works (step 5️⃣ )\n');

console.log('💡 The agent is functional now using MCP server fallback,');
console.log('   but direct OAuth integration will be faster and more reliable.');

process.exit(0);