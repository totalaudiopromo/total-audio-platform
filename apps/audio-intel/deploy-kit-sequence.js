#!/usr/bin/env node

/**
 * Kit.com Beta Email Sequence Automated Deployment
 * Deploys the revised 4-email beta sequence with authentic sadact positioning
 */

const https = require('https');
const fs = require('fs');

// Kit.com V4 API Configuration
const KIT_API_KEY = 'kit_ef1588b1ed0e1b9683799d07b8a32472';
const KIT_API_BASE = 'https://api.kit.com/v4';
const FORM_ID = '8440957'; // Existing beta signup form
const SEQUENCE_NAME = 'Audio Intel Free Beta Feedback Sequence';

// Email content from our revised sequence
const EMAIL_SEQUENCE = [
  {
    day: 0,
    subject: 'Welcome to Audio Intel Beta - Free Testing Access',
    content: `Hi {{ subscriber.first_name | default: "there" }},

Thanks for signing up to test Audio Intel during the beta phase.

ABOUT THE BETA:
• Completely free access to all features during testing period
• No credit card required, no payment requests
• Built specifically for music industry professionals
• Your honest feedback shapes the final product

WHAT YOU'RE TESTING:
Audio Intel automates the contact research that used to take me hours when promoting electronic releases. Instead of juggling Groover, SubmitHub, Spotify for Artists, and endless spreadsheets, everything happens in one place.

HOW TO TEST:
1. Go to: intel.totalaudiopromo.com/upload
2. Upload any contact list (CSV, Excel, or manual entry)
3. Watch the AI research and enrich your contacts
4. Test the genre matching, email finding, and demographic filters
5. Export your enhanced contact lists

YOUR FEEDBACK MATTERS:
This tool exists because I got tired of spending entire weekends researching radio contacts for single releases. As someone working in Brighton's electronic music scene, I knew there had to be a better way.

Questions or issues? Just reply to this email.

Start testing → intel.totalaudiopromo.com/upload

Built by sadact
Brighton electronic producer who got tired of juggling 8+ tools just to promote one release
Former Network Programmes Manager at Decadance UK and current radio promoter`
  },
  {
    day: 3,
    subject: 'Beta Testing: Advanced Features and Why Your Feedback Matters',
    content: `Hi {{ subscriber.first_name | default: "there" }},

How's the Audio Intel testing going so far?

If you haven't had a chance to try it yet, no pressure at all. When you do have 15 minutes free, here's what I'd love you to test:

ADVANCED FEATURES TO EXPLORE:
• Email finder (locates missing contact addresses)
• Genre matching (filters contacts by music style)
• Regional targeting (matches stations to tour locations)
• Show format detection (identifies which programmes book which artists)
• Bulk contact enrichment (processes hundreds of contacts simultaneously)

WHY YOUR FEEDBACK IS CRUCIAL:
When promoting my latest electronic release, I was spending hours switching between platforms. Radio contact research alone was taking 6+ hours per campaign. 

As a former Network Programmes Manager at Decadance UK, I knew the industry needed something better. But I need to know if this actually solves the problems you face too.

WHAT I'M LOOKING FOR:
• Does it save you time on actual campaigns?
• Are the contact matches accurate for your genre?
• What features are missing that you wish it had?
• Any part of the process that's confusing?

Your honest feedback directly influences what gets built next.

Reply and let me know your thoughts, even if you've only uploaded one test file.

Continue testing → intel.totalaudiopromo.com/upload

Built by sadact
Brighton electronic producer and former Decadance UK Network Programmes Manager`
  },
  {
    day: 7,
    subject: 'Mid-Beta Check-in: How Are You Finding Audio Intel?',
    content: `Hi {{ subscriber.first_name | default: "there" }},

We're halfway through the beta testing period, and I wanted to check in on your experience.

REAL USAGE EXAMPLE:
Last week, when preparing promotion for a Brighton electronic artist's EP release, Audio Intel processed 340 radio contacts in 12 minutes. The same research would have taken me 4+ hours manually switching between Groover, station websites, and LinkedIn searches.

The AI found email addresses for 89% of contacts and correctly matched genres for targeted programming. Most importantly, it identified 23 shows that regularly play similar electronic music but weren't on my original radar.

HOW HAS YOUR TESTING GONE?
Whether you've processed one contact list or dozens, I'd love to hear:
• What's working well for your campaigns?
• Any features that don't quite fit your workflow?
• Contact sources or data types you wish it handled?

HONEST FEEDBACK SHAPES THE PRODUCT:
This tool exists because manual contact research was eating up time I wanted to spend on actual music promotion and relationship building. Your experience helps me understand if it solves similar problems for others in the industry.

Even if you haven't used it extensively yet, that feedback is valuable too - it tells me something important about the user experience.

Reply with your thoughts, questions, or suggestions.

Keep testing → intel.totalaudiopromo.com/upload

Built by sadact
Brighton-based electronic producer and radio promoter`
  },
  {
    day: 14,
    subject: 'Beta Testing Ends Today - Lifetime Discount as Appreciation',
    content: `Hi {{ subscriber.first_name | default: "there" }},

The Audio Intel beta testing period ends today.

First, thank you for taking time to test the platform and provide feedback. Whether you used it extensively or just explored the features, your participation helped shape what Audio Intel becomes.

WHAT HAPPENS NEXT:
Audio Intel launches publicly tomorrow with standard pricing:
• Professional: £19.99/month
• Agency: £59.99/month  
• Enterprise: Custom pricing

LIFETIME DISCOUNT FOR BETA TESTERS:
As appreciation for your testing and feedback, beta participants get 50% off forever:
• Professional: £9.99/month (lifetime rate)
• Agency: £29.50/month (lifetime rate)
• Enterprise: 50% off custom quote

This discount is available indefinitely - no expiry date, no pressure to decide today.

MY COMMITMENT TO LIFETIME MEMBERS:
• Direct access to me when you need campaign support
• First access to all new features and integrations
• Priority technical support
• Recognition as a founding member of the Audio Intel community

ONLY UPGRADE IF IT ADDS VALUE:
This tool was built to solve real problems I faced as a working promoter. Only subscribe if it genuinely saves you time and improves your campaigns.

If you found value during testing → intel.totalaudiopromo.com/pricing
Continue exploring free features → intel.totalaudiopromo.com/upload

Thanks again for being part of the beta community.

Built by sadact
Brighton electronic producer who got tired of juggling 8+ tools just to promote one release
Former Network Programmes Manager at Decadance UK`
  }
];

