const Airtable = require('airtable');
const readline = require('readline');

// ========================================
// 🚨 REPLACE THESE WITH YOUR ACTUAL AIRTABLE CREDENTIALS
// ========================================
process.env.AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'PLACEHOLDER_AIRTABLE_KEY';
process.env.AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID =
  process.env.AIRTABLE_CONTACTS_TABLE_ID || 'tblcZnUsB4Swyjcip';
// ========================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

async function liveDuplicateRemoval() {
  try {
    console.log('🚨 LIVE DUPLICATE REMOVAL - THIS WILL PERMANENTLY DELETE RECORDS!');
    console.log('================================================================\n');

    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;

    if (!apiKey || !baseId || !contactsTableId) {
      throw new Error('Missing required Airtable environment variables');
    }

    const base = new Airtable({ apiKey }).base(baseId);

    console.log("🔍 First, let's run a dry run to see what would be deleted...\n");

    // Get all records
    const records = await base(contactsTableId)
      .select({
        maxRecords: 10000,
      })
      .all();

    console.log(`📊 Found ${records.length} total records`);

    // Group by email
    const emailGroups = new Map();

    records.forEach(record => {
      const email = record.fields.Email?.toString().toLowerCase().trim();
      if (email && email !== '') {
        if (!emailGroups.has(email)) {
          emailGroups.set(email, []);
        }
        emailGroups.get(email).push(record);
      }
    });

    // Find duplicates
    const duplicates = new Map();
    emailGroups.forEach((records, email) => {
      if (records.length > 1) {
        duplicates.set(email, records);
      }
    });

    console.log(`📧 Found ${duplicates.size} duplicate email groups`);

    if (duplicates.size === 0) {
      console.log('\n✅ No duplicates found to remove!');
      rl.close();
      return;
    }

    // Calculate completeness for each record
    const importantFields = [
      'Name',
      'Company',
      'Role',
      'Genre',
      'Location',
      'Email',
      'Phone',
      'Website',
      'Notes',
    ];

    function calculateCompleteness(record) {
      let filledFields = 0;
      importantFields.forEach(field => {
        if (record.fields[field] && record.fields[field].toString().trim() !== '') {
          filledFields++;
        }
      });
      return filledFields / importantFields.length;
    }

    // Process each duplicate group
    let totalRecordsToDelete = 0;
    const backupData = [];
    const allRecordsToDelete = [];

    console.log('\n📧 Sample Duplicate Groups:');
    console.log('=====================================');

    let count = 0;
    duplicates.forEach((records, email) => {
      // Calculate completeness scores
      const recordsWithScores = records.map(record => ({
        record,
        completeness: calculateCompleteness(record),
        created: record._rawJson.createdTime,
      }));

      // Sort by completeness (descending), then by creation date (descending)
      recordsWithScores.sort((a, b) => {
        if (a.completeness !== b.completeness) {
          return b.completeness - a.completeness;
        }
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      });

      const keepRecord = recordsWithScores[0].record;
      const deleteRecords = recordsWithScores.slice(1).map(r => r.record);

      const reason =
        recordsWithScores[0].completeness > recordsWithScores[1].completeness
          ? `Most complete record (${Math.round(recordsWithScores[0].completeness * 100)}% vs ${Math.round(recordsWithScores[1].completeness * 100)}%)`
          : `Most recently created (${new Date(recordsWithScores[0].created).toLocaleDateString()})`;

      totalRecordsToDelete += deleteRecords.length;
      allRecordsToDelete.push(...deleteRecords);

      // Show first 3 groups as examples
      if (count < 3) {
        console.log(`\n${count + 1}. Email: ${email}`);
        console.log(`   Records: ${records.length}`);
        console.log(`   Keeping: ${keepRecord.id}`);
        console.log(`   Deleting: ${deleteRecords.length} records`);
        console.log(`   Reason: ${reason}`);
        count++;
      }

      // Create backup data
      deleteRecords.forEach(record => {
        backupData.push({
          email: email,
          recordId: record.id,
          fields: record.fields,
          deletedAt: new Date().toISOString(),
          reason: `Duplicate of ${keepRecord.id} (${reason})`,
        });
      });
    });

    if (duplicates.size > 3) {
      console.log(`\n... and ${duplicates.size - 3} more groups`);
    }

    // Save backup to file
    const backupFilename = `duplicate-backup-${new Date().toISOString().split('T')[0]}.json`;
    const fs = require('fs');
    fs.writeFileSync(backupFilename, JSON.stringify(backupData, null, 2));
    console.log(`\n💾 Backup saved to: ${backupFilename}`);

    console.log('\n⚠️  WARNING: This will permanently delete records from Airtable!');
    console.log('A backup file has been created with all records that would be deleted.');
    console.log('You can restore from the backup file if needed.\n');

    const confirmation = await askQuestion(
      'Are you sure you want to proceed with LIVE deletion? (yes/no): '
    );

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

    // Delete records in batches
    const batchSize = 10;
    let deletedCount = 0;

    for (let i = 0; i < allRecordsToDelete.length; i += batchSize) {
      const batch = allRecordsToDelete.slice(i, i + batchSize);
      const recordIds = batch.map(record => record.id);

      try {
        await base(contactsTableId).destroy(recordIds);
        deletedCount += batch.length;
        console.log(`🗑️  Deleted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} records`);
      } catch (error) {
        console.error(`❌ Error deleting batch ${Math.floor(i / batchSize) + 1}:`, error);
        throw error;
      }
    }

    console.log('\n✅ LIVE REMOVAL COMPLETED!');
    console.log('=====================================');
    console.log(`Total duplicate groups processed: ${duplicates.size}`);
    console.log(`Records actually deleted: ${deletedCount}`);
    console.log(`Backup records created: ${backupData.length}`);

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
