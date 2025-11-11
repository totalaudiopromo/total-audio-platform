/**
 * Seed Demo Contacts for Pitch Generator
 *
 * Adds high-quality demo contacts including:
 * - sadact (Chris Schofield's project)
 * - BBC Radio 1 contacts (Danny Howard, Pete Tong)
 * - BBC 6 Music (Tom Ravenscroft)
 * - Spotify Editorial
 *
 * Run with: npm run seed:demo
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  console.error('\n💡 Make sure .env.local exists in apps/pitch-generator/\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Demo contacts for Pitch Generator
const DEMO_CONTACTS = [
  {
    name: 'Chris Schofield (sadact)',
    role: 'Producer & Artist',
    outlet: 'Independent Artist',
    email: 'chris@sadact.com',
    genre_tags: ['Electronic', 'House', 'Techno'],
    notes:
      "Chris's own project. Producer with 5+ years radio promotion experience. Background in radio pitching gives authentic industry insight.",
    preferred_tone: 'professional' as const,
    response_rate: null,
  },
  {
    name: 'Danny Howard',
    role: 'Presenter & DJ',
    outlet: 'BBC Radio 1',
    email: 'danny.howard@bbc.co.uk',
    genre_tags: ['House', 'Techno', 'Dance'],
    notes:
      "BBC Radio 1's house and techno specialist. Hosts the Friday night Radio 1 Dance show. Key tastemaker for electronic music in the UK.",
    preferred_tone: 'professional' as const,
    response_rate: 70.0,
  },
  {
    name: 'Pete Tong',
    role: 'Presenter & DJ',
    outlet: 'BBC Radio 1',
    email: 'pete.tong@bbc.co.uk',
    genre_tags: ['House', 'Dance', 'Electronic'],
    notes:
      'Legendary BBC Radio 1 presenter. The Essential Selection and Essential Mix host. One of the most influential figures in dance music worldwide.',
    preferred_tone: 'professional' as const,
    response_rate: 65.0,
  },
  {
    name: 'Tom Ravenscroft',
    role: 'Presenter & DJ',
    outlet: 'BBC 6 Music',
    email: 'tom.ravenscroft@bbc.co.uk',
    genre_tags: ['Alternative', 'Electronic', 'Experimental'],
    notes:
      'BBC 6 Music presenter, son of legendary John Peel. Champions independent and alternative music. Known for supporting left-field electronic and experimental artists.',
    preferred_tone: 'professional' as const,
    response_rate: 75.0,
  },
  {
    name: 'Electronic Playlist Team',
    role: 'Editorial Curator',
    outlet: 'Spotify Editorial',
    email: 'electronic@spotify.com',
    genre_tags: ['Electronic', 'House'],
    notes:
      'Spotify Editorial team for electronic music playlists. Curates major playlists including Electronic Rising, Dance Rising, and House Party.',
    preferred_tone: 'professional' as const,
    response_rate: 55.0,
  },
];

async function seedDemoContacts() {
  console.log('🎯 Seeding Pitch Generator Demo Contacts\n');

  try {
    // Use Chris's email as user_id (matching the Pitch Generator pattern)
    // The contacts table uses user_id as TEXT (email address) not UUID
    const demoUserId = 'chris@libertymusicpr.com';

    console.log(`📧 Using user_id: ${demoUserId}\n`);
    console.log('💡 Note: Contacts will be associated with this email address\n');

    // Check if contacts already exist
    const { data: existingContacts } = await supabase
      .from('contacts')
      .select('name')
      .eq('user_id', demoUserId)
      .in(
        'name',
        DEMO_CONTACTS.map(c => c.name)
      );

    if (existingContacts && existingContacts.length > 0) {
      console.log('⚠️  Some demo contacts already exist:');
      existingContacts.forEach(c => console.log(`   - ${c.name}`));
      console.log('\n💡 Delete them manually or skip seeding.\n');
      return;
    }

    // Insert demo contacts
    const contactsToInsert = DEMO_CONTACTS.map(contact => ({
      user_id: demoUserId,
      ...contact,
    }));

    const { data: insertedContacts, error } = await supabase
      .from('contacts')
      .insert(contactsToInsert)
      .select();

    if (error) {
      console.error('❌ Error inserting contacts:', error);
      return;
    }

    console.log('✅ Successfully seeded demo contacts:\n');
    insertedContacts?.forEach((contact, i) => {
      console.log(`${i + 1}. ${contact.name}`);
      console.log(`   ${contact.role || 'N/A'} - ${contact.outlet}`);
      console.log(`   Email: ${contact.email || 'N/A'}`);
      console.log(`   Genres: ${contact.genre_tags?.join(', ') || 'N/A'}`);
      if (contact.response_rate) {
        console.log(`   Response Rate: ${contact.response_rate}%`);
      }
      console.log('');
    });

    console.log('🎉 Demo contacts ready for Pitch Generator!\n');
    console.log('📍 Next steps:');
    console.log('   1. Visit https://pitch.totalaudiopromo.com/pitch/contacts');
    console.log('   2. View your imported demo contacts');
    console.log('   3. Navigate to /pitch/generate to create pitches');
    console.log('   4. Try generating a pitch for one of the BBC contacts\n');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDemoContacts()
  .then(() => {
    console.log('✨ Seeding complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
