// Enhanced content generation functions in your authentic voice

export function generateNewsletterContent(opportunity: any): string {
  const angle = opportunity.audioIntelAngle || 'Industry shift creates new opportunities';
  const source = opportunity.source?.name || 'Industry sources';
  const urgency = opportunity.urgencyLevel || 'medium';

  // Generate different intro styles based on urgency and topic
  let intro = '';
  if (urgency === 'immediate') {
    intro = `🚨 BREAKING: While everyone's still processing this news from ${source}, here's exactly what it means for Audio Intel users...`;
  } else if (
    opportunity.title.toLowerCase().includes('playlist') ||
    opportunity.title.toLowerCase().includes('curator')
  ) {
    intro = `Right, so whilst playlist curators are making moves, here's why this is massive for contact intelligence...`;
  } else if (
    opportunity.title.toLowerCase().includes('platform') ||
    opportunity.title.toLowerCase().includes('streaming')
  ) {
    intro = `New platform alert: ${source} just validated everything we've been saying about contact intelligence...`;
  } else {
    intro = `Industry intel update: ${source} just confirmed what Audio Intel users already know...`;
  }

  // Generate actionable advice based on content
  let actionableAdvice = '';
  if (
    opportunity.title.toLowerCase().includes('contact') ||
    opportunity.title.toLowerCase().includes('database')
  ) {
    actionableAdvice =
      'This is your moment to double down on contact intelligence. While others debate, you execute.';
  } else if (
    opportunity.title.toLowerCase().includes('independent') ||
    opportunity.title.toLowerCase().includes('indie')
  ) {
    actionableAdvice = 'The unsigned advantage is real. Major labels move slow, indies move fast.';
  } else {
    actionableAdvice =
      "First-mover advantage belongs to those with the right intelligence. That's you.";
  }

  return `${intro}

Now, here's your move: ${angle}

What this actually means for you: ${actionableAdvice}

The reality is this: Most artists will wait 6 months to understand this shift. Audio Intel users are already positioning themselves for what comes next.

Remember: Industry changes create new gatekeepers. We find them first.`;
}

// Different intro styles for variety
const THREAD_INTROS = [
  '🧵 Industry thread:',
  '💡 Music industry insight:',
  '📊 Intel drop:',
  '🎯 Opportunity alert:',
  '⚡ Industry shift:',
  '🔍 Pattern spotted:',
  '📡 Signal detected:',
  '🚀 Movement update:',
];

const HOOK_STYLES = [
  (angle: string) => `Here's what this actually means for indie artists: ${angle}`,
  (angle: string) => `The real story here: ${angle}`,
  (angle: string) => `What smart indies see: ${angle}`,
  (angle: string) => `The angle most miss: ${angle}`,
  (angle: string) => `Why this matters now: ${angle}`,
  (angle: string) => `Decoding the signal: ${angle}`,
];

const CLOSERS = [
  'The unsigned advantage is speed. Move now.',
  'Contact intelligence beats mass marketing. Every time.',
  'First movers win. Audio Intel users move first.',
  'While majors debate, indies execute.',
  'Intelligence is the new advantage. Get it first.',
  'This is why we track industry movements.',
  'Opportunity favours the prepared.',
  'Right contacts + right timing = results.',
];

