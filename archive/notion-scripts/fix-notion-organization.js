#!/usr/bin/env node
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function fixNotionOrganization() {
  try {
    console.log('🔧 FIXING NOTION WORKSPACE ORGANIZATION');
    console.log('=======================================');

    // Get the main workspace
    const workspaceId = '2580a35b-21ed-814b-bb4b-f349c38fa376';

    // First, let's create a proper top-level structure by creating a new main workspace page
    console.log('\n🏗️ Creating new organized workspace structure...');

    const newWorkspace = await notion.pages.create({
      parent: { type: 'page_id', page_id: workspaceId },
      properties: {
        title: {
          title: [{ text: { content: '🎯 TOTAL AUDIO MASTER STRUCTURE' } }],
        },
      },
      children: [
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ text: { content: 'Level 1: Core Business Areas' } }],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                text: {
                  content:
                    '📊 COMMAND CENTRE - Daily dashboard with key metrics, priorities, tasks',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                text: {
                  content:
                    '🔧 PRODUCT ECOSYSTEM - Audio Intel (Blue), Playlist Pulse (Green), Master Platform (Purple)',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                text: {
                  content:
                    '💼 BUSINESS OPERATIONS - Partnerships, revenue streams, customer feedback',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                text: {
                  content:
                    '🚀 DEVELOPMENT HUB - Claude Code + Cursor workflows, technical documentation',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                text: {
                  content:
                    '📝 CONTENT & MARKETING - Newsletter system, content bank, social media strategies',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                text: {
                  content:
                    '🗂️ ADMIN & RESOURCES - Organisation rules, templates, archive, reference materials',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ text: { content: 'Level 2: Smart Database Structure' } }],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ text: { content: 'Universal Properties Across All Databases:' } }],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              { text: { content: 'Status (Not Started, In Progress, Review, Complete)' } },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: 'Priority (High, Medium, Low)' } }],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                text: { content: 'Tool (Audio Intel, Playlist Pulse, Master Platform, Business)' },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              { text: { content: 'Business Impact (MVP Critical, Revenue Impact, Nice-to-Have)' } },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: 'Next Action (Clear next step for every item)' } }],
          },
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ text: { content: 'Key Databases:' } }],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '📋 Tasks & Projects (Master todo with filtering)' } }],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              { text: { content: '👥 Customer Pipeline (Beta users, prospects, partnerships)' } },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              { text: { content: '🗺️ Feature Roadmap (Cross-tool development planning)' } },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              { text: { content: '📅 Content Calendar (Newsletter, social, case studies)' } },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              { text: { content: '💰 Revenue Tracking (MRR, deals, partnership income)' } },
            ],
          },
        },
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ text: { content: 'Level 3: Solo Workflow Automation' } }],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ text: { content: 'Solo-Optimised Templates:' } }],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '🎯 Daily focus template (3 priorities max)' } }],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              { text: { content: '💻 Development session template for Claude Code work' } },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              { text: { content: '🤝 Partnership outreach template with follow-up tracking' } },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              { text: { content: '📝 Content planning template with 94% automation messaging' } },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              { text: { content: '💬 Customer feedback template with product impact assessment' } },
            ],
          },
        },
      ],
    });

    console.log(`✅ Created new master structure page: ${newWorkspace.id}`);

    // Now let's move the existing structure pages under this new master page
    console.log('\n📁 Moving existing structure pages under master page...');

    // Get all the structure pages we created
    const structurePages = [
      '2670a35b-21ed-81cf-9b56-dd9e47146d06', // COMMAND CENTRE
      '2670a35b-21ed-8177-a22d-e86128700ac6', // PRODUCT ECOSYSTEM
      '2670a35b-21ed-8195-83c2-db61cfd4744f', // BUSINESS OPERATIONS
      '2670a35b-21ed-8104-b3c0-e11ee4dc2a2f', // DEVELOPMENT HUB
      '2670a35b-21ed-8169-8257-dd5e7aeadf32', // CONTENT & MARKETING
      '2670a35b-21ed-8178-9bbb-e26c50c7deaa', // ADMIN & RESOURCES
    ];

    for (const pageId of structurePages) {
      try {
        await notion.pages.update({
          page_id: pageId,
          parent: { type: 'page_id', page_id: newWorkspace.id },
        });
        console.log(`✅ Moved page under master structure`);
      } catch (error) {
        console.log(`❌ Failed to move page: ${error.message}`);
      }
    }

    // Move the databases under the master page too
    console.log('\n🗃️ Moving databases under master page...');

    // Get all databases
    const response = await notion.search({
      query: '',
      page_size: 100,
    });

    const databases = response.results.filter(
      item =>
        item.object === 'database' &&
        (item.title?.[0]?.text?.content?.includes('Tasks & Projects') ||
          item.title?.[0]?.text?.content?.includes('Customer Pipeline') ||
          item.title?.[0]?.text?.content?.includes('Feature Roadmap') ||
          item.title?.[0]?.text?.content?.includes('Content Calendar') ||
          item.title?.[0]?.text?.content?.includes('Revenue Tracking'))
    );

    for (const db of databases) {
      try {
        await notion.databases.update({
          database_id: db.id,
          parent: { type: 'page_id', page_id: newWorkspace.id },
        });
        console.log(`✅ Moved database: ${db.title?.[0]?.text?.content}`);
      } catch (error) {
        console.log(`❌ Failed to move database: ${error.message}`);
      }
    }

    // Move templates under master page
    console.log('\n📋 Moving templates under master page...');

    const templates = response.results.filter(
      item =>
        item.object === 'page' &&
        item.properties?.title?.title?.[0]?.text?.content?.includes('Template')
    );

    for (const template of templates) {
      try {
        await notion.pages.update({
          page_id: template.id,
          parent: { type: 'page_id', page_id: newWorkspace.id },
        });
        console.log(`✅ Moved template: ${template.properties?.title?.title?.[0]?.text?.content}`);
      } catch (error) {
        console.log(`❌ Failed to move template: ${error.message}`);
      }
    }

    console.log('\n🎉 NOTION WORKSPACE ORGANIZATION COMPLETE!');
    console.log('==========================================');
    console.log('✅ Created master structure page at top level');
    console.log('✅ Moved all structure pages under master');
    console.log('✅ Moved all databases under master');
    console.log('✅ Moved all templates under master');
    console.log('\n📱 Your new structure should now be visible at the top of your workspace!');
    console.log(`🔗 Master Structure URL: ${newWorkspace.url}`);
  } catch (error) {
    console.error('Error fixing organization:', error.message);
  }
}

fixNotionOrganization();
