#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Target versions for standardization
const targetVersions = {
  'react': '19.1.0',
  'react-dom': '19.1.0',
  'next': '15.3.0',
  'typescript': '^5.7.2',
  'tailwindcss': '^3.4.18',
  'lucide-react': '^0.542.0'
};

const apps = ['audio-intel', 'command-centre', 'tracker', 'web', 'pitch-generator'];

function standardizeDependencies() {
  console.log('🔧 Standardizing dependencies across all apps...\n');
  
  apps.forEach(app => {
    const packageJsonPath = path.join(__dirname, '..', 'apps', app, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      console.log(`⚠️  Package.json not found for ${app}`);
      return;
    }
    
    console.log(`📱 Updating ${app}:`);
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    let updated = false;
    
    // Update dependencies
    Object.keys(targetVersions).forEach(dep => {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        const currentVersion = packageJson.dependencies[dep];
        const targetVersion = targetVersions[dep];
        
        if (currentVersion !== targetVersion) {
          console.log(`  🔄 ${dep}: ${currentVersion} → ${targetVersion}`);
          packageJson.dependencies[dep] = targetVersion;
          updated = true;
        } else {
          console.log(`  ✅ ${dep}: ${currentVersion}`);
        }
      }
      
      if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
        const currentVersion = packageJson.devDependencies[dep];
        const targetVersion = targetVersions[dep];
        
        if (currentVersion !== targetVersion) {
          console.log(`  🔄 ${dep}: ${currentVersion} → ${targetVersion}`);
          packageJson.devDependencies[dep] = targetVersion;
          updated = true;
        } else {
          console.log(`  ✅ ${dep}: ${currentVersion}`);
        }
      }
    });
    
    // Write back if updated
    if (updated) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
      console.log(`  💾 Updated package.json`);
    } else {
      console.log(`  ✅ No updates needed`);
    }
    
    console.log('');
  });
  
  console.log('🎉 Dependency standardization complete!');
  console.log('📝 Run "npm install" in each app directory to update lockfiles');
}

// Run standardization
standardizeDependencies();
