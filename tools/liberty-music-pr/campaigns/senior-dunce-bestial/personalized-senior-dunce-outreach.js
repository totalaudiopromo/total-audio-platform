#!/usr/bin/env node

/**
 * Personalized Senior Dunce Outreach
 * Uses proven Mailchimp content for direct email outreach
 */

const fs = require('fs');
const path = require('path');

class PersonalizedSeniorDunceOutreach {
  constructor() {
    this.mailchimpDataPath = path.join(__dirname, 'all-mailchimp-campaigns.json');
    this.targetsPath = '/Users/chrisschofield/Downloads/Contacts-EVERYTHING.csv';
    this.campaignBrief = {
      artist: 'Senior Dunce',
      track: 'Bestial',
      genre: 'Experimental Electronic',
      currentPlays: 145,
      supportingStations: 7,
      warmData: [
        'BBC Radio 6 Music',
        'Capital XTRA', 
        'Radio Wigwam',
        'Amazing Radio',
        'Totally Radio',
        'Soho Radio',
        'Radio Magnetic'
      ]
    };
  }

  loadMailchimpData() {
    try {
      // Try the single campaign file first
      const singleCampaignPath = path.join(__dirname, 'senior-dunce-mailchimp-data.json');
      if (fs.existsSync(singleCampaignPath)) {
        const data = fs.readFileSync(singleCampaignPath, 'utf8');
        const campaign = JSON.parse(data);
        console.log(`📧 Using campaign: ${campaign.subject}`);
        console.log(`📊 Performance: ${campaign.openRate}% opens, ${campaign.recipients} recipients`);
        return campaign;
      }
      
      // Fallback to all campaigns file
      if (fs.existsSync(this.mailchimpDataPath)) {
        const data = fs.readFileSync(this.mailchimpDataPath, 'utf8');
        const campaigns = JSON.parse(data);
        
        const seniorDunceCampaigns = campaigns.filter(campaign => 
          campaign.subject && (
            campaign.subject.toLowerCase().includes('senior dunce') || 
            campaign.subject.toLowerCase().includes('senor dunce')
          )
        );
        
        if (seniorDunceCampaigns.length > 0) {
          const bestCampaign = seniorDunceCampaigns.reduce((best, current) => 
            current.openRate > best.openRate ? current : best
          );
          
          console.log(`📧 Using campaign: ${bestCampaign.subject}`);
          console.log(`📊 Performance: ${bestCampaign.openRate}% opens, ${bestCampaign.recipients} recipients`);
          
          return bestCampaign;
        }
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error loading Mailchimp data:', error.message);
      return null;
    }
  }

  parseCSV() {
    try {
      const csvContent = fs.readFileSync(this.targetsPath, 'utf8');
      const lines = csvContent.split('\n');
      
      const firstLine = lines[0].replace(/^\uFEFF/, '');
      const headers = firstLine.split(',');
      
      const contacts = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = this.parseCsvLine(lines[i]);
          const contact = {};
          headers.forEach((header, index) => {
            contact[header.trim()] = values[index] ? values[index].trim() : '';
          });
          contacts.push(contact);
        }
      }
      return contacts;
    } catch (error) {
      console.error('❌ Error parsing CSV:', error.message);
      return [];
    }
  }

  parseCsvLine(line) {
    const result = [];
    let inQuote = false;
    let currentField = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        result.push(currentField);
        currentField = '';
      } else {
        currentField += char;
      }
    }
    result.push(currentField);
    return result;
  }

  filterAndPrioritizeContacts(allContacts) {
    const ukRadioContacts = allContacts.filter(contact =>
      contact['Contact Type'] && contact['Contact Type'].toLowerCase().includes('radio') &&
      contact.Email && contact.Email.includes('@') &&
      (contact['Region / Country'] && contact['Region / Country'].toLowerCase().includes('uk') ||
        (contact.Station && (
          contact.Station.toLowerCase().includes('bbc') ||
          contact.Station.toLowerCase().includes('capital fm') ||
          contact.Station.toLowerCase().includes('heart') ||
          contact.Station.toLowerCase().includes('virgin radio') ||
          contact.Station.toLowerCase().includes('kiss fm') ||
          contact.Station.toLowerCase().includes('ministry of sound') ||
          contact.Station.toLowerCase().includes('soho radio') ||
          contact.Station.toLowerCase().includes('radio magnetic') ||
          contact.Station.toLowerCase().includes('amazing radio') ||
          contact.Station.toLowerCase().includes('radio wigwam') ||
          contact.Station.toLowerCase().includes('totally radio')
        ))
      ) &&
      !this.campaignBrief.warmData.some(station => contact.Station.toLowerCase().includes(station.toLowerCase()))
    );

    const targetableContacts = ukRadioContacts.filter(contact =>
      !(contact.Status && contact.Status.toLowerCase().includes('unsubscribed') &&
        !(contact['Opt-in Source'] && contact['Opt-in Source'].toLowerCase().includes('opted-in')))
    );

    return targetableContacts.map(contact => {
      let score = 0;
      let priority = 'Low';

      if (contact.Status && contact.Status.toLowerCase().includes('opted-in')) {
        score += 50;
        priority = 'Medium';
      }

      if (contact['Opt-in Source'] && contact['Opt-in Source'].toLowerCase().includes('mailchimp landing page')) {
        score += 30;
        priority = 'Medium';
      }

      if (contact.Genres && (contact.Genres.toLowerCase().includes('electronic') || contact.Genres.toLowerCase().includes('dance'))) {
        score += 20;
      }

      if (contact.Station && (
        contact.Station.toLowerCase().includes('bbc') ||
        contact.Station.toLowerCase().includes('capital fm') ||
        contact.Station.toLowerCase().includes('heart') ||
        contact.Station.toLowerCase().includes('virgin radio') ||
        contact.Station.toLowerCase().includes('kiss fm') ||
        contact.Station.toLowerCase().includes('ministry of sound')
      )) {
        score += 40;
        priority = 'High';
      }

      if (score >= 100) {
        priority = 'High';
      } else if (score >= 50) {
        priority = 'Medium';
      }

      return { ...contact, score, priority };
    }).sort((a, b) => b.score - a.score);
  }

  createPersonalizedEmail(contact, mailchimpContent) {
    const firstName = contact['First Name'] || contact.Station?.split(' ')[0] || 'there';
    const stationName = contact.Station || 'your station';
    
    // Extract key content from Mailchimp HTML (simplified)
    const subject = `Senior Dunce - Bestial | UK Electronic Track Gaining Momentum for ${stationName}`;
    
    const body = `Hi ${firstName},

Hope you're well! I'm reaching out about "Senior Dunce - Bestial," a UK experimental electronic track that's been gaining serious momentum.

🎵 **Track Details:**
- Artist: ${this.campaignBrief.artist}
- Track: ${this.campaignBrief.track}
- Genre: ${this.campaignBrief.genre}
- Duration: 3:45

📈 **Current Momentum:**
- ${this.campaignBrief.currentPlays} plays across ${this.campaignBrief.supportingStations} stations
- Supporting stations include ${this.campaignBrief.warmData.join(', ')}
- Growing from 33 plays to ${this.campaignBrief.currentPlays} plays in recent weeks

🎯 **Why This Fits ${stationName}:**
- UK-produced experimental electronic
- Perfect for specialist shows and electronic programming
- Already gaining traction on major stations
- Fresh sound with British electronic influence

I've attached the press release for your review. The track is already getting plays on BBC Radio 6 Music and Capital XTRA - perfect timing for your listeners!

Looking forward to hearing from you!

Best regards,
Chris Schofield
Liberty Music PR
chris@libertymusicpr.com

P.S. The track is available for immediate airplay and has been getting great response from listeners already supporting it.`;

    return { subject, body };
  }

  generateOutreachPlan() {
    console.log('🎵 Senior Dunce - Personalized Outreach Plan\n');
    
    const mailchimpData = this.loadMailchimpData();
    if (!mailchimpData) {
      console.log('❌ Could not load Mailchimp data');
      return;
    }
    
    const allContacts = this.parseCSV();
    const prioritizedContacts = this.filterAndPrioritizeContacts(allContacts);
    
    console.log(`📧 ${prioritizedContacts.length} UK radio contacts to target\n`);
    
    // Generate personalized emails for top 5 contacts
    const topContacts = prioritizedContacts.slice(0, 5);
    
    console.log('🎯 TOP 5 PERSONALIZED OUTREACH EMAILS:\n');
    
    topContacts.forEach((contact, i) => {
      const email = this.createPersonalizedEmail(contact, mailchimpData);
      
      console.log(`${i + 1}. ${contact.Email} - ${contact.Station}`);
      console.log(`   Priority: ${contact.priority} | Score: ${contact.score}`);
      console.log(`   Subject: ${email.subject}`);
      console.log(`   Body Preview: ${email.body.substring(0, 150)}...`);
      console.log('');
    });
    
    // Save the outreach plan
    const outreachPlan = {
      campaign: this.campaignBrief,
      mailchimpSource: {
        subject: mailchimpData.subject,
        openRate: mailchimpData.openRate,
        recipients: mailchimpData.recipients
      },
      targets: topContacts.map(contact => {
        const email = this.createPersonalizedEmail(contact, mailchimpData);
        return {
          contact: {
            email: contact.Email,
            station: contact.Station,
            firstName: contact['First Name'],
            priority: contact.priority,
            score: contact.score
          },
          email: email
        };
      }),
      generatedAt: new Date().toISOString()
    };
    
    const outputPath = path.join(__dirname, 'senior-dunce-outreach-plan.json');
    fs.writeFileSync(outputPath, JSON.stringify(outreachPlan, null, 2));
    
    console.log(`💾 Outreach plan saved to: ${outputPath}`);
    console.log('\n🎯 Ready for direct email outreach!');
    
    return outreachPlan;
  }
}

async function runPersonalizedOutreach() {
  const outreach = new PersonalizedSeniorDunceOutreach();
  return outreach.generateOutreachPlan();
}

if (require.main === module) {
  runPersonalizedOutreach().catch(console.error);
}

module.exports = { PersonalizedSeniorDunceOutreach, runPersonalizedOutreach };
