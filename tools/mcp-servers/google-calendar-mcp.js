#!/usr/bin/env node

/**
 * Google Calendar MCP Server
 * Provides read/write access to Google Calendar for campaign scheduling
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { google } = require('googleapis');
const { authenticate } = require('@google-cloud/local-auth');
const path = require('path');
const fs = require('fs').promises;

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = path.join(process.env.HOME, '.google-calendar-mcp', 'token.json');
const CREDENTIALS_PATH = path.join(process.env.HOME, '.google-calendar-mcp', 'credentials.json');

class GoogleCalendarMCP {
  constructor() {
    this.server = new Server(
      {
        name: 'google-calendar-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.auth = null;
    this.calendar = null;

    this.setupToolHandlers();
  }

  async loadSavedCredentials() {
    try {
      const content = await fs.readFile(TOKEN_PATH);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  async saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.mkdir(path.dirname(TOKEN_PATH), { recursive: true });
    await fs.writeFile(TOKEN_PATH, payload);
  }

  async authorize() {
    if (this.auth) return this.auth;

    let client = await this.loadSavedCredentials();
    if (client) {
      this.auth = client;
      return client;
    }

    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });

    if (client.credentials) {
      await this.saveCredentials(client);
    }

    this.auth = client;
    return client;
  }

  async getCalendar() {
    if (!this.calendar) {
      const auth = await this.authorize();
      this.calendar = google.calendar({ version: 'v3', auth });
    }
    return this.calendar;
  }

  setupToolHandlers() {
    // List upcoming events
    this.server.setRequestHandler('tools/list', async () => ({
      tools: [
        {
          name: 'calendar_list_events',
          description: 'List upcoming calendar events',
          inputSchema: {
            type: 'object',
            properties: {
              maxResults: {
                type: 'number',
                description: 'Maximum number of events to return (default: 10)',
              },
              timeMin: {
                type: 'string',
                description: 'Start time (ISO 8601 format)',
              },
              timeMax: {
                type: 'string',
                description: 'End time (ISO 8601 format)',
              },
            },
          },
        },
        {
          name: 'calendar_create_event',
          description: 'Create a new calendar event (e.g., campaign milestones)',
          inputSchema: {
            type: 'object',
            properties: {
              summary: {
                type: 'string',
                description: 'Event title',
              },
              description: {
                type: 'string',
                description: 'Event description',
              },
              start: {
                type: 'string',
                description: 'Start date/time (ISO 8601)',
              },
              end: {
                type: 'string',
                description: 'End date/time (ISO 8601)',
              },
              attendees: {
                type: 'array',
                description: 'Array of email addresses',
                items: { type: 'string' },
              },
            },
            required: ['summary', 'start', 'end'],
          },
        },
        {
          name: 'calendar_update_event',
          description: 'Update an existing calendar event',
          inputSchema: {
            type: 'object',
            properties: {
              eventId: {
                type: 'string',
                description: 'Event ID to update',
              },
              summary: { type: 'string' },
              description: { type: 'string' },
              start: { type: 'string' },
              end: { type: 'string' },
            },
            required: ['eventId'],
          },
        },
        {
          name: 'calendar_delete_event',
          description: 'Delete a calendar event',
          inputSchema: {
            type: 'object',
            properties: {
              eventId: {
                type: 'string',
                description: 'Event ID to delete',
              },
            },
            required: ['eventId'],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler('tools/call', async request => {
      const { name, arguments: args } = request.params;

      try {
        const calendar = await this.getCalendar();

        switch (name) {
          case 'calendar_list_events': {
            const response = await calendar.events.list({
              calendarId: 'primary',
              timeMin: args.timeMin || new Date().toISOString(),
              timeMax: args.timeMax,
              maxResults: args.maxResults || 10,
              singleEvents: true,
              orderBy: 'startTime',
            });

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(response.data.items, null, 2),
                },
              ],
            };
          }

          case 'calendar_create_event': {
            const event = {
              summary: args.summary,
              description: args.description,
              start: {
                dateTime: args.start,
                timeZone: 'Europe/London',
              },
              end: {
                dateTime: args.end,
                timeZone: 'Europe/London',
              },
              attendees: args.attendees?.map(email => ({ email })),
              reminders: {
                useDefault: false,
                overrides: [
                  { method: 'email', minutes: 24 * 60 }, // 1 day before
                  { method: 'popup', minutes: 10 },
                ],
              },
            };

            const response = await calendar.events.insert({
              calendarId: 'primary',
              resource: event,
            });

            return {
              content: [
                {
                  type: 'text',
                  text: `Event created: ${response.data.htmlLink}`,
                },
              ],
            };
          }

          case 'calendar_update_event': {
            const event = await calendar.events.get({
              calendarId: 'primary',
              eventId: args.eventId,
            });

            const updatedEvent = {
              ...event.data,
              summary: args.summary || event.data.summary,
              description: args.description || event.data.description,
              start: args.start
                ? { dateTime: args.start, timeZone: 'Europe/London' }
                : event.data.start,
              end: args.end ? { dateTime: args.end, timeZone: 'Europe/London' } : event.data.end,
            };

            const response = await calendar.events.update({
              calendarId: 'primary',
              eventId: args.eventId,
              resource: updatedEvent,
            });

            return {
              content: [
                {
                  type: 'text',
                  text: `Event updated: ${response.data.htmlLink}`,
                },
              ],
            };
          }

          case 'calendar_delete_event': {
            await calendar.events.delete({
              calendarId: 'primary',
              eventId: args.eventId,
            });

            return {
              content: [
                {
                  type: 'text',
                  text: `Event deleted: ${args.eventId}`,
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Google Calendar MCP server running on stdio');
  }
}

const server = new GoogleCalendarMCP();
server.run().catch(console.error);
