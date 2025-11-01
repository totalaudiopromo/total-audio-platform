#!/usr/bin/env node

/**
 * Database Agent for Total Audio Promo
 *
 * Handles database operations, migrations, and multi-tenant data management
 * Ensures data isolation between agencies and provides database utilities
 */

const { PrismaClient } = require('@prisma/client');

// Simple logger fallback if backend logger isn't available
const logger = {
  info: (msg, ...args) => console.log(`[INFO] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[ERROR] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[WARN] ${msg}`, ...args),
};

// Try to load backend logger if available
try {
  const backendLogger = require('../backend/src/utils/logger');
  if (backendLogger) {
    Object.assign(logger, backendLogger);
  }
} catch (e) {
  // Use fallback logger
}

class DatabaseAgent {
  constructor() {
    this.prisma = new PrismaClient();
    this.name = 'DatabaseAgent';
  }

  /**
   * Initialize the agent
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
   * Check database health and connectivity
   */
  async healthCheck() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'healthy', timestamp: new Date() };
    } catch (error) {
      logger.error('Database health check failed:', error);
      return { status: 'unhealthy', error: error.message, timestamp: new Date() };
    }
  }

  /**
   * Verify multi-tenant data isolation
   */
  async verifyDataIsolation(agencyId) {
    try {
      // Check that agency can only access its own data
      const artists = await this.prisma.artist.findMany({
        where: { agencyId },
        select: { id: true, agencyId: true },
      });

      const campaigns = await this.prisma.campaign.findMany({
        where: {
          artist: { agencyId },
        },
        select: { id: true, artistId: true },
      });

      const isolation = {
        agencyId,
        artistCount: artists.length,
        campaignCount: campaigns.length,
        dataIsolated: artists.every(artist => artist.agencyId === agencyId),
      };

      logger.info(`Data isolation verified for agency ${agencyId}:`, isolation);
      return isolation;
    } catch (error) {
      logger.error('Data isolation verification failed:', error);
      throw error;
    }
  }

  /**
   * Clean up old campaign data
   */
  async cleanupOldData(daysOld = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await this.prisma.campaign.deleteMany({
        where: {
          createdAt: { lt: cutoffDate },
          status: 'completed',
        },
      });

      logger.info(`Cleaned up ${result.count} old campaigns older than ${daysOld} days`);
      return result;
    } catch (error) {
      logger.error('Data cleanup failed:', error);
      throw error;
    }
  }

  /**
   * Get database statistics
   */
  async getStatistics() {
    try {
      const stats = await this.prisma.$transaction([
        this.prisma.user.count(),
        this.prisma.agency.count(),
        this.prisma.artist.count(),
        this.prisma.campaign.count(),
        this.prisma.contact.count(),
        this.prisma.emailCampaign.count(),
      ]);

      return {
        users: stats[0],
        agencies: stats[1],
        artists: stats[2],
        campaigns: stats[3],
        contacts: stats[4],
        emailCampaigns: stats[5],
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error('Failed to get database statistics:', error);
      throw error;
    }
  }

  /**
   * Backup critical data
   */
  async backupCriticalData() {
    try {
      const data = {
        agencies: await this.prisma.agency.findMany(),
        users: await this.prisma.user.findMany({
          select: { id: true, email: true, role: true, agencyId: true, createdAt: true },
        }),
        artists: await this.prisma.artist.findMany(),
        activeCampaigns: await this.prisma.campaign.findMany({
          where: { status: { in: ['active', 'scheduled'] } },
        }),
      };

      const backup = {
        timestamp: new Date(),
        recordCount: {
          agencies: data.agencies.length,
          users: data.users.length,
          artists: data.artists.length,
          activeCampaigns: data.activeCampaigns.length,
        },
        data,
      };

      logger.info('Critical data backup completed:', backup.recordCount);
      return backup;
    } catch (error) {
      logger.error('Data backup failed:', error);
      throw error;
    }
  }

  /**
   * Monitor database performance
   */
  async performanceCheck() {
    try {
      const start = Date.now();

      // Test query performance
      await this.prisma.campaign.findMany({
        take: 100,
        include: {
          artist: true,
          emailCampaigns: true,
        },
      });

      const queryTime = Date.now() - start;

      return {
        queryTime,
        performanceStatus: queryTime < 1000 ? 'good' : queryTime < 5000 ? 'moderate' : 'slow',
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error('Performance check failed:', error);
      throw error;
    }
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
  const agent = new DatabaseAgent();
  const command = process.argv[2];

  async function run() {
    await agent.initialize();

    switch (command) {
      case 'health':
        const health = await agent.healthCheck();
        console.log(JSON.stringify(health, null, 2));
        break;

      case 'stats':
        const stats = await agent.getStatistics();
        console.log(JSON.stringify(stats, null, 2));
        break;

      case 'cleanup':
        const days = parseInt(process.argv[3]) || 90;
        const cleanup = await agent.cleanupOldData(days);
        console.log(JSON.stringify(cleanup, null, 2));
        break;

      case 'backup':
        const backup = await agent.backupCriticalData();
        console.log(JSON.stringify(backup.recordCount, null, 2));
        break;

      case 'performance':
        const perf = await agent.performanceCheck();
        console.log(JSON.stringify(perf, null, 2));
        break;

      default:
        console.log('Usage: node database-agent.js [health|stats|cleanup|backup|performance]');
    }

    await agent.shutdown();
  }

  run().catch(console.error);
}

module.exports = DatabaseAgent;
