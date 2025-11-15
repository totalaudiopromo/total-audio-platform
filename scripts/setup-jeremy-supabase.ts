#!/usr/bin/env ts-node

/**
 * Setup Jeremy in Supabase (for Audio Intel)
 *
 * Audio Intel uses Supabase for authentication, not Prisma.
 * This script creates Jeremy's account in Supabase and sets up beta access.
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Try loading from root first, then apps/audio-intel
dotenv.config({ path: '.env.local' });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  dotenv.config({ path: path.join(__dirname, '../apps/audio-intel/.env.local') });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const JEREMY_EMAIL = 'info@streamer.co.uk';
const JEREMY_PASSWORD = 'Streamer2024!BetaAccess';
const JEREMY_NAME = 'Streamer';

async function setupJeremyInSupabase() {
  try {
    if (!SUPABASE_URL) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL not found in environment variables');
    }

    if (!SUPABASE_SERVICE_KEY) {
      console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not found');
      console.warn('   Admin operations require service role key');
      console.warn('   Get from: Supabase Dashboard → Settings → API → service_role key');
      console.warn('   Falling back to anon key (limited functionality)\n');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY || '');

    console.log('🚀 Setting up Jeremy in Supabase for Audio Intel...\n');

    // Step 1: Check if user already exists
    console.log('Step 1: Checking if user exists...');
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();

    if (listError && !SUPABASE_SERVICE_KEY) {
      console.log('⚠️  Cannot check existing users without service key');
      console.log('   Proceeding with signup...\n');
    } else {
      const existingUser = existingUsers?.users?.find(u => u.email === JEREMY_EMAIL);

      if (existingUser) {
        console.log(`✅ User already exists (ID: ${existingUser.id})`);
        console.log('   Updating user profile...\n');

        // Update user profile in users table
        await updateUserProfile(supabase, existingUser.id);
        return;
      }
    }

    // Step 2: Create user in Supabase Auth
    console.log('Step 2: Creating user in Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: JEREMY_EMAIL,
      password: JEREMY_PASSWORD,
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        name: JEREMY_NAME,
        source: 'beta-setup',
      },
    });

    if (authError) {
      // If admin API fails, try regular signup
      if (
        authError.message.includes('already registered') ||
        authError.message.includes('already exists')
      ) {
        console.log('⚠️  User already exists, updating profile...');
        const { data: signInData } = await supabase.auth.signInWithPassword({
          email: JEREMY_EMAIL,
          password: JEREMY_PASSWORD,
        });
        if (signInData.user) {
          await updateUserProfile(supabase, signInData.user.id);
          return;
        }
      }
      throw authError;
    }

    if (!authData.user) {
      throw new Error('User creation failed - no user returned');
    }

    console.log(`✅ User created (ID: ${authData.user.id})\n`);

    // Step 3: Create/update user profile
    await updateUserProfile(supabase, authData.user.id);

    console.log('\n✅ Successfully set up Jeremy in Supabase!');
    console.log(`   Email: ${JEREMY_EMAIL}`);
    console.log(`   Password: ${JEREMY_PASSWORD}`);
    console.log(`   Beta Access: Enabled`);
    console.log(`   Enrichments Limit: 500`);
    console.log('\n⚠️  IMPORTANT: User must change password on first login!');
  } catch (error) {
    console.error('❌ Error setting up in Supabase:', error);
    throw error;
  }
}

async function updateUserProfile(supabase: any, userId: string) {
  console.log('Step 3: Creating/updating user profile...');

  // Check if users table exists and create profile
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError && profileError.code === 'PGRST116') {
    // Table doesn't exist or no row - create it
    console.log('   Creating user profile...');
    const { error: insertError } = await supabase.from('users').insert({
      id: userId,
      email: JEREMY_EMAIL,
      enrichments_used: 0,
      enrichments_limit: 500,
      subscription_tier: 'beta',
      beta_access: true,
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      console.warn(`   ⚠️  Could not create profile: ${insertError.message}`);
      console.warn('   Profile may need to be created manually in Supabase dashboard');
    } else {
      console.log('   ✅ User profile created');
    }
  } else if (profile) {
    // Update existing profile
    console.log('   Updating existing profile...');
    const { error: updateError } = await supabase
      .from('users')
      .update({
        enrichments_limit: 500,
        subscription_tier: 'beta',
        beta_access: true,
      })
      .eq('id', userId);

    if (updateError) {
      console.warn(`   ⚠️  Could not update profile: ${updateError.message}`);
    } else {
      console.log('   ✅ User profile updated');
    }
  } else {
    console.log('   ✅ User profile exists');
  }
}

// Run the script
if (require.main === module) {
  setupJeremyInSupabase()
    .then(() => {
      console.log('\n🎉 Setup complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Setup failed:', error);
      process.exit(1);
    });
}

export { setupJeremyInSupabase };
