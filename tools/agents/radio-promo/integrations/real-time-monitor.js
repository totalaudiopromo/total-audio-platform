#!/usr/bin/env node

/**
 * Real-time Play Monitoring System
 *
 * Monitors WARM API for new plays and sends instant alerts
 * Tracks play history and celebrates wins
 */

const WarmusicAPI = require('./warm-api');
const fs = require('fs');
const path = require('path');

class RealTimeMonitor {
  constructor() {
    this.warmApi = new WarmusicAPI();
    this.monitoring = new Map(); // campaignId -> monitoring config
    this.playHistory = new Map(); // campaignId -> play history
    this.alertCallbacks = [];

    // Data persistence
    this.dataFile = path.join(__dirname, '..', 'data', 'play-monitoring.json');
    this.loadPlayHistory();

    // Monitoring intervals
    this.checkInterval = 2 * 60 * 1000; // Check every 2 minutes
    this.monitoringInterval = null;

    // Alert channels
    this.alertChannels = {
      console: true,
      webhook: process.env.GOOGLE_CHAT_WEBHOOK || null,
      email: process.env.ALERT_EMAIL || null,
    };
  }

  /**
   * Start monitoring a campaign
   */
  async startMonitoring(campaignId, artistName, options = {}) {
    console.log(`🎵 Starting real-time monitoring for ${artistName} (${campaignId})`);

    const config = {
      campaignId,
      artistName,
      startDate: options.startDate || new Date().toISOString().split('T')[0],
      checkInterval: options.checkInterval || this.checkInterval,
      alertThreshold: options.alertThreshold || 1, // Alert on first play
      lastCheck: Date.now(),
      totalPlays: 0,
      newPlays: 0,
      monitoring: true,
    };

    this.monitoring.set(campaignId, config);

    // Initialize play history if not exists
    if (!this.playHistory.has(campaignId)) {
      this.playHistory.set(campaignId, []);
    }

    // Start monitoring if not already running
    if (!this.monitoringInterval) {
      this.startMonitoringLoop();
    }

    console.log(`✅ Real-time monitoring started for ${artistName}`);
    return config;
  }

  /**
   * Stop monitoring a campaign
   */
  stopMonitoring(campaignId) {
    const config = this.monitoring.get(campaignId);
    if (config) {
      config.monitoring = false;
      console.log(`🛑 Stopped monitoring campaign: ${campaignId}`);
    }
  }

  /**
   * Start the monitoring loop
   */
  startMonitoringLoop() {
    if (this.monitoringInterval) {
      return; // Already running
    }

    console.log('🔄 Starting real-time monitoring loop...');

    this.monitoringInterval = setInterval(async () => {
      await this.checkForNewPlays();
    }, this.checkInterval);
  }

