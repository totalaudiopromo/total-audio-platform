/**
 * MeshOS Orchestrator
 * Main coordination loop that ties all engines together
 */

import type { OrchestratorOptions, OrchestratorStatus, GlobalContext } from '../types';
import { logger } from '../utils/logger';
import { PolicyEngine } from '../engines/policyEngine';
import { MessageRouter } from '../engines/messageRouter';
import { PlanningEngine } from '../engines/planningEngine';
import { NegotiationEngine } from '../engines/negotiationEngine';
import { DriftEngine } from '../engines/driftEngine';
import { GlobalContextEngine } from '../engines/globalContextEngine';
import { InsightRouter } from '../engines/insightRouter';

export class MeshOrchestrator {
  private options: OrchestratorOptions;
  private running: boolean = false;
  private cycleCount: number = 0;
  private errorCount: number = 0;
  private lastCycle: string = '';
  private currentContext: GlobalContext | null = null;

  // Engines
  private policyEngine: PolicyEngine;
  private messageRouter: MessageRouter;
  private planningEngine: PlanningEngine;
  private negotiationEngine: NegotiationEngine;
  private driftEngine: DriftEngine;
  private globalContextEngine: GlobalContextEngine;
  private insightRouter: InsightRouter;

  constructor(options: OrchestratorOptions) {
    this.options = options;
    logger.setContext('MeshOrchestrator');

    // Initialize engines
    this.policyEngine = new PolicyEngine(options.workspace_id, options.policy);
    this.messageRouter = new MessageRouter(options.workspace_id);
    this.planningEngine = new PlanningEngine(options.workspace_id);
    this.negotiationEngine = new NegotiationEngine(options.workspace_id);
    this.driftEngine = new DriftEngine(options.workspace_id);
    this.globalContextEngine = new GlobalContextEngine(options.workspace_id);
    this.insightRouter = new InsightRouter(options.workspace_id);

    logger.info('MeshOrchestrator initialized', { workspace_id: options.workspace_id });
  }

  /**
   * Set adapters for all engines
   */
  setAdapters(adapters: Record<string, any>): void {
    this.planningEngine.setAdapters(adapters);
    this.driftEngine.setAdapters(adapters);
    this.globalContextEngine.setAdapters(adapters);
    logger.info('Adapters configured', { count: Object.keys(adapters).length });
  }

  /**
   * Set stores for persistence
   */
  setStores(stores: {
    messageStore?: any;
    stateStore?: any;
    planStore?: any;
    negotiationStore?: any;
    insightRouteStore?: any;
  }): void {
    if (stores.messageStore) {
      this.messageRouter.setMessageStore(stores.messageStore);
    }
    logger.info('Stores configured');
  }

  /**
   * Start orchestration loop
   */
  async start(): Promise<void> {
    if (this.running) {
      logger.warn('Orchestrator already running');
      return;
    }

    this.running = true;
    logger.info('MeshOrchestrator started');

    // Run initial cycle
    await this.runCycle();

    // Schedule periodic cycles (every 5 minutes)
    // In production, this would be more sophisticated
  }

  /**
   * Stop orchestration
   */
  stop(): void {
    this.running = false;
    logger.info('MeshOrchestrator stopped');
  }

  /**
   * Run a single orchestration cycle
   */
  private async runCycle(): Promise<void> {
    if (!this.running) return;

    logger.info('Starting orchestration cycle', { cycle: this.cycleCount + 1 });

    try {
      // 1. Build global context
      this.currentContext = await this.globalContextEngine.buildContext();

      // 2. Detect drift
      if (this.options.enable_auto_drift_detection) {
        const driftReports = await this.driftEngine.detectDrift();
        logger.info(`Detected ${driftReports.length} drift reports`);
      }

      // 3. Update plans (if needed)
      if (this.options.enable_auto_planning) {
        // Planning would run on a schedule
        logger.debug('Auto-planning enabled');
      }

      // 4. Process pending messages
      // Would process messages from messageStore

      this.cycleCount++;
      this.lastCycle = new Date().toISOString();
    } catch (error: any) {
      this.errorCount++;
      logger.error('Error in orchestration cycle', error);
    }
  }

  /**
   * Get orchestrator status
   */
  getStatus(): OrchestratorStatus {
    return {
      running: this.running,
      last_cycle: this.lastCycle,
      cycles_completed: this.cycleCount,
      errors: this.errorCount,
      context: this.currentContext || ({} as GlobalContext),
    };
  }

  /**
   * Get global context
   */
  async getGlobalContext(): Promise<GlobalContext> {
    if (!this.currentContext) {
      this.currentContext = await this.globalContextEngine.buildContext();
    }
    return this.currentContext;
  }

  /**
   * Trigger planning manually
   */
  async triggerPlanning(timeframe: '7d' | '30d' | '90d'): Promise<any> {
    logger.info(`Manual planning trigger for ${timeframe}`);
    return await this.planningEngine.generatePlan(timeframe);
  }

  /**
   * Trigger negotiation manually
   */
  async triggerNegotiation(params: any): Promise<any> {
    logger.info('Manual negotiation trigger');
    return await this.negotiationEngine.negotiate(params);
  }
}
