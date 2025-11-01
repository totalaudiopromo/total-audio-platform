import { Client } from '@notionhq/client';

export interface ProgressMetrics {
  mrr: {
    current: number;
    change: number;
    target: number;
    currency: string;
  };
  agentPerformance: {
    totalJobs: number;
    successRate: number;
    avgResponseTime: number;
    uptime: number;
  };
  customerSuccess: {
    totalCustomers: number;
    satisfaction: number;
    retention: number;
    churn: number;
  };
  activeCampaigns: {
    total: number;
    active: number;
    completed: number;
    successRate: number;
  };
  development: {
    velocityScore: number;
    featuresCompleted: number;
    agentDevelopmentProgress: Array<{
      name: string;
      progress: number;
      status: string;
    }>;
  };
}

export interface BusinessMilestone {
  id: string;
  name: string;
  description: string;
  targetValue: number;
  currentValue: number;
  dueDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'at_risk';
  category: 'revenue' | 'product' | 'customers' | 'agents';
}

export class NotionProgressDashboard {
  private notion: Client;
  private dashboardPageId: string;
  private metricsDbId: string = '';
  private milestonesDbId: string = '';
  private reportsDbId: string = '';
  private competitiveDbId: string = '';

  constructor(apiKey: string, dashboardPageId: string) {
    this.notion = new Client({ auth: apiKey });
    this.dashboardPageId = dashboardPageId;
  }

  async initializeDashboard(): Promise<void> {
    try {
      console.log('🚀 Initializing Notion Progress Dashboard...');

      // Create main dashboard databases
      await this.createMetricsDatabase();
      await this.createMilestonesDatabase();
      await this.createReportsDatabase();
      await this.createCompetitiveDatabase();

      // Create initial dashboard page structure
      await this.createDashboardStructure();

      console.log('✅ Notion Progress Dashboard initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Notion dashboard:', error);
      throw error;
    }
  }

  private async createMetricsDatabase(): Promise<void> {
    try {
      console.log('📊 Creating metrics database...');
      const database = await this.notion.databases.create({
        parent: { type: 'page_id', page_id: this.dashboardPageId },
        title: [{ type: 'text', text: { content: 'Daily Progress Metrics' } }],
        properties: {
          Name: { title: {} }, // Required title property
          Date: { date: {} },
          MRR: { number: {} },
          'MRR Change %': { number: {} },
          'Agent Success Rate': { number: {} },
          'Total Jobs': { number: {} },
          'Avg Response Time': { number: {} },
          'System Uptime': { number: {} },
          'Active Customers': { number: {} },
          'Customer Satisfaction': { number: {} },
          'Churn Rate': { number: {} },
          'Active Campaigns': { number: {} },
          'Campaign Success Rate': { number: {} },
          'Development Velocity': { number: {} },
          'Features Completed': { number: {} },
          Status: {
            select: {
              options: [
                { name: 'On Track', color: 'green' },
                { name: 'At Risk', color: 'yellow' },
                { name: 'Critical', color: 'red' },
              ],
            },
          },
        },
      });

      this.metricsDbId = database.id;
      console.log('✅ Metrics database created:', database.id);
    } catch (error) {
      console.error('❌ Failed to create metrics database:', error);
      throw error;
    }
  }

  private async createMilestonesDatabase(): Promise<void> {
    try {
      console.log('🎯 Creating milestones database...');
      const database = await this.notion.databases.create({
        parent: { type: 'page_id', page_id: this.dashboardPageId },
        title: [{ type: 'text', text: { content: 'Business Milestones' } }],
        properties: {
          Name: { title: {} },
          Description: { rich_text: {} },
          Category: {
            select: {
              options: [
                { name: 'Revenue', color: 'green' },
                { name: 'Product', color: 'blue' },
                { name: 'Customers', color: 'purple' },
                { name: 'Agents', color: 'orange' },
              ],
            },
          },
          'Target Value': { number: {} },
          'Current Value': { number: {} },
          Progress: { formula: { expression: 'prop("Current Value") / prop("Target Value")' } },
          'Due Date': { date: {} },
          Status: {
            select: {
              options: [
                { name: 'Not Started', color: 'gray' },
                { name: 'In Progress', color: 'blue' },
                { name: 'Completed', color: 'green' },
                { name: 'At Risk', color: 'red' },
              ],
            },
          },
          Priority: {
            select: {
              options: [
                { name: 'High', color: 'red' },
                { name: 'Medium', color: 'yellow' },
                { name: 'Low', color: 'gray' },
              ],
            },
          },
        },
      });

      this.milestonesDbId = database.id;
      console.log('✅ Milestones database created:', database.id);
    } catch (error) {
      console.error('❌ Failed to create milestones database:', error);
      throw error;
    }
  }

