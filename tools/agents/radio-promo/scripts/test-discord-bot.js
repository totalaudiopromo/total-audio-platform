const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config({ path: path.join(process.cwd(), '.env') });

async function main() {
  const token = process.env.DISCORD_BOT_TOKEN || process.env.TAP_DISCORD_BOT_TOKEN;
  const channelId = process.env.DISCORD_BOT_TEST_CHANNEL_ID || null;

  if (!token) {
    console.error('DISCORD_BOT_TOKEN is not set.');
    process.exit(1);
  }

  const dotCount = (token.match(/\./g) || []).length;
  console.log(
    'ℹ️  Using bot token with length',
    token.length,
    'ending with',
    token.slice(-6),
    'dotCount',
    dotCount
  );
  if (dotCount === 0) {
    console.log(
      '⚠️  Discord bot tokens normally contain two periods. Double-check that the token is complete.'
    );
  }

  const headers = {
    Authorization: `Bot ${token}`,
    'Content-Type': 'application/json',
  };

  const identityResponse = await fetch('https://discord.com/api/v10/users/@me', {
    method: 'GET',
    headers,
  });

  if (!identityResponse.ok) {
    const errorText = await identityResponse.text();
    if (identityResponse.status === 401) {
      console.error('❌ Discord rejected the token (401 Unauthorized).');
      console.error(
        '   • Ensure you copied the full token after regenerating it in the Developer Portal.'
      );
      console.error('   • If the bot was reset, invite it again to your guild.');
    }
    throw new Error(
      `Discord identity request failed: ${identityResponse.status} ${identityResponse.statusText} ${errorText}`.trim()
    );
  }

  const identity = await identityResponse.json();
  console.log('✅ Bot token valid for user:', `${identity.username}#${identity.discriminator}`);

  if (!channelId) {
    console.log('ℹ️  DISCORD_BOT_TEST_CHANNEL_ID not set, skipping message dispatch.');
    return;
  }

  const messagePayload = {
    content: `Liberty radio agent test ping at ${new Date().toISOString()}`,
  };

  const messageResponse = await fetch(
    `https://discord.com/api/v10/channels/${channelId}/messages`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(messagePayload),
    }
  );

  if (!messageResponse.ok) {
    const errorText = await messageResponse.text();
    if (messageResponse.status === 403) {
      console.error('❌ Missing permissions to post in channel', channelId);
      console.error('   • Confirm the bot has "Send Messages" in the target channel.');
    }
    throw new Error(
      `Posting test message failed: ${messageResponse.status} ${messageResponse.statusText} ${errorText}`.trim()
    );
  }

  console.log('✅ Test message posted to channel', channelId);
}

main().catch(error => {
  console.error('❌ Discord bot test failed:', error.message);
  console.error('➡️  Fix the issue above and re-run the script.');
  process.exit(1);
});
