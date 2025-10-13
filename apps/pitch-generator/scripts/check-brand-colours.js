#!/usr/bin/env node
/**
 * Pitch Generator Brand Colour Validator
 * Ensures only amber/yellow colours are used (no blue/purple from other apps)
 *
 * Run: npm run check-colours
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Pitch Generator brand colours (ALLOWED)
const ALLOWED_COLOURS = {
  amber: ['amber-', '#F59E0B', '#FCD34D', '#FBBF24', 'brand-amber'],
  yellow: ['yellow-', '#EAB308'],
  neutral: ['gray-', 'white', 'black'],
  status: ['green-', 'red-', 'blue-50', 'blue-100', 'blue-200'], // Status indicators only
};

// FORBIDDEN colours from other apps
const FORBIDDEN_COLOURS = {
  blue: ['blue-600', 'blue-700', 'blue-800', 'blue-900', '#1E88E5', '#1976D2'], // Audio Intel
  purple: ['purple-', '#7C3AED', '#9333EA'], // Command Centre/Tracker
};

// Exceptions
const EXCEPTIONS = [
  'node_modules',
  '.next',
  'scripts/check-brand-colours.js',
];

function shouldCheckFile(filePath) {
  return !EXCEPTIONS.some(exception => filePath.includes(exception));
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const violations = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    Object.entries(FORBIDDEN_COLOURS).forEach(([colourName, patterns]) => {
      patterns.forEach(pattern => {
        if (line.includes(pattern)) {
          if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
            return;
          }

          violations.push({
            file: filePath,
            line: index + 1,
            colour: colourName,
            pattern: pattern,
            context: line.trim(),
          });
        }
      });
    });
  });

  return violations;
}

function main() {
  console.log('🎨 Checking Pitch Generator brand colours...\n');

  const files = glob.sync('**/*.{ts,tsx}', {
    ignore: ['node_modules/**', '.next/**', 'scripts/**'],
  });

  let allViolations = [];

  files.forEach(file => {
    if (shouldCheckFile(file)) {
      const violations = checkFile(file);
      allViolations = allViolations.concat(violations);
    }
  });

  if (allViolations.length === 0) {
    console.log('✅ All colours are correct! Pitch Generator is using amber consistently.\n');
    process.exit(0);
  }

  console.log(`❌ Found ${allViolations.length} forbidden colour usage(s):\n`);

  const violationsByFile = {};
  allViolations.forEach(v => {
    if (!violationsByFile[v.file]) {
      violationsByFile[v.file] = [];
    }
    violationsByFile[v.file].push(v);
  });

  Object.entries(violationsByFile).forEach(([file, violations]) => {
    console.log(`📁 ${file}`);
    violations.forEach(v => {
      console.log(`   Line ${v.line}: ${v.colour.toUpperCase()} colour "${v.pattern}"`);
      console.log(`   ${v.context.substring(0, 80)}...`);
    });
    console.log('');
  });

  console.log('💡 Pitch Generator brand colour: AMBER (#F59E0B, amber-500)');
  console.log('   Replace blue/purple with amber equivalents\n');

  process.exit(1);
}

main();
