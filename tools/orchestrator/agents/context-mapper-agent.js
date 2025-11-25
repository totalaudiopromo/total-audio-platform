/**
 * Context Mapper Agent
 * Builds context from codebase patterns and conventions
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'context-mapper',
  model: 'sonnet',

  async execute(context) {
    const { files, workspace } = context;

    const patterns = {
      components: [],
      hooks: [],
      utils: [],
      styles: [],
      tests: [],
    };

    // Categorise files by type
    for (const file of files) {
      if (file.includes('/components/')) patterns.components.push(file);
      else if (file.includes('/hooks/')) patterns.hooks.push(file);
      else if (file.includes('/utils/') || file.includes('/lib/')) patterns.utils.push(file);
      else if (file.includes('.css') || file.includes('.scss')) patterns.styles.push(file);
      else if (file.includes('.test.') || file.includes('.spec.')) patterns.tests.push(file);
    }

    // Detect project conventions
    const conventions = detectConventions(files);

    context.patterns = patterns;
    context.conventions = conventions;

    return {
      success: true,
      summary: `Mapped ${files.length} files across ${Object.keys(patterns).length} categories`,
      patterns,
      conventions,
    };
  },
};

function detectConventions(files) {
  const conventions = {
    usesTypeScript: files.some(f => f.endsWith('.ts') || f.endsWith('.tsx')),
    usesTailwind: files.some(f => f.includes('tailwind')),
    usesNextJS: files.some(f => f.includes('/app/') || f.includes('/pages/')),
    componentStyle: 'functional', // Assume functional components
    testFramework: files.some(f => f.includes('vitest')) ? 'vitest' : 'jest',
  };

  return conventions;
}
