// Content generation functions in your authentic voice

export function generateNewsletterContent(opportunity: any): string {
  const angle = opportunity.audioIntelAngle || 'Industry shift creates new opportunities';
  
  return `Right, so whilst ${opportunity.source.name} is making announcements, here's why that's actually brilliant news for independent artists...

Now, here's your move: ${angle}

What this actually means for you: The major labels will take months to adapt to this. You can move now.

The reality is this: most artists will wait to see what happens. Smart ones will already be positioning themselves.`;
}

export function generateTwitterContent(opportunity: any): string[] {
  const isHighUrgency = opportunity.urgencyLevel === 'immediate' || opportunity.urgencyLevel === 'high';
  
  if (isHighUrgency) {
    return [
      `🧵 BREAKING: ${opportunity.title.substring(0, 100)}...`,
      `While everyone else is still reading the headlines, here's what this actually means for indie artists:`,
      `${opportunity.audioIntelAngle}`,
      `This is why Audio Intel users stay ahead of the game. Link in bio 🔥`
    ];
  }
  
  return [
    `🧵 This week's industry intel: ${opportunity.title.substring(0, 80)}...`,
    `${opportunity.audioIntelAngle}`,
    `The unsigned advantage strikes again. More intel in our newsletter 📊`
  ];
}

export function generateLinkedInContent(opportunity: any): string {
  return `${opportunity.title}

Here's what this actually means for independent artists:

${opportunity.audioIntelAngle}

The major labels will take months to adapt to changes like this. Independent artists who move quickly always have the advantage.

That's exactly why Audio Intel exists - to give indie artists the intelligence they need to stay ahead of industry shifts.

What's your take on this development?`;
}

export function generateInstagramSlides(opportunity: any): string[] {
  return [
    opportunity.title.substring(0, 50) + '...',
    'What everyone else sees...',
    `What Audio Intel users see: ${opportunity.audioIntelAngle}`,
    'The unsigned advantage strikes again'
  ];
}

export function generateInstagramCaption(opportunity: any): string {
  return `While major labels struggle with industry changes, indies move fast and win.

${opportunity.audioIntelAngle}

That's the unsigned advantage 🔥

Link in bio for more industry intelligence that keeps you ahead.`;
}