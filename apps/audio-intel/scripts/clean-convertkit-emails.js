/**
 * Clean ConvertKit Email Sequence - Remove ALL Emojis
 * Uses ConvertKit API to update broadcast content
 */

require('dotenv').config({ path: '.env.local' });

const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;
const SEQUENCE_ID = '2453581';

// Broadcast IDs for each email in the sequence
const EMAILS = {
  email1: null, // We'll find these by listing broadcasts
  email2: null,
  email3: null,
  email4: null,
};

function removeAllEmojis(text) {
  // Remove ALL emojis completely
  return text
    .replace(/🎵/g, '')
    .replace(/📊/g, '')
    .replace(/👉/g, '')
    .replace(/💡/g, '')
    .replace(/♪/g, '')
    .replace(/⚡/g, '')
    .replace(/🚀/g, '')
    .replace(/✨/g, '')
    .replace(/🤖/g, '')
    .replace(/📈/g, '')
    .replace(/💼/g, '')
    .replace(/⏰/g, '')
    .replace(/🎯/g, '')
    .replace(/🔥/g, '')
    .replace(/💪/g, '')
    .replace(/📢/g, '')
    .replace(/🎉/g, '');
}

function addCountdownToEmail4(text) {
  // Replace clock emoji with text countdown
  let updated = text.replace(/⏰.*?trial/gi, 'Trial Status: Day 7/14 (7 days remaining)');

  // If no clock emoji found, add countdown at appropriate place
  if (!updated.includes('Trial Status:')) {
    updated = updated.replace(
      /halfway/gi,
      'halfway through your trial.\n\nTrial Status: Day 7/14 (7 days remaining)'
    );
  }

  return updated;
}

async function cleanEmails() {
  console.log('🧹 Cleaning ConvertKit emails - removing all emojis...\n');

  try {
    // Note: ConvertKit API doesn't provide direct access to sequence email content
    // We need to use the dashboard or find the broadcast IDs

    console.log('⚠️  ConvertKit API Limitation:');
    console.log("   The API doesn't expose sequence email content directly.");
    console.log('   You need to edit emails via the dashboard.\n');

    console.log('📝 Manual Steps Required:');
    console.log('   1. Go to: https://app.convertkit.com/sequences/2453581/edit');
    console.log('   2. Click "Content" tab');
    console.log('   3. For each email, remove these emojis:');
    console.log('      🎵 📊 👉 💡 ♪ ⚡ 🚀 ✨ 🤖 📈 💼 ⏰ 🎯\n');
    console.log('   4. For Email 4 (Day 7), add:');
    console.log('      "Trial Status: Day 7/14 (7 days remaining)"\n');

    console.log('✅ Alternatively, use Puppeteer (browser automation) to make the changes.');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

cleanEmails();