  /**
   * Stop the monitoring loop
   */
  stopMonitoringLoop() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('🛑 Real-time monitoring loop stopped');
    }
  }

  /**
   * Check for new plays across all monitored campaigns
   */
  async checkForNewPlays() {
    const activeCampaigns = Array.from(this.monitoring.values()).filter(
      config => config.monitoring
    );

    if (activeCampaigns.length === 0) {
      return;
    }

    console.log(`🔍 Checking for new plays across ${activeCampaigns.length} campaigns...`);

    for (const config of activeCampaigns) {
      try {
        await this.checkCampaignPlays(config);
      } catch (error) {
        console.error(`❌ Error checking plays for ${config.artistName}:`, error.message);
      }
    }
  }

  /**
   * Check plays for a specific campaign
   */
  async checkCampaignPlays(config) {
    try {
      // Get plays from WARM API
      const playsData = await this.warmApi.getPlaysForArtist(
        config.artistName,
        config.startDate,
        new Date().toISOString().split('T')[0]
      );

      const currentPlays = playsData.plays || playsData || [];
      const existingPlays = this.playHistory.get(config.campaignId) || [];

      // Find new plays
      const newPlays = currentPlays.filter(play => {
        const playId = this.generatePlayId(play);
        return !existingPlays.some(existing => existing.id === playId);
      });

      if (newPlays.length > 0) {
        console.log(`🎉 NEW PLAYS DETECTED for ${config.artistName}: ${newPlays.length} plays!`);

        // Update play history
        const playHistory = this.playHistory.get(config.campaignId) || [];
        newPlays.forEach(play => {
          const playRecord = {
            id: this.generatePlayId(play),
            timestamp: Date.now(),
            play: play,
            station: play.radioStationName || play.stationName || 'Unknown Station',
            time: play.time || 'Unknown Time',
            date: play.date || new Date().toISOString().split('T')[0],
          };
          playHistory.push(playRecord);
        });

        this.playHistory.set(config.campaignId, playHistory);
        this.savePlayHistory();

        // Update config
        config.totalPlays = currentPlays.length;
        config.newPlays += newPlays.length;
        config.lastCheck = Date.now();

        // Send alerts
        await this.sendPlayAlerts(config, newPlays);

        // Trigger callbacks
        this.alertCallbacks.forEach(callback => {
          try {
            callback(config, newPlays);
          } catch (error) {
            console.error('❌ Alert callback error:', error.message);
          }
        });
      } else {
        // Update last check time
        config.lastCheck = Date.now();
        config.totalPlays = currentPlays.length;
      }
    } catch (error) {
      console.error(`❌ Error checking plays for ${config.artistName}:`, error.message);
    }
  }

  /**
   * Send play alerts
   */
  async sendPlayAlerts(config, newPlays) {
    const alertMessage = this.formatPlayAlert(config, newPlays);

    // Console alert
    if (this.alertChannels.console) {
      console.log('\n' + '='.repeat(60));
      console.log('🎉 PLAY ALERT!');
      console.log('='.repeat(60));
      console.log(alertMessage);
      console.log('='.repeat(60) + '\n');
    }

    // Webhook alert (Google Chat, Slack, etc.)
    if (this.alertChannels.webhook) {
      await this.sendWebhookAlert(alertMessage);
    }

    // Email alert
    if (this.alertChannels.email) {
      await this.sendEmailAlert(config, newPlays);
    }
  }

  /**
   * Format play alert message
   */
  formatPlayAlert(config, newPlays) {
    let message = `🎵 ${config.artistName} - NEW PLAYS DETECTED!\n\n`;
    message += `📊 Campaign: ${config.campaignId}\n`;
    message += `🎯 Total Plays: ${config.totalPlays}\n`;
    message += `🆕 New Plays: ${newPlays.length}\n\n`;

    message += `📻 Stations Playing:\n`;
    newPlays.forEach((play, index) => {
      const station = play.radioStationName || play.stationName || 'Unknown Station';
      const time = play.time || 'Unknown Time';
      const date = play.date || new Date().toISOString().split('T')[0];
      message += `   ${index + 1}. ${station} - ${time} (${date})\n`;
    });

    message += `\n⏰ Alert Time: ${new Date().toLocaleString('en-GB', {
      timeZone: 'Europe/London',
    })}`;

    return message;
  }

  /**
   * Send webhook alert
   */
  async sendWebhookAlert(message) {
    try {
      const response = await fetch(this.alertChannels.webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message,
        }),
      });

      if (response.ok) {
        console.log('✅ Webhook alert sent successfully');
      } else {
        console.error('❌ Webhook alert failed:', response.status);
      }
    } catch (error) {
      console.error('❌ Webhook alert error:', error.message);
    }
  }

  /**
   * Send email alert
   */
  async sendEmailAlert(config, newPlays) {
    // This would integrate with your email system
    console.log(`📧 Email alert would be sent to ${this.alertChannels.email}`);
    console.log(`   Subject: New Plays for ${config.artistName}`);
    console.log(`   Plays: ${newPlays.length} new plays detected`);
  }

  /**
   * Add alert callback
   */
  addAlertCallback(callback) {
    this.alertCallbacks.push(callback);
  }

  /**
   * Get monitoring status
   */
  getMonitoringStatus() {
    const activeCampaigns = Array.from(this.monitoring.values()).filter(
      config => config.monitoring
    );

    return {
      monitoring: this.monitoringInterval !== null,
      activeCampaigns: activeCampaigns.length,
      campaigns: activeCampaigns.map(config => ({
        campaignId: config.campaignId,
        artistName: config.artistName,
        totalPlays: config.totalPlays,
        newPlays: config.newPlays,
        lastCheck: new Date(config.lastCheck).toISOString(),
      })),
      checkInterval: this.checkInterval,
      alertChannels: this.alertChannels,
    };
  }

  /**
   * Get play history for a campaign
   */
  getPlayHistory(campaignId) {
    return this.playHistory.get(campaignId) || [];
  }

  /**
   * Get all play history
   */
  getAllPlayHistory() {
    const allHistory = {};
    this.playHistory.forEach((plays, campaignId) => {
      allHistory[campaignId] = plays;
    });
    return allHistory;
  }

  /**
   * Generate unique play ID
   */
  generatePlayId(play) {
    const station = play.radioStationName || play.stationName || 'unknown';
    const time = play.time || 'unknown';
    const date = play.date || 'unknown';
    return `${station}-${date}-${time}`.replace(/[^a-zA-Z0-9-]/g, '-');
  }

  /**
   * Data persistence
   */
  loadPlayHistory() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = JSON.parse(fs.readFileSync(this.dataFile, 'utf8'));
        this.playHistory = new Map(data.playHistory || []);
        console.log(`📚 Loaded play history for ${this.playHistory.size} campaigns`);
      }
    } catch (error) {
      console.error('⚠️  Failed to load play history:', error.message);
    }
  }

  savePlayHistory() {
    try {
      const dataDir = path.dirname(this.dataFile);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const data = {
        playHistory: Array.from(this.playHistory.entries()),
        lastSaved: new Date().toISOString(),
      };

      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('❌ Failed to save play history:', error.message);
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    const status = this.getMonitoringStatus();
    const warmHealth = await this.warmApi.healthCheck();

    return {
      status: 'healthy',
      monitoring: status.monitoring,
      activeCampaigns: status.activeCampaigns,
      warmApi: warmHealth.status,
      lastChecked: new Date().toISOString(),
    };
  }

  /**
   * Shutdown
   */
  async shutdown() {
    this.stopMonitoringLoop();
    this.savePlayHistory();
    console.log('🛑 Real-time monitor shutdown complete');
  }
}

module.exports = RealTimeMonitor;
