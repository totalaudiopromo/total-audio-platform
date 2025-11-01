const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Simple logger fallback
const logger = {
  info: (msg, ...args) => console.log(`[CALENDAR] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[CALENDAR] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[CALENDAR] ${msg}`, ...args),
  success: (msg, ...args) => console.log(`✅ [CALENDAR] ${msg}`, ...args),
};

/**
 * Google Calendar API Integration for Liberty Music PR
 *
 * Uses Google OAuth2 to access Google Calendar
 * Creates campaign timeline events and milestones
 */
class GoogleCalendarApiIntegration {
  constructor() {
    // Your Liberty Music PR OAuth credentials
    this.oauth2Client = new google.auth.OAuth2(
      '309298460159-relob8rbr4qpr6bduso8i6pr2egjfm0k.apps.googleusercontent.com',
      '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',
      'http://localhost:3001/callback'
    );

    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
    this.rateLimitDelay = 1000; // 1 second between calls
    this.lastApiCall = 0;

    // Check for OAuth tokens
    const tokenPath = path.join(__dirname, '../gmail-token.json'); // Using same token as Gmail
    this.hasValidTokens = fs.existsSync(tokenPath);

    // Initialize authentication
    if (this.hasValidTokens) {
      try {
        const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
        this.oauth2Client.setCredentials(tokens);
        logger.success('OAuth tokens loaded successfully');
      } catch (error) {
        logger.warn('Failed to load OAuth tokens');
        this.hasValidTokens = false;
      }
    } else {
      logger.warn('No OAuth tokens found - Calendar API will be limited');
      logger.info('Run: node radio-promo-agent.js setup-gmail-auth');
    }
  }

