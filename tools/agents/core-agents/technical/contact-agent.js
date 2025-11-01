#!/usr/bin/env node

/**
 * Contact Agent for Total Audio Promo
 *
 * Specialized agent for contact management, enrichment, deduplication, and relationship tracking
 * Handles contact lifecycle from discovery to engagement analysis
 */

const { PrismaClient } = require('@prisma/client');

// Simple logger fallback
const logger = {
  info: (msg, ...args) => console.log(`[INFO] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[ERROR] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[WARN] ${msg}`, ...args),
};

class ContactAgent {
  constructor() {
    this.name = 'ContactAgent';
    this.prisma = new PrismaClient();
    this.metrics = {
      contactsProcessed: 0,
      contactsEnriched: 0,
      duplicatesRemoved: 0,
      engagementScored: 0,
    };
  }

  /**
   * Initialize the contact agent
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
   * Enrich contact information using multiple data sources
   */
  async enrichContact(contactId) {
    try {
      const contact = await this.prisma.contact.findUnique({
        where: { id: contactId },
      });

      if (!contact) {
        throw new Error(`Contact ${contactId} not found`);
      }

      logger.info(`Enriching contact: ${contact.email}`);

      const enrichmentData = {
        socialProfiles: {},
        companyInfo: {},
        personalInfo: {},
        engagementHistory: {},
      };

      // Enrich with social media profiles
      if (contact.email) {
        enrichmentData.socialProfiles = await this.findSocialProfiles(contact.email);
      }

      // Enrich with company information
      if (contact.company) {
        enrichmentData.companyInfo = await this.enrichCompanyInfo(contact.company);
      }

      // Analyze domain for industry insights
      if (contact.email) {
        const domain = contact.email.split('@')[1];
        enrichmentData.domainInfo = await this.analyzeDomain(domain);
      }

      // Update contact with enriched data
      const updatedContact = await this.prisma.contact.update({
        where: { id: contactId },
        data: {
          enrichedData: JSON.stringify(enrichmentData),
          enrichedAt: new Date(),
          isEnriched: true,
        },
      });

      this.metrics.contactsEnriched++;
      logger.info(`Contact enriched successfully: ${contact.email}`);

      return { contact: updatedContact, enrichmentData };
    } catch (error) {
      logger.error(`Contact enrichment failed for ${contactId}:`, error);
      throw error;
    }
  }

  /**
   * Find social media profiles for contact
   */
  async findSocialProfiles(email) {
    // This would integrate with social media APIs or data providers
    const profiles = {
      linkedin: null,
      twitter: null,
      instagram: null,
      facebook: null,
    };

    try {
      // Placeholder for social media profile lookup
      // In real implementation, this would call external APIs
      const name = email.split('@')[0];

      profiles.linkedin = `https://linkedin.com/in/${name}`;
      // Additional social profile lookups would go here
    } catch (error) {
      logger.error('Social profile lookup failed:', error);
    }

    return profiles;
  }

  /**
   * Enrich company information
   */
  async enrichCompanyInfo(companyName) {
    try {
      // This would integrate with company data providers
      const companyInfo = {
        name: companyName,
        industry: null,
        size: null,
        location: null,
        website: null,
        description: null,
      };

      // Placeholder for company data enrichment
      // In real implementation, this would call APIs like Clearbit, ZoomInfo, etc.

      return companyInfo;
    } catch (error) {
      logger.error('Company enrichment failed:', error);
      return { name: companyName };
    }
  }

  /**
   * Analyze domain for industry and company insights
   */
  async analyzeDomain(domain) {
    try {
      const domainInfo = {
        domain,
        industry: null,
        companySize: null,
        technology: [],
        socialPresence: {},
      };

      // This would integrate with domain analysis services
      // Placeholder for domain analysis logic

      return domainInfo;
    } catch (error) {
      logger.error('Domain analysis failed:', error);
      return { domain };
    }
  }

