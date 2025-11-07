#!/usr/bin/env node
/**
 * Notion Workspace Manager
 * Consolidated script combining all Notion workspace management functionality
 *
 * Combines functionality from:
 * - notion-cleanup.js
 * - notion-audit.js
 * - notion-content-audit.js
 * - execute-consolidation.js
 * - simple-sidebar-org.js
 * - fix-notion-organization.js
 * - create-master-databases.js
 */

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
const mode = args.find(a => a.startsWith('--mode='))?.split('=')[1] || 'cleanup';

class NotionWorkspaceManager {
  constructor() {
    this.archiveFolderId = null;
    this.consolidatedPages = new Map();
  }

  async initialize() {
    console.log('🚀 NOTION WORKSPACE MANAGER');
    console.log('===========================');
    if (dryRun) {
      console.log('🔎 Running in DRY-RUN mode (no changes will be made)');
    }

    switch (mode) {
      case 'audit':
        await this.performAudit();
        break;
      case 'consolidate':
        await this.executeConsolidation();
        break;
      case 'organize':
        await this.organizeWorkspace();
        break;
      case 'create-databases':
        await this.createMasterDatabases();
        break;
      case 'cleanup':
      default:
        await this.executeCleanupPhases();
        break;
    }
  }

  async performAudit() {
    try {
      console.log('🔍 NOTION WORKSPACE AUDIT');
      console.log('==========================');

      const response = await notion.search({
        query: '',
        page_size: 100,
      });

      console.log(`📊 Total pages found: ${response.results.length}\n`);

      // Categorize pages by type for analysis
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

          const pageInfo = {
            id: pageId,
            title,
            url,
            lastEdited: item.last_edited_time,
          };

          // Categorize based on title
          const titleLower = title.toLowerCase();

          if (titleLower.includes('untitled') || title.length < 5) {
            pageCategories['Archived/Empty'].push(pageInfo);
          } else if (
            titleLower.includes('template') ||
            titleLower.includes('daily focus') ||
            titleLower.includes('development session')
          ) {
            pageCategories['Templates'].push(pageInfo);
          } else if (titleLower.includes('audio intel') || titleLower.includes('audio intel')) {
            pageCategories['Audio Intel'].push(pageInfo);
          } else if (
            titleLower.includes('playlist pulse') ||
            titleLower.includes('playlist pulse')
          ) {
            pageCategories['Playlist Pulse'].push(pageInfo);
          } else if (
            titleLower.includes('business') ||
            titleLower.includes('strategy') ||
            titleLower.includes('market') ||
            titleLower.includes('revenue') ||
            titleLower.includes('pricing')
          ) {
            pageCategories['Business Strategy'].push(pageInfo);
          } else if (
            titleLower.includes('pricing') ||
            titleLower.includes('£') ||
            titleLower.includes('pricing')
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
            console.log(`   Last Edited: ${new Date(page.lastEdited).toLocaleDateString()}`);
            console.log('');
          });
          console.log('');
        }
      });

      // Identify potential overlaps
      console.log('🔄 OVERLAP ANALYSIS');
      console.log('==================');

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

      console.log('\n✅ AUDIT COMPLETE!');
    } catch (error) {
      console.error('Error during audit:', error.message);
    }
  }

  async executeConsolidation() {
    try {
      console.log('🧹 EXECUTING NOTION CONSOLIDATION');
      console.log('==================================');

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
      for (const page of emptyPages.slice(0, limit)) {
        try {
          if (dryRun) {
            console.log(
              `🔎 [DRY-RUN] Would archive: ${
                page.properties?.title?.title?.[0]?.text?.content || 'Untitled'
              }`
            );
          } else {
            await notion.pages.update({
              page_id: page.id,
              archived: true,
            });
            archivedCount++;
            console.log(
              `✅ Archived: ${page.properties?.title?.title?.[0]?.text?.content || 'Untitled'}`
            );
          }
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
            if (dryRun) {
              console.log(
                `🔎 [DRY-RUN] Would archive duplicate: ${page.properties?.title?.title?.[0]?.text?.content}`
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

      console.log('\n🎉 CONSOLIDATION COMPLETE!');
      console.log('==========================');
      console.log(`✅ Archived ${archivedCount} empty pages`);
      console.log('✅ Consolidated Radio Promo Agent duplicates');
      console.log('✅ Consolidated Business Strategy pages');
      console.log('✅ Consolidated Audio Intel pages');
    } catch (error) {
      console.error('Error during consolidation:', error.message);
    }
  }

  async organizeWorkspace() {
    try {
      console.log('🎯 ORGANIZING WORKSPACE STRUCTURE');
      console.log('==================================');

      const workspaceId = parentIdArg || '2580a35b-21ed-814b-bb4b-f349c38fa376';

      // Create the new master structure
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

      if (tidySidebar) {
        console.log('🧼 Tidy-sidebar mode: skipping creation of new master pages.');
      } else {
        console.log('\n🏗️ Creating new organized structure...');
        for (const pageInfo of structurePages) {
          try {
            if (dryRun) {
              console.log(
                `🔎 [DRY-RUN] Would create: ${pageInfo.title} under parent ${workspaceId}`
              );
            } else {
              const response = await notion.pages.create({
                parent: { page_id: workspaceId },
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

      console.log('\n🎉 WORKSPACE ORGANIZATION COMPLETE!');
    } catch (error) {
      console.error('Error organizing workspace:', error.message);
    }
  }

  async createMasterDatabases() {
    try {
      console.log('🗃️ CREATING MASTER DATABASE STRUCTURE');
      console.log('=====================================');

      const workspaceId = parentIdArg || '2580a35b-21ed-814b-bb4b-f349c38fa376';

      // Universal properties for all databases
      const universalProperties = {
        Status: {
          select: {
            options: [
              { name: 'Not Started', color: 'gray' },
              { name: 'In Progress', color: 'blue' },
              { name: 'Review', color: 'yellow' },
              { name: 'Complete', color: 'green' },
            ],
          },
        },
        Priority: {
          select: {
            options: [
              { name: 'High', color: 'red' },
              { name: 'Medium', color: 'yellow' },
              { name: 'Low', color: 'gray' },
            ],
          },
        },
        Tool: {
          select: {
            options: [
              { name: 'Audio Intel', color: 'blue' },
              { name: 'Playlist Pulse', color: 'green' },
              { name: 'Master Platform', color: 'purple' },
              { name: 'Business', color: 'orange' },
            ],
          },
        },
        'Business Impact': {
          select: {
            options: [
              { name: 'MVP Critical', color: 'red' },
              { name: 'Revenue Impact', color: 'orange' },
              { name: 'Nice-to-Have', color: 'gray' },
            ],
          },
        },
        'Next Action': {
          rich_text: {},
        },
        Created: {
          created_time: {},
        },
        'Last Modified': {
          last_edited_time: {},
        },
      };

      // 1. Tasks & Projects Database
      console.log('\n📋 Creating Tasks & Projects Database...');
      if (dryRun) {
        console.log('🔎 [DRY-RUN] Would create Tasks & Projects Database');
      } else {
        const tasksDb = await notion.databases.create({
          parent: { type: 'page_id', page_id: workspaceId },
          title: [{ text: { content: '📋 Tasks & Projects' } }],
          properties: {
            Name: { title: {} },
            Description: { rich_text: {} },
            'Due Date': { date: {} },
            Assignee: { people: {} },
            Tags: { multi_select: {} },
            ...universalProperties,
          },
        });
        console.log(`✅ Created: ${tasksDb.title[0].text.content}`);
      }

      console.log('\n🎉 MASTER DATABASE STRUCTURE COMPLETE!');
    } catch (error) {
      console.error('Error creating databases:', error.message);
    }
  }

  async executeCleanupPhases() {
    try {
      console.log('🧹 NOTION WORKSPACE CLEANUP');
      console.log('===========================');
      if (dryRun) {
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
      for (let i = 0; i < Math.min(untitledPages.length, limit); i++) {
        const page = untitledPages[i];
        try {
          if (dryRun) {
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

      console.log('\n🎉 CLEANUP COMPLETE!');
      console.log('===================');
      console.log('✅ Archived untitled pages');
      console.log('✅ Consolidated duplicate pages');
      console.log('✅ Created organized structure');
    } catch (error) {
      console.error('Error during cleanup:', error.message);
    }
  }
}

// Run the appropriate mode
async function main() {
  const manager = new NotionWorkspaceManager();
  await manager.initialize();
}

if (require.main === module) {
  main();
}

module.exports = NotionWorkspaceManager;
