import NotionDashboardService from './notionDashboardService';

interface SyncEvent {
  id: string;
  timestamp: Date;
  type: 'agent_completion' | 'metrics_update' | 'customer_activity' | 'development_progress';
  data: any;
  synced: boolean;
  retries: number;
}

export class NotionRealTimeSync {
  private static instance: NotionRealTimeSync;
  private events: SyncEvent[] = [];
  private syncQueue: SyncEvent[] = [];
  private isProcessing = false;
  private websocket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private syncInterval: any = null;

  private constructor() {
    this.initializeWebSocket();
    this.startBackgroundSync();
  }

  static getInstance(): NotionRealTimeSync {
    if (!NotionRealTimeSync.instance) {
      NotionRealTimeSync.instance = new NotionRealTimeSync();
    }
    return NotionRealTimeSync.instance;
  }

  private initializeWebSocket(): void {
    if (typeof window === 'undefined') return; // Server-side check

    try {
      // In production, this would connect to your WebSocket server
      // For now, we'll simulate real-time events
      this.simulateRealTimeEvents();
    } catch (error) {
      console.error('WebSocket initialization failed:', error);
      this.scheduleReconnect();
    }
  }

  private simulateRealTimeEvents(): void {
    // Simulate agent completions every 30 seconds
    setInterval(() => {
      const agentTypes = [
        'intel-research',
        'content-creation',
        'campaign-planner',
        'performance-monitor',
      ];
      const randomAgent = agentTypes[Math.floor(Math.random() * agentTypes.length)];

      this.queueEvent({
        id: `agent-${Date.now()}`,
        timestamp: new Date(),
        type: 'agent_completion',
        data: {
          agent: randomAgent,
          result: 'Task completed successfully',
          processingTime: Math.random() * 10 + 2,
          confidence: 85 + Math.random() * 15,
        },
        synced: false,
        retries: 0,
      });
    }, 30000);

    // Simulate metrics updates every 2 minutes
    setInterval(() => {
      this.queueEvent({
        id: `metrics-${Date.now()}`,
        timestamp: new Date(),
        type: 'metrics_update',
        data: {
          source: 'dashboard',
          metrics: {
            newCustomers: Math.floor(Math.random() * 3),
            revenueChange: (Math.random() - 0.5) * 1000,
            agentSuccessRate: 90 + Math.random() * 10,
          },
        },
        synced: false,
        retries: 0,
      });
    }, 120000);

    // Simulate customer activity every 45 seconds
    setInterval(() => {
      const activities = ['signup', 'campaign_created', 'export_download', 'upgrade'];
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];

      this.queueEvent({
        id: `customer-${Date.now()}`,
        timestamp: new Date(),
        type: 'customer_activity',
        data: {
          activity: randomActivity,
          customerId: `user_${Math.floor(Math.random() * 1000)}`,
          value: randomActivity === 'upgrade' ? 45 : 0,
        },
        synced: false,
        retries: 0,
      });
    }, 45000);
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      setTimeout(() => {
        this.reconnectAttempts++;
        this.initializeWebSocket();
      }, delay);
    }
  }

  private startBackgroundSync(): void {
    // Process sync queue every 10 seconds
    this.syncInterval = setInterval(() => {
      this.processSyncQueue();
    }, 10000);

    console.log('🔄 Real-time Notion sync initialized');
  }

  public queueEvent(event: SyncEvent): void {
    this.events.push(event);
    this.syncQueue.push(event);

    console.log(`📝 Queued ${event.type} event for Notion sync`);

    // If not processing, start immediately for high-priority events
    if (!this.isProcessing && this.shouldSyncImmediately(event)) {
      this.processSyncQueue();
    }
  }

  private shouldSyncImmediately(event: SyncEvent): boolean {
    const immediateSyncTypes = ['agent_completion', 'customer_activity'];
    return immediateSyncTypes.includes(event.type);
  }

  private async processSyncQueue(): Promise<void> {
    if (this.isProcessing || this.syncQueue.length === 0) return;

    this.isProcessing = true;
    const notionService = NotionDashboardService.getInstance();

    if (!notionService.isEnabled()) {
      console.log('⚠️ Notion integration disabled - skipping sync');
      this.isProcessing = false;
      return;
    }

    console.log(`🔄 Processing ${this.syncQueue.length} Notion sync events`);

    const eventsToProcess = [...this.syncQueue];
    this.syncQueue = [];

    for (const event of eventsToProcess) {
      try {
        await this.syncEventToNotion(event);
        event.synced = true;
        console.log(`✅ Synced ${event.type} event to Notion`);
      } catch (error) {
        console.error(`❌ Failed to sync ${event.type} event:`, error);
        event.retries++;

        // Retry failed events with exponential backoff
        if (event.retries < 3) {
          setTimeout(
            () => {
              this.syncQueue.push(event);
            },
            Math.pow(2, event.retries) * 1000
          );
        }
      }
    }

    this.isProcessing = false;
  }

  private async syncEventToNotion(event: SyncEvent): Promise<void> {
    const notionService = NotionDashboardService.getInstance();

    switch (event.type) {
      case 'agent_completion':
        await this.syncAgentCompletion(event);
        break;

      case 'metrics_update':
        await this.syncMetricsUpdate(event);
        break;

      case 'customer_activity':
        await this.syncCustomerActivity(event);
        break;

      case 'development_progress':
        await this.syncDevelopmentProgress(event);
        break;

      default:
        console.warn(`Unknown event type: ${event.type}`);
    }
  }

  private async syncAgentCompletion(event: SyncEvent): Promise<void> {
    // Update Notion with agent completion data
    const { agent, result, processingTime, confidence } = event.data;

    // This would trigger a dashboard metrics update
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'agent_completion',
          data: {
            agent,
            result,
            processingTime,
            confidence,
            timestamp: event.timestamp.toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update analytics');
      }
    } catch (error) {
      console.error('Failed to sync agent completion:', error);
      throw error;
    }
  }

  private async syncMetricsUpdate(event: SyncEvent): Promise<void> {
    // Trigger full metrics sync to Notion
    try {
      const analyticsResponse = await fetch('/api/analytics');
      const analyticsData = await analyticsResponse.json();

      if (analyticsData.success) {
        const response = await fetch('/api/notion-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'sync_metrics',
            data: analyticsData.data,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to sync metrics to Notion');
        }
      }
    } catch (error) {
      console.error('Failed to sync metrics update:', error);
      throw error;
    }
  }

  private async syncCustomerActivity(event: SyncEvent): Promise<void> {
    // Log customer activity and trigger metrics update
    const { activity, customerId, value } = event.data;

    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'customer_activity',
          data: {
            activity,
            customerId,
            value,
            timestamp: event.timestamp.toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to log customer activity');
      }
    } catch (error) {
      console.error('Failed to sync customer activity:', error);
      throw error;
    }
  }

  private async syncDevelopmentProgress(event: SyncEvent): Promise<void> {
    // Update development progress in Notion
    const { feature, progress, status } = event.data;

    // This would update the development milestones in Notion
    console.log(`📊 Development progress: ${feature} is ${progress}% complete`);
  }

  public getQueueStatus(): { pending: number; processing: boolean; totalEvents: number } {
    return {
      pending: this.syncQueue.length,
      processing: this.isProcessing,
      totalEvents: this.events.length,
    };
  }

  public getRecentEvents(limit: number = 10): SyncEvent[] {
    return this.events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  public async forceSyncAll(): Promise<void> {
    console.log('🔄 Force syncing all pending events...');
    await this.processSyncQueue();
  }

  public clearEventHistory(): void {
    this.events = this.events.filter(event => !event.synced);
    console.log('🧹 Cleared synced events from history');
  }

  public destroy(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    console.log('🛑 Real-time Notion sync destroyed');
  }
}

export default NotionRealTimeSync;
