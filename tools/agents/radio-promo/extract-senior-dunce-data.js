#!/usr/bin/env node

/**
 * Extract Detailed Data for Senior Dunce from Typeform Responses
 */

const TypeformApiIntegration = require('./integrations/typeform-api');

async function extractSeniorDunceData() {
  console.log('🔍 Extracting Detailed Data for Senior Dunce...\n');
  
  const typeform = new TypeformApiIntegration();
  
  try {
    // The responses we found
    const seniorDunceResponses = [
      { formId: 'pwWZ30RH', token: '1ji7bnq1gdkqec8yw1ji7b1ykvckg4q1', formTitle: 'Asset Form NEW' },
      { formId: 'n7oJpRGA', token: 'n24ddnp25a21708lfxzgn24diido2d1y', formTitle: 'Playlisting questionairre' },
      { formId: 'C7z5cD', token: 'wm1e19y2ve9wvc9kwm1e1u5o0snlspe1', formTitle: 'Personality Questions for Press' }
    ];
    
    console.log('📋 Extracting data from 3 Senior Dunce responses...');
    console.log('');
    
    const extractedData = [];
    
    for (const responseInfo of seniorDunceResponses) {
      console.log(`🎵 Form: ${responseInfo.formTitle}`);
      console.log(`   Token: ${responseInfo.token}`);
      
      try {
        // Get the specific response
        const response = await typeform.getResponse(responseInfo.formId, responseInfo.token);
        
        if (response && response.answers) {
          const formData = {
            formTitle: responseInfo.formTitle,
            formId: responseInfo.formId,
            token: responseInfo.token,
            submittedAt: response.submitted_at,
            answers: {}
          };
          
          console.log(`   ✅ Retrieved response data`);
          console.log(`   📅 Submitted: ${response.submitted_at}`);
          
          // Extract all answers
          response.answers.forEach(answer => {
            if (answer.field && answer.field.title) {
              const fieldTitle = answer.field.title;
              const answerValue = typeform.extractAnswerValue(answer);
              formData.answers[fieldTitle] = answerValue;
              
              // Log important fields
              if (fieldTitle.toLowerCase().includes('artist') ||
                  fieldTitle.toLowerCase().includes('name') ||
                  fieldTitle.toLowerCase().includes('genre') ||
                  fieldTitle.toLowerCase().includes('track') ||
                  fieldTitle.toLowerCase().includes('release') ||
                  fieldTitle.toLowerCase().includes('email') ||
                  fieldTitle.toLowerCase().includes('song') ||
                  fieldTitle.toLowerCase().includes('title') ||
                  fieldTitle.toLowerCase().includes('style') ||
                  fieldTitle.toLowerCase().includes('type')) {
                console.log(`     ${fieldTitle}: ${answerValue}`);
              }
            }
          });
          
          extractedData.push(formData);
        }
        
      } catch (error) {
        console.log(`   ❌ Error retrieving response: ${error.message}`);
      }
      
      console.log('');
    }
    
    console.log('🎯 Summary of Extracted Data:');
    console.log('==============================');
    
    // Try to build a complete picture of Senior Dunce
    const artistData = {
      artistName: 'Senior Dunce',
      forms: extractedData,
      consolidatedInfo: {}
    };
    
    // Consolidate information from all forms
    extractedData.forEach(form => {
      Object.entries(form.answers).forEach(([field, value]) => {
        const key = field.toLowerCase();
        
        // Map important fields
        if (key.includes('artist') || key.includes('name')) {
          artistData.consolidatedInfo.artistName = value;
        } else if (key.includes('track') || key.includes('song') || key.includes('title')) {
          artistData.consolidatedInfo.trackName = value;
        } else if (key.includes('genre') || key.includes('style') || key.includes('type')) {
          artistData.consolidatedInfo.genre = value;
        } else if (key.includes('email')) {
          artistData.consolidatedInfo.email = value;
        } else if (key.includes('release')) {
          artistData.consolidatedInfo.releaseDate = value;
        }
      });
    });
    
    console.log('📊 Consolidated Artist Information:');
    Object.entries(artistData.consolidatedInfo).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
    
    console.log('');
    console.log('🎵 Forms Containing Senior Dunce Data:');
    extractedData.forEach((form, index) => {
      console.log(`   ${index + 1}. ${form.formTitle} (${form.formId})`);
      console.log(`      Submitted: ${form.submittedAt}`);
      console.log(`      Fields: ${Object.keys(form.answers).length}`);
    });
    
    console.log('');
    console.log('💡 Next Steps:');
    console.log('1. Use this consolidated data to create accurate campaign information');
    console.log('2. The genre should come from the actual Typeform response, not hardcoded');
    console.log('3. Use the real artist email and contact details');
    console.log('4. Focus radio research on Amazing Radio and Radio Wigwam as priority');
    
    return artistData;
    
  } catch (error) {
    console.error('❌ Data extraction failed:', error.message);
    return null;
  }
}

// Run the extraction
extractSeniorDunceData().then(data => {
  if (data) {
    console.log('\n🎉 Data extraction completed successfully!');
    console.log('Use this data to create accurate campaigns with real Typeform information.');
  } else {
    console.log('\n❌ Data extraction failed.');
  }
});
