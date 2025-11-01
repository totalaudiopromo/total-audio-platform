#!/usr/bin/env node

/**
 * Liberty Music PR Analytics Agent
 *
 * Real-time play monitoring and analytics using WARM API
 * Sends instant alerts when tracks get played
 */

const RealTimeMonitor = require('../integrations/real-time-monitor');

class AnalyticsAgent {
  constructor(options = {}) {
    this.name = 'AnalyticsAgent';
    this.version = '2.0.0';
    this.orchestrator = options.orchestrator;
    this.config = options.config || {};
    this.logger = options.logger || console.log;

    // Initialize real-time monitor
    this.monitor = new RealTimeMonitor();

    // Analytics data
    this.campaigns = new Map();
    this.analytics = {
      totalPlays: 0,
      totalCampaigns: 0,
      averagePlaysPerCampaign: 0,
      topPerformingStations: new Map(),
      playTimeline: [],
    };
  }

  async initialize() {
    this.logger('📊 Initializing Analytics Agent with real-time monitoring...');

    try {
      // Test WARM API connection
      const health = await this.monitor.healthCheck();
      if (health.warmApi !== 'healthy') {
        this.logger('⚠️  WARM API not healthy - monitoring may not work');
      }

      this.logger('✅ Analytics Agent initialized with real-time monitoring');
      return true;
    } catch (error) {
      this.logger('❌ Failed to initialize Analytics Agent:', error.message);
      return false;
    }
  }

  async setupTracking(campaignData) {
    this.logger(`📊 Setting up tracking for campaign: ${campaignData.campaignId}`);

    try {
      // Start real-time monitoring
      const monitoringConfig = await this.monitor.startMonitoring(
        campaignData.campaignId,
        campaignData.artistName,
        {
          startDate: campaignData.startDate,
          alertThreshold: 1,
        }
      );

      // Store campaign data
      this.campaigns.set(campaignData.campaignId, {
        ...campaignData,
        monitoring: monitoringConfig,
        startTime: Date.now(),
        plays: 0,
        lastPlay: null,
      });

      // Add alert callback for this campaign
      this.monitor.addAlertCallback((config, newPlays) => {
        this.handleNewPlays(config, newPlays);
      });

      this.logger(`✅ Tracking setup complete for ${campaignData.artistName}`);

      return {
        trackingId: campaignData.campaignId,
        warmApiConnected: true,
        monitoringActive: true,
        alertChannels: this.monitor.alertChannels,
      };
    } catch (error) {
      this.logger('❌ Failed to setup tracking:', error.message);
      throw error;
    }
  }

  async startContinuousMonitoring(campaignData) {
    this.logger(`📊 Starting continuous monitoring for ${campaignData.artistName}`);

    // Monitoring is already started in setupTracking
    const status = this.monitor.getMonitoringStatus();

    return {
      monitoringActive: status.monitoring,
      activeCampaigns: status.activeCampaigns,
      checkInterval: this.monitor.checkInterval,
    };
  }

  /**
   * Handle new plays detected
   */
  handleNewPlays(config, newPlays) {
    this.logger(`🎉 Handling ${newPlays.length} new plays for ${config.artistName}`);

    // Update campaign data
    const campaign = this.campaigns.get(config.campaignId);
    if (campaign) {
      campaign.plays += newPlays.length;
      campaign.lastPlay = Date.now();

      // Update analytics
      this.analytics.totalPlays += newPlays.length;
      this.updateStationAnalytics(newPlays);
      this.updatePlayTimeline(config, newPlays);
    }

    // Notify orchestrator if available
    if (this.orchestrator) {
      this.orchestrator.emit('newPlays', {
        campaignId: config.campaignId,
        artistName: config.artistName,
        plays: newPlays,
        totalPlays: config.totalPlays,
      });
    }
  }

  /**
   * Update station analytics
   */
  updateStationAnalytics(plays) {
    plays.forEach(play => {
      const station = play.radioStationName || play.stationName || 'Unknown Station';
      const current = this.analytics.topPerformingStations.get(station) || 0;
      this.analytics.topPerformingStations.set(station, current + 1);
    });
  }

