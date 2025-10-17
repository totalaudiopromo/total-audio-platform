/**
 * CREATE LIBERTY MUSIC PR DEMO DATA
 * For Dan meeting on Wednesday
 *
 * Liberty Music PR = Dan's PR AGENCY (the company using our software)
 * Royal Blood, Architects, Rolo Tomassi = Their CLIENTS (bands they do PR for)
 *
 * This shows how Liberty Music PR manages multiple client campaigns
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Demo user email (Liberty Music PR agency owner)
const DEMO_USER_EMAIL = 'dan@libertymusicpr.co.uk';

const LIBERTY_CAMPAIGNS = [
  // ROYAL BLOOD - New Album Campaign (Liberty Music PR's client)
  {
    client_name: 'Royal Blood',
    client_company: 'Warner Records', // The band's record label
    client_billing_code: 'RB-2025-ALB', // Liberty Music PR's internal billing code
    artist_name: 'Royal Blood',
    release_title: 'Typhoons Deluxe Edition',
    release_type: 'Album',
    release_date: '2025-11-15',
    genre: 'Rock',
    budget: 50000,
    status: 'active',
    description: 'Major album re-release campaign targeting BBC Radio 1, Radio X, Kerrang! Focus on deluxe edition with bonus tracks and exclusive vinyl.',
    goals: 'Radio airplay on BBC Radio 1 Rock Show, Kerrang! Radio A-list, Festival bookings for 2026 season',
    notes: 'Band has strong existing relationship with BBC Radio 1. Target Annie Mac, Daniel P Carter shows. Vinyl pre-orders already exceeding expectations.',
  },

  // ARCHITECTS - Festival Circuit
  {
    client_name: 'Architects',
    client_company: 'Epitaph Records',
    client_billing_code: 'ARCH-2025-FEST',
    artist_name: 'Architects',
    release_title: 'Summer Festival Circuit 2025',
    release_type: 'Campaign',
    release_date: '2025-06-01',
    genre: 'Metalcore',
    budget: 35000,
    status: 'active',
    description: 'Festival season promotional campaign. Target: Download, Slam Dunk, 2000trees, Reading & Leeds. Radio push for new single "Gravity".',
    goals: 'Secure headline slots at 3+ major festivals, BBC Radio 1 Rock Show rotation, Kerrang! cover feature',
    notes: 'Band touring EU April-May. UK festival circuit June-Aug. New single drops April 1st. Strong Spotify editorial support confirmed.',
  },

  // ROLO TOMASSI - Underground Push
  {
    client_name: 'Rolo Tomassi',
    client_company: 'MNRK Heavy',
    client_billing_code: 'RT-2025-ALB',
    artist_name: 'Rolo Tomassi',
    release_title: 'Where Myth Becomes Memory Deluxe',
    release_type: 'Album',
    release_date: '2025-09-20',
    genre: 'Mathcore/Experimental',
    budget: 18000,
    status: 'planning',
    description: 'Deluxe re-issue with live recordings. Target BBC Radio 6 Music, specialist metal shows, DIY/underground press. Focus on vinyl collectors and core fanbase.',
    goals: 'BBC Radio 6 Music daytime play, Quietus/Wire Magazine features, ArcTanGent festival headline slot',
    notes: 'Band has cult following. Focus on tastemaker press over mainstream radio. Strong Bandcamp presence. Previous album critically acclaimed.',
  },

  // ROYAL BLOOD - Single Campaign
  {
    client_name: 'Royal Blood',
    client_company: 'Warner Records',
    client_billing_code: 'RB-2025-SNG',
    artist_name: 'Royal Blood',
    release_title: 'Mountains at Midnight (Single)',
    release_type: 'Single',
    release_date: '2025-10-01',
    genre: 'Rock',
    budget: 15000,
    status: 'completed',
    description: 'Lead single from deluxe album. Radio1 priority, targeting A-list rotation. Spotify UK Rock playlist confirmed.',
    goals: 'BBC Radio 1 A-list, Radio X Power Play, 1M Spotify streams in first week',
    notes: 'COMPLETED: Achieved Radio 1 B-list (targeting A-list upgrade), 850K Spotify streams week 1, strong playlist adds across DSPs.',
  },

  // ARCHITECTS - Podcast Tour
  {
    client_name: 'Architects',
    client_company: 'Epitaph Records',
    client_billing_code: 'ARCH-2025-POD',
    artist_name: 'Architects',
    release_title: 'Podcast & Interview Circuit',
    release_type: 'Campaign',
    release_date: '2025-03-15',
    genre: 'Metalcore',
    budget: 8000,
    status: 'active',
    description: 'Pre-festival podcast tour. Target: Kerrang! Podcast, BBC Radio 1 Rock Show interviews, Rock Sound podcast series.',
    goals: 'Minimum 5 major podcast features, build pre-festival hype, promote new single and tour dates',
    notes: 'Band available for remote interviews March 1-31. Looking for authentic, long-form conversation format over quick promo spots.',
  },
];

const DEMO_CONTACTS = [
  // BBC Radio 1
  {
    name: 'Daniel P. Carter',
    email: 'daniel.carter@bbc.co.uk',
    platform: 'BBC Radio 1 Rock Show',
    role: 'Presenter',
    company: 'BBC',
    notes: 'Royal Blood contact - strong existing relationship. Loves heavy rock, open to Architects features.',
  },
  {
    name: 'Jack Saunders',
    email: 'jack.saunders@bbc.co.uk',
    platform: 'BBC Radio 1',
    role: 'Presenter - New Music',
    company: 'BBC',
    notes: 'Future Sounds show. Good for breaking new acts and album campaigns.',
  },

  // BBC Radio 6 Music
  {
    name: 'Mary Anne Hobbs',
    email: 'maryanne.hobbs@bbc.co.uk',
    platform: 'BBC Radio 6 Music',
    role: 'Presenter',
    company: 'BBC',
    notes: 'Perfect for Rolo Tomassi - loves experimental/mathcore. Strong tastemaker influence.',
  },

  // Kerrang!
  {
    name: 'Sophie K',
    email: 'sophie@kerrang.com',
    platform: 'Kerrang! Radio',
    role: 'Presenter',
    company: 'Kerrang!',
    notes: 'All three artists fit her wheelhouse. Strong social media presence for promo.',
  },

  // Radio X
  {
    name: 'John Kennedy',
    email: 'john.kennedy@radiox.co.uk',
    platform: 'Radio X',
    role: 'Presenter - X-Posure',
    company: 'Radio X',
    notes: 'Championed Royal Blood early. Great for breaking rock artists.',
  },

  // Spotify
  {
    name: 'George Ergatoudis',
    email: 'george@spotify.com',
    platform: 'Spotify UK',
    role: 'Head of Music UK',
    company: 'Spotify',
    notes: 'Editorial playlist gatekeeper. Royal Blood confirmed support. Approach for Architects.',
  },

  // Press
  {
    name: 'Sam Law',
    email: 'sam@kerrang.com',
    platform: 'Kerrang! Magazine',
    role: 'Editor',
    company: 'Kerrang!',
    notes: 'Cover features, reviews, news. All Liberty artists fit editorial direction.',
  },
];

async function createDemoData() {
  console.log('🎸 Creating Liberty Music PR demo data...\n');
  console.log('   Context: Liberty Music PR is the AGENCY');
  console.log('   Royal Blood, Architects, Rolo Tomassi are their CLIENTS\n');

  // 1. Find or create demo user
  console.log(`📧 Looking for user: ${DEMO_USER_EMAIL}`);

  const { data: existingUser } = await supabase.auth.admin.listUsers();
  let demoUser = existingUser?.users.find(u => u.email === DEMO_USER_EMAIL);

  if (!demoUser) {
    console.log('❌ Demo user not found. Please create an account first.');
    console.log(`   Sign up at: http://localhost:3001/auth/signup with email: ${DEMO_USER_EMAIL}`);
    return;
  }

  console.log(`✅ Found user: ${demoUser.id}\n`);

  // 2. Create campaigns
  console.log('🎯 Creating campaigns...');

  for (const campaign of LIBERTY_CAMPAIGNS) {
    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        ...campaign,
        user_id: demoUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error(`  ❌ Failed to create campaign: ${campaign.release_title}`, error.message);
    } else {
      console.log(`  ✅ Created: ${campaign.artist_name} - ${campaign.release_title} (${campaign.status})`);
    }
  }

  console.log('');

  // 3. Create contacts
  console.log('📇 Creating contacts...');

  for (const contact of DEMO_CONTACTS) {
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        ...contact,
        user_id: demoUser.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error(`  ❌ Failed to create contact: ${contact.name}`, error.message);
    } else {
      console.log(`  ✅ Created: ${contact.name} (${contact.platform})`);
    }
  }

  console.log('\n🎉 Liberty Music PR demo data created successfully!\n');
  console.log('🔗 View at: http://localhost:3001/dashboard');
  console.log('📊 Team page: http://localhost:3001/dashboard/team');
  console.log('\n📝 Business Context:');
  console.log('   - Liberty Music PR = Dan\'s PR AGENCY (the company)');
  console.log('   - Royal Blood, Architects, Rolo Tomassi = Their CLIENTS (bands)');
  console.log('   - Shows how Liberty manages multiple band clients');
  console.log('\n📝 Demo talking points for Dan:');
  console.log('   1. Multi-client campaign view (all your bands in one place)');
  console.log('   2. AI chatbot: "Show me Royal Blood campaigns"');
  console.log('   3. Filter by client to focus on one band at a time');
  console.log('   4. White-label PDF exports with "Liberty Music PR" branding');
  console.log('   5. Team access for your staff + band managers (clients)');
  console.log('   6. Saves 40+ hours/month managing multiple band campaigns');
}

// Run the script
createDemoData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Error creating demo data:', error);
    process.exit(1);
  });
