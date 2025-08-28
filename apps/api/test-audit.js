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

// Mock configuration for testing
const mockConfig = {
  apiKey: process.env.AIRTABLE_API_KEY,
  baseId: process.env.AIRTABLE_BASE_ID,
  contactsTableId: process.env.AIRTABLE_CONTACTS_TABLE_ID,
  campaignsTableId: process.env.AIRTABLE_CAMPAIGNS_TABLE_ID,
  interactionsTableId: process.env.AIRTABLE_INTERACTIONS_TABLE_ID,
  emailsTableId: process.env.AIRTABLE_EMAILS_TABLE_ID,
};

async function testAudit() {
  try {
    console.log('Starting Airtable data audit...');
    console.log('Configuration:', {
      baseId: mockConfig.baseId,
      contactsTableId: mockConfig.contactsTableId,
      // Don't log API keys
    });
    
    // Create a simple test script that can be run with ts-node
    const testScript = `
import { AirtableAuditService } from './src/services/airtableAudit';

const mockConfig = {
  apiKey: '${mockConfig.apiKey}',
  baseId: '${mockConfig.baseId}',
  contactsTableId: '${mockConfig.contactsTableId}',
  campaignsTableId: '${mockConfig.campaignsTableId}',
  interactionsTableId: '${mockConfig.interactionsTableId}',
  emailsTableId: '${mockConfig.emailsTableId}',
};

async function runAudit() {
  try {
    console.log('🔍 Starting Airtable data audit...');
    
    const auditService = new AirtableAuditService(mockConfig);
    
    // Run full audit
    const auditResult = await auditService.performFullAudit();
    
    console.log('\\n📊 AUDIT RESULTS:');
    console.log('==================');
    console.log('Summary:', JSON.stringify(auditResult.summary, null, 2));
    
    if (auditResult.duplicates.length > 0) {
      console.log('\\n🚨 DUPLICATES FOUND:', auditResult.duplicates.length);
      auditResult.duplicates.forEach((dup, index) => {
        console.log(\`Duplicate \${index + 1}: \${dup.email} - \${dup.names.join(', ')}\`);
      });
    }
    
    if (auditResult.incomplete.length > 0) {
      console.log('\\n⚠️  INCOMPLETE RECORDS:', auditResult.incomplete.length);
      auditResult.incomplete.slice(0, 5).forEach((record, index) => {
        console.log(\`Record \${index + 1}: \${record.email} - Missing: \${record.missingFields.join(', ')}\`);
      });
    }
    
    if (auditResult.inconsistencies.length > 0) {
      console.log('\\n🔧 INCONSISTENCIES FOUND:', auditResult.inconsistencies.length);
      auditResult.inconsistencies.slice(0, 5).forEach((issue, index) => {
        console.log(\`Issue \${index + 1}: \${issue.field} - \${issue.issue}\`);
      });
    }
    
    console.log('\\n✅ Audit completed successfully!');
    
  } catch (error: any) {
    console.error('❌ Audit failed:', error?.message || 'Unknown error');
    if (error?.stack) {
      console.error('Stack:', error.stack);
    }
  }
}

runAudit();
`;

    // Write the test script to a temporary file
    const fs = require('fs');
    const testFile = path.join(__dirname, 'temp-audit-test.ts');
    fs.writeFileSync(testFile, testScript);
    
    console.log('Running audit with ts-node...');
    
    // Run the test script with ts-node
    execSync(`npx ts-node ${testFile}`, { 
      stdio: 'inherit',
      cwd: __dirname 
    });
    
    // Clean up
    fs.unlinkSync(testFile);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Make sure you have:');
    console.error('1. AIRTABLE_API_KEY environment variable set');
    console.error('2. AIRTABLE_BASE_ID environment variable set');
    console.error('3. Other Airtable table IDs configured');
    console.error('4. ts-node installed: npm install -g ts-node');
  }
}

testAudit(); 