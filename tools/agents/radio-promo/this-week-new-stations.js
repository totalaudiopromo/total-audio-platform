#!/usr/bin/env node

/**
 * This Week: New Radio Station Outreach for Senior Dunce
 *
 * Focus on getting new stations on board this week
 * Based on Phase 2 of our strategy
 */

require('dotenv').config();

class ThisWeekNewStations {
  constructor() {
    this.newTargets = [
      {
        name: 'BBC Radio 6 Music',
        email: '6music@bbc.co.uk',
        type: 'National',
        priority: 'high',
        action: 'new_submission',
        notes: 'BBC Introducing submission required + direct pitch',
        deadline: 'Monday',
      },
      {
        name: 'Amazing Radio',
        email: 'music@amazingradio.com',
        type: 'Online',
        priority: 'high',
        action: 'new_submission',
        notes: 'Direct submission via website + email pitch',
        deadline: 'Tuesday',
      },
      {
        name: 'Radio Wigwam',
        email: 'music@radiowigwam.com',
        type: 'Community',
        priority: 'high',
        action: 'new_submission',
        notes: 'Direct email pitch with press release',
        deadline: 'Wednesday',
      },
      {
        name: 'Resonance FM',
        email: 'programming@resonancefm.com',
        type: 'Community',
        priority: 'medium',
        action: 'new_submission',
        notes: 'Experimental format - perfect fit',
        deadline: 'Wednesday',
      },
      {
        name: 'NTS Radio',
        email: 'submissions@nts.live',
        type: 'Online',
        priority: 'medium',
        action: 'new_submission',
        notes: 'Direct pitch to relevant shows',
        deadline: 'Thursday',
      },
      {
        name: 'Soho Radio',
        email: 'music@sohoradio.com',
        type: 'Online',
        priority: 'medium',
        action: 'new_submission',
        notes: 'Fresh electronic sound angle',
        deadline: 'Thursday',
      },
      {
        name: 'Totally Radio',
        email: 'submissions@totallyradio.com',
        type: 'Online',
        priority: 'low',
        action: 'new_submission',
        notes: 'Alternative shows focus',
        deadline: 'Friday',
      },
      {
        name: 'Radio Reverb',
        email: 'music@radioreverb.com',
        type: 'Community',
        priority: 'low',
        action: 'new_submission',
        notes: 'UK experimental track angle',
        deadline: 'Friday',
      },
    ];
  }

  generateWeekPlan() {
    console.log('🎵 THIS WEEK: New Radio Station Outreach for Senior Dunce\n');

    console.log('📊 WEEKLY TARGETS:');
    console.log(`   Total New Stations: ${this.newTargets.length}`);
    console.log('   High Priority: 3 stations');
    console.log('   Medium Priority: 3 stations');
    console.log('   Low Priority: 2 stations');
    console.log('');

    console.log('📅 DAILY ACTION PLAN:\n');

    // Monday - BBC Radio 6 Music
    console.log('MONDAY - BBC Radio 6 Music:');
    console.log('   🎯 Priority: HIGH');
    console.log('   📧 Action: BBC Introducing submission + direct pitch');
    console.log('   📝 Notes: Register Senior Dunce, upload "Bestial", pitch to 6 Music');
    console.log('   ⏰ Deadline: End of day');
    console.log('');

    // Tuesday - Amazing Radio
    console.log('TUESDAY - Amazing Radio:');
    console.log('   🎯 Priority: HIGH');
    console.log('   📧 Action: Website submission + email pitch');
    console.log('   📝 Notes: Perfect for indie electronic shows');
    console.log('   ⏰ Deadline: End of day');
    console.log('');

    // Wednesday - Radio Wigwam + Resonance FM
    console.log('WEDNESDAY - Radio Wigwam + Resonance FM:');
    console.log('   🎯 Priority: HIGH + MEDIUM');
    console.log('   📧 Action: Direct email pitches with press release');
    console.log('   📝 Notes: Community radio focus, experimental angle');
    console.log('   ⏰ Deadline: End of day');
    console.log('');

    // Thursday - NTS Radio + Soho Radio
    console.log('THURSDAY - NTS Radio + Soho Radio:');
    console.log('   🎯 Priority: MEDIUM + MEDIUM');
    console.log('   📧 Action: Direct pitches to relevant shows');
    console.log('   📝 Notes: Online radio, fresh electronic sound');
    console.log('   ⏰ Deadline: End of day');
    console.log('');

    // Friday - Totally Radio + Radio Reverb
    console.log('FRIDAY - Totally Radio + Radio Reverb:');
    console.log('   🎯 Priority: LOW + LOW');
    console.log('   📧 Action: Direct email pitches');
    console.log('   📝 Notes: Alternative shows, UK experimental angle');
    console.log('   ⏰ Deadline: End of day');
    console.log('');

    return this.newTargets;
  }

