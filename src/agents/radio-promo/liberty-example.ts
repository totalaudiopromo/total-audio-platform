import { LibertyRadioPromoAgent, LibertyCampaignData } from './LibertyRadioPromoAgent';

/**
 * Liberty Radio Promo Agent - Usage Example
 *
 * This example shows how to use the upgraded Liberty agent with:
 * - Real-time streaming progress
 * - Autonomous campaign execution
 * - Monday.com, Gmail, WARM API integration
 */

// Example integration setup (you'd import your actual APIs)
const mondayApi = {
  async createLibertyCampaign(data: any, warmApi: any) {
    console.log('Creating Monday.com campaign...');
    return {
      id: 'campaign-123',
      url: 'https://monday.com/boards/123',
    };
  },
  async updateCampaignStatus(campaignId: string, station: string, status: string, notes?: string) {
    console.log(`Updating ${station} to ${status}`);
  },
};

const gmailApi = {
  async sendEmail(data: any) {
    console.log(`Sending email to ${data.to}`);
    return {
      id: 'msg-123',
    };
  },
};

const warmApi = {
  async checkPlays(data: any) {
    console.log(`Checking plays for ${data.artist} - ${data.track}`);
    return [
      { station: 'Amazing Dance', date: '2025-10-01' },
      { station: 'Sheffield Live!', date: '2025-10-02' },
    ];
  },
};

/**
 * Example 1: Execute Full Campaign with Streaming Progress
 */
async function executeSeniorDunceCampaign() {
  // Initialize agent with API integrations
  const agent = new LibertyRadioPromoAgent(mondayApi, gmailApi, warmApi);

  // Listen to real-time progress events (great for Liberty's visibility)
  agent.on('campaign_start', event => {
    console.log(`\n🎵 Starting campaign for ${event.artist} - "${event.track}"`);
    console.log(`   Targeting ${event.stations} stations\n`);
  });

  agent.on('tool_use', event => {
    console.log(`🔧 Using tool: ${event.toolName}`);
    if (event.toolName === 'send_email_via_gmail') {
      console.log(`   📧 Sending email to ${event.toolInput.station_name}...`);
    }
  });

  agent.on('progress', event => {
    // Real-time text progress (streaming)
    process.stdout.write(event.delta);
  });

  agent.on('agentic_iteration', event => {
    console.log(`\n🔄 Iteration ${event.iteration}/${event.maxIterations}`);
  });

  agent.on('campaign_complete', event => {
    console.log(`\n\n✅ Campaign complete for ${event.artist}!`);
  });

  agent.on('error', event => {
    console.error(`\n❌ Error: ${event.error}`);
  });

  // Campaign data (Senior Dunce example)
  const campaignData: LibertyCampaignData = {
    artistName: 'Senior Dunce',
    trackName: 'Bestial',
    genre: 'Electronic/Experimental',
    releaseDate: '2025-10-15',
    campaignDuration: '4-week',
    budget: '£500',
    targetMarket: 'UK focused',
    campaignAngle: 'UK electronic influence with British engineer collaboration',
    targetStations: [
      {
        name: 'BBC Radio 6 Music',
        email: '6music@bbc.co.uk',
        type: 'National',
        priority: 'high',
        notes: 'BBC Introducing submission required + direct pitch',
      },
      {
        name: 'Amazing Radio',
        email: 'music@amazingradio.com',
        type: 'Online',
        priority: 'high',
        notes: 'Direct submission via website + email pitch',
      },
      {
        name: 'Radio Wigwam',
        email: 'music@radiowigwam.com',
        type: 'Community',
        priority: 'high',
        notes: 'Direct email pitch with press release',
      },
      {
        name: 'Resonance FM',
        email: 'programming@resonancefm.com',
        type: 'Community',
        priority: 'medium',
        notes: 'Experimental format - perfect fit',
      },
      {
        name: 'NTS Radio',
        email: 'submissions@nts.live',
        type: 'Online',
        priority: 'medium',
        notes: 'Direct pitch to relevant shows',
      },
      {
        name: 'Soho Radio',
        email: 'music@sohoradio.com',
        type: 'Online',
        priority: 'medium',
        notes: 'Fresh electronic sound angle',
      },
    ],
    previousPlays: ['Amazing Dance', 'Sheffield Live!', 'European Indie Music Network'],
  };

  // Execute campaign autonomously!
  const result = await agent.executeCampaign(campaignData);

  console.log('\n📊 Campaign Result:');
  console.log(JSON.stringify(result, null, 2));
}

/**
 * Example 2: Generate Campaign Strategy with Extended Thinking
 */
