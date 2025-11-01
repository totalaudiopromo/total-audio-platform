#!/usr/bin/env node

/**
 * Agency Agent for Total Audio Promo
 *
 * Specialized agent for agency-specific operations including multi-tenant data management,
 * white-label features, billing coordination, and agency performance analytics
 */

const { PrismaClient } = require('@prisma/client');

// Simple logger fallback
const logger = {
  info: (msg, ...args) => console.log(`[INFO] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[ERROR] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[WARN] ${msg}`, ...args),
};

class AgencyAgent {
  constructor() {
    this.name = 'AgencyAgent';
    this.prisma = new PrismaClient();
    this.metrics = {
      agenciesManaged: 0,
      artistsOnboarded: 0,
      campaignsLaunched: 0,
      revenueTracked: 0,
    };
  }

  /**
   * Initialize the agency agent
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
   * Onboard a new agency with complete setup
   */
  async onboardAgency(agencyData) {
    try {
      logger.info(`Onboarding new agency: ${agencyData.name}`);

      // Create agency with default settings
      const agency = await this.prisma.agency.create({
        data: {
          ...agencyData,
          settings: {
            branding: {
              primaryColor: agencyData.primaryColor || '#f6ab00',
              secondaryColor: agencyData.secondaryColor || '#2538c7',
              logo: agencyData.logo || null,
              customDomain: agencyData.customDomain || null,
            },
            features: {
              whiteLabel: agencyData.plan === 'enterprise',
              customReporting: true,
              bulkOperations: true,
              advancedAnalytics: true,
            },
            limits: {
              maxArtists: agencyData.plan === 'enterprise' ? -1 : 50,
              maxCampaigns: agencyData.plan === 'enterprise' ? -1 : 100,
              maxContacts: agencyData.plan === 'enterprise' ? -1 : 10000,
            },
          },
          plan: agencyData.plan || 'professional',
          status: 'active',
          createdAt: new Date(),
        },
      });

      // Create default admin user for the agency
      await this.createAgencyAdmin(agency.id, agencyData.adminUser);

      // Set up agency integrations
      await this.setupAgencyIntegrations(agency.id);

      // Create initial billing record
      await this.setupAgencyBilling(agency.id, agencyData.billing);

      this.metrics.agenciesManaged++;
      logger.info(`Agency onboarding completed: ${agency.name} (${agency.id})`);

      return agency;
    } catch (error) {
      logger.error('Agency onboarding failed:', error);
      throw error;
    }
  }

  /**
   * Create agency admin user
   */
  async createAgencyAdmin(agencyId, adminData) {
    const admin = await this.prisma.user.create({
      data: {
        ...adminData,
        role: 'AGENCY',
        agencyId,
        permissions: ['manage_artists', 'view_analytics', 'manage_campaigns', 'manage_billing'],
        isAgencyOwner: true,
        createdAt: new Date(),
      },
    });

    logger.info(`Agency admin created: ${admin.email}`);
    return admin;
  }

  /**
   * Set up default integrations for agency
   */
  async setupAgencyIntegrations(agencyId) {
    const integrations = [
      {
        agencyId,
        service: 'airtable',
        status: 'pending',
        settings: {},
      },
      {
        agencyId,
        service: 'mailchimp',
        status: 'pending',
        settings: {},
      },
      {
        agencyId,
        service: 'gmail',
        status: 'pending',
        settings: {},
      },
      {
        agencyId,
        service: 'claude',
        status: 'active',
        settings: { enabled: true },
      },
    ];

    await this.prisma.integration.createMany({
      data: integrations,
    });

    logger.info(`Default integrations set up for agency ${agencyId}`);
    return integrations;
  }

  /**
   * Set up billing for agency
   */
  async setupAgencyBilling(agencyId, billingData) {
    const billing = await this.prisma.billing.create({
      data: {
        agencyId,
        plan: billingData.plan || 'professional',
        billingCycle: billingData.billingCycle || 'monthly',
        amount: billingData.plan === 'enterprise' ? 29900 : 15000, // £299 or £150
        currency: 'GBP',
        status: 'active',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        stripeCustomerId: billingData.stripeCustomerId,
        setupFee: billingData.plan === 'enterprise' ? 50000 : 50000, // £500 setup fee
        setupFeePaid: false,
      },
    });

    logger.info(`Billing setup completed for agency ${agencyId}`);
    return billing;
  }

