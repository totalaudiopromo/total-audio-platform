#!/usr/bin/env node

/**
 * Setup Demo Voice Profile for Chris Schofield (sadact)
 * This creates a pre-configured authentic voice for demos
 */

const DEMO_VOICE_PROFILE = {
  user_id: 'demo@totalaudiopromo.com', // Demo user email
  voice_background: 'Chris Schofield, producer behind sadact - 5+ years in radio promotion with direct experience pitching to BBC Radio 1, 6 Music, and independent stations. Built Audio Intel because I needed better tools for my own campaigns.',
  voice_style: 'British casual-professional. Direct and authentic, no corporate speak. Uses phrases like "Right, so..." and "tbh". Industry insider who actually does this work daily.',
  voice_achievements: 'Successfully pitched sadact to BBC Radio 1, BBC 6 Music. Built relationships with tastemakers like Jack Saunders and Huw Stephens. Created Audio Intel to solve my own contact research problems - now helping other artists do the same.',
  voice_approach: 'Lead with authenticity and real industry experience. Focus on genuine relationship-building rather than spam pitching. Emphasize that tools like Audio Intel exist because I use them for my own campaigns.',
  voice_differentiator: 'Actually a working producer and radio promoter, not just a tool seller. Built by someone who pitches music every week. Understanding of UK music industry from inside.',
  voice_typical_opener: 'Hi [Name], I\'ve been working on some new music under my sadact project and thought you might find it interesting for [show/playlist]. I use Audio Intel for my contact research...',
  voice_context_notes: 'Keep it real. No over-hyping. British spelling always. Reference actual industry experience. Make it clear this is from someone who actually does radio promotion.',
  voice_profile_completed: true,
};

console.log('📝 Demo Voice Profile Configuration');
console.log('=====================================\n');
console.log('User ID:', DEMO_VOICE_PROFILE.user_id);
console.log('\n🎯 Profile Summary:');
console.log('- Background:', DEMO_VOICE_PROFILE.voice_background.substring(0, 100) + '...');
console.log('- Style:', DEMO_VOICE_PROFILE.voice_style.substring(0, 100) + '...');
console.log('- Approach:', DEMO_VOICE_PROFILE.voice_approach.substring(0, 100) + '...');
console.log('\n✅ Ready to use for demos!');
console.log('\nTo import this into Supabase:');
console.log('1. Go to Supabase > user_pitch_settings table');
console.log('2. Insert new row with above values');
console.log('3. Or run: node setup-demo-voice.js --import');

// Export for programmatic use
module.exports = DEMO_VOICE_PROFILE;
