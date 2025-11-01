#!/usr/bin/env node

/**
 * KYARA "Bloodshot" Australian Radio Campaign - Liberty Gmail Draft Creator
 *
 * Creates Gmail drafts in chrisschofield@libertymusicpr.com using existing OAuth credentials
 * Uses Google Gmail API with proper authentication and scopes
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// KYARA Australian contacts from KYARA_BLOODSHOT_AUSTRALIAN_EMAILS.md
const KYARA_DRAFTS = [
  {
    priority: 1,
    name: 'Anika Luna',
    to: 'luna.anika@abc.net.au',
    station: 'Triple J - Home & Hosed',
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
    to: 'mooney.claire@abc.net.au',
    station: 'Triple J - Music Director',
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
    to: 'simonw@rrr.org.au',
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
    to: 'Firas@pbsfm.org.au',
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
    to: 'music@kiis1065.com.au',
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

class KyaraGmailDraftCreator {
  constructor() {
    // Load OAuth credentials
    const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

    this.oauth2Client = new google.auth.OAuth2(
      credentials.installed.client_id,
      credentials.installed.client_secret,
      'urn:ietf:wg:oauth:2.0:oob' // Out-of-band flow - displays code on Google page
    );

    // Gmail API with compose scope for drafts
    this.SCOPES = [
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/gmail.readonly',
    ];

    this.tokenPath = path.join(__dirname, 'gmail-token.json');
  }

  /**
   * Authorize and get credentials
   */
  async authorize() {
    // Check if we have token
    if (fs.existsSync(this.tokenPath)) {
      const token = JSON.parse(fs.readFileSync(this.tokenPath, 'utf8'));
      this.oauth2Client.setCredentials(token);

      // Check if token has required scopes
      if (!token.scope || !token.scope.includes('gmail.compose')) {
        console.log('⚠️  Existing token missing required scopes');
        console.log('   Current scopes:', token.scope);
        console.log('   Required: gmail.compose');
        console.log('\n🔄 Re-authenticating with expanded scopes...\n');
        return await this.getNewToken();
      }

      console.log('✅ Using existing OAuth token');
      return this.oauth2Client;
    }

    return await this.getNewToken();
  }

  /**
   * Get new OAuth token
   */
  async getNewToken() {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
    });

    console.log('\n🔐 AUTHENTICATE WITH LIBERTY MUSIC PR GMAIL:\n');
    console.log('1. Click this URL:', authUrl);
    console.log('\n2. Sign in with: chrisschofield@libertymusicpr.com');
    console.log('3. Grant permissions');
    console.log('4. Google will display an authorization code');
    console.log('5. Copy the code and paste it below\n');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve, reject) => {
      rl.question('Enter the authorization code: ', async code => {
        rl.close();

        try {
          const { tokens } = await this.oauth2Client.getToken(code);
          this.oauth2Client.setCredentials(tokens);

          // Save token
          fs.writeFileSync(this.tokenPath, JSON.stringify(tokens, null, 2));
          console.log('\n✅ Token saved successfully!\n');

          resolve(this.oauth2Client);
        } catch (error) {
          console.error('❌ Error getting token:', error);
          reject(error);
        }
      });
    });
  }

  /**
   * Create a single Gmail draft
   */
  async createDraft(gmail, draftData) {
    const { to, subject, body } = draftData;

    // Create the email message in RFC 2822 format
    const emailLines = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      body,
    ];

    const email = emailLines.join('\r\n');
    const encodedEmail = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    try {
      const res = await gmail.users.drafts.create({
        userId: 'me',
        requestBody: {
          message: {
            raw: encodedEmail,
          },
        },
      });

      return res.data;
    } catch (error) {
      console.error(`❌ Failed to create draft for ${to}:`, error.message);
      throw error;
    }
  }

  /**
   * Create all KYARA drafts
   */
  async createAllDrafts() {
    console.log('🇦🇺 KYARA "Bloodshot" Australian Radio Campaign\n');
    console.log('📧 Creating Gmail Drafts in chrisschofield@libertymusicpr.com\n');

    try {
      // Authorize
      const auth = await this.authorize();
      const gmail = google.gmail({ version: 'v1', auth });

      console.log('🎯 Creating 5 Gmail drafts...\n');

      const results = [];

      for (const draft of KYARA_DRAFTS) {
        console.log(`${'='.repeat(80)}`);
        console.log(`\n📧 Priority ${draft.priority}: ${draft.name} (${draft.station})`);
        console.log(`   Email: ${draft.to}`);
        console.log(`   Relationship: ${draft.relationship}`);
        console.log(`   Subject: ${draft.subject}\n`);

        try {
          const result = await this.createDraft(gmail, draft);
          console.log(`✅ Draft created successfully!`);
          console.log(`   Draft ID: ${result.id}\n`);

          results.push({
            priority: draft.priority,
            name: draft.name,
            to: draft.to,
            station: draft.station,
            relationship: draft.relationship,
            draftId: result.id,
            status: 'created',
          });

          // Small delay between drafts
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.log(`❌ Failed: ${error.message}\n`);
          results.push({
            priority: draft.priority,
            name: draft.name,
            to: draft.to,
            status: 'failed',
            error: error.message,
          });
        }

        console.log(`${'='.repeat(80)}\n`);
      }

      // Summary
      const created = results.filter(r => r.status === 'created').length;
      const failed = results.filter(r => r.status === 'failed').length;

      console.log('\n📊 SUMMARY\n');
      console.log(`✅ Drafts Created: ${created}/5`);
      console.log(`❌ Failed: ${failed}/5`);
      console.log('');

      if (created > 0) {
        console.log('📋 NEXT STEPS:\n');
        console.log('1. Open Gmail: https://mail.google.com/mail/u/0/#drafts');
        console.log('2. Sign in with: chrisschofield@libertymusicpr.com');
        console.log('3. Find the 5 KYARA drafts');
        console.log('4. Replace [INSERT SPOTIFY LINK] with actual Spotify link');
        console.log('5. Replace [INSERT WETRANSFER LINK] with actual WeTransfer link');
        console.log('6. Review each draft carefully');
        console.log("7. Send Priority 1 (Anika Luna) FIRST - she's WARM");
        console.log('8. Wait for response before sending to Claire Mooney');
        console.log('9. Send others within 24-48 hours');
        console.log('');
        console.log('⚠️  REMEMBER:');
        console.log('- Release date is 14th October (TODAY)');
        console.log('- Anika Luna is WARM contact (previous support)');
        console.log('- KYARA is Sydney-based (LOCAL to Australia)');
        console.log('- Get streaming links from Sam before sending');
        console.log('');
      }

      // Save results
      const resultsFile = path.join(__dirname, 'kyara-gmail-drafts-results.json');
      fs.writeFileSync(
        resultsFile,
        JSON.stringify(
          {
            campaign: 'KYARA Bloodshot Australian Radio Campaign',
            artist: 'KYARA',
            track: 'Bloodshot',
            releaseDate: '2025-10-14',
            region: 'Australia',
            gmailAccount: 'chrisschofield@libertymusicpr.com',
            createdDate: new Date().toISOString(),
            results: results,
          },
          null,
          2
        )
      );

      console.log(`✅ Results saved: ${resultsFile}\n`);

      return results;
    } catch (error) {
      console.error('❌ Failed to create drafts:', error);
      throw error;
    }
  }
}

// Run the script
if (require.main === module) {
  const creator = new KyaraGmailDraftCreator();

  creator
    .createAllDrafts()
    .then(() => {
      console.log('✅ KYARA Gmail drafts creation complete!\n');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = KyaraGmailDraftCreator;
