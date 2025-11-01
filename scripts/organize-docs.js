#!/usr/bin/env node

/**
 * TAP Documentation Organiser
 *
 * Automatically organises scattered .md files into proper docs/ structure
 * Runs across all apps in the monorepo
 *
 * Usage:
 *   node scripts/organize-docs.js [app-name]
 *
 * Examples:
 *   node scripts/organize-docs.js                    # Organize all apps
 *   node scripts/organize-docs.js tap-saas-template  # Organize specific app
 *   node scripts/organize-docs.js --dry-run          # Preview changes without moving files
 */

const fs = require('fs');
const path = require('path');

// File categorization rules (by filename patterns)
const CATEGORIES = {
  setup: [
    /auth.*setup/i,
    /setup.*guide/i,
    /deployment.*guide/i,
    /migration/i,
    /install/i,
    /configuration/i,
    /oauth.*setup/i,
    /^setup_/i,
    /quick.*deploy/i,
    /run.*migration/i,
  ],
  guides: [/how.*to/i, /tutorial/i, /walkthrough/i, /quickstart/i, /getting.*started/i],
  reference: [
    /readme.*prd/i,
    /prd/i,
    /api.*reference/i,
    /architecture/i,
    /strategy/i,
    /tailwind/i,
    /pseo.*strategy/i,
    /_readme/i, // Feature-specific READMEs
  ],
  status: [
    /complete/i,
    /fixed/i,
    /implementation/i,
    /progress/i,
    /status/i,
    /summary/i,
    /report/i,
    /batch.*\d+/i, // PSEO_BATCH_1_COMPLETE etc
  ],
};

// Files to NEVER move (keep at root)
const ROOT_FILES = [
  'README.md',
  'DESIGN_SYSTEM.md',
  'TEMPLATE_USAGE.md',
  'QUICKSTART.md',
  'CONTRIBUTING.md',
  'LICENSE.md',
  'CHANGELOG.md',
  'CODE_OF_CONDUCT.md',
];

// Directories to skip when scanning
const SKIP_DIRS = [
  'node_modules',
  '.next',
  'dist',
  'build',
  '.git',
  'coverage',
  'test-results',
  'reports',
  'screenshots',
];

class DocOrganizer {
  constructor(options = {}) {
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;
    this.moved = [];
    this.skipped = [];
    this.created = [];
  }

  /**
   * Categorize a file based on its name
   */
  categorizeFile(filename) {
    for (const [category, patterns] of Object.entries(CATEGORIES)) {
      if (patterns.some(pattern => pattern.test(filename))) {
        return category;
      }
    }
    return null; // No category match
  }

  /**
   * Check if file should stay at root
   */
  shouldStayAtRoot(filename) {
    return ROOT_FILES.includes(filename);
  }

  /**
   * Find all .md files in directory (non-recursive for root, checks one level deep)
   */
  findMarkdownFiles(dir) {
    const files = [];

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue;
        if (SKIP_DIRS.includes(entry.name)) continue;

        const fullPath = path.join(dir, entry.name);

        if (entry.isFile() && entry.name.endsWith('.md')) {
          // Don't include files already in docs/
          if (!fullPath.includes('/docs/')) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Directory doesn't exist, skip
    }

    return files;
  }

  /**
   * Ensure docs structure exists
   */
  ensureDocsStructure(appDir) {
    const docsDir = path.join(appDir, 'docs');
    const subdirs = ['setup', 'guides', 'reference', 'status'];

    if (!fs.existsSync(docsDir)) {
      if (!this.dryRun) {
        fs.mkdirSync(docsDir);
      }
      this.created.push(docsDir);
      this.log(`📁 Created: ${path.relative(process.cwd(), docsDir)}`, 'green');
    }

    for (const subdir of subdirs) {
      const subdirPath = path.join(docsDir, subdir);
      if (!fs.existsSync(subdirPath)) {
        if (!this.dryRun) {
          fs.mkdirSync(subdirPath, { recursive: true });
        }
        this.created.push(subdirPath);
        this.log(`📁 Created: ${path.relative(process.cwd(), subdirPath)}`, 'green');
      }
    }

    // Create docs/README.md if it doesn't exist
    const docsReadme = path.join(docsDir, 'README.md');
    if (!fs.existsSync(docsReadme)) {
      const appName = path.basename(appDir);
      const readmeContent = this.generateDocsReadme(appName);
      if (!this.dryRun) {
        fs.writeFileSync(docsReadme, readmeContent);
      }
      this.created.push(docsReadme);
      this.log(`📝 Created: ${path.relative(process.cwd(), docsReadme)}`, 'green');
    }
  }

  /**
   * Generate a docs/README.md template
   */
  generateDocsReadme(appName) {
    const title = appName
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return `# ${title} - Documentation

All documentation organised by category.

## 📁 Documentation Structure

### \`/setup/\` - Setup & Configuration
Configuration, deployment, and integration guides.

### \`/guides/\` - How-To Guides
Step-by-step tutorials and feature guides.

### \`/reference/\` - Reference Documentation
Technical specifications, architecture docs, and API references.

### \`/status/\` - Status Reports (Archive)
Historical completion reports and milestone records.

> **Note:** Status files are kept for historical reference but are not actively maintained.

---

## 🎯 Quick Start

For getting started, see the root-level documentation:
- **[README.md](../README.md)** - Main project overview

---

## 📝 Documentation Standards

When adding new documentation:

1. **Setup guides** → \`/docs/setup/\`
2. **How-to guides** → \`/docs/guides/\`
3. **Reference docs** → \`/docs/reference/\`
4. **Status updates** → \`/docs/status/\`

---

*Last updated: ${new Date().toISOString().split('T')[0]}*
`;
  }

