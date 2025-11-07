const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

require('dotenv').config({ path: path.join(process.cwd(), '.env') });

let discord;
try {
  discord = require('discord.js');
} catch (error) {
  console.error('❌ Missing dependency: discord.js');
  console.error(
    '➡️  Install it with `npm install discord.js @anthropic-ai/sdk` (run at the repo root).'
  );
  process.exit(1);
}

const { Client, GatewayIntentBits, ActivityType, REST, Routes, SlashCommandBuilder } = discord;

// Import Liberty integrations
const GmailAPI = require('../integrations/gmail-api.js');
const MondayAPI = require('../integrations/monday-api.js');
const WarmAPI = require('../integrations/warm-api.js');
const MailchimpAPI = require('../integrations/mailchimp-api.js');
const RadioPortalAutomation = require('../integrations/radio-portal-automation.js');

function resolveEnv(primaryKey, fallbackKey) {
  const candidates = [primaryKey, fallbackKey].filter(Boolean);
  for (const key of candidates) {
    const value = key ? process.env[key] : undefined;
    if (!value) continue;
    if (value.startsWith('${') && value.endsWith('}')) {
      continue;
    }
    return value;
  }
  return null;
}

const token = resolveEnv('DISCORD_BOT_TOKEN', 'TAP_DISCORD_BOT_TOKEN');
const appId = resolveEnv('DISCORD_APP_ID', 'TAP_DISCORD_APPLICATION_ID');
const guildId = resolveEnv('DISCORD_GUILD_ID', 'TAP_DISCORD_GUILD_ID');
const anthropicKey = process.env.ANTHROPIC_API_KEY;
const euroIndieWebhook = process.env.EURO_INDIE_WEBHOOK_URL;

if (!token || !appId || !guildId) {
  console.error('❌ Missing required Discord env vars.');
  console.error('Ensure DISCORD_BOT_TOKEN, DISCORD_APP_ID, DISCORD_GUILD_ID are set.');
  process.exit(1);
}

if (!anthropicKey) {
  console.error('❌ Missing ANTHROPIC_API_KEY');
  process.exit(1);
}

const statusFilePath = path.join(__dirname, '..', 'status', 'current-status.json');

// Monday.com board ID restriction (Chris Schofield's board only)
const ALLOWED_MONDAY_BOARD_ID = '2443582331';

// Initialize integrations
const gmail = new GmailAPI();
const monday = new MondayAPI({ restrictBoardId: ALLOWED_MONDAY_BOARD_ID });
const warm = new WarmAPI();
const mailchimp = new MailchimpAPI();
const radioPortal = new RadioPortalAutomation();
const anthropic = new Anthropic({ apiKey: anthropicKey });

// Track active conversation threads
const activeThreads = new Set();

// Euro Indie Music contact details
const EURO_INDIE_CONTACT = {
  email: 'euroindiemusic@gmail.com',
  name: 'Alessandro',
  packagePrice: 10,
  packageName: 'Formula Indie Promotion (1 Slot)',
  purchaseUrl: 'https://euroindiemusic.bigcartel.com/product/formula-indie-promotion-1-slot',
  submissionInstructions:
    'Email Alessandro with MP3 attached (filename: ArtistName-TrackName.mp3) with friendly message: "Hi Alessandro, here\'s a new track for rotation on Euro Indie Music Network. Looking forward to hearing it on air!"',
};

