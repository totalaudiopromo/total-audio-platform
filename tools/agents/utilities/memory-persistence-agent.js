#!/usr/bin/env node

/**
 * Memory Persistence Agent for Claude Code
 * Prevents information loss during conversation compacting
 */

const fs = require('fs');
const path = require('path');

class MemoryPersistenceAgent {
  constructor() {
    this.name = 'MemoryPersistenceAgent';
    this.contextFile = path.join(__dirname, '..', '..', 'CLAUDE_CODE_SESSION_CONTEXT.md');
    this.sessionDataFile = path.join(__dirname, 'session-memory.json');
  }

  /**
   * Save critical session information
   */
  saveSessionMemory(sessionData) {
    const timestamp = new Date().toISOString();
    const memorySnapshot = {
      timestamp,
      currentFocus: sessionData.currentFocus || 'Audio Intel Development',
      activeTasks: sessionData.activeTasks || [],
      agentStates: sessionData.agentStates || {},
      sprintStatus: sessionData.sprintStatus || 'In Progress',
      criticalContext: sessionData.criticalContext || {},
      lastCompactTime: timestamp,
    };

    try {
      fs.writeFileSync(this.sessionDataFile, JSON.stringify(memorySnapshot, null, 2));
      console.log(`[MEMORY] Session memory saved at ${timestamp}`);
      return true;
    } catch (error) {
      console.error('[MEMORY] Failed to save session memory:', error);
      return false;
    }
  }

  /**
   * Load session memory after compacting
   */
  loadSessionMemory() {
    try {
      if (fs.existsSync(this.sessionDataFile)) {
        const memoryData = JSON.parse(fs.readFileSync(this.sessionDataFile, 'utf8'));
        console.log(`[MEMORY] Session memory loaded from ${memoryData.timestamp}`);
        return memoryData;
      }
    } catch (error) {
      console.error('[MEMORY] Failed to load session memory:', error);
    }
    return null;
  }

  /**
   * Update context file with current session state
   */
  updateContextFile(updates = {}) {
    if (!fs.existsSync(this.contextFile)) {
      console.log('[MEMORY] Context file not found, creating...');
      return false;
    }

    try {
      let content = fs.readFileSync(this.contextFile, 'utf8');

      // Update timestamp
      content = content.replace(
        /\*Last Updated: \[.*?\]\*/,
        `*Last Updated: ${new Date().toISOString()}*`
      );

      // Update current focus if provided
      if (updates.currentFocus) {
        content = content.replace(
          /\*\*Current Priority\*\*: \[.*?\]/,
          `**Current Priority**: ${updates.currentFocus}`
        );
      }

      // Update Sprint status if provided
      if (updates.sprintStatus) {
        content = content.replace(
          /\*\*Sprint Week Status\*\*: \[.*?\]/,
          `**Sprint Week Status**: ${updates.sprintStatus}`
        );
      }

      fs.writeFileSync(this.contextFile, content);
      console.log('[MEMORY] Context file updated successfully');
      return true;
    } catch (error) {
      console.error('[MEMORY] Failed to update context file:', error);
      return false;
    }
  }

  /**
   * Generate pre-compact summary
   */
  generatePreCompactSummary() {
    const sessionMemory = this.loadSessionMemory();
    const timestamp = new Date().toISOString();

    const summary = {
      timestamp,
      criticalReminders: [
        'Primary focus: Audio Intel contact enrichment SaaS',
        '23+ specialized agents available in tools/agents/',
        'Plan Mode integration: PLAN → REVIEW → EXECUTE → TEST → DOCUMENT',
        'MCP servers: puppeteer + filesystem active',
        'Main workspace: /workspace/active/total-audio-platform/',
        'Development command: npm run dev:audio-intel',
      ],
      currentContext: sessionMemory,
      nextSessionInstructions: [
        'Read CLAUDE_CODE_SESSION_CONTEXT.md for current state',
        'Load session memory with: node tools/agents/memory-persistence-agent.js load',
        'Check agent health with: npm run agents:health',
        'Verify MCP servers with: claude mcp list',
      ],
    };

    return summary;
  }

  /**
   * CLI Interface
   */
  handleCLI() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case 'save':
        const sessionData = {
          currentFocus: args[1] || 'Audio Intel Development',
          sprintStatus: args[2] || 'In Progress',
        };
        this.saveSessionMemory(sessionData);
        this.updateContextFile(sessionData);
        break;

      case 'load':
        const memory = this.loadSessionMemory();
        if (memory) {
          console.log('Session Memory:', JSON.stringify(memory, null, 2));
        } else {
          console.log('No session memory found');
        }
        break;

      case 'summary':
        const summary = this.generatePreCompactSummary();
        console.log('Pre-Compact Summary:', JSON.stringify(summary, null, 2));
        break;

      case 'update':
        const updates = {
          currentFocus: args[1],
          sprintStatus: args[2],
        };
        this.updateContextFile(updates);
        break;

      default:
        console.log(`
Memory Persistence Agent Commands:
  save [focus] [sprint-status]  - Save current session memory
  load                          - Load saved session memory  
  summary                       - Generate pre-compact summary
  update [focus] [status]       - Update context file
        `);
    }
  }
}

// CLI execution
if (require.main === module) {
  const agent = new MemoryPersistenceAgent();
  agent.handleCLI();
}

module.exports = MemoryPersistenceAgent;
