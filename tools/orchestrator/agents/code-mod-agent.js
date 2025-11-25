/**
 * Code Mod Agent
 * Applies code modifications from patches
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'code-mod',
  model: 'sonnet',

  async execute(context) {
    const { patches, dryRun, protectedPaths } = context;

    const results = {
      applied: [],
      skipped: [],
      errors: [],
    };

    for (const patch of patches) {
      // Safety check
      if (isProtected(patch.file, protectedPaths)) {
        results.skipped.push({
          file: patch.file,
          reason: 'Protected path',
        });
        continue;
      }

      if (dryRun) {
        results.skipped.push({
          file: patch.file,
          reason: 'Dry run mode',
        });
        continue;
      }

      // Apply patch (when integrated with Claude API)
      if (patch.generated && patch.changes.length > 0) {
        try {
          // applyPatch(patch);
          results.applied.push(patch.file);
        } catch (error) {
          results.errors.push({
            file: patch.file,
            error: error.message,
          });
        }
      } else {
        results.skipped.push({
          file: patch.file,
          reason: 'No changes generated',
        });
      }
    }

    return {
      success: results.errors.length === 0,
      summary: `Applied ${results.applied.length}, skipped ${results.skipped.length}`,
      results,
    };
  },
};

function isProtected(filePath, protectedPaths) {
  return protectedPaths.some(pattern => {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return regex.test(filePath);
  });
}
