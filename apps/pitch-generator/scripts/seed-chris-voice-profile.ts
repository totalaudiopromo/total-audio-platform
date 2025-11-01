import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('   Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedChrisVoiceProfile() {
  console.log('🎤 Seeding Chris Schofield voice profile...\n');

  const userId = 'founder@totalaudiopromo.com';

  const voiceProfile = {
    user_id: userId,
    voice_background:
      "I'm a producer making electronic music under the name sadact. I've been pitching tracks to BBC Radio 1, 6 Music, and indie labels for 5+ years. I've worked with Royal Blood, Architects, and Rolo Tomassi's networks. I understand both the creative and promotional sides because I live them daily.",
    voice_style:
      "Direct but friendly. I write like I'm talking to someone at a gig, not sending a press release. No corporate speak, no forced formality. I keep it real and conversational while staying professional.",
    voice_achievements:
      "I've secured BBC Radio 1 airplay for tracks I've promoted. Built genuine relationships with producers at 6 Music. Got featured on Spotify editorial playlists. I've pitched hundreds of campaigns and learned what actually works versus what sounds good in theory.",
    voice_approach:
      "I don't do mass emails. Every pitch is researched - I check what shows they've recently featured, understand their sound, and only pitch tracks that genuinely fit. Relationship-building over spray-and-pray. Quality over quantity, always.",
    voice_differentiator:
      "I'm a producer myself (sadact), so I understand the artist's perspective and the emotional investment in each track. I've experienced both sides - making music and promoting it. I test every tool and strategy in my own campaigns before recommending it to anyone else.",
    voice_typical_opener:
      "I usually start with something personal like 'Hope you've been well' or reference something specific I heard them play recently. Sometimes 'Quick one for you' if we've spoken before. I make it feel like a conversation, not a cold pitch.",
    voice_context_notes:
      "Dad of two based in Brighton. Electronic music focus. I work full-time at Postman, so I run campaigns in the evenings and weekends. Time is precious, which is why I built tools to save it. I'm practical, honest, and I hate wasting anyone's time - including my own.",
    voice_profile_completed: true,
  };

  try {
    // Upsert the voice profile
    const { data, error } = await supabase
      .from('user_pitch_settings')
      .upsert(voiceProfile, {
        onConflict: 'user_id',
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error seeding voice profile:', error);
      process.exit(1);
    }

    console.log('✅ Voice profile seeded successfully!\n');
    console.log('📋 Profile summary:');
    console.log(`   User: ${userId}`);
    console.log(`   Background: ${voiceProfile.voice_background.substring(0, 80)}...`);
    console.log(`   Style: ${voiceProfile.voice_style.substring(0, 80)}...`);
    console.log(`   Approach: ${voiceProfile.voice_approach.substring(0, 80)}...`);
    console.log('\n🎯 You can now test pitch generation with your authentic voice!');
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

seedChrisVoiceProfile()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
  });
