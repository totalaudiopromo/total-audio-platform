/**
 * Seed KYARA Campaign Demo Contacts
 *
 * Adds high-quality contacts from the KYARA campaign to demonstrate:
 * - Real industry contacts (BBC, Triple J, etc.)
 * - High-quality enrichment data
 * - Professional pitch generation
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Top 5 contacts from KYARA campaign for demo
const DEMO_CONTACTS = [
  {
    name: 'Anika Luna',
    role: 'Home & Hosed Presenter',
    outlet: 'Triple J (ABC Radio)',
    email: 'luna.anika@abc.net.au',
    genre_tags: ['Alternative', 'Indie', 'Electronic', 'Emerging Artists'],
    notes: 'Championed KYARA\'s "Yearn" on Home & Hosed in August 2024. Key tastemaker for independent Australian and international artists. Show focuses on new and unsigned talent.',
    preferred_tone: 'professional',
    response_rate: 75.00,
  },
  {
    name: 'Claire Mooney',
    role: 'Music Director',
    outlet: 'Triple J (ABC Radio)',
    email: 'mooney.claire@abc.net.au',
    genre_tags: ['Alternative', 'Indie', 'Electronic', 'Pop'],
    notes: 'Triple J Music Director. Oversees playlist decisions for Australia\'s leading youth broadcaster. Strong focus on Australian independent artists with international appeal.',
    preferred_tone: 'professional',
    response_rate: 65.00,
  },
  {
    name: 'Rosie Dunkley',
    role: 'Music Specialist',
    outlet: 'BBC Radio (UK)',
    email: 'rosie.dunkley@bbc.co.uk',
    genre_tags: ['Pop', 'Rock', 'Electronic', 'Indie', 'Alternative'],
    notes: 'BBC Radio music specialist with broad genre knowledge. High-quality contact with proven track record. Open to UK and international artists with radio-ready production.',
    preferred_tone: 'professional',
    response_rate: 70.00,
  },
  {
    name: 'Jada Joshi',
    role: 'Music Specialist',
    outlet: 'BBC Radio (UK)',
    email: 'jada.joshi.ext@bbc.co.uk',
    genre_tags: ['Alternative', 'Indie', 'Electronic', 'Hip-Hop'],
    notes: 'BBC Radio specialist focusing on alternative and electronic crossover. Strong advocate for independent artists. Excellent contact for genre-blending artists.',
    preferred_tone: 'professional',
    response_rate: 68.00,
  },
  {
    name: 'Tom Ravenscroft',
    role: 'Presenter & DJ',
    outlet: 'BBC Radio 6 Music',
    email: 'tom@tomravenscroft.co.uk',
    genre_tags: ['Alternative', 'Rock', 'Indie', 'Electronic', 'Punk'],
    notes: 'Legendary BBC 6 Music presenter (son of John Peel). Champions independent and alternative music. High-profile tastemaker with industry credibility.',
    preferred_tone: 'professional',
    response_rate: 80.00,
  },
];

async function seedDemoContacts() {
  console.log('🎯 Seeding KYARA Campaign Demo Contacts\n');

  try {
    // Get or create demo user with your email
    const demoEmail = 'chris@libertymusicpr.com';

    let { data: users } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', demoEmail)
      .limit(1);

    let demoUserId: string;

    if (!users || users.length === 0) {
      console.log('⚠️  No user found with email:', demoEmail);
      console.log('   Creating demo user...\n');

      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({ email: demoEmail })
        .select()
        .single();

      if (userError || !newUser) {
        console.error('❌ Error creating user:', userError);
        console.log('\n💡 Please sign up at https://pitch.totalaudiopromo.com first\n');
        return;
      }

      demoUserId = newUser.id;
      console.log(`✅ Created user: ${newUser.email} (${demoUserId})\n`);
    } else {
      demoUserId = users[0].id;
      console.log(`✅ Using user: ${users[0].email} (${demoUserId})\n`);
    }

    // Check if contacts already exist
    const { data: existingContacts } = await supabase
      .from('contacts')
      .select('name')
      .eq('user_id', demoUserId)
      .in('name', DEMO_CONTACTS.map(c => c.name));

    if (existingContacts && existingContacts.length > 0) {
      console.log('⚠️  Some contacts already exist:');
      existingContacts.forEach(c => console.log(`   - ${c.name}`));
      console.log('\n   Delete them first or skip seeding.\n');
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

    console.log('✅ Successfully added demo contacts:\n');
    insertedContacts?.forEach((contact, i) => {
      console.log(`${i + 1}. ${contact.name}`);
      console.log(`   ${contact.role} - ${contact.outlet}`);
      console.log(`   Genre: ${contact.genre_tags?.join(', ')}`);
      console.log(`   Response Rate: ${contact.response_rate}%\n`);
    });

    console.log('🎉 Demo contacts ready for KYARA campaign!\n');
    console.log('📍 Next steps:');
    console.log('   1. Navigate to /pitch/generate');
    console.log('   2. Select one of these contacts');
    console.log('   3. Use KYARA campaign details:');
    console.log('      Artist: KYARA');
    console.log('      Track: Bloodshot');
    console.log('      Genre: Alternative/Electronic');
    console.log('      Hook: Self-produced electro-pop anthem about empowerment\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

seedDemoContacts();
