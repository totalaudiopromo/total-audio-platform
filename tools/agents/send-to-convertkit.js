#!/usr/bin/env node

/**
 * ConvertKit Newsletter Distribution
 * Sends approved newsletter content to ConvertKit for distribution
 */

require('dotenv').config({ path: '../../apps/audio-intel/.env.local' });
const axios = require('axios');

const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;

console.log('\n📧 CONVERTKIT NEWSLETTER DISTRIBUTION\n');
console.log('━'.repeat(80));

// Check API credentials
if (!CONVERTKIT_API_KEY || CONVERTKIT_API_KEY === 'your_convertkit_api_key_here') {
  console.log('\n❌ ConvertKit API credentials not configured');
  console.log('\nTo set up ConvertKit:');
  console.log('1. Get your API key from ConvertKit dashboard');
  console.log('2. Add to apps/audio-intel/.env.local:');
  console.log('   CONVERTKIT_API_KEY=your_key_here');
  console.log('   CONVERTKIT_API_SECRET=your_secret_here\n');
  process.exit(1);
}

console.log(`\n✓ ConvertKit API Key: ${CONVERTKIT_API_KEY.slice(0, 10)}...`);
console.log(`✓ ConvertKit API Secret: ${CONVERTKIT_API_SECRET.slice(0, 10)}...\n`);

async function testConvertKitConnection() {
  try {
    console.log('🔍 Testing ConvertKit connection...\n');

    // Get account info
    const accountResponse = await axios.get(
      `https://api.convertkit.com/v3/account?api_secret=${CONVERTKIT_API_SECRET}`
    );

    console.log('✓ Connected to ConvertKit account:');
    console.log(`  Name: ${accountResponse.data.name}`);
    console.log(`  Primary email: ${accountResponse.data.primary_email_address}\n`);

    // Get forms
    const formsResponse = await axios.get(
      `https://api.convertkit.com/v3/forms?api_key=${CONVERTKIT_API_KEY}`
    );

    console.log(`✓ Found ${formsResponse.data.forms.length} ConvertKit forms:`);
    formsResponse.data.forms.forEach(form => {
      console.log(`  - ${form.name} (ID: ${form.id}) - ${form.subscription_count} subscribers`);
    });

    return { success: true, forms: formsResponse.data.forms };
  } catch (error) {
    console.error('\n❌ ConvertKit connection failed:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}

async function createNewsletterBroadcast(subject, content, formId = null) {
  try {
    console.log('\n📨 Creating newsletter broadcast...\n');

    const broadcastData = {
      subject: subject,
      content: content,
      public: false, // Keep as draft for review
      published_at: null, // Don't schedule yet
    };

    const response = await axios.post(`https://api.convertkit.com/v3/broadcasts`, {
      api_key: CONVERTKIT_API_KEY,
      ...broadcastData,
    });

    if (response.status === 201) {
      console.log('✓ Newsletter broadcast created successfully!');
      console.log(`  Broadcast ID: ${response.data.broadcast.id}`);
      console.log(`  Subject: ${response.data.broadcast.subject}`);
      console.log(`  Status: Draft (ready for your review)\n`);
      console.log('🎯 Next steps:');
      console.log('  1. Log into ConvertKit dashboard');
      console.log('  2. Review the broadcast content');
      console.log('  3. Schedule or send immediately\n');
      return { success: true, broadcastId: response.data.broadcast.id };
    }
  } catch (error) {
    console.error('\n❌ Failed to create broadcast:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  // Test connection first
  const connectionTest = await testConvertKitConnection();

  if (!connectionTest.success) {
    console.log('\n❌ ConvertKit connection test failed. Check your API credentials.\n');
    return;
  }

  console.log('\n━'.repeat(80));
  console.log('\n✅ CONVERTKIT INTEGRATION STATUS: READY\n');
  console.log('📧 You can now send newsletters to ConvertKit');
  console.log('💡 Newsletter automation agent will:');
  console.log('   1. Generate content from RSS feeds');
  console.log('   2. Create broadcast in ConvertKit (as draft)');
  console.log('   3. Wait for your approval');
  console.log('   4. You schedule/send from ConvertKit dashboard\n');

  console.log('🎯 To send a test newsletter:');
  console.log('   node send-to-convertkit.js --test\n');

  // If --test flag, send a sample newsletter
  if (process.argv.includes('--test')) {
    console.log('━'.repeat(80));
    console.log('\n📤 SENDING TEST NEWSLETTER...\n');

    const testSubject = 'The Unsigned Advantage - Test Newsletter';
    const testContent = `
      <h1>This Week's Industry Intel</h1>

      <p>Right, so whilst the music industry is making moves, here's why that's actually brilliant news for independent artists...</p>

      <p>Here's the thing though... Professional production tools are now accessible to bedroom producers - the playing field is levelling.</p>

      <p>After 5+ years in radio promotion, this kind of shift happens every few years, and indies who spot it early always come out ahead.</p>

      <p>The opportunity here is simple: technology access equality.</p>

      <p><strong>Your move:</strong> Master production tools that major label artists pay thousands for</p>

      <hr>

      <p><em>💡 Audio Intel helps indies move faster on opportunities like this</em></p>

      <p><a href="https://intel.totalaudiopromo.com">Try Audio Intel Free</a></p>
    `;

    await createNewsletterBroadcast(testSubject, testContent);
  }

  console.log('━'.repeat(80));
}

main().catch(console.error);
