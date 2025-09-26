#!/usr/bin/env node

/**
 * Notion Integration Health Check
 * 
 * Monitors Notion API connectivity and MCP server health
 * Run this daily or when integration issues occur
 */

const { spawn } = require('child_process');

const logger = {
  info: (msg, ...args) => console.log(`[NOTION-HEALTH] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[NOTION-HEALTH] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[NOTION-HEALTH] ${msg}`, ...args),
  success: (msg, ...args) => console.log(`✅ [NOTION-HEALTH] ${msg}`, ...args),
  fail: (msg, ...args) => console.error(`❌ [NOTION-HEALTH] ${msg}`, ...args)
};

class NotionHealthMonitor {
  constructor() {
    this.name = 'NotionHealthMonitor';
    this.apiKey = process.env.NOTION_API_KEY || 'ntn_b2740658669wm0A1FXlKD4CZbHgiygQW4PM6ZDngMbuavL';
    this.healthStatus = {
      apiConnection: false,
      mcpServer: false,
      permissions: false,
      lastCheck: new Date()
    };
  }

  /**
   * Test direct API connection
   */
  async testDirectAPI() {
    try {
      logger.info('Testing direct Notion API connection...');
      
      const response = await fetch('https://api.notion.com/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        logger.success(`Direct API connection working - User: ${userData.name || 'Unknown'}`);
        this.healthStatus.apiConnection = true;
        return true;
      } else {
        const error = await response.json();
        logger.fail(`Direct API connection failed: ${error.message}`);
        this.healthStatus.apiConnection = false;
        return false;
      }
    } catch (error) {
      logger.fail(`Direct API connection error: ${error.message}`);
      this.healthStatus.apiConnection = false;
      return false;
    }
  }

  /**
   * Test MCP server status
   */
  async testMCPServer() {
    return new Promise((resolve) => {
      logger.info('Testing MCP server status...');
      
      const mcpList = spawn('claude', ['mcp', 'list']);
      let output = '';
      let errorOutput = '';

      mcpList.stdout.on('data', (data) => {
        output += data.toString();
      });

      mcpList.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      mcpList.on('close', (code) => {
        if (code === 0 && output.includes('notion') && output.includes('✓')) {
          logger.success('MCP server is connected and healthy');
          this.healthStatus.mcpServer = true;
          resolve(true);
        } else if (output.includes('notion') && output.includes('✗')) {
          logger.fail('MCP server is configured but disconnected');
          this.healthStatus.mcpServer = false;
          resolve(false);
        } else {
          logger.fail('MCP server is not configured');
          this.healthStatus.mcpServer = false;
          resolve(false);
        }
      });

      mcpList.on('error', (error) => {
        logger.fail(`MCP server test error: ${error.message}`);
        this.healthStatus.mcpServer = false;
        resolve(false);
      });
    });
  }