// System prompt for the Liberty Radio AI Agent
const SYSTEM_PROMPT = `You are the Liberty Music PR AI Agent, a helpful assistant for Liberty Music PR's radio promotion campaigns.

**Your Role:**
- You help manage radio promotion campaigns for UK artists
- You have access to Gmail (Liberty email), Monday.com (campaign tracking - Chris Schofield board ONLY), WARM API (radio play data), Mailchimp (email campaigns), and Radio Portal submissions
- You can search emails, check campaign status, get radio play data, draft press releases, submit to Amazing Radio/Wigwam, and request Euro Indie Music package purchases
- You're conversational, professional, and helpful

**Available Tools:**
1. **search_gmail** - Search Liberty's Gmail for campaign emails, artist communications, etc.
2. **get_campaign_status** - Check status of campaigns in Monday.com (Chris Schofield board only)
3. **get_radio_plays** - Get radio play data from WARM API for an artist
4. **list_campaigns** - List active campaigns from Monday.com (Chris Schofield board only)
5. **list_mailchimp_campaigns** - List Mailchimp email campaigns
6. **get_mailchimp_campaign** - Get details and content of a specific Mailchimp campaign
7. **draft_press_release** - Draft a press release based on campaign information
8. **submit_amazing_radio** - Submit track to Amazing Radio portal (automated browser submission)
9. **submit_wigwam** - Submit track to Radio Wigwam portal (automated browser submission)
10. **request_euro_indie_package** - Request authorization to purchase €10 Euro Indie Music package

**Security Notes:**
- Monday.com access is restricted to Chris Schofield's board (ID: 2443582331) only
- Euro Indie Music purchases require Chris's approval via webhook
- Amazing Radio and Wigwam submissions use automated browser auth

**Your Communication Style:**
- British casual-professional tone
- Friendly and helpful but knowledgeable
- Use real data from the tools when answering questions
- If you don't have access to something, say so clearly
- For Euro Indie purchases, explain that you're sending an approval request to Chris

**Liberty Context:**
- Liberty Music PR is a UK radio promotion agency
- They work with independent artists and labels
- They track campaigns in Monday.com (Chris's board only)
- They use WARM API to track radio plays across UK stations
- Email: chrisschofield@libertymusicpr.com`;

const tools = [
  {
    name: 'search_gmail',
    description:
      'Search Liberty Music PR Gmail for campaign emails, artist communications, or any email content. Returns email subjects, snippets, and sender information.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'Gmail search query (e.g., "from:artist@example.com", "subject:campaign", "label:active-campaigns")',
        },
        max_results: {
          type: 'number',
          description: 'Maximum number of emails to return (default 10)',
          default: 10,
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_campaign_status',
    description:
      'Get current status of radio promotion campaigns from Monday.com board (Chris Schofield board only - ID: 2443582331)',
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_radio_plays',
    description: 'Get radio play data for an artist from WARM API (UK radio tracking)',
    input_schema: {
      type: 'object',
      properties: {
        artist_name: {
          type: 'string',
          description: 'Name of the artist to search for',
        },
        from_date: {
          type: 'string',
          description: 'Start date in YYYY-MM-DD format (optional, defaults to 6 weeks ago)',
        },
      },
      required: ['artist_name'],
    },
  },
  {
    name: 'list_campaigns',
    description: 'List all active campaigns from Monday.com (Chris Schofield board only)',
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'list_mailchimp_campaigns',
    description: 'List Mailchimp email campaigns',
    input_schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          description: 'Number of campaigns to return (default 10)',
          default: 10,
        },
      },
      required: [],
    },
  },
  {
    name: 'get_mailchimp_campaign',
    description: 'Get details and content of a specific Mailchimp campaign by name or ID',
    input_schema: {
      type: 'object',
      properties: {
        campaign_name: {
          type: 'string',
          description: 'Name or partial name of the campaign to find',
        },
      },
      required: ['campaign_name'],
    },
  },
  {
    name: 'draft_press_release',
    description: 'Draft a press release based on Liberty campaign information',
    input_schema: {
      type: 'object',
      properties: {
        artist_name: {
          type: 'string',
          description: 'Artist name',
        },
        track_title: {
          type: 'string',
          description: 'Track title',
        },
        genre: {
          type: 'string',
          description: 'Music genre',
        },
        context: {
          type: 'string',
          description: 'Additional context about the artist/track',
        },
      },
      required: ['artist_name', 'track_title'],
    },
  },
  {
    name: 'submit_amazing_radio',
    description:
      'Submit a track to Amazing Radio portal using automated browser submission. Requires campaign data including artist name, track title, release date, bio, and audio file URL.',
    input_schema: {
      type: 'object',
      properties: {
        artist_name: {
          type: 'string',
          description: 'Artist name',
        },
        track_title: {
          type: 'string',
          description: 'Track title',
        },
        release_date: {
          type: 'string',
          description: 'Release date (YYYY-MM-DD format)',
        },
        genre: {
          type: 'string',
          description: 'Music genre',
        },
        bio: {
          type: 'string',
          description: 'Artist bio/press release',
        },
        audio_url: {
          type: 'string',
          description: 'URL to audio file (mp3)',
        },
      },
      required: ['artist_name', 'track_title'],
    },
  },
  {
    name: 'submit_wigwam',
    description:
      'Submit a track to Radio Wigwam portal using automated browser submission. Requires campaign data including artist name, track title, bio, and audio file URL.',
    input_schema: {
      type: 'object',
      properties: {
        artist_name: {
          type: 'string',
          description: 'Artist name',
        },
        track_title: {
          type: 'string',
          description: 'Track title',
        },
        genre: {
          type: 'string',
          description: 'Music genre',
        },
        bio: {
          type: 'string',
          description: 'Artist bio/press release',
        },
        audio_url: {
          type: 'string',
          description: 'URL to audio file (mp3)',
        },
      },
      required: ['artist_name', 'track_title'],
    },
  },
  {
    name: 'request_euro_indie_package',
    description:
      'Request authorization from Chris to purchase the £10 Euro Indie Music one-song package. Sends an approval webhook and notifies Chris via email.',
    input_schema: {
      type: 'object',
      properties: {
        artist_name: {
          type: 'string',
          description: 'Artist name',
        },
        track_title: {
          type: 'string',
          description: 'Track title',
        },
        reason: {
          type: 'string',
          description: 'Why this package is needed for the campaign',
        },
      },
      required: ['artist_name', 'track_title', 'reason'],
    },
  },
];

