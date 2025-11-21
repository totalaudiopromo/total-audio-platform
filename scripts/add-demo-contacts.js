#!/usr/bin/env node

/**
 * Add BBC Radio demo contacts for Liberty Music PR testing
 * Run with: node scripts/add-demo-contacts.js
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const contacts = [
  // BBC Radio presenters
  {
    user_id: 'chrisschofield@libertymusicpr.com',
    name: 'Jack Saunders',
    email: 'jack.saunders@bbc.co.uk',
    outlet: 'BBC Radio 1',
    role: 'Presenter',
    notes:
      'New Music show - Alternative, Indie, Rock, Electronic. Key tastemaker for breaking new artists.',
    preferred_tone: 'professional',
  },
  {
    user_id: 'chrisschofield@libertymusicpr.com',
    name: 'Nick Grimshaw',
    email: 'nick.grimshaw@bbc.co.uk',
    outlet: 'BBC 6 Music',
    role: 'Presenter',
    notes: 'Alternative and indie music specialist. Former Radio 1 Breakfast Show host.',
    preferred_tone: 'casual',
  },
  {
    user_id: 'chrisschofield@libertymusicpr.com',
    name: 'Clara Amfo',
    email: 'clara.amfo@bbc.co.uk',
    outlet: 'BBC Radio 1',
    role: 'Presenter',
    notes: 'Mid-morning show - Pop, R&B, Hip-Hop. Champion of diverse new music.',
    preferred_tone: 'enthusiastic',
  },
  {
    user_id: 'chrisschofield@libertymusicpr.com',
    name: 'Gayle Lofthouse',
    email: 'gayle.lofthouse@bbc.co.uk',
    outlet: 'BBC Radio',
    role: 'Presenter',
    notes: 'Weekday show',
    preferred_tone: 'professional',
  },
  {
    user_id: 'chrisschofield@libertymusicpr.com',
    name: 'Russell Walker-Brown',
    email: 'russell.walker-brown@bbc.co.uk',
    outlet: 'BBC Radio',
    role: 'Presenter',
    notes: 'Late night show',
    preferred_tone: 'casual',
  },

  // Streaming platforms
  {
    user_id: 'chrisschofield@libertymusicpr.com',
    name: 'Spotify Editorial',
    email: 'editorial@spotify.com',
    outlet: 'Spotify',
    role: 'Playlist Curators',
    notes: 'Global streaming platform - Editorial team managing major playlists',
    preferred_tone: 'professional',
  },

  // Independent record labels
  {
    user_id: 'chrisschofield@libertymusicpr.com',
    name: 'Rough Trade Records',
    email: 'info@roughtraderecords.com',
    outlet: 'Rough Trade Records',
    role: 'A&R / Press',
    notes: 'Legendary independent label - Indie, Alternative, Punk',
    preferred_tone: 'casual',
  },
  {
    user_id: 'chrisschofield@libertymusicpr.com',
    name: '4AD Records',
    email: 'info@4ad.com',
    outlet: '4AD',
    role: 'A&R / Press',
    notes: 'Independent label - Alternative, Art Rock, Electronic',
    preferred_tone: 'professional',
  },
  {
    user_id: 'chrisschofield@libertymusicpr.com',
    name: 'Domino Recording Co',
    email: 'press@dominomusic.com',
    outlet: 'Domino Recording Co',
    role: 'Press Contact',
    notes: 'Independent label - Indie, Alternative, Electronic',
    preferred_tone: 'professional',
  },
  {
    user_id: 'chrisschofield@libertymusicpr.com',
    name: 'Warp Records',
    email: 'info@warp.net',
    outlet: 'Warp Records',
    role: 'A&R / Press',
    notes: 'Electronic music pioneers - IDM, Ambient, Experimental',
    preferred_tone: 'casual',
  },
  {
    user_id: 'chrisschofield@libertymusicpr.com',
    name: 'Ninja Tune',
    email: 'contact@ninjatune.net',
    outlet: 'Ninja Tune',
    role: 'A&R / Press',
    notes: 'Independent label - Electronic, Hip-Hop, Experimental',
    preferred_tone: 'casual',
  },
];

async function addContacts() {
  console.log('🔄 Adding varied demo contacts (BBC Radio, labels, streaming platforms)...');

  const { data, error } = await supabase.from('contacts').insert(contacts).select();

  if (error) {
    console.error('❌ Error adding contacts:', error.message);
    process.exit(1);
  }

  console.log(`✅ Successfully added ${data.length} contacts`);
  console.log('\nContacts added:');
  data.forEach(contact => {
    console.log(`  • ${contact.name} - ${contact.outlet} (${contact.email})`);
  });
}

addContacts();
