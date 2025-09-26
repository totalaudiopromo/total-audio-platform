/**
 * Base Agent class for Total Audio Agent OS
 * Integrates with existing Total Audio infrastructure
 */

class BaseAgent {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
    this.memory = new AgentMemory(name);
    this.logger = new AgentLogger(name);
    this.status = 'idle';
    this.lastRun = null;
  }

  async initialize() {
    this.logger.info(`Initializing agent: ${this.name}`);
    await this.memory.load();
    this.status = 'ready';
  }

  async execute(input, context = {}) {
    try {
      this.status = 'running';
      this.lastRun = new Date();
      
      this.logger.info(`Executing agent: ${this.name}`, { input, context });
      
      // Store input in memory
      await this.memory.store('last_input', input);
      await this.memory.store('last_context', context);
      
      const result = await this.run(input, context);
      
      // Store result in memory
      await this.memory.store('last_result', result);
      await this.memory.store('last_execution', this.lastRun);
      
      this.status = 'ready';
      this.logger.info(`Agent completed: ${this.name}`, { result });
      
      return result;
      
    } catch (error) {
      this.status = 'error';
      this.logger.error(`Agent failed: ${this.name}`, { error: error.message });
      throw error;
    }
  }

  // Override this method in child classes
  async run(input, context) {
    throw new Error(`Agent ${this.name} must implement run() method`);
  }

  async getMemory(key) {
    return await this.memory.retrieve(key);
  }

  async storeMemory(key, value) {
    return await this.memory.store(key, value);
  }

  getStatus() {
    return {
      name: this.name,
      status: this.status,
      lastRun: this.lastRun,
      config: this.config
    };
  }
}

class AgentMemory {
  constructor(agentName) {
    this.agentName = agentName;
    this.data = new Map();
    this.persistent = true;
  }

  async load() {
    // Load from file system
    try {
      const fs = require('fs').promises;
      const path = require('path');
      const memoryFile = path.join(__dirname, '../memory', `${this.agentName}.json`);
      
      if (await fs.access(memoryFile).then(() => true).catch(() => false)) {
        const data = await fs.readFile(memoryFile, 'utf8');
        const parsed = JSON.parse(data);
        this.data = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.warn(`Failed to load memory for ${this.agentName}:`, error.message);
    }
  }

  async store(key, value) {
    this.data.set(key, {
      value,
      timestamp: new Date().toISOString()
    });
    
    if (this.persistent) {
      await this.persist();
    }
  }

  async retrieve(key) {
    const item = this.data.get(key);
    return item ? item.value : null;
  }

  async persist() {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      const memoryFile = path.join(__dirname, '../memory', `${this.agentName}.json`);
      
      const data = Object.fromEntries(this.data);
      await fs.writeFile(memoryFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Failed to persist memory for ${this.agentName}:`, error.message);
    }
  }
}

class AgentLogger {
  constructor(agentName) {
    this.agentName = agentName;
  }

  info(message, data = {}) {
    console.log(`[${new Date().toISOString()}] [${this.agentName}] INFO: ${message}`, data);
  }

  warn(message, data = {}) {
    console.warn(`[${new Date().toISOString()}] [${this.agentName}] WARN: ${message}`, data);
  }

  error(message, data = {}) {
    console.error(`[${new Date().toISOString()}] [${this.agentName}] ERROR: ${message}`, data);
  }
}

module.exports = { BaseAgent, AgentMemory, AgentLogger };
