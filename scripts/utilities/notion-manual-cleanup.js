#!/usr/bin/env node
/**
 * Manual Notion Cleanup Script
 * Handles duplicates that can't be archived via API
 */

const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function manualCleanup() {
  try {
    console.log('🧹 MANUAL NOTION CLEANUP');
    console.log('========================');

    const response = await notion.search({
      query: '',
      page_size: 100,
    });

    console.log(`📊 Total pages found: ${response.results.length}\n`);

    // Find duplicates that need manual cleanup
    const duplicates = {
      'Content & Marketing': [],
      'Development Hub': [],
      'Admin & Resources': [],
      'Technical Development': [],
      'Business Operations': [],
      'Business Strategy': [],
      'Audio Intel Product': [],
      'Daily Operations': [],
    };

    response.results.forEach(item => {
      if (item.object === 'page') {
        const title = item.properties?.title?.title?.[0]?.text?.content || '';

        // Categorize duplicates
        if (title.includes('CONTENT & MARKETING') || title.includes('Content & Marketing')) {
          duplicates['Content & Marketing'].push({ id: item.id, title, url: item.url });
        } else if (title.includes('DEVELOPMENT HUB') || title.includes('Development Hub')) {
          duplicates['Development Hub'].push({ id: item.id, title, url: item.url });
        } else if (title.includes('ADMIN & RESOURCES') || title.includes('Admin & Resources')) {
          duplicates['Admin & Resources'].push({ id: item.id, title, url: item.url });
        } else if (
          title.includes('TECHNICAL DEVELOPMENT') ||
          title.includes('Technical Development')
        ) {
          duplicates['Technical Development'].push({ id: item.id, title, url: item.url });
        } else if (title.includes('BUSINESS OPERATIONS') || title.includes('Business Operations')) {
          duplicates['Business Operations'].push({ id: item.id, title, url: item.url });
        } else if (title.includes('Business Strategy')) {
          duplicates['Business Strategy'].push({ id: item.id, title, url: item.url });
        } else if (title.includes('Audio Intel Product') || title.includes('AUDIO INTEL PRODUCT')) {
          duplicates['Audio Intel Product'].push({ id: item.id, title, url: item.url });
        } else if (title.includes('Daily Operations')) {
          duplicates['Daily Operations'].push({ id: item.id, title, url: item.url });
        }
      }
    });

    console.log('🔍 DUPLICATES FOUND:');
    console.log('===================');

    Object.entries(duplicates).forEach(([category, pages]) => {
      if (pages.length > 1) {
        console.log(`\n📁 ${category.toUpperCase()} (${pages.length} duplicates):`);
        pages.forEach((page, index) => {
          console.log(`  ${index + 1}. ${page.title}`);
          console.log(`     ID: ${page.id}`);
          console.log(`     URL: ${page.url}`);
        });

        // Recommend which one to keep (usually the most recent or most complete)
        const keepPage = pages[0]; // Keep the first one for now
        const archivePages = pages.slice(1);

        console.log(`\n  📌 RECOMMENDATION:`);
        console.log(`     KEEP: ${keepPage.title}`);
        console.log(`     ARCHIVE: ${archivePages.length} duplicates`);

        console.log(`\n  🔗 MANUAL ACTIONS NEEDED:`);
        archivePages.forEach((page, index) => {
          console.log(`     ${index + 1}. Go to: ${page.url}`);
          console.log(`        - Click "..." menu → "Move to" → "Archive"`);
        });
        console.log('');
      }
    });

    console.log('\n📋 CLEANUP INSTRUCTIONS:');
    console.log('========================');
    console.log('1. Open each duplicate page URL above');
    console.log('2. Click the "..." menu in the top right');
    console.log('3. Select "Move to" → "Archive"');
    console.log('4. This will move the page to your Notion trash');
    console.log('5. Empty trash to permanently delete (optional)');

    console.log('\n✅ MANUAL CLEANUP ANALYSIS COMPLETE!');
    console.log('Follow the instructions above to clean up duplicates manually.');
  } catch (error) {
    console.error('Error during manual cleanup analysis:', error.message);
  }
}

if (require.main === module) {
  manualCleanup();
}

module.exports = { manualCleanup };
