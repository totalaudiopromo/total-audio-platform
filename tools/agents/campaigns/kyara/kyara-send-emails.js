#!/usr/bin/env node

/**
 * KYARA - Send triple j Emails Directly
 *
 * Simplified script to send emails to triple j contacts
 * without full Liberty agent initialization
 */

require('dotenv').config();

const KYARA_CAMPAIGN = {
  artistName: 'KYARA',
  trackName: 'Yearn',
  genre: 'Alternative/Indie',
  soundcloudLink: 'https://on.soundcloud.com/1oiblSoRYCp1swzCr3',
  previousPlays: ['triple j Home & Hosed (Jaimee Taylor-Neilsen, August 2024)']
};

const TRIPLE_J_CONTACTS = [
  {
    name: 'triple j (Claire Mooney - Music Director)',
    email: 'mooney.claire@abc.net.au',
    priority: 'high',
    template: 'music_director'
  },
  {
    name: 'triple j Home & Hosed (Anika Luna)',
    email: 'luna.anika@abc.net.au',
    priority: 'high',
    template: 'home_and_hosed'
  },
  {
    name: 'triple j (Abby Butler)',
    email: 'butler.abby@abc.net.au',
    priority: 'high',
    template: 'abby_tyrone'
  },
  {
    name: 'triple j (Tyrone Pynor)',
    email: 'pynor.tyrone@abc.net.au',
    priority: 'high',
    template: 'abby_tyrone'
  }
];

function generateEmailContent(contact) {
  const { soundcloudLink } = KYARA_CAMPAIGN;

  const templates = {
    home_and_hosed: {
      subject: 'KYARA - New Track for Home & Hosed Consideration',
      body: `Hi Anika,

I hope you're well! I wanted to reach out about KYARA's latest track "Yearn" for Home & Hosed consideration.

You might remember that Jaimee Taylor-Neilsen played KYARA's debut single "Yearn" on Home & Hosed last August. Marie (KYARA) has been building momentum in the independent scene since then, and I think this new release would be a perfect fit for the show.

This track showcases:
- Raw emotional intensity with polished production
- Perfect for Home & Hosed's independent artist focus
- Strong momentum in the Australian alternative scene
- Natural follow-up to the previous Home & Hosed support

Listen here: ${soundcloudLink}

Would love to know if you'd like to consider this for the show!

Best regards,
Chris Schofield
Liberty Music PR
chris@libertymusicpr.com`
    },
    music_director: {
      subject: 'KYARA - Alternative/Indie Track for triple j',
      body: `Hi Claire,

I hope you're well! I wanted to introduce you to KYARA's latest track "Yearn" for triple j consideration.

KYARA has previously received support from triple j Home & Hosed (Jaimee Taylor-Neilsen played their debut single last August), and this new release represents a strong progression in their sound.

This track features:
- Raw emotional intensity meets polished production
- Perfect for alternative radio programming
- Strong potential for playlist placement
- Building momentum in Australian indie scene

Listen here: ${soundcloudLink}

Would you like to hear more for triple j consideration?

Best regards,
Chris Schofield
Liberty Music PR
chris@libertymusicpr.com`
    },
    abby_tyrone: {
      subject: 'KYARA - Alternative/Indie Track for triple j',
      body: `Hi ${contact.name.includes('Abby') ? 'Abby' : 'Tyrone'},

I hope you're well! I wanted to share KYARA's latest track "Yearn" with you for triple j consideration.

KYARA previously received support from triple j Home & Hosed (Jaimee Taylor-Neilsen played their debut single last August), and this new release showcases their evolving sound beautifully.

This track features:
- Raw emotional intensity with polished production
- Perfect for alternative radio programming
- Strong momentum in Australian independent scene
- Natural progression from previous triple j support

Listen here: ${soundcloudLink}

Would love to know if you'd like to consider this for triple j!

Best regards,
Chris Schofield
Liberty Music PR
chris@libertymusicpr.com`
    }
  };

  return templates[contact.template];
}

async function main() {
  console.log('📧 KYARA - triple j Email Campaign\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('🎵 Artist: KYARA');
  console.log('🎵 Track: Yearn');
  console.log('🎵 Genre: Alternative/Indie');
  console.log(`🎵 Stream: ${KYARA_CAMPAIGN.soundcloudLink}\n`);

  console.log('📋 Email Content Preview:\n');

  for (const contact of TRIPLE_J_CONTACTS) {
    const emailContent = generateEmailContent(contact);

    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📧 TO: ${contact.name}`);
    console.log(`📧 EMAIL: ${contact.email}`);
    console.log(`📧 PRIORITY: ${contact.priority}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    console.log(`SUBJECT: ${emailContent.subject}\n`);
    console.log(`BODY:\n${emailContent.body}\n`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  }

  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('📋 NEXT STEPS:\n');
  console.log('Copy the email content above and send manually via Gmail:');
  console.log('chrisschofield@libertymusicpr.com\n');

  console.log('OR run the Gmail API script to send automatically:');
  console.log('node send-kyara-emails-gmail.js\n');

  console.log('✅ Email content generation complete!');
}

main().catch(console.error);
