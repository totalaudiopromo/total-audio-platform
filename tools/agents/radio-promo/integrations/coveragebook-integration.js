#!/usr/bin/env node

/**
 * CoverageBook Integration for Liberty Music PR
 *
 * Integrates with CoverageBook data through CSV exports and manual data input.
 * Analyzes campaign coverage, tracks press mentions, and provides insights.
 *
 * Note: CoverageBook doesn't have a public API, so this integration works with:
 * - CSV exports from CoverageBook
 * - Manual data entry
 * - Coverage analysis and reporting
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Simple logger fallback
const logger = {
  info: (msg, ...args) => console.log(`[COVERAGEBOOK] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[COVERAGEBOOK] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[COVERAGEBOOK] ${msg}`, ...args),
  success: (msg, ...args) => console.log(`✅ [COVERAGEBOOK] ${msg}`, ...args),
};

class CoverageBookIntegration {
  constructor() {
    this.dataDirectory = './coveragebook-data';
    this.ensureDataDirectory();
    this.campaignData = new Map();
    this.coverageMetrics = {
      totalMentions: 0,
      totalReach: 0,
      totalImpressions: 0,
      topPerformingCampaigns: [],
      mediaTypes: {},
      outlets: {},
    };

    // Load existing campaign data on initialization
    this.loadAllCampaignData();
  }

  /**
   * Ensure data directory exists
   */
  ensureDataDirectory() {
    if (!fs.existsSync(this.dataDirectory)) {
      fs.mkdirSync(this.dataDirectory, { recursive: true });
      logger.info(`Created CoverageBook data directory: ${this.dataDirectory}`);
    }
  }

  /**
   * Import CoverageBook CSV data
   */
  async importCoverageBookCSV(filePath, campaignName) {
    try {
      logger.info(`Importing CoverageBook data from ${filePath} for campaign: ${campaignName}`);

      const coverageData = [];
      let totalReach = 0;
      let totalImpressions = 0;

      return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', row => {
            // Enhanced CoverageBook CSV format handling for Liberty data
            const coverage = {
              campaign: campaignName,
              title: row.title || row.Title || row['Article Title'] || row.Headline || '',
              url: row.url || row.URL || row['Article URL'] || row.Link || '',
              outlet:
                row.outlet ||
                row.Outlet ||
                row['Media Outlet'] ||
                row.Source ||
                row.Publication ||
                '',
              date: row.date || row.Date || row['Publication Date'] || row.Published || '',
              reach: parseInt(row.reach || row.Reach || row['Estimated Reach'] || '0') || 0,
              impressions:
                parseInt(row.impressions || row.Impressions || row['Impressions'] || '0') || 0,
              mediaType: row.mediaType || row['Media Type'] || row.Type || 'Online',
              sentiment: row.sentiment || row.Sentiment || 'neutral',
              author: row.author || row.Author || row['Author'] || '',
              category: row.category || row.Category || row['Category'] || 'Music',
              tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
              // Liberty-specific fields
              client: row.client || row.Client || row['Client'] || 'Liberty Music PR',
              campaignType: row.campaignType || row['Campaign Type'] || 'Radio Promo',
              addedAt: new Date().toISOString(),
            };

            // Validate essential fields
            if (!coverage.title || !coverage.outlet) {
              logger.warn(`Skipping incomplete coverage entry: ${JSON.stringify(coverage)}`);
              return;
            }

            totalReach += coverage.reach;
            totalImpressions += coverage.impressions;
            coverageData.push(coverage);
          })
          .on('end', () => {
            this.campaignData.set(campaignName, coverageData);
            this.updateMetrics();
            // Save the imported data
            this.saveCampaignData(campaignName);

            logger.success(`Imported ${coverageData.length} coverage entries for ${campaignName}`);
            logger.info(
              `Total Reach: ${totalReach.toLocaleString()}, Total Impressions: ${totalImpressions.toLocaleString()}`
            );

            // Log top outlets for Liberty insights
            const outletCounts = {};
            coverageData.forEach(c => {
              outletCounts[c.outlet] = (outletCounts[c.outlet] || 0) + 1;
            });

            const topOutlets = Object.entries(outletCounts)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5);

            if (topOutlets.length > 0) {
              logger.info('Top outlets for this campaign:');
              topOutlets.forEach(([outlet, count]) => {
                logger.info(`  ${outlet}: ${count} mentions`);
              });
            }

            resolve(coverageData);
          })
          .on('error', error => {
            logger.error('CSV import failed:', error);
            reject(error);
          });
      });
    } catch (error) {
      logger.error('CoverageBook CSV import failed:', error);
      throw error;
    }
  }

  /**
   * Import Liberty's multi-campaign CoverageBook export
   */
  async importLibertyCoverageBookExport(filePath) {
    try {
      logger.info(`Importing Liberty's CoverageBook export from ${filePath}`);

      const allCoverage = [];
      const campaignGroups = {};

      return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', row => {
            // Enhanced parsing for Liberty's actual data
            const coverage = {
              campaign: row.campaign || row.Campaign || row['Campaign'] || 'Unknown Campaign',
              title: row.title || row.Title || row['Article Title'] || row.Headline || '',
              url: row.url || row.URL || row['Article URL'] || row.Link || '',
              outlet:
                row.outlet ||
                row.Outlet ||
                row['Media Outlet'] ||
                row.Source ||
                row.Publication ||
                '',
              date: row.date || row.Date || row['Publication Date'] || row.Published || '',
              reach: parseInt(row.reach || row.Reach || row['Estimated Reach'] || '0') || 0,
              impressions:
                parseInt(row.impressions || row.Impressions || row['Impressions'] || '0') || 0,
              mediaType: row.mediaType || row['Media Type'] || row.Type || 'Online',
              sentiment: row.sentiment || row.Sentiment || 'neutral',
              author: row.author || row.Author || row['Author'] || '',
              category: row.category || row.Category || row['Category'] || 'Music',
              tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
              client: row.client || row.Client || row['Client'] || 'Liberty Music PR',
              campaignType: row.campaignType || row['Campaign Type'] || 'Radio Promo',
              addedAt: new Date().toISOString(),
            };

            if (!coverage.title || !coverage.outlet) {
              return; // Skip incomplete entries
            }

            allCoverage.push(coverage);

            // Group by campaign
            if (!campaignGroups[coverage.campaign]) {
              campaignGroups[coverage.campaign] = [];
            }
            campaignGroups[coverage.campaign].push(coverage);
          })
          .on('end', () => {
            // Import each campaign separately
            const importPromises = Object.entries(campaignGroups).map(
              async ([campaignName, coverageData]) => {
                this.campaignData.set(campaignName, coverageData);
                this.saveCampaignData(campaignName);

                const campaignReach = coverageData.reduce((sum, c) => sum + c.reach, 0);
                const campaignImpressions = coverageData.reduce((sum, c) => sum + c.impressions, 0);

                logger.success(
                  `Imported ${coverageData.length} entries for ${campaignName} (${campaignReach.toLocaleString()} reach)`
                );
                return {
                  campaign: campaignName,
                  entries: coverageData.length,
                  reach: campaignReach,
                };
              }
            );

            Promise.all(importPromises).then(results => {
              this.updateMetrics();

              const totalReach = results.reduce((sum, r) => sum + r.reach, 0);
              const totalEntries = results.reduce((sum, r) => sum + r.entries, 0);

              logger.success(`✅ LIBERTY COVERAGEBOOK IMPORT COMPLETE!`);
              logger.info(`📊 Total Campaigns: ${results.length}`);
              logger.info(`📈 Total Coverage Entries: ${totalEntries}`);
              logger.info(`🎯 Total Reach: ${totalReach.toLocaleString()}`);

              // Show top campaigns by reach
              const topCampaigns = results.sort((a, b) => b.reach - a.reach).slice(0, 5);

              if (topCampaigns.length > 0) {
                logger.info('🏆 Top Performing Campaigns:');
                topCampaigns.forEach((campaign, index) => {
                  logger.info(
                    `  ${index + 1}. ${campaign.campaign}: ${campaign.reach.toLocaleString()} reach (${campaign.entries} mentions)`
                  );
                });
              }

              resolve(results);
            });
          })
          .on('error', error => {
            logger.error('Liberty CoverageBook import failed:', error);
            reject(error);
          });
      });
    } catch (error) {
      logger.error('Liberty CoverageBook import failed:', error);
      throw error;
    }
  }

  /**
   * Add manual coverage entry
   */
  addCoverageEntry(campaignName, coverageData) {
    try {
      logger.info(`Adding manual coverage entry for ${campaignName}`);

      const coverage = {
        campaign: campaignName,
        title: coverageData.title,
        url: coverageData.url,
        outlet: coverageData.outlet,
        date: coverageData.date || new Date().toISOString().split('T')[0],
        reach: coverageData.reach || 0,
        impressions: coverageData.impressions || 0,
        mediaType: coverageData.mediaType || 'Online',
        sentiment: coverageData.sentiment || 'neutral',
        author: coverageData.author || '',
        category: coverageData.category || '',
        tags: coverageData.tags || [],
        addedManually: true,
        addedAt: new Date().toISOString(),
      };

      if (!this.campaignData.has(campaignName)) {
        this.campaignData.set(campaignName, []);
      }

      this.campaignData.get(campaignName).push(coverage);
      this.updateMetrics();

      // Save to file
      this.saveCampaignData(campaignName);

      logger.success(`Added coverage entry: ${coverage.title} from ${coverage.outlet}`);
      return coverage;
    } catch (error) {
      logger.error('Failed to add coverage entry:', error);
      throw error;
    }
  }

  /**
   * Get campaign coverage summary
   */
  getCampaignSummary(campaignName) {
    const coverage = this.campaignData.get(campaignName) || [];

    if (coverage.length === 0) {
      return {
        campaign: campaignName,
        totalMentions: 0,
        totalReach: 0,
        totalImpressions: 0,
        mediaTypes: {},
        outlets: {},
        topPerforming: [],
        sentiment: { positive: 0, neutral: 0, negative: 0 },
      };
    }

    const summary = {
      campaign: campaignName,
      totalMentions: coverage.length,
      totalReach: coverage.reduce((sum, c) => sum + c.reach, 0),
      totalImpressions: coverage.reduce((sum, c) => sum + c.impressions, 0),
      mediaTypes: {},
      outlets: {},
      topPerforming: [],
      sentiment: { positive: 0, neutral: 0, negative: 0 },
      dateRange: {
        earliest: new Date(Math.min(...coverage.map(c => new Date(c.date)))),
        latest: new Date(Math.max(...coverage.map(c => new Date(c.date)))),
      },
    };

    // Analyze media types
    coverage.forEach(c => {
      summary.mediaTypes[c.mediaType] = (summary.mediaTypes[c.mediaType] || 0) + 1;
    });

    // Analyze outlets
    coverage.forEach(c => {
      summary.outlets[c.outlet] = (summary.outlets[c.outlet] || 0) + 1;
    });

    // Analyze sentiment
    coverage.forEach(c => {
      summary.sentiment[c.sentiment] = (summary.sentiment[c.sentiment] || 0) + 1;
    });

    // Top performing by reach
    summary.topPerforming = coverage
      .sort((a, b) => b.reach - a.reach)
      .slice(0, 5)
      .map(c => ({
        title: c.title,
        outlet: c.outlet,
        reach: c.reach,
        url: c.url,
      }));

    return summary;
  }

  /**
   * Get all campaigns summary
   */
  getAllCampaignsSummary() {
    const campaigns = Array.from(this.campaignData.keys());

    return {
      totalCampaigns: campaigns.length,
      totalMentions: this.coverageMetrics.totalMentions,
      totalReach: this.coverageMetrics.totalReach,
      totalImpressions: this.coverageMetrics.totalImpressions,
      campaigns: campaigns.map(campaign => this.getCampaignSummary(campaign)),
    };
  }

  /**
   * Find coverage by outlet
   */
  findCoverageByOutlet(outletName) {
    const results = [];

    this.campaignData.forEach((coverage, campaign) => {
      coverage.forEach(c => {
        if (c.outlet.toLowerCase().includes(outletName.toLowerCase())) {
          results.push({
            ...c,
            campaign,
          });
        }
      });
    });

    return results;
  }

  /**
   * Find coverage by keyword
   */
  findCoverageByKeyword(keyword) {
    const results = [];
    const keywordLower = keyword.toLowerCase();

    this.campaignData.forEach((coverage, campaign) => {
      coverage.forEach(c => {
        if (
          c.title.toLowerCase().includes(keywordLower) ||
          c.tags.some(tag => tag.toLowerCase().includes(keywordLower))
        ) {
          results.push({
            ...c,
            campaign,
          });
        }
      });
    });

    return results;
  }

  /**
   * Generate coverage report
   */
  generateCoverageReport(campaignName = null) {
    try {
      logger.info(`Generating coverage report for ${campaignName || 'all campaigns'}`);

      const report = {
        generatedAt: new Date().toISOString(),
        reportType: campaignName ? 'campaign' : 'overview',
        campaign: campaignName,
      };

      if (campaignName) {
        report.data = this.getCampaignSummary(campaignName);
      } else {
        report.data = this.getAllCampaignsSummary();
      }

      // Save report
      const timestamp = Date.now();
      const filename = campaignName
        ? `coveragebook_report_${campaignName.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.json`
        : `coveragebook_report_all_campaigns_${timestamp}.json`;

      const filePath = path.join(this.dataDirectory, filename);
      fs.writeFileSync(filePath, JSON.stringify(report, null, 2));

      logger.success(`Coverage report saved: ${filePath}`);
      return report;
    } catch (error) {
      logger.error('Failed to generate coverage report:', error);
      throw error;
    }
  }

  /**
   * Update internal metrics
   */
  updateMetrics() {
    this.coverageMetrics = {
      totalMentions: 0,
      totalReach: 0,
      totalImpressions: 0,
      topPerformingCampaigns: [],
      mediaTypes: {},
      outlets: {},
    };

    this.campaignData.forEach((coverage, campaign) => {
      const campaignSummary = this.getCampaignSummary(campaign);

      this.coverageMetrics.totalMentions += campaignSummary.totalMentions;
      this.coverageMetrics.totalReach += campaignSummary.totalReach;
      this.coverageMetrics.totalImpressions += campaignSummary.totalImpressions;

      // Track media types
      Object.entries(campaignSummary.mediaTypes).forEach(([type, count]) => {
        this.coverageMetrics.mediaTypes[type] =
          (this.coverageMetrics.mediaTypes[type] || 0) + count;
      });

      // Track outlets
      Object.entries(campaignSummary.outlets).forEach(([outlet, count]) => {
        this.coverageMetrics.outlets[outlet] = (this.coverageMetrics.outlets[outlet] || 0) + count;
      });

      this.coverageMetrics.topPerformingCampaigns.push({
        campaign,
        mentions: campaignSummary.totalMentions,
        reach: campaignSummary.totalReach,
      });
    });

    // Sort top performing campaigns
    this.coverageMetrics.topPerformingCampaigns.sort((a, b) => b.reach - a.reach);
  }

  /**
   * Save campaign data to file
   */
  saveCampaignData(campaignName) {
    try {
      const coverage = this.campaignData.get(campaignName);
      if (!coverage) return;

      const filename = `coveragebook_${campaignName.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
      const filePath = path.join(this.dataDirectory, filename);

      fs.writeFileSync(filePath, JSON.stringify(coverage, null, 2));
      logger.info(`Saved campaign data: ${filePath}`);
    } catch (error) {
      logger.error('Failed to save campaign data:', error);
    }
  }

  /**
   * Load campaign data from file
   */
  loadCampaignData(campaignName) {
    try {
      const filename = `coveragebook_${campaignName.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
      const filePath = path.join(this.dataDirectory, filename);

      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        this.campaignData.set(campaignName, data);
        logger.info(`Loaded campaign data: ${filePath}`);
        return data;
      }
    } catch (error) {
      logger.error('Failed to load campaign data:', error);
    }
    return null;
  }

  /**
   * Load all existing campaign data on initialization
   */
  loadAllCampaignData() {
    try {
      if (!fs.existsSync(this.dataDirectory)) {
        return;
      }

      const files = fs.readdirSync(this.dataDirectory);
      const campaignFiles = files.filter(
        file =>
          file.startsWith('coveragebook_') && file.endsWith('.json') && !file.includes('report_') // Exclude report files
      );

      campaignFiles.forEach(file => {
        try {
          const filePath = path.join(this.dataDirectory, file);
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

          // Use the campaign name from the data itself (more reliable than filename)
          const campaignName =
            data.length > 0
              ? data[0].campaign
              : file.replace('coveragebook_', '').replace('.json', '');

          this.campaignData.set(campaignName, data);
          logger.info(`Loaded existing campaign data: ${campaignName} (${data.length} entries)`);
        } catch (error) {
          logger.warn(`Failed to load campaign file ${file}:`, error.message);
        }
      });

      // Update metrics after loading all data
      this.updateMetrics();

      if (campaignFiles.length > 0) {
        logger.success(
          `Loaded ${campaignFiles.length} existing campaigns with ${this.coverageMetrics.totalMentions} total mentions`
        );
      }
    } catch (error) {
      logger.error('Failed to load all campaign data:', error);
    }
  }

  /**
   * Get CoverageBook integration status
   */
  getStatus() {
    return {
      status: 'active',
      dataDirectory: this.dataDirectory,
      campaignsLoaded: this.campaignData.size,
      totalMentions: this.coverageMetrics.totalMentions,
      totalReach: this.coverageMetrics.totalReach,
      lastUpdated: new Date().toISOString(),
      features: [
        'CSV Import',
        'Manual Entry',
        'Campaign Analysis',
        'Coverage Reports',
        'Outlet Tracking',
        'Keyword Search',
      ],
    };
  }

  /**
   * Export data for CoverageBook re-import
   */
  exportForCoverageBook(campaignName) {
    try {
      const coverage = this.campaignData.get(campaignName) || [];

      // Convert to CoverageBook CSV format
      const csvData = coverage.map(c => ({
        'Article Title': c.title,
        'Article URL': c.url,
        'Media Outlet': c.outlet,
        'Publication Date': c.date,
        'Estimated Reach': c.reach,
        Impressions: c.impressions,
        'Media Type': c.mediaType,
        Sentiment: c.sentiment,
        Author: c.author,
        Category: c.category,
        Tags: c.tags.join(', '),
      }));

      const timestamp = Date.now();
      const filename = `coveragebook_export_${campaignName.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.csv`;
      const filePath = path.join(this.dataDirectory, filename);

      // Simple CSV generation
      const headers = Object.keys(csvData[0] || {});
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => `"${row[header] || ''}"`).join(',')),
      ].join('\n');

      fs.writeFileSync(filePath, csvContent);
      logger.success(`Exported CoverageBook data: ${filePath}`);
      return filePath;
    } catch (error) {
      logger.error('Failed to export CoverageBook data:', error);
      throw error;
    }
  }
}

module.exports = CoverageBookIntegration;
