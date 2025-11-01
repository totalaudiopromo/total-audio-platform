/**
 * Agent Logger - Centralized logging and status tracking for automation agents
 *
 * Creates JSON status files for Command Centre dashboard integration
 * Provides consistent logging format across all agents
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

class AgentLogger {
  constructor(agentName, options = {}) {
    this.agentName = agentName;
    this.startTime = new Date();

    // Default options
    this.options = {
      statusDir: options.statusDir || path.join(os.homedir(), '.total-audio-status'),
      logToConsole: options.logToConsole !== false,
      logToFile: options.logToFile !== false,
      ...options,
    };

    // Ensure status directory exists
    if (!fs.existsSync(this.options.statusDir)) {
      fs.mkdirSync(this.options.statusDir, { recursive: true });
    }

    this.statusFile = path.join(this.options.statusDir, `${agentName}-status.json`);

    // Initialize status
    this.status = {
      agentName: this.agentName,
      status: 'running',
      startedAt: this.startTime.toISOString(),
      lastUpdate: this.startTime.toISOString(),
      progress: 0,
      metrics: {},
      logs: [],
      errors: [],
    };

    this.writeStatus();
  }

  /**
   * Log info message
   */
  info(message, data = null) {
    const logEntry = {
      level: 'info',
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    this.status.logs.push(logEntry);
    this.status.lastUpdate = logEntry.timestamp;

    if (this.options.logToConsole) {
      console.log(`[${this.agentName}] ${message}`, data || '');
    }

    this.writeStatus();
  }

  /**
   * Log warning message
   */
  warn(message, data = null) {
    const logEntry = {
      level: 'warn',
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    this.status.logs.push(logEntry);
    this.status.lastUpdate = logEntry.timestamp;

    if (this.options.logToConsole) {
      console.warn(`[${this.agentName}] ⚠️  ${message}`, data || '');
    }

    this.writeStatus();
  }

  /**
   * Log error message
   */
  error(message, error = null) {
    const errorEntry = {
      message,
      error: error
        ? {
            message: error.message,
            stack: error.stack,
            code: error.code,
          }
        : null,
      timestamp: new Date().toISOString(),
    };

    this.status.errors.push(errorEntry);
    this.status.lastUpdate = errorEntry.timestamp;

    if (this.options.logToConsole) {
      console.error(`[${this.agentName}] ❌ ${message}`, error || '');
    }

    this.writeStatus();
  }

  /**
   * Log success message
   */
  success(message, data = null) {
    const logEntry = {
      level: 'success',
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    this.status.logs.push(logEntry);
    this.status.lastUpdate = logEntry.timestamp;

    if (this.options.logToConsole) {
      console.log(`[${this.agentName}] ✅ ${message}`, data || '');
    }

    this.writeStatus();
  }

  /**
   * Update progress (0-100)
   */
  updateProgress(progress, message = null) {
    this.status.progress = Math.min(100, Math.max(0, progress));
    this.status.lastUpdate = new Date().toISOString();

    if (message) {
      this.info(message);
    }

    this.writeStatus();
  }

  /**
   * Update metrics
   */
  updateMetrics(metrics) {
    this.status.metrics = {
      ...this.status.metrics,
      ...metrics,
    };
    this.status.lastUpdate = new Date().toISOString();
    this.writeStatus();
  }

  /**
   * Set custom status
   */
  setStatus(status) {
    this.status.status = status;
    this.status.lastUpdate = new Date().toISOString();
    this.writeStatus();
  }

  /**
   * Mark agent as completed
   */
  complete(finalMetrics = {}) {
    const endTime = new Date();
    const duration = endTime - this.startTime;

    this.status.status = 'completed';
    this.status.completedAt = endTime.toISOString();
    this.status.duration = duration;
    this.status.progress = 100;
    this.status.lastUpdate = endTime.toISOString();

    if (Object.keys(finalMetrics).length > 0) {
      this.updateMetrics(finalMetrics);
    }

    this.success(`Completed in ${Math.round(duration / 1000)}s`);
    this.writeStatus();
  }

  /**
   * Mark agent as failed
   */
  fail(errorMessage, error = null) {
    const endTime = new Date();
    const duration = endTime - this.startTime;

    this.status.status = 'failed';
    this.status.completedAt = endTime.toISOString();
    this.status.duration = duration;
    this.status.lastUpdate = endTime.toISOString();

    this.error(errorMessage, error);
    this.writeStatus();
  }

  /**
   * Write status to JSON file
   */
  writeStatus() {
    try {
      // Keep only last 50 log entries to prevent file bloat
      if (this.status.logs.length > 50) {
        this.status.logs = this.status.logs.slice(-50);
      }

      // Keep only last 10 errors
      if (this.status.errors.length > 10) {
        this.status.errors = this.status.errors.slice(-10);
      }

      fs.writeFileSync(this.statusFile, JSON.stringify(this.status, null, 2));
    } catch (err) {
      if (this.options.logToConsole) {
        console.error(`Failed to write status file: ${err.message}`);
      }
    }
  }

  /**
   * Get current status
   */
  getStatus() {
    return { ...this.status };
  }

  /**
   * Read status from file
   */
  static readStatus(agentName, statusDir = null) {
    const dir = statusDir || path.join(os.homedir(), '.total-audio-status');
    const file = path.join(dir, `${agentName}-status.json`);

    if (!fs.existsSync(file)) {
      return null;
    }

    try {
      const data = fs.readFileSync(file, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error(`Failed to read status file: ${err.message}`);
      return null;
    }
  }

  /**
   * Get all agent statuses
   */
  static getAllStatuses(statusDir = null) {
    const dir = statusDir || path.join(os.homedir(), '.total-audio-status');

    if (!fs.existsSync(dir)) {
      return [];
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('-status.json'));
    const statuses = [];

    for (const file of files) {
      try {
        const data = fs.readFileSync(path.join(dir, file), 'utf8');
        statuses.push(JSON.parse(data));
      } catch (err) {
        console.error(`Failed to read ${file}: ${err.message}`);
      }
    }

    return statuses;
  }
}

module.exports = AgentLogger;
