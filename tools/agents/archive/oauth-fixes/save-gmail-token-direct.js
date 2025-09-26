const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Your Liberty Music PR OAuth credentials
const clientId = '309298460159-relob8rbr4qpr6bduso8i6pr2egjfm0k.apps.googleusercontent.com';
const clientSecret = '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';
const redirectUri = 'http://localhost:3001/callback';

// Your authorization code from the OAuth flow
const authCode = '4/0AVMBsJirSHcqStlul4Tw_cr464k_CtTi7YGryQ_kwG9HLmMi1nS5G0s_LdcmCFZEwG-yAg';

async function saveGmailToken() {
  try {
    console.log('🔐 Setting up OAuth client...');

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    console.log('🔄 Exchanging authorization code for tokens...');

    const { tokens } = await oauth2Client.getToken(authCode);

    console.log('✅ Tokens received:', {
      access_token: tokens.access_token ? 'RECEIVED' : 'MISSING',
      refresh_token: tokens.refresh_token ? 'RECEIVED' : 'MISSING',
      expires_in: tokens.expiry_date ? 'SET' : 'NOT_SET'
    });

    // Save tokens to file
    const tokenPath = path.join(__dirname, 'radio-promo/gmail-token.json');
    fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));

    console.log('💾 Gmail OAuth tokens saved successfully!');
    console.log('📍 Token file location:', tokenPath);
    console.log('');
    console.log('🎯 You can now run Gmail commands:');
    console.log('  node radio-promo-agent.js find-liberty-campaigns-gmail');
    console.log('  node radio-promo-agent.js recent-liberty-campaigns-gmail');

  } catch (error) {
    console.error('❌ Error saving Gmail tokens:', error.message);
    console.error('Full error:', error);
  }
}

saveGmailToken();