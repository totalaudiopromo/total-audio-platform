#!/usr/bin/env node

/**
 * Set and Forget Scheduler
 * Automatically posts to all platforms on your schedule
 */

const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');
const UnifiedSocialPoster = require('./unified-poster');

class AutoScheduler {
  constructor() {
    this.poster = new UnifiedSocialPoster();
    this.schedulePath = path.join(__dirname, 'scheduled-posts.json');
    this.contentQueuePath = path.join(__dirname, 'content-queue.json');
    this.tasks = [];
  }

  /**
   * Start the scheduler - runs in background
   */
  async start() {
    console.log('Starting Auto-Scheduler...\n');

    // Check for scheduled posts every 5 minutes
    const checkSchedule = cron.schedule('*/5 * * * *', async () => {
      await this.processScheduledPosts();
    });

    // Process content queue every hour
    const processQueue = cron.schedule('0 * * * *', async () => {
      await this.processContentQueue();
    });

    this.tasks.push(checkSchedule, processQueue);

    console.log('Scheduler is running!');
    console.log('- Checking scheduled posts every 5 minutes');
    console.log('- Processing content queue every hour\n');
    console.log('Press Ctrl+C to stop\n');

    // Keep process alive
    process.on('SIGINT', () => {
      console.log('\nStopping scheduler...');
      this.stop();
      process.exit(0);
    });
  }

  /**
   * Process scheduled posts that are due
   */
  async processScheduledPosts() {
    try {
      const data = await fs.readFile(this.schedulePath, 'utf8');
      const schedules = JSON.parse(data);
      const now = new Date();
      let updated = false;

      for (const schedule of schedules) {
        if (schedule.status === 'pending') {
          const scheduledTime = new Date(schedule.scheduledTime);

          if (scheduledTime <= now) {
            console.log(`Posting scheduled content...`);
            try {
              await this.poster.postToAll(schedule.content, schedule.options);
              schedule.status = 'posted';
              schedule.postedAt = now.toISOString();
              console.log('Scheduled post completed!');
            } catch (error) {
              console.error('Scheduled post failed:', error.message);
              schedule.status = 'failed';
              schedule.error = error.message;
            }
            updated = true;
          }
        }
      }

      if (updated) {
        await fs.writeFile(this.schedulePath, JSON.stringify(schedules, null, 2));
      }
    } catch (error) {
      // No schedules file yet
    }
  }

  /**
   * Process content queue (for automation)
   */
  async processContentQueue() {
    try {
      const data = await fs.readFile(this.contentQueuePath, 'utf8');
      const queue = JSON.parse(data);

      if (queue.length > 0) {
        const nextPost = queue.shift();
        console.log(`Posting from queue...`);

        await this.poster.postToAll(nextPost.content, nextPost.options);

        // Save updated queue
        await fs.writeFile(this.contentQueuePath, JSON.stringify(queue, null, 2));
        console.log('Queue post completed!');
      }
    } catch (error) {
      // No queue file yet
    }
  }

  /**
   * Add content to queue
   */
  async addToQueue(content, options = {}) {
    let queue = [];

    try {
      const data = await fs.readFile(this.contentQueuePath, 'utf8');
      queue = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet
    }

    queue.push({ content, options, addedAt: new Date().toISOString() });
    await fs.writeFile(this.contentQueuePath, JSON.stringify(queue, null, 2));

    console.log(`Added to queue. Position: ${queue.length}`);
  }

  /**
   * Stop the scheduler
   */
  stop() {
    this.tasks.forEach(task => task.stop());
    console.log('Scheduler stopped');
  }
}

// CLI
if (require.main === module) {
  const scheduler = new AutoScheduler();
  const command = process.argv[2];
  const content = process.argv[3];

  (async () => {
    switch (command) {
      case 'start':
        await scheduler.start();
        break;

      case 'queue':
        if (!content) {
          console.log('Usage: node scheduler.js queue "Your content"');
          process.exit(1);
        }
        await scheduler.addToQueue(content);
        break;

      default:
        console.log(`
Auto-Scheduler

Commands:
  start           Start scheduler (set and forget)
  queue "text"    Add content to auto-post queue

Examples:
  node scheduler.js start
  node scheduler.js queue "Post this later"
        `);
    }
  })().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}

module.exports = AutoScheduler;
