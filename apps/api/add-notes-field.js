const Airtable = require('airtable');

// Use the same credentials
process.env.AIRTABLE_API_KEY = 'patOohG8Gg008SKWj.fd0e179e09416b65e61ae4fc97b29136a79f769809446aadbccebebcd060f6e1';
process.env.AIRTABLE_BASE_ID = 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'tblcZnUsB4Swyjcip';

async function addNotesField() {
  try {
    console.log('🔧 Adding "Notes" field to Airtable...\n');
    
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;
    
    const base = new Airtable({ apiKey }).base(baseId);
    
    // Note: Airtable doesn't have a direct API to add fields
    // We need to do this manually in the Airtable interface
    console.log('⚠️  IMPORTANT: Airtable API cannot add fields automatically');
    console.log('📋 Please add the "Notes" field manually in your Airtable:');
    console.log('\n1. Go to your Airtable base');
    console.log('2. Click on the "Contacts" table');
    console.log('3. Click the "+" button next to the last column');
    console.log('4. Name the new field "Notes"');
    console.log('5. Set the field type to "Long text"');
    console.log('6. Save the changes');
    console.log('\nOnce you\'ve added the field, run this script again to verify it exists.');
    
    // Check if the field exists after manual addition
    const records = await base(contactsTableId)
      .select({
        maxRecords: 1
      })
      .all();
    
    if (records.length > 0) {
      const fields = Object.keys(records[0].fields);
      
      if (fields.includes('Notes')) {
        console.log('\n✅ "Notes" field successfully added!');
        console.log('📋 Current fields:', fields);
      } else {
        console.log('\n❌ "Notes" field not found yet.');
        console.log('📋 Current fields:', fields);
        console.log('\nPlease add the field manually and run this script again.');
      }
    }
    
  } catch (error) {
    console.error('❌ Error adding Notes field:', error);
  }
}

addNotesField(); 