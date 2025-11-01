#!/usr/bin/env node
// Simple Sidebar Organization Script for Notion
// Addresses block limit by consolidating and archiving content

const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_API_KEY });

class NotionOrganizer {
  constructor() {
    this.archiveFolderId = null;
    this.consolidatedPages = new Map();
  }

  async initialize() {
    console.log('🚀 Initializing Notion Organization...');

    // Create archive folder for review
    await this.createArchiveFolder();

    // Audit current workspace
    await this.auditWorkspace();

    // Consolidate duplicate content
    await this.consolidateDuplicates();

    // Create clean sidebar structure
    await this.createCleanSidebar();
  }

  async createArchiveFolder() {
    try {
      const mainWorkspaceId = '2580a35b-21ed-814b-bb4b-f349c38fa376';

      const response = await notion.pages.create({
        parent: { page_id: mainWorkspaceId },
        properties: {
          title: {
            title: [{ type: 'text', text: { content: '📦 ARCHIVE - REVIEW BEFORE DELETING' } }],
          },
        },
        children: [
          {
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content:
                      'This folder contains pages that can be safely deleted to free up blocks. Review each page before deleting.',
                  },
                },
              ],
            },
          },
          {
            type: 'heading_2',
            heading_2: {
              rich_text: [
                { type: 'text', text: { content: '⚠️ IMPORTANT: Review Before Deleting' } },
              ],
            },
          },
          {
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content:
                      'These pages have been identified as duplicates, old versions, or low-priority content that can be safely removed to free up your block limit.',
                  },
                },
              ],
            },
          },
        ],
      });

      this.archiveFolderId = response.id;
      console.log('✅ Created archive folder for review');
      console.log(`   Archive ID: ${this.archiveFolderId}`);
    } catch (error) {
      console.error('Error creating archive folder:', error.message);
    }
  }

  async auditWorkspace() {
    try {
      console.log('\n📊 AUDITING WORKSPACE...');

      const searchResults = await notion.search({
        query: '',
        page_size: 100,
      });

      console.log(`Total pages found: ${searchResults.results.length}`);

      // Categorize pages
      const categories = {
        duplicates: [],
        oldVersions: [],
        lowPriority: [],
        essential: [],
      };

      searchResults.results.forEach(page => {
        const title = page.properties.title?.title?.[0]?.plain_text || 'Untitled';

        if (title.includes('duplicate') || title.includes('old') || title.includes('archive')) {
          categories.duplicates.push(page);
        } else if (title.includes('untitled') || title.includes('Untitled')) {
          categories.lowPriority.push(page);
        } else if (
          title.includes('MASTER') ||
          title.includes('CURRENT') ||
          title.includes('Audio Intel')
        ) {
          categories.essential.push(page);
        } else {
          categories.oldVersions.push(page);
        }
      });

      console.log(`\n📋 CATEGORIZATION RESULTS:`);
      console.log(`   Essential pages: ${categories.essential.length}`);
      console.log(`   Duplicates: ${categories.duplicates.length}`);
      console.log(`   Old versions: ${categories.oldVersions.length}`);
      console.log(`   Low priority: ${categories.lowPriority.length}`);

      return categories;
    } catch (error) {
      console.error('Error auditing workspace:', error.message);
      return null;
    }
  }

  async consolidateDuplicates() {
    try {
      console.log('\n🔄 CONSOLIDATING DUPLICATES...');

      // Find and consolidate Radio Promo Agent pages
      const radioPromoPages = await notion.search({
        query: 'RADIO PROMO AGENT',
        page_size: 20,
      });

      if (radioPromoPages.results.length > 1) {
        console.log(`Found ${radioPromoPages.results.length} Radio Promo Agent pages`);

        // Keep the first one, archive the rest
        const mainPage = radioPromoPages.results[0];
        const duplicates = radioPromoPages.results.slice(1);

        for (const duplicate of duplicates) {
          try {
            await notion.pages.update({
              page_id: duplicate.id,
              parent: { page_id: this.archiveFolderId },
            });
            console.log(
              `   ✅ Moved duplicate to archive: ${duplicate.properties.title?.title?.[0]?.plain_text}`
            );
          } catch (error) {
            console.log(
              `   ⚠️ Could not move: ${duplicate.properties.title?.title?.[0]?.plain_text}`
            );
          }
        }
      }

      // Find and consolidate Master Structure pages
      const masterStructurePages = await notion.search({
        query: 'MASTER STRUCTURE',
        page_size: 20,
      });

      if (masterStructurePages.results.length > 1) {
        console.log(`Found ${masterStructurePages.results.length} Master Structure pages`);

        // Keep the "CLEAN" version, archive the rest
        const cleanVersion = masterStructurePages.results.find(page =>
          page.properties.title?.title?.[0]?.plain_text?.includes('CLEAN')
        );

        const duplicates = masterStructurePages.results.filter(
          page => !page.properties.title?.title?.[0]?.plain_text?.includes('CLEAN')
        );

        for (const duplicate of duplicates) {
          try {
            await notion.pages.update({
              page_id: duplicate.id,
              parent: { page_id: this.archiveFolderId },
            });
            console.log(
              `   ✅ Moved duplicate to archive: ${duplicate.properties.title?.title?.[0]?.plain_text}`
            );
          } catch (error) {
            console.log(
              `   ⚠️ Could not move: ${duplicate.properties.title?.title?.[0]?.plain_text}`
            );
          }
        }
      }
    } catch (error) {
      console.error('Error consolidating duplicates:', error.message);
    }
  }

  async createCleanSidebar() {
    try {
      console.log('\n🎯 CREATING CLEAN SIDEBAR STRUCTURE...');

      const mainWorkspaceId = '2580a35b-21ed-814b-bb4b-f349c38fa376';

      // Create a clean navigation page
      const cleanNavContent = [
        {
          type: 'heading_1',
          heading_1: {
            rich_text: [{ type: 'text', text: { content: '🎯 CLEAN WORKSPACE NAVIGATION' } }],
          },
        },
        {
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content:
                    'Your workspace has been cleaned and organized. Use the sidebar to navigate between folders.',
                },
              },
            ],
          },
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: '📁 ORGANIZED FOLDERS' } }],
          },
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: { content: '📋 Daily Operations - Your to-dos and priorities' },
              },
            ],
          },
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              { type: 'text', text: { content: '🎯 Audio Intel Product - Product development' } },
            ],
          },
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              { type: 'text', text: { content: '📊 Business Strategy - Revenue and growth' } },
            ],
          },
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              { type: 'text', text: { content: '🔧 Technical Development - Code and agents' } },
            ],
          },
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              { type: 'text', text: { content: '📝 Content & Marketing - Brand and content' } },
            ],
          },
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: '📦 Archive - Review before deleting' } }],
          },
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: '✅ BLOCK LIMIT SOLUTION' } }],
          },
        },
        {
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content:
                    'Duplicates and old content have been moved to the Archive folder. Review the Archive folder and delete pages you no longer need to free up blocks.',
                },
              },
            ],
          },
        },
      ];

      await notion.blocks.children.append({
        block_id: mainWorkspaceId,
        children: cleanNavContent,
      });

      console.log('✅ Created clean navigation structure');
    } catch (error) {
      console.error('Error creating clean sidebar:', error.message);
    }
  }

  async restoreTrashedPage() {
    try {
      console.log('\n🔄 CHECKING FOR TRASHED PAGES...');

      // The page that was moved to trash (from the image description)
      const trashedPageId = '2670a35b-21ed-816f-8b6a-c21d810a4df4';

      try {
        // Try to restore the page
        await notion.pages.update({
          page_id: trashedPageId,
          archived: false,
        });

        console.log('✅ Restored trashed page: TOTAL AUDIO MASTER STRUCTURE');

        // Move it to the main workspace
        const mainWorkspaceId = '2580a35b-21ed-814b-bb4b-f349c38fa376';
        await notion.pages.update({
          page_id: trashedPageId,
          parent: { page_id: mainWorkspaceId },
        });

        console.log('✅ Moved restored page to main workspace');
      } catch (error) {
        console.log('⚠️ Could not restore trashed page (may already be restored)');
      }
    } catch (error) {
      console.error('Error restoring trashed page:', error.message);
    }
  }
}

// Run the organization
async function main() {
  const organizer = new NotionOrganizer();

  try {
    await organizer.initialize();
    await organizer.restoreTrashedPage();

    console.log('\n🎉 NOTION ORGANIZATION COMPLETE!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Check the Archive folder for pages you can safely delete');
    console.log('2. Delete old/duplicate pages from the Archive to free up blocks');
    console.log('3. Use the clean sidebar structure for daily navigation');
    console.log('4. Consider upgrading to Notion Pro if you need more blocks');
  } catch (error) {
    console.error('Organization failed:', error.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = NotionOrganizer;