async function generateCampaignStrategy() {
  const agent = new LibertyRadioPromoAgent(mondayApi, gmailApi, warmApi);

  console.log('🧠 Generating campaign strategy with extended thinking...\n');

  const strategy = await agent.generateCampaignStrategy({
    artistName: 'Senior Dunce',
    trackName: 'Bestial',
    genre: 'Electronic/Experimental',
    budget: '£500',
    targetMarket: 'UK focused',
    targetStations: [
      { name: 'BBC Radio 6 Music', email: '6music@bbc.co.uk', type: 'National', priority: 'high' },
      { name: 'Amazing Radio', email: 'music@amazingradio.com', type: 'Online', priority: 'high' },
      { name: 'NTS Radio', email: 'submissions@nts.live', type: 'Online', priority: 'medium' },
      { name: 'Soho Radio', email: 'music@sohoradio.com', type: 'Online', priority: 'medium' },
    ],
  });

  console.log('📋 Strategic Recommendation:\n');
  console.log(strategy);
}

/**
 * Example 3: Monitor Real-time Progress (Command Centre Integration)
 */
async function monitorCampaignProgress() {
  const agent = new LibertyRadioPromoAgent(mondayApi, gmailApi, warmApi);

  // Collect all events for dashboard display
  const events: any[] = [];

  agent.on('campaign_start', e => events.push({ type: 'start', ...e }));
  agent.on('tool_use', e => events.push({ type: 'tool_use', ...e }));
  agent.on('tool_result', e => events.push({ type: 'tool_result', ...e }));
  agent.on('agentic_iteration', e => events.push({ type: 'iteration', ...e }));
  agent.on('campaign_complete', e => events.push({ type: 'complete', ...e }));
  agent.on('error', e => events.push({ type: 'error', ...e }));

  const campaignData: LibertyCampaignData = {
    artistName: 'Test Artist',
    trackName: 'Test Track',
    genre: 'Electronic',
    targetStations: [
      { name: 'Test Station', email: 'test@test.com', type: 'Online', priority: 'high' },
    ],
  };

  await agent.executeCampaign(campaignData);

  // Display collected events (for Command Centre dashboard)
  console.log('\n📊 Campaign Events Log:');
  events.forEach((event, index) => {
    console.log(`${index + 1}. [${event.type}] at ${event.timestamp}`);
  });

  return events; // Return for dashboard integration
}

/**
 * Example 4: Cost Comparison (Before vs After SDK Upgrade)
 */
function demonstrateCostSavings() {
  console.log('\n💰 Cost Savings with SDK Upgrade:\n');

  const campaignStats = {
    stations: 8,
    tokensPerEmail: 3000, // system prompt + generation
    tokensWithoutCaching: 3000 * 8, // 24,000 tokens
    tokensWithCaching: 3000 * 0.1 + 500 * 8, // 90% cached + user prompts = 4,300 tokens
    inputCostPerMTok: 3, // $3
    outputCostPerMTok: 15, // $15
  };

  const costWithoutSDK =
    (campaignStats.tokensWithoutCaching / 1000000) * campaignStats.inputCostPerMTok;
  const costWithSDK = (campaignStats.tokensWithCaching / 1000000) * campaignStats.inputCostPerMTok;
  const savings = costWithoutSDK - costWithSDK;
  const savingsPercent = (savings / costWithoutSDK) * 100;

  console.log(`Campaign: 8 stations, personalized emails\n`);
  console.log(`Without SDK (no caching):`);
  console.log(`  Tokens: ${campaignStats.tokensWithoutCaching.toLocaleString()}`);
  console.log(`  Cost: $${costWithoutSDK.toFixed(4)}\n`);

  console.log(`With SDK (90% cache hit rate):`);
  console.log(`  Tokens: ${campaignStats.tokensWithCaching.toLocaleString()}`);
  console.log(`  Cost: $${costWithSDK.toFixed(4)}\n`);

  console.log(`💰 Savings: $${savings.toFixed(4)} (${savingsPercent.toFixed(1)}%)`);
  console.log(`📊 Per 10 campaigns: $${(savings * 10).toFixed(2)} saved\n`);
}

/**
 * Run examples
 */
async function main() {
  console.log('='.repeat(60));
  console.log('LIBERTY RADIO PROMO AGENT - SDK UPGRADE EXAMPLES');
  console.log('='.repeat(60));

  // Uncomment the example you want to run:

  // Example 1: Full campaign execution
  // await executeSeniorDunceCampaign();

  // Example 2: Strategic planning with thinking
  // await generateCampaignStrategy();

  // Example 3: Event monitoring for dashboard
  // await monitorCampaignProgress();

  // Example 4: Cost analysis
  demonstrateCostSavings();
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export {
  executeSeniorDunceCampaign,
  generateCampaignStrategy,
  monitorCampaignProgress,
  demonstrateCostSavings,
};
