import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const templates = [
  {
    name: 'BBC Radio 1 Specialist Shows',
    genre: 'Electronic/Dance',
    description:
      'Optimised for BBC Radio 1 specialist shows (Pete Tong, Danny Howard, etc.). Natural UK language, genre context, under 150 words.',
    opening_lines: ["Hope you're well.", "Hope all's good with you.", 'Quick one for you.'],
    hook_structure:
      'Start with track + artist, then key hook in first 50 words. Reference show/outlet naturally.',
    closing_ctas: [
      'Would love to hear your thoughts.',
      'Let me know what you think.',
      'Happy to send more info if useful.',
    ],
    template_body: `Hi {{contact_name}},

Hope you're well. Wanted to share {{track_title}} by {{artist_name}} – {{key_hook}}.

Given {{outlet_name}}'s history with {{genre}}, thought this might resonate with your listeners. The production is clean, and it's got that balance of nostalgic and fresh that works across demographics.

Track's here if you'd like a listen: {{track_link}}

{{artist_background}}

Let me know what you think!

Best,
{{sender_name}}`,
    is_system: true,
    success_rate: 16.0,
    times_used: 127,
  },
  {
    name: 'BBC 6 Music Alternative/Indie',
    genre: 'Alternative/Indie',
    description:
      'For 6 Music shows - conversational tone, emphasis on musicianship and authenticity',
    opening_lines: [
      "Hope you've been well.",
      'Been a while since we last spoke.',
      'Reaching out with something special.',
    ],
    hook_structure: 'More conversational, emphasis on craft and musicianship. Story over stats.',
    closing_ctas: [
      'Would love to hear your thoughts.',
      'Happy to chat more if this resonates.',
      "Let me know if it's one for the show.",
    ],
    template_body: `Hi {{contact_name}},

Hope you've been well. I'm reaching out about {{artist_name}}'s new track {{track_title}} – {{key_hook}}.

{{musicianship_angle}}

Feels right for 6 Music's audience, especially given {{show_context}}. The attention to detail in the production is something I reckon you'd appreciate.

{{track_link}}

{{artist_story}}

Would love to hear your thoughts.

Best,
{{sender_name}}`,
    is_system: true,
    success_rate: 22.0,
    times_used: 94,
  },
  {
    name: 'Spotify Editorial Playlists',
    genre: 'All Genres',
    description:
      'Curator-focused pitch highlighting streaming numbers and existing playlist support',
    opening_lines: [
      'Submitting for playlist consideration.',
      'New track submission for {{playlist_name}}.',
      'Hope this finds you well.',
    ],
    hook_structure:
      'Data-driven. Numbers, playlist placements, genre fit. Professional and concise.',
    closing_ctas: [
      'Thanks for considering.',
      'Happy to provide additional info.',
      'Looking forward to your feedback.',
    ],
    template_body: `Hi {{contact_name}},

Submitting {{track_title}} by {{artist_name}} for {{playlist_name}} consideration.

Track highlights: {{key_hook}}

Current performance:
- Streams: {{streaming_stats}}
- Existing playlist support: {{playlist_placements}}
- Save rate: {{save_rate}}%

{{track_link}}

Genre: {{genre}}
Release date: {{release_date}}

Thanks for considering,
{{sender_name}}`,
    is_system: true,
    success_rate: 19.0,
    times_used: 156,
  },
  {
    name: 'Commercial Radio (Capital, Radio X)',
    genre: 'Pop/Mainstream',
    description: 'Format-focused pitch emphasizing audience fit and commercial appeal',
    opening_lines: [
      'New track for {{station_name}} consideration.',
      "Hope you're well.",
      'Quick pitch for you.',
    ],
    hook_structure:
      'Format-focused. Audience demographics, daypart fit, commercial potential. Direct and concise.',
    closing_ctas: [
      'Thanks for considering.',
      'Would love to discuss further.',
      'Happy to send additional materials.',
    ],
    template_body: `Hi {{contact_name}},

{{track_title}} by {{artist_name}} – {{key_hook}}.

{{audience_fit}} Perfect for {{daypart}} with strong hook and production quality that fits {{station_name}}'s format.

{{commercial_angle}}

Listen: {{track_link}}

{{chart_potential}}

Thanks,
{{sender_name}}`,
    is_system: true,
    success_rate: 11.0,
    times_used: 73,
  },
  {
    name: 'Music Blogs & Online Publications',
    genre: 'All Genres',
    description: 'Story-focused pitch for music blogs, emphasis on artist narrative and exclusives',
    opening_lines: [
      "I'm reaching out about {{artist_name}}.",
      "Hope you're well.",
      'Wanted to share something I think {{outlet_name}} readers would appreciate.',
    ],
    hook_structure:
      'Story first. Artist narrative, unique angle, why now. Offer premiere/exclusive if possible.',
    closing_ctas: [
      'Would this interest {{outlet_name}} readers?',
      'Happy to offer an exclusive premiere if that works.',
      "Let me know if you'd like more info.",
    ],
    template_body: `Hi {{contact_name}},

I'm reaching out about {{artist_name}} – {{artist_story}}.

New track {{track_title}}: {{key_hook}}

{{unique_angle}}

{{track_link}}

Happy to offer: {{premiere_option}}

Would this interest {{outlet_name}} readers?

Best,
{{sender_name}}`,
    is_system: true,
    success_rate: 28.0,
    times_used: 189,
  },
  {
    name: 'Community & Independent Radio',
    genre: 'All Genres',
    description:
      'Flexible pitch for community stations, emphasis on local connection and grassroots support',
    opening_lines: [
      "Hope you're well.",
      'Been listening to {{station_name}} and thought this might fit.',
      'Reaching out about a track that feels right for your listeners.',
    ],
    hook_structure:
      'Warm, personal. Local connection if applicable. Grassroots approach, genuine appreciation for the station.',
    closing_ctas: [
      'Would love to work with {{station_name}}.',
      'Let me know if this is one for your playlist.',
      'Happy to chat more about the project.',
    ],
    template_body: `Hi {{contact_name}},

{{local_connection}}

{{artist_name}} – {{track_title}}: {{key_hook}}

{{community_angle}}

{{track_link}}

{{grassroots_support}}

Been following what {{station_name}} does with emerging artists, and I think there's a genuine fit here.

Would love to work with you on this.

Cheers,
{{sender_name}}`,
    is_system: true,
    success_rate: 31.0,
    times_used: 142,
  },
  {
    name: 'BBC Introducing Shows',
    genre: 'All Genres',
    description:
      'Perfect for BBC Introducing shows - emphasis on discovery, local talent, and emerging artist support',
    opening_lines: [
      "Hope you're well.",
      'Reaching out about an emerging artist I think Introducing would love.',
      'Got something fresh for you.',
    ],
    hook_structure:
      "Discovery-focused. Emphasise emerging talent, local connection, fresh sound. Show you understand Introducing's mission.",
    closing_ctas: [
      'Would love to get this in front of Introducing.',
      'Think this could be perfect for your show.',
      'Happy to provide more background if helpful.',
    ],
    template_body: `Hi {{contact_name}},

Hope you're well. Reaching out about {{artist_name}} – {{key_hook}}.

{{local_connection}} {{artist_background}}

{{track_title}} feels like exactly the kind of fresh talent Introducing champions. {{discovery_angle}}

{{track_link}}

{{emerging_artist_story}}

Think this could be perfect for your show. Would love to get this in front of Introducing.

Best,
{{sender_name}}`,
    is_system: true,
    success_rate: 24.0,
    times_used: 98,
  },
  {
    name: 'Spotify Independent Playlists',
    genre: 'All Genres',
    description:
      'For independent Spotify playlist curators - personal, authentic, less corporate than editorial pitches',
    opening_lines: [
      "Hope you're well.",
      'Been following {{playlist_name}} and thought this might fit.',
      'Reaching out about a track that matches your vibe.',
    ],
    hook_structure:
      'Personal and authentic. Show you actually listen to their playlist. Less corporate, more genuine connection.',
    closing_ctas: [
      'Would love to hear your thoughts.',
      'Let me know if this fits {{playlist_name}}.',
      'Happy to chat more about the project.',
    ],
    template_body: `Hi {{contact_name}},

Hope you're well. Been following {{playlist_name}} and thought {{track_title}} by {{artist_name}} might fit your vibe.

{{key_hook}}

{{playlist_fit}} The energy reminds me of {{similar_artist_reference}} you featured recently, but with {{unique_angle}}.

{{track_link}}

{{artist_background}}

Would love to hear your thoughts if this fits {{playlist_name}}.

Cheers,
{{sender_name}}`,
    is_system: true,
    success_rate: 26.0,
    times_used: 134,
  },
  {
    name: 'UK Music Blogs (DIY, The Line of Best Fit, etc.)',
    genre: 'Alternative/Indie',
    description: 'For UK music blogs - story-driven, offer exclusives, show you read their content',
    opening_lines: [
      "Hope you're well.",
      'Been reading {{outlet_name}} and thought this might interest you.',
      'Reaching out about something I think {{outlet_name}} readers would love.',
    ],
    hook_structure:
      'Show you actually read their blog. Reference their coverage style. Offer exclusive/premiere. Story over stats.',
    closing_ctas: [
      'Would this interest {{outlet_name}} readers?',
      'Happy to offer an exclusive premiere if that works.',
      "Let me know if you'd like more info.",
    ],
    template_body: `Hi {{contact_name}},

Hope you're well. Been reading {{outlet_name}} and thought {{artist_name}} might interest you.

{{track_title}}: {{key_hook}}

{{blog_fit}} Reminds me of {{similar_artist_reference}} you covered recently, but with {{unique_angle}}.

{{track_link}}

{{artist_story}}

{{exclusive_offer}}

Would this interest {{outlet_name}} readers?

Best,
{{sender_name}}`,
    is_system: true,
    success_rate: 29.0,
    times_used: 167,
  },
  {
    name: 'Radio 1Xtra / Urban/Electronic',
    genre: 'Hip-Hop/Urban/Electronic',
    description:
      'For Radio 1Xtra shows - emphasis on UK sound, cultural relevance, and fresh production',
    opening_lines: [
      "Hope you're well.",
      'Got something fresh for 1Xtra.',
      "Reaching out about a track that's got that UK energy.",
    ],
    hook_structure:
      "UK-focused. Cultural relevance. Fresh production. Show you understand 1Xtra's audience and sound.",
    closing_ctas: [
      'Would love to get this on 1Xtra.',
      'Think this could work for your show.',
      'Let me know what you think.',
    ],
    template_body: `Hi {{contact_name}},

Hope you're well. Got {{track_title}} by {{artist_name}} – {{key_hook}}.

{{uk_cultural_angle}} The production has that fresh UK sound that works on 1Xtra, especially {{show_context}}.

{{track_link}}

{{artist_background}}

{{cultural_relevance}}

Think this could work for your show. Would love to get this on 1Xtra.

Best,
{{sender_name}}`,
    is_system: true,
    success_rate: 18.0,
    times_used: 89,
  },
  {
    name: 'Follow-Up / Second Touch',
    genre: 'All Genres',
    description:
      'For following up on previous pitches - respectful, not pushy, add new angle or information',
    opening_lines: [
      "Hope you're well.",
      'Following up on {{previous_pitch_reference}}.',
      'Quick update on {{artist_name}}.',
    ],
    hook_structure:
      'Acknowledge previous contact. Add new information or angle. Keep it brief. No pressure.',
    closing_ctas: [
      'No pressure, just wanted to share the update.',
      'Happy to chat if this changes anything.',
      'Thanks for your time either way.',
    ],
    template_body: `Hi {{contact_name}},

Hope you're well. Following up on {{previous_pitch_reference}}.

{{new_angle_or_update}}

{{track_link}}

{{update_details}}

No pressure, just wanted to share the update in case it changes anything.

Thanks for your time either way.

Best,
{{sender_name}}`,
    is_system: true,
    success_rate: 12.0,
    times_used: 76,
  },
];

