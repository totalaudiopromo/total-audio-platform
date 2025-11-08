#!/usr/bin/env node

/**
 * Check for similar markdown files
 *
 * Scans /docs/ recursively for files with similar names to a proposed filename.
 * Uses Levenshtein distance (threshold ≤ 3) or shared prefix matching.
 *
 * Usage:
 *   node scripts/check-similar-files.js <proposed-filename>
 *
 * Examples:
 *   node scripts/check-similar-files.js PHASE_8_VALIDATION.md
 *   node scripts/check-similar-files.js GOLDEN_DEPLOYMENT.md
 */

const fs = require('fs');
const path = require('path');

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = [];

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return matrix[len1][len2];
}

/**
 * Check if two filenames share a common prefix (at least 10 characters)
 */
function sharesPrefix(filename1, filename2, minLength = 10) {
  const prefix1 = filename1.substring(0, minLength).toLowerCase();
  const prefix2 = filename2.substring(0, minLength).toLowerCase();
  return prefix1 === prefix2;
}

/**
 * Find all markdown files recursively in a directory
 */
function findMarkdownFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    return fileList;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Skip common directories
    if (
      entry.isDirectory() &&
      !['docs', 'archive'].includes(entry.name) &&
      !entry.name.startsWith('.')
    ) {
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      fileList.push({
        path: fullPath,
        filename: entry.name,
        basename: path.basename(entry.name, '.md'),
      });
    } else if (entry.isDirectory()) {
      findMarkdownFiles(fullPath, fileList);
    }
  }

  return fileList;
}

/**
 * Find similar files to a proposed filename
 */
function findSimilarFiles(proposedFilename, rootDir, threshold = 3) {
  const proposedBasename = path.basename(proposedFilename, '.md');
  const similarFiles = [];

  // Scan docs/ directory recursively
  const docsDir = path.join(rootDir, 'docs');
  const allFiles = findMarkdownFiles(docsDir);

  // Also check root directory for .md files
  const rootFiles = fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
    .map(entry => ({
      path: path.join(rootDir, entry.name),
      filename: entry.name,
      basename: path.basename(entry.name, '.md'),
    }));

  const allMarkdownFiles = [...allFiles, ...rootFiles];

  for (const file of allMarkdownFiles) {
    const distance = levenshteinDistance(
      proposedBasename.toLowerCase(),
      file.basename.toLowerCase()
    );
    const hasPrefix = sharesPrefix(proposedBasename, file.basename);

    if (distance <= threshold || hasPrefix) {
      similarFiles.push({
        path: file.path,
        filename: file.filename,
        distance,
        hasPrefix,
        similarity: distance <= threshold ? 'levenshtein' : 'prefix',
      });
    }
  }

  // Sort by distance (lower is more similar)
  similarFiles.sort((a, b) => {
    if (a.distance !== b.distance) {
      return a.distance - b.distance;
    }
    return a.filename.localeCompare(b.filename);
  });

  return similarFiles;
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node scripts/check-similar-files.js <proposed-filename>');
    process.exit(1);
  }

  const proposedFilename = args[0];
  const rootDir = path.join(__dirname, '..');

  if (!proposedFilename.endsWith('.md')) {
    console.error('Error: Filename must end with .md');
    process.exit(1);
  }

  const similarFiles = findSimilarFiles(proposedFilename, rootDir);

  if (similarFiles.length === 0) {
    console.log(`✅ No similar files found for: ${proposedFilename}`);
    process.exit(0);
  }

  console.log(`⚠️  Found ${similarFiles.length} similar file(s) to: ${proposedFilename}\n`);

  for (const file of similarFiles) {
    const relPath = path.relative(rootDir, file.path);
    const similarityType =
      file.similarity === 'levenshtein'
        ? `Levenshtein distance: ${file.distance}`
        : 'Shared prefix';

    console.log(`  • ${relPath}`);
    console.log(`    ${similarityType}\n`);
  }

  console.log('💡 Consider updating the existing file instead of creating a new one.');
  process.exit(1);
}

if (require.main === module) {
  main();
}

module.exports = { findSimilarFiles, levenshteinDistance, sharesPrefix };
