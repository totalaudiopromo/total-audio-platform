#!/usr/bin/env node

/**
 * Add KYARA Contacts to Mailchimp
 *
 * Reads the Airtable contacts and adds them to Mailchimp
 * with proper tags for the KYARA campaign
 */

require('dotenv').config();
const fs = require('fs');
const MailchimpApi = require('./integrations/mailchimp-api');

async function main() {
  console.log('📧 Adding KYARA Contacts to Mailchimp\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Load contacts from Airtable export
  const contactsFile = './KYARA_AIRTABLE_CONTACTS.json';

  if (!fs.existsSync(contactsFile)) {
    console.log('❌ Contact file not found. Run search-kyara-contacts.js first.\n');
    return;
  }

  const contactsData = JSON.parse(fs.readFileSync(contactsFile, 'utf-8'));
  const allContacts = [
    ...contactsData.hot,
    ...contactsData.warm,
    ...contactsData.cold,
    ...contactsData.other
  ];

  console.log(`✅ Loaded ${allContacts.length} contacts from Airtable\n`);

  // Initialize Mailchimp
  const mailchimp = new MailchimpApi();

  // Ensure Liberty audience exists
  console.log('🔍 Finding Liberty Music PR audience in Mailchimp...\n');
  const audience = await mailchimp.ensureLibertyAudience();

  if (!audience) {
    console.log('❌ Failed to find or create Liberty audience\n');
    return;
  }

  console.log(`✅ Using Mailchimp audience: ${audience.name} (${audience.id})\n`);

  // Add each contact
  const results = {
    added: [],
    updated: [],
    skipped: [],
    errors: []
  };

  console.log('📧 Adding contacts to Mailchimp...\n');

  for (const contact of allContacts) {
    try {
      // Skip if no email
      if (!contact.email) {
        console.log(`⚠️  Skipping contact with no email`);
        results.skipped.push({ reason: 'no_email', contact });
        continue;
      }

      // Extract name from station field or use first/last name
      const fullName = contact.name || contact.allFields?.Station || '';
      const [firstName = '', ...lastNameParts] = fullName.split(' ');
      const lastName = lastNameParts.join(' ');

      // Build tags for this contact
      const tags = [
        'KYARA-Campaign',
        'Alternative-Indie',
        'Radio-Contact'
      ];

      // Add genre tags
      if (contact.genre) {
        const genres = Array.isArray(contact.genre) ? contact.genre : contact.genre.split(',');
        genres.forEach(g => {
          const genreTag = g.trim().replace(/\s+/g, '-');
          if (genreTag) tags.push(genreTag);
        });
      }

      // Add relationship status tag
      if (contact.relationship) {
        tags.push(`Relationship-${contact.relationship}`);
      }

      // Add station type tag
      if (contact.stationType) {
        tags.push(`Type-${contact.stationType.replace(/\s+/g, '-')}`);
      }

      // Add country tag
      if (contact.country) {
        tags.push(`Country-${contact.country.replace(/\s+/g, '-')}`);
      }

      console.log(`📧 Adding: ${contact.email} (${fullName || 'No name'})`);
      console.log(`   Tags: ${tags.join(', ')}`);

      // Add to Mailchimp
      const contactData = {
        email: contact.email,
        firstName: firstName || 'Radio',
        lastName: lastName || 'Contact',
        tags: tags
      };

      try {
        await mailchimp.addContact(audience.id, contactData);
        console.log(`   ✅ Added successfully\n`);
        results.added.push({ email: contact.email, tags });
      } catch (addError) {
        // If already exists, try to update
        if (addError.message.includes('already') || addError.message.includes('exists')) {
          try {
            await mailchimp.updateContact(audience.id, contact.email, contactData);
            console.log(`   ✅ Updated existing contact\n`);
            results.updated.push({ email: contact.email, tags });
          } catch (updateError) {
            console.log(`   ❌ Failed to update: ${updateError.message}\n`);
            results.errors.push({ email: contact.email, error: updateError.message });
          }
        } else {
          throw addError;
        }
      }

      // Rate limiting - 1 second delay between contacts
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
      results.errors.push({ email: contact.email, error: error.message });
    }
  }

  // Display summary
  console.log('\n═══════════════════════════════════════════════════════════\n');
  console.log('📊 MAILCHIMP IMPORT SUMMARY\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`Total Contacts Processed: ${allContacts.length}`);
  console.log(`✅ Added: ${results.added.length}`);
  console.log(`🔄 Updated: ${results.updated.length}`);
  console.log(`⚠️  Skipped: ${results.skipped.length}`);
  console.log(`❌ Errors: ${results.errors.length}\n`);

  if (results.errors.length > 0) {
    console.log('❌ Errors encountered:\n');
    results.errors.forEach(err => {
      console.log(`   ${err.email}: ${err.error}`);
    });
    console.log('');
  }

  console.log('═══════════════════════════════════════════════════════════\n');

  // Save results
  const resultsPath = './KYARA_MAILCHIMP_IMPORT_RESULTS.json';
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`✅ Results saved to: ${resultsPath}\n`);

  console.log('🎉 Mailchimp import complete!\n');
  console.log('📋 Next steps:');
  console.log('1. Check Mailchimp audience for new KYARA-Campaign tagged contacts');
  console.log('2. Create email campaign targeting KYARA-Campaign tag');
  console.log('3. Use genre tags to segment by music preference\n');
}

main().catch(console.error);