  /**
   * Remove duplicate contacts across the system
   */
  async removeDuplicates(agencyId = null) {
    try {
      logger.info('Starting duplicate removal process...');

      const whereClause = agencyId ? { agencyId } : {};

      // Find potential duplicates based on email
      const duplicateGroups = await this.prisma.contact.groupBy({
        by: ['email'],
        where: whereClause,
        _count: { email: true },
        having: { email: { _count: { gt: 1 } } },
      });

      let totalRemoved = 0;

      for (const group of duplicateGroups) {
        const duplicates = await this.prisma.contact.findMany({
          where: {
            email: group.email,
            ...whereClause,
          },
          orderBy: { updatedAt: 'desc' },
        });

        // Keep the most recently updated contact, remove others
        const toKeep = duplicates[0];
        const toRemove = duplicates.slice(1);

        // Merge data from duplicates into the kept contact
        const mergedData = await this.mergeContactData(toKeep, toRemove);

        // Update the kept contact with merged data
        await this.prisma.contact.update({
          where: { id: toKeep.id },
          data: mergedData,
        });

        // Remove duplicates
        await this.prisma.contact.deleteMany({
          where: {
            id: { in: toRemove.map(c => c.id) },
          },
        });

        totalRemoved += toRemove.length;
        logger.info(`Merged ${toRemove.length} duplicates for ${group.email}`);
      }

      this.metrics.duplicatesRemoved += totalRemoved;
      logger.info(`Duplicate removal completed: ${totalRemoved} duplicates removed`);

      return {
        duplicateGroups: duplicateGroups.length,
        contactsRemoved: totalRemoved,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error('Duplicate removal failed:', error);
      throw error;
    }
  }

  /**
   * Merge data from duplicate contacts
   */
  async mergeContactData(primaryContact, duplicates) {
    const mergedData = {
      // Combine tags
      tags: [
        ...new Set([...(primaryContact.tags || []), ...duplicates.flatMap(d => d.tags || [])]),
      ],

      // Merge notes
      notes: [primaryContact.notes, ...duplicates.map(d => d.notes).filter(Boolean)]
        .filter(Boolean)
        .join('\n\n---\n\n'),

      // Keep the most recent engagement date
      lastEngagedAt: [primaryContact.lastEngagedAt, ...duplicates.map(d => d.lastEngagedAt)]
        .filter(Boolean)
        .sort((a, b) => new Date(b) - new Date(a))[0],

      // Sum interaction counts
      interactionCount: duplicates.reduce(
        (sum, d) => sum + (d.interactionCount || 0),
        primaryContact.interactionCount || 0
      ),

      // Merge enriched data
      enrichedData: this.mergeEnrichedData(
        primaryContact.enrichedData,
        duplicates.map(d => d.enrichedData)
      ),
    };

    return mergedData;
  }

  /**
   * Merge enriched data from multiple contacts
   */
  mergeEnrichedData(primaryData, duplicateDataList) {
    try {
      const primary = primaryData ? JSON.parse(primaryData) : {};
      const merged = { ...primary };

      for (const duplicateData of duplicateDataList) {
        if (duplicateData) {
          const data = JSON.parse(duplicateData);

          // Merge social profiles
          if (data.socialProfiles) {
            merged.socialProfiles = { ...merged.socialProfiles, ...data.socialProfiles };
          }

          // Merge company info
          if (data.companyInfo) {
            merged.companyInfo = { ...merged.companyInfo, ...data.companyInfo };
          }

          // Merge other data fields
          Object.keys(data).forEach(key => {
            if (!merged[key] && data[key]) {
              merged[key] = data[key];
            }
          });
        }
      }

      return JSON.stringify(merged);
    } catch (error) {
      logger.error('Error merging enriched data:', error);
      return primaryData;
    }
  }

  /**
   * Calculate engagement score for contact
   */
  async calculateEngagementScore(contactId) {
    try {
      const contact = await this.prisma.contact.findUnique({
        where: { id: contactId },
        include: {
          interactions: {
            orderBy: { createdAt: 'desc' },
            take: 50, // Last 50 interactions
          },
        },
      });

      if (!contact) {
        throw new Error(`Contact ${contactId} not found`);
      }

      let score = 0;
      const now = new Date();

      // Base score factors
      const factors = {
        emailOpens: 2,
        emailClicks: 5,
        emailReplies: 10,
        websiteVisits: 3,
        socialEngagement: 4,
        recentActivity: 1.5, // Multiplier for recent activity
      };

      // Calculate score based on interactions
      contact.interactions.forEach(interaction => {
        const daysSince = Math.floor(
          (now - new Date(interaction.createdAt)) / (1000 * 60 * 60 * 24)
        );
        const recencyMultiplier = daysSince < 7 ? factors.recentActivity : daysSince < 30 ? 1.2 : 1;

        switch (interaction.type) {
          case 'email_open':
            score += factors.emailOpens * recencyMultiplier;
            break;
          case 'email_click':
            score += factors.emailClicks * recencyMultiplier;
            break;
          case 'email_reply':
            score += factors.emailReplies * recencyMultiplier;
            break;
          case 'website_visit':
            score += factors.websiteVisits * recencyMultiplier;
            break;
          case 'social_engagement':
            score += factors.socialEngagement * recencyMultiplier;
            break;
        }
      });

      // Normalize score to 0-100 scale
      const normalizedScore = Math.min(100, Math.max(0, score));

      // Determine engagement level
      let engagementLevel = 'cold';
      if (normalizedScore >= 80) engagementLevel = 'hot';
      else if (normalizedScore >= 60) engagementLevel = 'warm';
      else if (normalizedScore >= 30) engagementLevel = 'lukewarm';

      // Update contact with engagement score
      await this.prisma.contact.update({
        where: { id: contactId },
        data: {
          engagementScore: normalizedScore,
          engagementLevel,
          lastScoredAt: new Date(),
        },
      });

      this.metrics.engagementScored++;
      logger.info(
        `Engagement score calculated for contact ${contactId}: ${normalizedScore} (${engagementLevel})`
      );

      return {
        contactId,
        score: normalizedScore,
        level: engagementLevel,
        factors: {
          totalInteractions: contact.interactions.length,
          recentInteractions: contact.interactions.filter(
            i => Math.floor((now - new Date(i.createdAt)) / (1000 * 60 * 60 * 24)) < 30
          ).length,
        },
      };
    } catch (error) {
      logger.error(`Engagement scoring failed for contact ${contactId}:`, error);
      throw error;
    }
  }

  /**
   * Segment contacts based on various criteria
   */
  async segmentContacts(agencyId = null) {
    try {
      const whereClause = agencyId ? { agencyId } : {};

      const segments = {
        byEngagement: await this.prisma.contact.groupBy({
          by: ['engagementLevel'],
          where: whereClause,
          _count: { id: true },
        }),

        byIndustry: await this.prisma.contact.groupBy({
          by: ['industry'],
          where: whereClause,
          _count: { id: true },
        }),

        byLocation: await this.prisma.contact.groupBy({
          by: ['location'],
          where: whereClause,
          _count: { id: true },
        }),

        recentlyEngaged: await this.prisma.contact.count({
          where: {
            ...whereClause,
            lastEngagedAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        }),

        highValue: await this.prisma.contact.count({
          where: {
            ...whereClause,
            engagementScore: { gte: 70 },
          },
        }),
      };

      logger.info('Contact segmentation completed');
      return segments;
    } catch (error) {
      logger.error('Contact segmentation failed:', error);
      throw error;
    }
  }

  /**
   * Bulk process contacts for enrichment and scoring
   */
  async bulkProcessContacts(limit = 100, agencyId = null) {
    try {
      const whereClause = {
        ...(agencyId ? { agencyId } : {}),
        isEnriched: false,
      };

      const contacts = await this.prisma.contact.findMany({
        where: whereClause,
        take: limit,
        orderBy: { createdAt: 'asc' },
      });

      const results = {
        processed: 0,
        enriched: 0,
        scored: 0,
        errors: 0,
      };

      for (const contact of contacts) {
        try {
          // Enrich contact
          await this.enrichContact(contact.id);
          results.enriched++;

          // Calculate engagement score
          await this.calculateEngagementScore(contact.id);
          results.scored++;

          results.processed++;
          this.metrics.contactsProcessed++;
        } catch (error) {
          logger.error(`Failed to process contact ${contact.id}:`, error);
          results.errors++;
        }
      }

      logger.info(`Bulk processing completed: ${results.processed} contacts processed`);
      return results;
    } catch (error) {
      logger.error('Bulk contact processing failed:', error);
      throw error;
    }
  }

  /**
   * Get contact agent statistics
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
  const agent = new ContactAgent();
  const command = process.argv[2];

  async function run() {
    await agent.initialize();

    switch (command) {
      case 'enrich':
        const contactId = process.argv[3];
        if (!contactId) {
          console.log('Usage: node contact-agent.js enrich <contactId>');
          return;
        }
        const enrichment = await agent.enrichContact(contactId);
        console.log(JSON.stringify(enrichment, null, 2));
        break;

      case 'dedupe':
        const agencyId = process.argv[3];
        const deduplication = await agent.removeDuplicates(agencyId);
        console.log(JSON.stringify(deduplication, null, 2));
        break;

      case 'score':
        const scoreContactId = process.argv[3];
        if (!scoreContactId) {
          console.log('Usage: node contact-agent.js score <contactId>');
          return;
        }
        const scoring = await agent.calculateEngagementScore(scoreContactId);
        console.log(JSON.stringify(scoring, null, 2));
        break;

      case 'segment':
        const segmentAgencyId = process.argv[3];
        const segmentation = await agent.segmentContacts(segmentAgencyId);
        console.log(JSON.stringify(segmentation, null, 2));
        break;

      case 'bulk':
        const limit = parseInt(process.argv[3]) || 100;
        const bulkAgencyId = process.argv[4];
        const bulk = await agent.bulkProcessContacts(limit, bulkAgencyId);
        console.log(JSON.stringify(bulk, null, 2));
        break;

      case 'stats':
        const stats = agent.getAgentStatistics();
        console.log(JSON.stringify(stats, null, 2));
        break;

      default:
        console.log('Usage: node contact-agent.js [enrich|dedupe|score|segment|bulk|stats]');
    }

    await agent.shutdown();
  }

  run().catch(console.error);
}

module.exports = ContactAgent;
