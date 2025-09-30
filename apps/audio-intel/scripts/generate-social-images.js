#!/usr/bin/env node

/**
 * Generate platform-specific Open Graph images for Audio Intel
 */

const fs = require('fs');
const path = require('path');

// Platform-specific image specifications
const PLATFORM_SPECS = {
  linkedin: {
    width: 1200,
    height: 627,
    format: 'jpeg',
    filename: 'og-linkedin.jpg'
  },
  twitter: {
    width: 1200,
    height: 600,
    format: 'jpeg',
    filename: 'og-twitter.jpg'
  },
  facebook: {
    width: 1200,
    height: 630,
    format: 'jpeg',
    filename: 'og-facebook.jpg'
  },
  bluesky: {
    width: 1200,
    height: 630,
    format: 'jpeg',
    filename: 'og-bluesky.jpg'
  },
  general: {
    width: 1200,
    height: 630,
    format: 'jpeg',
    filename: 'og-image.jpg'
  }
};

// Audio Intel brand colors and messaging
const BRAND_CONFIG = {
  primaryColor: '#000000',
  accentColor: '#ffffff',
  backgroundColor: '#f5f5f5',
  title: 'Audio Intel',
  tagline: '15 Hours → 15 Minutes',
  subtitle: 'Contact Enrichment for Music Promotion',
  url: 'intel.totalaudiopromo.com'
};

function generateHTMLCanvas(platform, spec) {
  const { width, height } = spec;

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
            overflow: hidden;
        }

        .og-container {
            width: ${width}px;
            height: ${height}px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            color: white;
            background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
            border: 3px solid #333333;
            box-sizing: border-box;
        }

        .logo {
            font-size: 48px;
            font-weight: 800;
            margin-bottom: 20px;
            letter-spacing: -1px;
        }

        .tagline {
            font-size: 72px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 16px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            line-height: 1;
        }

        .subtitle {
            font-size: 28px;
            font-weight: 500;
            color: #cccccc;
            margin-bottom: 30px;
            opacity: 0.9;
        }

        .url {
            font-size: 24px;
            font-weight: 600;
            color: #888888;
            position: absolute;
            bottom: 40px;
            right: 50px;
        }

        .platform-badge {
            position: absolute;
            top: 30px;
            left: 40px;
            background: rgba(255,255,255,0.1);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .features {
            display: flex;
            gap: 40px;
            margin-top: 30px;
        }

        .feature {
            background: rgba(255,255,255,0.1);
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="og-container">
        <div class="platform-badge">${platform.toUpperCase()}</div>

        <div class="logo">${BRAND_CONFIG.title}</div>
        <div class="tagline">${BRAND_CONFIG.tagline}</div>
        <div class="subtitle">${BRAND_CONFIG.subtitle}</div>

        <div class="features">
            <div class="feature">BBC Radio 1 Proven</div>
            <div class="feature">Spotify Case Studies</div>
            <div class="feature">100% Success Rate</div>
        </div>

        <div class="url">${BRAND_CONFIG.url}</div>
    </div>
</body>
</html>`;
}

function generatePlatformImages() {
  const publicDir = path.join(__dirname, '..', 'public');

  console.log('🎨 Generating platform-specific Open Graph images...');

  Object.entries(PLATFORM_SPECS).forEach(([platform, spec]) => {
    const htmlContent = generateHTMLCanvas(platform, spec);
    const htmlPath = path.join(publicDir, `og-${platform}.html`);

    // Write HTML file for manual screenshot generation
    fs.writeFileSync(htmlPath, htmlContent);

    console.log(`✅ Generated ${platform} template: og-${platform}.html`);
    console.log(`   Dimensions: ${spec.width}x${spec.height}`);
    console.log(`   Target file: ${spec.filename}`);
  });

  console.log('\n📸 Next steps:');
  console.log('1. Open each og-[platform].html file in browser');
  console.log('2. Take screenshot at exact dimensions');
  console.log('3. Save as corresponding og-[platform].jpg files');
  console.log('');
  console.log('Or use automated tools like Puppeteer to generate images programmatically.');
}

// Platform-specific metadata configurations
function generateMetadataConfigs() {
  const configs = {};

  Object.keys(PLATFORM_SPECS).forEach(platform => {
    const spec = PLATFORM_SPECS[platform];

    configs[platform] = {
      title: `Audio Intel – ${BRAND_CONFIG.tagline} | Contact Enrichment for Music Promotion`,
      description: getPlatformDescription(platform),
      image: `https://intel.totalaudiopromo.com/${spec.filename}`,
      url: 'https://intel.totalaudiopromo.com',
      type: 'website'
    };
  });

  const configPath = path.join(__dirname, '..', 'lib', 'social-metadata.json');
  fs.writeFileSync(configPath, JSON.stringify(configs, null, 2));

  console.log('📋 Generated social metadata configurations');
}

function getPlatformDescription(platform) {
  const descriptions = {
    linkedin: 'Transform chaotic contact spreadsheets into organised databases in minutes. Built by radio promoters for radio promoters. BBC Radio 1 + Spotify case studies proven. Professional contact intelligence for music industry growth.',
    twitter: 'Transform 15 hours of contact research into 15 minutes. BBC Radio 1 ✅ Spotify ✅ 100% success rate ✅ Built by radio promoters for radio promoters.',
    facebook: 'Stop spending weekends researching music contacts! Audio Intel transforms chaotic spreadsheets into organised databases in minutes. Real case studies: BBC Radio 1, Spotify playlist curators. Built by musicians, for musicians.',
    bluesky: 'Audio Intel: 15 hours → 15 minutes ⚡ Transform music promotion chaos into organised contact intelligence. BBC Radio 1 + Spotify case studies proven.',
    general: 'Transform chaotic contact spreadsheets into organised databases in minutes. Built by radio promoters for radio promoters. BBC Radio 1 + Spotify case studies proven.'
  };

  return descriptions[platform] || descriptions.general;
}

function main() {
  const command = process.argv[2];

  switch (command) {
    case 'generate':
      generatePlatformImages();
      generateMetadataConfigs();
      break;

    case 'templates':
      generatePlatformImages();
      break;

    case 'metadata':
      generateMetadataConfigs();
      break;

    default:
      console.log(`
Audio Intel Social Image Generator

Commands:
  generate    Generate all platform templates and metadata
  templates   Generate HTML templates only
  metadata    Generate metadata configurations only

Platform specifications:
${Object.entries(PLATFORM_SPECS).map(([platform, spec]) =>
  `  ${platform.padEnd(10)} ${spec.width}x${spec.height} ${spec.format}`
).join('\n')}

Examples:
  node scripts/generate-social-images.js generate
  node scripts/generate-social-images.js templates
      `);
  }
}

main();