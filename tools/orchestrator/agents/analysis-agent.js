/**
 * Analysis Agent
 * Analyses problems and plans solutions using Opus for deep reasoning
 */

module.exports = {
  name: 'analysis',
  model: 'opus',

  async execute(context) {
    const { task, workspace } = context;

    // Build analysis prompt
    const analysisPrompt = `
Analyse this task for the Total Audio Platform:

Task: "${task}"

Active Apps: ${workspace.activeApps.join(', ')}
Shared Packages: ${workspace.sharedPackages.join(', ')}

Provide:
1. Problem breakdown
2. Affected areas (apps, packages, components)
3. Recommended approach
4. Potential risks
5. Estimated complexity (low/medium/high)
`;

    // For now, return a placeholder - will integrate with Claude API
    return {
      success: true,
      summary: 'Analysis complete',
      analysis: {
        task,
        complexity: 'medium',
        affectedAreas: [],
        approach: 'TBD - integrate with Claude API',
        risks: [],
      },
    };
  },
};
