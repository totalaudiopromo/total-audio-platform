const { execSync } = require('child_process');
const path = require('path');
const readline = require('readline');

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function liveDuplicateRemoval() {
  try {
    console.log('🚨 LIVE DUPLICATE REMOVAL - THIS WILL PERMANENTLY DELETE RECORDS!');
    console.log('================================================================\n');

    // Check TypeScript compilation
    console.log('📦 Checking TypeScript compilation...');
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    console.log('✅ TypeScript compilation successful\n');

    // Import the service using ts-node
    const { AirtableDuplicateRemoval } = require('./src/services/airtableDuplicateRemoval');

    // Create service instance
    const removalService = AirtableDuplicateRemoval.getRemovalServiceForUser('test-user');

    console.log('🔍 First, let\'s run a dry run to see what would be deleted...\n');

    // Run dry run first
    const dryRunResult = await removalService.removeDuplicates(true);

    console.log('\n📊 DRY RUN RESULTS:');
    console.log('=====================================');
    console.log(`Total duplicate groups: ${dryRunResult.totalDuplicates}`);
    console.log(`Records that would be deleted: ${dryRunResult.recordsToDelete}`);
    console.log(`Backup records created: ${dryRunResult.backupData.length}`);

    if (dryRunResult.recordsToDelete === 0) {
      console.log('\n✅ No duplicates found to remove!');
      rl.close();
      return;
    }

    console.log('\n📧 Sample Duplicate Groups:');
    console.log('=====================================');
    
    dryRunResult.duplicateGroups.slice(0, 3).forEach((group, index) => {
      console.log(`\n${index + 1}. Email: ${group.email}`);
      console.log(`   Records: ${group.records.length}`);
      console.log(`   Keeping: ${group.keepRecord.id}`);
      console.log(`   Deleting: ${group.deleteRecords.length} records`);
      console.log(`   Reason: ${group.reason}`);
    });

    if (dryRunResult.duplicateGroups.length > 3) {
      console.log(`\n... and ${dryRunResult.duplicateGroups.length - 3} more groups`);
    }

    console.log('\n⚠️  WARNING: This will permanently delete records from Airtable!');
    console.log('A backup file has been created with all records that would be deleted.');
    console.log('You can restore from the backup file if needed.\n');

    const confirmation = await askQuestion('Are you sure you want to proceed with LIVE deletion? (yes/no): ');

    if (confirmation.toLowerCase() !== 'yes') {
      console.log('\n❌ Operation cancelled by user.');
      rl.close();
      return;
    }

    const finalConfirmation = await askQuestion('Type "DELETE" to confirm permanent deletion: ');

    if (finalConfirmation !== 'DELETE') {
      console.log('\n❌ Operation cancelled - incorrect confirmation.');
      rl.close();
      return;
    }

    console.log('\n🗑️  Starting LIVE duplicate removal...\n');

    // Run live removal
    const liveResult = await removalService.removeDuplicates(false);

    console.log('\n✅ LIVE REMOVAL COMPLETED!');
    console.log('=====================================');
    console.log(`Total duplicate groups processed: ${liveResult.totalDuplicates}`);
    console.log(`Records actually deleted: ${liveResult.recordsToDelete}`);
    console.log(`Backup records created: ${liveResult.backupData.length}`);
    console.log(`Errors: ${liveResult.errors.length}`);

    if (liveResult.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      liveResult.errors.forEach(error => console.log(`  - ${error}`));
    }

    console.log('\n💾 Backup file created with all deleted records.');
    console.log('You can use this backup to restore records if needed.');

  } catch (error) {
    console.error('❌ Error during live duplicate removal:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the live removal
liveDuplicateRemoval(); 