#!/usr/bin/env node

/**
 * Apply Supabase Migration via REST API
 * Executes the Golden Verify + Testing integration migration
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const SUPABASE_URL = 'https://ucncbighzqudaszewjrv.supabase.co';
const SUPABASE_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbmNiaWdoenF1ZGFzemV3anJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODkxNTYyMSwiZXhwIjoyMDc0NDkxNjIxfQ.jNbVTjvh7uOGINRPXJ6TFQJuNEbOLuOccVm8nqnlgPE';
const MIGRATION_FILE = path.join(
  __dirname,
  '../supabase/migrations/20251111_golden_verify_integration.sql'
);

// Read migration file
const migrationSQL = fs.readFileSync(MIGRATION_FILE, 'utf8');

// Execute SQL via Supabase REST API
async function executeMigration() {
  console.log('🚀 Applying Golden Verify + Testing Integration Migration...\n');

  // We need to use the PostgREST API to execute raw SQL
  // Supabase REST API uses PostgREST which doesn't support arbitrary SQL execution
  // Instead, we'll use the Supabase Management API

  const url = `${SUPABASE_URL}/rest/v1/rpc/exec_sql`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ Migration applied successfully!');
          console.log('Response:', data);
          resolve(data);
        } else {
          console.error('❌ Migration failed!');
          console.error('Status:', res.statusCode);
          console.error('Response:', data);
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', error => {
      console.error('❌ Request failed:', error);
      reject(error);
    });

    req.write(JSON.stringify({ query: migrationSQL }));
    req.end();
  });
}

// Verify tables were created
async function verifyTables() {
  console.log('\n🔍 Verifying table creation...\n');

  const queries = [
    { name: 'golden_history', query: 'SELECT COUNT(*) as count FROM golden_history' },
    { name: 'testing_results', query: 'SELECT COUNT(*) as count FROM testing_results' },
  ];

  for (const { name, query } of queries) {
    const url = `${SUPABASE_URL}/rest/v1/rpc/exec_sql`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    };

    await new Promise((resolve, reject) => {
      const req = https.request(url, options, res => {
        let data = '';

        res.on('data', chunk => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log(`✅ Table ${name}: ${data}`);
          } else {
            console.log(`⚠️  Table ${name}: Unable to verify (${res.statusCode})`);
          }
          resolve();
        });
      });

      req.on('error', error => {
        console.error(`❌ Verification failed for ${name}:`, error.message);
        resolve(); // Don't fail the whole process
      });

      req.write(JSON.stringify({ query }));
      req.end();
    });
  }
}

// Main execution
(async () => {
  try {
    await executeMigration();
    await verifyTables();

    console.log('\n✨ Migration process complete!');
    console.log('\n📋 Next Steps:');
    console.log(
      '1. Verify tables in Supabase Dashboard: https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/editor'
    );
    console.log('2. Test queries in SQL Editor');
    console.log('3. Integrate with Command Centre Ops Console');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.log('\n🔧 Manual migration required:');
    console.log('1. Go to: https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/editor');
    console.log('2. Open SQL Editor');
    console.log('3. Paste contents of: supabase/migrations/20251111_golden_verify_integration.sql');
    console.log('4. Click "Run"');
    process.exit(1);
  }
})();