  /**
   * Update play timeline
   */
  updatePlayTimeline(config, plays) {
    plays.forEach(play => {
      this.analytics.playTimeline.push({
        timestamp: Date.now(),
        campaignId: config.campaignId,
        artistName: config.artistName,
        station: play.radioStationName || play.stationName || 'Unknown Station',
        time: play.time || 'Unknown Time',
        date: play.date || new Date().toISOString().split('T')[0],
      });
    });

    // Keep only last 1000 plays to prevent memory issues
    if (this.analytics.playTimeline.length > 1000) {
      this.analytics.playTimeline = this.analytics.playTimeline.slice(-1000);
    }
  }

  /**
   * Get campaign analytics
   */
  getCampaignAnalytics(campaignId) {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      return null;
    }

    const playHistory = this.monitor.getPlayHistory(campaignId);

    return {
      campaignId,
      artistName: campaign.artistName,
      startTime: campaign.startTime,
      totalPlays: campaign.plays,
      lastPlay: campaign.lastPlay,
      playHistory: playHistory,
      monitoring: campaign.monitoring,
    };
  }

  /**
   * Get overall analytics
   */
  getOverallAnalytics() {
    const activeCampaigns = Array.from(this.campaigns.values());
    this.analytics.totalCampaigns = activeCampaigns.length;
    this.analytics.averagePlaysPerCampaign =
      activeCampaigns.length > 0 ? this.analytics.totalPlays / activeCampaigns.length : 0;

    return {
      ...this.analytics,
      topPerformingStations: Array.from(this.analytics.topPerformingStations.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10),
      recentPlays: this.analytics.playTimeline.slice(-10),
    };
  }

  /**
   * Get monitoring status
   */
  getMonitoringStatus() {
    return this.monitor.getMonitoringStatus();
  }

  /**
   * Stop monitoring a campaign
   */
  stopMonitoring(campaignId) {
    this.monitor.stopMonitoring(campaignId);
    const campaign = this.campaigns.get(campaignId);
    if (campaign) {
      campaign.monitoring.monitoring = false;
    }
    this.logger(`🛑 Stopped monitoring campaign: ${campaignId}`);
  }

  /**
   * Get play alerts for a campaign
   */
  getPlayAlerts(campaignId, hours = 24) {
    const playHistory = this.monitor.getPlayHistory(campaignId);
    const cutoffTime = Date.now() - hours * 60 * 60 * 1000;

    return playHistory.filter(play => play.timestamp > cutoffTime);
  }

  /**
   * Export analytics data
   */
  exportAnalytics(format = 'json') {
    const data = {
      campaigns: Array.from(this.campaigns.entries()),
      analytics: this.analytics,
      playHistory: this.monitor.getAllPlayHistory(),
      exportedAt: new Date().toISOString(),
    };

    if (format === 'csv') {
      return this.convertToCSV(data);
    }

    return data;
  }

  /**
   * Convert analytics to CSV
   */
  convertToCSV(data) {
    const csvRows = [];

    // Headers
    csvRows.push('Campaign ID,Artist Name,Station,Date,Time,Timestamp');

    // Play data
    Object.entries(data.playHistory).forEach(([campaignId, plays]) => {
      plays.forEach(play => {
        const row = [
          campaignId,
          play.play.artistName || 'Unknown',
          play.station,
          play.date,
          play.time,
          new Date(play.timestamp).toISOString(),
        ];
        csvRows.push(row.join(','));
      });
    });

    return csvRows.join('\n');
  }

  async healthCheck() {
    const monitorHealth = await this.monitor.healthCheck();
    const analytics = this.getOverallAnalytics();

    return {
      status: 'healthy',
      agent: this.name,
      version: this.version,
      monitoring: monitorHealth,
      analytics: {
        totalCampaigns: analytics.totalCampaigns,
        totalPlays: analytics.totalPlays,
        averagePlaysPerCampaign: analytics.averagePlaysPerCampaign,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async shutdown() {
    this.logger('🛑 Shutting down Analytics Agent...');
    await this.monitor.shutdown();
    this.logger('✅ Analytics Agent shutdown complete');
  }
}

module.exports = AnalyticsAgent;
