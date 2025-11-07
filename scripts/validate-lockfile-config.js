#!/usr/bin/env node

/**
 * Validates that pnpm-lock.yaml settings match .npmrc configuration
 * Prevents ERR_PNPM_LOCKFILE_CONFIG_MISMATCH errors in CI/CD
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const NPMRC_PATH = path.join(ROOT_DIR, '.npmrc');
const LOCKFILE_PATH = path.join(ROOT_DIR, 'pnpm-lock.yaml');

function readNpmrc() {
  if (!fs.existsSync(NPMRC_PATH)) {
    return {};
  }

  const content = fs.readFileSync(NPMRC_PATH, 'utf-8');
  const config = {};

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      config[key] = value === 'true' ? true : value === 'false' ? false : value;
    }
  }

  return config;
}

function readLockfileSettings() {
  if (!fs.existsSync(LOCKFILE_PATH)) {
    return null;
  }

  const content = fs.readFileSync(LOCKFILE_PATH, 'utf-8');
  const settingsMatch = content.match(/^settings:\s*\n((?:  .+:\s*.+\n?)+)/m);

  if (!settingsMatch) {
    return null;
  }

  const settings = {};
  const settingsBlock = settingsMatch[1];

  for (const line of settingsBlock.split('\n')) {
    const match = line.match(/^\s+(\w+):\s*(.+)$/);
    if (match) {
      const key = match[1];
      const value = match[2].trim();
      settings[key] = value === 'true' ? true : value === 'false' ? false : value;
    }
  }

  return settings;
}

function main() {
  console.log('🔍 Validating pnpm lockfile configuration...\n');

  const npmrc = readNpmrc();
  const lockfileSettings = readLockfileSettings();

  if (!lockfileSettings) {
    console.error('❌ Could not read settings from pnpm-lock.yaml');
    process.exit(1);
  }

  // Check auto-install-peers setting
  const npmrcAutoInstall = npmrc['auto-install-peers'];
  const lockfileAutoInstall = lockfileSettings.autoInstallPeers;

  if (npmrcAutoInstall !== undefined) {
    if (npmrcAutoInstall !== lockfileAutoInstall) {
      console.error('❌ Lockfile configuration mismatch detected!\n');
      console.error(`   .npmrc: auto-install-peers=${npmrcAutoInstall}`);
      console.error(`   pnpm-lock.yaml: autoInstallPeers=${lockfileAutoInstall}\n`);
      console.error('💡 Fix: Run "pnpm install" to regenerate the lockfile with current settings');
      process.exit(1);
    }
  }

  console.log('✅ Lockfile configuration matches .npmrc settings');
  console.log(`   auto-install-peers: ${lockfileAutoInstall}`);
  process.exit(0);
}

main();