  generateEmailTemplates() {
    return {
      bbcIntroducing: {
        subject: 'BBC Introducing Submission: Senior Dunce - Bestial',
        template: `Hi BBC Introducing Team,

I hope you're well! I wanted to submit Senior Dunce's new track "Bestial" for BBC Introducing consideration.

This track represents a compelling blend of experimental electronic music with commercial accessibility, featuring:
- Authentic UK electronic production values
- British engineer collaboration
- Early support from community radio stations
- Perfect for specialist electronic shows

The track has already received plays from Amazing Dance, Sheffield Live!, and the European Indie Music Network, demonstrating its appeal across diverse electronic music audiences.

Would you like to consider it for BBC Introducing?

Best regards,
Chris Schofield
Liberty Music PR
chris@libertymusicpr.com`,
      },

      newStation: {
        subject: 'New Electronic Track: Senior Dunce - Bestial',
        template: `Hi [STATION_NAME],

I hope you're well! I wanted to share Senior Dunce's new track "Bestial" with you for consideration.

This track represents a compelling blend of experimental electronic music with commercial accessibility, featuring:
- Authentic UK electronic production values
- British engineer collaboration
- Early support from community radio stations
- Perfect for specialist electronic shows

The track has already received plays from Amazing Dance, Sheffield Live!, and the European Indie Music Network, demonstrating its appeal across diverse electronic music audiences.

Would you like to hear it for playlist consideration?

Best regards,
Chris Schofield
Liberty Music PR
chris@libertymusicpr.com`,
      },

      experimental: {
        subject: 'Experimental Electronic Track: Senior Dunce - Bestial',
        template: `Hi [STATION_NAME],

I hope you're well! I wanted to share Senior Dunce's new experimental electronic track "Bestial" with you.

This track showcases authentic UK electronic production and experimental sound design, featuring:
- British engineer collaboration
- Early support from community radio stations
- Perfect for experimental electronic shows
- Unique sound design with commercial potential

The track has already received plays from Amazing Dance, Sheffield Live!, and the European Indie Music Network, demonstrating its appeal across diverse electronic music audiences.

Would you like to hear it for your experimental shows?

Best regards,
Chris Schofield
Liberty Music PR
chris@libertymusicpr.com`,
      },
    };
  }

  generateSuccessMetrics() {
    return {
      weekly: {
        targetStations: 8,
        highPriority: 3,
        mediumPriority: 3,
        lowPriority: 2,
      },
      expected: {
        responses: 4,
        playlistAdds: 2,
        newPlays: 10,
      },
      stretch: {
        responses: 6,
        playlistAdds: 4,
        newPlays: 20,
      },
    };
  }

  async executeThisWeekPlan() {
    console.log('🎵 THIS WEEK: New Radio Station Outreach for Senior Dunce\n');

    const weekPlan = this.generateWeekPlan();
    const emailTemplates = this.generateEmailTemplates();
    const successMetrics = this.generateSuccessMetrics();

    console.log('📧 EMAIL TEMPLATES READY:\n');
    console.log('✅ BBC Introducing submission template');
    console.log('✅ New station pitch template');
    console.log('✅ Experimental station template');
    console.log('');

    console.log('🎯 SUCCESS METRICS FOR THIS WEEK:\n');
    console.log('Target Goals:');
    console.log(`   • New Stations Contacted: ${successMetrics.weekly.targetStations}`);
    console.log(`   • Expected Responses: ${successMetrics.expected.responses}`);
    console.log(`   • Expected Playlist Adds: ${successMetrics.expected.playlistAdds}`);
    console.log(`   • Expected New Plays: ${successMetrics.expected.newPlays}`);
    console.log('');
    console.log('Stretch Goals:');
    console.log(`   • Stretch Responses: ${successMetrics.stretch.responses}`);
    console.log(`   • Stretch Playlist Adds: ${successMetrics.stretch.playlistAdds}`);
    console.log(`   • Stretch New Plays: ${successMetrics.stretch.newPlays}`);
    console.log('');

    console.log('🚀 IMMEDIATE ACTIONS FOR THIS WEEK:\n');
    console.log('1. MONDAY: BBC Introducing submission + 6 Music pitch');
    console.log('2. TUESDAY: Amazing Radio submission + pitch');
    console.log('3. WEDNESDAY: Radio Wigwam + Resonance FM pitches');
    console.log('4. THURSDAY: NTS Radio + Soho Radio pitches');
    console.log('5. FRIDAY: Totally Radio + Radio Reverb pitches');
    console.log('6. WEEKEND: Follow up on all submissions');
    console.log('');

    console.log('💡 KEY SUCCESS FACTORS:');
    console.log('• Personal approach for each station');
    console.log('• UK electronic angle emphasized');
    console.log('• Early support evidence included');
    console.log('• Follow up schedule established');
    console.log('• Track responses and new plays');
    console.log('');

    return {
      weekPlan,
      emailTemplates,
      successMetrics,
      totalStations: this.newTargets.length,
    };
  }
}

// Run the this week plan
async function runThisWeekNewStations() {
  const thisWeek = new ThisWeekNewStations();

  try {
    const result = await thisWeek.executeThisWeekPlan();

    console.log('🎉 This Week New Station Outreach Plan Complete!');
    console.log(`Total New Stations to Target: ${result.totalStations}`);
    console.log('Focus: Getting new radio stations on board this week');

    return result;
  } catch (error) {
    console.error('❌ This week plan failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  runThisWeekNewStations().catch(console.error);
}

module.exports = { ThisWeekNewStations, runThisWeekNewStations };
