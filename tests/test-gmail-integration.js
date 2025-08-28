const fetch = require('node-fetch');

async function testGmailIntegration() {
  console.log('🧪 Testing Gmail Integration...\n');

  const baseUrl = 'http://localhost:3001';
  
  // Test 1: Health endpoint
  console.log('1. Testing health endpoint...');
  try {
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health endpoint working:', healthData);
    } else {
      console.log('❌ Health endpoint failed:', healthResponse.status);
    }
  } catch (error) {
    console.log('❌ Health endpoint error:', error.message);
  }

  // Test 2: Gmail auth endpoint
  console.log('\n2. Testing Gmail auth endpoint...');
  try {
    const gmailResponse = await fetch(`${baseUrl}/api/gmail/auth`);
    if (gmailResponse.ok) {
      const gmailData = await gmailResponse.json();
      console.log('✅ Gmail auth endpoint working:', gmailData);
    } else {
      console.log('❌ Gmail auth endpoint failed:', gmailResponse.status);
      const errorText = await gmailResponse.text();
      console.log('Error details:', errorText);
    }
  } catch (error) {
    console.log('❌ Gmail auth endpoint error:', error.message);
  }

  // Test 3: Frontend integration page
  console.log('\n3. Testing frontend integration page...');
  try {
    const frontendResponse = await fetch('http://localhost:3000/integrations');
    if (frontendResponse.ok) {
      console.log('✅ Frontend integration page working');
    } else {
      console.log('❌ Frontend integration page failed:', frontendResponse.status);
    }
  } catch (error) {
    console.log('❌ Frontend integration page error:', error.message);
  }

  console.log('\n🎉 Testing complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Open http://localhost:3000/integrations in your browser');
  console.log('2. Click "Connect" on the Gmail integration');
  console.log('3. Complete the OAuth flow');
  console.log('4. Test sending emails and tracking replies');
}

testGmailIntegration().catch(console.error); 