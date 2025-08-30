#!/usr/bin/env node

/**
 * Color-Coded Agent Dashboard
 * Run this from anywhere to see and execute your agents
 */

const { exec } = require('child_process');
const path = require('path');

// ANSI color codes for terminal output
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
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m'
};

// Agent categories with color coding
const agents = {
  '🤖 SPRINT WEEK READY (Database Independent)': {
    color: colors.green,
    agents: [
      {
        name: 'Sprint Week Orchestrator',
        file: 'sprint-week-orchestrator.js',
        description: 'Main coordinator for Sprint Week workflows',
        commands: [
          'node sprint-week-orchestrator.js health',
          'node sprint-week-orchestrator.js generate social-instagram',
          'node sprint-week-orchestrator.js workflow social-media-blitz'
        ]
      },
      {
        name: 'Audio Intel Content Agent',
        file: 'audio-intel-content-agent.js', 
        description: 'Audio Intel branded content generation',
        commands: [
          'node audio-intel-content-agent.js health',
          'node audio-intel-content-agent.js social "New Track" "Audio Intel" "instagram"',
          'node audio-intel-content-agent.js press "AI Revolution" "Audio Intel"'
        ]
      }
    ]
  },
  '⚠️  DATABASE DEPENDENT (Needs Prisma Fix)': {
    color: colors.yellow,
    agents: [
      { name: 'Integration Agent', file: 'integration-agent.js', description: 'Third-party integrations' },
      { name: 'Campaign Agent', file: 'campaign-agent.js', description: 'Campaign management' },
      { name: 'Contact Agent', file: 'contact-agent.js', description: 'Contact management' },
      { name: 'Analytics Agent', file: 'analytics-agent.js', description: 'Performance analytics' },
      { name: 'Database Agent', file: 'database-agent.js', description: 'Database operations' }
    ]
  },
  '🎯 CONTENT & MARKETING': {
    color: colors.magenta,
    agents: [
      { name: 'Content Generation Agent', file: 'content-generation-agent.js', description: 'Blog posts, press releases' },
      { name: 'Social Media Agent', file: 'social-media-agent.js', description: 'Social media automation' },
      { name: 'Radio Promo Agent', file: 'radio-promo-agent.js', description: 'Radio promotion campaigns' },
      { name: 'Viral Content Automation', file: 'viral-content-automation.js', description: 'Viral content strategies' }
    ]
  },
  '🎵 MUSIC INDUSTRY SPECIALISTS': {
    color: colors.cyan,
    agents: [
      { name: 'Music Industry Strategist', file: 'music-industry-strategist.js', description: 'Industry positioning' },
      { name: 'Music Marketing Mastermind', file: 'music-marketing-mastermind.js', description: 'Advanced marketing' },
      { name: 'Music Tech Agent', file: 'music-tech-agent.js', description: 'Technical music operations' }
    ]
  },
  '🏢 BUSINESS OPERATIONS': {
    color: colors.blue,
    agents: [
      { name: 'Agency Agent', file: 'agency-agent.js', description: 'Agency management' },
      { name: 'Growth Hacking Optimizer', file: 'growth-hacking-optimizer.js', description: 'Growth optimization' }
    ]
  },
  '🔧 SYSTEM COORDINATION': {
    color: colors.white,
    agents: [
      { name: 'Main Orchestrator', file: 'orchestrator.js', description: 'Multi-agent coordination' },
      { name: 'Production Orchestrator', file: 'orchestrator-real.js', description: 'Production workflows' },
      { name: 'Service Wrapper', file: 'service-wrapper.js', description: 'Service coordination' }
    ]
  }
};

function printHeader() {
  console.log(`${colors.bgBlue}${colors.white}${colors.bright}                                                    ${colors.reset}`);
  console.log(`${colors.bgBlue}${colors.white}${colors.bright}    🚀 TOTAL AUDIO PROMO AGENT DASHBOARD 🚀      ${colors.reset}`);
  console.log(`${colors.bgBlue}${colors.white}${colors.bright}                                                    ${colors.reset}`);
  console.log();
  console.log(`${colors.green}Current directory: ${process.cwd()}${colors.reset}`);
  console.log(`${colors.green}Agents directory: ${path.join(__dirname)}${colors.reset}`);
  console.log();
}

