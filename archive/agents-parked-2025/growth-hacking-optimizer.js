#!/usr/bin/env node

/**
 * Growth Hacking Optimizer Agent for Total Audio Promo
 *
 * Specialized agent for SaaS growth, conversion optimization, A/B testing, and retention strategies
 * Focuses on rapid user acquisition, funnel optimization, and sustainable growth engines
 */

const { PrismaClient } = require('@prisma/client');

// Simple logger fallback
const logger = {
  info: (msg, ...args) => console.log(`[INFO] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[ERROR] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[WARN] ${msg}`, ...args),
};

class GrowthHackingOptimizer {
  constructor() {
    this.name = 'GrowthHackingOptimizer';
    this.prisma = new PrismaClient();
    this.metrics = {
      experimentsRun: 0,
      conversionsOptimized: 0,
      growthStrategiesImplemented: 0,
      usersAnalyzed: 0,
    };
  }

  /**
   * Initialize the growth hacking optimizer
   */
  async initialize() {
    try {
      await this.prisma.$connect();
      logger.info(`${this.name} initialized successfully`);
      return true;
    } catch (error) {
      logger.error(`${this.name} initialization failed:`, error);
      return false;
    }
  }

  /**
   * Analyze user acquisition funnel and identify bottlenecks
   */
  async analyzeFunnel(agencyId = null) {
    try {
      logger.info('Analyzing user acquisition funnel...');

      const whereClause = agencyId ? { agencyId } : {};

      // Get funnel data
      const totalVisitors = await this.getWebsiteVisitors(whereClause);
      const signups = await this.prisma.user.count({ where: whereClause });
      const activatedUsers = await this.prisma.user.count({
        where: { ...whereClause, isActivated: true },
      });
      const paidUsers = await this.prisma.user.count({
        where: { ...whereClause, subscriptionStatus: 'active' },
      });

      // Calculate conversion rates
      const signupRate = totalVisitors > 0 ? ((signups / totalVisitors) * 100).toFixed(2) : 0;
      const activationRate = signups > 0 ? ((activatedUsers / signups) * 100).toFixed(2) : 0;
      const conversionRate =
        activatedUsers > 0 ? ((paidUsers / activatedUsers) * 100).toFixed(2) : 0;

      const funnelAnalysis = {
        visitors: totalVisitors,
        signups,
        activatedUsers,
        paidUsers,
        conversionRates: {
          visitorToSignup: parseFloat(signupRate),
          signupToActivation: parseFloat(activationRate),
          activationToPaid: parseFloat(conversionRate),
        },
        bottlenecks: this.identifyBottlenecks({
          signupRate: parseFloat(signupRate),
          activationRate: parseFloat(activationRate),
          conversionRate: parseFloat(conversionRate),
        }),
        recommendations: await this.generateFunnelRecommendations({
          signupRate: parseFloat(signupRate),
          activationRate: parseFloat(activationRate),
          conversionRate: parseFloat(conversionRate),
        }),
      };

      logger.info('Funnel analysis completed');
      return funnelAnalysis;
    } catch (error) {
      logger.error('Funnel analysis failed:', error);
      throw error;
    }
  }

  /**
   * Get website visitors count (placeholder for analytics integration)
   */
  async getWebsiteVisitors(whereClause) {
    // This would integrate with Google Analytics or similar
    // For now, using signups * 20 as estimate (5% conversion rate)
    const signups = await this.prisma.user.count({ where: whereClause });
    return signups * 20;
  }

  /**
   * Identify bottlenecks in the conversion funnel
   */
  identifyBottlenecks(rates) {
    const bottlenecks = [];

    if (rates.signupRate < 3) {
      bottlenecks.push({
        stage: 'visitor_to_signup',
        issue: 'Low signup conversion rate',
        impact: 'high',
        recommendation: 'Optimize landing page, improve value proposition',
      });
    }

    if (rates.activationRate < 40) {
      bottlenecks.push({
        stage: 'signup_to_activation',
        issue: 'Poor user activation',
        impact: 'high',
        recommendation: 'Improve onboarding flow, reduce time to first value',
      });
    }

    if (rates.conversionRate < 15) {
      bottlenecks.push({
        stage: 'activation_to_paid',
        issue: 'Low paid conversion',
        impact: 'medium',
        recommendation: 'Optimize pricing strategy, improve trial experience',
      });
    }

    return bottlenecks;
  }

