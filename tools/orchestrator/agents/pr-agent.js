/**
 * PR Agent
 * Creates commits and pull requests
 */

const { execSync } = require('child_process');

module.exports = {
  name: 'pr',
  model: 'haiku',

  async execute(context) {
    const { task, dryRun, results } = context;

    if (dryRun) {
      return {
        success: true,
        summary: 'PR creation skipped (dry run)',
      };
    }

    // Check if there are changes to commit
    let hasChanges = false;
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      hasChanges = status.trim().length > 0;
    } catch (e) {
      return {
        success: false,
        summary: 'Failed to check git status',
        error: e.message,
      };
    }

    if (!hasChanges) {
      return {
        success: true,
        summary: 'No changes to commit',
      };
    }

    // Generate commit message from task
    const commitMessage = generateCommitMessage(task);

    try {
      // Stage all changes
      execSync('git add -A');

      // Create commit
      execSync(`git commit -m "${commitMessage}"`, { encoding: 'utf8' });

      return {
        success: true,
        summary: `Committed: ${commitMessage}`,
        commit: commitMessage,
      };
    } catch (e) {
      return {
        success: false,
        summary: 'Failed to create commit',
        error: e.message,
      };
    }
  },
};

function generateCommitMessage(task) {
  // Determine commit type from task
  const taskLower = task.toLowerCase();

  let type = 'chore';
  if (taskLower.includes('fix')) type = 'fix';
  else if (taskLower.includes('add') || taskLower.includes('new')) type = 'feat';
  else if (taskLower.includes('refactor')) type = 'refactor';
  else if (taskLower.includes('style') || taskLower.includes('polish')) type = 'style';
  else if (taskLower.includes('test')) type = 'test';
  else if (taskLower.includes('doc')) type = 'docs';

  // Truncate task for commit message
  const shortTask = task.length > 50 ? task.slice(0, 47) + '...' : task;

  return `${type}: ${shortTask}`;
}
