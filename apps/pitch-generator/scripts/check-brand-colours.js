#!/usr/bin/env node
/**
 * Pitch Generator Brand Colour Validator
 * Ensures only amber colours are used (no purple/blue from other apps)
 *
 * Run: npm run check-colours
 */

const fs = require('fs');
const path = require('path');

// Pitch Generator brand colours (ALLOWED)
const ALLOWED_COLOURS = {
  amber: ['amber-', '#FFC857', '#F59E0B', 'brand-amber'],
  yellow: ['yellow-'], // Related to amber
  neutral: ['gray-', 'grey-', 'white', 'black'],
  status: ['green-', 'red-'], // For warning/success states only
  gradients: ['from-amber-', 'to-amber-', 'via-amber-', 'from-yellow-', 'to-yellow-'],
};

// FORBIDDEN colours from other apps
const FORBIDDEN_COLOURS = {
  blue: ['blue-', '#1E88E5', '#1976D2', '#1565C0', '#0EA5E9', 'brand-iris'], // Audio Intel colour
  purple: ['purple-', '#7C3AED', '#9333EA', '#A855F7'], // Command Centre colour
  indigo: ['indigo-', '#6366F1', '#4338CA'], // Other app colour
  pink: ['pink-', '#EC4899'], // Other app colour
  magenta: ['brand-magenta', '#C954F7'], // Tracker colour
};

// Exceptions (files where warnings are allowed)
const EXCEPTIONS = [
  'node_modules',
  '.next',
  'scripts/check-brand-colours.js',
  'tailwind.config.ts', // Config file that lists all colours
  'components/shared/ToolSwitcher.tsx', // Tool switcher shows other apps' colours
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
          // Check if it's in a comment explaining the rule
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

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);

    if (fs.statSync(filePath).isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.next')) {
        walkDir(filePath, fileList);
      }
    } else if (file.match(/\.(ts|tsx|css)$/)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function main() {
  console.log('🎨 Checking Pitch Generator brand colours...\n');

  // Find all TypeScript/TSX/CSS files
  const files = walkDir(path.join(__dirname, '..'));

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

  // Group by file
  const violationsByFile = {};
  allViolations.forEach(v => {
    if (!violationsByFile[v.file]) {
      violationsByFile[v.file] = [];
    }
    violationsByFile[v.file].push(v);
  });

  Object.entries(violationsByFile).forEach(([file, violations]) => {
    const relativeFile = path.relative(path.join(__dirname, '..'), file);
    console.log(`📁 ${relativeFile}`);
    violations.forEach(v => {
      console.log(`   Line ${v.line}: ${v.colour.toUpperCase()} colour "${v.pattern}"`);
      console.log(`   ${v.context.substring(0, 80)}...`);
    });
    console.log('');
  });

  console.log('💡 Pitch Generator brand colour: AMBER (#FFC857, amber-500)');
  console.log('   Replace blue/purple/indigo with amber equivalents\n');

  process.exit(1);
}

main();