  /**
   * Generate funnel optimization recommendations
   */
  async generateFunnelRecommendations(rates) {
    const recommendations = [];

    // Landing page optimization
    if (rates.signupRate < 5) {
      recommendations.push({
        category: 'landing_page',
        priority: 'high',
        title: 'Optimize Landing Page Conversion',
        description: 'Current signup rate is below industry average',
        actions: [
          'A/B test headlines and value propositions',
          'Simplify signup form (reduce fields)',
          'Add social proof (testimonials, user count)',
          'Improve mobile responsiveness',
        ],
        expectedImpact: '20-40% increase in signup rate',
      });
    }

    // Onboarding optimization
    if (rates.activationRate < 50) {
      recommendations.push({
        category: 'onboarding',
        priority: 'high',
        title: 'Improve User Onboarding',
        description: 'Users are not completing activation flow',
        actions: [
          'Reduce time to first value (quick wins)',
          'Add progress indicators in onboarding',
          'Implement welcome email sequence',
          'Create interactive tutorials',
        ],
        expectedImpact: '30-50% increase in activation rate',
      });
    }

    // Pricing optimization
    if (rates.conversionRate < 20) {
      recommendations.push({
        category: 'pricing',
        priority: 'medium',
        title: 'Optimize Pricing Strategy',
        description: 'Trial to paid conversion needs improvement',
        actions: [
          'A/B test different pricing tiers',
          'Extend trial period with usage limits',
          'Add freemium tier option',
          'Implement usage-based pricing',
        ],
        expectedImpact: '15-25% increase in conversion rate',
      });
    }

    return recommendations;
  }

  /**
   * Create and run A/B test experiment
   */
  async createExperiment(experimentData) {
    try {
      logger.info(`Creating A/B test experiment: ${experimentData.name}`);

      const experiment = await this.prisma.experiment.create({
        data: {
          name: experimentData.name,
          hypothesis: experimentData.hypothesis,
          variants: JSON.stringify(experimentData.variants),
          trafficAllocation: experimentData.trafficAllocation || 50,
          startDate: new Date(),
          endDate: experimentData.duration
            ? new Date(Date.now() + experimentData.duration * 24 * 60 * 60 * 1000)
            : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Default 14 days
          status: 'active',
          metrics: JSON.stringify(experimentData.metrics || ['conversion_rate', 'signup_rate']),
          targetSegment: experimentData.targetSegment || 'all_users',
          significance: experimentData.significance || 0.95,
        },
      });

      this.metrics.experimentsRun++;
      logger.info(`Experiment created: ${experiment.id}`);

      return experiment;
    } catch (error) {
      logger.error('Experiment creation failed:', error);
      throw error;
    }
  }

  /**
   * Analyze experiment results and determine statistical significance
   */
  async analyzeExperiment(experimentId) {
    try {
      const experiment = await this.prisma.experiment.findUnique({
        where: { id: experimentId },
        include: { results: true },
      });

      if (!experiment) {
        throw new Error(`Experiment ${experimentId} not found`);
      }

      const variants = JSON.parse(experiment.variants);
      const results = experiment.results || [];

      // Calculate results for each variant
      const analysis = variants.map(variant => {
        const variantResults = results.filter(r => r.variant === variant.name);
        const conversions = variantResults.filter(r => r.converted).length;
        const total = variantResults.length;
        const conversionRate = total > 0 ? ((conversions / total) * 100).toFixed(2) : 0;

        return {
          variant: variant.name,
          participants: total,
          conversions,
          conversionRate: parseFloat(conversionRate),
          confidenceInterval: this.calculateConfidenceInterval(conversions, total),
        };
      });

      // Determine statistical significance
      const significance = this.calculateStatisticalSignificance(analysis);

      // Generate recommendations
      const recommendations = this.generateExperimentRecommendations(analysis, significance);

      const experimentAnalysis = {
        experiment: {
          id: experiment.id,
          name: experiment.name,
          hypothesis: experiment.hypothesis,
          status: experiment.status,
          duration: Math.floor(
            (new Date() - new Date(experiment.startDate)) / (1000 * 60 * 60 * 24)
          ),
        },
        results: analysis,
        significance,
        recommendations,
        conclusion: significance.isSignificant
          ? `Variant ${significance.winner} is statistically significant winner`
          : 'No statistically significant difference found',
        nextSteps: this.generateNextSteps(analysis, significance),
      };

      logger.info(`Experiment analysis completed for ${experimentId}`);
      return experimentAnalysis;
    } catch (error) {
      logger.error('Experiment analysis failed:', error);
      throw error;
    }
  }

