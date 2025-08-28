const { execSync } = require('child_process');
const path = require('path');

// ========================================
// 🚨 REPLACE THESE WITH YOUR ACTUAL AIRTABLE CREDENTIALS
// ========================================
process.env.AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'patOohG8Gg008SKWj.fd0e179e09416b65e61ae4fc97b29136a79f769809446aadbccebebcd060f6e1';
process.env.AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID = process.env.AIRTABLE_CONTACTS_TABLE_ID || 'tblcZnUsB4Swyjcip';
process.env.AIRTABLE_CAMPAIGNS_TABLE_ID = process.env.AIRTABLE_CAMPAIGNS_TABLE_ID || 'tblvRvF1pqpFnixnK';
process.env.AIRTABLE_INTERACTIONS_TABLE_ID = process.env.AIRTABLE_INTERACTIONS_TABLE_ID || 'tbl0bjeo3ZwpzRQyV';
process.env.AIRTABLE_EMAILS_TABLE_ID = process.env.AIRTABLE_EMAILS_TABLE_ID || 'tblodWpE3Bh7XxPID';
// ========================================

async function testDuplicateRemoval() {
  try {
    console.log('🚀 Testing Airtable Duplicate Removal Service...\n');

    // Check TypeScript compilation
    console.log('📦 Checking TypeScript compilation...');
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    console.log('✅ TypeScript compilation successful\n');

    // Import the service using ts-node
    const { AirtableDuplicateRemoval } = require('ts-node/register');
    const { AirtableDuplicateRemoval: RemovalService } = require('./src/services/airtableDuplicateRemoval');

    // Create service instance
    const removalService = RemovalService.getRemovalServiceForUser('test-user');

    console.log('🔍 Starting DRY RUN to identify duplicates...\n');

    // Run dry run first
    const dryRunResult = await removalService.removeDuplicates(true);

    console.log('\n📊 DRY RUN RESULTS:');
    console.log('=====================================');
    console.log(`Total duplicate groups: ${dryRunResult.totalDuplicates}`);
    console.log(`Records that would be deleted: ${dryRunResult.recordsToDelete}`);
    console.log(`Backup records created: ${dryRunResult.backupData.length}`);
    console.log(`Errors: ${dryRunResult.errors.length}`);

    if (dryRunResult.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      dryRunResult.errors.forEach(error => console.log(`  - ${error}`));
    }

    if (dryRunResult.duplicateGroups.length > 0) {
      console.log('\n📧 Duplicate Groups Found:');
      console.log('=====================================');
      
      dryRunResult.duplicateGroups.slice(0, 5).forEach((group, index) => {
        console.log(`\n${index + 1}. Email: ${group.email}`);
        console.log(`   Records: ${group.records.length}`);
        console.log(`   Keeping: ${group.keepRecord.id}`);
        console.log(`   Deleting: ${group.deleteRecords.length} records`);
        console.log(`   Reason: ${group.reason}`);
      });

      if (dryRunResult.duplicateGroups.length > 5) {
        console.log(`\n... and ${dryRunResult.duplicateGroups.length - 5} more groups`);
      }
    }

    // Ask user if they want to proceed with live removal
    if (dryRunResult.recordsToDelete > 0) {
      console.log('\n⚠️  WARNING: This will permanently delete records from Airtable!');
      console.log('A backup file has been created with all records that would be deleted.');
      console.log('\nTo proceed with live removal, run:');
      console.log('node test-duplicate-removal-live.js');
    } else {
      console.log('\n✅ No duplicates found to remove!');
    }

  } catch (error) {
    console.error('❌ Error during duplicate removal test:', error);
    process.exit(1);
  }
}

// Run the test
testDuplicateRemoval(); 