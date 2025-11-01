#!/usr/bin/env node

/**
 * Use Puppeteer to capture platform-specific Open Graph images
 */

const path = require('path');

// Platform specifications
const PLATFORMS = [
  { name: 'linkedin', width: 1200, height: 627 },
  { name: 'twitter', width: 1200, height: 600 },
  { name: 'facebook', width: 1200, height: 630 },
  { name: 'bluesky', width: 1200, height: 630 },
  { name: 'general', width: 1200, height: 630 },
];

async function captureImage(platform) {
  const htmlFile = path.join(__dirname, '..', 'public', `og-${platform.name}.html`);
  const outputFile = path.join(__dirname, '..', 'public', `og-${platform.name}.jpg`);

  console.log(`📸 Capturing ${platform.name} image...`);

  try {
    // We'll use the MCP Puppeteer server
    // For now, create a manual process
    console.log(`   HTML template: og-${platform.name}.html`);
    console.log(`   Dimensions: ${platform.width}x${platform.height}`);
    console.log(`   Output: og-${platform.name}.jpg`);

    // Manual instructions for now
    console.log(`   ⚠️  Manual step: Open og-${platform.name}.html in browser and screenshot`);
  } catch (error) {
    console.error(`❌ Failed to capture ${platform.name}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Capturing platform-specific Open Graph images...\n');

  for (const platform of PLATFORMS) {
    await captureImage(platform);
    console.log('');
  }

  console.log('✅ Image capture process initiated');
  console.log('\n📋 Manual Steps Required:');
  console.log('1. Open each og-[platform].html file in browser');
  console.log('2. Set browser window to exact dimensions shown above');
  console.log('3. Take screenshot and save as og-[platform].jpg');
  console.log('4. Place all .jpg files in public/ directory');
  console.log('\nOR use browser dev tools device emulation with custom dimensions');
}

main().catch(console.error);