async function executeTool(toolName, toolInput) {
  try {
    switch (toolName) {
      case 'search_gmail': {
        const emails = await gmail.searchEmails(toolInput.query, toolInput.max_results || 10);
        return {
          success: true,
          results: emails.map(e => ({
            subject: e.subject,
            from: e.from,
            date: e.date,
            snippet: e.snippet,
          })),
        };
      }

      case 'get_campaign_status': {
        const campaigns = await monday.getCampaignItems();
        return {
          success: true,
          board_restriction: `Restricted to Chris Schofield board (${ALLOWED_MONDAY_BOARD_ID})`,
          campaigns: campaigns.map(c => ({
            id: c.id,
            name: c.name,
            group: c.groupTitle,
            status: c.column_values.find(col => col.id === 'status')?.text || 'unknown',
          })),
        };
      }

      case 'get_radio_plays': {
        const fromDate = toolInput.from_date || getDefaultCampaignStartDate();
        const playsData = await warm.getLibertyArtistPlays(toolInput.artist_name, fromDate);
        const plays = playsData.plays || playsData || [];

        const stations = [...new Set(plays.map(p => p.radioStation || p.station).filter(Boolean))];

        return {
          success: true,
          artist: toolInput.artist_name,
          total_plays: plays.length,
          stations: stations,
          plays: plays.slice(0, 10).map(p => ({
            station: p.radioStation || p.station,
            date: p.playDateTime || p.date,
            time: p.playDateTime || p.time,
          })),
        };
      }

      case 'list_campaigns': {
        const campaigns = await monday.getCampaignItems();
        return {
          success: true,
          board_restriction: `Restricted to Chris Schofield board (${ALLOWED_MONDAY_BOARD_ID})`,
          total: campaigns.length,
          campaigns: campaigns.map(c => ({
            name: c.name,
            group: c.groupTitle,
            id: c.id,
          })),
        };
      }

      case 'list_mailchimp_campaigns': {
        const response = await mailchimp.callMailchimpAPI(
          `/campaigns?count=${toolInput.count || 10}`
        );
        const campaigns = response.campaigns || [];
        return {
          success: true,
          total: campaigns.length,
          campaigns: campaigns.map(c => ({
            id: c.id,
            name: c.settings?.subject_line || c.settings?.title || 'Untitled',
            status: c.status,
            sent_date: c.send_time,
            type: c.type,
          })),
        };
      }

      case 'get_mailchimp_campaign': {
        const campaign = await mailchimp.findCampaignByName(toolInput.campaign_name);
        if (!campaign) {
          return { success: false, error: `Campaign not found: ${toolInput.campaign_name}` };
        }

        const content = await mailchimp.getCampaignContent(campaign.id);

        return {
          success: true,
          campaign: {
            id: campaign.id,
            name: campaign.settings?.subject_line || campaign.settings?.title,
            status: campaign.status,
            type: campaign.type,
            sent_date: campaign.send_time,
            from_name: campaign.settings?.from_name,
            subject: campaign.settings?.subject_line,
            preview_text: campaign.settings?.preview_text,
            plain_text: content.plain_text?.substring(0, 500) || 'No content',
            html_snippet: content.html?.substring(0, 500) || 'No content',
          },
        };
      }

      case 'draft_press_release': {
        const pressRelease = `
# PRESS RELEASE

**FOR IMMEDIATE RELEASE**

${toolInput.artist_name} Releases New ${toolInput.genre || 'Music'}: "${toolInput.track_title}"

${
  toolInput.context ||
  `${toolInput.artist_name} is excited to announce the release of their latest track, "${
    toolInput.track_title
  }". This ${
    toolInput.genre || 'genre-defining'
  } release showcases the artist's evolving sound and creative vision.`
}

The track is available now across all major streaming platforms.

For more information, media inquiries, or interview requests, please contact:

Liberty Music PR
Chris Schofield
Email: chrisschofield@libertymusicpr.com
Web: libertymusicpr.com

---

*About ${toolInput.artist_name}*
${
  toolInput.context ||
  `${toolInput.artist_name} is an emerging ${toolInput.genre || 'music'} artist based in the UK.`
}

END
        `.trim();

        return {
          success: true,
          press_release: pressRelease,
        };
      }

      case 'submit_amazing_radio': {
        const campaign = {
          artistName: toolInput.artist_name,
          trackTitle: toolInput.track_title,
          releaseDate: toolInput.release_date,
          genre: toolInput.genre,
          pressRelease: toolInput.bio,
          downloadLinks: toolInput.audio_url ? [toolInput.audio_url] : [],
        };

        const result = await radioPortal.submitToAmazingRadio(campaign);

        return {
          success: result.success,
          message: result.success ? 'Successfully submitted to Amazing Radio' : 'Submission failed',
          details: result,
        };
      }

      case 'submit_wigwam': {
        const campaign = {
          artistName: toolInput.artist_name,
          trackTitle: toolInput.track_title,
          genre: toolInput.genre,
          pressRelease: toolInput.bio,
          downloadLinks: toolInput.audio_url ? [toolInput.audio_url] : [],
        };

        const result = await radioPortal.submitToRadioWigwam(campaign);

        return {
          success: result.success,
          message: result.success ? 'Successfully submitted to Radio Wigwam' : 'Submission failed',
          details: result,
        };
      }

      case 'request_euro_indie_package': {
        // Send webhook notification to Chris
        if (!euroIndieWebhook) {
          return {
            success: false,
            error: 'Euro Indie webhook not configured. Please add EURO_INDIE_WEBHOOK_URL to .env',
          };
        }

        const approvalRequest = {
          embeds: [
            {
              title: '🎵 Euro Indie Music Package Purchase Request',
              description: `**Artist:** ${toolInput.artist_name}\n**Track:** ${toolInput.track_title}\n**Package:** £${EURO_INDIE_CONTACT.packagePrice} ${EURO_INDIE_CONTACT.packageName}\n\n**Reason:** ${toolInput.reason}`,
              color: 0x3498db,
              fields: [
                {
                  name: '📧 Contact Details',
                  value: `**Name:** ${EURO_INDIE_CONTACT.name}\n**Email:** ${EURO_INDIE_CONTACT.email}`,
                },
                {
                  name: '🛒 Purchase Link',
                  value: EURO_INDIE_CONTACT.purchaseUrl,
                },
                {
                  name: '📎 After Purchase',
                  value: EURO_INDIE_CONTACT.submissionInstructions,
                },
                {
                  name: '✅ Action Required',
                  value:
                    'Chris: Review and purchase if approved. Then email Alessandro with MP3 attached.',
                },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
          username: 'Liberty Radio Agent',
        };

        const fetch = require('node-fetch');
        const webhookResponse = await fetch(euroIndieWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(approvalRequest),
        });

        if (!webhookResponse.ok) {
          throw new Error(`Webhook failed: ${webhookResponse.status}`);
        }

        return {
          success: true,
          message: `Purchase request sent to Chris. Awaiting approval for ${toolInput.artist_name} - "${toolInput.track_title}"`,
          package_details: {
            price: `£${EURO_INDIE_CONTACT.packagePrice}`,
            package: EURO_INDIE_CONTACT.packageName,
            contact: EURO_INDIE_CONTACT.email,
            purchase_url: EURO_INDIE_CONTACT.purchaseUrl,
            instructions:
              'After purchase, email Alessandro with MP3 (filename: ArtistName-TrackName.mp3)',
          },
        };
      }

      default:
        return { success: false, error: `Unknown tool: ${toolName}` };
    }
  } catch (error) {
    console.error(`Tool execution error (${toolName}):`, error);
    return {
      success: false,
      error: error.message,
    };
  }
}

function getDefaultCampaignStartDate() {
  const date = new Date();
  date.setDate(date.getDate() - 42); // 6 weeks ago
  return date.toISOString().split('T')[0];
}

// Conversation history per channel
const conversations = new Map();

// Slash commands
const commands = [
  new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ask the Liberty Radio AI Agent anything')
    .addStringOption(option =>
      option.setName('question').setDescription('Your question').setRequired(true)
    ),
  new SlashCommandBuilder().setName('campaigns').setDescription('List active campaigns'),
  new SlashCommandBuilder()
    .setName('plays')
    .setDescription('Get radio play data for an artist')
    .addStringOption(option =>
      option.setName('artist').setDescription('Artist name').setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search Liberty Gmail')
    .addStringOption(option =>
      option.setName('query').setDescription('Search query').setRequired(true)
    ),
].map(command => command.toJSON());

async function processUserQuery(userMessage, channelId, replyFn) {
  // Initialize conversation history
  if (!conversations.has(channelId)) {
    conversations.set(channelId, []);
  }

  const history = conversations.get(channelId);

  // Add user message to history
  history.push({
    role: 'user',
    content: userMessage,
  });

  // Keep only last 10 messages
  if (history.length > 10) {
    history.splice(0, history.length - 10);
  }

  try {
    let response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: history,
      tools: tools,
    });

    // Handle tool use
    while (response.stop_reason === 'tool_use') {
      const toolUse = response.content.find(block => block.type === 'tool_use');

      if (!toolUse) break;

      console.log(`🔧 Executing tool: ${toolUse.name}`);
      console.log(`📥 Input:`, JSON.stringify(toolUse.input, null, 2));

      const toolResult = await executeTool(toolUse.name, toolUse.input);

      console.log(`📤 Result:`, JSON.stringify(toolResult, null, 2));

      // Add assistant response and tool result to history
      history.push({
        role: 'assistant',
        content: response.content,
      });

      history.push({
        role: 'user',
        content: [
          {
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: JSON.stringify(toolResult),
          },
        ],
      });

      // Get next response
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: history,
        tools: tools,
      });
    }

    // Extract text response
    const textContent = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    // Add assistant response to history
    history.push({
      role: 'assistant',
      content: textContent,
    });

    // Return response
    return textContent || 'I processed your request but have no additional information to share.';
  } catch (error) {
    console.error('Error processing query:', error);
    throw error;
  }
}

async function handleMessage(message) {
  // Ignore bot messages
  if (message.author.bot) return;

  // Check if this is a reply to the bot or part of an active thread
  const isReplyToBot =
    message.reference &&
    message.channel.messages.cache.get(message.reference.messageId)?.author.id ===
      message.client.user.id;
  const isActiveThread = activeThreads.has(message.channel.id);

  // Only respond in DMs, when mentioned, or in active threads
  const isDM = message.guild === null;
  const isMentioned = message.mentions.has(message.client.user);

  if (!isDM && !isMentioned && !isReplyToBot && !isActiveThread) return;

  // Mark channel as active thread
  activeThreads.add(message.channel.id);

  // Auto-cleanup thread after 10 minutes of inactivity
  setTimeout(() => activeThreads.delete(message.channel.id), 600000);

  const channelId = message.channel.id;
  const userMessage = message.content.replace(/<@!?\d+>/g, '').trim();

  try {
    await message.channel.sendTyping();

    const response = await processUserQuery(userMessage, channelId, async text => {
      return text;
    });

    // Split long messages
    if (response.length > 2000) {
      const chunks = response.match(/[\s\S]{1,2000}/g) || [];
      for (const chunk of chunks) {
        await message.reply(chunk);
      }
    } else {
      await message.reply(response);
    }
  } catch (error) {
    console.error('Error handling message:', error);
    await message.reply('Sorry, I encountered an error processing your request. Please try again.');
  }
}

async function handleInteraction(interaction) {
  if (!interaction.isChatInputCommand()) return;

  await interaction.deferReply({ ephemeral: false });

  try {
    const channelId = interaction.channelId;
    let userMessage = '';

    // Build user message from command
    switch (interaction.commandName) {
      case 'ask':
        userMessage = interaction.options.getString('question');
        break;
      case 'campaigns':
        userMessage = 'List all active campaigns';
        break;
      case 'plays':
        userMessage = `Get radio play data for ${interaction.options.getString('artist')}`;
        break;
      case 'search':
        userMessage = `Search my Gmail for: ${interaction.options.getString('query')}`;
        break;
      default:
        await interaction.editReply('Unknown command');
        return;
    }

    const response = await processUserQuery(userMessage, channelId, async text => {
      return text;
    });

    // Split long messages
    if (response.length > 2000) {
      const chunks = response.match(/[\s\S]{1,2000}/g) || [];
      await interaction.editReply(chunks[0]);
      for (let i = 1; i < chunks.length; i++) {
        await interaction.followUp(chunks[i]);
      }
    } else {
      await interaction.editReply(response);
    }
  } catch (error) {
    console.error('Error handling interaction:', error);
    await interaction.editReply(
      'Sorry, I encountered an error processing your request. Please try again.'
    );
  }
}

function loadCurrentStatus() {
  try {
    if (!fs.existsSync(statusFilePath)) {
      return null;
    }
    const raw = fs.readFileSync(statusFilePath, 'utf8');
    if (!raw.trim()) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load status file:', error.message);
    return null;
  }
}

function computePresenceFromStatus(statusPayload) {
  if (!statusPayload) {
    return {
      activities: [{ name: 'Liberty Radio Campaigns', type: ActivityType.Watching }],
      status: 'online',
    };
  }

  const campaigns = Array.isArray(statusPayload.campaigns) ? statusPayload.campaigns : [];
  const activeCampaigns = campaigns.filter(campaign => campaign.status !== 'completed');

  if (activeCampaigns.length === 0) {
    return {
      activities: [{ name: 'Ready to help with campaigns', type: ActivityType.Playing }],
      status: 'online',
    };
  }

  const activityLabel = `${activeCampaigns.length} active campaign${
    activeCampaigns.length === 1 ? '' : 's'
  }`;
  return {
    activities: [{ name: activityLabel, type: ActivityType.Watching }],
    status: 'online',
  };
}

function updatePresence(client) {
  if (!client?.user) return;

  try {
    const statusPayload = loadCurrentStatus();
    const presence = computePresenceFromStatus(statusPayload);
    client.user.setPresence(presence);
  } catch (error) {
    console.error('Failed to update Discord presence:', error.message);
  }
}

function startStatusWatcher(client) {
  const update = () => updatePresence(client);

  update();

  const watcher = (curr, prev) => {
    if (curr.mtimeMs !== prev.mtimeMs) {
      update();
    }
  };

  fs.watchFile(statusFilePath, { interval: 5000 }, watcher);

  return () => {
    fs.unwatchFile(statusFilePath, watcher);
  };
}

async function main() {
  // Register slash commands
  const rest = new REST({ version: '10' }).setToken(token);
  try {
    await rest.put(Routes.applicationGuildCommands(appId, guildId), { body: commands });
    console.log('✅ Slash commands registered');
  } catch (error) {
    console.error('Failed to register slash commands:', error);
  }

  let stopStatusWatcher = () => {};
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages,
    ],
  });

  stopStatusWatcher = startStatusWatcher(client);

  // FIXED: Use clientReady instead of ready
  client.once('clientReady', () => {
    console.log(`🤖 Liberty Radio AI Agent ready as ${client.user.tag}`);
    console.log(`🧠 Powered by Claude Sonnet 4.5`);
    console.log(
      `🔧 Tools: Gmail, Monday.com (Chris board only), WARM API, Mailchimp, Amazing Radio, Wigwam`
    );
    console.log(`💰 Cost: ~$0.003 per message (Sonnet 4.5)`);
    console.log(`💬 Threads: Reply to bot messages to continue conversation without @mentions`);
    console.log(`🔒 Monday.com: Restricted to board ${ALLOWED_MONDAY_BOARD_ID}`);
    console.log(`📻 Radio Portals: Amazing Radio + Wigwam automation enabled`);
    console.log(`💶 Euro Indie: Webhook ${euroIndieWebhook ? 'configured' : 'NOT configured'}`);
    updatePresence(client);
  });

  client.on('messageCreate', handleMessage);
  client.on('interactionCreate', handleInteraction);

  client.on('error', error => {
    console.error('Discord client error:', error.message);
  });

  process.on('SIGINT', async () => {
    console.log('👋 Shutting down Liberty Radio AI Agent...');
    try {
      stopStatusWatcher();
      await client.destroy();
    } finally {
      process.exit(0);
    }
  });

  await client.login(token);
}

main().catch(error => {
  console.error('Liberty Radio AI Agent failed to start:', error);
  process.exit(1);
});
