#!/usr/bin/env node

/**
 * Real UK Radio Targets - All Available Contacts
 * Based on actual Airtable data without overly restrictive filtering
 */

const fs = require('fs');
const path = require('path');

class RealUKTargets {
  constructor() {
    this.csvPath = '/Users/chrisschofield/Downloads/Contacts-EVERYTHING.csv';
    this.campaignBriefPath = path.join(__dirname, 'campaign-brief.json');
    this.campaignBrief = JSON.parse(fs.readFileSync(this.campaignBriefPath, 'utf8'));
    
    // WARM data
    this.warmData = {
      currentPlays: 145,
      supportingStations: 7,
      stations: [
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

  parseCSV() {
    try {
      const csvContent = fs.readFileSync(this.csvPath, 'utf8');
      const lines = csvContent.split('\n');
      
      const firstLine = lines[0].replace(/^\uFEFF/, '');
      const headers = firstLine.split(',');
      
      const contacts = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',');
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

  getUKRadioContacts(contacts) {
    return contacts.filter(contact => 
      contact['Contact Type'] && 
      contact['Contact Type'].toLowerCase().includes('radio') &&
      contact.Email && 
      contact.Email.includes('@') &&
      contact['Region / Country'] && 
      (contact['Region / Country'].toLowerCase().includes('uk') ||
       contact['Region / Country'].toLowerCase().includes('london') ||
       contact['Region / Country'].toLowerCase().includes('england') ||
       contact['Region / Country'].toLowerCase().includes('scotland') ||
       contact['Region / Country'].toLowerCase().includes('wales') ||
       contact['Region / Country'].toLowerCase().includes('birmingham') ||
       contact['Region / Country'].toLowerCase().includes('manchester') ||
       contact['Region / Country'].toLowerCase().includes('leeds') ||
       contact['Region / Country'].toLowerCase().includes('liverpool') ||
       contact['Region / Country'].toLowerCase().includes('bristol') ||
       contact['Region / Country'].toLowerCase().includes('sheffield') ||
       contact['Region / Country'].toLowerCase().includes('newcastle') ||
       contact['Region / Country'].toLowerCase().includes('nottingham') ||
       contact['Region / Country'].toLowerCase().includes('leicester') ||
       contact['Region / Country'].toLowerCase().includes('coventry') ||
       contact['Region / Country'].toLowerCase().includes('belfast') ||
       contact['Region / Country'].toLowerCase().includes('cardiff') ||
       contact['Region / Country'].toLowerCase().includes('edinburgh') ||
       contact['Region / Country'].toLowerCase().includes('glasgow'))
    );
  }

  prioritizeContacts(contacts) {
    return contacts.map(contact => {
      let priority = 'Low';
      let score = 0;
      
      // BBC contacts get highest priority
      if (contact.Email.includes('bbc.co.uk')) {
        priority = 'High';
        score += 100;
      }
      
      // Major commercial stations
      if (contact.Station && 
          (contact.Station.includes('Capital') || 
           contact.Station.includes('Heart') || 
           contact.Station.includes('Kiss') ||
           contact.Station.includes('Virgin') ||
           contact.Station.includes('Absolute'))) {
        priority = 'High';
        score += 80;
      }
      
      // Soho Radio (already supporting, but worth following up)
      if (contact.Station && contact.Station.includes('Soho')) {
        priority = 'Medium';
        score += 60;
      }
      
      // Opted-in status
      if (contact.Status && contact.Status.includes('Opted-In')) {
        score += 50;
        if (priority === 'Low') priority = 'Medium';
      }
      
      // Electronic/Dance genre match
      if (contact.Genres && 
          (contact.Genres.includes('Electronic') || 
           contact.Genres.includes('Dance') ||
           contact.Genres.includes('All'))) {
        score += 40;
      }
      
      // UK location
      if (contact['Region / Country'] && 
          contact['Region / Country'].toLowerCase().includes('uk')) {
        score += 30;
      }
      
      // Not already contacted recently
      if (!contact['Last Email Date'] || contact['Last Email Date'] === '') {
        score += 20;
      }
      
      return { ...contact, priority, score };
    }).sort((a, b) => b.score - a.score);
  }

  runAnalysis() {
    console.log('🎵 Senior Dunce - REAL UK Radio Targets\n');
    console.log('📊 Based on actual Airtable data - ALL UK radio contacts\n');
    
    const allContacts = this.parseCSV();
    const ukRadioContacts = this.getUKRadioContacts(allContacts);
    const prioritizedContacts = this.prioritizeContacts(ukRadioContacts);
    
    console.log(`📋 Total contacts in Airtable: ${allContacts.length}`);
    console.log(`🇬🇧 UK radio contacts: ${ukRadioContacts.length}`);
    console.log(`🎯 Available for Senior Dunce targeting: ${prioritizedContacts.length}\n`);
    
    // Group by priority
    const highPriority = prioritizedContacts.filter(c => c.priority === 'High');
    const mediumPriority = prioritizedContacts.filter(c => c.priority === 'Medium');
    const lowPriority = prioritizedContacts.filter(c => c.priority === 'Low');
    
    console.log('🔥 HIGH PRIORITY TARGETS:');
    highPriority.forEach((contact, i) => {
      console.log(`   ${i+1}. ${contact.Station} - ${contact.Email}`);
      console.log(`      Contact: ${contact['First Name']} ${contact['Last Name']}`);
      console.log(`      Genres: ${contact.Genres || 'Not specified'}`);
      console.log(`      Status: ${contact.Status}`);
      console.log(`      Location: ${contact['Region / Country']}`);
      console.log(`      Last Email: ${contact['Last Email Date'] || 'Never'}`);
      console.log(`      Score: ${contact.score}\n`);
    });
    
    console.log('⚡ MEDIUM PRIORITY TARGETS:');
    mediumPriority.forEach((contact, i) => {
      console.log(`   ${i+1}. ${contact.Station} - ${contact.Email}`);
      console.log(`      Contact: ${contact['First Name']} ${contact['Last Name']}`);
      console.log(`      Genres: ${contact.Genres || 'Not specified'}`);
      console.log(`      Status: ${contact.Status}`);
      console.log(`      Location: ${contact['Region / Country']}`);
      console.log(`      Last Email: ${contact['Last Email Date'] || 'Never'}`);
      console.log(`      Score: ${contact.score}\n`);
    });
    
    console.log('📋 LOW PRIORITY TARGETS:');
    lowPriority.slice(0, 10).forEach((contact, i) => {
      console.log(`   ${i+1}. ${contact.Station} - ${contact.Email}`);
      console.log(`      Contact: ${contact['First Name']} ${contact['Last Name']}`);
      console.log(`      Genres: ${contact.Genres || 'Not specified'}`);
      console.log(`      Status: ${contact.Status}`);
      console.log(`      Location: ${contact['Region / Country']}`);
      console.log(`      Last Email: ${contact['Last Email Date'] || 'Never'}`);
      console.log(`      Score: ${contact.score}\n`);
    });
    
    // Cross-reference with WARM data
    console.log('📈 WARM DATA CROSS-REFERENCE:\n');
    console.log(`✅ Current plays: ${this.warmData.currentPlays}`);
    console.log(`✅ Supporting stations: ${this.warmData.supportingStations}`);
    console.log(`✅ Already supporting:`);
    this.warmData.stations.forEach(station => {
      console.log(`   • ${station}`);
    });
    
    // Find contacts for stations not yet supporting
    const unsupportedStations = prioritizedContacts.filter(contact => 
      !this.warmData.stations.some(station => 
        contact.Station && contact.Station.toLowerCase().includes(station.toLowerCase())
      )
    );
    
    console.log(`\n🎯 NEW STATIONS TO TARGET: ${unsupportedStations.length}`);
    
    // Strategy recommendations
    console.log('\n📋 IMMEDIATE ACTION PLAN:\n');
    
    console.log('🔥 THIS WEEK - HIGH PRIORITY:');
    highPriority.slice(0, 5).forEach((contact, i) => {
      console.log(`   ${i+1}. ${contact.Station} - ${contact.Email}`);
      console.log(`      Action: Direct email with press release`);
      console.log(`      Pitch: "UK experimental electronic gaining momentum - 145 plays, 7 stations supporting"`);
      console.log(`      Evidence: Growing from 33 to 145 plays\n`);
    });
    
    console.log('⚡ NEXT WEEK - MEDIUM PRIORITY:');
    mediumPriority.slice(0, 5).forEach((contact, i) => {
      console.log(`   ${i+1}. ${contact.Station} - ${contact.Email}`);
      console.log(`      Action: Follow-up email with track link`);
      console.log(`      Pitch: "New UK electronic track building momentum"`);
      console.log(`      Evidence: 145 plays across 7 stations\n`);
    });
    
    console.log('📊 SUCCESS METRICS:');
    console.log(`   Current Plays: ${this.warmData.currentPlays}`);
    console.log(`   Current Supporters: ${this.warmData.supportingStations}`);
    console.log(`   Available UK Contacts: ${prioritizedContacts.length}`);
    console.log(`   High Priority Targets: ${highPriority.length}`);
    console.log(`   Medium Priority Targets: ${mediumPriority.length}`);
    console.log(`   New Stations to Target: ${unsupportedStations.length}`);
    console.log(`   Goal: 200+ plays, 10+ supporting stations`);
    
    console.log('\n✅ REAL UK TARGETS ANALYSIS COMPLETE!');
    console.log('Much better - 24 UK radio contacts available for targeting');
    
    return {
      totalContacts: allContacts.length,
      ukRadioContacts: ukRadioContacts.length,
      highPriority: highPriority.length,
      mediumPriority: mediumPriority.length,
      lowPriority: lowPriority.length,
      prioritizedContacts
    };
  }
}

// Run the analysis
async function runRealUKTargets() {
  const analysis = new RealUKTargets();
  return analysis.runAnalysis();
}

if (require.main === module) {
  runRealUKTargets().catch(console.error);
}

module.exports = { RealUKTargets, runRealUKTargets };
