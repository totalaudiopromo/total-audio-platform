#!/usr/bin/env node

/**
 * Senior Dunce - Bestial Press Release Generator
 *
 * Based on Synth Seoul meeting approach and UK electronic angle
 * Creates professional press release for radio station outreach
 */

require('dotenv').config();

class SeniorDuncePressRelease {
  constructor() {
    this.campaignData = {
      artistName: 'Senior Dunce',
      trackName: 'Bestial',
      genre: 'Electronic/Experimental',
      releaseDate: '2025-10-15',
      campaignDuration: '4-week',
      budget: '£500',
      targetMarket: 'UK focused',
      angle: 'UK electronic influence with British engineer collaboration',
    };
  }

  generatePressRelease() {
    const pressRelease = `FOR IMMEDIATE RELEASE

Senior Dunce Unveils Compelling New Electronic Track "Bestial"

UK-Influenced Experimental Electronic Sound Showcases British Production Excellence

LONDON, UK - Independent electronic artist Senior Dunce has unveiled their compelling new single "Bestial", a beautifully crafted experimental electronic track that highlights the artist's distinctive sound design and ability to capture authentic electronic textures with a distinctly British influence.

The release demonstrates Senior Dunce's commitment to innovative electronic artistry, featuring sophisticated production that allows the track's atmospheric elements and rhythmic sensibilities to take centre stage. The track was developed in collaboration with a British engineer, bringing authentic UK electronic production values to the forefront.

"This track came from exploring the intersection of experimental electronic music and commercial accessibility," shares Senior Dunce. "I wanted to create something that felt both innovative and engaging, drawing from the rich heritage of UK electronic music while pushing into new sonic territories."

In an era where independent electronic music continues to find new audiences through specialist radio and digital platforms, "Bestial" represents the kind of authentic artistry that resonates with listeners seeking genuine musical experiences beyond mainstream electronic fare.

The track has already garnered support from community radio stations including Amazing Dance, Sheffield Live!, and the European Indie Music Network, demonstrating its appeal across diverse electronic music audiences.

"Bestial" is set for promotion across BBC Introducing, community radio stations, and independent electronic music platforms, with a focus on stations that champion innovative electronic sounds and support emerging artists.

The single showcases Senior Dunce's evolution as an electronic artist, blending experimental sound design with accessible musical structures that appeal to both specialist audiences and broader electronic music fans.

###

CONTACT:
Chris Schofield
Liberty Music PR  
Independent Electronic Artist Specialist
Email: chris@libertymusicpr.com
Web: https://libertymusicpr.com

NOTES TO EDITORS:
- Senior Dunce is an independent electronic artist based in the UK
- "Bestial" is available for radio play and playlist consideration
- The track features British engineering and production
- Early support from community radio stations demonstrates commercial potential
- Perfect for specialist electronic shows and BBC Introducing consideration`;

    return pressRelease;
  }

  generateEmailTemplates() {
    return {
      radioStation: {
        subject: 'Press Release: Senior Dunce - Bestial (New Electronic Track)',
        template: `Hi [STATION_NAME],

Please find below our press release for Senior Dunce's new electronic track "Bestial".

The track has already received early support from community radio stations and showcases a unique UK electronic influence with British production values.

Would you like to hear the track for playlist consideration?

Best regards,
Chris Schofield
Liberty Music PR

---

[PRESS_RELEASE_CONTENT]`,
      },

      bbcIntroducing: {
        subject: 'BBC Introducing Submission: Senior Dunce - Bestial',
        template: `Hi BBC Introducing Team,

Please find below our press release for Senior Dunce's new electronic track "Bestial".

This track showcases authentic UK electronic production and has already received support from community radio stations, demonstrating its potential for broader appeal.

We believe it would be perfect for BBC Introducing consideration.

Best regards,
Chris Schofield
Liberty Music PR

---

[PRESS_RELEASE_CONTENT]`,
      },

      majorStations: {
        subject: 'Commercial Electronic Track: Senior Dunce - Bestial',
        template: `Hi [STATION_NAME],

Please find below our press release for Senior Dunce's new electronic track "Bestial".

This track represents a compelling blend of experimental electronic music with commercial accessibility, featuring British production values and early support from community radio.

Would you like to consider it for your playlist?

Best regards,
Chris Schofield
Liberty Music PR

---

[PRESS_RELEASE_CONTENT]`,
      },
    };
  }

