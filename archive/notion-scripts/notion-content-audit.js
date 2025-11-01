#!/usr/bin/env node
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function performContentAudit() {
  try {
    console.log('🔍 NOTION CONTENT AUDIT - PHASE 1');
    console.log('==================================');
    console.log('Mapping every existing page and identifying overlaps...\n');

    // Get all pages
    const response = await notion.search({
      query: '',
      page_size: 100,
    });

    console.log(`📊 Total pages found: ${response.results.length}\n`);

    // Categorize pages by topic
    const pageCategories = {
      'Business Strategy': [],
      Pricing: [],
      Development: [],
      'Customer Feedback': [],
      Partnerships: [],
      'Audio Intel': [],
      'Playlist Pulse': [],
      'Content & Marketing': [],
      Technical: [],
      Templates: [],
      'Archived/Empty': [],
      Other: [],
    };

    // Analyze each page
    for (const item of response.results) {
      if (item.object === 'page') {
        const title = item.properties?.title?.title?.[0]?.text?.content || 'Untitled';
        const pageId = item.id;
        const url = item.url;

        // Get page content to categorize
        let content = '';
        try {
          const blocks = await notion.blocks.children.list({ block_id: pageId });
          content = blocks.results
            .map(block => {
              if (block.type === 'paragraph' && block.paragraph?.rich_text?.[0]) {
                return block.paragraph.rich_text[0].text.content;
              } else if (block.type === 'heading_1' && block.heading_1?.rich_text?.[0]) {
                return `# ${block.heading_1.rich_text[0].text.content}`;
              } else if (block.type === 'heading_2' && block.heading_2?.rich_text?.[0]) {
                return `## ${block.heading_2.rich_text[0].text.content}`;
              } else if (block.type === 'heading_3' && block.heading_3?.rich_text?.[0]) {
                return `### ${block.heading_3.rich_text[0].text.content}`;
              }
              return '';
            })
            .join(' ')
            .substring(0, 500); // First 500 chars for analysis
        } catch (error) {
          content = 'Error reading content';
        }

        const pageInfo = {
          id: pageId,
          title,
          url,
          content: content.substring(0, 200) + '...',
          wordCount: content.split(' ').length,
          lastEdited: item.last_edited_time,
        };

        // Categorize based on title and content
        const titleLower = title.toLowerCase();
        const contentLower = content.toLowerCase();

        if (titleLower.includes('untitled') || content.length < 50) {
          pageCategories['Archived/Empty'].push(pageInfo);
        } else if (
          titleLower.includes('template') ||
          titleLower.includes('daily focus') ||
          titleLower.includes('development session')
        ) {
          pageCategories['Templates'].push(pageInfo);
        } else if (titleLower.includes('audio intel') || contentLower.includes('audio intel')) {
          pageCategories['Audio Intel'].push(pageInfo);
        } else if (
          titleLower.includes('playlist pulse') ||
          contentLower.includes('playlist pulse')
        ) {
          pageCategories['Playlist Pulse'].push(pageInfo);
        } else if (
          titleLower.includes('business') ||
          titleLower.includes('strategy') ||
          titleLower.includes('market') ||
          contentLower.includes('revenue') ||
          contentLower.includes('pricing')
        ) {
          pageCategories['Business Strategy'].push(pageInfo);
        } else if (
          titleLower.includes('pricing') ||
          contentLower.includes('£') ||
          contentLower.includes('pricing')
        ) {
          pageCategories['Pricing'].push(pageInfo);
        } else if (
          titleLower.includes('development') ||
          titleLower.includes('technical') ||
          titleLower.includes('claude') ||
          titleLower.includes('cursor') ||
          titleLower.includes('github')
        ) {
          pageCategories['Development'].push(pageInfo);
        } else if (
          titleLower.includes('customer') ||
          titleLower.includes('feedback') ||
          titleLower.includes('beta')
        ) {
          pageCategories['Customer Feedback'].push(pageInfo);
        } else if (
          titleLower.includes('partnership') ||
          titleLower.includes('liberty') ||
          titleLower.includes('demarco')
        ) {
          pageCategories['Partnerships'].push(pageInfo);
        } else if (
          titleLower.includes('content') ||
          titleLower.includes('marketing') ||
          titleLower.includes('newsletter') ||
          titleLower.includes('social')
        ) {
          pageCategories['Content & Marketing'].push(pageInfo);
        } else if (
          titleLower.includes('technical') ||
          titleLower.includes('api') ||
          titleLower.includes('integration')
        ) {
          pageCategories['Technical'].push(pageInfo);
        } else {
          pageCategories['Other'].push(pageInfo);
        }
      }
    }

    // Display categorized results
    Object.entries(pageCategories).forEach(([category, pages]) => {
      if (pages.length > 0) {
        console.log(`📁 ${category.toUpperCase()} (${pages.length} pages)`);
        console.log('='.repeat(50));

        pages.forEach((page, index) => {
          console.log(`${index + 1}. ${page.title}`);
          console.log(`   ID: ${page.id}`);
          console.log(`   Content: ${page.content}`);
          console.log(`   Word Count: ${page.wordCount}`);
          console.log(`   Last Edited: ${new Date(page.lastEdited).toLocaleDateString()}`);
          console.log('');
        });
        console.log('');
      }
    });

    // Identify potential overlaps
    console.log('🔄 OVERLAP ANALYSIS - PHASE 2');
    console.log('==============================');

    // Look for similar titles
    const allTitles = response.results
      .filter(item => item.object === 'page')
      .map(item => item.properties?.title?.title?.[0]?.text?.content || '')
      .filter(title => title !== 'Untitled');

    const titleGroups = {};
    allTitles.forEach(title => {
      const key = title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .replace(/radio.*promo.*agent/, 'radiopromoagent')
        .replace(/audio.*intel.*master.*reference/, 'audiointelmasterreference')
        .replace(/brand.*guidelines/, 'brandguidelines')
        .replace(/business.*operations/, 'businessoperations')
        .replace(/total.*audio.*transfer/, 'totalaudiotransfer');

      if (!titleGroups[key]) {
        titleGroups[key] = [];
      }
      titleGroups[key].push(title);
    });

    console.log('🔍 POTENTIAL DUPLICATES FOUND:');
    Object.entries(titleGroups).forEach(([key, titles]) => {
      if (titles.length > 1) {
        console.log(`\n${key.toUpperCase()}:`);
        titles.forEach((title, index) => {
          console.log(`  ${index + 1}. ${title}`);
        });
      }
    });

    // Identify content overlaps
    console.log('\n📋 CONTENT OVERLAP PATTERNS:');
    console.log('============================');

    const businessStrategyPages = pageCategories['Business Strategy'];
    if (businessStrategyPages.length > 1) {
      console.log(
        `\n⚠️  Business Strategy: ${businessStrategyPages.length} pages with similar content`
      );
      businessStrategyPages.forEach(page => {
        console.log(`  - ${page.title}`);
      });
    }

    const audioIntelPages = pageCategories['Audio Intel'];
    if (audioIntelPages.length > 1) {
      console.log(`\n⚠️  Audio Intel: ${audioIntelPages.length} pages with similar content`);
      audioIntelPages.forEach(page => {
        console.log(`  - ${page.title}`);
      });
    }

    const developmentPages = pageCategories['Development'];
    if (developmentPages.length > 1) {
      console.log(`\n⚠️  Development: ${developmentPages.length} pages with similar content`);
      developmentPages.forEach(page => {
        console.log(`  - ${page.title}`);
      });
    }

    console.log('\n✅ AUDIT COMPLETE!');
    console.log('==================');
    console.log('Ready for Phase 2: Overlap Analysis');
    console.log('Next step: Identify which version of overlapping info is most current/complete');
  } catch (error) {
    console.error('Error during audit:', error.message);
  }
}

performContentAudit();
