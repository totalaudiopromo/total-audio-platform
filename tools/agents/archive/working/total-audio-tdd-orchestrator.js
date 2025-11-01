#!/usr/bin/env node

/**
 * Total Audio TDD Orchestrator
 *
 * Specialized orchestrator that coordinates TDD workflows for the Total Audio platform.
 * Integrates the existing TDD planning system with the agent ecosystem to provide
 * structured, test-driven development workflows for all Total Audio applications.
 *
 * Features:
 * - Coordinates TDD planning agents (UI, Component, Test, Implementation)
 * - Manages spec generation and validation
 * - Orchestrates development workflows with existing agents
 * - Tracks feature development from planning through implementation
 * - Supports both Audio Intel and Playlist Pulse product lines
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Simple logger fallback
const logger = {
  info: (msg, ...args) => console.log(`[TDD-ORCHESTRATOR] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[TDD-ORCHESTRATOR-ERROR] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[TDD-ORCHESTRATOR-WARN] ${msg}`, ...args),
  success: (msg, ...args) => console.log(`[TDD-ORCHESTRATOR-SUCCESS] ✅ ${msg}`, ...args),
};

class TotalAudioTDDOrchestrator {
  constructor() {
    this.name = 'TotalAudioTDDOrchestrator';
    this.version = '1.0.0';
    this.agentsDir = __dirname;
    this.specsDir = path.join(__dirname, 'specs');
    this.statusFile = path.join(this.specsDir, 'status.json');

    // TDD Planning Agents
    this.tddAgents = {
      uiPlanner: path.join(__dirname, 'tdd-ui-planner.js'),
      componentSelector: path.join(__dirname, 'tdd-component-selector.js'),
      testWriter: path.join(__dirname, 'tdd-test-writer.js'),
      implementationPlanner: path.join(__dirname, 'tdd-implementation-planner.js'),
    };

    // Integration points with existing system
    this.orchestratorScript = path.join(__dirname, 'orchestrator.sh');
    this.tddHelper = path.join(__dirname, 'tdd-helper.sh');

    this.isInitialized = false;
  }

  /**
   * Initialize the TDD Orchestrator
   */
  async initialize() {
    try {
      logger.info('Initializing Total Audio TDD Orchestrator...');

      await this.ensureDirectoryStructure();
      await this.validateTDDAgents();
      await this.loadOrCreateStatus();

      this.isInitialized = true;
      logger.success('TDD Orchestrator initialized successfully');

      return {
        status: 'initialized',
        version: this.version,
        specsDirectory: this.specsDir,
        availableAgents: Object.keys(this.tddAgents),
      };
    } catch (error) {
      logger.error('TDD Orchestrator initialization failed:', error);
      throw error;
    }
  }

  /**
   * Ensure required directory structure exists
   */
  async ensureDirectoryStructure() {
    const dirs = [
      this.specsDir,
      path.join(this.specsDir, 'ui-wireframes'),
      path.join(this.specsDir, 'components'),
      path.join(this.specsDir, 'tests'),
      path.join(this.specsDir, 'checklists'),
    ];

    for (const dir of dirs) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
        logger.info(`Created directory: ${dir}`);
      }
    }
  }

  /**
   * Validate that all TDD agents exist
   */
  async validateTDDAgents() {
    const missing = [];

    for (const [name, agentPath] of Object.entries(this.tddAgents)) {
      try {
        await fs.access(agentPath);
      } catch {
        missing.push(name);
      }
    }

    if (missing.length > 0) {
      logger.warn(`Missing TDD agents: ${missing.join(', ')}`);
      // Continue anyway - they might be created later
    }
  }

  /**
   * Load or create status tracking file
   */
  async loadOrCreateStatus() {
    try {
      const statusData = await fs.readFile(this.statusFile, 'utf8');
      this.status = JSON.parse(statusData);
    } catch {
      this.status = {
        features: {},
        lastUpdated: new Date().toISOString(),
        totalFeatures: 0,
        plannedFeatures: 0,
        builtFeatures: 0,
      };
      await this.saveStatus();
    }
  }

  /**
   * Save status to file
   */
  async saveStatus() {
    this.status.lastUpdated = new Date().toISOString();
    await fs.writeFile(this.statusFile, JSON.stringify(this.status, null, 2));
  }

  /**
   * Plan a feature using TDD methodology
   */
  async planFeature(featureName, productLine = 'audiointel', options = {}) {
    if (!this.isInitialized) await this.initialize();

    try {
      logger.info(`Starting TDD planning for feature: ${featureName} (${productLine})`);

      const feature = {
        name: featureName,
        productLine,
        status: 'planning',
        createdAt: new Date().toISOString(),
        specs: {},
      };

      // Step 1: UI Planning
      logger.info('Step 1/4: Creating UI wireframes...');
      if (!options.skipUI) {
        const uiSpecs = await this.runTDDAgent('uiPlanner', featureName, productLine);
        feature.specs.ui = uiSpecs;
      }

      // Step 2: Component Selection
      logger.info('Step 2/4: Selecting components...');
      if (!options.skipComponents) {
        const componentSpecs = await this.runTDDAgent(
          'componentSelector',
          featureName,
          productLine
        );
        feature.specs.components = componentSpecs;
      }

      // Step 3: Test Writing
      logger.info('Step 3/4: Writing test scenarios...');
      if (!options.skipTests) {
        const testSpecs = await this.runTDDAgent('testWriter', featureName, productLine);
        feature.specs.tests = testSpecs;
      }

      // Step 4: Implementation Planning
      logger.info('Step 4/4: Creating implementation plan...');
      if (!options.skipImplementation) {
        const implSpecs = await this.runTDDAgent('implementationPlanner', featureName, productLine);
        feature.specs.implementation = implSpecs;
      }

      feature.status = 'planned';
      feature.plannedAt = new Date().toISOString();

      // Update status tracking
      this.status.features[featureName] = feature;
      this.status.totalFeatures = Object.keys(this.status.features).length;
      this.status.plannedFeatures = Object.values(this.status.features).filter(
        f => f.status === 'planned' || f.status === 'built'
      ).length;

      await this.saveStatus();

      logger.success(`Feature "${featureName}" planned successfully`);
      return feature;
    } catch (error) {
      logger.error(`Planning failed for feature "${featureName}":`, error);
      throw error;
    }
  }

  /**
   * Build a feature using existing agents with TDD specs
   */
  async buildFeature(featureName, options = {}) {
    if (!this.isInitialized) await this.initialize();

    try {
      const feature = this.status.features[featureName];
      if (!feature) {
        throw new Error(`Feature "${featureName}" not found. Run planning first.`);
      }

      if (feature.status !== 'planned') {
        logger.warn(
          `Feature "${featureName}" is not in planned status (current: ${feature.status})`
        );
      }

      logger.info(`Building feature: ${featureName}`);
      feature.status = 'building';
      feature.buildStartedAt = new Date().toISOString();
      await this.saveStatus();

      // Create workflow name for orchestrator
      const workflowName = `${featureName.toLowerCase().replace(/\s+/g, '-')}-with-tdd-specs`;

      // Build the feature using existing orchestrator with TDD specs
      logger.info(`Executing workflow: ${workflowName}`);

      try {
        // Use the existing orchestrator script to execute the workflow
        const command = `cd ${this.agentsDir} && bash orchestrator.sh execute ${workflowName}`;
        const result = execSync(command, { encoding: 'utf8', cwd: this.agentsDir });

        logger.info('Orchestrator output:', result);

        feature.status = 'built';
        feature.builtAt = new Date().toISOString();
        feature.buildResult = 'success';

        this.status.builtFeatures = Object.values(this.status.features).filter(
          f => f.status === 'built'
        ).length;
      } catch (buildError) {
        logger.error('Build execution failed:', buildError);
        feature.status = 'build-failed';
        feature.buildError = buildError.message;
        throw buildError;
      }

      await this.saveStatus();
      logger.success(`Feature "${featureName}" built successfully`);
      return feature;
    } catch (error) {
      logger.error(`Build failed for feature "${featureName}":`, error);
      throw error;
    }
  }

  /**
   * Run a specific TDD agent
   */
  async runTDDAgent(agentName, featureName, productLine) {
    const agentPath = this.tddAgents[agentName];
    if (!agentPath) {
      throw new Error(`TDD agent "${agentName}" not found`);
    }

    try {
      const command = `node ${agentPath} "${featureName}" "${productLine}"`;
      const result = execSync(command, { encoding: 'utf8', cwd: this.agentsDir });
      return JSON.parse(result);
    } catch (error) {
      logger.error(`TDD agent ${agentName} failed:`, error);
      // Return minimal spec if agent fails
      return {
        agent: agentName,
        feature: featureName,
        productLine,
        status: 'agent-failed',
        error: error.message,
      };
    }
  }

  /**
   * Get current status of all features
   */
  async getStatus() {
    if (!this.isInitialized) await this.initialize();

    const features = Object.values(this.status.features);
    const planned = features.filter(f => f.status === 'planned');
    const building = features.filter(f => f.status === 'building');
    const built = features.filter(f => f.status === 'built');
    const failed = features.filter(f => f.status.includes('failed'));

    return {
      summary: {
        total: this.status.totalFeatures,
        planned: planned.length,
        building: building.length,
        built: built.length,
        failed: failed.length,
      },
      readyToBuild: planned.map(f => ({
        name: f.name,
        productLine: f.productLine,
        plannedAt: f.plannedAt,
      })),
      inProgress: building.map(f => ({
        name: f.name,
        productLine: f.productLine,
        buildStartedAt: f.buildStartedAt,
      })),
      completed: built.map(f => ({
        name: f.name,
        productLine: f.productLine,
        builtAt: f.builtAt,
      })),
    };
  }

  /**
   * Quick build - bypass TDD planning
   */
  async quickBuild(featureName, productLine = 'audiointel') {
    if (!this.isInitialized) await this.initialize();

    logger.info(`Quick build (bypassing TDD) for: ${featureName}`);

    // Create minimal feature tracking
    const feature = {
      name: featureName,
      productLine,
      status: 'quick-building',
      createdAt: new Date().toISOString(),
      quickBuild: true,
    };

    this.status.features[featureName] = feature;
    await this.saveStatus();

    try {
      // Use orchestrator directly
      const workflowName = featureName.toLowerCase().replace(/\s+/g, '-');
      const command = `cd ${this.agentsDir} && bash orchestrator.sh execute ${workflowName}`;
      const result = execSync(command, { encoding: 'utf8', cwd: this.agentsDir });

      feature.status = 'quick-built';
      feature.builtAt = new Date().toISOString();
      feature.buildResult = 'success';

      await this.saveStatus();
      logger.success(`Quick build completed for "${featureName}"`);
      return feature;
    } catch (error) {
      feature.status = 'quick-build-failed';
      feature.buildError = error.message;
      await this.saveStatus();
      throw error;
    }
  }

  /**
   * List all available workflows and features
   */
  async listFeatures() {
    if (!this.isInitialized) await this.initialize();

    const features = Object.values(this.status.features);

    console.log('\n🎵 TOTAL AUDIO TDD ORCHESTRATOR - FEATURES');
    console.log('==========================================');

    if (features.length === 0) {
      console.log('No features planned yet. Use planFeature() to get started.');
      return;
    }

    const byStatus = features.reduce((acc, feature) => {
      if (!acc[feature.status]) acc[feature.status] = [];
      acc[feature.status].push(feature);
      return acc;
    }, {});

    for (const [status, featureList] of Object.entries(byStatus)) {
      console.log(`\n${status.toUpperCase()}:`);
      featureList.forEach(f => {
        console.log(`  📋 ${f.name} (${f.productLine})`);
        if (f.plannedAt) console.log(`     Planned: ${new Date(f.plannedAt).toLocaleDateString()}`);
        if (f.builtAt) console.log(`     Built: ${new Date(f.builtAt).toLocaleDateString()}`);
      });
    }
  }
}