async function seedTemplates() {
  console.log('🌱 Seeding pitch templates...\n');

  // Check if templates already exist
  const { data: existing, error: checkError } = await supabase
    .from('pitch_templates')
    .select('name')
    .eq('is_system', true);

  if (checkError) {
    console.error('❌ Error checking existing templates:', checkError);
    process.exit(1);
  }

  if (existing && existing.length > 0) {
    console.log(`⚠️  Found ${existing.length} existing system templates.`);
    console.log('   Existing templates:', existing.map(t => t.name).join(', '));
    console.log('\n   Deleting old templates and replacing with new ones...\n');

    // Delete existing system templates
    const { error: deleteError } = await supabase
      .from('pitch_templates')
      .delete()
      .eq('is_system', true);

    if (deleteError) {
      console.error('❌ Error deleting old templates:', deleteError);
      process.exit(1);
    }

    console.log('✅ Old templates deleted\n');
  }

  // Insert templates
  const { data, error } = await supabase.from('pitch_templates').insert(templates).select();

  if (error) {
    console.error('❌ Error inserting templates:', error);
    process.exit(1);
  }

  console.log(`✅ Successfully seeded ${data?.length || 0} templates:\n`);
  data?.forEach((template, index) => {
    console.log(`   ${index + 1}. ${template.name}`);
    console.log(`      Genre: ${template.genre}`);
    console.log(`      Success Rate: ${template.success_rate}%`);
    console.log(`      Times Used: ${template.times_used}\n`);
  });

  console.log('🎉 Templates library is now ready for demo!\n');
}

seedTemplates()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
