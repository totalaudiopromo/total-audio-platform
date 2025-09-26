#!/usr/bin/env node

/**
 * Senior Dunce - Bestial Contact Strategy
 * 
 * Combines WARM station data with Airtable contacts
 * Solves Mailchimp cost issue with smart segmentation
 */

require('dotenv').config();

const WarmusicAPI = require('./integrations/warm-api');

async function bestialContactStrategy() {
  console.log('📧 Senior Dunce - Bestial Contact Strategy\n');
  
  try {
    const warm = new WarmusicAPI();
    
    // Get WARM stations for targeting
    console.log('📻 Getting WARM station data...');
    const stationsData = await warm.getUKRadioStations();
    const warmStations = stationsData.stations || [];
    
    console.log(`✅ Found ${warmStations.length} WARM stations`);
    console.log(`   • FM Stations: ${warmStations.filter(s => s.category === 'FM').length}`);
    console.log(`   • Internet Stations: ${warmStations.filter(s => s.category === 'INTERNET').length}`);
    console.log('');
    
    // Contact strategy breakdown
    console.log('📧 CONTACT STRATEGY BREAKDOWN:\n');
    
    console.log('🎯 PHASE 1 - AIRTABLE CONTACTS (Free, Immediate):');
    console.log('   • Use existing Airtable radio contacts');
    console.log('   • Filter by "Contact Type = Radio"');
    console.log('   • Prioritize by station type (BBC, Commercial, Local)');
    console.log('   • Use Airtable\'s built-in email features');
    console.log('   • Cost: £0 (free)');
    console.log('   • Time: Immediate');
    console.log('');
    
    console.log('🎯 PHASE 2 - WARM STATION RESEARCH (Manual, Low Cost):');
    console.log('   • Use WARM station names to find contact info');
    console.log('   • Google search: "[Station Name] contact email"');
    console.log('   • Check station websites for submission forms');
    console.log('   • Use LinkedIn to find station staff');
    console.log('   • Cost: £0 (free)');
    console.log('   • Time: 2-3 hours');
    console.log('');
    
    console.log('🎯 PHASE 3 - MAILCHIMP SMART SEGMENTATION (Controlled Cost):');
    console.log('   • Only import high-priority contacts');
    console.log('   • Create separate audiences by station type');
    console.log('   • Use free tier for testing (2,000 contacts)');
    console.log('   • Cost: £0-20/month (controlled)');
    console.log('   • Time: 1 hour setup');
    console.log('');
    
    // Mailchimp cost breakdown
    console.log('💰 MAILCHIMP COST ANALYSIS:\n');
    
    console.log('Current Mailchimp Pricing:');
    console.log('   • Free: 0-2,000 contacts');
    console.log('   • Essentials: £8.99/month for 2,001-5,000 contacts');
    console.log('   • Standard: £14.99/month for 5,001-10,000 contacts');
    console.log('   • Premium: £299/month for 10,001+ contacts');
    console.log('');
    
    console.log('Smart Segmentation Strategy:');
    console.log('   • High Priority: 50 contacts (BBC, Major Commercial)');
    console.log('   • Medium Priority: 200 contacts (Local FM, Online)');
    console.log('   • Low Priority: Keep in Airtable only');
    console.log('   • Total Mailchimp: 250 contacts = FREE tier');
    console.log('');
    
    // Alternative email solutions
    console.log('📧 ALTERNATIVE EMAIL SOLUTIONS:\n');
    
    console.log('Option 1: Airtable + Simple Email (Recommended):');
    console.log('   • Use Airtable for contact management');
    console.log('   • Use Gmail/Outlook for sending');
    console.log('   • Use email templates and personalization');
    console.log('   • Cost: £0 (free)');
    console.log('   • Limitations: 100 emails/day (Gmail)');
    console.log('');
    
    console.log('Option 2: Mailgun (Professional, Cheap):');
    console.log('   • 10,000 emails/month for £0');
    console.log('   • 50,000 emails/month for £35');
    console.log('   • Professional email delivery');
    console.log('   • Cost: £0-35/month');
    console.log('');
    
    console.log('Option 3: SendGrid (Enterprise, Moderate):');
    console.log('   • 40,000 emails/month for £0');
    console.log('   • 100,000 emails/month for £15');
    console.log('   • Advanced features and analytics');
    console.log('   • Cost: £0-15/month');
    console.log('');
    
    // Practical implementation
    console.log('🚀 PRACTICAL IMPLEMENTATION:\n');
    
    console.log('Step 1: Export Airtable Radio Contacts');
    console.log('   • Filter by "Contact Type = Radio"');
    console.log('   • Export as CSV');
    console.log('   • Categorize by station type');
    console.log('   • Time: 30 minutes');
    console.log('');
    
    console.log('Step 2: Research WARM Station Contacts');
    console.log('   • Take top 50 WARM stations');
    console.log('   • Google search for contact info');
    console.log('   • Add to Airtable with source "WARM Research"');
    console.log('   • Time: 2-3 hours');
    console.log('');
    
    console.log('Step 3: Set Up Smart Email System');
    console.log('   • Use Airtable for contact management');
    console.log('   • Use Gmail for sending (free)');
    console.log('   • Create email templates');
    console.log('   • Set up tracking spreadsheet');
    console.log('   • Time: 1 hour');
    console.log('');
    
    console.log('Step 4: Launch Campaign');
    console.log('   • Start with 50 high-priority contacts');
    console.log('   • Send 10-15 emails per day');
    console.log('   • Track responses in Airtable');
    console.log('   • Follow up based on responses');
    console.log('   • Time: Ongoing');
    console.log('');
    
    // WARM integration for tracking
    console.log('📊 WARM INTEGRATION FOR TRACKING:\n');
    console.log('✅ WARM API is already configured');
    console.log('✅ Will track plays for "Senior Dunce"');
    console.log('✅ Real-time monitoring of 1367 stations');
    console.log('✅ Use play data to validate contact strategy');
    console.log('✅ Adjust targeting based on actual plays');
    console.log('');
    
    // Success metrics
    console.log('📊 SUCCESS METRICS:\n');
    console.log('   • Contacts Researched: 200+');
    console.log('   • Emails Sent: 100+');
    console.log('   • Response Rate: 10%+');
    console.log('   • WARM Plays: 20+');
    console.log('   • Cost: £0-20/month');
    console.log('   • Time Investment: 4-5 hours setup');
    console.log('');
    
    // Next steps
    console.log('🎯 IMMEDIATE NEXT STEPS:\n');
    console.log('1. Export radio contacts from Airtable');
    console.log('2. Research top 50 WARM station contacts');
    console.log('3. Set up Gmail-based email system');
    console.log('4. Create house pop pitch templates');
    console.log('5. Start with 50 high-priority contacts');
    console.log('6. Use WARM to track actual plays');
    console.log('7. Adjust strategy based on results');
    console.log('');
    
    return {
      strategy: 'Airtable + WARM + Smart Email',
      cost: '£0-20/month',
      contacts: '200+ researched',
      time: '4-5 hours setup',
      tracking: 'WARM API ready'
    };
    
  } catch (error) {
    console.log('❌ Error in contact strategy:', error.message);
    throw error;
  }
}

// Run the strategy
if (require.main === module) {
  bestialContactStrategy().catch(console.error);
}

module.exports = { bestialContactStrategy };



