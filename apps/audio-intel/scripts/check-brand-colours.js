#!/usr/bin/env node
/**
 * Audio Intel Brand Colour Validator
 * Ensures only blue colours are used (no purple/amber from other apps)
 *
 * Run: npm run check-colours
 */

const fs = require('fs');
const path = require('path');

// Audio Intel brand colours (ALLOWED)
const ALLOWED_COLOURS = {
  blue: ['blue-', '#1E88E5', '#1976D2', '#1565C0', '#0EA5E9'],
  neutral: ['gray-', 'white', 'black'],
  status: ['green-', 'red-', 'yellow-', 'orange-'], // For warning/success states only
  gradients: ['from-blue-', 'to-blue-', 'via-blue-'],
};

// FORBIDDEN colours from other apps
const FORBIDDEN_COLOURS = {
  purple: ['purple-', '#7C3AED', '#9333EA', '#A855F7'], // Command Centre colour
  amber: ['amber-', '#F59E0B', '#FCD34D'], // Other app colour
  pink: ['pink-', '#EC4899'], // Other app colour
  indigo: ['indigo-', '#6366F1'], // Other app colour
};

// Exceptions (files where warnings are allowed)
const EXCEPTIONS = [
  'node_modules',
  '.next',
  'scripts/check-brand-colours.js',
  'lib/brand-system.ts', // Config file that lists all colours
  'components/UsageStats.tsx', // Uses amber for warning states (correct UX)
  'components/shared/ToolSwitcher.tsx', // Tool switcher shows other apps' colours
  'app/progress-dashboard/', // Internal dashboard, not customer-facing
];

const ROOT_DIRECTORY = process.cwd();
const IGNORED_DIRECTORIES = new Set(['node_modules', '.next', 'scripts']);

function shouldCheckFile(filePath) {
  return !EXCEPTIONS.some(exception => filePath.includes(exception));
}

function collectSourceFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  entries.forEach(entry => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (IGNORED_DIRECTORIES.has(entry.name)) {
        return;
      }

      files.push(...collectSourceFiles(fullPath));
      return;
    }

    if (
      entry.isFile() &&
      (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))
    ) {
      files.push(path.relative(ROOT_DIRECTORY, fullPath));
    }
  });

  return files;
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

function main() {
  console.log('🎨 Checking Audio Intel brand colours...\n');

  // Find all TypeScript/TSX files
  const files = collectSourceFiles(ROOT_DIRECTORY);

  let allViolations = [];

  files.forEach(file => {
    if (shouldCheckFile(file)) {
      const violations = checkFile(file);
      allViolations = allViolations.concat(violations);
    }
  });

  if (allViolations.length === 0) {
    console.log('✅ All colours are correct! Audio Intel is using blue consistently.\n');
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
    console.log(`📁 ${file}`);
    violations.forEach(v => {
      console.log(`   Line ${v.line}: ${v.colour.toUpperCase()} colour "${v.pattern}"`);
      console.log(`   ${v.context.substring(0, 80)}...`);
    });
    console.log('');
  });

  console.log('💡 Audio Intel brand colour: BLUE (#1E88E5, blue-600)');
  console.log('   Replace purple/amber with blue equivalents\n');
  console.log('   Run: npm run fix-colours (to auto-fix)\n');

  process.exit(1);
}

main();