  /**
   * Onboard an artist to an agency
   */
  async onboardArtist(agencyId, artistData) {
    try {
      logger.info(`Onboarding artist ${artistData.name} to agency ${agencyId}`);

      // Check agency limits
      const agency = await this.prisma.agency.findUnique({
        where: { id: agencyId },
        include: { _count: { select: { artists: true } } },
      });

      if (
        agency.settings.limits.maxArtists !== -1 &&
        agency._count.artists >= agency.settings.limits.maxArtists
      ) {
        throw new Error('Agency has reached maximum artist limit');
      }

      // Create artist
      const artist = await this.prisma.artist.create({
        data: {
          ...artistData,
          agencyId,
          status: 'active',
          onboardedAt: new Date(),
          settings: {
            notifications: true,
            autoReporting: true,
            campaignAlerts: true,
          },
        },
      });

      // Create artist user account if email provided
      if (artistData.email) {
        await this.prisma.user.create({
          data: {
            email: artistData.email,
            name: artistData.name,
            role: 'ARTIST',
            agencyId,
            artistId: artist.id,
            permissions: ['view_own_campaigns', 'view_own_analytics'],
          },
        });
      }

      this.metrics.artistsOnboarded++;
      logger.info(`Artist onboarding completed: ${artist.name} (${artist.id})`);

      return artist;
    } catch (error) {
      logger.error('Artist onboarding failed:', error);
      throw error;
    }
  }

  /**
   * Generate agency performance dashboard
   */
  async generateAgencyDashboard(agencyId) {
    try {
      const agency = await this.prisma.agency.findUnique({
        where: { id: agencyId },
        include: {
          artists: {
            include: {
              campaigns: {
                include: { metrics: true },
              },
            },
          },
          billing: true,
          integrations: true,
        },
      });

      if (!agency) {
        throw new Error(`Agency ${agencyId} not found`);
      }

      // Calculate agency metrics
      const metrics = this.calculateAgencyMetrics(agency);

      // Get recent activity
      const recentActivity = await this.getRecentAgencyActivity(agencyId);

      // Generate performance insights
      const insights = await this.generateAgencyInsights(agency, metrics);

      const dashboard = {
        agency: {
          id: agency.id,
          name: agency.name,
          plan: agency.plan,
          status: agency.status,
        },
        metrics,
        recentActivity,
        insights,
        artists: agency.artists.map(artist => ({
          id: artist.id,
          name: artist.name,
          campaignCount: artist.campaigns.length,
          totalOpens: artist.campaigns.reduce((sum, c) => sum + (c.metrics?.opens || 0), 0),
          totalClicks: artist.campaigns.reduce((sum, c) => sum + (c.metrics?.clicks || 0), 0),
        })),
        billing: {
          plan: agency.billing?.plan,
          status: agency.billing?.status,
          nextBilling: agency.billing?.nextBillingDate,
          amount: agency.billing?.amount,
        },
        integrations: agency.integrations.map(i => ({
          service: i.service,
          status: i.status,
          lastSync: i.lastSyncAt,
        })),
        generatedAt: new Date(),
      };

      logger.info(`Dashboard generated for agency ${agencyId}`);
      return dashboard;
    } catch (error) {
      logger.error('Agency dashboard generation failed:', error);
      throw error;
    }
  }

