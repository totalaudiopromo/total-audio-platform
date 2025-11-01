#!/usr/bin/env node
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// CLI flags
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run') || args.includes('-n');
const limitArg = args.find(a => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : 10;
const parentIdArg = (args.find(a => a.startsWith('--parent-id=')) || '').split('=')[1];
const tidySidebar = args.includes('--tidy-sidebar');
const appendLinksParentArg = (args.find(a => a.startsWith('--append-links-parent=')) || '').split(
  '='
)[1];

async function executeCleanupPhases(options) {
  try {
    console.log('🧹 NOTION WORKSPACE CLEANUP');
    console.log('===========================');
    if (options?.dryRun) {
      console.log('🔎 Running in DRY-RUN mode (no changes will be made)');
    }

    // Get all pages
    const response = await notion.search({
      query: '',
      page_size: 100,
    });

    console.log(`\n📊 Found ${response.results.length} total pages`);

    // Phase 1: Quick Wins - Archive empty/untitled pages
    console.log('\n🚀 PHASE 1: QUICK WINS (30 minutes)');
    console.log('=====================================');

    const untitledPages = [];
    const archiveCandidates = [];

    response.results.forEach(item => {
      if (item.object === 'page') {
        const title = item.properties?.title?.title?.[0]?.text?.content || 'Untitled';

        if (title === 'Untitled') {
          untitledPages.push({ id: item.id, title, url: item.url });
        } else if (
          title.includes('Daily Entry') ||
          title.includes('Habit Tracker') ||
          title.includes('Ragga Style') ||
          title.includes('Maybe (i)') ||
          title.includes('Meta Ads') ||
          (title.includes('Pages') && title.length < 20)
        ) {
          archiveCandidates.push({ id: item.id, title, url: item.url });
        }
      }
    });

    console.log(`\n🗑️ Found ${untitledPages.length} untitled pages to archive`);
    console.log(`🗑️ Found ${archiveCandidates.length} other archive candidates`);

    // Archive untitled pages (these are definitely safe to archive)
    console.log('\n📝 Archiving untitled pages...');
    for (let i = 0; i < Math.min(untitledPages.length, options?.limit ?? 10); i++) {
      // Archive first N as test
      const page = untitledPages[i];
      try {
        if (options?.dryRun) {
          console.log(`🔎 [DRY-RUN] Would archive: ${page.title} (${page.id})`);
        } else {
          await notion.pages.update({
            page_id: page.id,
            archived: true,
          });
          console.log(`✅ Archived: ${page.title} (${page.id})`);
        }
      } catch (error) {
        console.log(`❌ Failed to archive ${page.title}: ${error.message}`);
      }
    }

    // Phase 2: Smart Consolidation - Handle duplicates
    console.log('\n🔄 PHASE 2: SMART CONSOLIDATION (45 minutes)');
    console.log('=============================================');

    // Find Radio Promo Agent duplicates
    const radioPromoPages = response.results.filter(item => {
      if (item.object === 'page') {
        const title = item.properties?.title?.title?.[0]?.text?.content || '';
        return title.includes('RADIO PROMO AGENT') && title.includes('DAY-IN-THE-LIFE');
      }
      return false;
    });

    console.log(`\n🎯 Found ${radioPromoPages.length} Radio Promo Agent duplicates`);

    if (radioPromoPages.length > 1) {
      // Keep the first one, archive the rest
      const keepPage = radioPromoPages[0];
      const archivePages = radioPromoPages.slice(1);

      console.log(`\n📌 Keeping: ${keepPage.properties?.title?.title?.[0]?.text?.content}`);
      console.log(`🗑️ Archiving ${archivePages.length} duplicates...`);

      for (const page of archivePages) {
        try {
          if (options?.dryRun) {
            console.log(
              `🔎 [DRY-RUN] Would archive duplicate: ${page.properties?.title?.title?.[0]?.text?.content} (${page.id})`
            );
          } else {
            await notion.pages.update({
              page_id: page.id,
              archived: true,
            });
            console.log(
              `✅ Archived duplicate: ${page.properties?.title?.title?.[0]?.text?.content}`
            );
          }
        } catch (error) {
          console.log(`❌ Failed to archive duplicate: ${error.message}`);
        }
      }
    }

    // Find Total Audio Transfer duplicates
    const transferPages = response.results.filter(item => {
      if (item.object === 'page') {
        const title = item.properties?.title?.title?.[0]?.text?.content || '';
        return title.includes('Total Audio Transfer') || title.includes('TOTAL AUDIO TRANSFER');
      }
      return false;
    });

    console.log(`\n🎯 Found ${transferPages.length} Total Audio Transfer duplicates`);

    if (transferPages.length > 1) {
      // Keep the one with more complete title, archive the rest
      const keepPage =
        transferPages.find(p =>
          p.properties?.title?.title?.[0]?.text?.content?.includes('(RECORD LABEL)')
        ) || transferPages[0];
      const archivePages = transferPages.filter(p => p.id !== keepPage.id);

      console.log(`\n📌 Keeping: ${keepPage.properties?.title?.title?.[0]?.text?.content}`);
      console.log(`🗑️ Archiving ${archivePages.length} duplicates...`);

      for (const page of archivePages) {
        try {
          if (options?.dryRun) {
            console.log(
              `🔎 [DRY-RUN] Would archive duplicate: ${page.properties?.title?.title?.[0]?.text?.content} (${page.id})`
            );
          } else {
            await notion.pages.update({
              page_id: page.id,
              archived: true,
            });
            console.log(
              `✅ Archived duplicate: ${page.properties?.title?.title?.[0]?.text?.content}`
            );
          }
        } catch (error) {
          console.log(`❌ Failed to archive duplicate: ${error.message}`);
        }
      }
    }

    // Additional: De-duplicate master navigation/structure pages
    const masterNavPages = response.results.filter(item => {
      if (item.object !== 'page') return false;
      const title = item.properties?.title?.title?.[0]?.text?.content || '';
      if (!title) return false;
      const lower = title.toLowerCase();
      const looksLikeNav =
        lower.includes('master workspace') ||
        lower.includes('master structure') ||
        lower.includes('navigation') ||
        lower.includes('command centre') ||
        lower.includes('command center') ||
        lower.includes('dashboard');
      return looksLikeNav;
    });

    if (masterNavPages.length > 1) {
      // Keep the most likely canonical version (prefer CLEAN), archive the rest
      const canonical =
        masterNavPages.find(p => {
          const t = p.properties?.title?.title?.[0]?.text?.content?.toLowerCase() || '';
          return t.includes('clean') || t.includes('master workspace');
        }) || masterNavPages[0];

      const toArchive = masterNavPages.filter(p => p.id !== canonical.id);
      console.log(
        `\n🎯 Found ${masterNavPages.length} master/nav pages → keeping one, archiving ${toArchive.length}`
      );
      console.log(`📌 Keeping: ${canonical.properties?.title?.title?.[0]?.text?.content}`);

      for (const page of toArchive) {
        try {
          if (options?.dryRun) {
            console.log(
              `🔎 [DRY-RUN] Would archive overlapping nav: ${page.properties?.title?.title?.[0]?.text?.content} (${page.id})`
            );
          } else {
            await notion.pages.update({ page_id: page.id, archived: true });
            console.log(
              `✅ Archived overlapping nav: ${page.properties?.title?.title?.[0]?.text?.content}`
            );
          }
        } catch (error) {
          console.log(`❌ Failed to archive overlapping nav: ${error.message}`);
        }
      }
    }

    // Phase 3: Structure organisation (skip creation in tidy-sidebar mode)
    console.log('\n📁 PHASE 3: STRUCTURE ORGANISATION (30 minutes)');
    console.log('===============================================');

    // Create the new master structure (disabled in tidy-sidebar mode)
    const parentId =
      options?.parentId && options.parentId.length > 0
        ? options.parentId
        : '2580a35b-21ed-814b-bb4b-f349c38fa376'; // Main workspace

    const structurePages = [
      {
        title: '📊 COMMAND CENTRE',
        description: 'Daily dashboard with key metrics, priorities, tasks',
      },
      {
        title: '🔧 PRODUCT ECOSYSTEM',
        description: 'Audio Intel (Blue), Playlist Pulse (Green), Master Platform (Purple)',
      },
      {
        title: '💼 BUSINESS OPERATIONS',
        description: 'Partnerships, revenue streams, customer feedback',
      },
      {
        title: '🚀 DEVELOPMENT HUB',
        description: 'Claude Code + Cursor workflows, technical documentation',
      },
      {
        title: '📝 CONTENT & MARKETING',
        description: 'Newsletter system, content bank, social media strategies',
      },
      {
        title: '🗂️ ADMIN & RESOURCES',
        description: 'Organisation rules, templates, archive, reference materials',
      },
    ];

    if (options?.tidySidebar) {
      console.log('🧼 Tidy-sidebar mode: skipping creation of new master pages.');
      // Optionally append link_to_page blocks under a parent for lightweight navigation
      if (options?.appendLinksParent) {
        console.log(`🔗 Building link-only navigation under ${options.appendLinksParent}...`);
        // Simple heuristic: collect a few key pages to link
        const keyPages = response.results
          .filter(item => {
            if (item.object !== 'page') return false;
            const title = item.properties?.title?.title?.[0]?.text?.content || '';
            if (!title) return false;
            const lower = title.toLowerCase();
            const isNav =
              lower.includes('master') ||
              lower.includes('navigation') ||
              lower.includes('dashboard');
            return !isNav; // avoid linking nav pages
          })
          .slice(0, 10);

        const children = keyPages.map(p => ({
          object: 'block',
          type: 'link_to_page',
          link_to_page: { type: 'page_id', page_id: p.id },
        }));

        if (options?.dryRun) {
          keyPages.forEach(p =>
            console.log(
              `🔎 [DRY-RUN] Would link: ${p.properties?.title?.title?.[0]?.text?.content} (${p.id})`
            )
          );
        } else if (children.length > 0) {
          try {
            await notion.blocks.children.append({ block_id: options.appendLinksParent, children });
            console.log(`✅ Added ${children.length} links under ${options.appendLinksParent}`);
          } catch (err) {
            console.log(`❌ Failed to append links: ${err.message}`);
          }
        }
      }
    } else {
      console.log('\n🏗️ Creating new organized structure...');
      for (const pageInfo of structurePages) {
        try {
          if (options?.dryRun) {
            console.log(`🔎 [DRY-RUN] Would create: ${pageInfo.title} under parent ${parentId}`);
          } else {
            const response = await notion.pages.create({
              parent: { page_id: parentId },
              properties: {
                title: {
                  title: [{ text: { content: pageInfo.title } }],
                },
              },
              children: [
                {
                  object: 'block',
                  type: 'paragraph',
                  paragraph: {
                    rich_text: [{ text: { content: pageInfo.description } }],
                  },
                },
              ],
            });
            console.log(`✅ Created: ${pageInfo.title}`);
          }
        } catch (error) {
          console.log(`❌ Failed to create ${pageInfo.title}: ${error.message}`);
        }
      }
    }

    console.log('\n🎉 CLEANUP COMPLETE!');
    console.log('===================');
    console.log('✅ Archived untitled pages');
    console.log('✅ Consolidated duplicate pages');
    console.log('✅ Created organized structure');
    console.log('\n📋 Next steps:');
    console.log('1. Review archived pages in Notion');
    console.log('2. Move existing content into new structure');
    console.log('3. Update internal links');
  } catch (error) {
    console.error('Error during cleanup:', error.message);
  }
}

executeCleanupPhases({
  dryRun,
  limit,
  parentId: parentIdArg,
  tidySidebar,
  appendLinksParent: appendLinksParentArg,
});