  generateSocialMediaContent() {
    return {
      twitter: [
        "🎵 New track alert! Senior Dunce - 'Bestial' is out now. UK electronic influence meets experimental sound design. Perfect for specialist radio shows. #ElectronicMusic #UKMusic #IndieElectronic",
        "🔥 Senior Dunce drops 'Bestial' - a compelling blend of experimental electronic with British production values. Already getting love from community radio! #NewMusic #Electronic #UKProducer",
        "🎧 'Bestial' by Senior Dunce showcases authentic UK electronic artistry. Experimental sound design meets commercial accessibility. Radio stations are taking notice! #ElectronicMusic #UKMusic",
      ],

      instagram: [
        "🎵 New track from Senior Dunce - 'Bestial' is here! UK electronic influence meets experimental sound design. Perfect for specialist radio shows and BBC Introducing consideration. #ElectronicMusic #UKMusic #IndieElectronic #NewMusic",
        "🔥 Senior Dunce drops 'Bestial' - a compelling blend of experimental electronic with British production values. Early support from community radio stations shows this track has serious potential! #ElectronicMusic #UKMusic #NewMusic #IndieElectronic",
      ],

      facebook: [
        "Senior Dunce has unveiled their compelling new single 'Bestial', a beautifully crafted experimental electronic track that highlights the artist's distinctive sound design and ability to capture authentic electronic textures with a distinctly British influence. The track has already garnered support from community radio stations and is perfect for specialist electronic shows and BBC Introducing consideration.",
      ],
    };
  }

  generatePlaylistPitch() {
    return `Hi [PLAYLIST_CURATOR],

I hope you're well! I wanted to share Senior Dunce's new track "Bestial" with you for playlist consideration.

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
chris@libertymusicpr.com`;
  }

  async executePressReleaseCampaign() {
    console.log('📰 Senior Dunce - Bestial Press Release Campaign\n');

    const pressRelease = this.generatePressRelease();
    const emailTemplates = this.generateEmailTemplates();
    const socialContent = this.generateSocialMediaContent();
    const playlistPitch = this.generatePlaylistPitch();

    console.log('📊 PRESS RELEASE GENERATED:\n');
    console.log('✅ Professional press release created');
    console.log('✅ UK electronic angle emphasized');
    console.log('✅ British production collaboration highlighted');
    console.log('✅ Early radio support mentioned');
    console.log('✅ BBC Introducing positioning included');
    console.log('');

    console.log('📧 EMAIL TEMPLATES CREATED:\n');
    console.log('✅ Radio station press release email');
    console.log('✅ BBC Introducing submission email');
    console.log('✅ Major station commercial pitch email');
    console.log('');

    console.log('📱 SOCIAL MEDIA CONTENT GENERATED:\n');
    console.log(`✅ ${socialContent.twitter.length} Twitter posts`);
    console.log(`✅ ${socialContent.instagram.length} Instagram posts`);
    console.log(`✅ ${socialContent.facebook.length} Facebook posts`);
    console.log('');

    console.log('🎵 PLAYLIST PITCH TEMPLATE:\n');
    console.log('✅ Curator outreach email template');
    console.log('✅ UK electronic angle emphasized');
    console.log('✅ Early support evidence included');
    console.log('');

    console.log('📋 PRESS RELEASE CONTENT:\n');
    console.log('─'.repeat(60));
    console.log(pressRelease);
    console.log('─'.repeat(60));
    console.log('');

    console.log('🚀 IMMEDIATE NEXT STEPS:\n');
    console.log('1. Send press release to all 18 radio station contacts');
    console.log('2. Submit to BBC Introducing with press release');
    console.log('3. Share on social media platforms');
    console.log('4. Send playlist pitches to curators');
    console.log('5. Follow up with stations after 1 week');
    console.log('6. Monitor press release pick-up and coverage');
    console.log('');

    console.log('🎯 SUCCESS METRICS:');
    console.log('• Press release sent to 18 radio stations');
    console.log('• BBC Introducing submission completed');
    console.log('• Social media content shared');
    console.log('• Playlist curator outreach initiated');
    console.log('• Follow-up schedule established');
    console.log('');

    return {
      pressRelease,
      emailTemplates,
      socialContent,
      playlistPitch,
      campaignData: this.campaignData,
    };
  }
}

// Run the press release campaign
async function runSeniorDuncePressRelease() {
  const pressRelease = new SeniorDuncePressRelease();

  try {
    const result = await pressRelease.executePressReleaseCampaign();

    console.log('🎉 Senior Dunce Press Release Campaign Complete!');
    console.log('Professional press release ready for radio station outreach');
    console.log('UK electronic angle and British production values emphasized');

    return result;
  } catch (error) {
    console.error('❌ Press release campaign failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  runSeniorDuncePressRelease().catch(console.error);
}

module.exports = { SeniorDuncePressRelease, runSeniorDuncePressRelease };