export function generateTwitterContent(opportunity: any): string[] {
  const isHighUrgency =
    opportunity.urgencyLevel === 'immediate' || opportunity.urgencyLevel === 'high';
  const title = opportunity.title || 'Industry news';
  const angle = opportunity.audioIntelAngle || 'New opportunities for smart indies';

  // Pick random styles for variety
  const randomIntro = THREAD_INTROS[Math.floor(Math.random() * THREAD_INTROS.length)];
  const randomHook = HOOK_STYLES[Math.floor(Math.random() * HOOK_STYLES.length)];
  const randomCloser = CLOSERS[Math.floor(Math.random() * CLOSERS.length)];

  // Generate different thread styles based on content type and urgency
  if (isHighUrgency) {
    if (title.toLowerCase().includes('contact') || title.toLowerCase().includes('database')) {
      return [
        `🚨 CONTACT INTELLIGENCE ALERT: ${title.substring(0, 100)}...`,
        `While major labels scramble to understand this, Audio Intel users already see the opportunity:`,
        `${angle}`,
        `This is exactly why contact intelligence beats mass marketing every single time.`,
        `The data doesn't lie: Indies with better contacts win faster. 📊`,
      ];
    } else if (
      title.toLowerCase().includes('playlist') ||
      title.toLowerCase().includes('curator')
    ) {
      return [
        `🧵 PLAYLIST INTEL: ${title.substring(0, 110)}...`,
        `New curators = new opportunities. But only if you know who they are and how to reach them.`,
        `${angle}`,
        `Audio Intel finds them. You reach them. Simple.`,
      ];
    } else if (title.toLowerCase().includes('radio') || title.toLowerCase().includes('bbc')) {
      return [
        `📻 RADIO INTEL: ${title.substring(0, 110)}...`,
        `Radio is still the gold standard for breaking artists. This changes how you approach it.`,
        randomHook(angle),
        randomCloser,
      ];
    } else if (title.toLowerCase().includes('ai') || title.toLowerCase().includes('artificial')) {
      return [
        `🤖 AI + MUSIC UPDATE: ${title.substring(0, 100)}...`,
        `AI is reshaping music marketing. Here's how smart indies are using it:`,
        randomHook(angle),
        `Automate the boring stuff. Keep the human connection.`,
        randomCloser,
      ];
    } else {
      return [
        `🚨 BREAKING: ${title.substring(0, 120)}...`,
        `While everyone else processes this news, here's what Audio Intel users already know:`,
        `${angle}`,
        randomCloser,
      ];
    }
  }

  // Regular urgency threads with more variety
  if (title.toLowerCase().includes('independent') || title.toLowerCase().includes('indie')) {
    return [
      `🎯 Indies winning again: ${title.substring(0, 110)}...`,
      `${angle}`,
      `The unsigned advantage: Major labels take months to adapt. Indies move in days.`,
      randomCloser,
    ];
  } else if (
    title.toLowerCase().includes('streaming') ||
    title.toLowerCase().includes('platform')
  ) {
    return [
      `📡 Platform intel: ${title.substring(0, 110)}...`,
      randomHook(angle),
      `New platforms = new submission opportunities. Audio Intel users spot them first.`,
    ];
  } else if (title.toLowerCase().includes('sync') || title.toLowerCase().includes('licensing')) {
    return [
      `🎬 SYNC OPPORTUNITY: ${title.substring(0, 100)}...`,
      `Sync deals are still the fastest path to real revenue for indies.`,
      randomHook(angle),
      `The right contact at the right time. That's the game.`,
    ];
  } else if (title.toLowerCase().includes('pr') || title.toLowerCase().includes('press')) {
    return [
      `📰 PR INTEL: ${title.substring(0, 110)}...`,
      `Press coverage still matters. Here's the angle most miss:`,
      randomHook(angle),
      randomCloser,
    ];
  } else if (
    title.toLowerCase().includes('social') ||
    title.toLowerCase().includes('tiktok') ||
    title.toLowerCase().includes('instagram')
  ) {
    return [
      `📱 SOCIAL INTEL: ${title.substring(0, 100)}...`,
      `Algorithms change. Relationships don't.`,
      randomHook(angle),
      `Build the contacts that outlast any platform shift.`,
    ];
  } else if (title.toLowerCase().includes('festival') || title.toLowerCase().includes('live')) {
    return [
      `🎪 LIVE MUSIC UPDATE: ${title.substring(0, 100)}...`,
      `Festivals and live opportunities are opening up. Here's who to know:`,
      randomHook(angle),
      randomCloser,
    ];
  } else {
    return [`${randomIntro} ${title.substring(0, 100)}...`, randomHook(angle), randomCloser];
  }
}

