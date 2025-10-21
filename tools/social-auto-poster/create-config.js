#!/usr/bin/env node

/**
 * Simple config creator
 * Usage: node create-config.js bluesky yourhandle.bsky.social your-app-password
 */

const fs = require('fs').promises;
const path = require('path');

const args = process.argv.slice(2);
const platform = args[0];

async function createConfig() {
  const config = {
    linkedin: { enabled: false },
    bluesky: { enabled: false },
    threads: { enabled: false }
  };

  if (platform === 'bluesky' && args[1] && args[2]) {
    config.bluesky = {
      enabled: true,
      handle: args[1],
      appPassword: args[2],
      did: ''
    };
    console.log('Bluesky configured!');
  }

  const configPath = path.join(__dirname, 'social-config.json');
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));

  console.log(`\nConfig saved to: ${configPath}`);
  console.log('\nTest it:');
  console.log('node unified-poster.js post "Hello from Bluesky!"');
}

createConfig();
