#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateOGImage() {
  console.log('🎯 Generating improved Open Graph image for Audio Intel...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Set viewport to Open Graph image size
    await page.setViewport({ width: 1200, height: 627 });

    // Read and convert the logo to base64
    const logoPath = path.join(__dirname, '../public/images/total_audio_promo_logo_trans.png');
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = logoBuffer.toString('base64');
    const logoDataUri = `data:image/png;base64,${logoBase64}`;

    // Create improved HTML with embedded logo
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            background: #f8f9fa;
            overflow: hidden;
        }

        .og-container {
            width: 1200px;
            height: 627px;
            position: relative;
            background: #f8f9fa;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            box-sizing: border-box;
            padding: 60px;
        }

        .main-card {
            background: white;
            border: 4px solid #000000;
            border-radius: 16px;
            box-shadow: 12px 12px 0px 0px rgba(0,0,0,1);
            padding: 60px;
            width: 100%;
            max-width: 1000px;
            position: relative;
        }

        .logo-section {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin-bottom: 32px;
        }

        .logo {
            width: 48px;
            height: 48px;
            background: white;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #000000;
        }

        .logo img {
            width: 40px;
            height: 40px;
            object-fit: contain;
        }

        .brand-text {
            font-size: 40px;
            font-weight: 900;
            color: #000000;
            letter-spacing: -1px;
        }

        .beta-badge {
            background: #dbeafe;
            color: #1e40af;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            margin-left: 12px;
        }

        .main-title {
            font-size: 48px;
            font-weight: 900;
            color: #000000;
            margin-bottom: 24px;
            line-height: 1.1;
        }

        .subtitle {
            font-size: 24px;
            font-weight: 600;
            color: #4b5563;
            margin-bottom: 32px;
            line-height: 1.3;
        }

        .features {
            display: flex;
            gap: 24px;
            justify-content: center;
            margin-bottom: 32px;
        }

        .feature-badge {
            background: #10b981;
            color: white;
            padding: 12px 24px;
            border-radius: 24px;
            font-size: 16px;
            font-weight: 700;
            box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);
        }

        .url {
            font-size: 20px;
            font-weight: 600;
            color: #6b7280;
            margin-top: 24px;
        }

        .platform-indicator {
            position: absolute;
            top: 20px;
            right: 20px;
            background: #0ea5e9;
            color: white;
            padding: 8px 16px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            box-shadow: 2px 2px 0px 0px rgba(0,0,0,1);
        }
    </style>
</head>
<body>
    <div class="og-container">
        <div class="main-card">
            <div class="platform-indicator">SOCIAL</div>

            <div class="logo-section">
                <div class="logo">
                    <img src="${logoDataUri}" alt="Total Audio Promo">
                </div>
                <div class="brand-text">Audio Intel</div>
                <div class="beta-badge">Beta</div>
            </div>

            <div class="main-title">15 Hours → 15 Minutes</div>

            <div class="subtitle">
                Transform chaotic contact spreadsheets into organised databases.<br>
                Built by radio promoters for radio promoters.
            </div>

            <div class="features">
                <div class="feature-badge">BBC Radio 1 ✓</div>
                <div class="feature-badge">Spotify ✓</div>
                <div class="feature-badge">100% Success Rate</div>
            </div>

            <div class="url">intel.totalaudiopromo.com</div>
        </div>
    </div>
</body>
</html>`;

    console.log('📄 Loading improved HTML template with embedded logo...');
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Wait for fonts to load
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Take screenshot
    console.log('📸 Capturing Open Graph image...');
    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality: 95,
      fullPage: false,
    });

    // Save as og-image.jpg
    const outputPath = path.join(__dirname, '../public/og-image.jpg');
    fs.writeFileSync(outputPath, screenshot);

    console.log('✅ Improved Open Graph image generated successfully!');
    console.log(`💾 Saved to: ${outputPath}`);
    console.log('🔧 Logo embedded as data URI for better compatibility');
  } catch (error) {
    console.error('❌ Error generating Open Graph image:', error);
  } finally {
    await browser.close();
  }
}

generateOGImage();