  /**
   * Move a file to docs subdirectory
   */
  moveFile(filePath, category, appDir) {
    const filename = path.basename(filePath);
    const targetDir = path.join(appDir, 'docs', category);
    const targetPath = path.join(targetDir, filename);

    // Check if target already exists
    if (fs.existsSync(targetPath)) {
      this.skipped.push({ file: filePath, reason: 'Target exists' });
      this.log(`⏭️  Skipped: ${filename} (already exists in docs/${category}/)`, 'yellow');
      return;
    }

    if (!this.dryRun) {
      fs.renameSync(filePath, targetPath);
    }

    this.moved.push({ from: filePath, to: targetPath, category });
    this.log(`✅ Moved: ${filename} → docs/${category}/`, 'green');
  }

  /**
   * Organize docs for a single app
   */
  organizeApp(appDir) {
    const appName = path.basename(appDir);

    if (!fs.existsSync(appDir)) {
      this.log(`❌ App not found: ${appName}`, 'red');
      return;
    }

    this.log(`\n📦 Organizing: ${appName}`, 'cyan', true);
    this.log('─'.repeat(50), 'gray');

    // Ensure docs structure exists
    this.ensureDocsStructure(appDir);

    // Find all markdown files in app root
    const markdownFiles = this.findMarkdownFiles(appDir);

    if (markdownFiles.length === 0) {
      this.log('✨ No loose .md files found - already organized!', 'green');
      return;
    }

    let organized = 0;

    for (const filePath of markdownFiles) {
      const filename = path.basename(filePath);

      // Skip root-level files
      if (this.shouldStayAtRoot(filename)) {
        this.log(`📌 Keeping at root: ${filename}`, 'blue');
        continue;
      }

      // Categorize and move
      const category = this.categorizeFile(filename);

      if (category) {
        this.moveFile(filePath, category, appDir);
        organized++;
      } else {
        // Uncategorized - move to reference by default
        this.log(`❓ Uncategorized: ${filename} → moving to reference/`, 'yellow');
        this.moveFile(filePath, 'reference', appDir);
        organized++;
      }
    }

    this.log(`\n✅ Organized ${organized} file(s) in ${appName}`, 'green', true);
  }

  /**
   * Log with colors
   */
  log(message, color = 'reset', bold = false) {
    const colors = {
      reset: '\x1b[0m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      cyan: '\x1b[36m',
      gray: '\x1b[90m',
    };

    const style = bold ? '\x1b[1m' : '';
    console.log(`${style}${colors[color] || colors.reset}${message}${colors.reset}`);
  }

  /**
   * Print summary
   */
  printSummary() {
    this.log('\n' + '═'.repeat(50), 'cyan', true);
    this.log('📊 SUMMARY', 'cyan', true);
    this.log('═'.repeat(50), 'cyan', true);

    if (this.dryRun) {
      this.log('\n🔍 DRY RUN MODE - No files were actually moved', 'yellow', true);
    }

    this.log(`\n📁 Created: ${this.created.length} directories/files`);
    this.log(`✅ Moved: ${this.moved.length} files`);
    this.log(`⏭️  Skipped: ${this.skipped.length} files`);

    if (this.moved.length > 0 && this.verbose) {
      this.log('\n📋 Moved files:', 'cyan');
      for (const { from, category } of this.moved) {
        const filename = path.basename(from);
        this.log(`  • ${filename} → docs/${category}/`, 'gray');
      }
    }

    if (this.dryRun && this.moved.length > 0) {
      this.log('\n💡 Run without --dry-run to apply these changes', 'blue');
    }

    this.log('');
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose') || args.includes('-v');
  const targetApp = args.find(arg => !arg.startsWith('--'));

  const organizer = new DocOrganizer({ dryRun, verbose });

  organizer.log('\n🗂️  TAP Documentation Organiser', 'cyan', true);
  organizer.log('═'.repeat(50), 'cyan', true);

  if (dryRun) {
    organizer.log('🔍 DRY RUN MODE - Previewing changes only\n', 'yellow', true);
  }

  const appsDir = path.join(__dirname, '..', 'apps');

  if (targetApp) {
    // Organize specific app
    const appDir = path.join(appsDir, targetApp);
    organizer.organizeApp(appDir);
  } else {
    // Organize all apps
    const apps = fs
      .readdirSync(appsDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .filter(entry => !SKIP_DIRS.includes(entry.name))
      .map(entry => entry.name);

    for (const app of apps) {
      const appDir = path.join(appsDir, app);
      organizer.organizeApp(appDir);
    }
  }

  organizer.printSummary();
}

if (require.main === module) {
  main();
}

module.exports = { DocOrganizer };
