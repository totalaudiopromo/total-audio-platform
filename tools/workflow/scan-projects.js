#!/usr/bin/env node
/*
  Scans a root directory for development projects and outputs a catalog JSON and Markdown summary.
  - Identifies projects by presence of a .git directory or package.json
  - Excludes common system/cache/media folders
  - Captures key signals: name, path, git info, package manager, frameworks, scripts, prisma/docker/ci hints
*/
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

function sh(cmd) {
  return cp.execSync(cmd, { encoding: 'utf8' });
}

function exists(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

function readJSON(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

function detectFrameworks(pkg) {
  const out = [];
  if (!pkg) return out;
  const deps = { ...(pkg.dependencies||{}), ...(pkg.devDependencies||{}) };
  const has = (k) => !!deps[k];
  if (has('next')) out.push('Next.js');
  if (has('react') || has('react-dom')) out.push('React');
  if (has('express')) out.push('Express');
  if (has('@nestjs/core')) out.push('NestJS');
  if (has('prisma') || has('@prisma/client')) out.push('Prisma');
  if (has('playwright')) out.push('Playwright');
  if (has('jest')) out.push('Jest');
  if (has('tailwindcss')) out.push('Tailwind');
  return Array.from(new Set(out));
}

function detectPkgManager(dir) {
  if (exists(path.join(dir, 'pnpm-lock.yaml'))) return 'pnpm';
  if (exists(path.join(dir, 'yarn.lock'))) return 'yarn';
  if (exists(path.join(dir, 'package-lock.json'))) return 'npm';
  return null;
}

function getGitInfo(dir) {
  if (!exists(path.join(dir, '.git'))) return null;
  const safe = (cmd) => {
    try { return sh(cmd + ' 2>/dev/null').trim(); } catch { return null; }
  };
  const branch = safe(`git -C "${dir}" rev-parse --abbrev-ref HEAD`);
  const dirty = safe(`git -C "${dir}" status --porcelain -uno | wc -l`);
  const recent = safe(`git -C "${dir}" log -1 --format=%ct`);
  const hasRemote = !!safe(`git -C "${dir}" remote`);
  return {
    branch: branch || null,
    dirtyCount: dirty ? Number(dirty) : null,
    lastCommitEpoch: recent ? Number(recent) : null,
    hasRemote
  };
}

function latestMtime(dir) {
  // Fall back: directory mtime if scanning is too heavy
  try { return fs.statSync(dir).mtimeMs; } catch { return null; }
}

function getScriptsSubset(pkg) {
  if (!pkg || !pkg.scripts) return null;
  const keys = ['dev','build','start','test','lint','typecheck'];
  const out = {};
  for (const k of keys) {
    if (pkg.scripts[k]) out[k] = pkg.scripts[k];
  }
  return Object.keys(out).length ? out : null;
}

function detectHints(dir, pkg) {
  const hints = [];
  if (exists(path.join(dir, 'prisma', 'schema.prisma'))) hints.push('prisma');
  if (exists(path.join(dir, 'Dockerfile'))) hints.push('docker');
  if (exists(path.join(dir, '.github', 'workflows'))) hints.push('ci');
  if (pkg && (pkg.workspaces || exists(path.join(dir, 'pnpm-workspace.yaml')))) hints.push('monorepo');
  return hints;
}

function safeBasename(p) {
  try { return path.basename(p); } catch { return p; }
}

function main() {
  const roots = process.argv.slice(2);
  const root = roots.length ? null : (process.env.HOME || null);
  if (!roots.length && !root) {
    console.error('No root directory provided.');
    process.exit(1);
  }

  const scanRoots = roots.length ? roots : [root];

  // Build candidate list via find to keep Node traversal light.
  const exclude = [
    'Library/*', 'Movies/*', 'Music/*', 'Pictures/*', 'Applications/*', '.Trash/*', '.cache/*', '.config/*',
    'Parallels/*', 'VirtualBox VMs/*', 'OneDrive/*', 'Dropbox/*'
  ];
  const genericExcludes = [
    '*/node_modules/*', '*/.git/*', '*/.next/*', '*/dist/*', '*/build/*', '*/session-snapshots/*'
  ];

  let dirs = new Set();
  for (const r of scanRoots) {
    const notPathsRoot = exclude.map(pat => `-not -path "${path.join(r, pat)}"`).join(' ');
    const notPathsGeneric = genericExcludes.map(p => `-not -path "${p}"`).join(' ');
    const baseFind = `find "${r}" ${notPathsRoot} ${notPathsGeneric}`;
    const gitCmd = `${baseFind} -type d -name .git -print | sed 's#/\\.git$##' | sort -u`;
    const gitFileCmd = `${baseFind} -type f -name .git -print | sed 's#/\\.git$##' | sort -u`;
    const pkgCmd = `${baseFind} -type f -name package.json -print | sed 's#/package.json$##' | sort -u`;
    try { sh(gitCmd).split('\n').filter(Boolean).forEach(d => dirs.add(d)); } catch {}
    try { sh(gitFileCmd).split('\n').filter(Boolean).forEach(d => dirs.add(d)); } catch {}
    try { sh(pkgCmd).split('\n').filter(Boolean).forEach(d => dirs.add(d)); } catch {}
  }

  const projects = [];
  for (const dir of dirs) {
    const pkg = exists(path.join(dir, 'package.json')) ? readJSON(path.join(dir, 'package.json')) : null;
    const item = {
      name: (pkg && pkg.name) || safeBasename(dir),
      path: dir,
      language: pkg ? (exists(path.join(dir, 'tsconfig.json')) ? 'TypeScript' : 'JavaScript') : null,
      pkgManager: pkg ? detectPkgManager(dir) : null,
      frameworks: pkg ? detectFrameworks(pkg) : [],
      scripts: getScriptsSubset(pkg),
      hints: detectHints(dir, pkg),
      git: getGitInfo(dir),
      lastModifiedMs: latestMtime(dir)
    };
    projects.push(item);
  }

  // Sort by recent activity (git last commit epoch or mtime)
  projects.sort((a, b) => {
    const at = (a.git && a.git.lastCommitEpoch) || (a.lastModifiedMs ? Math.floor(a.lastModifiedMs/1000) : 0);
    const bt = (b.git && b.git.lastCommitEpoch) || (b.lastModifiedMs ? Math.floor(b.lastModifiedMs/1000) : 0);
    return bt - at;
  });

  // Output locations inside current repo workspace
  const outDir = path.join(process.cwd(), 'session-snapshots');
  try { fs.mkdirSync(outDir, { recursive: true }); } catch {}
  const jsonPath = path.join(outDir, 'project-catalog.json');
  const mdPath = path.join(outDir, 'project-catalog.md');

  fs.writeFileSync(jsonPath, JSON.stringify({ root, generatedAt: new Date().toISOString(), count: projects.length, projects }, null, 2));

  // Markdown summary
  const lines = [];
  lines.push(`# Project Catalog`);
  lines.push(`Root: ${root}`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Total projects: ${projects.length}`);
  lines.push('');
  const max = Math.min(projects.length, 100);
  for (let i = 0; i < max; i++) {
    const p = projects[i];
    const tag = [p.language, ...(p.frameworks||[]), ...(p.hints||[])].filter(Boolean).join(', ');
    const dirty = p.git && typeof p.git.dirtyCount === 'number' ? `, dirty:${p.git.dirtyCount}` : '';
    const branch = p.git && p.git.branch ? ` [${p.git.branch}]` : '';
    lines.push(`- ${p.name}${branch}: ${p.path}`);
    lines.push(`  - tech: ${tag || 'n/a'} | pm: ${p.pkgManager || 'n/a'}${dirty}`);
    if (p.scripts) lines.push(`  - scripts: ${Object.keys(p.scripts).join(', ')}`);
  }
  if (projects.length > max) {
    lines.push('');
    lines.push(`... truncated to first ${max} for brevity`);
  }
  fs.writeFileSync(mdPath, lines.join('\n'));

  console.log(`Catalog written:\n- ${jsonPath}\n- ${mdPath}`);
}

main();
