#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateOGImage() {
  console.log('🎯 Generating Open Graph image for Audio Intel...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Set viewport to Open Graph image size
    await page.setViewport({ width: 1200, height: 627 });

    // Load the HTML template
    const htmlPath = path.join(__dirname, '../public/og-linkedin-clean.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    console.log('📄 Loading HTML template...');
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

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

    console.log('✅ Open Graph image generated successfully!');
    console.log(`💾 Saved to: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating Open Graph image:', error);
  } finally {
    await browser.close();
  }
}

generateOGImage();
