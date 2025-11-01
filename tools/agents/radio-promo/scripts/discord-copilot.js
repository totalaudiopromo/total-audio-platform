const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(process.cwd(), '.env') });

let discord;
try {
  // Lazy require so we can give the user a friendly install hint
  discord = require('discord.js');
} catch (error) {
  console.error('❌ Missing dependency: discord.js');
  console.error('➡️  Install it with `npm install discord.js` (run at the repo root).');
  process.exit(1);
}

const {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  ActivityType,
} = discord;

const DEFAULT_PRESENCE = {
  activities: [{ name: 'Liberty radio workflows', type: ActivityType.Listening }],
  status: 'idle',
};

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

if (!token || !appId || !guildId) {
  console.error('❌ Missing required Discord env vars.');
  console.error('Ensure DISCORD_BOT_TOKEN, DISCORD_APP_ID, DISCORD_GUILD_ID are set.');
  process.exit(1);
}

const statusFilePath = path.join(__dirname, '..', 'status', 'current-status.json');

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

function pickCampaign(statusPayload, query) {
  const campaigns = Array.isArray(statusPayload?.campaigns) ? statusPayload.campaigns : [];
  if (campaigns.length === 0) return null;

  if (!query) {
    return campaigns.reduce((latest, campaign) => {
      const created = new Date(campaign.createdAt || 0).getTime();
      const latestCreated = new Date(latest?.createdAt || 0).getTime();
      return created > latestCreated ? campaign : latest;
    }, campaigns[0]);
  }

  const loweredQuery = query.toLowerCase();
  return (
    campaigns.find(campaign => {
      const haystack = [campaign.id, campaign.artistName, campaign.trackTitle]
        .filter(Boolean)
        .map(value => value.toLowerCase());
      return haystack.some(value => value.includes(loweredQuery));
    }) || null
  );
}

function buildCampaignEmbed(statusPayload, campaign) {
  const steps = Array.isArray(campaign.steps) ? campaign.steps : [];
  const completedSteps = steps.filter(
    step => step.status === 'completed' || step.status === 'approved'
  ).length;
  const totalSteps = steps.length || (statusPayload?.workflows?.[campaign.workflowId]?.length ?? 0);
  const createdAt = campaign.createdAt ? new Date(campaign.createdAt).toLocaleString() : 'n/a';
  const lastUpdate = statusPayload?.lastUpdate
    ? new Date(statusPayload.lastUpdate).toLocaleString()
    : 'n/a';

  const agentStatuses = Array.isArray(statusPayload?.agentStatuses)
    ? statusPayload.agentStatuses
        .slice(0, 6)
        .map(agent => `${agent.name}: ${agent.status}`)
        .join('\n')
    : 'n/a';

  const fields = [
    { name: 'Status', value: campaign.status || 'unknown', inline: true },
    { name: 'Priority', value: (campaign.priority || 'not set').toString(), inline: true },
    { name: 'Created', value: createdAt, inline: true },
    { name: 'Progress', value: `${completedSteps}/${totalSteps || '?'} steps`, inline: true },
    { name: 'Genre', value: campaign.genre || 'unknown', inline: true },
    { name: 'Last Update', value: lastUpdate, inline: true },
    { name: 'Agent Snapshot', value: agentStatuses },
  ];

  const descriptionParts = [];
  if (campaign.artistName || campaign.trackTitle) {
    descriptionParts.push(
      ['Artist', campaign.artistName].filter(Boolean).join(': '),
      ['Track', campaign.trackTitle].filter(Boolean).join(': ')
    );
  }

  return buildEmbed(
    `Campaign ${campaign.id || ''}`.trim(),
    descriptionParts.filter(Boolean).join('\n') || 'Campaign details loaded.',
    fields
  );
}

