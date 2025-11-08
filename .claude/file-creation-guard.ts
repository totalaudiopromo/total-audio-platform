/**
 * File Creation Guard for Claude Code
 *
 * Checks proposed .md file paths against existing files to prevent duplicates.
 * Uses Levenshtein distance and prefix matching to detect similar filenames.
 *
 * Usage:
 *   import { checkSimilarFiles } from '.claude/file-creation-guard';
 *   const warning = await checkSimilarFiles('PHASE_8_VALIDATION.md');
 *   if (warning) {
 *     console.warn(warning);
 *     // Ask user for confirmation before creating
 *   }
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

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
function sharesPrefix(filename1: string, filename2: string, minLength = 10): boolean {
  const prefix1 = filename1.substring(0, minLength).toLowerCase();
  const prefix2 = filename2.substring(0, minLength).toLowerCase();
  return prefix1 === prefix2;
}

interface SimilarFile {
  path: string;
  filename: string;
  distance: number;
  hasPrefix: boolean;
  similarity: 'levenshtein' | 'prefix';
}

/**
 * Find all markdown files recursively in a directory
 */
function findMarkdownFiles(dir: string, fileList: SimilarFile[] = []): SimilarFile[] {
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
        distance: 0,
        hasPrefix: false,
        similarity: 'levenshtein',
      });
    } else if (entry.isDirectory()) {
      findMarkdownFiles(fullPath, fileList);
    }
  }

  return fileList;
}

/**
 * Check for similar files to a proposed filename
 *
 * @param proposedFilePath - The proposed file path (relative or absolute)
 * @param threshold - Levenshtein distance threshold (default: 3)
 * @returns Warning message if similar files found, null otherwise
 */
export function checkSimilarFiles(proposedFilePath: string, threshold = 3): string | null {
  // Get root directory (assuming this file is in .claude/)
  const rootDir = path.resolve(__dirname, '..');
  const proposedFilename = path.basename(proposedFilePath);
  const proposedBasename = path.basename(proposedFilename, '.md');

  if (!proposedFilename.endsWith('.md')) {
    return null; // Not a markdown file, skip check
  }

  const similarFiles: SimilarFile[] = [];

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
      distance: 0,
      hasPrefix: false,
      similarity: 'levenshtein' as const,
    }));

  const allMarkdownFiles = [...allFiles, ...rootFiles];

  for (const file of allMarkdownFiles) {
    const fileBasename = path.basename(file.filename, '.md');
    const distance = levenshteinDistance(
      proposedBasename.toLowerCase(),
      fileBasename.toLowerCase()
    );
    const hasPrefix = sharesPrefix(proposedBasename, fileBasename);

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

  if (similarFiles.length === 0) {
    return null;
  }

  // Sort by distance (lower is more similar)
  similarFiles.sort((a, b) => {
    if (a.distance !== b.distance) {
      return a.distance - b.distance;
    }
    return a.filename.localeCompare(b.filename);
  });

  // Build warning message
  const topMatches = similarFiles.slice(0, 3); // Show top 3 matches
  const relPaths = topMatches.map(f => path.relative(rootDir, f.path));

  let warning = `⚠️  Similar files found to "${proposedFilename}":\n\n`;
  topMatches.forEach((file, idx) => {
    const similarityType =
      file.similarity === 'levenshtein'
        ? `Levenshtein distance: ${file.distance}`
        : 'Shared prefix';
    warning += `  ${idx + 1}. ${relPaths[idx]}\n`;
    warning += `     ${similarityType}\n\n`;
  });

  if (similarFiles.length > 3) {
    warning += `  ... and ${similarFiles.length - 3} more similar file(s)\n\n`;
  }

  warning += '💡 Consider updating the existing file instead of creating a new one.\n';
  warning += '   If you still want to create this file, please confirm explicitly.';

  return warning;
}

/**
 * Check if a file path should be created (with guard)
 *
 * @param proposedFilePath - The proposed file path
 * @returns Object with shouldCreate flag and warning message
 */
export function shouldCreateFile(proposedFilePath: string): {
  shouldCreate: boolean;
  warning: string | null;
} {
  const warning = checkSimilarFiles(proposedFilePath);

  return {
    shouldCreate: warning === null,
    warning,
  };
}