function printAgents() {
  for (const [category, data] of Object.entries(agents)) {
    console.log(`${data.color}${colors.bright}${category}${colors.reset}`);
    console.log(`${data.color}${'='.repeat(category.replace(/🤖|⚠️|🎯|🎵|🏢|🔧/g, '').length + 2)}${colors.reset}`);
    
    data.agents.forEach(agent => {
      console.log(`  ${data.color}●${colors.reset} ${colors.bright}${agent.name}${colors.reset}`);
      console.log(`    File: ${colors.cyan}${agent.file}${colors.reset}`);
      console.log(`    ${agent.description}`);
      
      if (agent.commands) {
        console.log(`    ${colors.yellow}Quick Commands:${colors.reset}`);
        agent.commands.forEach(cmd => {
          console.log(`      ${colors.green}${cmd}${colors.reset}`);
        });
      }
      console.log();
    });
    console.log();
  }
}

function printQuickStart() {
  console.log(`${colors.bgGreen}${colors.white}${colors.bright} QUICK START FOR SPRINT WEEK ${colors.reset}`);
  console.log();
  console.log(`${colors.yellow}1. Generate Audio Intel Instagram post:${colors.reset}`);
  console.log(`   ${colors.green}cd ${__dirname}${colors.reset}`);
  console.log(`   ${colors.green}node sprint-week-orchestrator.js generate social-instagram${colors.reset}`);
  console.log();
  console.log(`${colors.yellow}2. Create social media blitz (all platforms):${colors.reset}`);
  console.log(`   ${colors.green}node sprint-week-orchestrator.js workflow social-media-blitz${colors.reset}`);
  console.log();
  console.log(`${colors.yellow}3. Generate press release:${colors.reset}`);
  console.log(`   ${colors.green}node sprint-week-orchestrator.js generate press-release${colors.reset}`);
  console.log();
  console.log(`${colors.yellow}4. Full content suite:${colors.reset}`);
  console.log(`   ${colors.green}node sprint-week-orchestrator.js generate complete-suite${colors.reset}`);
  console.log();
}

function printUsage() {
  console.log(`${colors.bgMagenta}${colors.white}${colors.bright} USAGE ${colors.reset}`);
  console.log();
  console.log(`${colors.yellow}Run this dashboard:${colors.reset}`);
  console.log(`  ${colors.green}node ${path.join(__dirname, 'agent-dashboard.js')}${colors.reset}`);
  console.log();
  console.log(`${colors.yellow}Execute a specific agent:${colors.reset}`);
  console.log(`  ${colors.green}./agent-dashboard.js run <agent-file> <command> [args]${colors.reset}`);
  console.log();
  console.log(`${colors.yellow}Check agent health:${colors.reset}`);
  console.log(`  ${colors.green}./agent-dashboard.js health${colors.reset}`);
  console.log();
}

async function runAgent(agentFile, command, args = []) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(__dirname, agentFile);
    const cmdArgs = [command, ...args].join(' ');
    const fullCommand = `cd "${__dirname}" && node "${agentFile}" ${cmdArgs}`;
    
    console.log(`${colors.cyan}Executing: ${fullCommand}${colors.reset}`);
    console.log();
    
    exec(fullCommand, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        console.log(`${colors.red}Error: ${error.message}${colors.reset}`);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.log(`${colors.yellow}Warning: ${stderr}${colors.reset}`);
      }
      
      console.log(stdout);
      resolve(stdout);
    });
  });
}

async function checkHealth() {
  console.log(`${colors.bgCyan}${colors.white}${colors.bright} AGENT HEALTH CHECK ${colors.reset}`);
  console.log();
  
  const readyAgents = ['sprint-week-orchestrator.js', 'audio-intel-content-agent.js'];
  
  for (const agent of readyAgents) {
    try {
      console.log(`${colors.yellow}Checking ${agent}...${colors.reset}`);
      await runAgent(agent, 'health');
      console.log(`${colors.green}✅ ${agent} is healthy${colors.reset}`);
    } catch (error) {
      console.log(`${colors.red}❌ ${agent} failed health check${colors.reset}`);
    }
    console.log('---');
  }
}

// Main execution
async function main() {
  const command = process.argv[2];
  const agentFile = process.argv[3];
  const agentCommand = process.argv[4];
  const args = process.argv.slice(5);

  printHeader();

  switch (command) {
    case 'run':
      if (!agentFile || !agentCommand) {
        console.log(`${colors.red}Usage: ./agent-dashboard.js run <agent-file> <command> [args]${colors.reset}`);
        process.exit(1);
      }
      await runAgent(agentFile, agentCommand, args);
      break;
      
    case 'health':
      await checkHealth();
      break;
      
    default:
      printAgents();
      printQuickStart();
      printUsage();
  }
}

// Make executable
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { runAgent, checkHealth };