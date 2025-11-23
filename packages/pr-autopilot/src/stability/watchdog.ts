/**
 * Agent Watchdog
 *
 * Monitors agent execution and enforces timeouts
 */

import type { AgentRole } from '../types';

export interface WatchdogConfig {
  defaultTimeoutMs: number;
  agentTimeouts: Partial<Record<AgentRole, number>>;
  enableKillSwitch: boolean;
}

export const DEFAULT_WATCHDOG_CONFIG: WatchdogConfig = {
  defaultTimeoutMs: 120000, // 2 minutes
  agentTimeouts: {
    strategist: 180000, // 3 minutes (more complex)
    pitch: 90000, // 1.5 minutes
    contact: 60000, // 1 minute
    scheduler: 30000, // 30 seconds
    followup: 60000, // 1 minute
    analyst: 120000, // 2 minutes
    archivist: 90000, // 1.5 minutes
    simulator: 180000, // 3 minutes (complex simulations)
    coordinator: 60000, // 1 minute
  },
  enableKillSwitch: true,
};

export class WatchdogTimer {
  private timerId: NodeJS.Timeout | null = null;
  private startTime: number = 0;
  private timeoutMs: number;
  private onTimeout: () => void;

  constructor(timeoutMs: number, onTimeout: () => void) {
    this.timeoutMs = timeoutMs;
    this.onTimeout = onTimeout;
  }

  start(): void {
    this.startTime = Date.now();
    this.timerId = setTimeout(() => {
      this.onTimeout();
    }, this.timeoutMs);
  }

  stop(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  elapsed(): number {
    return Date.now() - this.startTime;
  }

  remaining(): number {
    return Math.max(0, this.timeoutMs - this.elapsed());
  }
}

export class AgentWatchdog {
  private config: WatchdogConfig;
  private activeWatchdogs: Map<string, WatchdogTimer> = new Map();

  constructor(config: WatchdogConfig = DEFAULT_WATCHDOG_CONFIG) {
    this.config = config;
  }

  /**
   * Start watching an agent execution
   */
  watch(
    taskId: string,
    agentRole: AgentRole,
    onTimeout: () => void
  ): WatchdogTimer {
    const timeoutMs =
      this.config.agentTimeouts[agentRole] || this.config.defaultTimeoutMs;

    const watchdog = new WatchdogTimer(timeoutMs, () => {
      this.activeWatchdogs.delete(taskId);
      onTimeout();
    });

    watchdog.start();
    this.activeWatchdogs.set(taskId, watchdog);

    return watchdog;
  }

  /**
   * Stop watching a task
   */
  unwatch(taskId: string): void {
    const watchdog = this.activeWatchdogs.get(taskId);
    if (watchdog) {
      watchdog.stop();
      this.activeWatchdogs.delete(taskId);
    }
  }

  /**
   * Check if task is being watched
   */
  isWatching(taskId: string): boolean {
    return this.activeWatchdogs.has(taskId);
  }

  /**
   * Get remaining time for task
   */
  remaining(taskId: string): number {
    const watchdog = this.activeWatchdogs.get(taskId);
    return watchdog ? watchdog.remaining() : 0;
  }

  /**
   * Kill all active watchdogs (emergency stop)
   */
  killAll(): void {
    for (const watchdog of this.activeWatchdogs.values()) {
      watchdog.stop();
    }
    this.activeWatchdogs.clear();
  }

  /**
   * Get stats
   */
  getStats(): {
    activeWatchdogs: number;
    watchedTasks: string[];
  } {
    return {
      activeWatchdogs: this.activeWatchdogs.size,
      watchedTasks: Array.from(this.activeWatchdogs.keys()),
    };
  }
}

/**
 * Execute function with watchdog timeout
 */
export async function executeWithWatchdog<T>(
  watchdog: AgentWatchdog,
  taskId: string,
  agentRole: AgentRole,
  fn: () => Promise<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    let completed = false;

    // Start watchdog
    watchdog.watch(taskId, agentRole, () => {
      if (!completed) {
        completed = true;
        reject(
          new Error(
            `Agent ${agentRole} timed out after ${watchdog.config.agentTimeouts[agentRole] || watchdog.config.defaultTimeoutMs}ms`
          )
        );
      }
    });

    // Execute function
    fn()
      .then((result) => {
        if (!completed) {
          completed = true;
          watchdog.unwatch(taskId);
          resolve(result);
        }
      })
      .catch((error) => {
        if (!completed) {
          completed = true;
          watchdog.unwatch(taskId);
          reject(error);
        }
      });
  });
}

/**
 * Create global watchdog instance
 */
let globalWatchdog: AgentWatchdog | null = null;

export function getGlobalWatchdog(): AgentWatchdog {
  if (!globalWatchdog) {
    globalWatchdog = new AgentWatchdog();
  }
  return globalWatchdog;
}