  /**
   * Calculate comprehensive agency metrics
   */
  calculateAgencyMetrics(agency) {
    const allCampaigns = agency.artists.flatMap(artist => artist.campaigns);
    const allMetrics = allCampaigns.map(campaign => campaign.metrics).filter(Boolean);

    const totals = allMetrics.reduce(
      (acc, metrics) => ({
        opens: acc.opens + (metrics.opens || 0),
        clicks: acc.clicks + (metrics.clicks || 0),
        replies: acc.replies + (metrics.replies || 0),
        bounces: acc.bounces + (metrics.bounces || 0),
        unsubscribes: acc.unsubscribes + (metrics.unsubscribes || 0),
      }),
      { opens: 0, clicks: 0, replies: 0, bounces: 0, unsubscribes: 0 }
    );

    const sent = allCampaigns.length * 1000; // Assuming 1000 contacts per campaign

    return {
      artists: agency.artists.length,
      campaigns: allCampaigns.length,
      activeCampaigns: allCampaigns.filter(c => c.status === 'active').length,
      totalContacts: agency.artists.reduce((sum, artist) => sum + (artist.contactCount || 0), 0),
      performance: {
        totalSent: sent,
        totalOpens: totals.opens,
        totalClicks: totals.clicks,
        totalReplies: totals.replies,
        openRate: sent > 0 ? ((totals.opens / sent) * 100).toFixed(2) : 0,
        clickRate: totals.opens > 0 ? ((totals.clicks / totals.opens) * 100).toFixed(2) : 0,
        replyRate: totals.opens > 0 ? ((totals.replies / totals.opens) * 100).toFixed(2) : 0,
        bounceRate: sent > 0 ? ((totals.bounces / sent) * 100).toFixed(2) : 0,
      },
      revenue: {
        monthlyRevenue: agency.billing?.amount || 0,
        setupFeeStatus: agency.billing?.setupFeePaid ? 'paid' : 'pending',
        nextBilling: agency.billing?.nextBillingDate,
      },
    };
  }

  /**
   * Get recent activity for agency
   */
  async getRecentAgencyActivity(agencyId, limit = 20) {
    const activities = await this.prisma.activity.findMany({
      where: { agencyId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: { select: { name: true, email: true } },
        artist: { select: { name: true } },
        campaign: { select: { title: true } },
      },
    });

    return activities.map(activity => ({
      id: activity.id,
      type: activity.type,
      description: activity.description,
      user: activity.user?.name,
      artist: activity.artist?.name,
      campaign: activity.campaign?.title,
      timestamp: activity.createdAt,
    }));
  }

  /**
   * Generate AI-powered insights for agency
   */
  async generateAgencyInsights(agency, metrics) {
    const insights = [];

    // Performance insights
    if (metrics.performance.openRate < 20) {
      insights.push({
        type: 'performance',
        priority: 'high',
        title: 'Low Open Rate Alert',
        description:
          'Agency-wide open rates are below industry average. Consider improving subject lines and sender reputation.',
        recommendation: 'Implement A/B testing for subject lines across all campaigns',
      });
    }

    // Growth insights
    if (agency.artists.length < 5) {
      insights.push({
        type: 'growth',
        priority: 'medium',
        title: 'Artist Growth Opportunity',
        description: 'Agency has capacity for more artists. Focus on client acquisition.',
        recommendation: 'Launch referral program or increase marketing efforts',
      });
    }

    // Billing insights
    if (agency.billing && !agency.billing.setupFeePaid) {
      insights.push({
        type: 'billing',
        priority: 'high',
        title: 'Setup Fee Pending',
        description: 'Agency setup fee has not been collected.',
        recommendation: 'Follow up on setup fee payment to ensure account remains active',
      });
    }

    // Integration insights
    const pendingIntegrations = agency.integrations.filter(i => i.status === 'pending').length;
    if (pendingIntegrations > 0) {
      insights.push({
        type: 'integration',
        priority: 'medium',
        title: 'Incomplete Integrations',
        description: `${pendingIntegrations} integrations are not fully configured.`,
        recommendation: 'Complete integration setup to maximize platform effectiveness',
      });
    }

    return insights;
  }

  /**
   * Manage agency white-label settings
   */
  async updateWhiteLabelSettings(agencyId, settings) {
    try {
      const agency = await this.prisma.agency.findUnique({
        where: { id: agencyId },
      });

      if (!agency) {
        throw new Error(`Agency ${agencyId} not found`);
      }

      // Verify agency has white-label permissions
      if (agency.plan !== 'enterprise') {
        throw new Error('White-label features require enterprise plan');
      }

      const updatedSettings = {
        ...agency.settings,
        branding: {
          ...agency.settings.branding,
          ...settings,
        },
      };

      const updatedAgency = await this.prisma.agency.update({
        where: { id: agencyId },
        data: { settings: updatedSettings },
      });

      logger.info(`White-label settings updated for agency ${agencyId}`);
      return updatedAgency;
    } catch (error) {
      logger.error('White-label settings update failed:', error);
      throw error;
    }
  }

