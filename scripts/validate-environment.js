#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Required environment variables for each app
const requiredEnvVars = {
  'audio-intel': [
    'NEXT_PUBLIC_BASE_URL',
    'PERPLEXITY_API_KEY'
  ],
  'command-centre': [
    'NEXT_PUBLIC_BASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET'
  ],
  'tracker': [
    'NEXT_PUBLIC_BASE_URL',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY'
  ],
  'web': [
    'NEXT_PUBLIC_BASE_URL'
  ],
  'pitch-generator': [
    'NEXT_PUBLIC_BASE_URL',
    'OPENAI_API_KEY'
  ]
};

// Apps to validate
const apps = ['audio-intel', 'command-centre', 'tracker', 'web', 'pitch-generator'];

function validateEnvironment() {
  console.log('🔍 Validating environment variables...\n');
  
  let allValid = true;
  
  apps.forEach(app => {
    console.log(`📱 Checking ${app}:`);
    
    const envFile = path.join(__dirname, '..', 'apps', app, '.env.local');
    const envProductionFile = path.join(__dirname, '..', 'apps', app, '.env.production');
    
    // Check if .env files exist
    const envExists = fs.existsSync(envFile);
    const envProdExists = fs.existsSync(envProductionFile);
    
    if (!envExists && !envProdExists) {
      console.log(`  ⚠️  No .env files found for ${app}`);
      console.log(`  📝 Create .env.local and .env.production files`);
    }
    
    // Check required variables
    const required = requiredEnvVars[app] || [];
    required.forEach(varName => {
      // In CI/CD, check if variable is set
      if (process.env[varName]) {
        console.log(`  ✅ ${varName}`);
      } else {
        console.log(`  ❌ ${varName} - Missing`);
        allValid = false;
      }
    });
    
    console.log('');
  });
  
  if (allValid) {
    console.log('🎉 All environment variables are valid!');
    process.exit(0);
  } else {
    console.log('❌ Some environment variables are missing!');
    console.log('📝 Add missing variables to your .env files or GitHub Secrets');
    process.exit(1);
  }
}

// Run validation
validateEnvironment();
