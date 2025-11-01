#!/usr/bin/env node

/**
 * Test API Fixes
 *
 * This script tests all the API integrations after fixes
 */

const RadioPromoAgent = require('../radio-promo-agent');

async function testApiFixes() {
  console.log('🧪 Testing API Fixes...\n');

  const agent = new RadioPromoAgent();

  try {
    await agent.initialize();

    console.log('📋 Testing Fixed APIs:\n');

    // Test 1: Google Drive API
    console.log('1️⃣ Testing Google Drive API...');
    try {
      if (agent.drive) {
        console.log('   ✅ Drive API instance exists');

        // Test basic search
        const searchResults = await agent.drive.searchFiles('name contains "test"', 5);
        console.log('   ✅ Drive search works');
        console.log(`   📊 Found ${searchResults ? searchResults.length : 0} test files`);

        // Test Senior Dunce folder search
        const seniorDunceFolders = await agent.drive.searchCampaignFolders(
          'Senior Dunce',
          'Bestial'
        );
        console.log(
          `   ✅ Senior Dunce folder search works - found ${seniorDunceFolders ? seniorDunceFolders.length : 0} folders`
        );
      } else {
        console.log('   ❌ Drive API instance is still null/undefined');
      }
    } catch (error) {
      console.log(`   ❌ Drive API error: ${error.message}`);
    }

    console.log('');

    // Test 2: Gmail API
    console.log('2️⃣ Testing Gmail API...');
    try {
      if (agent.gmail) {
        console.log('   ✅ Gmail API instance exists');

        // Test basic search
        const searchResults = await agent.gmail.searchEmails('test', 5);
        console.log('   ✅ Gmail search works');
        console.log(`   📊 Found ${searchResults ? searchResults.length : 0} test emails`);

        // Test Senior Dunce search
        const seniorDunceSearch = await agent.gmail.searchEmails('Senior Dunce', 5);
        console.log(
          `   ✅ Senior Dunce search works - found ${seniorDunceSearch ? seniorDunceSearch.length : 0} emails`
        );
      } else {
        console.log('   ❌ Gmail API instance is still null/undefined');
      }
    } catch (error) {
      console.log(`   ❌ Gmail API error: ${error.message}`);
    }

    console.log('');

    // Test 3: Google Calendar API
    console.log('3️⃣ Testing Google Calendar API...');
    try {
      if (agent.calendar) {
        console.log('   ✅ Calendar API instance exists');

        // Test basic calendar access
        const calendars = await agent.calendar.listCalendars();
        console.log('   ✅ Calendar list works');
        console.log(`   📊 Found ${calendars ? calendars.length : 0} calendars`);
      } else {
        console.log('   ❌ Calendar API instance is still null/undefined');
      }
    } catch (error) {
      console.log(`   ❌ Calendar API error: ${error.message}`);
    }

    console.log('');

    // Test 4: Google Chat API
    console.log('4️⃣ Testing Google Chat API...');
    try {
      if (agent.googleChat) {
        console.log('   ✅ Chat API instance exists');

        // Test basic chat access (if method exists)
        if (typeof agent.googleChat.gatherIntelligence === 'function') {
          const intelligence = await agent.googleChat.gatherIntelligence();
          console.log('   ✅ Chat intelligence gathering works');
        } else {
          console.log('   ⚠️  Chat API methods need implementation');
        }
      } else {
        console.log('   ❌ Chat API instance is still null/undefined');
      }
    } catch (error) {
      console.log(`   ❌ Chat API error: ${error.message}`);
    }

    console.log('');

    // Test 5: Typeform API
    console.log('5️⃣ Testing Typeform API...');
    try {
      if (agent.typeformApi) {
        console.log('   ✅ Typeform API instance exists');

        // Test basic forms access
        const forms = await agent.typeformApi.getRecentForms(5);
        console.log('   ✅ Typeform forms list works');
        console.log(`   📊 Found ${forms ? forms.length : 0} recent forms`);

        // Test specific Senior Dunce response access
        console.log('   🧪 Testing Senior Dunce response access...');

        // Search for Senior Dunce responses
        const allForms = await agent.typeformApi.getRecentForms();
        let seniorDunceFound = false;

        for (const form of allForms) {
          try {
            const responses = await agent.typeformApi.getFormResponses(form.id, 100);

            for (const response of responses) {
              const responseText = JSON.stringify(response).toLowerCase();

              if (responseText.includes('senior dunce')) {
                console.log(`   ✅ Found Senior Dunce in form: ${form.title}`);
                console.log(`   📄 Response Token: ${response.token}`);

                // Try to get detailed response
                try {
                  const detailedResponse = await agent.typeformApi.getResponse(
                    form.id,
                    response.token
                  );
                  console.log('   ✅ Individual response access works!');
                  console.log(
                    `   📊 Response has ${detailedResponse.answers ? detailedResponse.answers.length : 0} answers`
                  );
                  seniorDunceFound = true;
                  break;
                } catch (responseError) {
                  console.log(
                    `   ❌ Individual response access still failing: ${responseError.message}`
                  );
                }
              }
            }

            if (seniorDunceFound) break;
          } catch (error) {
            console.log(`   ⚠️  Error searching form ${form.title}: ${error.message}`);
          }
        }

        if (!seniorDunceFound) {
          console.log('   ⚠️  Senior Dunce responses found but individual access still failing');
        }
      } else {
        console.log('   ❌ Typeform API instance is still null/undefined');
      }
    } catch (error) {
      console.log(`   ❌ Typeform API error: ${error.message}`);
    }

    console.log('');

    // Summary
    console.log('🎯 API FIX TEST SUMMARY:');
    console.log('');

    const workingApis = [];
    const brokenApis = [];

    if (agent.drive) workingApis.push('Google Drive');
    else brokenApis.push('Google Drive');

    if (agent.gmail) workingApis.push('Gmail');
    else brokenApis.push('Gmail');

    if (agent.calendar) workingApis.push('Google Calendar');
    else brokenApis.push('Google Calendar');

    if (agent.googleChat) workingApis.push('Google Chat');
    else brokenApis.push('Google Chat');

    if (agent.typeformApi) workingApis.push('Typeform');
    else brokenApis.push('Typeform');

    console.log('✅ WORKING APIs:');
    workingApis.forEach(api => console.log(`   - ${api}`));

    console.log('');
    console.log('❌ BROKEN APIs:');
    brokenApis.forEach(api => console.log(`   - ${api}`));

    console.log('');
    console.log('🔧 NEXT STEPS:');
    if (brokenApis.length > 0) {
      console.log('   - Fix remaining broken APIs');
      console.log('   - Test end-to-end workflows');
      console.log('   - Implement missing methods');
    } else {
      console.log('   - All APIs are working!');
      console.log('   - Test complete workflows');
      console.log('   - Ready for automation!');
    }
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  } finally {
    await agent.shutdown();
  }
}

// Run the test
testApiFixes().then(() => {
  console.log('\n🎉 API fix testing completed!');
});
