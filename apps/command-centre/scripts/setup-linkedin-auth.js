#!/usr/bin/env node

/**
 * LinkedIn OAuth Setup for Audio Intel Automation
 */

require('dotenv').config();

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_API_VERSION = process.env.LINKEDIN_API_VERSION || '202401';

// Allow scopes to be configured to avoid unauthorized_scope_error.
// Default to OpenID Connect scopes which are available when the "Sign In with LinkedIn" product is enabled.
// To enable posting, add w_member_social (requires Marketing Developer Platform access):
// LINKEDIN_SCOPES="openid profile email w_member_social"
const REQUESTED_SCOPES = (process.env.LINKEDIN_SCOPES || 'openid profile email')
  .split(/\s+/)
  .filter(Boolean);

// Ensure required scopes for posting
if (REQUESTED_SCOPES.includes('w_member_social') && !REQUESTED_SCOPES.includes('r_liteprofile')) {
  REQUESTED_SCOPES.push('r_liteprofile');
}

function generateAuthUrl() {
  const redirectUri = 'http://localhost:3001/auth/linkedin/callback';
  const state = Math.random().toString(36).substring(7);
  const scope = REQUESTED_SCOPES.join(' ');

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code&` +
    `client_id=${LINKEDIN_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `state=${state}&` +
    `scope=${encodeURIComponent(scope)}`;

  return { authUrl, state, redirectUri };
}

async function exchangeCodeForToken(code, redirectUri) {
  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LinkedIn token exchange failed: ${error}`);
  }

  return await response.json();
}

async function getProfile(accessToken) {
  // If posting is requested, always use /me to obtain the person URN id.
  // Otherwise, if OpenID Connect is requested, prefer /userinfo.
  const wantsPosting = REQUESTED_SCOPES.includes('w_member_social');
  const useOidc = REQUESTED_SCOPES.includes('openid') && !wantsPosting;
  const url = wantsPosting ? 'https://api.linkedin.com/v2/me' : (useOidc ? 'https://api.linkedin.com/v2/userinfo' : 'https://api.linkedin.com/v2/me');
  let response = await fetch(url + (url.endsWith('/me') ? '?projection=(id,localizedFirstName,localizedLastName)' : ''), {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': LINKEDIN_API_VERSION,
    },
  });

  if (!response.ok) {
    // Fallback: if /me failed and OIDC available, try /userinfo
    if (url.endsWith('/me') && REQUESTED_SCOPES.includes('openid')) {
      const alt = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
          'LinkedIn-Version': LINKEDIN_API_VERSION,
        },
      });
      if (!alt.ok) {
        const e1 = await response.text();
        const e2 = await alt.text();
        throw new Error(`LinkedIn profile fetch failed: ${e1} | fallback: ${e2}`);
      }
      return await alt.json();
    } else {
      const error = await response.text();
      throw new Error(`LinkedIn profile fetch failed: ${error}`);
    }
  }

  return await response.json();
}

async function testPost(accessToken, personId) {
  const testContent = `Testing LinkedIn automation for Audio Intel!

Built by a working musician who got tired of spending weekends on spreadsheet chaos instead of making music.

This is a test post - the real automation will share authentic case studies about BBC Radio 1 and Spotify contact enrichment.

intel.totalaudiopromo.com`;

  const postData = {
    author: `urn:li:person:${personId}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text: testContent,
        },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };

  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': LINKEDIN_API_VERSION,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LinkedIn post failed: ${error}`);
  }

  const result = await response.json();
  return result;
}

function startLocalServer() {
  console.log('Starting local server for LinkedIn OAuth callback...');

  const http = require('http');
  const url = require('url');

  const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/auth/linkedin/callback') {
      const { code, error, state } = parsedUrl.query;

      if (error) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`<h1>Error: ${error}</h1><p>LinkedIn authorization failed.</p>`);
        return;
      }

      if (!code) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end('<h1>Error: No authorization code received</h1>');
        return;
      }

      try {
        console.log('📝 Exchanging code for access token...');
        const redirectUri = 'http://localhost:3001/auth/linkedin/callback';
        const tokenData = await exchangeCodeForToken(code, redirectUri);

        console.log('✅ Access token received');
        console.log('🔍 Getting profile information...');

        const profile = await getProfile(tokenData.access_token);
        // v2 /me returns localizedFirstName/LastName
        const firstName = profile.given_name || profile.localizedFirstName || (profile.firstName && profile.firstName.localized && profile.firstName.localized.en_US) || 'Unknown';
        const lastName = profile.family_name || profile.localizedLastName || (profile.lastName && profile.lastName.localized && profile.lastName.localized.en_US) || '';
        console.log(`👤 Profile: ${firstName} ${lastName}`);

        // Extract person ID for posting (URN id when using /me). When using OIDC userinfo, id is a subject identifier.
        const personId = profile.id || profile.sub;

        if (REQUESTED_SCOPES.includes('w_member_social')) {
          console.log('📝 Testing post creation...');
          const postResult = await testPost(tokenData.access_token, personId);
          console.log('✅ Test post created successfully!');
        } else {
          console.log('ℹ️ Skipping post test because w_member_social scope was not requested.');
        }

        // Save credentials to .env file
        const fs = require('fs');
        const envContent = `
# LinkedIn credentials (updated by setup script)
LINKEDIN_ACCESS_TOKEN=${tokenData.access_token}
LINKEDIN_PERSON_ID=${personId}
LINKEDIN_TOKEN_EXPIRES=${Date.now() + (tokenData.expires_in * 1000)}
`;

        fs.appendFileSync('.env', envContent);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <h1>✅ LinkedIn Authorization Successful!</h1>
          <p><strong>Profile:</strong> ${firstName} ${lastName}</p>
          <p><strong>Access Token:</strong> Saved to .env file</p>
          <p><strong>Test Post:</strong> ${REQUESTED_SCOPES.includes('w_member_social') ? 'Created successfully' : 'Skipped (w_member_social not requested)'}</p>
          <h3>Next Steps:</h3>
          <ul>
            <li>✅ LinkedIn API is now configured</li>
            <li>✅ Test post was successful</li>
            <li>🚀 Ready for Audio Intel automation</li>
          </ul>
          <p>You can close this browser tab now.</p>
        `);

        server.close();
        process.exit(0);

      } catch (error) {
        console.error('❌ Error during token exchange:', error);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`<h1>Error: ${error.message}</h1>`);
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
    }
  });

  server.listen(3001, () => {
    console.log('🌐 Server running on http://localhost:3001');
  });
}

function main() {
  if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
    console.error('❌ LinkedIn credentials not found in .env file');
    console.log('Make sure you have:');
    console.log('LINKEDIN_CLIENT_ID=781ioptlbwi0ok');
    console.log('LINKEDIN_CLIENT_SECRET=WPL_AP1.frlXgbgIa5bM62VZ.yrVM6g==');
    return;
  }

  console.log('🔗 LinkedIn OAuth Setup for Audio Intel');
  console.log('=====================================');

  const { authUrl, state, redirectUri } = generateAuthUrl();

  console.log('\n📋 Setup Instructions:');
  console.log('1. Starting local callback server...');

  startLocalServer();

  console.log('2. Open this URL in your browser:');
  console.log('\n' + authUrl);
  console.log('\n3. Authorize Audio Intel to post to your LinkedIn');
  console.log('4. You\'ll be redirected back to complete the setup');

  console.log('\n⚠️  Make sure to:');
  console.log('- Use your LinkedIn account that you want to post from');
  console.log('- Grant all requested permissions');
  console.log('- The browser will show success when complete');
}

main();