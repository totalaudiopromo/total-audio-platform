/**
 * Patch Generator Agent
 * Generates code patches based on analysis
 */

module.exports = {
  name: 'patch-generator',
  model: 'sonnet',

  async execute(context) {
    const { task, files, patterns, conventions, dryRun } = context;

    const patches = [];

    // For each affected file, generate a patch
    for (const file of files.slice(0, 10)) {
      // Limit to 10 files
      const patch = {
        file,
        type: 'modify',
        description: `Update ${path.basename(file)} for: ${task}`,
        changes: [],
        generated: false, // Will be true when integrated with Claude API
      };

      patches.push(patch);
    }

    context.patches = patches;

    return {
      success: true,
      summary: `Generated ${patches.length} patch templates`,
      patches,
    };
  },
};

const path = require('path');
