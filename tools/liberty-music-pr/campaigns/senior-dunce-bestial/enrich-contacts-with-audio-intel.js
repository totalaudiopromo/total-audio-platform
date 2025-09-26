#!/usr/bin/env node

/**
 * Enrich All Contacts Using Audio Intel
 * Uses your own Audio Intel product to build a proper internal database
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

class AudioIntelContactEnrichment {
  constructor() {
    this.csvPath = '/Users/chrisschofield/Downloads/Contacts-EVERYTHING.csv';
    this.audioIntelApiUrl = 'http://localhost:3000/api/enrich'; // Audio Intel local dev
    this.enrichedDataPath = path.join(__dirname, 'enriched-contacts-database.json');
    this.campaignBrief = {
      artist: 'Senior Dunce',
      track: 'Bestial',
      genre: 'Electronic/Experimental',
      currentPlays: 145,
      supportingStations: 7
    };
  }

  parseCSV() {
    try {
      const csvContent = fs.readFileSync(this.csvPath, 'utf8');
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

  async callAudioIntelAPI(contacts) {
    console.log('🤖 Calling Audio Intel API for contact enrichment...\n');
    
    try {
      const response = await axios.post(this.audioIntelApiUrl, {
        contacts: contacts.map(contact => ({
          name: `${contact['First Name'] || ''} ${contact['Last Name'] || ''}`.trim(),
          email: contact.Email || '',
          station: contact.Station || '',
          show: contact.Show || '',
          genres: contact.Genres || ''
        }))
      }, {
        timeout: 120000, // 2 minute timeout for large batches
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        console.log(`✅ Audio Intel enriched ${response.data.enriched.length} contacts`);
        return response.data.enriched;
      } else {
        console.error('❌ Audio Intel API error:', response.data.error);
        return null;
      }
    } catch (error) {
      console.error('❌ Audio Intel API call failed:', error.message);
      
      if (error.code === 'ECONNREFUSED') {
        console.log('\n💡 Audio Intel not running. Start it with:');
        console.log('   cd apps/audio-intel && npm run dev');
        return null;
      }
      
      return null;
    }
  }

  categorizeEnrichedContacts(enrichedContacts) {
    console.log('\n📊 Categorizing enriched contacts...\n');
    
    const categories = {
      radio: {
        music: [],
        news: [],
        other: []
      },
      blogs: [],
      playlists: [],
      labels: [],
      other: []
    };
    
    enrichedContacts.forEach(contact => {
      const intelligence = contact.intelligence || '';
      const station = contact.station || '';
      const email = contact.email || '';
      
      // Categorize based on Audio Intel analysis
      if (intelligence.toLowerCase().includes('radio') || station.toLowerCase().includes('radio')) {
        if (intelligence.toLowerCase().includes('music') || 
            intelligence.toLowerCase().includes('dj') ||
            intelligence.toLowerCase().includes('playlist')) {
          categories.radio.music.push(contact);
        } else if (intelligence.toLowerCase().includes('news') || 
                   intelligence.toLowerCase().includes('talk') ||
                   intelligence.toLowerCase().includes('5 live')) {
          categories.radio.news.push(contact);
        } else {
          categories.radio.other.push(contact);
        }
      } else if (intelligence.toLowerCase().includes('blog') || 
                 intelligence.toLowerCase().includes('website') ||
                 intelligence.toLowerCase().includes('review')) {
        categories.blogs.push(contact);
      } else if (intelligence.toLowerCase().includes('playlist') || 
                 intelligence.toLowerCase().includes('spotify') ||
                 intelligence.toLowerCase().includes('curator')) {
        categories.playlists.push(contact);
      } else if (intelligence.toLowerCase().includes('label') || 
                 intelligence.toLowerCase().includes('record')) {
        categories.labels.push(contact);
      } else {
        categories.other.push(contact);
      }
    });
    
    // Display summary
    console.log('📈 CONTACT CATEGORIZATION:');
    console.log(`🎵 Music Radio: ${categories.radio.music.length}`);
    console.log(`📰 News/Talk Radio: ${categories.radio.news.length}`);
    console.log(`📻 Other Radio: ${categories.radio.other.length}`);
    console.log(`📝 Music Blogs: ${categories.blogs.length}`);
    console.log(`🎧 Playlists: ${categories.playlists.length}`);
    console.log(`🏷️ Labels: ${categories.labels.length}`);
    console.log(`❓ Other: ${categories.other.length}`);
    
    return categories;
  }

  filterMusicRadioContacts(categories) {
    console.log('\n🎯 FILTERING FOR MUSIC RADIO CONTACTS:\n');
    
    const musicRadioContacts = categories.radio.music.filter(contact => {
      const intelligence = contact.intelligence || '';
      const email = contact.email || '';
      
      // Exclude news/talk even if categorized as radio
      if (intelligence.toLowerCase().includes('news') || 
          intelligence.toLowerCase().includes('talk') ||
          intelligence.toLowerCase().includes('sport') ||
          email.includes('5live') || email.includes('radio4')) {
        return false;
      }
      
      // Include if it's clearly music-focused
      return intelligence.toLowerCase().includes('music') || 
             intelligence.toLowerCase().includes('dj') ||
             intelligence.toLowerCase().includes('playlist') ||
             intelligence.toLowerCase().includes('chart');
    });
    
    console.log(`✅ ${musicRadioContacts.length} legitimate music radio contacts identified\n`);
    
    // Score and prioritize
    return musicRadioContacts.map(contact => {
      let score = 0;
      let priority = 'Low';
      
      const intelligence = contact.intelligence || '';
      const email = contact.email || '';
      
      // High priority for major stations
      if (email.includes('@bbc.') && intelligence.toLowerCase().includes('radio 1')) {
        score += 100;
        priority = 'High';
      } else if (email.includes('@bbc.') && intelligence.toLowerCase().includes('radio 6')) {
        score += 90;
        priority = 'High';
      } else if (email.includes('@capital') || email.includes('@kiss') || 
                 email.includes('@heart') || email.includes('@virgin')) {
        score += 80;
        priority = 'High';
      }
      
      // Medium priority for other music radio
      if (intelligence.toLowerCase().includes('music') && 
          intelligence.toLowerCase().includes('radio')) {
        score += 50;
        priority = 'Medium';
      }
      
      // Genre matching
      if (intelligence.toLowerCase().includes('electronic') || 
          intelligence.toLowerCase().includes('dance')) {
        score += 30;
      }
      
      // Adjust priority based on score
      if (score >= 80) {
        priority = 'High';
      } else if (score >= 50) {
        priority = 'Medium';
      }
      
      return { ...contact, score, priority };
    }).sort((a, b) => b.score - a.score);
  }

  async runEnrichment() {
    console.log('🎵 Audio Intel Contact Enrichment for Senior Dunce Campaign\n');
    
    // Load contacts
    const allContacts = this.parseCSV();
    console.log(`📧 Loaded ${allContacts.length} contacts from CSV\n`);
    
    // Filter for contacts with emails
    const contactsWithEmails = allContacts.filter(contact => 
      contact.Email && contact.Email.includes('@')
    );
    
    console.log(`📧 ${contactsWithEmails.length} contacts have email addresses\n`);
    
    // Call Audio Intel API
    const enrichedContacts = await this.callAudioIntelAPI(contactsWithEmails);
    
    if (!enrichedContacts) {
      console.log('❌ Enrichment failed. Please start Audio Intel first.');
      return;
    }
    
    // Categorize contacts
    const categories = this.categorizeEnrichedContacts(enrichedContacts);
    
    // Filter for music radio
    const musicRadioContacts = this.filterMusicRadioContacts(categories);
    
    // Save enriched database
    const enrichedDatabase = {
      campaign: this.campaignBrief,
      enrichedAt: new Date().toISOString(),
      totalContacts: allContacts.length,
      contactsWithEmails: contactsWithEmails.length,
      enrichedContacts: enrichedContacts.length,
      categories: categories,
      musicRadioContacts: musicRadioContacts,
      topTargets: musicRadioContacts.slice(0, 10)
    };
    
    fs.writeFileSync(this.enrichedDataPath, JSON.stringify(enrichedDatabase, null, 2));
    
    console.log('\n🎯 TOP MUSIC RADIO TARGETS:');
    musicRadioContacts.slice(0, 5).forEach((contact, i) => {
      console.log(`\n${i + 1}. ${contact.email} - ${contact.station || 'Unknown Station'}`);
      console.log(`   Priority: ${contact.priority} | Score: ${contact.score}`);
      console.log(`   Intelligence: ${contact.intelligence?.substring(0, 100)}...`);
    });
    
    console.log(`\n💾 Enriched database saved to: ${this.enrichedDataPath}`);
    console.log('\n🎯 Ready for confident outreach with enriched data!');
    
    return enrichedDatabase;
  }
}

async function runAudioIntelEnrichment() {
  const enrichment = new AudioIntelContactEnrichment();
  return await enrichment.runEnrichment();
}

if (require.main === module) {
  runAudioIntelEnrichment().catch(console.error);
}

module.exports = { AudioIntelContactEnrichment, runAudioIntelEnrichment };
