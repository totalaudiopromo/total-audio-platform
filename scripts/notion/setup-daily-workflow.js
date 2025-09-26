#!/usr/bin/env node
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function setupDailyWorkflow() {
  try {
    console.log('🚀 SETTING UP DAILY WORKFLOW & MAINTENANCE');
    console.log('==========================================');
    
    // Create a Daily Workflow Setup page
    const workspaceId = '2580a35b-21ed-814b-bb4b-f349c38fa376';
    
    const dailyWorkflowPage = await notion.pages.create({
      parent: { type: 'page_id', page_id: workspaceId },
      properties: {
        title: {
          title: [{ text: { content: '🚀 DAILY WORKFLOW SETUP' } }]
        }
      },
      children: [
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ text: { content: '⭐ RECOMMENDED FAVORITES' } }]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ text: { content: 'Add these pages to your Notion favorites for instant access:' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '🎯 TOTAL AUDIO MASTER STRUCTURE - Your main navigation hub' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '🚀 MASTER TO-DO LIST - SEPTEMBER 2025 - Daily priorities' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '🎯 Audio Intel Master Reference - Product development' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '💰 REVENUE & BUSINESS OPERATIONS - Business strategy' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '🚀 DEVELOPMENT HUB - Technical work' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '📝 CONTENT & MARKETING - Content creation' } }]
          }
        },
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ text: { content: '📱 MOBILE WORKFLOW SETUP' } }]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ text: { content: 'For mobile productivity, bookmark these pages in your phone browser:' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: 'Master Structure: https://www.notion.so/TOTAL-AUDIO-MASTER-STRUCTURE-2670a35b21ed816f8b6ac21d810a4df4' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: 'Daily To-Do: https://www.notion.so/MASTER-TO-DO-LIST-SEPTEMBER-2025-2660a35b21ed810ba815f2ebf7def22e' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: 'Audio Intel: https://www.notion.so/Audio-Intel-Master-Reference-Complete-Context-Summary-25d0a35b21ed819aa616d1f3793dbf14' } }]
          }
        },
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ text: { content: '⚡ QUICK CAPTURE TEMPLATES' } }]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ text: { content: 'Use these templates for quick idea capture on the go:' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '🎯 Daily Focus Template - 3 priorities max' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '💻 Development Session Template - Claude Code work' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '🤝 Partnership Outreach Template - Follow-up tracking' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '📝 Content Planning Template - 94% automation messaging' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '💬 Customer Feedback Template - Product impact assessment' } }]
          }
        },
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ text: { content: '🧹 MAINTENANCE RULES' } }]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ text: { content: 'Simple rules to prevent re-scatter (5 minutes weekly):' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '✅ One topic = One page (no duplicates)' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '✅ Always update the master, never create new versions' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '✅ Weekly 5-minute cleanup to catch any drift' } }]
          }
        },
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ text: { content: '📅 DAILY WORKFLOW CHECKLIST' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '🌅 Morning: Check Master To-Do List for today\'s 3 priorities' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '💻 Development: Use Development Session Template for Claude Code work' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '📝 Content: Use Content Planning Template for social media/outreach' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '🤝 Partnerships: Use Partnership Outreach Template for follow-ups' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '🌙 Evening: Update progress in Master To-Do List' } }]
          }
        },
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ text: { content: '🎯 BUSINESS-FOCUSED ACTIONS' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '💰 Update daily priorities in clean to-do system' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '📊 Use consolidated business strategy to focus on £500/month target' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '🎵 Leverage organized Audio Intel content for customer acquisition' } }]
          }
        },
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ text: { content: '🚀 STRATEGIC NEXT STEPS' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '🔧 Set up automation between Notion and development workflow' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '📋 Create templates for recurring business activities' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '📊 Consider database views vs static pages for different sections' } }]
          }
        },
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ text: { content: '✅ VALIDATION CHECKLIST' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '☐ Daily essentials are easily accessible' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '☐ Consolidated master pages have all needed content' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '☐ Navigation flow from main workspace to key sections works' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '☐ Mobile shortcuts set up for phone work' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '☐ Quick-capture templates ready for ideas on the go' } }]
          }
        }
      ]
    });
    
    console.log(`✅ Created Daily Workflow Setup page: ${dailyWorkflowPage.id}`);
    console.log(`🔗 URL: ${dailyWorkflowPage.url}`);
    
    // Create a maintenance reminder page
    const maintenancePage = await notion.pages.create({
      parent: { type: 'page_id', page_id: workspaceId },
      properties: {
        title: {
          title: [{ text: { content: '🧹 WEEKLY MAINTENANCE CHECKLIST' } }]
        }
      },
      children: [
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ text: { content: '📅 Every Friday - 5 Minutes' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '☐ Check for any new duplicate pages' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '☐ Archive any empty or outdated pages' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '☐ Update master pages with new content' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '☐ Review favorites - remove unused, add new essentials' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '☐ Check internal links still work' } }]
          }
        },
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ text: { content: '🚨 RED FLAGS TO WATCH FOR' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '❌ Multiple pages with similar titles' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '❌ Content scattered across multiple locations' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '❌ Outdated information in master pages' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: '❌ Broken internal links' } }]
          }
        }
      ]
    });
    
    console.log(`✅ Created Weekly Maintenance Checklist: ${maintenancePage.id}`);
    console.log(`🔗 URL: ${maintenancePage.url}`);
    
    console.log('\n🎉 DAILY WORKFLOW SETUP COMPLETE!');
    console.log('==================================');
    console.log('✅ Created Daily Workflow Setup page');
    console.log('✅ Created Weekly Maintenance Checklist');
    console.log('✅ Identified key pages for favorites');
    console.log('✅ Set up mobile workflow recommendations');
    console.log('✅ Established maintenance rules');
    console.log('\n📱 NEXT STEPS:');
    console.log('1. Add the recommended pages to your Notion favorites');
    console.log('2. Bookmark the mobile URLs on your phone');
    console.log('3. Test the daily workflow checklist');
    console.log('4. Set a weekly reminder for maintenance');
    
  } catch (error) {
    console.error('Error setting up daily workflow:', error.message);
  }
}

setupDailyWorkflow();






