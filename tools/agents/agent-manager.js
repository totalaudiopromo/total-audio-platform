#!/usr/bin/env node

/**
 * Advanced Agent Manager
 * Full orchestration system for 23+ specialized agents
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgBlue: '\x1b[44m',
  bgGreen: '\x1b[42m'
};

class AgentManager {
  constructor() {
    this.agentsDir = __dirname;
    this.availableAgents = this.discoverAgents();
    this.runningAgents = new Map();
  }

  /**
   * Discover all available agents
   */
  discoverAgents() {
    const agentFiles = fs.readdirSync(this.agentsDir)
      .filter(file => file.endsWith('-agent.js') || file.endsWith('orchestrator.js'))
      .filter(file => !file.includes('agent-manager'));

    const agents = {
      // Core Infrastructure
      orchestrators: [
        { name: 'orchestrator-real', file: 'orchestrator-real.js', description: 'Real service orchestrator' },
        { name: 'orchestrator', file: 'orchestrator.js', description: 'Standard orchestrator' }
      ],
      
      // Database dependent agents
      core: [
        { name: 'database', file: 'database-agent.js', description: 'Database operations' },
        { name: 'campaign', file: 'campaign-agent.js', description: 'Campaign management' },
        { name: 'contact', file: 'contact-agent.js', description: 'Contact enrichment' },
        { name: 'analytics', file: 'analytics-agent.js', description: 'Performance analytics' },
        { name: 'agency', file: 'agency-agent.js', description: 'Agency operations' }
      ],

      // Integration agents  
      integrations: [
        { name: 'integration', file: 'integration-agent.js', description: 'Third-party integrations' },
        { name: 'integration-real', file: 'integration-agent-real.js', description: 'Real service integrations' }
      ],

      // Content & marketing
      content: [
        { name: 'content-generation', file: 'content-generation-agent.js', description: 'Content creation' },
        { name: 'social-media', file: 'social-media-agent.js', description: 'Social media automation' },
        { name: 'radio-promo', file: 'radio-promo-agent.js', description: 'Radio promotion' },
        { name: 'viral-content', file: 'viral-content-automation.js', description: 'Viral content strategies' }
      ],

      // Music industry specialists
      musicIndustry: [
        { name: 'music-tech', file: 'music-tech-agent.js', description: 'Music technology development' },
        { name: 'music-strategist', file: 'music-industry-strategist.js', description: 'Industry strategy' },
        { name: 'music-marketing', file: 'music-marketing-mastermind.js', description: 'Marketing mastery' },
        { name: 'growth-optimizer', file: 'growth-hacking-optimizer.js', description: 'Growth optimization' }
      ],

      // Sprint week specials
      sprint: [
        { name: 'audio-intel-content', file: 'audio-intel-content-agent.js', description: 'Audio Intel branding' },
        { name: 'sprint-orchestrator', file: 'sprint-week-orchestrator.js', description: 'Sprint coordination' }
      ]
    };

    return agents;
  }

  /**
   * List all available agents
   */
  listAgents() {
    this.printHeader();
    
    let totalAgents = 0;
    for (const [category, agents] of Object.entries(this.availableAgents)) {
      const categoryColors = {
        orchestrators: colors.blue,
        core: colors.green, 
        integrations: colors.yellow,
        content: colors.magenta,
        musicIndustry: colors.cyan,
        sprint: colors.white
      };

      const color = categoryColors[category] || colors.white;
      console.log(`${color}${colors.bright}${category.toUpperCase()}:${colors.reset}`);
      
      agents.forEach(agent => {
        const status = this.runningAgents.has(agent.name) ? '🟢 RUNNING' : ' STOPPED';
        console.log(`  ${color}${colors.reset} ${agent.name} - ${agent.description} ${status}`);
        totalAgents++;
      });
      console.log();
    }

    console.log(`${colors.bright}Total agents available: ${totalAgents}${colors.reset}`);
    console.log(`${colors.bright}Currently running: ${this.runningAgents.size}${colors.reset}`);
  }

  /**
   * Run a specific agent
   */
  async runAgent(agentName, command = 'health', args = []) {
    const agent = this.findAgent(agentName);
    if (!agent) {
      console.log(`${colors.red}Agent '${agentName}' not found${colors.reset}`);
      return false;
    }

    console.log(`${colors.cyan}Running ${agent.name}: ${command}${colors.reset}`);
    
    return new Promise((resolve, reject) => {
      const agentPath = path.join(this.agentsDir, agent.file);
      const childProcess = spawn('node', [agentPath, command, ...args], {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'development' }
      });

      childProcess.on('close', (code) => {
        if (code === 0) {
          console.log(`${colors.green} ${agent.name} completed successfully${colors.reset}`);
          resolve(true);
        } else {
          console.log(`${colors.red} ${agent.name} failed with code ${code}${colors.reset}`);
          resolve(false);
        }
      });

      childProcess.on('error', (error) => {
        console.log(`${colors.red}Error running ${agent.name}: ${error.message}${colors.reset}`);
        reject(error);
      });
    });
  }

  /**
   * Start interactive chat with an agent
   */
  async chatWithAgent(agentName) {
    const agent = this.findAgent(agentName);
    if (!agent) {
      console.log(`${colors.red}Agent '${agentName}' not found${colors.reset}`);
      return;
    }

    console.log(`${colors.bgBlue}${colors.white} Starting interactive chat with ${agent.name} ${colors.reset}`);
    console.log(`${colors.yellow}Type 'exit' to quit the chat${colors.reset}\n`);

    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askQuestion = () => {
      rl.question(`${colors.cyan}You: ${colors.reset}`, async (input) => {
        if (input.toLowerCase() === 'exit') {
          console.log(`${colors.yellow}Chat session ended${colors.reset}`);
          rl.close();
          return;
        }

        try {
          await this.runAgent(agentName, 'chat', [input]);
        } catch (error) {
          console.log(`${colors.red}Error: ${error.message}${colors.reset}`);
        }
        
        askQuestion();
      });
    };

    askQuestion();
  }

  /**
   * Find agent by name
   */
  findAgent(name) {
    for (const category of Object.values(this.availableAgents)) {
      const agent = category.find(a => a.name === name);
      if (agent) return agent;
    }
    return null;
  }

  /**
   * Print header
   */
  printHeader() {
    console.log(`${colors.bgBlue}${colors.white}${colors.bright}                                                           ${colors.reset}`);
    console.log(`${colors.bgBlue}${colors.white}${colors.bright}     TOTAL AUDIO PROMO AGENT MANAGER v2.0            ${colors.reset}`);
    console.log(`${colors.bgBlue}${colors.white}${colors.bright}                                                           ${colors.reset}`);
    console.log();
  }

  /**
   * Health check all agents
   */
  async healthCheckAll() {
    this.printHeader();
    console.log(`${colors.bright}Running health checks on all agents...${colors.reset}\n`);

    let healthyCount = 0;
    let totalCount = 0;

    for (const [category, agents] of Object.entries(this.availableAgents)) {
      console.log(`${colors.yellow}Checking ${category}...${colors.reset}`);
      
      for (const agent of agents) {
        totalCount++;
        try {
          const success = await this.runAgent(agent.name, 'health');
          if (success) healthyCount++;
        } catch (error) {
          console.log(`${colors.red} ${agent.name} failed health check${colors.reset}`);
        }
      }
      console.log();
    }

    console.log(`${colors.bright}Health Check Summary:${colors.reset}`);
    console.log(`${colors.green}Healthy: ${healthyCount}/${totalCount}${colors.reset}`);
    console.log(`${colors.red}Failed: ${totalCount - healthyCount}/${totalCount}${colors.reset}`);
  }
}

