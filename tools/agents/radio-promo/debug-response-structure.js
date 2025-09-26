#!/usr/bin/env node

/**
 * Debug Response Structure
 * 
 * Debug the actual response structure to understand field mapping
 */

require('dotenv').config();

const TypeformApiIntegration = require('./integrations/typeform-api');

async function debugResponseStructure() {
  console.log('🔍 Debugging Response Structure - Liberty Radio Promo Agent\n');
  
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
    
    // Get a sample response
    const responses = await typeform.getFormResponses(assetForm.id, 5);
    if (responses.length > 0) {
      const sampleResponse = responses[0];
      console.log('📝 Sample Response Structure:');
      console.log('Response keys:', Object.keys(sampleResponse));
      console.log('');
      
      console.log('Answers structure:');
      if (sampleResponse.answers) {
        console.log('Answers type:', typeof sampleResponse.answers);
        console.log('Answers is array:', Array.isArray(sampleResponse.answers));
        console.log('Answers length:', sampleResponse.answers.length);
        console.log('');
        
        console.log('First few answers:');
        sampleResponse.answers.slice(0, 5).forEach((answer, index) => {
          console.log(`Answer ${index}:`, JSON.stringify(answer, null, 2));
          console.log('');
        });
      }
      
      console.log('Full response (first 1000 chars):');
      console.log(JSON.stringify(sampleResponse, null, 2).substring(0, 1000) + '...');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the debug
if (require.main === module) {
  debugResponseStructure();
}

module.exports = debugResponseStructure;
