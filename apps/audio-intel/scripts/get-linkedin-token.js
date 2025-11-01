#!/usr/bin/env node
/**
 * LinkedIn OAuth Token Generator
 *
 * Quick script to get your LinkedIn access token
 * Run this once to get your token, then add it to Vercel
 */

const http = require('http');
const { exec } = require('child_process');

console.log('\n🔐 LinkedIn OAuth Token Generator\n');

// Get credentials from command line
const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Missing credentials!');
  console.log('\nUsage:');
  console.log(
    '  LINKEDIN_CLIENT_ID=your_id LINKEDIN_CLIENT_SECRET=your_secret node scripts/get-linkedin-token.js'
  );
  console.log('\nOr add them to your .env file first\n');
  process.exit(1);
}

const REDIRECT_URI = 'http://localhost:3333/callback';
const PORT = 3333;

console.log('✅ Credentials loaded');
console.log('📍 Redirect URI:', REDIRECT_URI);
console.log('\n⚠️  IMPORTANT: Add this redirect URI to your LinkedIn app:');
console.log('   https://www.linkedin.com/developers/apps → Your App → Auth tab');
console.log('   Add: http://localhost:3333/callback');
console.log('\nPress Enter when ready...');

process.stdin.once('data', () => {
  startOAuthFlow();
});

function startOAuthFlow() {
  console.log('\n🚀 Starting OAuth flow...\n');

  // Create authorization URL
  const authUrl =
    `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code&` +
    `client_id=${CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `scope=openid profile w_member_social`;

  console.log('🌐 Opening browser for authorization...\n');

  // Start local server to receive callback
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');

      if (!code) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end('<h1>❌ No authorization code received</h1>');
        server.close();
        return;
      }

      console.log('✅ Authorization code received!');
      console.log('🔄 Exchanging for access token...\n');

      try {
        // Exchange code for token
        const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
          }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.access_token) {
          console.log('✅ Access token received!\n');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('📋 Add these to Vercel Environment Variables:');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
          console.log(`LINKEDIN_CLIENT_ID=${CLIENT_ID}`);
          console.log(`LINKEDIN_CLIENT_SECRET=${CLIENT_SECRET}`);
          console.log(`LINKEDIN_ACCESS_TOKEN=${tokenData.access_token}\n`);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
          console.log('⏰ Token expires in:', tokenData.expires_in, 'seconds');
          console.log("📅 That's about:", Math.floor(tokenData.expires_in / 86400), 'days\n');

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <head><title>Success!</title></head>
              <body style="font-family: sans-serif; padding: 40px; text-align: center;">
                <h1>✅ Success!</h1>
                <p>Your LinkedIn access token has been generated.</p>
                <p>Check your terminal for the credentials to add to Vercel.</p>
                <p>You can close this window.</p>
              </body>
            </html>
          `);
        } else {
          throw new Error(tokenData.error_description || 'Failed to get token');
        }
      } catch (error) {
        console.error('❌ Error getting token:', error.message);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`<h1>❌ Error</h1><p>${error.message}</p>`);
      }

      setTimeout(() => {
        server.close();
        process.exit(0);
      }, 2000);
    }
  });

  server.listen(PORT, () => {
    console.log(`✅ Local server running on port ${PORT}`);
    console.log('🌐 Opening authorization URL...\n');

    // Open browser
    exec(`open "${authUrl}"`, err => {
      if (err) {
        console.log("⚠️  Couldn't open browser automatically.");
        console.log('📋 Copy and paste this URL into your browser:\n');
        console.log(authUrl, '\n');
      }
    });
  });
}
