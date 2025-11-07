#!/usr/bin/env node

/**
 * Google Chat MCP Server
 * Read-only access to Google Chat spaces (Liberty channels for training data)
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { google } = require('googleapis');
const { authenticate } = require('@google-cloud/local-auth');
const path = require('path');
const fs = require('fs').promises;

const SCOPES = [
  'https://www.googleapis.com/auth/chat.spaces.readonly',
  'https://www.googleapis.com/auth/chat.messages.readonly',
];
const TOKEN_PATH = path.join(process.env.HOME, '.google-chat-mcp', 'token.json');
const CREDENTIALS_PATH = path.join(process.env.HOME, '.google-chat-mcp', 'credentials.json');

class GoogleChatMCP {
  constructor() {
    this.server = new Server(
      {
        name: 'google-chat-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.auth = null;
    this.chat = null;

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

  async getChat() {
    if (!this.chat) {
      const auth = await this.authorize();
      this.chat = google.chat({ version: 'v1', auth });
    }
    return this.chat;
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler('tools/list', async () => ({
      tools: [
        {
          name: 'chat_list_spaces',
          description: 'List all Google Chat spaces (channels) user has access to',
          inputSchema: {
            type: 'object',
            properties: {
              pageSize: {
                type: 'number',
                description: 'Maximum number of spaces to return (default: 100)',
              },
            },
          },
        },
        {
          name: 'chat_list_messages',
          description: 'List messages from a specific Google Chat space (read-only for training)',
          inputSchema: {
            type: 'object',
            properties: {
              spaceName: {
                type: 'string',
                description: 'Space name (e.g., spaces/SPACE_ID)',
              },
              pageSize: {
                type: 'number',
                description: 'Maximum number of messages (default: 100)',
              },
              filter: {
                type: 'string',
                description: 'Filter messages (e.g., "createTime > "2025-09-01T00:00:00Z"")',
              },
            },
            required: ['spaceName'],
          },
        },
        {
          name: 'chat_get_space',
          description: 'Get details about a specific Google Chat space',
          inputSchema: {
            type: 'object',
            properties: {
              spaceName: {
                type: 'string',
                description: 'Space name (e.g., spaces/SPACE_ID)',
              },
            },
            required: ['spaceName'],
          },
        },
        {
          name: 'chat_search_messages',
          description: 'Search for messages across spaces (for training data extraction)',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query',
              },
              spaceName: {
                type: 'string',
                description: 'Optional: Limit search to specific space',
              },
              pageSize: {
                type: 'number',
                description: 'Maximum results (default: 50)',
              },
            },
            required: ['query'],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler('tools/call', async request => {
      const { name, arguments: args } = request.params;

      try {
        const chat = await this.getChat();

        switch (name) {
          case 'chat_list_spaces': {
            const response = await chat.spaces.list({
              pageSize: args.pageSize || 100,
            });

            const spaces = response.data.spaces || [];
            const formatted = spaces.map(space => ({
              name: space.name,
              displayName: space.displayName,
              type: space.type,
              spaceType: space.spaceType,
              memberCount: space.memberCount,
            }));

            return {
              content: [
                {
                  type: 'text',
                  text: `Found ${formatted.length} spaces:\n\n${JSON.stringify(
                    formatted,
                    null,
                    2
                  )}`,
                },
              ],
            };
          }

          case 'chat_list_messages': {
            const response = await chat.spaces.messages.list({
              parent: args.spaceName,
              pageSize: args.pageSize || 100,
              filter: args.filter,
              orderBy: 'createTime desc',
            });

            const messages = response.data.messages || [];
            const formatted = messages.map(msg => ({
              name: msg.name,
              text: msg.text,
              sender: msg.sender?.displayName,
              createTime: msg.createTime,
              thread: msg.thread?.name,
            }));

            return {
              content: [
                {
                  type: 'text',
                  text: `Found ${formatted.length} messages:\n\n${JSON.stringify(
                    formatted,
                    null,
                    2
                  )}`,
                },
              ],
            };
          }

          case 'chat_get_space': {
            const response = await chat.spaces.get({
              name: args.spaceName,
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

          case 'chat_search_messages': {
            // Note: Google Chat API doesn't have native search
            // We'll list messages and filter locally
            const spaceName = args.spaceName || 'spaces/*';
            const response = await chat.spaces.messages.list({
              parent: spaceName,
              pageSize: args.pageSize || 50,
              orderBy: 'createTime desc',
            });

            const messages = response.data.messages || [];
            const query = args.query.toLowerCase();
            const filtered = messages.filter(
              msg =>
                msg.text?.toLowerCase().includes(query) ||
                msg.sender?.displayName?.toLowerCase().includes(query)
            );

            const formatted = filtered.map(msg => ({
              name: msg.name,
              text: msg.text,
              sender: msg.sender?.displayName,
              createTime: msg.createTime,
              space: msg.space?.displayName,
            }));

            return {
              content: [
                {
                  type: 'text',
                  text: `Found ${formatted.length} matching messages:\n\n${JSON.stringify(
                    formatted,
                    null,
                    2
                  )}`,
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
              text: `Error: ${error.message}\n\nNote: Google Chat API access requires workspace admin approval. Make sure the OAuth app has Chat API enabled and proper scopes granted.`,
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
    console.error('Google Chat MCP server running on stdio (read-only)');
  }
}

const server = new GoogleChatMCP();
server.run().catch(console.error);