// CLI Interface
if (require.main === module) {
  const orchestrator = new TotalAudioTDDOrchestrator();
  const [, , command, ...args] = process.argv;

  async function runCLI() {
    try {
      switch (command) {
        case 'init':
          const result = await orchestrator.initialize();
          console.log('Initialization result:', result);
          break;

        case 'plan':
          const [featureName, productLine] = args;
          if (!featureName) {
            console.error(
              'Usage: node total-audio-tdd-orchestrator.js plan "feature name" [audiointel|playlistpulse]'
            );
            process.exit(1);
          }
          await orchestrator.planFeature(featureName, productLine || 'audiointel');
          break;

        case 'build':
          const [buildFeatureName] = args;
          if (!buildFeatureName) {
            console.error('Usage: node total-audio-tdd-orchestrator.js build "feature name"');
            process.exit(1);
          }
          await orchestrator.buildFeature(buildFeatureName);
          break;

        case 'quick':
          const [quickFeatureName, quickProductLine] = args;
          if (!quickFeatureName) {
            console.error(
              'Usage: node total-audio-tdd-orchestrator.js quick "feature name" [audiointel|playlistpulse]'
            );
            process.exit(1);
          }
          await orchestrator.quickBuild(quickFeatureName, quickProductLine || 'audiointel');
          break;

        case 'status':
          const status = await orchestrator.getStatus();
          console.log('\n📊 TDD ORCHESTRATOR STATUS');
          console.log('=========================');
          console.log(`Total Features: ${status.summary.total}`);
          console.log(`Ready to Build: ${status.summary.planned}`);
          console.log(`In Progress: ${status.summary.building}`);
          console.log(`Completed: ${status.summary.built}`);
          console.log(`Failed: ${status.summary.failed}`);

          if (status.readyToBuild.length > 0) {
            console.log('\n✅ Ready to Build:');
            status.readyToBuild.forEach(f => console.log(`  • ${f.name} (${f.productLine})`));
          }
          break;

        case 'list':
          await orchestrator.listFeatures();
          break;

        default:
          console.log('\n🎵 Total Audio TDD Orchestrator');
          console.log('===============================');
          console.log('Usage: node total-audio-tdd-orchestrator.js <command> [options]');
          console.log('');
          console.log('Commands:');
          console.log('  init                           Initialize TDD orchestrator');
          console.log('  plan "feature" [product]       Plan feature with TDD methodology');
          console.log(
            '  build "feature"                Build planned feature with existing agents'
          );
          console.log('  quick "feature" [product]      Quick build bypassing TDD planning');
          console.log('  status                         Show current status of all features');
          console.log('  list                           List all features and their status');
          console.log('');
          console.log('Product lines: audiointel (default), playlistpulse');
          console.log('');
          console.log('Examples:');
          console.log('  node total-audio-tdd-orchestrator.js plan "contact filtering" audiointel');
          console.log('  node total-audio-tdd-orchestrator.js build "contact filtering"');
          console.log('  node total-audio-tdd-orchestrator.js quick "bug fix" audiointel');
      }
    } catch (error) {
      logger.error('CLI execution failed:', error);
      process.exit(1);
    }
  }

  runCLI();
}

module.exports = TotalAudioTDDOrchestrator;
