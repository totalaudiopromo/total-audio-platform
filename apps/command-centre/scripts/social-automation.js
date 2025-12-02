#!/usr/bin/env node

/**
 * Social Media Automation Script for Audio Intel
 *
 * This script automatically posts Audio Intel content to social media platforms
 * using the templates and scheduling system.
 *
 * Usage:
 * node scripts/social-automation.js
 *
 * Or add to cron job for daily automation:
 * 0 9 * * * cd /path/to/command-centre && node scripts/social-automation.js
 */

const COMMAND_CENTRE_URL = 'http://localhost:3000'; // Adjust for your setup

// Daily posting schedule (UK times)
const POSTING_SCHEDULE = [
  { time: '09:00', platforms: ['twitter', 'linkedin'], category: 'announcement' },
  { time: '13:00', platforms: ['linkedin', 'bluesky'], category: 'feature' },
  { time: '17:00', platforms: ['twitter', 'bluesky'], category: 'beta-update' },
];

// Track which templates we've used recently to avoid repeats
const usedTemplates = new Set();

async function fetchTemplates(category = null) {
  try {
    const url = `${COMMAND_CENTRE_URL}/api/social-media/templates${
      category ? `?category=${category}` : ''
    }`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.success) {
      throw new Error('Failed to fetch templates');
    }

    return data.templates;
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
}

async function schedulePost(template, platforms, scheduledTime) {
  try {
    const response = await fetch(`${COMMAND_CENTRE_URL}/api/social-media/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platforms,
        content: template.content,
        hashtags: template.hashtags.join(' '),
        scheduledTime,
        templateId: template.id,
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log(
        `✅ Scheduled "${template.name}" for ${scheduledTime} on ${platforms.join(', ')}`
      );
      usedTemplates.add(template.id);
    } else {
      console.error(`❌ Failed to schedule "${template.name}":`, result.error);
    }

    return result;
  } catch (error) {
    console.error('Error scheduling post:', error);
    return { success: false, error: error.message };
  }
}

function getRandomTemplate(templates) {
  // Filter out recently used templates
  const availableTemplates = templates.filter(t => !usedTemplates.has(t.id));

  // If all templates have been used, reset the used set
  if (availableTemplates.length === 0) {
    usedTemplates.clear();
    return templates[Math.floor(Math.random() * templates.length)];
  }

  return availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
}

function getNextPostingTime(timeString) {
  const now = new Date();
  const [hours, minutes] = timeString.split(':').map(Number);

  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);

  // If the time has passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  return scheduledTime.toISOString();
}

async function runDailyAutomation() {
  console.log('🚀 Starting Audio Intel social media automation...');

  for (const schedule of POSTING_SCHEDULE) {
    console.log(`\n📅 Processing ${schedule.time} ${schedule.category} posts...`);

    // Fetch templates for this category
    const templates = await fetchTemplates(schedule.category);

    if (templates.length === 0) {
      console.log(`⚠️  No templates found for category: ${schedule.category}`);
      continue;
    }

    // Select a random template we haven't used recently
    const selectedTemplate = getRandomTemplate(templates);

    // Calculate posting time
    const scheduledTime = getNextPostingTime(schedule.time);

    // Schedule the post
    await schedulePost(selectedTemplate, schedule.platforms, scheduledTime);

    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n✨ Daily automation complete!');
  console.log(`📊 Templates used: ${usedTemplates.size}`);
}

async function postImmediately(category = null, platforms = ['twitter', 'linkedin']) {
  console.log('⚡ Posting immediately...');

  const templates = await fetchTemplates(category);
  if (templates.length === 0) {
    console.log('❌ No templates available');
    return;
  }

  const template = getRandomTemplate(templates);

  // Post now (no scheduled time)
  await schedulePost(template, platforms, null);
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'daily':
    runDailyAutomation();
    break;
  case 'now':
    const category = process.argv[3] || null;
    const platforms = process.argv[4] ? process.argv[4].split(',') : ['twitter', 'linkedin'];
    postImmediately(category, platforms);
    break;
  case 'test':
    console.log('🧪 Testing template fetch...');
    fetchTemplates().then(templates => {
      console.log(`Found ${templates.length} templates`);
      templates.forEach(t => console.log(`- ${t.name} (${t.category})`));
    });
    break;
  default:
    console.log(`
Audio Intel Social Media Automation

Usage:
  node scripts/social-automation.js daily    # Schedule daily posts
  node scripts/social-automation.js now      # Post immediately
  node scripts/social-automation.js test     # Test template fetching

Examples:
  node scripts/social-automation.js now announcement twitter,linkedin
  node scripts/social-automation.js now feature bluesky
    `);
}