// Tags to create/manage
const TAGS = [
  'beta_user',
  'free_trial', 
  'feedback_provided',
  'lifetime_discount_eligible'
];

/**
 * Make API request to Kit.com
 */
function makeKitRequest(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, KIT_API_BASE);
    const options = {
      method,
      headers: {
        'X-Kit-Api-Key': KIT_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${JSON.stringify(response)}`));
          }
        } catch (e) {
          reject(new Error(`Parse Error: ${body}`));
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Create or update tags
 */
async function createTags() {
  console.log('🏷️  Creating/updating tags...');
  
  for (const tagName of TAGS) {
    try {
      const response = await makeKitRequest('/tags', 'POST', {
        name: tagName
      });
      console.log(`✅ Tag created/updated: ${tagName}`);
    } catch (error) {
      // Tag might already exist, that's okay
      console.log(`ℹ️  Tag exists or error: ${tagName} - ${error.message}`);
    }
  }
}

/**
 * Create email sequence
 */
async function createEmailSequence() {
  console.log('📧 Creating email sequence...');
  
  try {
    // First, create the sequence
    const sequenceData = {
      name: SEQUENCE_NAME,
      description: 'Free beta testing sequence with authentic sadact positioning - 4 emails over 14 days',
      type: 'sequence'
    };
    
    console.log('Creating sequence:', sequenceData);
    const sequence = await makeKitRequest('/sequences', 'POST', sequenceData);
    console.log(`✅ Sequence created: ${sequence.name} (ID: ${sequence.id})`);
    
    const sequenceId = sequence.id;
    
    // Add each email to the sequence
    for (let i = 0; i < EMAIL_SEQUENCE.length; i++) {
      const email = EMAIL_SEQUENCE[i];
      
      const emailData = {
        subject: email.subject,
        content: email.content,
        delay_days: email.day,
        delay_hours: 0,
        delay_minutes: 0
      };
      
      console.log(`Adding email ${i + 1}: Day ${email.day} - ${email.subject}`);
      const emailResponse = await makeKitRequest(`/sequences/${sequenceId}/emails`, 'POST', emailData);
      console.log(`✅ Email ${i + 1} added successfully`);
    }
    
    return sequenceId;
    
  } catch (error) {
    console.error('❌ Error creating sequence:', error.message);
    throw error;
  }
}

/**
 * Update form to trigger sequence
 */
async function updateForm(sequenceId) {
  console.log('📝 Updating form to trigger sequence...');
  
  try {
    const formData = {
      settings: {
        redirect_url: 'https://intel.totalaudiopromo.com/upload',
        success_message: 'Welcome to Audio Intel beta! Check your email for testing instructions.',
        double_opt_in: false,
        sequence_id: sequenceId
      }
    };
    
    const response = await makeKitRequest(`/forms/${FORM_ID}`, 'PUT', formData);
    console.log(`✅ Form ${FORM_ID} updated to trigger sequence ${sequenceId}`);
    
  } catch (error) {
    console.error('❌ Error updating form:', error.message);
    throw error;
  }
}

/**
 * Test the sequence with a test email
 */
async function testSequence() {
  console.log('🧪 Testing sequence deployment...');
  
  try {
    // Get sequence details
    const sequences = await makeKitRequest('/sequences');
    const ourSequence = sequences.find(seq => seq.name === SEQUENCE_NAME);
    
    if (ourSequence) {
      console.log(`✅ Sequence found: ${ourSequence.name} (${ourSequence.emails?.length || 0} emails)`);
      
      // Get form details  
      const form = await makeKitRequest(`/forms/${FORM_ID}`);
      console.log(`✅ Form verified: ${form.name} (ID: ${FORM_ID})`);
      
      return true;
    } else {
      throw new Error('Sequence not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  }
}

/**
 * Main deployment function
 */
async function deployKitSequence() {
  console.log('🚀 Starting Kit.com Beta Sequence Deployment...\n');
  
  try {
    // Step 1: Create tags
    await createTags();
    console.log('');
    
    // Step 2: Create email sequence
    const sequenceId = await createEmailSequence();
    console.log('');
    
    // Step 3: Update form
    await updateForm(sequenceId);
    console.log('');
    
    // Step 4: Test deployment
    await testSequence();
    console.log('');
    
    console.log('🎉 DEPLOYMENT SUCCESSFUL!');
    console.log('');
    console.log('📋 DEPLOYMENT SUMMARY:');
    console.log(`• Sequence: "${SEQUENCE_NAME}"`);
    console.log(`• Emails: 4 (Day 0, 3, 7, 14)`);
    console.log(`• Form ID: ${FORM_ID}`);
    console.log(`• Tags: ${TAGS.join(', ')}`);
    console.log('• Redirect: intel.totalaudiopromo.com/upload');
    console.log('');
    console.log('✅ Beta signup at intel.totalaudiopromo.com/beta is now live!');
    console.log('✅ Authentic sadact positioning deployed');
    console.log('✅ Free beta structure implemented');
    console.log('✅ Professional tone with minimal emojis');
    console.log('');
    console.log('🎯 Ready for Sprint Week beta testing!');
    
  } catch (error) {
    console.error('💥 DEPLOYMENT FAILED:', error.message);
    console.log('');
    console.log('🔍 Check the following:');
    console.log('• Kit.com API key is valid');
    console.log('• Form ID 8440957 exists');
    console.log('• Network connectivity');
    console.log('• API rate limits');
    process.exit(1);
  }
}

// Run deployment
if (require.main === module) {
  deployKitSequence();
}

module.exports = { deployKitSequence };