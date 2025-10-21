#!/usr/bin/env node

/**
 * Setup Script for Total Audio Promo Agents
 * 
 * Helps configure and test the agent system
 */

const fs = require('fs');
const path = require('path');

class AgentSetup {
  constructor() {
    this.name = 'AgentSetup';
    this.projectRoot = path.dirname(__dirname);
    this.backendEnvPath = path.join(this.projectRoot, 'backend', '.env');
    this.envExamplePath = path.join(this.projectRoot, 'backend', '.env.example');
  }

  /**
   * Check if environment is properly configured
   */
  async checkEnvironment() {
    console.log(' Checking environment configuration...\n');
    
    const checks = {
      backendEnvFile: this.checkFileExists(this.backendEnvPath),
      envExample: this.checkFileExists(this.envExamplePath),
      nodeModules: this.checkFileExists(path.join(this.projectRoot, 'node_modules')),
      prismaGenerated: this.checkFileExists(path.join(this.projectRoot, 'node_modules', '@prisma', 'client'))
    };

    // Check for required environment variables
    if (checks.backendEnvFile) {
      const envContent = fs.readFileSync(this.backendEnvPath, 'utf8');
      checks.databaseUrl = envContent.includes('DATABASE_URL=') && !envContent.includes('DATABASE_URL=your_database_url_here');
      checks.jwtSecret = envContent.includes('JWT_SECRET=') && !envContent.includes('JWT_SECRET=your_jwt_secret_here');
    } else {
      checks.databaseUrl = false;
      checks.jwtSecret = false;
    }

    this.displayCheckResults(checks);
    return checks;
  }

  /**
   * Check if a file exists
   */
  checkFileExists(filePath) {
    return fs.existsSync(filePath);
  }

  /**
   * Display check results
   */
  displayCheckResults(checks) {
    console.log('Environment Check Results:');
    console.log('========================');
    
    Object.entries(checks).forEach(([check, passed]) => {
      const icon = passed ? '' : '';
      const status = passed ? 'PASS' : 'FAIL';
      console.log(`${icon} ${check}: ${status}`);
    });
    
    console.log('\n');

    // Provide guidance based on results
    if (!checks.backendEnvFile) {
      console.log(' Setup Guidance:');
      console.log('   1. Copy .env.example to .env in the backend directory');
      console.log('   2. Configure your database connection and other required variables');
    }

    if (!checks.databaseUrl) {
      console.log(' Database Setup:');
      console.log('   - Set DATABASE_URL in backend/.env');
      console.log('   - Example: DATABASE_URL="postgresql://user:password@localhost:5432/totalaudiopromo"');
    }

    if (!checks.prismaGenerated) {
      console.log(' Prisma Setup:');
      console.log('   - Run: cd backend && npm run db:generate');
    }
  }

  /**
   * Test agent connectivity
   */
  async testAgents() {
    console.log(' Testing agent connectivity...\n');
    
    const tests = [
      {
        name: 'Integration Agent',
        command: 'node agents/integration-agent.js health',
        description: 'Tests third-party service mock connections'
      },
      {
        name: 'Orchestrator Health',
        command: 'node agents/orchestrator.js health',
        description: 'Tests overall system health'
      },
      {
        name: 'Available Workflows',
        command: 'node agents/orchestrator.js workflows',
        description: 'Lists all available automated workflows'
      }
    ];

    for (const test of tests) {
      console.log(`Running: ${test.name}`);
      console.log(`Description: ${test.description}`);
      console.log(`Command: ${test.command}`);
      console.log(''.repeat(50));
      
      try {
        const { spawn } = require('child_process');
        const [command, ...args] = test.command.split(' ');
        
        await new Promise((resolve, reject) => {
          const child = spawn(command, args, { 
            stdio: 'inherit',
            cwd: this.projectRoot
          });
          
          child.on('close', (code) => {
            if (code === 0) {
              console.log(` ${test.name} completed successfully\n`);
              resolve();
            } else {
              console.log(` ${test.name} failed with code ${code}\n`);
              reject(new Error(`Test failed with code ${code}`));
            }
          });
        });
      } catch (error) {
        console.log(` ${test.name} failed:`, error.message, '\n');
      }
    }
  }

  /**
   * Display usage information
   */
  displayUsage() {
    console.log(' Agent System Usage:\n');
    
    console.log('Available Agents:');
    console.log('================');
    console.log('• database-agent.js    - Database operations and health checks');
    console.log('• integration-agent.js - Third-party service integrations');
    console.log('• campaign-agent.js    - Campaign management and optimization');
    console.log('• contact-agent.js     - Contact enrichment and segmentation');
    console.log('• agency-agent.js      - Agency operations and billing');
    console.log('• orchestrator.js      - Workflow coordination and management');
    
    console.log('\nExample Commands:');
    console.log('================');
    console.log('# Check system health');
    console.log('node agents/orchestrator.js health');
    
    console.log('\n# List available workflows');
    console.log('node agents/orchestrator.js workflows');
    
    console.log('\n# Run daily maintenance (when DB is configured)');
    console.log('node agents/orchestrator.js maintenance');
    
    console.log('\n# Test integration services');
    console.log('node agents/integration-agent.js health');
    
    console.log('\n# Individual agent operations (when DB is configured)');
    console.log('node agents/contact-agent.js bulk 50');
    console.log('node agents/campaign-agent.js stats');
    console.log('node agents/agency-agent.js dashboard <agencyId>');
    
    console.log('\nWorkflow Examples:');
    console.log('=================');
    console.log('• agency-onboarding     - Complete agency setup');
    console.log('• campaign-launch       - Launch campaigns across platforms');
    console.log('• contact-enrichment    - Bulk contact processing');
    console.log('• daily-maintenance     - System health and optimization');
    console.log('• performance-optimization - Campaign and system tuning');
  }

  /**
   * Main setup function
   */
  async run(command) {
    console.log(' Total Audio Promo - Agent Setup\n');
    
    switch (command) {
      case 'check':
        await this.checkEnvironment();
        break;
      
      case 'test':
        await this.testAgents();
        break;
      
      case 'usage':
        this.displayUsage();
        break;
      
      default:
        console.log('Setup Commands:');
        console.log('==============');
        console.log('node agents/setup.js check  - Check environment configuration');
        console.log('node agents/setup.js test   - Test agent connectivity');
        console.log('node agents/setup.js usage  - Display usage information');
        console.log('\nFor full setup, run all commands in order: check, test, usage');
    }
  }
}

// Command line interface
if (require.main === module) {
  const setup = new AgentSetup();
  const command = process.argv[2] || 'help';
  
  setup.run(command).catch(console.error);
}

module.exports = AgentSetup;