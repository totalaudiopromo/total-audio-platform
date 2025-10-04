#!/usr/bin/env node

/**
 * Validates Tailwind CSS v4 configuration
 * Run this before builds to catch syntax errors early
 */

const fs = require('fs');
const path = require('path');

const GLOBALS_CSS_PATH = path.join(__dirname, '../app/globals.css');

console.log('🔍 Checking Tailwind v4 configuration...\n');

// Read globals.css
const globalsContent = fs.readFileSync(GLOBALS_CSS_PATH, 'utf-8');

// Check for correct v4 syntax
const hasCorrectImport = globalsContent.includes('@import "tailwindcss"');
const hasThemeBlock = globalsContent.includes('@theme');

// Check for incorrect v3 syntax
const hasWrongImports = globalsContent.includes('@import "tailwindcss/base"') ||
                        globalsContent.includes('@import "tailwindcss/components"') ||
                        globalsContent.includes('@import "tailwindcss/utilities"');
const hasLayerBase = globalsContent.includes('@layer base');

if (!hasCorrectImport) {
  console.error('❌ ERROR: Missing "@import "tailwindcss";" in globals.css');
  console.error('   This project uses Tailwind v4. See TAILWIND_V4_README.md\n');
  process.exit(1);
}

if (hasWrongImports) {
  console.error('❌ ERROR: Found Tailwind v3 import syntax in globals.css');
  console.error('   Remove: @import "tailwindcss/base" etc.');
  console.error('   Use: @import "tailwindcss";');
  console.error('   See TAILWIND_V4_README.md for details\n');
  process.exit(1);
}

if (hasLayerBase && !hasThemeBlock) {
  console.warn('⚠️  WARNING: Found @layer base without @theme block');
  console.warn('   Tailwind v4 uses @theme {} instead of @layer base {}');
  console.warn('   See TAILWIND_V4_README.md\n');
}

if (!hasThemeBlock) {
  console.warn('⚠️  WARNING: No @theme block found in globals.css');
  console.warn('   Consider adding design tokens using @theme {}\n');
}

console.log('✅ Tailwind v4 configuration looks good!\n');
process.exit(0);
