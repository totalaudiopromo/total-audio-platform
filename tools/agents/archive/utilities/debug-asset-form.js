#!/usr/bin/env node

/**
 * Debug Asset Form Structure
 * 
 * Debug the Asset Form NEW to understand the correct field mappings
 */

require('dotenv').config();

const TypeformApiIntegration = require('./integrations/typeform-api');

async function debugAssetForm() {
  console.log('🔍 Debugging Asset Form Structure - Liberty Radio Promo Agent\n');
  
  try {
    const typeform = new TypeformApiIntegration();
    
    // Get the Asset Form NEW
    const forms = await typeform.getRecentForms(20);
    const assetForm = forms.find(f => f.title.includes('Asset Form NEW'));
    
    if (!assetForm) {
      console.log('❌ Asset Form NEW not found');
      return;
    }
    
    console.log(`📋 Form: ${assetForm.title} (${assetForm.id})`);
    console.log('');
    
    // Get the form structure
    const formDetails = await typeform.getForm(assetForm.id);
    console.log('🏗️ Form Fields:');
    formDetails.fields.forEach((field, index) => {
      console.log(`${index + 1}. Field ID: ${field.id}`);
      console.log(`   Title: ${field.title}`);
      console.log(`   Type: ${field.type}`);
      console.log(`   Ref: ${field.ref}`);
      console.log('');
    });
    
    // Get a sample response
    const responses = await typeform.getFormResponses(assetForm.id, 5);
    if (responses.length > 0) {
      console.log('📝 Sample Response:');
      const sampleResponse = responses[0];
      console.log(JSON.stringify(sampleResponse, null, 2));
      console.log('');
      
      // Show field mappings
      console.log('🗂️ Field Mappings:');
      if (sampleResponse.answers) {
        Object.keys(sampleResponse.answers).forEach(fieldId => {
          const answer = sampleResponse.answers[fieldId];
          const value = typeform.extractAnswerValue(answer);
          console.log(`   Field ${fieldId}: ${value}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the debug
if (require.main === module) {
  debugAssetForm();
}

module.exports = debugAssetForm;
