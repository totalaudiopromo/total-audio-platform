#!/usr/bin/env node
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function executeAuditCleanup() {
  try {
    console.log('🔍 AUDIT CLEANUP EXECUTION');
    console.log('==========================');

    // First, let's get all pages to identify duplicates
    const response = await notion.search({
      query: '',
      page_size: 100,
    });

    console.log('\n📊 CURRENT WORKSPACE ANALYSIS:');
    console.log('Total pages found:', response.results.length);

    // Group pages by type for analysis
    const archiveCandidates = [];
    const duplicateGroups = {};

    response.results.forEach((item, index) => {
      if (item.object === 'page') {
        const title = item.properties?.title?.title?.[0]?.text?.content || 'Untitled';

        // Identify archive candidates
        if (
          title.includes('Daily Entry') ||
          title.includes('Habit Tracker') ||
          title.includes('Ragga Style') ||
          title.includes('Maybe (i)') ||
          title.includes('Meta Ads') ||
          (title.includes('Pages') && title.length < 20)
        ) {
          archiveCandidates.push({ id: item.id, title, url: item.url });
        }

        // Group duplicates
        const key = title
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .replace(/radio.*promo.*agent/, 'radiopromoagent')
          .replace(/audio.*intel.*master.*reference/, 'audiointelmasterreference')
          .replace(/brand.*guidelines/, 'brandguidelines')
          .replace(/master.*workspace/, 'masterworkspace');

        if (!duplicateGroups[key]) {
          duplicateGroups[key] = [];
        }
        duplicateGroups[key].push({ id: item.id, title, url: item.url });
      }
    });

    console.log('\n🗑️ ARCHIVE CANDIDATES FOUND:');
    archiveCandidates.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`);
      console.log(`   ID: ${item.id}`);
    });

    console.log('\n🔄 DUPLICATE GROUPS IDENTIFIED:');
    Object.entries(duplicateGroups).forEach(([key, pages]) => {
      if (pages.length > 1) {
        console.log(`\n${key.toUpperCase()}:`);
        pages.forEach((page, index) => {
          console.log(`  ${index + 1}. ${page.title}`);
          console.log(`     ID: ${page.id}`);
        });
      }
    });

    console.log('\n✅ AUDIT ANALYSIS COMPLETE');
    console.log('Ready to execute cleanup phases...');
  } catch (error) {
    console.error('Error during audit:', error.message);
  }
}

executeAuditCleanup();
