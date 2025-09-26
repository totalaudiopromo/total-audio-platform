#!/usr/bin/env node

/**
 * Improved Typeform Search for Artist Names
 * 
 * This searches through ALL Typeform responses to find artists by name,
 * regardless of their email address
 */

const TypeformApiIntegration = require('./integrations/typeform-api');

async function improvedTypeformSearch() {
  console.log('🔍 Improved Typeform Search for Artist Names...\n');
  
  const typeform = new TypeformApiIntegration();
  
  try {
    console.log('📋 Step 1: Getting all recent forms...');
    const forms = await typeform.getRecentForms();
    console.log(`✅ Found ${forms.length} forms to search`);
    console.log('');
    
    console.log('🎵 Step 2: Searching for "Senior Dunce" across all responses...');
    
    const artistName = 'Senior Dunce';
    const foundResponses = [];
    
    for (const form of forms) {
      console.log(`   Searching form: ${form.title} (${form.id})`);
      
      try {
        const responses = await typeform.getFormResponses(form.id);
        console.log(`     Found ${responses.length} responses`);
        
        // Search through all responses for the artist name
        for (const response of responses) {
          const responseText = JSON.stringify(response).toLowerCase();
          
          // Check if artist name appears in any field
          if (responseText.includes(artistName.toLowerCase())) {
            console.log(`     ✅ Found "${artistName}" in response ${response.token}`);
            foundResponses.push({
              formId: form.id,
              formTitle: form.title,
              responseToken: response.token,
              response: response
            });
          }
        }
      } catch (error) {
        console.log(`     ❌ Error searching form: ${error.message}`);
      }
    }
    
    console.log('');
    console.log(`🎯 Results: Found ${foundResponses.length} responses containing "${artistName}"`);
    console.log('');
    
    if (foundResponses.length > 0) {
      console.log('📋 Detailed Results:');
      foundResponses.forEach((result, index) => {
        console.log(`\n${index + 1}. Form: ${result.formTitle}`);
        console.log(`   Response Token: ${result.responseToken}`);
        console.log(`   Form ID: ${result.formId}`);
        
        // Extract key information from the response
        const answers = result.response.answers || [];
        console.log('   Key Information:');
        
        answers.forEach(answer => {
          if (answer.field && answer.field.title) {
            const fieldTitle = answer.field.title;
            const answerValue = typeform.extractAnswerValue(answer);
            
            // Look for specific fields we care about
            if (fieldTitle.toLowerCase().includes('artist') ||
                fieldTitle.toLowerCase().includes('name') ||
                fieldTitle.toLowerCase().includes('genre') ||
                fieldTitle.toLowerCase().includes('track') ||
                fieldTitle.toLowerCase().includes('release') ||
                fieldTitle.toLowerCase().includes('email')) {
              console.log(`     ${fieldTitle}: ${answerValue}`);
            }
          }
        });
      });
      
      console.log('');
      console.log('💡 Next Steps:');
      console.log('1. Use this data to create accurate campaign information');
      console.log('2. Extract the correct genre from the actual response');
      console.log('3. Get the real artist email and contact details');
      console.log('4. Use this for proper Monday.com campaign creation');
      
    } else {
      console.log('❌ No responses found containing "Senior Dunce"');
      console.log('');
      console.log('💡 Possible reasons:');
      console.log('1. Artist name might be spelled differently');
      console.log('2. Response might be in a different form');
      console.log('3. Response might be older than the search range');
      console.log('');
      console.log('🔧 Try searching with different variations:');
      console.log('- "Senior Dunce"');
      console.log('- "senior dunce"');
      console.log('- "SeniorDunce"');
      console.log('- "Dunce"');
    }
    
    return foundResponses;
    
  } catch (error) {
    console.error('❌ Improved Typeform search failed:', error.message);
    return [];
  }
}

// Run the improved search
improvedTypeformSearch().then(results => {
  if (results.length > 0) {
    console.log('\n🎉 Search completed successfully!');
    console.log(`Found ${results.length} matching responses.`);
  } else {
    console.log('\n⚠️  No matching responses found.');
  }
});


