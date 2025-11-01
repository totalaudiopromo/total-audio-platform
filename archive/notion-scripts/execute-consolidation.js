#!/usr/bin/env node
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function executeConsolidation() {
  try {
    console.log('🧹 EXECUTING NOTION CONSOLIDATION PLAN');
    console.log('=====================================');

    // Get all pages
    const response = await notion.search({
      query: '',
      page_size: 100,
    });

    console.log(`📊 Total pages found: ${response.results.length}\n`);

    // PHASE 1: Quick Wins - Archive Empty Pages
    console.log('🚀 PHASE 1: ARCHIVING EMPTY PAGES');
    console.log('==================================');

    const emptyPages = response.results.filter(item => {
      if (item.object === 'page') {
        const title = item.properties?.title?.title?.[0]?.text?.content || 'Untitled';
        return title === 'Untitled' || title.includes('Untitled');
      }
      return false;
    });

    console.log(`🗑️ Found ${emptyPages.length} empty pages to archive`);

    let archivedCount = 0;
    for (const page of emptyPages) {
      try {
        await notion.pages.update({
          page_id: page.id,
          archived: true,
        });
        archivedCount++;
        console.log(
          `✅ Archived: ${page.properties?.title?.title?.[0]?.text?.content || 'Untitled'}`
        );
      } catch (error) {
        console.log(`❌ Failed to archive: ${error.message}`);
      }
    }

    console.log(`\n✅ Phase 1 Complete: Archived ${archivedCount} empty pages\n`);

    // PHASE 2: Smart Consolidation
    console.log('🔄 PHASE 2: SMART CONSOLIDATION');
    console.log('===============================');

    // 2.1: Radio Promo Agent Duplicates
    console.log('\n📻 Consolidating Radio Promo Agent duplicates...');
    const radioPromoPages = response.results.filter(item => {
      if (item.object === 'page') {
        const title = item.properties?.title?.title?.[0]?.text?.content || '';
        return title.includes('RADIO PROMO AGENT') && title.includes('DAY-IN-THE-LIFE');
      }
      return false;
    });

    if (radioPromoPages.length > 1) {
      const keepPage = radioPromoPages[0];
      const archivePages = radioPromoPages.slice(1);

      console.log(`📌 Keeping: ${keepPage.properties?.title?.title?.[0]?.text?.content}`);

      for (const page of archivePages) {
        try {
          await notion.pages.update({
            page_id: page.id,
            archived: true,
          });
          console.log(
            `✅ Archived duplicate: ${page.properties?.title?.title?.[0]?.text?.content}`
          );
        } catch (error) {
          console.log(`❌ Failed to archive duplicate: ${error.message}`);
        }
      }
    }

    // 2.2: Business Strategy Consolidation
    console.log('\n💼 Consolidating Business Strategy pages...');
    const businessStrategyPages = response.results.filter(item => {
      if (item.object === 'page') {
        const title = item.properties?.title?.title?.[0]?.text?.content || '';
        return (
          (title.includes('BUSINESS') && title.includes('OPERATIONS')) ||
          title.includes('REVENUE') ||
          title.includes('Market Domination') ||
          title.includes('Customer Profile') ||
          title.includes('Market Research') ||
          title.includes('Boundary-Pushing') ||
          title.includes('Strategic Intelligence') ||
          title.includes('Solopreneur')
        );
      }
      return false;
    });

    // Find the most complete business strategy page (REVENUE & BUSINESS OPERATIONS)
    const masterBusinessPage =
      businessStrategyPages.find(page =>
        page.properties?.title?.title?.[0]?.text?.content?.includes('REVENUE & BUSINESS OPERATIONS')
      ) || businessStrategyPages[0];

    if (masterBusinessPage && businessStrategyPages.length > 1) {
      console.log(
        `📌 Keeping master: ${masterBusinessPage.properties?.title?.title?.[0]?.text?.content}`
      );

      const archivePages = businessStrategyPages.filter(page => page.id !== masterBusinessPage.id);
      console.log(`🗑️ Archiving ${archivePages.length} duplicate business strategy pages...`);

      for (const page of archivePages) {
        try {
          await notion.pages.update({
            page_id: page.id,
            archived: true,
          });
          console.log(`✅ Archived: ${page.properties?.title?.title?.[0]?.text?.content}`);
        } catch (error) {
          console.log(`❌ Failed to archive: ${error.message}`);
        }
      }
    }

    // 2.3: Audio Intel Consolidation
    console.log('\n🎵 Consolidating Audio Intel pages...');
    const audioIntelPages = response.results.filter(item => {
      if (item.object === 'page') {
        const title = item.properties?.title?.title?.[0]?.text?.content || '';
        return (
          title.includes('Audio Intel') ||
          title.includes('AUDIO INTEL') ||
          title.includes('Master Reference') ||
          title.includes('Business HQ') ||
          title.includes('Brand Guidelines') ||
          title.includes('PIVOT') ||
          title.includes('TECHNICAL DEVELOPMENT') ||
          title.includes('PRODUCT') ||
          title.includes('SPRINT WEEK') ||
          title.includes('Strategic Framework')
        );
      }
      return false;
    });

    // Find the most complete Audio Intel page (Master Reference)
    const masterAudioIntelPage =
      audioIntelPages.find(page =>
        page.properties?.title?.title?.[0]?.text?.content?.includes('Audio Intel Master Reference')
      ) || audioIntelPages[0];

    if (masterAudioIntelPage && audioIntelPages.length > 1) {
      console.log(
        `📌 Keeping master: ${masterAudioIntelPage.properties?.title?.title?.[0]?.text?.content}`
      );

      const archivePages = audioIntelPages.filter(page => page.id !== masterAudioIntelPage.id);
      console.log(`🗑️ Archiving ${archivePages.length} duplicate Audio Intel pages...`);

      for (const page of archivePages) {
        try {
          await notion.pages.update({
            page_id: page.id,
            archived: true,
          });
          console.log(`✅ Archived: ${page.properties?.title?.title?.[0]?.text?.content}`);
        } catch (error) {
          console.log(`❌ Failed to archive: ${error.message}`);
        }
      }
    }

    // PHASE 3: Content Optimization
    console.log('\n✨ PHASE 3: CONTENT OPTIMIZATION');
    console.log('=================================');

    // Update the master pages with consolidation notes
    if (masterBusinessPage) {
      try {
        await notion.blocks.children.append({
          block_id: masterBusinessPage.id,
          children: [
            {
              object: 'block',
              type: 'heading_2',
              heading_2: {
                rich_text: [{ text: { content: '📝 Consolidation Note' } }],
              },
            },
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  {
                    text: {
                      content: `Last consolidated: ${new Date().toLocaleDateString()} - Merged ${businessStrategyPages.length - 1} duplicate business strategy pages into this master page.`,
                    },
                  },
                ],
              },
            },
          ],
        });
        console.log('✅ Added consolidation note to master business page');
      } catch (error) {
        console.log('❌ Failed to add consolidation note:', error.message);
      }
    }

    if (masterAudioIntelPage) {
      try {
        await notion.blocks.children.append({
          block_id: masterAudioIntelPage.id,
          children: [
            {
              object: 'block',
              type: 'heading_2',
              heading_2: {
                rich_text: [{ text: { content: '📝 Consolidation Note' } }],
              },
            },
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  {
                    text: {
                      content: `Last consolidated: ${new Date().toLocaleDateString()} - Merged ${audioIntelPages.length - 1} duplicate Audio Intel pages into this master page.`,
                    },
                  },
                ],
              },
            },
          ],
        });
        console.log('✅ Added consolidation note to master Audio Intel page');
      } catch (error) {
        console.log('❌ Failed to add consolidation note:', error.message);
      }
    }

    console.log('\n🎉 CONSOLIDATION COMPLETE!');
    console.log('==========================');
    console.log(`✅ Archived ${archivedCount} empty pages`);
    console.log('✅ Consolidated Radio Promo Agent duplicates');
    console.log('✅ Consolidated Business Strategy pages');
    console.log('✅ Consolidated Audio Intel pages');
    console.log('✅ Added consolidation tracking notes');
    console.log('\n📱 Your Notion workspace is now clean and organized!');
    console.log('🔗 Check your workspace - you should see a much cleaner structure');
  } catch (error) {
    console.error('Error during consolidation:', error.message);
  }
}

executeConsolidation();
