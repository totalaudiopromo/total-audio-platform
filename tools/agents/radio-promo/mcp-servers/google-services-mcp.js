#!/usr/bin/env node

/**
 * Google Services MCP Server for Liberty Music PR
 *
 * Provides Gmail, Google Drive, and Google Calendar integration
 * through Model Context Protocol for the Radio Promo Agent
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// MCP Protocol Implementation
class GoogleServicesMCPServer {
  constructor() {
    this.credentialsPath = path.join(__dirname, '../../gmail-credentials.json');
    this.tokenPath = path.join(__dirname, '../../gmail-token.json');
    this.oAuth2Client = null;
    this.gmail = null;
    this.drive = null;
    this.calendar = null;
    this.chat = null;

    // Load credentials and tokens
    this.loadCredentials();
  }

  loadCredentials() {
    try {
      if (fs.existsSync(this.credentialsPath)) {
        const credentials = JSON.parse(fs.readFileSync(this.credentialsPath, 'utf8'));
        const { client_id, client_secret } = credentials.installed;
        this.oAuth2Client = new google.auth.OAuth2(
          client_id,
          client_secret,
          'urn:ietf:wg:oauth:2.0:oob'
        );
      }

      if (fs.existsSync(this.tokenPath)) {
        const tokens = JSON.parse(fs.readFileSync(this.tokenPath, 'utf8'));
        this.oAuth2Client.setCredentials(tokens);
        this.initializeServices();
      }
    } catch (error) {
      console.error('Failed to load Google credentials:', error.message);
    }
  }

  initializeServices() {
    if (this.oAuth2Client) {
      this.gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });
      this.drive = google.drive({ version: 'v3', auth: this.oAuth2Client });
      this.calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
      this.chat = google.chat({ version: 'v1', auth: this.oAuth2Client });
    }
  }

  // MCP Protocol Methods
  async handleRequest(request) {
    try {
      switch (request.method) {
        case 'tools/list':
          return this.listTools();

        case 'tools/call':
          return await this.callTool(request.params);

        case 'resources/list':
          return this.listResources();

        case 'resources/read':
          return await this.readResource(request.params);

        default:
          throw new Error(`Unknown method: ${request.method}`);
      }
    } catch (error) {
      return {
        error: {
          code: -32603,
          message: error.message,
        },
      };
    }
  }

  // Direct method calls for testing
  async listTools() {
    return {
      tools: [
        {
          name: 'gmail_search_emails',
          description: 'Search Gmail for campaign-related emails',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description:
                  'Gmail search query (e.g., "from:artist@example.com subject:campaign")',
              },
              maxResults: {
                type: 'number',
                description: 'Maximum number of results to return',
                default: 10,
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'gmail_get_message',
          description: 'Get full content of a specific Gmail message',
          inputSchema: {
            type: 'object',
            properties: {
              messageId: {
                type: 'string',
                description: 'Gmail message ID',
              },
            },
            required: ['messageId'],
          },
        },
        {
          name: 'gmail_extract_artist_info',
          description: 'Extract artist information from Gmail campaign threads',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query for campaign emails',
                default: 'to:chrisschofield@libertymusicpr.com subject:campaign',
              },
            },
          },
        },
        {
          name: 'drive_search_files',
          description: 'Search Google Drive for files',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query for files',
              },
              maxResults: {
                type: 'number',
                description: 'Maximum number of results',
                default: 10,
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'calendar_list_events',
          description: 'List Google Calendar events',
          inputSchema: {
            type: 'object',
            properties: {
              timeMin: {
                type: 'string',
                description: 'Start time for events (ISO 8601)',
              },
              timeMax: {
                type: 'string',
                description: 'End time for events (ISO 8601)',
              },
              maxResults: {
                type: 'number',
                description: 'Maximum number of events',
                default: 10,
              },
            },
          },
        },
        {
          name: 'calendar_create_event',
          description: 'Create a new calendar event',
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
                type: 'object',
                properties: {
                  dateTime: {
                    type: 'string',
                    description: 'Start time (ISO 8601)',
                  },
                  timeZone: {
                    type: 'string',
                    description: 'Time zone',
                    default: 'Europe/London',
                  },
                },
                required: ['dateTime'],
              },
              end: {
                type: 'object',
                properties: {
                  dateTime: {
                    type: 'string',
                    description: 'End time (ISO 8601)',
                  },
                  timeZone: {
                    type: 'string',
                    description: 'Time zone',
                    default: 'Europe/London',
                  },
                },
                required: ['dateTime'],
              },
            },
            required: ['summary', 'start', 'end'],
          },
        },
        {
          name: 'chat_read_messages',
          description:
            'Read messages from Google Chat spaces (READ-ONLY for intelligence gathering)',
          inputSchema: {
            type: 'object',
            properties: {
              spaceName: {
                type: 'string',
                description: 'Name of the chat space to read from',
                enum: ['Success Shout Outs', 'Radio Superstars', 'Campaigns'],
              },
              maxResults: {
                type: 'number',
                description: 'Maximum number of messages to retrieve',
                default: 50,
              },
            },
            required: ['spaceName'],
          },
        },
        {
          name: 'chat_gather_intelligence',
          description: 'Gather campaign intelligence from all Liberty chat spaces',
          inputSchema: {
            type: 'object',
            properties: {
              days: {
                type: 'number',
                description: 'Number of days to look back for intelligence',
                default: 7,
              },
            },
          },
        },
      ],
    };
  }

  async callTool(params) {
    const { name, arguments: args } = params;

    switch (name) {
      case 'gmail_search_emails':
        return await this.searchGmailEmails(args);

      case 'gmail_get_message':
        return await this.getGmailMessage(args);

      case 'gmail_extract_artist_info':
        return await this.extractArtistInfo(args);

      case 'drive_search_files':
        return await this.searchDriveFiles(args);

      case 'calendar_list_events':
        return await this.listCalendarEvents(args);

      case 'calendar_create_event':
        return await this.createCalendarEvent(args);

      case 'chat_read_messages':
        return await this.readChatMessages(args);

      case 'chat_gather_intelligence':
        return await this.gatherChatIntelligence(args);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  listResources() {
    return {
      resources: [
        {
          uri: 'gmail://profile',
          name: 'Gmail Profile',
          description: 'Gmail user profile information',
        },
        {
          uri: 'drive://files',
          name: 'Google Drive Files',
          description: 'List of files in Google Drive',
        },
        {
          uri: 'calendar://events',
          name: 'Calendar Events',
          description: 'List of calendar events',
        },
      ],
    };
  }

  async readResource(params) {
    const { uri } = params;

    switch (uri) {
      case 'gmail://profile':
        return await this.getGmailProfile();

      case 'drive://files':
        return await this.getDriveFiles();

      case 'calendar://events':
        return await this.getCalendarEvents();

      default:
        throw new Error(`Unknown resource: ${uri}`);
    }
  }

  // Gmail Methods
  async searchGmailEmails(args) {
    if (!this.gmail) throw new Error('Gmail not initialized');

    const { query, maxResults = 10 } = args;
    const response = await this.gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults,
    });

    const messages = response.data.messages || [];
    const detailedMessages = [];

    for (const message of messages) {
      const details = await this.gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'metadata',
        metadataHeaders: ['From', 'To', 'Subject', 'Date'],
      });

      detailedMessages.push({
        id: message.id,
        threadId: message.threadId,
        headers: details.data.payload.headers.reduce((acc, header) => {
          acc[header.name.toLowerCase()] = header.value;
          return acc;
        }, {}),
      });
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(detailedMessages, null, 2),
        },
      ],
    };
  }

  async getGmailMessage(args) {
    if (!this.gmail) throw new Error('Gmail not initialized');

    const { messageId } = args;
    const response = await this.gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full',
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  async extractArtistInfo(args) {
    if (!this.gmail) throw new Error('Gmail not initialized');

    const { query = 'to:chrisschofield@libertymusicpr.com subject:campaign' } = args;
    const emails = await this.searchGmailEmails({ query, maxResults: 20 });

    const artistInfo = [];
    const emailData = JSON.parse(emails.content[0].text);

    for (const email of emailData) {
      const artistEmail = email.headers.from;
      const subject = email.headers.subject;
      const date = email.headers.date;

      // Extract artist name from email or subject
      const artistName = this.extractArtistNameFromEmail(artistEmail, subject);

      artistInfo.push({
        artistName,
        artistEmail,
        subject,
        date,
        messageId: email.id,
        threadId: email.threadId,
      });
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(artistInfo, null, 2),
        },
      ],
    };
  }

  extractArtistNameFromEmail(email, subject) {
    // Extract name from email address
    const emailName = email.split('@')[0].replace(/[._-]/g, ' ');

    // Try to extract from subject
    const subjectMatch = subject.match(/(?:artist|band|musician):\s*([^,]+)/i);
    if (subjectMatch) {
      return subjectMatch[1].trim();
    }

    return emailName;
  }

  async getGmailProfile() {
    if (!this.gmail) throw new Error('Gmail not initialized');

    const profile = await this.gmail.users.getProfile({ userId: 'me' });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(profile.data, null, 2),
        },
      ],
    };
  }

  // Google Drive Methods
  async searchDriveFiles(args) {
    if (!this.drive) throw new Error('Google Drive not initialized');

    const { query, maxResults = 10 } = args;
    const response = await this.drive.files.list({
      q: query,
      pageSize: maxResults,
      fields: 'files(id,name,mimeType,createdTime,modifiedTime,webViewLink)',
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data.files, null, 2),
        },
      ],
    };
  }

  async getDriveFiles() {
    if (!this.drive) throw new Error('Google Drive not initialized');

    const response = await this.drive.files.list({
      pageSize: 20,
      fields: 'files(id,name,mimeType,createdTime,modifiedTime,webViewLink)',
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data.files, null, 2),
        },
      ],
    };
  }

  // Google Calendar Methods
  async listCalendarEvents(args) {
    if (!this.calendar) throw new Error('Google Calendar not initialized');

    const { timeMin, timeMax, maxResults = 10 } = args;
    const response = await this.calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin || new Date().toISOString(),
      timeMax: timeMax,
      maxResults,
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

  async createCalendarEvent(args) {
    if (!this.calendar) throw new Error('Google Calendar not initialized');

    const { summary, description, start, end } = args;
    const event = {
      summary,
      description,
      start,
      end,
    };

    const response = await this.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  async getCalendarEvents() {
    if (!this.calendar) throw new Error('Google Calendar not initialized');

    const response = await this.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 20,
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

  // Google Chat Methods
  async readChatMessages(args) {
    try {
      if (!this.chat) {
        throw new Error('Google Chat not initialized. Please complete OAuth setup.');
      }

      const { spaceName, maxResults = 50 } = args;

      // Map space names to space IDs (these would be the actual space IDs from your Google Workspace)
      const spaceMap = {
        'Success Shout Outs': 'AAAAu3XTTik',
        'Radio Superstars': 'AAAACVjpDTI',
        Campaigns: 'AAAANDK-SNA',
      };

      const spaceId = spaceMap[spaceName];
      if (!spaceId) {
        throw new Error(`Unknown space: ${spaceName}`);
      }

      // List messages from the space
      const response = await this.chat.spaces.messages.list({
        parent: `spaces/${spaceId}`,
        pageSize: maxResults,
      });

      const messages = response.data.messages || [];

      return {
        success: true,
        spaceName,
        messageCount: messages.length,
        messages: messages.map(msg => ({
          id: msg.name,
          text: msg.text,
          createTime: msg.createTime,
          sender: msg.sender?.displayName || 'Unknown',
          thread: msg.thread?.name || null,
        })),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        suggestion: 'Check OAuth setup and space permissions',
      };
    }
  }

  async gatherChatIntelligence(args) {
    try {
      const { days = 7 } = args;
      const spaces = ['Success Shout Outs', 'Radio Superstars', 'Campaigns'];
      const intelligence = {
        campaignWins: [],
        industryContacts: [],
        successPatterns: [],
        summary: {
          totalMessages: 0,
          spacesAnalyzed: spaces.length,
          timeRange: `${days} days`,
        },
      };

      for (const spaceName of spaces) {
        const result = await this.readChatMessages({ spaceName, maxResults: 100 });
        if (result.success) {
          intelligence.summary.totalMessages += result.messageCount;

          // Analyze messages for intelligence
          for (const message of result.messages) {
            const text = message.text?.toLowerCase() || '';

            // Look for campaign wins
            if (text.includes('confirmed') || text.includes('added') || text.includes('play')) {
              intelligence.campaignWins.push({
                space: spaceName,
                message: message.text,
                timestamp: message.createTime,
                sender: message.sender,
              });
            }

            // Look for industry contacts
            if (text.includes('dj') || text.includes('radio') || text.includes('station')) {
              intelligence.industryContacts.push({
                space: spaceName,
                message: message.text,
                timestamp: message.createTime,
                sender: message.sender,
              });
            }
          }
        }
      }

      return {
        success: true,
        intelligence,
        recommendation:
          'Use this intelligence to improve campaign targeting and relationship building',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        suggestion: 'Check OAuth setup and space permissions',
      };
    }
  }
}

// MCP Server Implementation
class MCPServer {
  constructor() {
    this.googleServices = new GoogleServicesMCPServer();
    this.setupStdio();
  }

  setupStdio() {
    let buffer = '';

    process.stdin.on('data', chunk => {
      buffer += chunk.toString();
      this.processBuffer();
    });

    process.stdin.on('end', () => {
      process.exit(0);
    });
  }

  processBuffer() {
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim()) {
        try {
          const request = JSON.parse(line);
          this.handleRequest(request);
        } catch (error) {
          console.error('Failed to parse request:', error.message);
        }
      }
    }
  }

  async handleRequest(request) {
    try {
      const response = await this.googleServices.handleRequest(request);
      this.sendResponse(response);
    } catch (error) {
      this.sendResponse({
        error: {
          code: -32603,
          message: error.message,
        },
      });
    }
  }

  sendResponse(response) {
    console.log(JSON.stringify(response));
  }
}

// Start the MCP server
if (require.main === module) {
  new MCPServer();
}

module.exports = { GoogleServicesMCPServer, MCPServer };