export function generateLinkedInContent(opportunity: any): string {
  const title = opportunity.title || 'Industry Development';
  const angle = opportunity.audioIntelAngle || 'New opportunities emerging for smart indies';
  const urgency = opportunity.urgencyLevel || 'medium';

  // Generate professional but authentic LinkedIn content
  let hook = '';
  if (urgency === 'immediate') {
    hook = `⚡ Industry Alert: ${title}`;
  } else if (title.toLowerCase().includes('independent') || title.toLowerCase().includes('indie')) {
    hook = `🎯 The Independent Artist Advantage: ${title}`;
  } else if (title.toLowerCase().includes('contact') || title.toLowerCase().includes('database')) {
    hook = `📊 Contact Intelligence Update: ${title}`;
  } else {
    hook = `🎵 Music Industry Intel: ${title}`;
  }

  let analysis = '';
  if (title.toLowerCase().includes('startup') || title.toLowerCase().includes('funding')) {
    analysis = `This development validates what we've been seeing in the music tech space: contact intelligence and relationship data are becoming the competitive advantage for independent artists.`;
  } else if (
    title.toLowerCase().includes('platform') ||
    title.toLowerCase().includes('streaming')
  ) {
    analysis = `Platform changes like this create new submission opportunities - but only for artists who can identify and reach the right contacts quickly.`;
  } else {
    analysis = `Industry shifts like this separate the reactive from the proactive. Those with better intelligence move first and win bigger.`;
  }

  return `${hook}

${analysis}

Here's the real insight: ${angle}

The pattern is clear - major labels take 3-6 months to adapt to industry changes. Independent artists who leverage contact intelligence can move in days.

That's the core thesis behind Audio Intel: giving indie artists professional-grade contact intelligence so they can capitalize on opportunities faster than traditional industry players.

Every industry shift creates new gatekeepers. The question is: will you find them first, or wait for someone else to tell you about them?

💭 What's your experience with adapting to industry changes? Are you reactive or proactive?

#MusicIndustry #IndependentArtists #MusicTech #ContactIntelligence`;
}

export function generateInstagramSlides(opportunity: any): string[] {
  const title = opportunity.title || 'Industry News';
  const angle = opportunity.audioIntelAngle || 'Smart indies spot opportunities first';

  // Generate slides based on content type
  if (title.toLowerCase().includes('contact') || title.toLowerCase().includes('database')) {
    return [
      'CONTACT INTEL ALERT 🚨',
      title.substring(0, 45) + '...',
      'What major labels see: "More industry news"',
      'What Audio Intel users see:',
      angle,
      'Contact intelligence = unfair advantage',
      'Get your intelligence at AudioIntel.co',
    ];
  } else if (title.toLowerCase().includes('playlist') || title.toLowerCase().includes('curator')) {
    return [
      'PLAYLIST OPPORTUNITY 🎯',
      title.substring(0, 45) + '...',
      'New curators = new contacts',
      'Audio Intel finds them first',
      angle,
      'Your move, indie artist',
    ];
  } else if (title.toLowerCase().includes('independent') || title.toLowerCase().includes('indie')) {
    return [
      'INDIE ADVANTAGE ALERT 🚀',
      title.substring(0, 45) + '...',
      'Major labels: "Let\'s wait and see"',
      'Smart indies: "Let\'s move now"',
      angle,
      'The unsigned advantage strikes again',
    ];
  } else {
    return [
      'INDUSTRY INTEL 📊',
      title.substring(0, 45) + '...',
      'What everyone else sees:',
      '"Another industry update"',
      'What Audio Intel users see:',
      angle,
      'Intelligence = advantage',
    ];
  }
}

export function generateInstagramCaption(opportunity: any): string {
  const title = opportunity.title || 'Industry development';
  const angle = opportunity.audioIntelAngle || 'New opportunities for smart indies';
  const urgency = opportunity.urgencyLevel || 'medium';

  let emoji = '🎵';
  if (urgency === 'immediate') emoji = '⚡';
  else if (title.toLowerCase().includes('contact')) emoji = '📊';
  else if (title.toLowerCase().includes('playlist')) emoji = '🎯';
  else if (title.toLowerCase().includes('independent')) emoji = '🚀';

  let hook = '';
  if (urgency === 'immediate') {
    hook = 'BREAKING: Industry move creates instant opportunity for indies 🚨';
  } else if (title.toLowerCase().includes('independent')) {
    hook = 'Indies winning again while majors wait around 🚀';
  } else {
    hook = 'Industry intel that puts indies ahead of the game 📊';
  }

  return `${hook}

${angle}

That's the unsigned advantage: Major labels take months to adapt. Indies with Audio Intel move in days.

Every industry shift creates new gatekeepers. We find them first ${emoji}

Link in bio for the contact intelligence that keeps you ahead.

#IndependentArtist #MusicIndustry #UnsignedAdvantage #ContactIntelligence #MusicTech #IndieMusic`;
}
