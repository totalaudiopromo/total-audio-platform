#!/usr/bin/env node

/**
 * Fix Radio Targets - Filter for ACTUAL music radio contacts
 * Remove news/talk presenters and focus on music programming
 */

const fs = require('fs');
const path = require('path');

class FixedRadioTargets {
  constructor() {
    this.csvPath = '/Users/chrisschofield/Downloads/Contacts-EVERYTHING.csv';
    this.campaignBrief = {
      artist: 'Senior Dunce',
      track: 'Bestial',
      genre: 'Electronic/Experimental',
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

  isMusicRadioContact(contact) {
    const station = contact.Station ? contact.Station.toLowerCase() : '';
    const show = contact.Show ? contact.Show.toLowerCase() : '';
    const description = contact.Description ? contact.Description.toLowerCase() : '';
    const genres = contact.Genres ? contact.Genres.toLowerCase() : '';
    
    // EXCLUDE news/talk/sports stations
    const excludeKeywords = [
      'news', 'talk', 'sport', 'sports', '5 live', 'radio 4', 'radio 2', 
      'current affairs', 'politics', 'football', 'cricket', 'tennis',
      'weather', 'traffic', 'breakfast show', 'drivetime', 'newsreader'
    ];
    
    // Check if it's a news/talk station
    for (const keyword of excludeKeywords) {
      if (station.includes(keyword) || show.includes(keyword) || description.includes(keyword)) {
        return false;
      }
    }
    
    // INCLUDE music-focused stations and shows
    const musicKeywords = [
      'music', 'radio 1', 'radio 6', '6 music', 'xtra', 'capital', 'kiss',
      'heart', 'smooth', 'magic', 'radio x', 'virgin', 'absolute', 'classic fm',
      'jazz', 'rock', 'pop', 'dance', 'electronic', 'indie', 'alternative',
      'new music', 'unsigned', 'session', 'live lounge', 'chart', 'playlist',
      'dj', 'presenter', 'show', 'programme', 'broadcast'
    ];
    
    // Check if it's music-related
    for (const keyword of musicKeywords) {
      if (station.includes(keyword) || show.includes(keyword) || genres.includes(keyword)) {
        return true;
      }
    }
    
    // Include if it has music genres
    if (genres && (genres.includes('electronic') || genres.includes('dance') || 
        genres.includes('pop') || genres.includes('rock') || genres.includes('indie'))) {
      return true;
    }
    
    return false;
  }

  filterMusicRadioContacts(allContacts) {
    console.log('🎵 Filtering for ACTUAL music radio contacts...\n');
    
    const ukContacts = allContacts.filter(contact =>
      contact['Contact Type'] && contact['Contact Type'].toLowerCase().includes('radio') &&
      contact.Email && contact.Email.includes('@') &&
      (contact['Region / Country'] && contact['Region / Country'].toLowerCase().includes('uk'))
    );
    
    console.log(`📧 ${ukContacts.length} UK radio contacts found`);
    
    const musicContacts = ukContacts.filter(contact => this.isMusicRadioContact(contact));
    
    console.log(`🎵 ${musicContacts.length} music radio contacts identified`);
    
    // Exclude already supporting stations
    const newContacts = musicContacts.filter(contact =>
      !this.campaignBrief.warmData.some(station => 
        contact.Station && contact.Station.toLowerCase().includes(station.toLowerCase())
      )
    );
    
    console.log(`🆕 ${newContacts.length} new music radio contacts to target\n`);
    
    return newContacts.map(contact => {
      let score = 0;
      let priority = 'Low';
      
      // Score based on station type
      if (contact.Station) {
        const station = contact.Station.toLowerCase();
        
        // High priority for major music stations
        if (station.includes('bbc radio 1') || station.includes('bbc radio 6') || 
            station.includes('capital') || station.includes('kiss') || 
            station.includes('heart') || station.includes('virgin')) {
          score += 100;
          priority = 'High';
        }
        
        // Medium priority for other music stations
        if (station.includes('radio') && !station.includes('bbc radio 4') && 
            !station.includes('bbc radio 5')) {
          score += 50;
          priority = 'Medium';
        }
      }
      
      // Score based on genres
      if (contact.Genres) {
        const genres = contact.Genres.toLowerCase();
        if (genres.includes('electronic') || genres.includes('dance')) {
          score += 30;
        }
        if (genres.includes('indie') || genres.includes('alternative')) {
          score += 20;
        }
      }
      
      // Score based on status
      if (contact.Status && contact.Status.toLowerCase().includes('opted-in')) {
        score += 25;
      }
      
      // Adjust priority based on score
      if (score >= 100) {
        priority = 'High';
      } else if (score >= 75) {
        priority = 'Medium';
      }
      
      return { ...contact, score, priority };
    }).sort((a, b) => b.score - a.score);
  }

  runAnalysis() {
    console.log(`🎵 ${this.campaignBrief.artist} - ${this.campaignBrief.currentPlays} plays, ${this.campaignBrief.supportingStations} stations\n`);
    
    const allContacts = this.parseCSV();
    const musicContacts = this.filterMusicRadioContacts(allContacts);
    
    console.log('🎯 TOP MUSIC RADIO CONTACTS:\n');
    
    musicContacts.slice(0, 10).forEach((contact, i) => {
      console.log(`${i + 1}. ${contact.Email} - ${contact.Station}`);
      console.log(`   Show: ${contact.Show || 'N/A'}`);
      console.log(`   Genres: ${contact.Genres || 'N/A'}`);
      console.log(`   Priority: ${contact.priority} | Score: ${contact.score}`);
      console.log('');
    });
    
    console.log('🚫 EXCLUDED (News/Talk):');
    const excluded = allContacts.filter(contact => {
      const station = contact.Station ? contact.Station.toLowerCase() : '';
      return station.includes('5 live') || station.includes('radio 4') || 
             station.includes('news') || station.includes('talk');
    }).slice(0, 5);
    
    excluded.forEach(contact => {
      console.log(`   ❌ ${contact.Email} - ${contact.Station} (${contact.Show || 'N/A'})`);
    });
    
    return musicContacts;
  }
}

async function runFixedTargets() {
  const analysis = new FixedRadioTargets();
  return analysis.runAnalysis();
}

if (require.main === module) {
  runFixedTargets().catch(console.error);
}

module.exports = { FixedRadioTargets, runFixedTargets };
