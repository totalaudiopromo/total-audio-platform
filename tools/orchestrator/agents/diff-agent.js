/**
 * Diff Agent
 * Generates and displays diffs for review
 */

const { execSync } = require('child_process');

module.exports = {
  name: 'diff',
  model: 'haiku',

  async execute(context) {
    const { patches, files } = context;

    // Generate unified diff output
    let diffOutput = '';

    try {
      // Get git diff for any modified files
      diffOutput = execSync('git diff --color=always 2>/dev/null || echo "No git changes"', {
        encoding: 'utf8',
        cwd: process.cwd(),
      });
    } catch (e) {
      diffOutput = 'Unable to generate diff';
    }

    // Display diff preview
    if (diffOutput && diffOutput !== 'No git changes\n') {
      console.log('\n📄 Diff Preview:\n');
      console.log(diffOutput);
    }

    return {
      success: true,
      summary: diffOutput ? 'Diff generated' : 'No changes to diff',
      diff: diffOutput,
    };
  },
};