  private async createReportsDatabase(): Promise<void> {
    try {
      console.log('📋 Creating reports database...');
      const database = await this.notion.databases.create({
        parent: { type: 'page_id', page_id: this.dashboardPageId },
        title: [{ type: 'text', text: { content: 'Automated Reports' } }],
        properties: {
          Name: { title: {} }, // Required title property
          'Report Type': {
            select: {
              options: [
                { name: 'Daily Summary', color: 'blue' },
                { name: 'Weekly Progress', color: 'green' },
                { name: 'Monthly Review', color: 'purple' },
                { name: 'Quarterly Planning', color: 'orange' },
                { name: 'Annual Goal Tracking', color: 'red' },
              ],
            },
          },
          'Generated Date': { date: {} },
          'Data Period': { rich_text: {} },
          'Key Insights': { rich_text: {} },
          'Action Items': { rich_text: {} },
          Status: {
            select: {
              options: [
                { name: 'Generated', color: 'blue' },
                { name: 'Reviewed', color: 'green' },
                { name: 'Action Taken', color: 'purple' },
              ],
            },
          },
        },
      });

      this.reportsDbId = database.id;
      console.log('✅ Reports database created:', database.id);
    } catch (error) {
      console.error('❌ Failed to create reports database:', error);
      throw error;
    }
  }

  private async createCompetitiveDatabase(): Promise<void> {
    try {
      console.log('🔍 Creating competitive intelligence database...');
      const database = await this.notion.databases.create({
        parent: { type: 'page_id', page_id: this.dashboardPageId },
        title: [{ type: 'text', text: { content: 'Competitive Intelligence' } }],
        properties: {
          Name: { title: {} }, // Required title property
          'Market Position': {
            select: {
              options: [
                { name: 'Leader', color: 'red' },
                { name: 'Challenger', color: 'orange' },
                { name: 'Follower', color: 'blue' },
                { name: 'Niche', color: 'green' },
              ],
            },
          },
          'Pricing Model': { rich_text: {} },
          'Key Features': { rich_text: {} },
          'Market Share %': { number: {} },
          'Customer Base': { number: {} },
          'Last Updated': { date: {} },
          'Strategic Impact': {
            select: {
              options: [
                { name: 'High', color: 'red' },
                { name: 'Medium', color: 'yellow' },
                { name: 'Low', color: 'gray' },
              ],
            },
          },
        },
      });

      this.competitiveDbId = database.id;
      console.log('✅ Competitive intelligence database created:', database.id);
    } catch (error) {
      console.error('❌ Failed to create competitive database:', error);
      throw error;
    }
  }

