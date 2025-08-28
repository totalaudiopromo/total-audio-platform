import NotionProgressDashboard, { ProgressMetrics, BusinessMilestone } from './notionProgressDashboard';

export interface NotionConfig {
  apiKey: string;
  dashboardPageId: string;
  enabled: boolean;
}

export class NotionDashboardService {
  private static instance: NotionDashboardService;
  private dashboard: NotionProgressDashboard | null = null;
  private config: NotionConfig;
  private syncInterval: any = null;

  private constructor() {
    this.config = {
      apiKey: process.env.NOTION_API_KEY || '',
      dashboardPageId: process.env.NOTION_DASHBOARD_PAGE_ID || '',
      enabled: process.env.NOTION_INTEGRATION_ENABLED === 'true'
    };

    if (this.config.enabled && this.config.apiKey && this.config.dashboardPageId) {
      this.dashboard = new NotionProgressDashboard(this.config.apiKey, this.config.dashboardPageId);
    }
  }

  static getInstance(): NotionDashboardService {
    if (!NotionDashboardService.instance) {
      NotionDashboardService.instance = new NotionDashboardService();
    }
    return NotionDashboardService.instance;
  }

  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      console.log('⚠️ Notion integration disabled');
      return;
    }

    if (!this.dashboard) {
      throw new Error('Notion dashboard not configured - check API key and page ID');
    }

    try {
      await this.dashboard.initializeDashboard();
      await this.createInitialMilestones();
      this.startAutoSync();
      console.log('✅ Notion Dashboard Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Notion dashboard:', error);
      throw error;
    }
  }

  private async createInitialMilestones(): Promise<void> {
    if (!this.dashboard) return;

    const milestones: BusinessMilestone[] = [
      {
        id: '1',
        name: 'Reach £10K MRR',
        description: 'First major revenue milestone - validates market fit and scalability',
        targetValue: 10000,
        currentValue: 0,
        dueDate: '2025-03-31',
        status: 'in_progress',
        category: 'revenue'
      },
      {
        id: '2',
        name: 'Complete Agent Army (10 Agents)',
        description: 'Deploy full suite of AI agents for comprehensive music promotion automation',
        targetValue: 10,
        currentValue: 5,
        dueDate: '2025-06-30',
        status: 'in_progress',
        category: 'agents'
      },
      {
        id: '3',
        name: 'Reach £50K MRR',
        description: 'Scale to significant revenue milestone demonstrating product-market fit',
        targetValue: 50000,
        currentValue: 0,
        dueDate: '2025-09-30',
        status: 'not_started',
        category: 'revenue'
      },
      {
        id: '4',
        name: 'Achieve £100K MRR',
        description: 'Ultimate goal - establish Total Audio Promo as market leader',
        targetValue: 100000,
        currentValue: 0,
        dueDate: '2025-12-31',
        status: 'not_started',
        category: 'revenue'
      },
      {
        id: '5',
        name: '1000+ Active Customers',
        description: 'Build substantial customer base across artists and agencies',
        targetValue: 1000,
        currentValue: 0,
        dueDate: '2025-12-31',
        status: 'not_started',
        category: 'customers'
      },
      {
        id: '6',
        name: 'Advanced Analytics Platform',
        description: 'Launch comprehensive analytics and reporting platform',
        targetValue: 1,
        currentValue: 0.7,
        dueDate: '2025-04-30',
        status: 'in_progress',
        category: 'product'
      }
    ];

    for (const milestone of milestones) {
      try {
        await this.dashboard.createBusinessMilestone(milestone);
        console.log(`📋 Created milestone: ${milestone.name}`);
      } catch (error) {
        console.error(`❌ Failed to create milestone ${milestone.name}:`, error);
      }
    }
  }

  async syncDashboardMetrics(realMetrics: any): Promise<void> {
    if (!this.config.enabled || !this.dashboard) {
      return;
    }

    try {
      // Transform real dashboard data to Notion format
      const progressMetrics: ProgressMetrics = {
        mrr: {
          current: realMetrics.mrr.current || 0,
          change: realMetrics.mrr.change || 0,
          target: 100000, // £100K target
          currency: realMetrics.mrr.currency || 'GBP'
        },
        agentPerformance: {
          totalJobs: realMetrics.agentPerformance.totalJobs || 0,
          successRate: realMetrics.agentPerformance.successRate || 0,
          avgResponseTime: realMetrics.agentPerformance.avgResponseTime || 0,
          uptime: realMetrics.agentPerformance.uptime || 0
        },
        customerSuccess: {
          totalCustomers: realMetrics.customerSuccess.totalCustomers || 0,
          satisfaction: realMetrics.customerSuccess.satisfaction || 0,
          retention: realMetrics.customerSuccess.retention || 0,
          churn: realMetrics.customerSuccess.churn || 0
        },
        activeCampaigns: {
          total: realMetrics.activeCampaigns.total || 0,
          active: realMetrics.activeCampaigns.active || 0,
          completed: realMetrics.activeCampaigns.completed || 0,
          successRate: realMetrics.activeCampaigns.successRate || 0
        },
        development: {
          velocityScore: this.calculateVelocityScore(realMetrics),
          featuresCompleted: this.calculateFeaturesCompleted(realMetrics),
          agentDevelopmentProgress: [
            { name: 'Intel Research Agent', progress: 100, status: 'completed' },
            { name: 'Content Creation Agent', progress: 85, status: 'in_progress' },
            { name: 'Campaign Planner Agent', progress: 70, status: 'in_progress' },
            { name: 'Performance Monitor Agent', progress: 90, status: 'in_progress' },
            { name: 'Playlist Curator Agent', progress: 60, status: 'in_progress' },
            { name: 'Orchestrator Agent', progress: 80, status: 'in_progress' },
            { name: 'Social Media Agent', progress: 30, status: 'planned' },
            { name: 'Email Campaign Agent', progress: 25, status: 'planned' },
            { name: 'Analytics Agent', progress: 75, status: 'in_progress' },
            { name: 'Customer Success Agent', progress: 15, status: 'planned' }
          ]
        }
      };

      await this.dashboard.updateDailyMetrics(progressMetrics);
      console.log('✅ Dashboard metrics synced to Notion');
    } catch (error) {
      console.error('❌ Failed to sync dashboard metrics:', error);
    }
  }

  private calculateVelocityScore(metrics: any): number {
    // Calculate development velocity based on agent performance and system metrics
    const baseScore = 80;
    const performanceBonus = (metrics.agentPerformance?.successRate || 80) - 80;
    const uptimeBonus = ((metrics.agentPerformance?.uptime || 99) - 95) * 2;
    
    return Math.max(0, Math.min(100, baseScore + performanceBonus + uptimeBonus));
  }

  private calculateFeaturesCompleted(metrics: any): number {
    // Estimate features completed based on system functionality
    const baseFeatures = 25; // Current implemented features
    const agentFeatures = 5; // Features per agent completed
    const completedAgents = 5; // Currently deployed agents
    
    return baseFeatures + (agentFeatures * completedAgents);
  }

  private startAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    // Sync every hour during business hours
    this.syncInterval = setInterval(async () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Only sync during business hours (9 AM - 6 PM UK time)
      if (hour >= 9 && hour <= 18) {
        try {
          // Fetch current metrics from the real dashboard
          const response = await fetch('/api/analytics');
          if (response.ok) {
            const metrics = await response.json();
            await this.syncDashboardMetrics(metrics.data);
          }
        } catch (error) {
          console.error('❌ Auto-sync failed:', error);
        }
      }
    }, 60 * 60 * 1000); // 1 hour

    console.log('🔄 Auto-sync started - hourly updates during business hours');
  }

  async generateScheduledReports(): Promise<void> {
    if (!this.config.enabled || !this.dashboard) return;

    const now = new Date();
    const dayOfWeek = now.getDay();
    const dayOfMonth = now.getDate();

    try {
      // Fetch current metrics for reports
      const response = await fetch('/api/analytics');
      const metricsData = response.ok ? await response.json() : null;
      
      if (!metricsData?.data) {
        console.log('⚠️ No metrics data available for reports');
        return;
      }

      const progressMetrics: ProgressMetrics = {
        mrr: metricsData.data.mrr || { current: 0, change: 0, target: 100000, currency: 'GBP' },
        agentPerformance: metricsData.data.agentPerformance || { totalJobs: 0, successRate: 0, avgResponseTime: 0, uptime: 0 },
        customerSuccess: metricsData.data.customerSuccess || { totalCustomers: 0, satisfaction: 0, retention: 0, churn: 0 },
        activeCampaigns: metricsData.data.activeCampaigns || { total: 0, active: 0, completed: 0, successRate: 0 },
        development: {
          velocityScore: this.calculateVelocityScore(metricsData.data),
          featuresCompleted: this.calculateFeaturesCompleted(metricsData.data),
          agentDevelopmentProgress: []
        }
      };

      // Weekly report on Mondays
      if (dayOfWeek === 1) {
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const weekEnd = now.toISOString().split('T')[0];
        await this.dashboard.generateWeeklyReport(progressMetrics, weekStart, weekEnd);
      }

      // Monthly report on 1st of month
      if (dayOfMonth === 1) {
        const month = new Date(now.getFullYear(), now.getMonth() - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        await this.dashboard.generateMonthlyReport(progressMetrics, month);
      }

      // Quarterly report on 1st of Jan, Apr, Jul, Oct
      if (dayOfMonth === 1 && [0, 3, 6, 9].includes(now.getMonth())) {
        const quarter = `Q${Math.floor(now.getMonth() / 3) + 1} ${now.getFullYear()}`;
        await this.dashboard.generateQuarterlyReport(progressMetrics, quarter);
      }
    } catch (error) {
      console.error('❌ Failed to generate scheduled reports:', error);
    }
  }

  async addCustomMilestone(milestone: BusinessMilestone): Promise<void> {
    if (!this.config.enabled || !this.dashboard) return;

    try {
      await this.dashboard.createBusinessMilestone(milestone);
      console.log(`✅ Custom milestone added: ${milestone.name}`);
    } catch (error) {
      console.error('❌ Failed to add custom milestone:', error);
      throw error;
    }
  }

  async updateCompetitor(competitor: string, data: any): Promise<void> {
    if (!this.config.enabled || !this.dashboard) return;

    try {
      await this.dashboard.updateCompetitiveIntelligence(competitor, data);
      console.log(`✅ Competitor data updated: ${competitor}`);
    } catch (error) {
      console.error('❌ Failed to update competitor data:', error);
    }
  }

  getConfig(): NotionConfig {
    return { ...this.config };
  }

  isEnabled(): boolean {
    return this.config.enabled && !!this.dashboard;
  }

  async stopAutoSync(): Promise<void> {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('⏹️ Auto-sync stopped');
    }
  }
}

export default NotionDashboardService;