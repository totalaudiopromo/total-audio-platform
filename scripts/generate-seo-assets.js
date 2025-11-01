#!/usr/bin/env node

/**
 * Generate SEO Assets for Total Audio Apps
 *
 * Creates favicons and OG images for:
 * - Audio Intel (already has assets, this validates them)
 * - Pitch Generator (missing favicons and OG image)
 * - Tracker (missing favicons and OG image)
 *
 * Requirements: Install sharp for image processing
 * npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const APPS = {
  'audio-intel': {
    name: 'Audio Intel',
    tagline: '15 Hours to 15 Minutes',
    description: 'Transform chaotic contact spreadsheets into organised databases',
    logo: 'apps/audio-intel/public/images/total_audio_promo_logo_trans.png',
    outputDir: 'apps/audio-intel/public',
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
  },
  'pitch-generator': {
    name: 'Pitch Generator',
    tagline: '50 Personalised Pitches in 20 Minutes',
    description: 'AI-powered pitch writing for artists and radio promoters',
    logo: 'apps/pitch-generator/public/total_audio_promo_logo_trans.png',
    outputDir: 'apps/pitch-generator/public',
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
  },
  tracker: {
    name: 'Campaign Tracker',
    tagline: 'Simple Campaign Tracking',
    description: 'Stop using spreadsheets for radio promotion campaigns',
    logo: 'apps/tracker/public/images/tracker-mascot.png',
    outputDir: 'apps/tracker/public',
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
  },
};

const FAVICON_SIZES = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
];

const OG_IMAGE_SIZE = { width: 1200, height: 630 };

async function generateFavicons(appKey, appConfig) {
  console.log(`\n📦 Generating favicons for ${appConfig.name}...`);

  const logoPath = path.join(process.cwd(), appConfig.logo);
  const outputDir = path.join(process.cwd(), appConfig.outputDir);

  if (!fs.existsSync(logoPath)) {
    console.error(`❌ Logo not found: ${logoPath}`);
    return false;
  }

  try {
    // Generate PNG favicons
    for (const { size, name } of FAVICON_SIZES) {
      const outputPath = path.join(outputDir, name);

      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toFile(outputPath);

      console.log(`  ✓ Created ${name} (${size}x${size})`);
    }

    // Generate favicon.ico (32x32 is standard)
    const icoPath = path.join(outputDir, 'favicon.ico');
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(icoPath);

    console.log(`  ✓ Created favicon.ico (32x32)`);

    return true;
  } catch (error) {
    console.error(`❌ Error generating favicons for ${appConfig.name}:`, error.message);
    return false;
  }
}

async function generateOGImage(appKey, appConfig) {
  console.log(`\n🖼️  Generating OG image for ${appConfig.name}...`);

  const logoPath = path.join(process.cwd(), appConfig.logo);
  const outputDir = path.join(process.cwd(), appConfig.outputDir);

  if (!fs.existsSync(logoPath)) {
    console.error(`❌ Logo not found: ${logoPath}`);
    return false;
  }

  try {
    // OG image filename based on app
    const ogImageName =
      appKey === 'audio-intel'
        ? 'og-image.jpg'
        : appKey === 'pitch-generator'
          ? 'og-pitch-generator.png'
          : 'og-tracker.png';

    const outputPath = path.join(outputDir, ogImageName);

    // Simple approach: Resize logo to OG image dimensions with white background
    // Keep it clean and professional - just the mascot logo centered
    await sharp(logoPath)
      .resize(OG_IMAGE_SIZE.width, OG_IMAGE_SIZE.height, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }, // White background
      })
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    console.log(`  ✓ Created ${ogImageName} (${OG_IMAGE_SIZE.width}x${OG_IMAGE_SIZE.height})`);

    return true;
  } catch (error) {
    console.error(`❌ Error generating OG image for ${appConfig.name}:`, error.message);
    return false;
  }
}

async function validateExistingAssets(appKey, appConfig) {
  console.log(`\n🔍 Validating existing assets for ${appConfig.name}...`);

  const outputDir = path.join(process.cwd(), appConfig.outputDir);
  const requiredAssets = [
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'apple-touch-icon.png',
    appKey === 'audio-intel'
      ? 'og-image.jpg'
      : appKey === 'pitch-generator'
        ? 'og-pitch-generator.png'
        : 'og-tracker.png',
  ];

  const missingAssets = [];

  for (const asset of requiredAssets) {
    const assetPath = path.join(outputDir, asset);
    if (!fs.existsSync(assetPath)) {
      missingAssets.push(asset);
      console.log(`  ❌ Missing: ${asset}`);
    } else {
      const stats = fs.statSync(assetPath);
      console.log(`  ✓ Found: ${asset} (${(stats.size / 1024).toFixed(1)}KB)`);
    }
  }

  return missingAssets.length === 0;
}

async function main() {
  console.log('🎨 Total Audio SEO Asset Generator\n');
  console.log('==================================\n');

  const args = process.argv.slice(2);
  const appFilter = args[0]; // Optional: specify single app
  const command = args[1] || 'generate'; // 'generate' or 'validate'

  const appsToProcess = appFilter && APPS[appFilter] ? { [appFilter]: APPS[appFilter] } : APPS;

  let totalSuccess = 0;
  let totalFailed = 0;

  for (const [appKey, appConfig] of Object.entries(appsToProcess)) {
    if (command === 'validate') {
      const isValid = await validateExistingAssets(appKey, appConfig);
      if (isValid) {
        console.log(`\n✅ ${appConfig.name} has all required assets\n`);
        totalSuccess++;
      } else {
        console.log(`\n⚠️  ${appConfig.name} is missing assets - run 'generate' to create them\n`);
        totalFailed++;
      }
    } else {
      // Generate mode
      const faviconsOk = await generateFavicons(appKey, appConfig);
      const ogImageOk = await generateOGImage(appKey, appConfig);

      if (faviconsOk && ogImageOk) {
        console.log(`\n✅ ${appConfig.name} SEO assets generated successfully\n`);
        totalSuccess++;
      } else {
        console.log(`\n❌ ${appConfig.name} had errors - check logs above\n`);
        totalFailed++;
      }
    }
  }

  console.log('\n==================================');
  console.log(`\n📊 Summary: ${totalSuccess} successful, ${totalFailed} failed\n`);

  if (command === 'validate' && totalFailed > 0) {
    console.log('💡 Run without "validate" to generate missing assets:\n');
    console.log('   node scripts/generate-seo-assets.js\n');
  }

  if (totalFailed > 0) {
    process.exit(1);
  }
}

// Check for sharp dependency
try {
  require.resolve('sharp');
} catch (e) {
  console.error('❌ Error: "sharp" package not found');
  console.error('\nInstall it with: npm install sharp\n');
  process.exit(1);
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