  /**
   * Process agency billing and usage
   */
  async processBilling(agencyId) {
    try {
      const agency = await this.prisma.agency.findUnique({
        where: { id: agencyId },
        include: {
          billing: true,
          artists: true,
          _count: {
            select: {
              campaigns: true,
              contacts: true,
            },
          },
        },
      });

      if (!agency || !agency.billing) {
        throw new Error('Agency or billing information not found');
      }

      // Calculate usage-based fees
      const usage = {
        artists: agency.artists.length,
        campaigns: agency._count.campaigns,
        contacts: agency._count.contacts,
      };

      // Check for overages
      const overages = this.calculateOverages(agency.settings.limits, usage);

      // Calculate total billing amount
      let totalAmount = agency.billing.amount;
      if (overages.total > 0) {
        totalAmount += overages.total;
      }

      // Update billing record
      const updatedBilling = await this.prisma.billing.update({
        where: { id: agency.billing.id },
        data: {
          lastBillingAmount: totalAmount,
          usage: JSON.stringify(usage),
          overages: JSON.stringify(overages),
          lastBillingDate: new Date(),
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      this.metrics.revenueTracked += totalAmount;
      logger.info(`Billing processed for agency ${agencyId}: £${totalAmount / 100}`);

      return { billing: updatedBilling, usage, overages };
    } catch (error) {
      logger.error('Billing processing failed:', error);
      throw error;
    }
  }

  /**
   * Calculate usage overages
   */
  calculateOverages(limits, usage) {
    const overages = {
      artists: 0,
      campaigns: 0,
      contacts: 0,
      total: 0,
    };

    // Artist overages (£10 per additional artist)
    if (limits.maxArtists !== -1 && usage.artists > limits.maxArtists) {
      overages.artists = (usage.artists - limits.maxArtists) * 1000; // £10 = 1000 pence
    }

    // Campaign overages (£5 per additional campaign)
    if (limits.maxCampaigns !== -1 && usage.campaigns > limits.maxCampaigns) {
      overages.campaigns = (usage.campaigns - limits.maxCampaigns) * 500; // £5 = 500 pence
    }

    // Contact overages (£0.01 per additional contact)
    if (limits.maxContacts !== -1 && usage.contacts > limits.maxContacts) {
      overages.contacts = (usage.contacts - limits.maxContacts) * 1; // £0.01 = 1 pence
    }

    overages.total = overages.artists + overages.campaigns + overages.contacts;

    return overages;
  }

  /**
   * Get agency statistics
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
  const agent = new AgencyAgent();
  const command = process.argv[2];

  async function run() {
    await agent.initialize();

    switch (command) {
      case 'onboard':
        // This would typically take a JSON file or API input
        console.log('Usage: Onboarding requires API integration or configuration file');
        break;

      case 'dashboard':
        const agencyId = process.argv[3];
        if (!agencyId) {
          console.log('Usage: node agency-agent.js dashboard <agencyId>');
          return;
        }
        const dashboard = await agent.generateAgencyDashboard(agencyId);
        console.log(JSON.stringify(dashboard, null, 2));
        break;

      case 'billing':
        const billingAgencyId = process.argv[3];
        if (!billingAgencyId) {
          console.log('Usage: node agency-agent.js billing <agencyId>');
          return;
        }
        const billing = await agent.processBilling(billingAgencyId);
        console.log(JSON.stringify(billing, null, 2));
        break;

      case 'stats':
        const stats = agent.getAgentStatistics();
        console.log(JSON.stringify(stats, null, 2));
        break;

      default:
        console.log('Usage: node agency-agent.js [onboard|dashboard|billing|stats]');
    }

    await agent.shutdown();
  }

  run().catch(console.error);
}

module.exports = AgencyAgent;
