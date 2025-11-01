#!/usr/bin/env node
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function createMasterDatabases() {
  try {
    console.log('🗃️ CREATING MASTER DATABASE STRUCTURE');
    console.log('=====================================');

    // Get the main workspace
    const workspaceId = '2580a35b-21ed-814b-bb4b-f349c38fa376';

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

    // 2. Customer Pipeline Database
    console.log('\n👥 Creating Customer Pipeline Database...');
    const customerDb = await notion.databases.create({
      parent: { type: 'page_id', page_id: workspaceId },
      title: [{ text: { content: '👥 Customer Pipeline' } }],
      properties: {
        'Company/Name': { title: {} },
        'Contact Person': { rich_text: {} },
        Email: { email: {} },
        Phone: { phone_number: {} },
        Stage: {
          select: {
            options: [
              { name: 'Lead', color: 'gray' },
              { name: 'Qualified', color: 'blue' },
              { name: 'Proposal', color: 'yellow' },
              { name: 'Negotiation', color: 'orange' },
              { name: 'Closed Won', color: 'green' },
              { name: 'Closed Lost', color: 'red' },
            ],
          },
        },
        Value: { number: { format: 'currency' } },
        Source: {
          select: {
            options: [
              { name: 'LinkedIn', color: 'blue' },
              { name: 'Referral', color: 'green' },
              { name: 'Cold Outreach', color: 'yellow' },
              { name: 'Website', color: 'purple' },
            ],
          },
        },
        Notes: { rich_text: {} },
        ...universalProperties,
      },
    });
    console.log(`✅ Created: ${customerDb.title[0].text.content}`);

    // 3. Feature Roadmap Database
    console.log('\n🗺️ Creating Feature Roadmap Database...');
    const roadmapDb = await notion.databases.create({
      parent: { type: 'page_id', page_id: workspaceId },
      title: [{ text: { content: '🗺️ Feature Roadmap' } }],
      properties: {
        Feature: { title: {} },
        Description: { rich_text: {} },
        Sprint: {
          select: {
            options: [
              { name: 'Current Sprint', color: 'red' },
              { name: 'Next Sprint', color: 'orange' },
              { name: 'Sprint +2', color: 'yellow' },
              { name: 'Future', color: 'gray' },
            ],
          },
        },
        Effort: {
          select: {
            options: [
              { name: 'Small (1-2 days)', color: 'green' },
              { name: 'Medium (3-5 days)', color: 'yellow' },
              { name: 'Large (1-2 weeks)', color: 'orange' },
              { name: 'Epic (2+ weeks)', color: 'red' },
            ],
          },
        },
        Dependencies: { relation: { database_id: 'self' } },
        'Acceptance Criteria': { rich_text: {} },
        ...universalProperties,
      },
    });
    console.log(`✅ Created: ${roadmapDb.title[0].text.content}`);

    // 4. Content Calendar Database
    console.log('\n📅 Creating Content Calendar Database...');
    const contentDb = await notion.databases.create({
      parent: { type: 'page_id', page_id: workspaceId },
      title: [{ text: { content: '📅 Content Calendar' } }],
      properties: {
        Title: { title: {} },
        Type: {
          select: {
            options: [
              { name: 'Newsletter', color: 'blue' },
              { name: 'Social Media', color: 'green' },
              { name: 'Case Study', color: 'purple' },
              { name: 'Blog Post', color: 'orange' },
              { name: 'Video', color: 'red' },
            ],
          },
        },
        'Publish Date': { date: {} },
        Platform: {
          multi_select: {
            options: [
              { name: 'LinkedIn', color: 'blue' },
              { name: 'Twitter', color: 'blue' },
              { name: 'Email', color: 'green' },
              { name: 'YouTube', color: 'red' },
              { name: 'Website', color: 'purple' },
            ],
          },
        },
        Content: { rich_text: {} },
        Published: { checkbox: {} },
        Engagement: { number: {} },
        ...universalProperties,
      },
    });
    console.log(`✅ Created: ${contentDb.title[0].text.content}`);

    // 5. Revenue Tracking Database
    console.log('\n💰 Creating Revenue Tracking Database...');
    const revenueDb = await notion.databases.create({
      parent: { type: 'page_id', page_id: workspaceId },
      title: [{ text: { content: '💰 Revenue Tracking' } }],
      properties: {
        Source: { title: {} },
        Type: {
          select: {
            options: [
              { name: 'MRR', color: 'green' },
              { name: 'One-time', color: 'blue' },
              { name: 'Partnership', color: 'purple' },
              { name: 'Consulting', color: 'orange' },
            ],
          },
        },
        Amount: { number: { format: 'currency' } },
        Date: { date: {} },
        Customer: { relation: { database_id: customerDb.id } },
        Notes: { rich_text: {} },
        Recurring: { checkbox: {} },
        ...universalProperties,
      },
    });
    console.log(`✅ Created: ${revenueDb.title[0].text.content}`);

    console.log('\n🎉 MASTER DATABASE STRUCTURE COMPLETE!');
    console.log('=====================================');
    console.log('✅ Tasks & Projects Database');
    console.log('✅ Customer Pipeline Database');
    console.log('✅ Feature Roadmap Database');
    console.log('✅ Content Calendar Database');
    console.log('✅ Revenue Tracking Database');
    console.log('\n📋 All databases include universal properties:');
    console.log('  - Status (Not Started, In Progress, Review, Complete)');
    console.log('  - Priority (High, Medium, Low)');
    console.log('  - Tool (Audio Intel, Playlist Pulse, Master Platform, Business)');
    console.log('  - Business Impact (MVP Critical, Revenue Impact, Nice-to-Have)');
    console.log('  - Next Action (Clear next step for every item)');
  } catch (error) {
    console.error('Error creating databases:', error.message);
  }
}

createMasterDatabases();
