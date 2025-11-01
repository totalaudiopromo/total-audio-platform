#!/usr/bin/env node

/**
 * Agent OS - Visual Command Centre Dashboard
 * Production-ready agent system with colour-coded categories
 * Integrated TDD workflow + Business agents + Technical infrastructure
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI colour codes
const colours = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // Foreground
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Background
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
};

class AgentOSDashboard {
  constructor() {
    this.agentsDir = __dirname;
    this.version = '2.0.0';

    // Agent categories with visual organisation
    this.agentCategories = {
      tdd_workflow: {
        name: '🧪 TDD WORKFLOW (Development System)',
        colour: colours.cyan,
        agents: [
          {
            id: 'tdd-plan',
            name: 'TDD Plan Feature',
            command: 'node unified-launcher.js tdd-plan',
            description: 'Plan feature with mobile-first TDD methodology',
            status: 'production',
            examples: ['tdd-plan "contact filtering" audiointel'],
          },
          {
            id: 'tdd-build',
            name: 'TDD Build Feature',
            command: 'node unified-launcher.js tdd-build',
            description: 'Build feature using TDD specs',
            status: 'production',
            examples: ['tdd-build "contact filtering"'],
          },
          {
            id: 'tdd-status',
            name: 'TDD Status',
            command: 'node unified-launcher.js tdd-status',
            description: 'Show all TDD feature development status',
            status: 'production',
            examples: ['tdd-status'],
          },
        ],
      },

      customer_acquisition: {
        name: '🎯 CUSTOMER ACQUISITION (Audio Intel Focus)',
        colour: colours.green,
        agents: [
          {
            id: 'newsletter',
            name: 'Newsletter Automation',
            command: 'node core-agents/content/newsletter-automation-agent.js',
            description: '"The Unsigned Advantage" content generation',
            status: 'production',
            examples: ['newsletter generate', 'newsletter schedule'],
          },
          {
            id: 'social-media',
            name: 'Social Media Agent',
            command: 'node core-agents/content/social-media-agent.js',
            description: 'Cross-platform social content automation',
            status: 'production',
            examples: ['social-media twitter', 'social-media linkedin'],
          },
          {
            id: 'newsjacking',
            name: 'Newsjacking Agent',
            command: 'node core-agents/content/newsjacking-agent.js',
            description: 'AI-powered music industry news analysis',
            status: 'production',
            examples: ['newsjacking scan', 'newsjacking generate'],
          },
          {
            id: 'chris-marketing',
            name: 'SaaS Marketing Agent',
            command: 'node core-agents/business/chris-saas-marketing-agent.js',
            description: 'Audio Intel marketing strategy & execution',
            status: 'production',
            examples: ['chris-marketing campaign', 'chris-marketing analytics'],
          },
        ],
      },

      business_intelligence: {
        name: '📊 BUSINESS INTELLIGENCE',
        colour: colours.blue,
        agents: [
          {
            id: 'analytics',
            name: 'Analytics Agent',
            command: 'node core-agents/business/analytics-agent.js',
            description: 'Customer acquisition metrics & performance',
            status: 'production',
            examples: ['analytics dashboard', 'analytics conversion-rates'],
          },
          {
            id: 'agency',
            name: 'Agency Agent',
            command: 'node core-agents/business/agency-agent.js',
            description: 'Agency partnership management',
            status: 'partial',
            examples: ['agency health', 'agency manage'],
          },
        ],
      },

      technical_infrastructure: {
        name: '⚙️  TECHNICAL INFRASTRUCTURE',
        colour: colours.white,
        agents: [
          {
            id: 'contact',
            name: 'Contact Agent',
            command: 'node core-agents/technical/contact-agent.js',
            description: 'Contact database management',
            status: 'production',
            examples: ['contact create', 'contact enrich'],
          },
          {
            id: 'database',
            name: 'Database Agent',
            command: 'node core-agents/technical/database-agent.js',
            description: 'Database operations & migrations',
            status: 'production',
            examples: ['database migrate', 'database backup'],
          },
          {
            id: 'agent-manager',
            name: 'Agent Manager',
            command: 'node core-agents/technical/agent-manager.js',
            description: 'Agent coordination & health checks',
            status: 'production',
            examples: ['agent-manager health', 'agent-manager status'],
          },
        ],
      },

      radio_promotion: {
        name: '📻 RADIO PROMOTION (Personal Use)',
        colour: colours.magenta,
        agents: [
          {
            id: 'radio-promo',
            name: 'Radio Promo Agent',
            command: 'node core-agents/radio-promo/radio-promo-agent.js',
            description: 'Radio campaign management for Liberty Music PR',
            status: 'production',
            examples: ['radio-promo campaign', 'radio-promo track-submissions'],
          },
        ],
      },

      system_utilities: {
        name: '🔧 SYSTEM UTILITIES',
        colour: colours.yellow,
        agents: [
          {
            id: 'gmail-setup',
            name: 'Gmail Setup',
            command: 'node gmail-setup/gmail-liberty-setup.js',
            description: 'Gmail automation setup & configuration',
            status: 'production',
            examples: ['gmail-setup configure', 'gmail-setup test'],
          },
        ],
      },
    };
  }

  /**
   * Display main dashboard
   */
  showDashboard() {
    console.clear();

    // Header
    console.log(
      `${colours.bright}${colours.cyan}╔════════════════════════════════════════════════════════════════╗${colours.reset}`
    );
    console.log(
      `${colours.bright}${colours.cyan}║                    AGENT OS COMMAND CENTRE                     ║${colours.reset}`
    );
    console.log(
      `${colours.bright}${colours.cyan}║                      Version ${this.version}                           ║${colours.reset}`
    );
    console.log(
      `${colours.bright}${colours.cyan}╚════════════════════════════════════════════════════════════════╝${colours.reset}`
    );
    console.log('');

    // Show each category
    for (const [categoryId, category] of Object.entries(this.agentCategories)) {
      this.showCategory(category);
      console.log('');
    }

    // Footer with quick commands
    this.showQuickCommands();
  }

  /**
   * Show a category of agents
   */
  showCategory(category) {
    console.log(`${colours.bright}${category.colour}${category.name}${colours.reset}`);
    console.log(`${category.colour}${'─'.repeat(60)}${colours.reset}`);

    category.agents.forEach((agent, index) => {
      const statusIcon = this.getStatusIcon(agent.status);
      const number = `${index + 1}`.padStart(2);

      console.log(`  ${number}. ${statusIcon} ${colours.bright}${agent.name}${colours.reset}`);
      console.log(`     ${colours.dim}${agent.description}${colours.reset}`);

      if (agent.examples && agent.examples.length > 0) {
        console.log(
          `     ${colours.dim}Example: node unified-launcher.js ${agent.examples[0]}${colours.reset}`
        );
      }
    });
  }

  /**
   * Get status icon for agent
   */
  getStatusIcon(status) {
    switch (status) {
      case 'production':
        return `${colours.green}✓${colours.reset}`;
      case 'partial':
        return `${colours.yellow}⚠${colours.reset}`;
      case 'development':
        return `${colours.cyan}◐${colours.reset}`;
      case 'archived':
        return `${colours.dim}○${colours.reset}`;
      default:
        return '•';
    }
  }

  /**
   * Show quick command reference
   */
  showQuickCommands() {
    console.log(`${colours.bright}${colours.cyan}QUICK COMMANDS${colours.reset}`);
    console.log(`${colours.cyan}${'─'.repeat(60)}${colours.reset}`);
    console.log('');
    console.log(
      `  ${colours.green}Development:${colours.reset}  node unified-launcher.js tdd-plan "feature" audiointel`
    );
    console.log(
      `  ${colours.green}Status:${colours.reset}       node unified-launcher.js tdd-status`
    );
    console.log(
      `  ${colours.green}Marketing:${colours.reset}    node unified-launcher.js newsletter generate`
    );
    console.log(`  ${colours.green}Social:${colours.reset}       node unified-launcher.js social`);
    console.log('');
    console.log(
      `  ${colours.yellow}For detailed help:${colours.reset} node unified-launcher.js [agent-id]`
    );
    console.log('');
  }

  /**
   * Show agent details
   */
  showAgentDetails(agentId) {
    for (const category of Object.values(this.agentCategories)) {
      const agent = category.agents.find(a => a.id === agentId);
      if (agent) {
        console.log('');
        console.log(`${colours.bright}${category.colour}${agent.name}${colours.reset}`);
        console.log(`${category.colour}${'─'.repeat(60)}${colours.reset}`);
        console.log('');
        console.log(`${colours.bright}Description:${colours.reset} ${agent.description}`);
        console.log(
          `${colours.bright}Status:${colours.reset} ${this.getStatusIcon(agent.status)} ${agent.status}`
        );
        console.log(`${colours.bright}Command:${colours.reset} ${agent.command}`);
        console.log('');

        if (agent.examples) {
          console.log(`${colours.bright}Examples:${colours.reset}`);
          agent.examples.forEach(ex => {
            console.log(`  node unified-launcher.js ${ex}`);
          });
        }

        console.log('');
        return;
      }
    }

    console.error(`${colours.red}Agent not found: ${agentId}${colours.reset}`);
  }

  /**
   * Get TDD system health
   */
  getTDDHealth() {
    try {
      const statusPath = path.join(this.agentsDir, 'active', 'specs', 'status.json');
      if (fs.existsSync(statusPath)) {
        const status = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
        return {
          healthy: true,
          features: status.totalFeatures || 0,
          planned: status.plannedFeatures || 0,
          built: status.builtFeatures || 0,
        };
      }
    } catch (error) {
      return { healthy: false, error: error.message };
    }

    return { healthy: false, error: 'TDD system not initialised' };
  }

  /**
   * Show system health
   */
  showHealth() {
    console.log('');
    console.log(`${colours.bright}${colours.cyan}AGENT OS HEALTH CHECK${colours.reset}`);
    console.log(`${colours.cyan}${'─'.repeat(60)}${colours.reset}`);
    console.log('');

    // TDD System
    const tddHealth = this.getTDDHealth();
    const tddIcon = tddHealth.healthy
      ? `${colours.green}✓${colours.reset}`
      : `${colours.red}✗${colours.reset}`;
    console.log(`${tddIcon} TDD System: ${tddHealth.healthy ? 'Operational' : 'Not Initialised'}`);
    if (tddHealth.healthy) {
      console.log(
        `  Features: ${tddHealth.features} | Planned: ${tddHealth.planned} | Built: ${tddHealth.built}`
      );
    }

    // Agent Categories
    console.log('');
    let totalAgents = 0;
    let productionAgents = 0;

    for (const category of Object.values(this.agentCategories)) {
      totalAgents += category.agents.length;
      productionAgents += category.agents.filter(a => a.status === 'production').length;
    }

    console.log(`${colours.green}✓${colours.reset} Total Agents: ${totalAgents}`);
    console.log(`${colours.green}✓${colours.reset} Production Ready: ${productionAgents}`);
    console.log(
      `${colours.yellow}⚠${colours.reset} Partial/Development: ${totalAgents - productionAgents}`
    );
    console.log('');
  }

  /**
   * Run an agent
   */
  runAgent(agentId, args = []) {
    for (const category of Object.values(this.agentCategories)) {
      const agent = category.agents.find(a => a.id === agentId);
      if (agent) {
        const command = `${agent.command} ${args.join(' ')}`;
        console.log(`${colours.cyan}Running: ${command}${colours.reset}`);
        console.log('');

        try {
          execSync(command, { stdio: 'inherit', cwd: this.agentsDir });
        } catch (error) {
          console.error(`${colours.red}Agent execution failed${colours.reset}`);
          process.exit(1);
        }

        return;
      }
    }

    console.error(`${colours.red}Agent not found: ${agentId}${colours.reset}`);
    console.log('');
    console.log('Available agents:');
    this.listAgents();
  }

  /**
   * List all agents
   */
  listAgents() {
    for (const [categoryId, category] of Object.entries(this.agentCategories)) {
      console.log(`${colours.dim}${category.name}${colours.reset}`);
      category.agents.forEach(agent => {
        console.log(`  ${agent.id.padEnd(20)} ${agent.name}`);
      });
      console.log('');
    }
  }
}

// CLI Interface
if (require.main === module) {
  const dashboard = new AgentOSDashboard();
  const [, , command, ...args] = process.argv;

  if (!command) {
    dashboard.showDashboard();
    process.exit(0);
  }

  switch (command) {
    case 'health':
      dashboard.showHealth();
      break;
    case 'list':
      dashboard.listAgents();
      break;
    case 'run':
      if (args.length === 0) {
        console.error('Usage: node agent-os-dashboard.js run <agent-id> [args...]');
        process.exit(1);
      }
      dashboard.runAgent(args[0], args.slice(1));
      break;
    case 'help':
      if (args.length > 0) {
        dashboard.showAgentDetails(args[0]);
      } else {
        dashboard.showDashboard();
      }
      break;
    default:
      dashboard.showAgentDetails(command);
      break;
  }
}

module.exports = AgentOSDashboard;