  /**
   * Rate-limited API call to Google Calendar
   */
  async callCalendarAPI(method, ...args) {
    if (!this.hasValidTokens) {
      throw new Error('Calendar API requires OAuth tokens. Run setup-gmail-auth first.');
    }

    // Rate limiting
    const now = Date.now();
    const timeSinceLastCall = now - this.lastApiCall;

    if (timeSinceLastCall < this.rateLimitDelay) {
      const delay = this.rateLimitDelay - timeSinceLastCall;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    try {
      this.lastApiCall = Date.now();
      return await method.apply(this.calendar, args);
    } catch (error) {
      console.error('Calendar API call failed:', error);
      throw error;
    }
  }

  /**
   * List available calendars
   */
  async listCalendars() {
    try {
      logger.info('Listing available calendars');

      const response = await this.callCalendarAPI(this.calendar.calendarList.list);

      const calendars = response.data.items || [];
      logger.info(`Found ${calendars.length} calendars`);

      calendars.forEach(calendar => {
        logger.info(`  📅 ${calendar.summary} (${calendar.id})`);
      });

      return calendars;
    } catch (error) {
      logger.error('Failed to list calendars:', error.message);
      throw error;
    }
  }

  /**
   * Get primary calendar ID
   */
  async getPrimaryCalendarId() {
    try {
      const response = await this.callCalendarAPI(this.calendar.calendars.get, {
        calendarId: 'primary',
      });

      return response.data.id;
    } catch (error) {
      logger.error('Failed to get primary calendar:', error.message);
      throw error;
    }
  }

  /**
   * Create a calendar event
   */
  async createEvent(calendarId, eventData) {
    try {
      logger.info(`Creating calendar event: ${eventData.summary}`);

      const event = {
        summary: eventData.summary,
        description: eventData.description || '',
        start: {
          dateTime: eventData.startDateTime,
          timeZone: 'Europe/London',
        },
        end: {
          dateTime: eventData.endDateTime,
          timeZone: 'Europe/London',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 60 }, // 1 hour before
          ],
        },
      };

      const response = await this.callCalendarAPI(this.calendar.events.insert, {
        calendarId: calendarId,
        resource: event,
      });

      logger.success(`Created event: ${response.data.summary} (ID: ${response.data.id})`);
      return response.data;
    } catch (error) {
      logger.error('Failed to create calendar event:', error.message);
      throw error;
    }
  }

  /**
   * Create campaign timeline events
   */
  async createCampaignTimeline(artistName, trackName, campaignData) {
    try {
      logger.info(`Creating campaign timeline for ${artistName} - ${trackName}`);

      const primaryCalendarId = await this.getPrimaryCalendarId();
      const events = [];

      // Campaign start event
      const campaignStartEvent = await this.createEvent(primaryCalendarId, {
        summary: `🎵 Campaign Start: ${artistName} - ${trackName}`,
        description: `Radio promotion campaign begins for ${artistName} - ${trackName}\n\nCampaign Details:\n- Duration: ${campaignData.campaignDuration}\n- Release Date: ${campaignData.releaseDate}\n- Genre: ${campaignData.genre}\n- Budget: ${campaignData.budget}`,
        startDateTime: new Date(campaignData.campaignStartDate).toISOString(),
        endDateTime: new Date(
          new Date(campaignData.campaignStartDate).getTime() + 60 * 60 * 1000
        ).toISOString(), // 1 hour event
      });
      events.push(campaignStartEvent);

      // Mid-campaign check-in
      const midCampaignDate = new Date(campaignData.campaignStartDate);
      midCampaignDate.setDate(
        midCampaignDate.getDate() + Math.floor(campaignData.durationDays / 2)
      );

      const midCampaignEvent = await this.createEvent(primaryCalendarId, {
        summary: `📊 Mid-Campaign Check: ${artistName} - ${trackName}`,
        description: `Mid-campaign progress review for ${artistName} - ${trackName}\n\nTasks:\n- Review radio submissions\n- Check WARM API for plays\n- Follow up with stations\n- Update Monday.com progress`,
        startDateTime: midCampaignDate.toISOString(),
        endDateTime: new Date(midCampaignDate.getTime() + 30 * 60 * 1000).toISOString(), // 30 minute event
      });
      events.push(midCampaignEvent);

      // Release date event
      const releaseEvent = await this.createEvent(primaryCalendarId, {
        summary: `🎉 Release Day: ${artistName} - ${trackName}`,
        description: `Official release day for ${artistName} - ${trackName}\n\nTasks:\n- Final radio push\n- Social media announcement\n- Update all platforms\n- Celebrate! 🎉`,
        startDateTime: new Date(campaignData.releaseDate).toISOString(),
        endDateTime: new Date(
          new Date(campaignData.releaseDate).getTime() + 2 * 60 * 60 * 1000
        ).toISOString(), // 2 hour event
      });
      events.push(releaseEvent);

      logger.success(`Created ${events.length} campaign timeline events`);
      return events;
    } catch (error) {
      logger.error('Failed to create campaign timeline:', error.message);
      throw error;
    }
  }

  /**
   * Create weekly WARM report reminders
   */
  async createWeeklyReportReminders(artistName, trackName, campaignStartDate, campaignDuration) {
    try {
      logger.info(`Creating weekly report reminders for ${artistName} - ${trackName}`);

      const primaryCalendarId = await this.getPrimaryCalendarId();
      const events = [];
      const startDate = new Date(campaignStartDate);
      const durationDays = campaignDuration === '6-week' ? 42 : 28;

      // Create weekly reminders (every Friday)
      for (let week = 1; week <= Math.ceil(durationDays / 7); week++) {
        const reminderDate = new Date(startDate);
        reminderDate.setDate(startDate.getDate() + week * 7 - 3); // Friday of each week

        // Skip if reminder date is after campaign end
        const campaignEndDate = new Date(startDate);
        campaignEndDate.setDate(startDate.getDate() + durationDays);

        if (reminderDate <= campaignEndDate) {
          const reportEvent = await this.createEvent(primaryCalendarId, {
            summary: `📊 Weekly WARM Report: ${artistName} - ${trackName} (Week ${week})`,
            description: `Weekly WARM report generation for ${artistName} - ${trackName}\n\nTasks:\n- Generate WARM API report\n- Update Monday.com with play data\n- Analyze performance metrics\n- Plan next week's outreach`,
            startDateTime: reminderDate.toISOString(),
            endDateTime: new Date(reminderDate.getTime() + 30 * 60 * 1000).toISOString(), // 30 minute event
          });
          events.push(reportEvent);
        }
      }

      logger.success(`Created ${events.length} weekly report reminders`);
      return events;
    } catch (error) {
      logger.error('Failed to create weekly report reminders:', error.message);
      throw error;
    }
  }

  /**
   * List upcoming events
   */
  async listUpcomingEvents(calendarId = 'primary', maxResults = 10) {
    try {
      logger.info(`Listing upcoming events from calendar: ${calendarId}`);

      const response = await this.callCalendarAPI(this.calendar.events.list, {
        calendarId: calendarId,
        timeMin: new Date().toISOString(),
        maxResults: maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];
      logger.info(`Found ${events.length} upcoming events`);

      events.forEach(event => {
        const start = event.start.dateTime || event.start.date;
        logger.info(`  📅 ${event.summary} - ${new Date(start).toLocaleString()}`);
      });

      return events;
    } catch (error) {
      logger.error('Failed to list upcoming events:', error.message);
      throw error;
    }
  }
}

module.exports = GoogleCalendarApiIntegration;