  private async createDashboardStructure(): Promise<void> {
    try {
      console.log('🏗️ Creating dashboard structure...');
      // Create a simple welcome message on the dashboard page
      await this.notion.blocks.children.append({
        block_id: this.dashboardPageId,
        children: [
          {
            type: 'heading_1',
            heading_1: {
              rich_text: [{ type: 'text', text: { content: '🎯 Total Audio Progress Dashboard' } }],
            },
          },
          {
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content:
                      'Real-time progress tracking toward £100K MRR and complete agent army development. Last updated: ',
                  },
                },
                {
                  type: 'text',
                  text: { content: new Date().toISOString().split('T')[0] },
                  annotations: { bold: true },
                },
              ],
            },
          },
          {
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content:
                      '✅ Dashboard databases created successfully! Check the databases above for detailed metrics and milestones.',
                  },
                },
              ],
            },
          },
        ],
      });

      console.log('✅ Dashboard structure created successfully');
    } catch (error) {
      console.error('⚠️ Could not create dashboard structure (this is optional):', error);
      // Don't throw error - this is not critical for functionality
    }
  }

  async updateDailyMetrics(metrics: ProgressMetrics): Promise<void> {
    try {
      // Calculate overall status
      const status = this.calculateOverallStatus(metrics);

      // Create daily metrics entry
      await this.notion.pages.create({
        parent: { database_id: this.metricsDbId },
        properties: {
          Name: {
            title: [{ type: 'text', text: { content: new Date().toISOString().split('T')[0] } }],
          },
          Date: { date: { start: new Date().toISOString().split('T')[0] } },
          MRR: { number: metrics.mrr.current },
          'MRR Change %': { number: metrics.mrr.change / 100 },
          'Agent Success Rate': { number: metrics.agentPerformance.successRate / 100 },
          'Total Jobs': { number: metrics.agentPerformance.totalJobs },
          'Avg Response Time': { number: metrics.agentPerformance.avgResponseTime },
          'System Uptime': { number: metrics.agentPerformance.uptime / 100 },
          'Active Customers': { number: metrics.customerSuccess.totalCustomers },
          'Customer Satisfaction': { number: metrics.customerSuccess.satisfaction },
          'Churn Rate': { number: metrics.customerSuccess.churn / 100 },
          'Active Campaigns': { number: metrics.activeCampaigns.active },
          'Campaign Success Rate': { number: metrics.activeCampaigns.successRate / 100 },
          'Development Velocity': { number: metrics.development.velocityScore },
          'Features Completed': { number: metrics.development.featuresCompleted },
          Status: { select: { name: status } },
        },
      });

      // Update main dashboard callouts
      await this.updateDashboardCallouts(metrics);

      console.log('✅ Daily metrics updated in Notion');
    } catch (error) {
      console.error('❌ Failed to update daily metrics:', error);
      throw error;
    }
  }

  private calculateOverallStatus(metrics: ProgressMetrics): string {
    const mrrProgress = metrics.mrr.current / metrics.mrr.target;
    const agentSuccess = metrics.agentPerformance.successRate;
    const customerSat = metrics.customerSuccess.satisfaction;

    // Calculate composite health score
    const healthScore = (mrrProgress * 0.4 + agentSuccess * 0.3 + customerSat * 0.3) / 100;

    if (healthScore >= 0.8) return 'On Track';
    if (healthScore >= 0.6) return 'At Risk';
    return 'Critical';
  }

  private async updateDashboardCallouts(metrics: ProgressMetrics): Promise<void> {
    // This would update the callout blocks on the main dashboard page
    // Implementation depends on finding and updating existing blocks
    const mrrProgress = (metrics.mrr.current / metrics.mrr.target) * 100;
    const agentProgress =
      metrics.development.agentDevelopmentProgress.reduce((avg, agent) => avg + agent.progress, 0) /
      metrics.development.agentDevelopmentProgress.length;

    console.log(`📊 MRR Progress: ${mrrProgress.toFixed(1)}%`);
    console.log(`🤖 Agent Development: ${agentProgress.toFixed(1)}%`);
    console.log(`👥 Active Customers: ${metrics.customerSuccess.totalCustomers}`);
  }

  async createBusinessMilestone(milestone: BusinessMilestone): Promise<void> {
    try {
      await this.notion.pages.create({
        parent: { database_id: this.milestonesDbId },
        properties: {
          Name: { title: [{ type: 'text', text: { content: milestone.name } }] },
          Description: { rich_text: [{ type: 'text', text: { content: milestone.description } }] },
          Category: {
            select: {
              name:
                milestone.category === 'revenue'
                  ? 'Revenue'
                  : milestone.category === 'product'
                    ? 'Product'
                    : milestone.category === 'customers'
                      ? 'Customers'
                      : 'Agents',
            },
          },
          'Target Value': { number: milestone.targetValue },
          'Current Value': { number: milestone.currentValue },
          'Due Date': { date: { start: milestone.dueDate } },
          Status: {
            select: {
              name:
                milestone.status === 'not_started'
                  ? 'Not Started'
                  : milestone.status === 'in_progress'
                    ? 'In Progress'
                    : milestone.status === 'completed'
                      ? 'Completed'
                      : 'At Risk',
            },
          },
          Priority: { select: { name: 'High' } },
        },
      });

      console.log(`✅ Business milestone created: ${milestone.name}`);
    } catch (error) {
      console.error('❌ Failed to create business milestone:', error);
      throw error;
    }
  }

  async generateWeeklyReport(
    metrics: ProgressMetrics,
    weekStart: string,
    weekEnd: string
  ): Promise<void> {
    try {
      const insights = this.generateWeeklyInsights(metrics);
      const actionItems = this.generateWeeklyActionItems(metrics);

      await this.notion.pages.create({
        parent: { database_id: this.reportsDbId },
        properties: {
          Name: {
            title: [
              {
                type: 'text',
                text: { content: `Weekly Progress Report - ${weekStart} to ${weekEnd}` },
              },
            ],
          },
          'Report Type': { select: { name: 'Weekly Progress' } },
          'Generated Date': { date: { start: new Date().toISOString().split('T')[0] } },
          'Data Period': {
            rich_text: [{ type: 'text', text: { content: `${weekStart} - ${weekEnd}` } }],
          },
          'Key Insights': { rich_text: [{ type: 'text', text: { content: insights } }] },
          'Action Items': { rich_text: [{ type: 'text', text: { content: actionItems } }] },
          Status: { select: { name: 'Generated' } },
        },
      });

      console.log('✅ Weekly report generated in Notion');
    } catch (error) {
      console.error('❌ Failed to generate weekly report:', error);
      throw error;
    }
  }

  async generateMonthlyReport(metrics: ProgressMetrics, month: string): Promise<void> {
    try {
      const insights = this.generateMonthlyInsights(metrics);
      const actionItems = this.generateMonthlyActionItems(metrics);

      await this.notion.pages.create({
        parent: { database_id: this.reportsDbId },
        properties: {
          Name: {
            title: [{ type: 'text', text: { content: `Monthly Business Review - ${month}` } }],
          },
          'Report Type': { select: { name: 'Monthly Review' } },
          'Generated Date': { date: { start: new Date().toISOString().split('T')[0] } },
          'Data Period': { rich_text: [{ type: 'text', text: { content: month } }] },
          'Key Insights': { rich_text: [{ type: 'text', text: { content: insights } }] },
          'Action Items': { rich_text: [{ type: 'text', text: { content: actionItems } }] },
          Status: { select: { name: 'Generated' } },
        },
      });

      console.log('✅ Monthly report generated in Notion');
    } catch (error) {
      console.error('❌ Failed to generate monthly report:', error);
      throw error;
    }
  }

  async generateQuarterlyReport(metrics: ProgressMetrics, quarter: string): Promise<void> {
    try {
      const insights = this.generateQuarterlyInsights(metrics);
      const actionItems = this.generateQuarterlyActionItems(metrics);

      await this.notion.pages.create({
        parent: { database_id: this.reportsDbId },
        properties: {
          Name: {
            title: [{ type: 'text', text: { content: `Quarterly Strategic Review - ${quarter}` } }],
          },
          'Report Type': { select: { name: 'Quarterly Planning' } },
          'Generated Date': { date: { start: new Date().toISOString().split('T')[0] } },
          'Data Period': { rich_text: [{ type: 'text', text: { content: quarter } }] },
          'Key Insights': { rich_text: [{ type: 'text', text: { content: insights } }] },
          'Action Items': { rich_text: [{ type: 'text', text: { content: actionItems } }] },
          Status: { select: { name: 'Generated' } },
        },
      });

      console.log('✅ Quarterly report generated in Notion');
    } catch (error) {
      console.error('❌ Failed to generate quarterly report:', error);
      throw error;
    }
  }

  async updateCompetitiveIntelligence(competitor: string, data: any): Promise<void> {
    try {
      await this.notion.pages.create({
        parent: { database_id: this.competitiveDbId },
        properties: {
          Name: { title: [{ type: 'text', text: { content: competitor } }] },
          Competitor: { title: [{ type: 'text', text: { content: competitor } }] },
          'Market Position': { select: { name: data.marketPosition || 'Follower' } },
          'Pricing Model': {
            rich_text: [{ type: 'text', text: { content: data.pricingModel || 'Unknown' } }],
          },
          'Key Features': {
            rich_text: [{ type: 'text', text: { content: data.keyFeatures || 'Analyzing...' } }],
          },
          'Market Share %': { number: data.marketShare || 0 },
          'Customer Base': { number: data.customerBase || 0 },
          'Last Updated': { date: { start: new Date().toISOString().split('T')[0] } },
          'Strategic Impact': { select: { name: data.strategicImpact || 'Medium' } },
        },
      });

      console.log(`✅ Competitive intelligence updated for: ${competitor}`);
    } catch (error) {
      console.error('❌ Failed to update competitive intelligence:', error);
      throw error;
    }
  }

  private generateWeeklyInsights(metrics: ProgressMetrics): string {
    const insights = [
      `MRR: ${metrics.mrr.currency}${metrics.mrr.current.toLocaleString()} (${metrics.mrr.change > 0 ? '+' : ''}${metrics.mrr.change}% change)`,
      `Agent Performance: ${metrics.agentPerformance.successRate}% success rate across ${metrics.agentPerformance.totalJobs} jobs`,
      `Customer Success: ${metrics.customerSuccess.totalCustomers} active customers with ${metrics.customerSuccess.satisfaction}/5 satisfaction`,
      `Development Velocity: ${metrics.development.velocityScore} points, ${metrics.development.featuresCompleted} features completed`,
    ];
    return insights.join('\n');
  }

  private generateWeeklyActionItems(metrics: ProgressMetrics): string {
    const actions = [];

    if (metrics.mrr.change < 5) {
      actions.push('🔴 URGENT: MRR growth below target - review pricing and customer acquisition');
    }

    if (metrics.agentPerformance.successRate < 90) {
      actions.push('🟡 Agent optimization needed - investigate failure patterns');
    }

    if (metrics.customerSuccess.churn > 5) {
      actions.push('🔴 High churn alert - implement retention strategy');
    }

    if (metrics.development.velocityScore < 80) {
      actions.push('🟡 Development velocity low - review sprint planning');
    }

    return actions.length > 0
      ? actions.join('\n')
      : '✅ All metrics on track - continue current strategy';
  }

  private generateMonthlyInsights(metrics: ProgressMetrics): string {
    const targetProgress = (metrics.mrr.current / metrics.mrr.target) * 100;
    return `Monthly Progress Summary:
    
📈 Revenue Progress: ${targetProgress.toFixed(1)}% toward £100K MRR target
🤖 Agent Army: ${metrics.agentPerformance.successRate}% operational efficiency
👥 Customer Growth: ${metrics.customerSuccess.totalCustomers} active customers
📊 Product Development: ${metrics.development.featuresCompleted} features shipped

Key Trends:
- MRR Growth Rate: ${metrics.mrr.change}% month-over-month
- Customer Satisfaction: ${metrics.customerSuccess.satisfaction}/5.0 average rating
- System Reliability: ${metrics.agentPerformance.uptime}% uptime maintained
- Campaign Success: ${metrics.activeCampaigns.successRate}% success rate`;
  }

  private generateMonthlyActionItems(metrics: ProgressMetrics): string {
    const targetProgress = (metrics.mrr.current / metrics.mrr.target) * 100;
    const actions = [
      `Review and optimize pricing strategy for ${targetProgress < 10 ? 'aggressive' : 'steady'} growth`,
      'Analyze customer feedback and implement top 3 requested features',
      'Conduct competitive analysis and adjust positioning',
      "Plan next month's agent development priorities",
    ];

    if (targetProgress < 25) {
      actions.unshift('🚨 CRITICAL: Accelerate customer acquisition - MRR behind target');
    }

    return actions.join('\n');
  }

  private generateQuarterlyInsights(metrics: ProgressMetrics): string {
    return `Quarterly Strategic Review:
    
🎯 Goal Progress: ${((metrics.mrr.current / metrics.mrr.target) * 100).toFixed(1)}% toward annual £100K MRR target
🚀 Product Evolution: ${metrics.development.agentDevelopmentProgress.length} agents in development pipeline
📊 Market Position: Analyzing competitive landscape and customer feedback
💡 Innovation Focus: AI-driven automation and customer success optimization

Strategic Recommendations:
1. Double down on highest-performing customer segments
2. Accelerate agent development for competitive differentiation
3. Implement advanced analytics for predictive customer success
4. Expand market reach through strategic partnerships`;
  }

  private generateQuarterlyActionItems(metrics: ProgressMetrics): string {
    return `Quarterly Action Plan:
    
🎯 Revenue Strategy:
- Launch premium tier targeting enterprise customers
- Implement referral program for organic growth
- Optimize conversion funnel based on analytics

🤖 Product Development:
- Complete remaining agent integrations
- Implement advanced AI features
- Launch customer self-service portal

📈 Market Expansion:
- Enter 2 new market segments
- Establish strategic partnerships
- Launch comprehensive marketing campaign

📊 Operations:
- Implement advanced monitoring and alerting
- Optimize customer onboarding process
- Establish customer success playbooks`;
  }
}

export default NotionProgressDashboard;
