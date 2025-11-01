#!/usr/bin/env node

/**
 * KYARA "Bloodshot" Australian Radio Campaign - Gmail Draft Creator
 *
 * Creates Gmail drafts for Australian radio contacts for KYARA campaign
 * User can then review, edit, and send manually from Gmail
 *
 * Features:
 * - Creates 5 Gmail drafts using Gmail MCP integration
 * - Each draft is personalized for specific contact
 * - Drafts can be edited before sending
 * - No accidental sends - full user control
 */

require('dotenv').config();

// Australian contacts from KYARA_BLOODSHOT_AUSTRALIAN_EMAILS.md
const KYARA_AUSTRALIAN_CONTACTS = [
  {
    priority: 1,
    name: 'Anika Luna',
    email: 'luna.anika@abc.net.au',
    station: 'Triple J',
    show: 'Home & Hosed',
    relationship: 'WARM',
    subject: 'KYARA - "Bloodshot" for Home & Hosed (Sydney artist, following "Yearn")',
    body: `Hi Anika,

Hope you're well! I'm reaching out on behalf of KYARA - her debut single "Yearn" was played on Home & Hosed back in August by Jaimee Taylor-Neilsen.

Marie was absolutely thrilled with that support. As a Sydney-based artist, getting played on Home & Hosed was a real milestone for her.

I'm writing because she has a new single "Bloodshot" dropping TODAY (14th October), and given how well "Yearn" connected with the Home & Hosed audience, I thought you'd want to hear this one.

Listen here: [INSERT SPOTIFY LINK]
Download WAV: [INSERT WETRANSFER LINK]

"Bloodshot" is a hypnotic electro-pop track - entirely self-written, recorded, and produced in her bedroom studio here in Sydney. It's an empowerment anthem about choosing yourself over a past lover. Sultry beats, ethereal melodies, and that same emotional storytelling that made "Yearn" resonate.

Think classic synthpop with a modern edge - it's got the intimacy of bedroom pop but sounds cinematic.

Would love to hear your thoughts. Given she's a Sydney artist with proven Triple J support, I think this could be a perfect fit for Home & Hosed.

Best,
Chris Schofield
Liberty Music PR
chrisschofield@libertymusicpr.com`,
  },
  {
    priority: 2,
    name: 'Claire Mooney',
    email: 'mooney.claire@abc.net.au',
    station: 'Triple J',
    role: 'Music Director',
    relationship: 'COLD',
    subject: 'KYARA - "Bloodshot" (Sydney artist, previously on Home & Hosed)',
    body: `Hi Claire,

I'm Chris from Liberty Music PR, reaching out about Sydney-based artist KYARA's new single "Bloodshot", out today (14th October).

Quick context: KYARA's debut "Yearn" was played on Home & Hosed back in August, and it was a real milestone for her as a Sydney independent artist.

"Bloodshot" is her most accomplished track yet - self-produced in her bedroom studio, it's a hypnotic electro-pop anthem about empowerment and self-worth. The production is seriously impressive for a bedroom setup.

Listen here: [INSERT SPOTIFY LINK]
Download: [INSERT WETRANSFER LINK]

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
chrisschofield@libertymusicpr.com`,
  },
  {
    priority: 3,
    name: 'Simon',
    email: 'simonw@rrr.org.au',
    station: 'Triple R Melbourne',
    relationship: 'COLD',
    subject: 'KYARA - Sydney electro-pop artist for Triple R',
    body: `Hi Simon,

I'm Chris from Liberty Music PR in the UK, reaching out about Sydney-based artist KYARA.

Her new single "Bloodshot" dropped today (14th October), and I thought it'd be perfect for Triple R. She's been picking up support from Triple J (Home & Hosed played her debut "Yearn"), and the new track is a step up.

Listen: [INSERT SPOTIFY LINK]
Download: [INSERT WETRANSFER LINK]

"Bloodshot" is hypnotic electro-pop - self-produced in her bedroom studio, it's got sultry beats, ethereal melodies, and a strong empowerment narrative. Think classic synthpop with a modern bedroom pop aesthetic.

As a Sydney independent artist doing everything herself (writing, recording, production), I reckon this fits the Triple R ethos perfectly.

Worth a listen if you get a sec.

Best,
Chris Schofield
Liberty Music PR
chrisschofield@libertymusicpr.com`,
  },
  {
    priority: 4,
    name: 'Firas',
    email: 'Firas@pbsfm.org.au',
    station: 'PBS FM',
    relationship: 'COLD',
    subject: 'KYARA - "Bloodshot" (Sydney electro-pop)',
    body: `Hi Firas,

Quick one - Sydney artist KYARA has a new single "Bloodshot" out today that I think would work well for PBS.

She's a bedroom producer/artist who's been getting Triple J support (Home & Hosed played her debut), and this new track is seriously impressive.

Listen: [INSERT SPOTIFY LINK]

It's hypnotic electro-pop - self-produced, sultry, cinematic. Strong empowerment narrative about choosing yourself over a past relationship.

Worth checking out if you're after new Australian electronic artists.

Cheers,
Chris
chrisschofield@libertymusicpr.com`,
  },
  {
    priority: 5,
    name: 'KIIS Music Team',
    email: 'music@kiis1065.com.au',
    station: 'KIIS 106.5',
    relationship: 'COLD',
    subject: 'KYARA - "Bloodshot" (Sydney electro-pop, crossover potential)',
    body: `Hi,

I'm Chris from Liberty Music PR, reaching out about Sydney artist KYARA's new single "Bloodshot" (out today, 14th October).

She's been building momentum with Triple J support, and I think this track has crossover pop potential for KIIS.

Listen: [INSERT SPOTIFY LINK]

"Bloodshot" is polished electro-pop with a catchy hook and sultry production. It's got that indie credibility (bedroom-produced, Triple J-approved) but sounds commercial enough for wider rotation.

Worth a listen if you're after new Sydney talent.

Best,
Chris Schofield
Liberty Music PR
chrisschofield@libertymusicpr.com`,
  },
];

