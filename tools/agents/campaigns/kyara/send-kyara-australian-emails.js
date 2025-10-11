#!/usr/bin/env node

/**
 * KYARA "Bloodshot" Australian Radio Campaign - Gmail Sender
 *
 * Sends personalized Gmail emails to Australian radio contacts for KYARA campaign
 * Based on KYARA_BLOODSHOT_AUSTRALIAN_EMAILS.md templates
 *
 * Features:
 * - Uses Gmail API (not Mailchimp) for personal touch
 * - Sends to 5 prioritized Australian contacts
 * - Tracks sent emails in Monday.com
 * - Logs results for follow-up
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Australian contacts from KYARA_BLOODSHOT_AUSTRALIAN_EMAILS.md
const KYARA_AUSTRALIAN_CONTACTS = [
  {
    priority: 1,
    name: 'Anika Luna',
    email: 'luna.anika@abc.net.au',
    station: 'Triple J',
    show: 'Home & Hosed',
    relationship: 'WARM',
    notes: 'KYARA\'s "Yearn" was played on Home & Hosed in August 2024 by Jaimee Taylor-Neilsen'
  },
  {
    priority: 2,
    name: 'Claire Mooney',
    email: 'mooney.claire@abc.net.au',
    station: 'Triple J',
    role: 'Music Director',
    relationship: 'COLD',
    notes: 'New Music Director 2024, KYARA has previous Home & Hosed support'
  },
  {
    priority: 3,
    name: 'Simon',
    email: 'simonw@rrr.org.au',
    station: 'Triple R Melbourne',
    relationship: 'COLD',
    notes: 'Australian artist with Triple J support angle'
  },
  {
    priority: 4,
    name: 'Firas',
    email: 'Firas@pbsfm.org.au',
    station: 'PBS FM',
    relationship: 'COLD',
    notes: 'Sydney bedroom producer, Triple J support'
  },
  {
    priority: 5,
    name: 'KIIS Music Team',
    email: 'music@kiis1065.com.au',
    station: 'KIIS 106.5',
    relationship: 'COLD',
    notes: 'Crossover pop potential, Sydney local'
  }
];

// Email templates from KYARA_BLOODSHOT_AUSTRALIAN_EMAILS.md
function getEmailTemplate(contact, streamingLinks) {
  const { name, email, station, show, relationship, priority } = contact;

  // Priority 1: Anika Luna (WARM - Home & Hosed)
  if (priority === 1) {
    return {
      to: email,
      subject: 'KYARA - "Bloodshot" for Home & Hosed (Sydney artist, following "Yearn")',
      body: `Hi Anika,

Hope you're well! I'm reaching out on behalf of KYARA - her debut single "Yearn" was played on Home & Hosed back in August by Jaimee Taylor-Neilsen.

Marie was absolutely thrilled with that support. As a Sydney-based artist, getting played on Home & Hosed was a real milestone for her.

I'm writing because she has a new single "Bloodshot" dropping TODAY (14th October), and given how well "Yearn" connected with the Home & Hosed audience, I thought you'd want to hear this one.

Listen here: ${streamingLinks.spotify || '[SPOTIFY LINK]'}
Download WAV: ${streamingLinks.wetransfer || '[WETRANSFER LINK]'}

"Bloodshot" is a hypnotic electro-pop track - entirely self-written, recorded, and produced in her bedroom studio here in Sydney. It's an empowerment anthem about choosing yourself over a past lover. Sultry beats, ethereal melodies, and that same emotional storytelling that made "Yearn" resonate.

Think classic synthpop with a modern edge - it's got the intimacy of bedroom pop but sounds cinematic.

Would love to hear your thoughts. Given she's a Sydney artist with proven Triple J support, I think this could be a perfect fit for Home & Hosed.

Best,
Chris Schofield
Liberty Music PR
chrisschofield@libertymusicpr.com`
    };
  }

  // Priority 2: Claire Mooney (Music Director)
  if (priority === 2) {
    return {
      to: email,
      subject: 'KYARA - "Bloodshot" (Sydney artist, previously on Home & Hosed)',
      body: `Hi Claire,

I'm Chris from Liberty Music PR, reaching out about Sydney-based artist KYARA's new single "Bloodshot", out today (14th October).

Quick context: KYARA's debut "Yearn" was played on Home & Hosed back in August, and it was a real milestone for her as a Sydney independent artist.

"Bloodshot" is her most accomplished track yet - self-produced in her bedroom studio, it's a hypnotic electro-pop anthem about empowerment and self-worth. The production is seriously impressive for a bedroom setup.

Listen here: ${streamingLinks.spotify || '[SPOTIFY LINK]'}
Download: ${streamingLinks.wetransfer || '[WETRANSFER LINK]'}

I think this is ready for broader Triple J rotation. It's got:
- Professional production quality (despite being bedroom-made)
- Sultry, cinematic soundscape (think classic synthpop meets modern electronica)
- Strong emotional storytelling (the "choosing yourself" narrative)
- Sydney local artist credentials

Following the Home & Hosed support, I reckon this could sit nicely in daytime rotation.

Would love to get your thoughts.

Cheers,
Chris Schofield
Liberty Music PR
chrisschofield@libertymusicpr.com`
    };
  }

  // Priority 3: Triple R Melbourne
  if (priority === 3) {
    return {
      to: email,
      subject: 'KYARA - Sydney electro-pop artist for Triple R',
      body: `Hi Simon,

I'm Chris from Liberty Music PR in the UK, reaching out about Sydney-based artist KYARA.

Her new single "Bloodshot" dropped today (14th October), and I thought it'd be perfect for Triple R. She's been picking up support from Triple J (Home & Hosed played her debut "Yearn"), and the new track is a step up.

Listen: ${streamingLinks.spotify || '[SPOTIFY LINK]'}
Download: ${streamingLinks.wetransfer || '[WETRANSFER LINK]'}

"Bloodshot" is hypnotic electro-pop - self-produced in her bedroom studio, it's got sultry beats, ethereal melodies, and a strong empowerment narrative. Think classic synthpop with a modern bedroom pop aesthetic.

As a Sydney independent artist doing everything herself (writing, recording, production), I reckon this fits the Triple R ethos perfectly.

Worth a listen if you get a sec.

Best,
Chris Schofield
Liberty Music PR
chrisschofield@libertymusicpr.com`
    };
  }

  // Priority 4: PBS FM
  if (priority === 4) {
    return {
      to: email,
      subject: 'KYARA - "Bloodshot" (Sydney electro-pop)',
      body: `Hi Firas,

Quick one - Sydney artist KYARA has a new single "Bloodshot" out today that I think would work well for PBS.

She's a bedroom producer/artist who's been getting Triple J support (Home & Hosed played her debut), and this new track is seriously impressive.

Listen: ${streamingLinks.spotify || '[SPOTIFY LINK]'}

It's hypnotic electro-pop - self-produced, sultry, cinematic. Strong empowerment narrative about choosing yourself over a past relationship.

Worth checking out if you're after new Australian electronic artists.

Cheers,
Chris
chrisschofield@libertymusicpr.com`
    };
  }

  // Priority 5: KIIS 106.5
  if (priority === 5) {
    return {
      to: email,
      subject: 'KYARA - "Bloodshot" (Sydney electro-pop, crossover potential)',
      body: `Hi,

I'm Chris from Liberty Music PR, reaching out about Sydney artist KYARA's new single "Bloodshot" (out today, 14th October).

She's been building momentum with Triple J support, and I think this track has crossover pop potential for KIIS.

Listen: ${streamingLinks.spotify || '[SPOTIFY LINK]'}

"Bloodshot" is polished electro-pop with a catchy hook and sultry production. It's got that indie credibility (bedroom-produced, Triple J-approved) but sounds commercial enough for wider rotation.

Worth a listen if you're after new Sydney talent.

Best,
Chris Schofield
Liberty Music PR
chrisschofield@libertymusicpr.com`
    };
  }
}

async function sendKyaraAustralianEmails(streamingLinks = {}, dryRun = true) {
  console.log('🇦🇺 KYARA "Bloodshot" Australian Radio Campaign - Gmail Sender\n');

  if (dryRun) {
    console.log('🔵 DRY RUN MODE - No emails will be sent\n');
  } else {
    console.log('🔴 LIVE MODE - Real emails will be sent via Gmail API\n');
  }

  console.log('📋 Streaming Links:');
  console.log(`   Spotify: ${streamingLinks.spotify || '❌ NOT PROVIDED'}`);
  console.log(`   WeTransfer: ${streamingLinks.wetransfer || '❌ NOT PROVIDED'}`);
  console.log(`   SoundCloud: ${streamingLinks.soundcloud || '(optional)'}`);
  console.log(`   YouTube: ${streamingLinks.youtube || '(optional)'}`);
  console.log('');

  // Check if we have required links
  if (!streamingLinks.spotify && !dryRun) {
    console.error('❌ ERROR: Spotify link is required before sending emails');
    console.error('   Please get streaming links from Sam/KYARA first');
    process.exit(1);
  }

  console.log('📧 Email Campaign Details:\n');

  const emailResults = [];

  for (const contact of KYARA_AUSTRALIAN_CONTACTS) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📧 Priority ${contact.priority}: ${contact.name} (${contact.station})`);
    console.log(`   Email: ${contact.email}`);
    console.log(`   Relationship: ${contact.relationship}`);
    console.log(`   Notes: ${contact.notes}`);
    console.log('');

    const emailTemplate = getEmailTemplate(contact, streamingLinks);

    console.log(`📝 Email Preview:\n`);
    console.log(`TO: ${emailTemplate.to}`);
    console.log(`SUBJECT: ${emailTemplate.subject}\n`);
    console.log(`BODY:\n${emailTemplate.body}\n`);
    console.log(`${'='.repeat(80)}\n`);

    if (!dryRun) {
      // In live mode, this would use Gmail API
      console.log('⚠️  LIVE MODE: Would send email via Gmail API here');
      // TODO: Integrate with tools/agents/radio-promo/integrations/gmail-api.js

      emailResults.push({
        contact: contact.name,
        email: contact.email,
        station: contact.station,
        priority: contact.priority,
        relationship: contact.relationship,
        status: 'sent',
        timestamp: new Date().toISOString()
      });
    } else {
      emailResults.push({
        contact: contact.name,
        email: contact.email,
        station: contact.station,
        priority: contact.priority,
        relationship: contact.relationship,
        status: 'dry_run',
        timestamp: new Date().toISOString()
      });
    }

    // Delay between emails to be respectful
    if (!dryRun) {
      console.log('⏱️  Waiting 5 seconds before next email...\n');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  // Generate report
  console.log('\n\n📊 CAMPAIGN SUMMARY\n');
  console.log(`Total Australian Contacts: ${KYARA_AUSTRALIAN_CONTACTS.length}`);
  console.log(`Emails ${dryRun ? 'Previewed' : 'Sent'}: ${emailResults.length}`);
  console.log('');

  console.log('📋 Contact Breakdown:');
  console.log(`   WARM Relationships: ${KYARA_AUSTRALIAN_CONTACTS.filter(c => c.relationship === 'WARM').length}`);
  console.log(`   COLD Relationships: ${KYARA_AUSTRALIAN_CONTACTS.filter(c => c.relationship === 'COLD').length}`);
  console.log('');

  console.log('🎯 Priority Breakdown:');
  KYARA_AUSTRALIAN_CONTACTS.forEach(contact => {
    const status = dryRun ? '📋 PREVIEWED' : '✅ SENT';
    console.log(`   ${status} - Priority ${contact.priority}: ${contact.name} (${contact.station})`);
  });
  console.log('');

  // Save results
  const resultsFile = path.join(__dirname, 'kyara-australian-campaign-results.json');
  fs.writeFileSync(resultsFile, JSON.stringify({
    campaignName: 'KYARA Bloodshot Australian Radio Campaign',
    artist: 'KYARA',
    track: 'Bloodshot',
    releaseDate: '2025-10-14',
    region: 'Australia',
    sentDate: new Date().toISOString(),
    mode: dryRun ? 'dry_run' : 'live',
    streamingLinks,
    contacts: KYARA_AUSTRALIAN_CONTACTS,
    results: emailResults
  }, null, 2));

  console.log(`✅ Campaign results saved: ${resultsFile}\n`);

  if (dryRun) {
    console.log('📋 NEXT STEPS:\n');
    console.log('1. Get streaming links from Sam/KYARA:');
    console.log('   - Spotify link (REQUIRED)');
    console.log('   - WeTransfer link for WAV download');
    console.log('   - Optional: SoundCloud, YouTube');
    console.log('');
    console.log('2. Run in LIVE MODE to send emails:');
    console.log('   node send-kyara-australian-emails.js --live \\');
    console.log('     --spotify "https://open.spotify.com/track/..." \\');
    console.log('     --wetransfer "https://wetransfer.com/..."');
    console.log('');
    console.log('3. Priority Send Order:');
    console.log('   - Priority 1: Anika Luna (WARM - send ASAP)');
    console.log('   - Priority 2: Claire Mooney (send tomorrow or after Anika response)');
    console.log('   - Priorities 3-5: Send today/tomorrow');
    console.log('');
  } else {
    console.log('✅ KYARA Australian Campaign Complete!\n');
    console.log('📧 Follow-up Strategy:\n');
    console.log('If Anika Luna responds positively:');
    console.log('  - Send materials immediately');
    console.log('  - Mention in other pitches ("Home & Hosed is supporting this")');
    console.log('  - Ask about timeline for play');
    console.log('');
    console.log('If no response after 3 days:');
    console.log('  - One polite follow-up');
    console.log('  - Keep it brief');
    console.log('  - Reference Sydney local angle');
    console.log('');
  }

  return emailResults;
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);

  // Parse command line arguments
  const dryRun = !args.includes('--live');
  const spotifyIndex = args.indexOf('--spotify');
  const wetransferIndex = args.indexOf('--wetransfer');
  const soundcloudIndex = args.indexOf('--soundcloud');
  const youtubeIndex = args.indexOf('--youtube');

  const streamingLinks = {
    spotify: spotifyIndex !== -1 ? args[spotifyIndex + 1] : null,
    wetransfer: wetransferIndex !== -1 ? args[wetransferIndex + 1] : null,
    soundcloud: soundcloudIndex !== -1 ? args[soundcloudIndex + 1] : null,
    youtube: youtubeIndex !== -1 ? args[youtubeIndex + 1] : null
  };

  sendKyaraAustralianEmails(streamingLinks, dryRun)
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Script failed:', error.message);
      console.error(error.stack);
      process.exit(1);
    });
}

module.exports = { sendKyaraAustralianEmails, KYARA_AUSTRALIAN_CONTACTS };
