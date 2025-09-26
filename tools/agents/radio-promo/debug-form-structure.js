#!/usr/bin/env node

/**
 * Debug Form Structure
 * 
 * Debug the actual form structure to understand field mappings
 */

require('dotenv').config();

const TypeformApiIntegration = require('./integrations/typeform-api');

async function debugFormStructure() {
  console.log('🔍 Debugging Form Structure - Liberty Radio Promo Agent\n');
  
  try {
    const typeform = new TypeformApiIntegration();
    
    // Get the form that contains Senior Dunce
    const forms = await typeform.getRecentForms(20);
    const playlistingForm = forms.find(f => f.title.includes('Playlisting'));
    
    if (!playlistingForm) {
      console.log('❌ Playlisting form not found');
      return;
    }
    
    console.log(`📋 Form: ${playlistingForm.title} (${playlistingForm.id})`);
    console.log('');
    
    // Get the form structure
    const formDetails = await typeform.getForm(playlistingForm.id);
    console.log('🏗️ Form Structure:');
    console.log(JSON.stringify(formDetails, null, 2));
    console.log('');
    
    // Get the specific response
    const responses = await typeform.getFormResponses(playlistingForm.id, 10);
    const seniorDunceResponse = responses.find(r => 
      Object.values(r.answers).some(answer => 
        typeform.extractAnswerValue(answer).toLowerCase().includes('senior dunce')
      )
    );
    
    if (seniorDunceResponse) {
      console.log('📝 Senior Dunce Response:');
      console.log(JSON.stringify(seniorDunceResponse, null, 2));
      console.log('');
      
      // Show field mappings
      console.log('🗂️ Field Mappings:');
      if (seniorDunceResponse.answers) {
        Object.keys(seniorDunceResponse.answers).forEach(fieldId => {
          const answer = seniorDunceResponse.answers[fieldId];
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
  debugFormStructure();
}

module.exports = debugFormStructure;