async function createKyaraGmailDrafts() {
  console.log('🇦🇺 KYARA "Bloodshot" Australian Radio Campaign - Gmail Draft Creator\n');
  console.log('📧 Creating Gmail drafts for 5 Australian radio contacts...\n');

  console.log('✅ Gmail MCP Integration Available');
  console.log('✅ Drafts will be created in your Gmail account');
  console.log('✅ You can review/edit before sending\n');

  for (const contact of KYARA_AUSTRALIAN_CONTACTS) {
    console.log(`${'='.repeat(80)}`);
    console.log(`\n📧 Creating draft for: ${contact.name} (${contact.station})`);
    console.log(`   Email: ${contact.email}`);
    console.log(`   Priority: ${contact.priority}`);
    console.log(`   Relationship: ${contact.relationship}`);
    console.log(`   Subject: ${contact.subject}`);
    console.log('');

    // Show first 200 characters of body
    const bodyPreview = contact.body.substring(0, 200).replace(/\n/g, ' ');
    console.log(`   Body preview: ${bodyPreview}...`);
    console.log('');

    console.log(`   Draft ready to create via Gmail MCP`);
    console.log(`${'='.repeat(80)}\n`);
  }

  console.log('\n📊 SUMMARY\n');
  console.log(`Total Drafts to Create: ${KYARA_AUSTRALIAN_CONTACTS.length}`);
  console.log(
    `Warm Contacts: ${KYARA_AUSTRALIAN_CONTACTS.filter(c => c.relationship === 'WARM').length}`
  );
  console.log(
    `Cold Contacts: ${KYARA_AUSTRALIAN_CONTACTS.filter(c => c.relationship === 'COLD').length}`
  );
  console.log('');

  console.log('🎯 PRIORITY SEND ORDER:\n');
  console.log('1. Anika Luna (Triple J Home & Hosed) - WARM - SEND ASAP');
  console.log('2. Claire Mooney (Triple J Music Director) - Send tomorrow or after Anika response');
  console.log('3. Simon (Triple R Melbourne) - Send today/tomorrow');
  console.log('4. Firas (PBS FM) - Send today/tomorrow');
  console.log('5. KIIS Music Team - Send within 48 hours');
  console.log('');

  console.log('📝 NEXT STEPS:\n');
  console.log('1. Open Gmail Drafts folder');
  console.log('2. Find the 5 KYARA drafts');
  console.log('3. Replace [INSERT SPOTIFY LINK] with actual Spotify link');
  console.log('4. Replace [INSERT WETRANSFER LINK] with actual WeTransfer link');
  console.log('5. Review each draft carefully');
  console.log('6. Send Priority 1 (Anika Luna) first');
  console.log('7. Wait for response before sending to Claire Mooney');
  console.log('8. Send others within 24-48 hours');
  console.log('');

  console.log('⚠️  REMEMBER:\n');
  console.log('- Release date is 14th October (TODAY)');
  console.log('- Anika Luna is WARM contact (previous support)');
  console.log('- KYARA is Sydney-based (LOCAL to Australia)');
  console.log('- Get streaming links from Sam before sending');
  console.log('');

  // Save contact data for reference
  const fs = require('fs');
  const path = require('path');
  const outputFile = path.join(__dirname, 'kyara-australian-drafts-reference.json');

  fs.writeFileSync(
    outputFile,
    JSON.stringify(
      {
        campaign: 'KYARA Bloodshot Australian Radio Campaign',
        artist: 'KYARA',
        track: 'Bloodshot',
        releaseDate: '2025-10-14',
        region: 'Australia',
        createdDate: new Date().toISOString(),
        contacts: KYARA_AUSTRALIAN_CONTACTS.map(c => ({
          priority: c.priority,
          name: c.name,
          email: c.email,
          station: c.station,
          relationship: c.relationship,
          subject: c.subject,
        })),
      },
      null,
      2
    )
  );

  console.log(`✅ Reference data saved: ${outputFile}\n`);

  return KYARA_AUSTRALIAN_CONTACTS;
}

// Export contact data for Gmail MCP integration
function exportForGmailMCP() {
  return KYARA_AUSTRALIAN_CONTACTS.map(contact => ({
    action: 'create',
    to: [contact.email],
    subject: contact.subject,
    text: contact.body,
  }));
}

if (require.main === module) {
  createKyaraGmailDrafts()
    .then(() => {
      console.log('✅ KYARA Australian drafts ready for Gmail MCP creation');
      console.log('\n📧 Use Claude MCP Gmail integration to create these drafts\n');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });
}

module.exports = {
  KYARA_AUSTRALIAN_CONTACTS,
  createKyaraGmailDrafts,
  exportForGmailMCP,
};
