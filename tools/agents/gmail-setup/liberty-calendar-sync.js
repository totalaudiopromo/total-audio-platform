#!/usr/bin/env node
/**
 * Liberty Calendar Sync - Color-coded calendars matching Gmail/Drive
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class LibertyCalendarSync {
  constructor() {
    // Use existing OAuth credentials
    this.oauth2Client = new google.auth.OAuth2(
      '309298460159-relob8rbr4qpr6bduso8i6pr2egjfm0k.apps.googleusercontent.com',
      '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',
      'http://localhost:3001/callback'
    );

    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    // Load existing tokens
    const tokenPath = path.join(__dirname, '../radio-promo/gmail-token.json');
    if (fs.existsSync(tokenPath)) {
      const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
      this.oauth2Client.setCredentials(tokens);
      console.log('✅ OAuth tokens loaded');
    } else {
      throw new Error('❌ Gmail tokens not found');
    }

    // Calendar colors
    // https://developers.google.com/calendar/api/v3/reference/colors
    this.calendars = [
      {
        summary: 'Liberty - Campaign Deadlines',
        description: 'Radio campaign deadlines and release dates',
        colorId: '11', // Red
      },
      {
        summary: 'Liberty - Station Follow-ups',
        description: 'Station response follow-ups and callbacks',
        colorId: '6', // Orange
      },
      {
        summary: 'Liberty - Action Items',
        description: 'Tasks requiring immediate attention',
        colorId: '9', // Blue
      },
      {
        summary: 'Liberty - Team Meetings',
        description: 'Liberty Music PR team coordination',
        colorId: '3', // Purple
      },
    ];
  }

  /**
   * Find calendar by summary
   */
  async findCalendar(summary) {
    try {
      const response = await this.calendar.calendarList.list();

      const calendar = response.data.items.find(cal => cal.summary === summary);
      return calendar || null;
    } catch (error) {
      console.error(`Failed to find calendar "${summary}":`, error.message);
      return null;
    }
  }

  /**
   * Create calendar
   */
  async createCalendar(summary, description, colorId) {
    try {
      // Create calendar
      const response = await this.calendar.calendars.insert({
        requestBody: {
          summary: summary,
          description: description,
          timeZone: 'Europe/London',
        },
      });

      const calendarId = response.data.id;
      console.log(`✅ Created calendar: ${summary}`);

      // Set color
      await this.calendar.calendarList.update({
        calendarId: calendarId,
        requestBody: {
          colorId: colorId,
        },
      });

      console.log(`  🎨 Color set: ${colorId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to create calendar "${summary}":`, error.message);
      return null;
    }
  }

  /**
   * Update calendar color
   */
  async updateCalendarColor(calendarId, colorId) {
    try {
      await this.calendar.calendarList.update({
        calendarId: calendarId,
        requestBody: {
          colorId: colorId,
        },
      });

      console.log(`✅ Updated calendar color: ${colorId}`);
      return true;
    } catch (error) {
      console.error(`Failed to update calendar color:`, error.message);
      return false;
    }
  }

  /**
   * Setup all calendars
   */
  async setup() {
    console.log('📅 Setting up Liberty Calendar structure...\n');

    try {
      for (const calendarConfig of this.calendars) {
        // Check if calendar exists
        let calendar = await this.findCalendar(calendarConfig.summary);

        if (!calendar) {
          // Create new calendar
          calendar = await this.createCalendar(
            calendarConfig.summary,
            calendarConfig.description,
            calendarConfig.colorId
          );
        } else {
          console.log(`ℹ️  Found existing calendar: ${calendarConfig.summary}`);

          // Update color
          await this.updateCalendarColor(calendar.id, calendarConfig.colorId);
        }

        console.log('');
      }

      console.log('🎉 Calendar structure complete!');
      console.log('\n📅 Calendar system:');
      console.log('  🔴 Campaign Deadlines - Release dates and important milestones');
      console.log('  🟠 Station Follow-ups - Response tracking and callbacks');
      console.log('  🔵 Action Items - Tasks requiring attention');
      console.log('  🟣 Team Meetings - Liberty coordination');
      console.log('\n💡 Colors match your Gmail and Drive systems!');
      console.log('\n📝 Next steps:');
      console.log('  - Calendars will appear in your Google Calendar');
      console.log('  - You can toggle them on/off in the sidebar');
      console.log('  - Future enhancement: Auto-create events from campaign emails');
    } catch (error) {
      console.error('❌ Setup failed:', error);
      throw error;
    }
  }

  /**
   * List current calendars
   */
  async list() {
    console.log('📋 Current Calendar setup:\n');

    try {
      const response = await this.calendar.calendarList.list();

      const libertyCalendars = response.data.items.filter(
        cal => cal.summary && cal.summary.startsWith('Liberty')
      );

      if (libertyCalendars.length === 0) {
        console.log('No Liberty calendars found');
        return;
      }

      libertyCalendars.forEach(cal => {
        console.log(`📅 ${cal.summary}`);
        console.log(`   ID: ${cal.id}`);
        console.log(`   Color: ${cal.colorId || 'default'}`);
        console.log(`   Description: ${cal.description || 'none'}`);
        console.log('');
      });
    } catch (error) {
      console.error('❌ Failed to list calendars:', error);
    }
  }

  /**
   * Test Calendar access
   */
  async test() {
    console.log('🧪 Testing Calendar access...');

    try {
      const response = await this.calendar.calendarList.list();

      console.log('✅ Calendar access OK');
      console.log(`Found ${response.data.items.length} calendars`);
      return true;
    } catch (error) {
      console.error('❌ Calendar access failed:', error.message);
      return false;
    }
  }

  /**
   * Create example events (for testing)
   */
  async createExampleEvents() {
    console.log('📝 Creating example events...\n');

    try {
      // Find the Campaign Deadlines calendar
      const calendar = await this.findCalendar('Liberty - Campaign Deadlines');

      if (!calendar) {
        console.error('❌ Campaign Deadlines calendar not found. Run setup first.');
        return;
      }

      // Create example event
      const event = {
        summary: 'Example: Senior Dunce - Release Date',
        description: 'Radio campaign deadline for Senior Dunce',
        start: {
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        },
        end: {
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
        colorId: '11', // Red
      };

      await this.calendar.events.insert({
        calendarId: calendar.id,
        requestBody: event,
      });

      console.log('✅ Created example event: Senior Dunce - Release Date');
      console.log('💡 Check your Google Calendar to see it!');
    } catch (error) {
      console.error('❌ Failed to create example events:', error);
    }
  }
}

// Command line interface
async function main() {
  const command = process.argv[2];
  const sync = new LibertyCalendarSync();

  try {
    switch (command) {
      case 'setup':
        await sync.setup();
        break;

      case 'list':
        await sync.list();
        break;

      case 'test':
        await sync.test();
        break;

      case 'example':
        await sync.createExampleEvents();
        break;

      default:
        console.log('📅 Liberty Calendar Sync');
        console.log('');
        console.log('Commands:');
        console.log('  setup   - Create calendar structure with colors');
        console.log('  list    - Show current calendar structure');
        console.log('  test    - Test Calendar access');
        console.log('  example - Create example events (for testing)');
        console.log('');
        console.log('Example: node liberty-calendar-sync.js setup');
    }
  } catch (error) {
    console.error('❌ Command failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = LibertyCalendarSync;
