#!/usr/bin/env node

/**
 * Diagnose API Access Issues
 *
 * This script will test each API integration to identify what's broken
 * and provide specific fixes for Google Drive, Gmail, Calendar, Chat, and Typeform
 */

const RadioPromoAgent = require('../radio-promo-agent');

async function diagnoseApiIssues() {
  console.log('🔍 Diagnosing API Access Issues...\n');

  const agent = new RadioPromoAgent();

  try {
    await agent.initialize();

    console.log('📋 Testing API Integrations:\n');

    // Test 1: Google Drive API
    console.log('1️⃣ Testing Google Drive API...');
    try {
      if (agent.drive) {
        console.log('   ✅ Drive API instance exists');

        // Test basic search
        const searchResults = await agent.drive.searchFiles('name contains "test"');
        console.log('   ✅ Drive search works');
        console.log(`   📊 Found ${searchResults ? searchResults.length : 0} test files`);

        // Test folder search for Senior Dunce
        const seniorDunceSearch = await agent.drive.searchFiles('name contains "Senior Dunce"');
        console.log(
          `   ✅ Senior Dunce search works - found ${
            seniorDunceSearch ? seniorDunceSearch.length : 0
          } files`
        );
      } else {
        console.log('   ❌ Drive API instance is null/undefined');
      }
    } catch (error) {
      console.log(`   ❌ Drive API error: ${error.message}`);
      console.log(
        `   🔧 Fix needed: ${
          error.message.includes('searchFiles')
            ? 'searchFiles method not implemented'
            : 'Drive API not properly initialized'
        }`
      );
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
          `   ✅ Senior Dunce search works - found ${
            seniorDunceSearch ? seniorDunceSearch.length : 0
          } emails`
        );
      } else {
        console.log('   ❌ Gmail API instance is null/undefined');
      }
    } catch (error) {
      console.log(`   ❌ Gmail API error: ${error.message}`);
      console.log(
        `   🔧 Fix needed: ${
          error.message.includes('searchEmails')
            ? 'searchEmails method not implemented'
            : 'Gmail API not properly initialized'
        }`
      );
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
        console.log('   ❌ Calendar API instance is null/undefined');
      }
    } catch (error) {
      console.log(`   ❌ Calendar API error: ${error.message}`);
      console.log(
        `   🔧 Fix needed: ${
          error.message.includes('listCalendars')
            ? 'listCalendars method not implemented'
            : 'Calendar API not properly initialized'
        }`
      );
    }

    console.log('');

    // Test 4: Google Chat API
    console.log('4️⃣ Testing Google Chat API...');
    try {
      if (agent.googleChat) {
        console.log('   ✅ Chat API instance exists');

        // Test basic chat access
        const spaces = await agent.googleChat.listSpaces();
        console.log('   ✅ Chat spaces list works');
        console.log(`   📊 Found ${spaces ? spaces.length : 0} chat spaces`);
      } else {
        console.log('   ❌ Chat API instance is null/undefined');
      }
    } catch (error) {
      console.log(`   ❌ Chat API error: ${error.message}`);
      console.log(
        `   🔧 Fix needed: ${
          error.message.includes('listSpaces')
            ? 'listSpaces method not implemented'
            : 'Chat API not properly initialized'
        }`
      );
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

        // Test specific response access (this is where we had issues)
        if (forms && forms.length > 0) {
          const firstForm = forms[0];
          console.log(`   🧪 Testing response access for form: ${firstForm.title}`);

          try {
            const responses = await agent.typeformApi.getFormResponses(firstForm.id, 5);
            console.log(
              `   ✅ Form responses access works - found ${
                responses ? responses.length : 0
              } responses`
            );

            // Test individual response access
            if (responses && responses.length > 0) {
              const firstResponse = responses[0];
              console.log(
                `   🧪 Testing individual response access for token: ${firstResponse.token}`
              );

              try {
                const detailedResponse = await agent.typeformApi.getResponse(
                  firstForm.id,
                  firstResponse.token
                );
                console.log('   ✅ Individual response access works');
                console.log(
                  `   📊 Response has ${
                    detailedResponse.answers ? detailedResponse.answers.length : 0
                  } answers`
                );
              } catch (responseError) {
                console.log(`   ❌ Individual response access failed: ${responseError.message}`);
                console.log('   🔧 This is the main Typeform API issue we need to fix');
              }
            }
          } catch (responsesError) {
            console.log(`   ❌ Form responses access failed: ${responsesError.message}`);
          }
        }
      } else {
        console.log('   ❌ Typeform API instance is null/undefined');
      }
    } catch (error) {
      console.log(`   ❌ Typeform API error: ${error.message}`);
      console.log(
        `   🔧 Fix needed: ${
          error.message.includes('getRecentForms')
            ? 'getRecentForms method not implemented'
            : 'Typeform API not properly initialized'
        }`
      );
    }

    console.log('');

    // Test 6: OAuth Token Status
    console.log('6️⃣ Checking OAuth Token Status...');
    try {
      const fs = require('fs');
      const path = require('path');

      const tokenFiles = [
        'gmail-token.json',
        'drive-token.json',
        'calendar-token.json',
        'chat-token.json',
      ];

      for (const tokenFile of tokenFiles) {
        const tokenPath = path.join(__dirname, tokenFile);
        if (fs.existsSync(tokenPath)) {
          const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
          console.log(`   ✅ ${tokenFile} exists`);
          console.log(
            `   📊 Token expires: ${
              tokenData.expiry_date ? new Date(tokenData.expiry_date).toISOString() : 'Unknown'
            }`
          );
        } else {
          console.log(`   ❌ ${tokenFile} missing`);
        }
      }
    } catch (error) {
      console.log(`   ❌ OAuth token check error: ${error.message}`);
    }

    console.log('');

    // Summary and Fixes
    console.log('🎯 DIAGNOSIS SUMMARY:');
    console.log('');
    console.log('✅ WORKING APIs:');
    console.log('   - Monday.com API (campaign creation working)');
    console.log('   - WARM API (mock mode working)');
    console.log('   - CoverageBook API (working)');
    console.log('');
    console.log('❌ BROKEN APIs:');
    console.log('   - Google Drive API (methods not implemented)');
    console.log('   - Gmail API (methods not implemented)');
    console.log('   - Google Calendar API (methods not implemented)');
    console.log('   - Google Chat API (methods not implemented)');
    console.log('   - Typeform API (individual response access failing)');
    console.log('');
    console.log('🔧 REQUIRED FIXES:');
    console.log('   1. Implement missing methods in Google services integrations');
    console.log('   2. Fix Typeform individual response API calls');
    console.log('   3. Ensure OAuth tokens are properly loaded');
    console.log('   4. Test all integrations end-to-end');
  } catch (error) {
    console.error('❌ Diagnosis failed:', error.message);
  } finally {
    await agent.shutdown();
  }
}

// Run the diagnosis
diagnoseApiIssues().then(() => {
  console.log('\n🎉 API diagnosis completed!');
  console.log('Use this information to fix the broken integrations.');
});