const commands = [
  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Show the current state of the Liberty radio automation')
    .addStringOption(option =>
      option
        .setName('campaign')
        .setDescription('Optional campaign identifier or artist name')
        .setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName('submit')
    .setDescription('Kick off an Amazing Radio + Wigwam submission for a campaign')
    .addStringOption(option =>
      option.setName('campaign').setDescription('Campaign slug or artist name').setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('notify')
    .setDescription('Send yourself a reminder about a campaign milestone')
    .addStringOption(option =>
      option.setName('campaign').setDescription('Campaign slug or artist name').setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('note')
        .setDescription('What should the agent remind you about?')
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('List available Liberty radio agent commands'),
].map(command => command.toJSON());

async function registerCommands(rest) {
  try {
    await rest.put(Routes.applicationGuildCommands(appId, guildId), { body: commands });
  } catch (error) {
    console.error('❌ Failed to register slash commands:', error.message);
    throw error;
  }
}

function buildEmbed(title, description, fields = []) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .addFields(fields)
    .setColor(0x5865f2)
    .setTimestamp(new Date());
}

function computePresenceFromStatus(statusPayload) {
  if (!statusPayload) {
    return {
      activities: [{ name: 'Awaiting orchestrator sync...', type: ActivityType.Watching }],
      status: 'idle',
    };
  }

  const campaigns = Array.isArray(statusPayload.campaigns) ? statusPayload.campaigns : [];
  const activeCampaigns = campaigns.filter(campaign => campaign.status !== 'completed');
  const lastUpdate = statusPayload.lastUpdate
    ? new Date(statusPayload.lastUpdate).toLocaleTimeString()
    : 'unknown';

  if (activeCampaigns.length === 0) {
    return {
      activities: [
        { name: `No active campaigns - updated ${lastUpdate}`, type: ActivityType.Playing },
      ],
      status: 'idle',
    };
  }

  const activityLabel = `${activeCampaigns.length} active campaign${activeCampaigns.length === 1 ? '' : 's'}`;
  return {
    activities: [{ name: `${activityLabel} - updated ${lastUpdate}`, type: ActivityType.Watching }],
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
    try {
      client.user.setPresence(DEFAULT_PRESENCE);
    } catch (innerError) {
      console.error('Fallback presence update failed:', innerError.message);
    }
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

  fs.watchFile(statusFilePath, { interval: 2000 }, watcher);

  let dirWatcher = null;
  try {
    dirWatcher = fs.watch(
      path.dirname(statusFilePath),
      { persistent: false },
      (eventType, filename) => {
        if (filename === path.basename(statusFilePath)) {
          update();
        }
      }
    );
  } catch (error) {
    console.error('Failed to watch status directory:', error.message);
  }

  return () => {
    fs.unwatchFile(statusFilePath, watcher);
    if (dirWatcher) {
      try {
        dirWatcher.close();
      } catch (error) {
        console.error('Failed to close directory watcher:', error.message);
      }
    }
  };
}

async function handleStatus(interaction) {
  await interaction.deferReply({ ephemeral: true });
  const campaignQuery = interaction.options.getString('campaign');
  const statusPayload = loadCurrentStatus();

  if (!statusPayload) {
    await interaction.editReply({
      embeds: [
        buildEmbed(
          'Liberty Radio Agent Status',
          'No status data found. Ensure the orchestrator has written `status/current-status.json`.',
          [
            {
              name: 'Next Step',
              value: 'Run the orchestrator or check file permissions for the status directory.',
            },
          ]
        ),
      ],
    });
    return;
  }

  const campaign = pickCampaign(statusPayload, campaignQuery);
  if (!campaign) {
    await interaction.editReply({
      embeds: [
        buildEmbed(
          'Liberty Radio Agent Status',
          campaignQuery
            ? `No campaign matched **${campaignQuery}**.`
            : 'No campaigns available in the current status file.',
          [
            {
              name: 'Next Step',
              value: 'Kick off a workflow from the orchestrator, then re-run this command.',
            },
          ]
        ),
      ],
    });
    return;
  }

  await interaction.editReply({
    embeds: [buildCampaignEmbed(statusPayload, campaign)],
  });
}

async function handleSubmit(interaction) {
  const campaign = interaction.options.getString('campaign');
  await interaction.reply({
    embeds: [
      buildEmbed(
        'Submission Kickoff (Stub)',
        `I would trigger the Amazing Radio + Wigwam run for **${campaign}**, but the bridge is not yet wired.`,
        [
          {
            name: 'Next Step',
            value:
              'Call the radio submission orchestrator from here (e.g., spawn `radio-agent.js` or expose an internal API).',
          },
        ]
      ),
    ],
    ephemeral: true,
  });
}

async function handleNotify(interaction) {
  const campaign = interaction.options.getString('campaign');
  const note = interaction.options.getString('note');

  await interaction.reply({
    embeds: [
      buildEmbed('Reminder Created (Stub)', `Reminder noted for **${campaign}**: ${note}`, [
        {
          name: 'Next Step',
          value:
            'Persist reminders to a queue or database and route through whichever notification channel you prefer.',
        },
      ]),
    ],
    ephemeral: true,
  });
}

async function handleHelp(interaction) {
  await interaction.reply({
    embeds: [
      buildEmbed(
        'Liberty Radio Agent Commands',
        'Use these slash commands to interact with the agent. Wire each handler into your internal logic to make them live.',
        [
          { name: '/status [campaign?]', value: 'Check automation progress for a campaign.' },
          { name: '/submit <campaign>', value: 'Kick off Amazing Radio + Wigwam submissions.' },
          {
            name: '/notify <campaign> <note>',
            value: 'Ask the agent to remind you about something.',
          },
        ]
      ),
    ],
    ephemeral: true,
  });
}

function routeInteraction(interaction) {
  const handlers = {
    status: handleStatus,
    submit: handleSubmit,
    notify: handleNotify,
    help: handleHelp,
  };

  return handlers[interaction.commandName]?.(interaction);
}

async function main() {
  const rest = new REST({ version: '10' }).setToken(token);
  await registerCommands(rest);
  console.log('✅ Slash commands registered');

  let stopStatusWatcher = () => {};
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
    partials: [Partials.Channel],
  });

  stopStatusWatcher = startStatusWatcher(client);

  client.once('ready', () => {
    console.log(`🤖 Discord co-pilot ready as ${client.user.tag}`);
    updatePresence(client);
  });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    try {
      await routeInteraction(interaction);
    } catch (error) {
      console.error('Discord command handler failed:', error);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({
          content: 'Something went wrong while handling that command.',
        });
      } else {
        await interaction.reply({
          content: 'Something went wrong while handling that command.',
          ephemeral: true,
        });
      }
    }
  });

  client.on('error', error => {
    console.error('Discord client error:', error.message);
  });

  process.on('SIGINT', async () => {
    console.log('👋 Shutting down Discord co-pilot...');
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
  console.error('Discord co-pilot failed to start:', error);
  process.exit(1);
});
