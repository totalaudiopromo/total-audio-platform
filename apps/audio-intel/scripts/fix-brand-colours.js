#!/usr/bin/env node
/**
 * Audio Intel Brand Colour Auto-Fixer
 * Automatically replaces purple/amber with blue
 *
 * Run: npm run fix-colours
 */

const fs = require('fs');
const path = require('path');

// Colour replacements
const REPLACEMENTS = [
  // Purple to Blue
  { from: /purple-50/g, to: 'blue-50' },
  { from: /purple-100/g, to: 'blue-100' },
  { from: /purple-200/g, to: 'blue-200' },
  { from: /purple-300/g, to: 'blue-300' },
  { from: /purple-400/g, to: 'blue-400' },
  { from: /purple-500/g, to: 'blue-500' },
  { from: /purple-600/g, to: 'blue-600' },
  { from: /purple-700/g, to: 'blue-700' },
  { from: /purple-800/g, to: 'blue-800' },
  { from: /purple-900/g, to: 'blue-900' },
  { from: /#7C3AED/g, to: '#1E88E5' }, // Purple hex to blue hex
  { from: /#9333EA/g, to: '#1976D2' },
  { from: /#A855F7/g, to: '#1E88E5' },

  // Amber to Blue (for branding, NOT warnings)
  { from: /amber-50/g, to: 'blue-50' },
  { from: /amber-100/g, to: 'blue-100' },
  { from: /amber-600/g, to: 'blue-600' },
  { from: /amber-700/g, to: 'blue-700' },
  { from: /#F59E0B/g, to: '#1E88E5' },

  // Indigo to Blue
  { from: /indigo-50/g, to: 'blue-50' },
  { from: /indigo-100/g, to: 'blue-100' },
  { from: /indigo-200/g, to: 'blue-200' },
  { from: /indigo-500/g, to: 'blue-500' },
  { from: /indigo-600/g, to: 'blue-600' },
  { from: /indigo-700/g, to: 'blue-700' },
  { from: /indigo-800/g, to: 'blue-800' },
  { from: /indigo-900/g, to: 'blue-900' },

  // Pink to Blue
  { from: /pink-50/g, to: 'blue-50' },
  { from: /pink-500/g, to: 'blue-500' },
  { from: /pink-600/g, to: 'blue-600' },
  { from: /pink-700/g, to: 'blue-700' },

  // Gradients
  { from: /from-purple-/g, to: 'from-blue-' },
  { from: /to-purple-/g, to: 'to-blue-' },
  { from: /via-purple-/g, to: 'via-blue-' },
  { from: /from-indigo-/g, to: 'from-blue-' },
  { from: /to-indigo-/g, to: 'to-blue-' },
  { from: /via-indigo-/g, to: 'via-blue-' },
  { from: /from-pink-/g, to: 'from-blue-' },
  { from: /to-pink-/g, to: 'to-blue-' },
];

// Files to skip
const SKIP_FILES = [
  'node_modules',
  '.next',
  'scripts/',
  'lib/brand-system.ts',
  'components/UsageStats.tsx', // Uses amber for warnings
  'components/shared/ToolSwitcher.tsx',
  'app/progress-dashboard/',
];

const ROOT_DIRECTORY = process.cwd();
const IGNORED_DIRECTORIES = new Set(['node_modules', '.next']);

function shouldFixFile(filePath) {
  return !SKIP_FILES.some(skip => filePath.includes(skip));
}

function collectEditableFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  entries.forEach(entry => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (IGNORED_DIRECTORIES.has(entry.name)) {
        return;
      }

      files.push(...collectEditableFiles(fullPath));
      return;
    }

    if (
      entry.isFile() &&
      (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.css'))
    ) {
      files.push(path.relative(ROOT_DIRECTORY, fullPath));
    }
  });

  return files;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changesMade = 0;

  REPLACEMENTS.forEach(({ from, to }) => {
    const matches = content.match(from);
    if (matches) {
      content = content.replace(from, to);
      changesMade += matches.length;
    }
  });

  if (changesMade > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${changesMade} colour(s) in ${filePath}`);
  }

  return changesMade;
}

function main() {
  console.log('🎨 Auto-fixing Audio Intel brand colours...\n');

  const files = collectEditableFiles(ROOT_DIRECTORY);

  let totalChanges = 0;
  let filesFixed = 0;

  files.forEach(file => {
    if (shouldFixFile(file)) {
      const changes = fixFile(file);
      if (changes > 0) {
        totalChanges += changes;
        filesFixed++;
      }
    }
  });

  console.log('');
  if (totalChanges > 0) {
    console.log(`✅ Fixed ${totalChanges} colour reference(s) in ${filesFixed} file(s)`);
    console.log('   Run: npm run check-colours (to verify)\n');
  } else {
    console.log('✅ No colour issues found!\n');
  }
}

main();
