#!/usr/bin/env node

/**
 * Gmail Demo Mode - Zero Configuration Testing
 *
 * Simulates Gmail API responses with realistic Liberty Music PR campaign data
 * No OAuth setup required - works immediately
 */

class GmailDemoMode {
  constructor() {
    this.demoEmails = this.generateDemoEmails();
    console.log('🎭 Gmail Demo Mode Activated - No OAuth required');
  }

  generateDemoEmails() {
    return [
      {
        id: 'demo001',
        threadId: 'thread001',
        subject: 'Radio Campaign - "Midnight Echo" by Arctic Wolves',
        from: 'sarah.manager@arcticwolves.com',
        to: 'chrisschofield@libertymusicpr.com',
        cc: '',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        body: `Hi Chris,

Hope you're well! We'd like to submit our new single "Midnight Echo" for radio promotion.

Artist: Arctic Wolves
Track: "Midnight Echo"
Genre: Indie Rock
Release Date: Next Friday
Budget: £500-£1000
Target: BBC Radio 6 Music, Amazing Radio

The track has already gained traction on Spotify with 50k+ streams in the first week.

Best regards,
Sarah Johnson
Arctic Wolves Management`,
        snippet: 'Radio campaign request for "Midnight Echo" by Arctic Wolves - indie rock single',
        artistInfo: {
          email: 'sarah.manager@arcticwolves.com',
          name: 'Arctic Wolves',
          track: 'Midnight Echo',
          genre: 'Indie Rock',
          releaseDate: 'Next Friday',
          budget: '£500-£1000',
          confidence: 95
        }
      },
      {
        id: 'demo002',
        threadId: 'thread002',
        subject: 'Liberty Music PR - New Track Submission: "Digital Dreams"',
        from: 'tom.producer@neonbeats.co.uk',
        to: 'chrisschofield@libertymusicpr.com',
        cc: 'booking@neonbeats.co.uk',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        body: `Hi Chris,

Following up on our previous conversation about radio promotion opportunities.

Artist: Neon Beats
Track: "Digital Dreams"
Genre: Electronic/Synthwave
Release Date: 15th September
Budget: £750
Target: Radio 1, Kiss FM, Capital FM

We've got some great press coverage lined up and think this would be perfect for evening shows.

Thanks,
Tom Richards
Neon Beats Productions`,
        snippet: 'New track submission "Digital Dreams" by Neon Beats - electronic/synthwave',
        artistInfo: {
          email: 'tom.producer@neonbeats.co.uk',
          name: 'Neon Beats',
          track: 'Digital Dreams',
          genre: 'Electronic/Synthwave',
          releaseDate: '15th September',
          budget: '£750',
          confidence: 90
        }
      },
      {
        id: 'demo003',
        threadId: 'thread003',
        subject: 'Radio Promo Enquiry - Luna Rose - "Starlight"',
        from: 'info@lunarose-music.com',
        to: 'chrisschofield@libertymusicpr.com',
        cc: '',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        body: `Dear Chris,

We're reaching out regarding radio promotion for our artist Luna Rose.

Artist: Luna Rose
Track: "Starlight"
Genre: Dream Pop
Release Date: October 1st
Budget: £400
Target: BBC Radio 2, Absolute Radio

Luna Rose has been featured in several music blogs and we believe "Starlight" has strong commercial appeal.

Kind regards,
The Luna Rose Team`,
        snippet: 'Radio promotion enquiry for Luna Rose - "Starlight" dream pop track',
        artistInfo: {
          email: 'info@lunarose-music.com',
          name: 'Luna Rose',
          track: 'Starlight',
          genre: 'Dream Pop',
          releaseDate: 'October 1st',
          budget: '£400',
          confidence: 85
        }
      }
    ];
  }

  // Simulate Gmail API methods
  async searchCampaignEmails(query = '', maxResults = 50) {
    console.log('📧 [DEMO] Searching campaign emails...');
    console.log(`   Query: ${query || 'Default campaign search'}`);
    console.log(`   Found ${this.demoEmails.length} demo campaign emails`);

    return this.demoEmails.slice(0, maxResults);
  }

  async findCampaignEmailsWithArtists() {
    console.log('🎵 [DEMO] Finding campaign emails with artist information...');

    const emailsWithArtists = this.demoEmails.filter(email =>
      email.artistInfo &&
      (email.artistInfo.email || email.artistInfo.name || email.artistInfo.track)
    );

    console.log(`   Found ${emailsWithArtists.length} campaign emails with artist info`);
    return emailsWithArtists;
  }

  async getArtistEmailsFromCampaigns() {
    console.log('📋 [DEMO] Extracting artist emails from campaigns...');

    const campaignEmails = await this.findCampaignEmailsWithArtists();
    const artistEmails = new Set();

    campaignEmails.forEach(email => {
      if (email.artistInfo && email.artistInfo.email) {
        artistEmails.add(email.artistInfo.email);
      }
    });

    const uniqueEmails = Array.from(artistEmails);
    console.log(`   Found ${uniqueEmails.length} unique artist emails`);

    return {
      artistEmails: uniqueEmails,
      campaignEmails: campaignEmails,
      totalCampaigns: campaignEmails.length
    };
  }

  async healthCheck() {
    return {
      status: 'healthy',
      service: 'gmail-demo',
      mode: 'demo',
      timestamp: new Date().toISOString(),
      message: 'Gmail Demo Mode - No OAuth required'
    };
  }

  // Generate campaign summary
  generateCampaignSummary() {
    const summary = {
      totalCampaigns: this.demoEmails.length,
      genres: [...new Set(this.demoEmails.map(e => e.artistInfo.genre))],
      averageBudget: this.calculateAverageBudget(),
      recentSubmissions: this.demoEmails.length,
      artists: this.demoEmails.map(e => ({
        name: e.artistInfo.name,
        track: e.artistInfo.track,
        genre: e.artistInfo.genre,
        budget: e.artistInfo.budget,
        email: e.artistInfo.email
      }))
    };

    return summary;
  }

  calculateAverageBudget() {
    const budgets = this.demoEmails
      .map(e => e.artistInfo.budget)
      .map(b => {
        const match = b.match(/£(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });

    const sum = budgets.reduce((a, b) => a + b, 0);
    return `£${Math.round(sum / budgets.length)}`;
  }
}

// Test the demo mode
if (require.main === module) {
  console.log('🧪 Testing Gmail Demo Mode\n');

  const demo = new GmailDemoMode();

  (async () => {
    // Test campaign search
    const emails = await demo.searchCampaignEmails('campaign', 10);
    console.log('\n📧 Demo Campaign Emails:');
    emails.forEach(email => {
      console.log(`   ${email.artistInfo.name} - "${email.artistInfo.track}" (${email.artistInfo.genre})`);
    });

    // Test artist extraction
    const artistData = await demo.getArtistEmailsFromCampaigns();
    console.log('\n🎵 Extracted Artist Emails:');
    artistData.artistEmails.forEach(email => {
      console.log(`   ${email}`);
    });

    // Generate summary
    const summary = demo.generateCampaignSummary();
    console.log('\n📊 Campaign Summary:');
    console.log(`   Total Campaigns: ${summary.totalCampaigns}`);
    console.log(`   Genres: ${summary.genres.join(', ')}`);
    console.log(`   Average Budget: ${summary.averageBudget}`);
    console.log(`   Artists: ${summary.artists.map(a => a.name).join(', ')}`);

    console.log('\n✅ Gmail Demo Mode working perfectly!');
    console.log('🚀 Ready to integrate with Radio Promo Agent');
  })();
}

module.exports = GmailDemoMode;