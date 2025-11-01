#!/usr/bin/env node
/**
 * Tracker Brand Colour Validator
 * Ensures only purple colours are used (no blue/amber from other apps)
 *
 * Run: npm run check-colours
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Tracker brand colours (ALLOWED)
const ALLOWED_COLOURS = {
  purple: ['purple-', '#7C3AED', '#9333EA', '#A855F7'],
  indigo: ['indigo-'],
  neutral: ['gray-', 'white', 'black'],
  status: ['green-', 'red-', 'blue-50', 'blue-100', 'blue-200', 'yellow-'], // Status indicators only
};

// FORBIDDEN colours from other apps
const FORBIDDEN_COLOURS = {
  blue: ['blue-600', 'blue-700', 'blue-800', 'blue-900', '#1E88E5', '#1976D2'], // Audio Intel
  amber: ['amber-500', 'amber-600', 'amber-700', '#F59E0B'], // Pitch Generator
};

// Exceptions
const EXCEPTIONS = ['node_modules', '.next', 'scripts/check-brand-colours.js'];

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
  console.log('🎨 Checking Tracker brand colours...\n');

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
    console.log(
      '✅ All colours are correct! Tracker is using purple consistently.\n'
    );
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
      console.log(
        `   Line ${v.line}: ${v.colour.toUpperCase()} colour "${v.pattern}"`
      );
      console.log(`   ${v.context.substring(0, 80)}...`);
    });
    console.log('');
  });

  console.log('💡 Tracker brand colour: PURPLE (#7C3AED, purple-600)');
  console.log('   Replace blue/amber with purple equivalents\n');

  process.exit(1);
}

main();
