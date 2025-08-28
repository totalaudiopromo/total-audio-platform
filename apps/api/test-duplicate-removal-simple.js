const Airtable = require('airtable');

// ========================================
// 🚨 REPLACE THESE WITH YOUR ACTUAL AIRTABLE CREDENTIALS
// ========================================
process.env.AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'patOohG8Gg008SKWj.fd0e179e09416b65e61ae4fc97b29136a79f769809446aadbccebebcd060f6e1';
process.env.AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID = process.env.AIRTABLE_CONTACTS_TABLE_ID || 'tblcZnUsB4Swyjcip';
// ========================================

async function testDuplicateRemoval() {
  try {
    console.log('🚀 Testing Airtable Duplicate Removal...\n');

    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;

    if (!apiKey || !baseId || !contactsTableId) {
      throw new Error('Missing required Airtable environment variables');
    }

    const base = new Airtable({ apiKey }).base(baseId);
    
    console.log('🔍 Scanning for duplicate email addresses...\n');

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
      console.log('✅ No duplicates found!');
      return;
    }

    // Calculate completeness for each record
    const importantFields = ['Name', 'Company', 'Role', 'Genre', 'Location', 'Email', 'Phone', 'Website', 'Notes'];
    
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

    console.log('\n📧 Duplicate Groups Found:');
    console.log('=====================================');
    
    duplicates.forEach((records, email) => {
      // Calculate completeness scores
      const recordsWithScores = records.map(record => ({
        record,
        completeness: calculateCompleteness(record),
        created: record._rawJson.createdTime
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
      
      const reason = recordsWithScores[0].completeness > recordsWithScores[1].completeness
        ? `Most complete record (${Math.round(recordsWithScores[0].completeness * 100)}% vs ${Math.round(recordsWithScores[1].completeness * 100)}%)`
        : `Most recently created (${new Date(recordsWithScores[0].created).toLocaleDateString()})`;

      totalRecordsToDelete += deleteRecords.length;

      console.log(`\n📧 Email: ${email}`);
      console.log(`   Records: ${records.length}`);
      console.log(`   Keeping: ${keepRecord.id}`);
      console.log(`   Deleting: ${deleteRecords.length} records`);
      console.log(`   Reason: ${reason}`);

      // Create backup data
      deleteRecords.forEach(record => {
        backupData.push({
          email: email,
          recordId: record.id,
          fields: record.fields,
          deletedAt: new Date().toISOString(),
          reason: `Duplicate of ${keepRecord.id} (${reason})`
        });
      });
    });

    // Save backup to file
    const backupFilename = `duplicate-backup-${new Date().toISOString().split('T')[0]}.json`;
    const fs = require('fs');
    fs.writeFileSync(backupFilename, JSON.stringify(backupData, null, 2));
    console.log(`\n💾 Backup saved to: ${backupFilename}`);

    console.log('\n📊 SUMMARY:');
    console.log('=====================================');
    console.log(`Total duplicate groups: ${duplicates.size}`);
    console.log(`Records that would be deleted: ${totalRecordsToDelete}`);
    console.log(`Backup records created: ${backupData.length}`);

    if (totalRecordsToDelete > 0) {
      console.log('\n⚠️  WARNING: This will permanently delete records from Airtable!');
      console.log('A backup file has been created with all records that would be deleted.');
      console.log('\nTo proceed with live removal, run:');
      console.log('node test-duplicate-removal-live-simple.js');
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