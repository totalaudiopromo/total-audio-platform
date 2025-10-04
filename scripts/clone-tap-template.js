#!/usr/bin/env node
const fs = require('fs/promises');
const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help')) {
  console.log(`Usage: node scripts/clone-tap-template.js <new-app-name> [--title "Display Name"] [--path relative/output/path]

Examples:
  node scripts/clone-tap-template.js playlist-ai
  node scripts/clone-tap-template.js press-room --title "Press Room" --path apps/tools/press-room
`);
  process.exit(0);
}

const rawName = args[0];
let displayName = rawName
  .replace(/[-_]+/g, ' ')
  .replace(/\b\w/g, char => char.toUpperCase());
let relativePath = args[0].includes('/') ? args[0] : path.join('apps', rawName);

for (let i = 1; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === '--title') {
    displayName = args[i + 1];
    i += 1;
  } else if (arg.startsWith('--title=')) {
    displayName = arg.split('=')[1];
  } else if (arg === '--path') {
    relativePath = args[i + 1];
    i += 1;
  } else if (arg.startsWith('--path=')) {
    relativePath = arg.split('=')[1];
  }
}

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

(async () => {
  const repoRoot = path.resolve(__dirname, '..');
  const templateDir = path.join(repoRoot, 'apps', 'tap-saas-template');
  const destinationDir = path.resolve(repoRoot, relativePath);

  if (!(await pathExists(templateDir))) {
    console.error('❌ Template directory not found:', templateDir);
    process.exit(1);
  }

  if (await pathExists(destinationDir)) {
    console.error('❌ Destination already exists:', destinationDir);
    process.exit(1);
  }

  console.log('🧬 Cloning template →', destinationDir);
  await fs.cp(templateDir, destinationDir, { recursive: true });

  const removeTargets = ['node_modules', '.next', '.env.local'];
  for (const target of removeTargets) {
    const targetPath = path.join(destinationDir, target);
    try {
      await fs.rm(targetPath, { recursive: true, force: true });
    } catch (err) {
      console.warn('⚠️  Unable to remove', targetPath, err.message);
    }
  }

  const packageJsonPath = path.join(destinationDir, 'package.json');
  try {
    const pkgRaw = await fs.readFile(packageJsonPath, 'utf8');
    const pkg = JSON.parse(pkgRaw);
    pkg.name = rawName.toLowerCase().replace(/[^a-z0-9\-]+/g, '-');
    await fs.writeFile(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
  } catch (err) {
    console.warn('⚠️  Unable to update package.json name:', err.message);
  }

  const layoutPath = path.join(destinationDir, 'app', 'layout.tsx');
  try {
    let layout = await fs.readFile(layoutPath, 'utf8');
    layout = layout
      .replace(/TAP SaaS Template/g, displayName)
      .replace(/Postcraft-inspired SaaS starter for Total Audio Promo micro tools\./,
        `${displayName} · Generated from the TAP SaaS Template.`);
    await fs.writeFile(layoutPath, layout);
  } catch (err) {
    console.warn('⚠️  Unable to update layout metadata:', err.message);
  }

  const readmePath = path.join(destinationDir, 'README.md');
  try {
    let readme = await fs.readFile(readmePath, 'utf8');
    readme = readme.replace(/^# TAP SaaS Template/m, `# ${displayName}`);
    await fs.writeFile(readmePath, readme);
  } catch (err) {
    console.warn('⚠️  Unable to update README header:', err.message);
  }

  console.log('\n✅ Clone complete! Next steps:');
  console.log(`  1. cd ${path.relative(process.cwd(), destinationDir)}`);
  console.log('  2. cp .env.local.example .env.local (update secrets as needed)');
  console.log('  3. npm install');
  console.log('  4. npm run dev');
})();
