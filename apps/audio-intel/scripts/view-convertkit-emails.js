/**
 * View ConvertKit Email Sequence Content
 * Lists all broadcasts in sequence #2453581
 */

require('dotenv').config({ path: '.env.local' });

const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;
const SEQUENCE_ID = '2453581';

async function viewSequenceEmails() {
  console.log('📧 Fetching ConvertKit sequence emails...\n');

  try {
    // Get sequence details
    const sequenceUrl = `https://api.convertkit.com/v3/sequences/${SEQUENCE_ID}?api_secret=${CONVERTKIT_API_SECRET}`;
    const sequenceResponse = await fetch(sequenceUrl);
    const sequenceData = await sequenceResponse.json();

    console.log(`Sequence: ${sequenceData.course?.name || 'Unknown'}`);
    console.log(`Total Subscribers: ${sequenceData.course?.total_subscriptions || 0}\n`);

    // Get broadcasts in sequence
    const broadcastsUrl = `https://api.convertkit.com/v3/sequences/${SEQUENCE_ID}/subscriptions?api_secret=${CONVERTKIT_API_SECRET}`;
    const broadcastsResponse = await fetch(broadcastsUrl);
    const broadcastsData = await broadcastsResponse.json();

    console.log(`Found ${broadcastsData.total_subscriptions || 0} subscriptions\n`);

    // List broadcasts
    console.log('📨 To view/edit emails, visit:');
    console.log(`https://app.convertkit.com/sequences/${SEQUENCE_ID}/edit\n`);

    console.log('✅ Note: Email content can only be edited via ConvertKit dashboard');
    console.log('   We can update via API once we have the broadcast IDs');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

viewSequenceEmails();
