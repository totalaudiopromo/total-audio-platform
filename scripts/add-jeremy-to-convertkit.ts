#!/usr/bin/env ts-node

/**
 * Add Jeremy to ConvertKit Script
 *
 * Adds info@streamer.co.uk to ConvertKit with tags:
 * - beta-user
 * - artist
 * - streamer-band
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Try loading from root first, then apps/audio-intel
dotenv.config({ path: '.env.local' });
if (!process.env.CONVERTKIT_API_SECRET && !process.env.KIT_API_KEY) {
  dotenv.config({ path: path.join(__dirname, '../apps/audio-intel/.env.local') });
}

const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;
const CONVERTKIT_API_KEY = process.env.KIT_API_KEY || process.env.CONVERTKIT_API_KEY;

const JEREMY_EMAIL = 'info@streamer.co.uk';
const JEREMY_NAME = 'Streamer';
const TAGS = ['beta-user', 'artist', 'streamer-band'];

async function addToConvertKit() {
  try {
    if (!CONVERTKIT_API_SECRET && !CONVERTKIT_API_KEY) {
      console.error('❌ ConvertKit API credentials not found');
      console.error('\nPlease set one of these in .env.local or apps/audio-intel/.env.local:');
      console.error('  - CONVERTKIT_API_SECRET (preferred)');
      console.error('  - CONVERTKIT_API_KEY (alternative)');
      console.error('\nGet from: https://app.convertkit.com/account_settings/advanced_settings');
      throw new Error('ConvertKit API credentials not configured');
    }

    console.log(`📧 Adding ${JEREMY_EMAIL} to ConvertKit...\n`);

    // Step 1: Subscribe the user (creates subscriber if doesn't exist)
    console.log('Step 1: Creating/updating subscriber...');
    const subscribeResponse = await fetch('https://api.convertkit.com/v3/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_secret: CONVERTKIT_API_SECRET,
        email: JEREMY_EMAIL,
        first_name: JEREMY_NAME,
        fields: {
          source: 'beta-setup',
          signup_timestamp: new Date().toISOString(),
        },
        state: 'active', // Skip confirmation step
      }),
    });

    if (!subscribeResponse.ok) {
      const errorText = await subscribeResponse.text();
      console.error('❌ Failed to create subscriber:', errorText);

      // Try with API key instead
      if (CONVERTKIT_API_KEY) {
        console.log('\nTrying with API key instead...');
        const formResponse = await fetch('https://api.convertkit.com/v3/forms/8440957/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: CONVERTKIT_API_KEY,
            email: JEREMY_EMAIL,
            first_name: JEREMY_NAME,
            fields: {
              source: 'beta-setup',
            },
          }),
        });

        if (!formResponse.ok) {
          const formErrorText = await formResponse.text();
          throw new Error(`Failed with API key: ${formErrorText}`);
        }

        const formResult = await formResponse.json();
        console.log('✅ Subscriber created via form');

        // Get subscriber ID for tagging
        const subscriberId = formResult.subscription?.subscriber?.id;
        if (subscriberId) {
          await addTagsToSubscriber(subscriberId);
        } else {
          console.log('⚠️  Could not get subscriber ID, will try to tag by email');
          await addTagsByEmail();
        }
        return;
      }

      throw new Error(`Subscription failed: ${errorText}`);
    }

    const subscribeResult = await subscribeResponse.json();
    const subscriberId = subscribeResult.subscriber?.id;

    if (!subscriberId) {
      console.log('⚠️  Could not get subscriber ID from response, trying to tag by email');
      await addTagsByEmail();
      return;
    }

    console.log(`✅ Subscriber created/updated (ID: ${subscriberId})\n`);

    // Step 2: Add tags
    await addTagsToSubscriber(subscriberId);

    console.log('\n✅ Successfully added Jeremy to ConvertKit!');
    console.log(`   Email: ${JEREMY_EMAIL}`);
    console.log(`   Tags: ${TAGS.join(', ')}`);
  } catch (error) {
    console.error('❌ Error adding to ConvertKit:', error);
    throw error;
  }
}

async function addTagsToSubscriber(subscriberId: string) {
  console.log('Step 2: Adding tags...');

  for (const tag of TAGS) {
    try {
      // First, try to get tag ID
      const tagsResponse = await fetch(
        `https://api.convertkit.com/v3/tags?api_secret=${CONVERTKIT_API_SECRET}`
      );
      const tagsData = await tagsResponse.json();

      const tagObj = tagsData.tags?.find((t: any) => t.name.toLowerCase() === tag.toLowerCase());
      const tagId = tagObj?.id;

      if (!tagId) {
        console.log(`   ⚠️  Tag "${tag}" not found, creating it...`);
        // Create tag if it doesn't exist
        const createTagResponse = await fetch('https://api.convertkit.com/v3/tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_secret: CONVERTKIT_API_SECRET || undefined,
            api_key: CONVERTKIT_API_KEY || undefined,
            tag: { name: tag },
          }),
        });

        if (createTagResponse.ok) {
          const createResult = await createTagResponse.json();
          const newTagId = createResult.tag?.id;
          if (newTagId) {
            console.log(`   ✅ Created tag "${tag}" (ID: ${newTagId})`);
            await tagSubscriber(subscriberId, newTagId, tag);
          } else {
            console.log(`   ⚠️  Tag created but no ID returned for "${tag}"`);
          }
        } else {
          const errorText = await createTagResponse.text();
          console.log(`   ⚠️  Could not create tag "${tag}": ${errorText}`);
        }
      } else {
        await tagSubscriber(subscriberId, tagId, tag);
      }
    } catch (error) {
      console.error(`   ❌ Error processing tag "${tag}":`, error);
    }
  }
}

async function tagSubscriber(subscriberId: string, tagId: string, tagName: string) {
  const tagResponse = await fetch(`https://api.convertkit.com/v3/tags/${tagId}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_secret: CONVERTKIT_API_SECRET || undefined,
      api_key: CONVERTKIT_API_KEY || undefined,
      email: JEREMY_EMAIL,
    }),
  });

  if (tagResponse.ok) {
    console.log(`   ✅ Tagged with: ${tagName}`);
  } else {
    const errorText = await tagResponse.text();
    console.log(`   ⚠️  Failed to tag with "${tagName}": ${errorText}`);
  }
}

async function addTagsByEmail() {
  console.log('Step 2: Adding tags by email...');

  for (const tag of TAGS) {
    try {
      // Get tag ID first
      const tagsResponse = await fetch(
        `https://api.convertkit.com/v3/tags?api_secret=${CONVERTKIT_API_SECRET}`
      );
      const tagsData = await tagsResponse.json();

      const tagObj = tagsData.tags?.find((t: any) => t.name.toLowerCase() === tag.toLowerCase());
      const tagId = tagObj?.id;

      if (tagId) {
        const tagResponse = await fetch(`https://api.convertkit.com/v3/tags/${tagId}/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_secret: CONVERTKIT_API_SECRET,
            email: JEREMY_EMAIL,
          }),
        });

        if (tagResponse.ok) {
          console.log(`   ✅ Tagged with: ${tag}`);
        } else {
          console.log(`   ⚠️  Failed to tag with "${tag}"`);
        }
      } else {
        console.log(`   ⚠️  Tag "${tag}" not found, skipping`);
      }
    } catch (error) {
      console.error(`   ❌ Error tagging with "${tag}":`, error);
    }
  }
}

// Run the script
if (require.main === module) {
  addToConvertKit()
    .then(() => {
      console.log('\n🎉 Done!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Failed:', error);
      process.exit(1);
    });
}

export { addToConvertKit };