// CLI interface
async function main() {
  const manager = new AgentManager();
  const command = process.argv[2];
  const agentName = process.argv[3];
  const agentCommand = process.argv[4];
  const args = process.argv.slice(5);

  switch (command) {
    case 'list':
      manager.listAgents();
      break;
      
    case 'run':
      if (!agentName) {
        console.log(`${colors.red}Usage: node agent-manager.js run <agent-name> [command] [args...]${colors.reset}`);
        process.exit(1);
      }
      await manager.runAgent(agentName, agentCommand || 'health', args);
      break;
      
    case 'chat':
      if (!agentName) {
        console.log(`${colors.red}Usage: node agent-manager.js chat <agent-name>${colors.reset}`);
        process.exit(1);
      }
      await manager.chatWithAgent(agentName);
      break;
      
    case 'health':
      await manager.healthCheckAll();
      break;
      
    default:
      manager.printHeader();
      console.log(`${colors.bright}Available commands:${colors.reset}`);
      console.log(`  ${colors.green}list${colors.reset}                     - List all available agents`);
      console.log(`  ${colors.green}run <agent> [cmd]${colors.reset}        - Run specific agent command`);
      console.log(`  ${colors.green}chat <agent>${colors.reset}             - Interactive chat with agent`);
      console.log(`  ${colors.green}health${colors.reset}                   - Health check all agents`);
      console.log();
      console.log(`${colors.bright}Examples:${colors.reset}`);
      console.log(`  ${colors.cyan}node agent-manager.js list${colors.reset}`);
      console.log(`  ${colors.cyan}node agent-manager.js run orchestrator-real health${colors.reset}`);
      console.log(`  ${colors.cyan}node agent-manager.js chat music-tech${colors.reset}`);
      console.log(`  ${colors.cyan}node agent-manager.js run orchestrator-real execute real-contact-enrichment${colors.reset}`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = AgentManager;