  /**
   * Calculate confidence interval for conversion rate
   */
  calculateConfidenceInterval(conversions, total, confidence = 0.95) {
    if (total === 0) return { lower: 0, upper: 0 };

    const rate = conversions / total;
    const z = 1.96; // 95% confidence
    const margin = z * Math.sqrt((rate * (1 - rate)) / total);

    return {
      lower: Math.max(0, (rate - margin) * 100).toFixed(2),
      upper: Math.min(100, (rate + margin) * 100).toFixed(2),
    };
  }

  /**
   * Calculate statistical significance between variants
   */
  calculateStatisticalSignificance(analysis) {
    if (analysis.length < 2) {
      return { isSignificant: false, winner: null, pValue: null };
    }

    // Simple two-proportion z-test
    const control = analysis[0];
    const variant = analysis[1];

    if (control.participants === 0 || variant.participants === 0) {
      return { isSignificant: false, winner: null, pValue: null };
    }

    const p1 = control.conversions / control.participants;
    const p2 = variant.conversions / variant.participants;
    const n1 = control.participants;
    const n2 = variant.participants;

    const pooledP = (control.conversions + variant.conversions) / (n1 + n2);
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1 / n1 + 1 / n2));
    const z = Math.abs(p1 - p2) / se;

    // p-value approximation
    const pValue = 2 * (1 - this.normalCDF(Math.abs(z)));
    const isSignificant = pValue < 0.05;

    return {
      isSignificant,
      winner: isSignificant ? (p2 > p1 ? variant.variant : control.variant) : null,
      pValue: pValue.toFixed(4),
      zScore: z.toFixed(4),
    };
  }

  /**
   * Normal cumulative distribution function approximation
   */
  normalCDF(x) {
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }

  /**
   * Error function approximation
   */
  erf(x) {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }

  /**
   * Generate experiment recommendations
   */
  generateExperimentRecommendations(analysis, significance) {
    const recommendations = [];

    if (significance.isSignificant) {
      recommendations.push({
        type: 'implementation',
        priority: 'high',
        title: `Implement Winning Variant: ${significance.winner}`,
        description: 'Statistical significance achieved, implement winning variant',
        expectedImpact: 'Proven conversion improvement',
      });
    } else {
      recommendations.push({
        type: 'iteration',
        priority: 'medium',
        title: 'Iterate Experiment Design',
        description: 'No significant difference found, try different approach',
        suggestions: [
          'Test more dramatic variations',
          'Extend experiment duration',
          'Segment audience for targeted testing',
          'Try different metrics or goals',
        ],
      });
    }

    return recommendations;
  }

  /**
   * Generate next steps based on experiment results
   */
  generateNextSteps(analysis, significance) {
    const steps = [];

    if (significance.isSignificant) {
      steps.push('Implement winning variant across all traffic');
      steps.push('Monitor performance for any unexpected changes');
      steps.push('Design follow-up experiments to further optimize');
    } else {
      steps.push('Analyze user segments for differential effects');
      steps.push('Consider extending experiment duration');
      steps.push('Design new hypothesis with larger expected impact');
    }

    return steps;
  }

  /**
   * Analyze user retention and identify improvement opportunities
   */
  async analyzeRetention(agencyId = null, timeframe = 90) {
    try {
      logger.info('Analyzing user retention patterns...');

      const whereClause = agencyId ? { agencyId } : {};
      const cutoffDate = new Date(Date.now() - timeframe * 24 * 60 * 60 * 1000);

      // Get cohort data
      const users = await this.prisma.user.findMany({
        where: {
          ...whereClause,
          createdAt: { gte: cutoffDate },
        },
        include: {
          sessions: true,
          campaigns: true,
        },
      });

      // Calculate retention metrics
      const retentionData = this.calculateRetentionMetrics(users);

      // Identify churn patterns
      const churnAnalysis = this.analyzeChurnPatterns(users);

      // Generate retention strategies
      const strategies = this.generateRetentionStrategies(retentionData, churnAnalysis);

      const retentionAnalysis = {
        timeframe,
        totalUsers: users.length,
        retentionRates: retentionData,
        churnAnalysis,
        strategies,
        generatedAt: new Date(),
      };

      logger.info('Retention analysis completed');
      return retentionAnalysis;
    } catch (error) {
      logger.error('Retention analysis failed:', error);
      throw error;
    }
  }

  /**
   * Calculate retention metrics by day/week/month
   */
  calculateRetentionMetrics(users) {
    const now = new Date();
    const retention = {
      day1: 0,
      day7: 0,
      day30: 0,
      activeUsers: 0,
    };

    users.forEach(user => {
      const daysSinceSignup = Math.floor((now - new Date(user.createdAt)) / (1000 * 60 * 60 * 24));
      const lastActivity =
        user.sessions.length > 0
          ? Math.max(...user.sessions.map(s => new Date(s.createdAt).getTime()))
          : new Date(user.createdAt).getTime();

      const daysSinceActivity = Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24));

      // Day 1 retention
      if (daysSinceSignup >= 1 && daysSinceActivity <= 1) {
        retention.day1++;
      }

      // Day 7 retention
      if (daysSinceSignup >= 7 && daysSinceActivity <= 7) {
        retention.day7++;
      }

      // Day 30 retention
      if (daysSinceSignup >= 30 && daysSinceActivity <= 30) {
        retention.day30++;
      }

      // Active users (last 7 days)
      if (daysSinceActivity <= 7) {
        retention.activeUsers++;
      }
    });

    return {
      day1Rate: users.length > 0 ? ((retention.day1 / users.length) * 100).toFixed(2) : 0,
      day7Rate: users.length > 0 ? ((retention.day7 / users.length) * 100).toFixed(2) : 0,
      day30Rate: users.length > 0 ? ((retention.day30 / users.length) * 100).toFixed(2) : 0,
      activeUserRate:
        users.length > 0 ? ((retention.activeUsers / users.length) * 100).toFixed(2) : 0,
    };
  }

  /**
   * Analyze churn patterns and identify risk factors
   */
  analyzeChurnPatterns(users) {
    const churnedUsers = users.filter(user => {
      const lastActivity =
        user.sessions.length > 0
          ? Math.max(...user.sessions.map(s => new Date(s.createdAt).getTime()))
          : new Date(user.createdAt).getTime();
      const daysSinceActivity = Math.floor((new Date() - lastActivity) / (1000 * 60 * 60 * 24));
      return daysSinceActivity > 30;
    });

    const patterns = {
      totalChurned: churnedUsers.length,
      churnRate: users.length > 0 ? ((churnedUsers.length / users.length) * 100).toFixed(2) : 0,
      commonFactors: this.identifyChurnFactors(churnedUsers),
      riskSegments: this.identifyRiskSegments(users),
    };

    return patterns;
  }

  /**
   * Identify common factors among churned users
   */
  identifyChurnFactors(churnedUsers) {
    const factors = [];

    // Low campaign usage
    const lowCampaignUsers = churnedUsers.filter(user => user.campaigns.length === 0);
    if (lowCampaignUsers.length > churnedUsers.length * 0.5) {
      factors.push({
        factor: 'No campaign creation',
        percentage: ((lowCampaignUsers.length / churnedUsers.length) * 100).toFixed(1),
        impact: 'high',
      });
    }

    // Quick churn (churned within 7 days)
    const quickChurn = churnedUsers.filter(user => {
      const daysSinceSignup = Math.floor(
        (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
      );
      return daysSinceSignup <= 7;
    });

    if (quickChurn.length > 0) {
      factors.push({
        factor: 'Early churn (within 7 days)',
        percentage: ((quickChurn.length / churnedUsers.length) * 100).toFixed(1),
        impact: 'high',
      });
    }

    return factors;
  }

  /**
   * Identify user segments at risk of churning
   */
  identifyRiskSegments(users) {
    const now = new Date();
    const riskSegments = [];

    // Users with no recent activity (14-30 days)
    const inactiveUsers = users.filter(user => {
      const lastActivity =
        user.sessions.length > 0
          ? Math.max(...user.sessions.map(s => new Date(s.createdAt).getTime()))
          : new Date(user.createdAt).getTime();
      const daysSinceActivity = Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24));
      return daysSinceActivity >= 14 && daysSinceActivity <= 30;
    });

    if (inactiveUsers.length > 0) {
      riskSegments.push({
        segment: 'Inactive users (14-30 days)',
        count: inactiveUsers.length,
        riskLevel: 'high',
        interventionNeeded: 're-engagement campaign',
      });
    }

    return riskSegments;
  }

  /**
   * Generate retention improvement strategies
   */
  generateRetentionStrategies(retentionData, churnAnalysis) {
    const strategies = [];

    // Low day 1 retention
    if (parseFloat(retentionData.day1Rate) < 60) {
      strategies.push({
        category: 'onboarding',
        priority: 'high',
        title: 'Improve Day 1 Retention',
        description: 'Users are not returning after first day',
        tactics: [
          'Send welcome email with quick start guide',
          'Implement in-app onboarding tour',
          'Provide immediate value demonstration',
          'Set up first campaign template',
        ],
        expectedImpact: '20-30% improvement in day 1 retention',
      });
    }

    // High churn rate
    if (parseFloat(churnAnalysis.churnRate) > 50) {
      strategies.push({
        category: 'engagement',
        priority: 'high',
        title: 'Reduce Overall Churn Rate',
        description: 'Too many users are churning within first month',
        tactics: [
          'Implement usage-based email reminders',
          'Create engagement milestones and rewards',
          'Provide customer success outreach',
          'Develop win-back email campaigns',
        ],
        expectedImpact: '15-25% reduction in churn rate',
      });
    }

    return strategies;
  }

  /**
   * Generate comprehensive growth strategy report
   */
  async generateGrowthReport(agencyId = null) {
    try {
      logger.info('Generating comprehensive growth report...');

      // Gather all analysis data
      const funnelAnalysis = await this.analyzeFunnel(agencyId);
      const retentionAnalysis = await this.analyzeRetention(agencyId);

      // Get experiment results
      const experiments = await this.prisma.experiment.findMany({
        where: { status: 'completed' },
        orderBy: { endDate: 'desc' },
        take: 10,
      });

      const growthReport = {
        summary: {
          signupConversion: funnelAnalysis.conversionRates.visitorToSignup,
          activationRate: funnelAnalysis.conversionRates.signupToActivation,
          retentionDay30: retentionAnalysis.retentionRates.day30Rate,
          experimentsCompleted: experiments.length,
        },
        funnelAnalysis,
        retentionAnalysis,
        experiments: experiments.map(exp => ({
          name: exp.name,
          status: exp.status,
          duration: Math.floor(
            (new Date(exp.endDate) - new Date(exp.startDate)) / (1000 * 60 * 60 * 24)
          ),
          hypothesis: exp.hypothesis,
        })),
        priorityRecommendations: this.generatePriorityRecommendations(
          funnelAnalysis,
          retentionAnalysis
        ),
        nextQuarterGoals: this.generateQuarterlyGoals(funnelAnalysis, retentionAnalysis),
        generatedAt: new Date(),
      };

      logger.info('Growth report generated successfully');
      return growthReport;
    } catch (error) {
      logger.error('Growth report generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate priority recommendations based on analysis
   */
  generatePriorityRecommendations(funnelAnalysis, retentionAnalysis) {
    const recommendations = [];

    // Combine and prioritize all recommendations
    const allRecommendations = [...funnelAnalysis.recommendations, ...retentionAnalysis.strategies];

    // Sort by priority and impact
    return allRecommendations
      .filter(rec => rec.priority === 'high')
      .slice(0, 5)
      .map((rec, index) => ({
        rank: index + 1,
        title: rec.title,
        category: rec.category,
        expectedImpact: rec.expectedImpact,
        actions: rec.actions || rec.tactics || [],
      }));
  }

  /**
   * Generate quarterly growth goals
   */
  generateQuarterlyGoals(funnelAnalysis, retentionAnalysis) {
    const currentSignupRate = funnelAnalysis.conversionRates.visitorToSignup;
    const currentRetentionRate = parseFloat(retentionAnalysis.retentionRates.day30Rate);

    return {
      userAcquisition: {
        current: funnelAnalysis.signups,
        target: Math.floor(funnelAnalysis.signups * 1.5), // 50% growth
        strategy: 'Optimize signup conversion and increase traffic',
      },
      conversionRate: {
        current: `${currentSignupRate}%`,
        target: `${(currentSignupRate * 1.3).toFixed(1)}%`, // 30% improvement
        strategy: 'Landing page optimization and A/B testing',
      },
      retention: {
        current: `${currentRetentionRate}%`,
        target: `${Math.min(100, currentRetentionRate * 1.4).toFixed(1)}%`, // 40% improvement
        strategy: 'Improve onboarding and engagement features',
      },
      experiments: {
        target: 8,
        focus: 'Conversion optimization and user engagement',
        expectedWins: 3,
      },
    };
  }

  /**
   * Get growth agent statistics
   */
  getAgentStatistics() {
    return {
      ...this.metrics,
      uptime: process.uptime(),
      timestamp: new Date(),
    };
  }

  /**
   * Shutdown the agent
   */
  async shutdown() {
    try {
      await this.prisma.$disconnect();
      logger.info(`${this.name} shutdown successfully`);
    } catch (error) {
      logger.error(`${this.name} shutdown failed:`, error);
    }
  }
}

// Command line interface
if (require.main === module) {
  const agent = new GrowthHackingOptimizer();
  const command = process.argv[2];

  async function run() {
    await agent.initialize();

    switch (command) {
      case 'funnel':
        const agencyId = process.argv[3];
        const funnel = await agent.analyzeFunnel(agencyId);
        console.log(JSON.stringify(funnel, null, 2));
        break;

      case 'experiment':
        const subCommand = process.argv[3];
        if (subCommand === 'create') {
          const experimentData = {
            name: 'Test Landing Page Headline',
            hypothesis: 'New headline will increase signup rate by 20%',
            variants: [
              { name: 'control', description: 'Current headline' },
              { name: 'variant_a', description: 'New compelling headline' },
            ],
            duration: 14,
          };
          const experiment = await agent.createExperiment(experimentData);
          console.log(JSON.stringify(experiment, null, 2));
        } else if (subCommand === 'analyze') {
          const experimentId = process.argv[4];
          if (!experimentId) {
            console.log(
              'Usage: node growth-hacking-optimizer.js experiment analyze <experimentId>'
            );
            return;
          }
          const analysis = await agent.analyzeExperiment(experimentId);
          console.log(JSON.stringify(analysis, null, 2));
        }
        break;

      case 'retention':
        const retentionAgencyId = process.argv[3];
        const retention = await agent.analyzeRetention(retentionAgencyId);
        console.log(JSON.stringify(retention, null, 2));
        break;

      case 'report':
        const reportAgencyId = process.argv[3];
        const report = await agent.generateGrowthReport(reportAgencyId);
        console.log(JSON.stringify(report, null, 2));
        break;

      case 'stats':
        const stats = agent.getAgentStatistics();
        console.log(JSON.stringify(stats, null, 2));
        break;

      default:
        console.log(
          'Usage: node growth-hacking-optimizer.js [funnel|experiment|retention|report|stats]'
        );
    }

    await agent.shutdown();
  }

  run().catch(console.error);
}

module.exports = GrowthHackingOptimizer;
