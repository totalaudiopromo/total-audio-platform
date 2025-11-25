/**
 * File Scanner Agent
 * Locates relevant files and components based on task context
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

module.exports = {
  name: 'file-scanner',
  model: 'sonnet',

  async execute(context) {
    const { task, workspace, results } = context;

    // Extract keywords from task
    const keywords = extractKeywords(task);

    // Search for relevant files
    const files = [];

    for (const keyword of keywords) {
      try {
        // Use ripgrep for fast searching
        const rgResult = execSync(
          `rg -l -i "${keyword}" --type ts --type tsx --type js 2>/dev/null | head -20`,
          { encoding: 'utf8', cwd: process.cwd() }
        ).trim();

        if (rgResult) {
          files.push(...rgResult.split('\n').filter(Boolean));
        }
      } catch (e) {
        // No matches found
      }
    }

    // Deduplicate
    const uniqueFiles = [...new Set(files)];

    // Filter by workspace context
    const relevantFiles = uniqueFiles.filter(file => {
      return (
        workspace.activeApps.some(app => file.includes(app)) ||
        workspace.sharedPackages.some(pkg => file.includes(pkg))
      );
    });

    context.files = relevantFiles;

    return {
      success: true,
      summary: `Found ${relevantFiles.length} relevant files`,
      files: relevantFiles,
    };
  },
};

function extractKeywords(task) {
  // Simple keyword extraction
  const stopWords = ['the', 'a', 'an', 'is', 'are', 'to', 'for', 'of', 'in', 'on', 'with'];
  return task
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
}