  /**
   * Test workspace permissions
   */
  async testPermissions() {
    try {
      logger.info('Testing workspace permissions...');
      
      // Try to search for pages - this tests read permissions
      const searchResponse = await fetch('https://api.notion.com/v1/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: '',
          filter: { property: 'object', value: 'page' },
          page_size: 5
        })
      });

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        const pageCount = searchData.results.length;
        
        if (pageCount > 0) {
          logger.success(`Workspace access confirmed - Found ${pageCount} accessible pages`);
          this.healthStatus.permissions = true;
          return true;
        } else {
          logger.warn('Workspace access limited - No pages accessible');
          logger.warn('Make sure to share critical pages with the integration');
          this.healthStatus.permissions = false;
          return false;
        }
      } else {
        const error = await searchResponse.json();
        logger.fail(`Permissions test failed: ${error.message}`);
        this.healthStatus.permissions = false;
        return false;
      }
    } catch (error) {
      logger.fail(`Permissions test error: ${error.message}`);
      this.healthStatus.permissions = false;
      return false;
    }
  }

  /**
   * Auto-recovery attempt
   */
  async attemptRecovery() {
    logger.warn('Attempting auto-recovery...');
    
    return new Promise((resolve) => {
      // Remove existing MCP server
      const removeCmd = spawn('claude', ['mcp', 'remove', 'notion']);
      
      removeCmd.on('close', (code) => {
        // Add fresh MCP server
        const addCmd = spawn('claude', ['mcp', 'add', 'notion', 'npx', '--', '@notionhq/notion-mcp-server', `--api-key=${this.apiKey}`]);
        
        addCmd.on('close', (addCode) => {
          if (addCode === 0) {
            logger.info('MCP server re-configured. Testing connection...');
            // Give it a moment to initialize
            setTimeout(async () => {
              const mcpWorking = await this.testMCPServer();
              if (mcpWorking) {
                logger.success('Auto-recovery successful!');
                resolve(true);
              } else {
                logger.fail('Auto-recovery failed');
                resolve(false);
              }
            }, 2000);
          } else {
            logger.fail('Failed to re-add MCP server');
            resolve(false);
          }
        });

        addCmd.on('error', (error) => {
          logger.fail(`Recovery error: ${error.message}`);
          resolve(false);
        });
      });

      removeCmd.on('error', (error) => {
        logger.warn(`Remove command error (may be expected): ${error.message}`);
        // Continue with add command anyway
      });
    });
  }

  /**
   * Full health check
   */
  async runFullCheck() {
    logger.info('Starting comprehensive Notion integration health check...');
    logger.info('='.repeat(60));

    const apiHealthy = await this.testDirectAPI();
    const mcpHealthy = await this.testMCPServer();
    const permissionsOk = await this.testPermissions();

    logger.info('='.repeat(60));
    logger.info('HEALTH CHECK RESULTS:');
    logger.info(`API Connection: ${apiHealthy ? '✅ HEALTHY' : '❌ FAILED'}`);
    logger.info(`MCP Server: ${mcpHealthy ? '✅ HEALTHY' : '❌ FAILED'}`);
    logger.info(`Permissions: ${permissionsOk ? '✅ HEALTHY' : '❌ LIMITED'}`);
    
    const overallHealthy = apiHealthy && mcpHealthy && permissionsOk;
    
    if (overallHealthy) {
      logger.success('🎉 All systems healthy! Notion integration is working perfectly.');
      return true;
    } else {
      logger.fail('🚨 Integration issues detected!');
      
      if (!apiHealthy) {
        logger.error('🔧 FIX REQUIRED: Check API key at https://www.notion.so/my-integrations');
      }
      if (!mcpHealthy && apiHealthy) {
        logger.warn('🔧 ATTEMPTING AUTO-RECOVERY...');
        const recovered = await this.attemptRecovery();
        if (!recovered) {
          logger.error('🔧 MANUAL FIX REQUIRED: Re-configure MCP server');
        }
      }
      if (!permissionsOk && apiHealthy) {
        logger.error('🔧 FIX REQUIRED: Share pages with integration at https://www.notion.so');
      }
      
      return false;
    }
  }

  /**
   * Generate recovery instructions
   */
  showRecoveryInstructions() {
    console.log('\n📋 RECOVERY INSTRUCTIONS:');
    console.log('1. Go to: https://www.notion.so/my-integrations');
    console.log('2. Find "Claude Code Integration"');
    console.log('3. Copy the API token');
    console.log('4. Run: claude mcp remove notion');
    console.log('5. Run: claude mcp add notion npx -- @notionhq/notion-mcp-server --api-key=YOUR_TOKEN');
    console.log('6. Share critical pages with the integration');
    console.log('7. Run this health check again');
    console.log('\n💡 See NOTION-INTEGRATION-RECOVERY-PLAN.md for full details');
  }
}

// CLI execution
if (require.main === module) {
  const monitor = new NotionHealthMonitor();
  
  monitor.runFullCheck().then((healthy) => {
    if (!healthy) {
      monitor.showRecoveryInstructions();
      process.exit(1);
    } else {
      process.exit(0);
    }
  }).catch((error) => {
    logger.fail(`Health check failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = NotionHealthMonitor;