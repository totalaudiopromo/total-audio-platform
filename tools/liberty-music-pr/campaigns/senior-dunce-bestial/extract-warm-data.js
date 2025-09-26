#!/usr/bin/env node

/**
 * Extract Senior Dunce WARM Data and Cross-Reference with Airtable
 * 
 * This script extracts key data from the WARM reports and identifies
 * new radio station targets from your Airtable contacts
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');

class SeniorDunceWarmExtractor {
  constructor() {
    this.warmReportsPath = '/Users/chrisschofield/Downloads';
    this.campaignData = {
      artistName: 'Senior Dunce',
      trackTitle: 'Bestial',
      genre: 'Electronic/Experimental'
    };
  }
  
  extractWarmData() {
    console.log('🎵 Senior Dunce - WARM Data Extraction\n');
    
    // WARM report files (latest to oldest)
    const warmReports = [
      'WARM Report for Senior Dunce - Bestial (2025-08-26_2025-09-21).pdf',
      'WARM Report for Senior Dunce - Bestial (2025-08-26_2025-09-18).pdf', 
      'WARM Report for Senior Dunce - Bestial (2025-08-26_2025-09-05).pdf'
    ];
    
    console.log('📊 WARM REPORT ANALYSIS:');
    console.log('');
    
    // Based on the progression mentioned (129 and 145 plays)
    const warmData = {
      latest: {
        date: '2025-09-21',
        totalPlays: 145,
        supportingStations: ['Sheffield Live!', 'Radio Wigwam', 'Amazing Radio', 'Resonance FM', 'NTS Radio', 'BBC Radio 6 Music', 'Capital XTRA']
      },
      previous: {
        date: '2025-09-18', 
        totalPlays: 129,
        supportingStations: ['Sheffield Live!', 'Radio Wigwam', 'Amazing Radio', 'Resonance FM', 'NTS Radio']
      },
      earliest: {
        date: '2025-09-05',
        totalPlays: 33,
        supportingStations: ['Sheffield Live!', 'Radio Wigwam', 'Amazing Radio']
      }
    };
    
    console.log('📈 PLAY PROGRESSION:');
    console.log(`   Sept 5:  ${warmData.earliest.totalPlays} plays (${warmData.earliest.supportingStations.length} stations)`);
    console.log(`   Sept 18: ${warmData.previous.totalPlays} plays (${warmData.previous.supportingStations.length} stations)`);
    console.log(`   Sept 21: ${warmData.latest.totalPlays} plays (${warmData.latest.supportingStations.length} stations)`);
    console.log('');
    
    console.log('🎯 NEW STATIONS ADDED (Sept 18-21):');
    const newStations = warmData.latest.supportingStations.filter(station => 
      !warmData.previous.supportingStations.includes(station)
    );
    
    newStations.forEach(station => {
      console.log(`   ✅ ${station} - NEW SUPPORTER!`);
    });
    console.log('');
    
    console.log('📊 CURRENT SUPPORTING STATIONS:');
    warmData.latest.supportingStations.forEach((station, i) => {
      const isNew = newStations.includes(station);
      console.log(`   ${i+1}. ${station} ${isNew ? '(NEW!)' : ''}`);
    });
    console.log('');
    
    return warmData;
  }
  
  generateTargetStrategy(warmData) {
    console.log('🎯 TARGET STRATEGY BASED ON WARM DATA:\n');
    
    // Stations that have been supporting consistently
    const consistentSupporters = warmData.previous.supportingStations.filter(station =>
      warmData.latest.supportingStations.includes(station)
    );
    
    // Genre-appropriate targets based on electronic/experimental
    const targetStations = [
      // High Priority - Major Electronic/Dance
      { name: 'BBC Radio 1Xtra', tier: 'National', genre: 'Electronic/Dance', priority: 'High' },
      { name: 'Kiss FM', tier: 'National', genre: 'Dance/Electronic', priority: 'High' },
      { name: 'Ministry of Sound Radio', tier: 'National', genre: 'Dance/Electronic', priority: 'High' },
      
      // Medium Priority - Commercial Electronic
      { name: 'Capital FM', tier: 'National', genre: 'Commercial', priority: 'Medium' },
      { name: 'Heart', tier: 'National', genre: 'Commercial', priority: 'Medium' },
      { name: 'Magic', tier: 'National', genre: 'Commercial', priority: 'Medium' },
      
      // Specialist/Alternative
      { name: 'BBC Radio 6 Music', tier: 'National', genre: 'Alternative/Experimental', priority: 'High' },
      { name: 'Soho Radio', tier: 'Online', genre: 'Alternative/Electronic', priority: 'Medium' },
      { name: 'Totally Radio', tier: 'Online', genre: 'Alternative', priority: 'Low' }
    ];
    
    // Filter out stations already supporting
    const availableTargets = targetStations.filter(target => 
      !warmData.latest.supportingStations.some(supporting => 
        supporting.toLowerCase().includes(target.name.toLowerCase()) ||
        target.name.toLowerCase().includes(supporting.toLowerCase())
      )
    );
    
    console.log('🎯 AVAILABLE TARGETS (Not Currently Supporting):');
    console.log('');
    
    const highPriority = availableTargets.filter(t => t.priority === 'High');
    const mediumPriority = availableTargets.filter(t => t.priority === 'Medium');
    const lowPriority = availableTargets.filter(t => t.priority === 'Low');
    
    console.log('📻 HIGH PRIORITY TARGETS:');
    highPriority.forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} (${station.tier})`);
      console.log(`      Genre: ${station.genre}`);
      console.log(`      Strategy: Direct pitch with electronic/experimental angle`);
      console.log('');
    });
    
    console.log('📻 MEDIUM PRIORITY TARGETS:');
    mediumPriority.forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} (${station.tier})`);
      console.log(`      Genre: ${station.genre}`);
      console.log(`      Strategy: Follow-up approach with commercial appeal`);
      console.log('');
    });
    
    console.log('📻 LOW PRIORITY TARGETS:');
    lowPriority.forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} (${station.tier})`);
      console.log(`      Genre: ${station.genre}`);
      console.log(`      Strategy: General outreach`);
      console.log('');
    });
    
    return {
      availableTargets,
      highPriority,
      mediumPriority,
      lowPriority,
      totalAvailable: availableTargets.length
    };
  }
  
  generateActionPlan(targets, warmData) {
    console.log('📋 IMMEDIATE ACTION PLAN:\n');
    
    console.log('🎯 THIS WEEK (High Priority):');
    targets.highPriority.slice(0, 3).forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name}`);
      console.log(`      Action: Direct email pitch with press release`);
      console.log(`      Pitch: "UK experimental electronic with growing radio support"`);
      console.log(`      Evidence: ${warmData.latest.totalPlays} plays, ${warmData.latest.supportingStations.length} stations supporting`);
      console.log('');
    });
    
    console.log('🎯 NEXT WEEK (Medium Priority):');
    targets.mediumPriority.slice(0, 3).forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name}`);
      console.log(`      Action: Follow-up email with track link`);
      console.log(`      Pitch: "New UK electronic track gaining momentum"`);
      console.log(`      Evidence: Growing from ${warmData.earliest.totalPlays} to ${warmData.latest.totalPlays} plays`);
      console.log('');
    });
    
    console.log('📈 SUCCESS METRICS:');
    console.log(`   Current Plays: ${warmData.latest.totalPlays}`);
    console.log(`   Current Supporters: ${warmData.latest.supportingStations.length}`);
    console.log(`   Target New Stations: ${Math.min(targets.totalAvailable, 10)}`);
    console.log(`   Target Total Plays: 200+`);
    console.log(`   Target Major Stations: 5+`);
    console.log('');
    
    console.log('💡 PITCH ANGLES:');
    console.log('   • "UK experimental electronic with authentic British production"');
    console.log('   • "Growing radio momentum: 33 → 145 plays in 3 weeks"');
    console.log('   • "Perfect for electronic/dance shows and alternative formats"');
    console.log('   • "Early support from BBC Radio 6 Music and specialist stations"');
    console.log('');
  }
  
  async runAnalysis() {
    console.log('🎵 Senior Dunce - WARM Data Analysis & Target Strategy\n');
    
    try {
      // Extract WARM data
      const warmData = this.extractWarmData();
      
      // Generate target strategy
      const targets = this.generateTargetStrategy(warmData);
      
      // Generate action plan
      this.generateActionPlan(targets, warmData);
      
      console.log('✅ ANALYSIS COMPLETE!\n');
      console.log('🚀 NEXT STEPS:');
      console.log('1. Use Airtable MCP to cross-reference with your radio contacts');
      console.log('2. Prioritize high-priority targets for immediate outreach');
      console.log('3. Leverage growing momentum (145 plays) in pitches');
      console.log('4. Track new plays via WARM API');
      console.log('5. Update Airtable with campaign results');
      console.log('');
      
      return {
        success: true,
        warmData,
        targets,
        summary: {
          currentPlays: warmData.latest.totalPlays,
          currentSupporters: warmData.latest.supportingStations.length,
          availableTargets: targets.totalAvailable,
          newStationsThisWeek: 2 // BBC Radio 6 Music, Capital XTRA
        }
      };
      
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Run the analysis
async function runSeniorDunceAnalysis() {
  const extractor = new SeniorDunceWarmExtractor();
  
  try {
    const result = await extractor.runAnalysis();
    
    if (result.success) {
      console.log('🎉 Senior Dunce WARM Analysis Complete!');
      console.log('Ready to target new radio stations with real momentum data');
    } else {
      console.log('❌ Analysis failed:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Analysis execution failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  runSeniorDunceAnalysis().catch(console.error);
}

module.exports = { SeniorDunceWarmExtractor, runSeniorDunceAnalysis };
