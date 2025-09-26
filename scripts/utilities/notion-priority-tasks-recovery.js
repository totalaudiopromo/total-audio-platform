#!/usr/bin/env node

const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function recoverPriorityTasks() {
  try {
    console.log('🎯 PRIORITY TASKS RECOVERY');
    console.log('==========================');
    
    // The main page with your priority tasks
    const priorityPageId = '2660a35b-21ed-81c8-acc7-e5c626c5ed08';
    
    console.log('📄 Reading your priority tasks page...');
    
    // Get the page content
    const page = await notion.pages.retrieve({ page_id: priorityPageId });
    const blocks = await notion.blocks.children.list({ block_id: priorityPageId });
    
    console.log('✅ Found your priority tasks page!');
    console.log('URL: https://www.notion.so/2660a35b21ed81c8acc7e5c626c5ed08');
    
    // Extract priority tasks
    const priorityTasks = {
      high: [],
      medium: [],
      low: []
    };
    
    let currentPriority = null;
    let currentTask = null;
    
    for (const block of blocks.results) {
      if (block.type === 'heading_2' && block.heading_2.rich_text.length > 0) {
        const text = block.heading_2.rich_text.map(t => t.plain_text).join('');
        
        if (text.includes('PRIORITY 1') || text.includes('PRIORITY 2') || text.includes('PRIORITY 3')) {
          currentPriority = 'high';
        } else if (text.includes('THIS WEEK') || text.includes('WEEKLY')) {
          currentPriority = 'medium';
        } else if (text.includes('FUTURE') || text.includes('LATER')) {
          currentPriority = 'low';
        }
      } else if (block.type === 'heading_3' && block.heading_3.rich_text.length > 0) {
        const text = block.heading_3.rich_text.map(t => t.plain_text).join('');
        
        if (text.includes('Email System') || text.includes('Customer Acquisition') || text.includes('User Experience')) {
          currentPriority = 'high';
        } else if (text.includes('Monday') || text.includes('Wednesday') || text.includes('Friday')) {
          currentPriority = 'medium';
        }
      } else if (block.type === 'paragraph' && block.paragraph.rich_text.length > 0) {
        const text = block.paragraph.rich_text.map(t => t.plain_text).join('');
        
        if (text.trim() && !text.includes('=') && !text.includes('Last Updated') && !text.includes('Next Review')) {
          if (currentPriority) {
            priorityTasks[currentPriority].push({
              text: text.trim(),
              priority: currentPriority
            });
          }
        }
      } else if (block.type === 'bulleted_list_item' && block.bulleted_list_item.rich_text.length > 0) {
        const text = block.bulleted_list_item.rich_text.map(t => t.plain_text).join('');
        
        if (text.trim() && !text.includes('=') && !text.includes('Last Updated') && !text.includes('Next Review')) {
          if (currentPriority) {
            priorityTasks[currentPriority].push({
              text: text.trim(),
              priority: currentPriority
            });
          }
        }
      }
    }
    
    // Display the recovered tasks
    console.log('\\n🎯 RECOVERED PRIORITY TASKS:');
    console.log('=============================');
    
    console.log('\\n🔴 HIGH PRIORITY TASKS:');
    priorityTasks.high.forEach((task, index) => {
      console.log(`  ${index + 1}. ${task.text}`);
    });
    
    console.log('\\n🟡 MEDIUM PRIORITY TASKS:');
    priorityTasks.medium.forEach((task, index) => {
      console.log(`  ${index + 1}. ${task.text}`);
    });
    
    console.log('\\n🟢 LOW PRIORITY TASKS:');
    priorityTasks.low.forEach((task, index) => {
      console.log(`  ${index + 1}. ${task.text}`);
    });
    
    // Now let's check if there's a master database
    console.log('\\n🗄️ CHECKING FOR MASTER DATABASE:');
    console.log('==================================');
    
    const searchResults = await notion.search({
      filter: {
        property: 'object',
        value: 'page'
      }
    });
    
    let masterDatabase = null;
    
    for (const page of searchResults.results) {
      try {
        const pageInfo = await notion.pages.retrieve({ page_id: page.id });
        if (pageInfo.object === 'database') {
          // Check if this looks like a master database
          const dbQuery = await notion.databases.query({ database_id: page.id });
          if (dbQuery.results.length === 0) {
            console.log(`Found empty database: ${page.id}`);
            console.log(`URL: https://www.notion.so/${page.id.replace(/-/g, '')}`);
            masterDatabase = page.id;
            break;
          }
        }
      } catch (error) {
        continue;
      }
    }
    
    if (masterDatabase) {
      console.log('\\n✅ Found your master database!');
      console.log('Now let\'s add your priority tasks to it...');
      
      // Add tasks to the master database
      for (const priority of ['high', 'medium', 'low']) {
        for (const task of priorityTasks[priority]) {
          try {
            await notion.pages.create({
              parent: { database_id: masterDatabase },
              properties: {
                Name: {
                  title: [
                    {
                      text: {
                        content: task.text
                      }
                    }
                  ]
                },
                Priority: {
                  select: {
                    name: priority.charAt(0).toUpperCase() + priority.slice(1)
                  }
                },
                Status: {
                  select: {
                    name: 'Not Started'
                  }
                }
              }
            });
            console.log(`✅ Added: ${task.text} (${priority})`);
          } catch (error) {
            console.log(`❌ Failed to add: ${task.text} - ${error.message}`);
          }
        }
      }
      
      console.log('\\n🎉 SUCCESS! Your priority tasks have been added to the master database.');
      console.log('You can now view them at: https://www.notion.so/' + masterDatabase.replace(/-/g, ''));
      
    } else {
      console.log('\\n❌ No empty master database found.');
      console.log('Let me create one for you...');
      
      // Create a master database
      const database = await notion.databases.create({
        parent: { type: 'page_id', page_id: priorityPageId },
        title: [{ type: 'text', text: { content: 'Master Task Database' } }],
        properties: {
          Name: { title: {} },
          Priority: {
            select: {
              options: [
                { name: 'High', color: 'red' },
                { name: 'Medium', color: 'yellow' },
                { name: 'Low', color: 'green' }
              ]
            }
          },
          Status: {
            select: {
              options: [
                { name: 'Not Started', color: 'gray' },
                { name: 'In Progress', color: 'blue' },
                { name: 'Completed', color: 'green' }
              ]
            }
          },
          'Due Date': { date: {} },
          Notes: { rich_text: {} }
        }
      });
      
      console.log('✅ Created master database:', database.id);
      console.log('URL: https://www.notion.so/' + database.id.replace(/-/g, ''));
      
      // Add tasks to the new database
      for (const priority of ['high', 'medium', 'low']) {
        for (const task of priorityTasks[priority]) {
          try {
            await notion.pages.create({
              parent: { database_id: database.id },
              properties: {
                Name: {
                  title: [
                    {
                      text: {
                        content: task.text
                      }
                    }
                  ]
                },
                Priority: {
                  select: {
                    name: priority.charAt(0).toUpperCase() + priority.slice(1)
                  }
                },
                Status: {
                  select: {
                    name: 'Not Started'
                  }
                }
              }
            });
            console.log(`✅ Added: ${task.text} (${priority})`);
          } catch (error) {
            console.log(`❌ Failed to add: ${task.text} - ${error.message}`);
          }
        }
      }
      
      console.log('\\n🎉 SUCCESS! Your priority tasks have been added to the new master database.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

recoverPriorityTasks();
