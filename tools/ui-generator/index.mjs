#!/usr/bin/env node

/**
 * Total Audio UI Component Generator
 *
 * Scaffolds new UI components for TAP or OperatorOS design systems.
 *
 * Usage:
 *   pnpm ui:generate tap ComponentName
 *   pnpm ui:generate operator ComponentName
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function error(message) {
  log(`❌ Error: ${message}`, 'red');
  process.exit(1);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function info(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

// Parse command-line arguments
const args = process.argv.slice(2);
const [system, componentName] = args;

if (!system || !componentName) {
  error('Usage: pnpm ui:generate <tap|operator> <ComponentName>');
}

if (system !== 'tap' && system !== 'operator') {
  error('System must be "tap" or "operator"');
}

if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
  error('Component name must be PascalCase (e.g., MyComponent)');
}

// Determine target package
const packageName = system === 'tap' ? 'ui-tap' : 'ui-operatoros';
const packageDir = path.join(process.cwd(), 'packages', packageName);
const componentDir = path.join(packageDir, 'src', 'components');
const componentFile = path.join(componentDir, `${componentName}.tsx`);

// Check if package exists
if (!fs.existsSync(packageDir)) {
  error(`Package @total-audio/${packageName} not found at ${packageDir}`);
}

// Check if component already exists
if (fs.existsSync(componentFile)) {
  error(`Component ${componentName} already exists at ${componentFile}`);
}

// Interactive questions
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function askQuestions() {
  info(`Generating ${system === 'tap' ? 'TAP' : 'OperatorOS'} component: ${componentName}`);
  console.log('');

  const componentType = await question(
    'Component type (layout/control/display): '
  );
  const hasVariants = await question('Add variants prop? (y/n): ');
  const description = await question('Short description: ');

  rl.close();

  return {
    componentType: componentType.trim() || 'display',
    hasVariants: hasVariants.toLowerCase() === 'y',
    description: description.trim() || 'Component description',
  };
}

// Generate TAP component template
function generateTAPComponent(name, config) {
  const variantProp = config.hasVariants
    ? `\n  variant?: 'default' | 'primary' | 'secondary';`
    : '';

  const variantStyles = config.hasVariants
    ? `
        {
          'bg-tap-slate-800 text-tap-slate-200': variant === 'default',
          'bg-tap-cyan text-white': variant === 'primary',
          'bg-tap-slate-700 text-tap-slate-100': variant === 'secondary',
        },`
    : '';

  return `import React from 'react';
import { clsx } from 'clsx';

export interface ${name}Props {
  children: React.ReactNode;${variantProp}
  className?: string;
}

/**
 * TAP ${name} Component
 *
 * ${config.description}
 *
 * Design constraints:
 * - Matte, analytical aesthetic
 * - Slate cyan accent for actionable elements
 * - 240ms transitions
 * - No harsh gradients or glows
 */
export function ${name}({
  children,${config.hasVariants ? '\n  variant = \'default\',' : ''}
  className,
}: ${name}Props) {
  return (
    <div
      className={clsx(
        'rounded-tap-md p-4',
        'border border-tap-border',
        'transition-all duration-tap',${variantStyles}
        className
      )}
    >
      {children}
    </div>
  );
}
`;
}

// Generate OperatorOS component template
function generateOperatorOSComponent(name, config) {
  const variantProp = config.hasVariants
    ? `\n  variant?: 'default' | 'accent' | 'muted';`
    : '';

  const variantStyles = config.hasVariants
    ? `
        {
          'bg-[var(--operator-background)] text-[var(--operator-foreground)]':
            variant === 'default',
          'bg-[var(--operator-accent)]/20 text-[var(--operator-accent)] border-[var(--operator-accent)]/30':
            variant === 'accent',
          'bg-[var(--operator-muted)] text-[var(--operator-foreground)]':
            variant === 'muted',
        },`
    : '';

  return `import React from 'react';
import { clsx } from 'clsx';

export interface ${name}Props {
  children: React.ReactNode;${variantProp}
  className?: string;
}

/**
 * Operator${name} Component
 *
 * ${config.description}
 *
 * Design principles:
 * - Theme-aware (uses CSS variables)
 * - Cinematic OS aesthetic
 * - 240ms transitions (Flow State)
 * - Keyboard-first design
 */
export function Operator${name}({
  children,${config.hasVariants ? '\n  variant = \'default\',' : ''}
  className,
}: ${name}Props) {
  return (
    <div
      className={clsx(
        'rounded-md p-4',
        'border border-[var(--operator-border)]',
        'transition-all duration-[240ms]',${variantStyles}
        className
      )}
    >
      {children}
    </div>
  );
}
`;
}

// Main execution
(async () => {
  try {
    const config = await askQuestions();
    console.log('');

    // Generate component code
    const componentCode =
      system === 'tap'
        ? generateTAPComponent(componentName, config)
        : generateOperatorOSComponent(componentName, config);

    // Write component file
    fs.writeFileSync(componentFile, componentCode);
    success(`Created component: ${componentFile}`);

    // Update index.ts
    const indexFile = path.join(packageDir, 'src', 'index.ts');
    const indexContent = fs.readFileSync(indexFile, 'utf-8');

    const exportName =
      system === 'operator' ? `Operator${componentName}` : componentName;
    const newExport = `\nexport { ${exportName} } from './components/${componentName}';\nexport type { ${exportName}Props } from './components/${componentName}';`;

    if (!indexContent.includes(newExport)) {
      fs.appendFileSync(indexFile, newExport);
      success(`Updated ${indexFile}`);
    }

    console.log('');
    info('Next steps:');
    console.log('  1. Review the generated component');
    console.log('  2. Add any additional props or logic');
    console.log('  3. Update the README with usage examples');
    console.log('  4. Test the component in your app');
    console.log('');
    info('Import in your app:');
    console.log(
      `  import { ${exportName} } from '@total-audio/${packageName}';`
    );
    console.log('');
  } catch (err) {
    error(err.message);
  }
})();
