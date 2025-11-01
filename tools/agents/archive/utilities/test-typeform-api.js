#!/usr/bin/env node

/**
 * Test Typeform API directly to check endpoints
 */

const fetch = require('node-fetch');

async function testTypeformAPI() {
  const apiKey = 'tfp_FNjg2X7QkW3MkWqY5xr2pCL9ADyTjEKExmgvbhoAvrd3_3mPGrSWR3HxkHn';

  console.log('Testing Typeform API endpoints...\n');

  // Test different API versions
  const endpoints = [
    'https://api.typeform.com/v1/forms',
    'https://api.typeform.com/v1/me',
    'https://api.typeform.com/forms',
    'https://api.typeform.com/me',
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`  Status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        console.log(`  ✅ Success! Data keys: ${Object.keys(data).join(', ')}`);
        if (data.items) {
          console.log(`  Items count: ${data.items.length}`);
        }
      } else {
        const errorText = await response.text();
        console.log(`  ❌ Error: ${errorText.substring(0, 100)}...`);
      }
      console.log('');
    } catch (error) {
      console.log(`  ❌ Exception: ${error.message}`);
      console.log('');
    }
  }
}

testTypeformAPI();
