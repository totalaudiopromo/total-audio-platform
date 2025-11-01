#!/usr/bin/env node

/**
 * Simple Email Tracking System
 *
 * Tracks email opens and clicks without requiring Mailchimp or other services
 * Works with any email system - Gmail, Outlook, etc.
 * Uses simple tracking pixels and link redirects
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class EmailTracking {
  constructor() {
    this.trackingData = new Map();
    this.dataFile = path.join(__dirname, '..', 'data', 'email-tracking.json');
    this.trackingBaseUrl = process.env.TRACKING_BASE_URL || 'https://your-domain.com/track';
    this.loadTrackingData();
  }

  /**
   * Generate tracking pixel for email opens
   */
  generateTrackingPixel(emailId, contactId, campaignId) {
    const pixelId = this.generateUniqueId();
    const trackingUrl = `${this.trackingBaseUrl}/open/${pixelId}`;

    // Store tracking data
    this.trackingData.set(pixelId, {
      type: 'open',
      emailId,
      contactId,
      campaignId,
      timestamp: Date.now(),
      opened: false,
      userAgent: null,
      ip: null,
    });

    // Return HTML tracking pixel
    return `<img src="${trackingUrl}" width="1" height="1" style="display:none;" alt="" />`;
  }

  /**
   * Generate tracking links for email clicks
   */
  generateTrackingLinks(emailContent, emailId, contactId, campaignId) {
    // Find all links in the email content
    const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
    let match;
    let trackedContent = emailContent;
    let linkIndex = 0;

    while ((match = linkRegex.exec(emailContent)) !== null) {
      const originalUrl = match[1];
      const linkText = match[2];

      // Skip tracking pixels and internal links
      if (originalUrl.includes('track/open/') || originalUrl.startsWith('#')) {
        continue;
      }

      // Generate tracking link
      const linkId = this.generateUniqueId();
      const trackingUrl = `${this.trackingBaseUrl}/click/${linkId}`;

      // Store tracking data
      this.trackingData.set(linkId, {
        type: 'click',
        emailId,
        contactId,
        campaignId,
        originalUrl,
        linkText,
        timestamp: Date.now(),
        clicked: false,
        userAgent: null,
        ip: null,
      });

      // Replace the link in the content
      const trackedLink = `<a href="${trackingUrl}" data-original-url="${originalUrl}">${linkText}</a>`;
      trackedContent = trackedContent.replace(match[0], trackedLink);

      linkIndex++;
    }

    return trackedContent;
  }

  /**
   * Process tracking pixel request (for email opens)
   */
  async processOpenTracking(pixelId, userAgent, ip) {
    const trackingData = this.trackingData.get(pixelId);

    if (!trackingData) {
      console.log(`❌ Unknown tracking pixel: ${pixelId}`);
      return { success: false, message: 'Unknown tracking pixel' };
    }

    // Update tracking data
    trackingData.opened = true;
    trackingData.userAgent = userAgent;
    trackingData.ip = ip;
    trackingData.openedAt = Date.now();

    this.trackingData.set(pixelId, trackingData);
    this.saveTrackingData();

    console.log(`📧 Email opened: ${trackingData.contactId} - ${trackingData.campaignId}`);

    return { success: true, message: 'Open tracked' };
  }

  /**
   * Process tracking link request (for email clicks)
   */
  async processClickTracking(linkId, userAgent, ip) {
    const trackingData = this.trackingData.get(linkId);

    if (!trackingData) {
      console.log(`❌ Unknown tracking link: ${linkId}`);
      return { success: false, message: 'Unknown tracking link' };
    }

    // Update tracking data
    trackingData.clicked = true;
    trackingData.userAgent = userAgent;
    trackingData.ip = ip;
    trackingData.clickedAt = Date.now();

    this.trackingData.set(linkId, trackingData);
    this.saveTrackingData();

    console.log(`🔗 Link clicked: ${trackingData.contactId} - ${trackingData.linkText}`);

    // Return redirect to original URL
    return {
      success: true,
      redirectUrl: trackingData.originalUrl,
      message: 'Click tracked',
    };
  }

  /**
   * Get tracking statistics for a campaign
   */
  getCampaignStats(campaignId) {
    const campaignData = Array.from(this.trackingData.values()).filter(
      data => data.campaignId === campaignId
    );

    const stats = {
      campaignId,
      totalEmails: 0,
      totalOpens: 0,
      totalClicks: 0,
      openRate: 0,
      clickRate: 0,
      clickThroughRate: 0,
      uniqueOpens: 0,
      uniqueClicks: 0,
      topLinks: [],
      timeline: [],
    };

    // Count unique emails
    const uniqueEmails = new Set(campaignData.map(d => d.emailId));
    stats.totalEmails = uniqueEmails.size;

    // Count opens
    const opens = campaignData.filter(d => d.type === 'open' && d.opened);
    stats.totalOpens = opens.length;
    stats.uniqueOpens = new Set(opens.map(d => d.contactId)).size;

    // Count clicks
    const clicks = campaignData.filter(d => d.type === 'click' && d.clicked);
    stats.totalClicks = clicks.length;
    stats.uniqueClicks = new Set(clicks.map(d => d.contactId)).size;

    // Calculate rates
    if (stats.totalEmails > 0) {
      stats.openRate = (stats.uniqueOpens / stats.totalEmails) * 100;
      stats.clickRate = (stats.uniqueClicks / stats.totalEmails) * 100;
    }

    if (stats.uniqueOpens > 0) {
      stats.clickThroughRate = (stats.uniqueClicks / stats.uniqueOpens) * 100;
    }

    // Top clicked links
    const linkCounts = {};
    clicks.forEach(click => {
      const linkText = click.linkText || click.originalUrl;
      linkCounts[linkText] = (linkCounts[linkText] || 0) + 1;
    });

    stats.topLinks = Object.entries(linkCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([link, count]) => ({ link, count }));

    // Timeline (last 7 days)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentData = campaignData.filter(d => d.timestamp > sevenDaysAgo);

    const dailyStats = {};
    recentData.forEach(data => {
      const date = new Date(data.timestamp).toISOString().split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { opens: 0, clicks: 0 };
      }

      if (data.type === 'open' && data.opened) dailyStats[date].opens++;
      if (data.type === 'click' && data.clicked) dailyStats[date].clicks++;
    });

    stats.timeline = Object.entries(dailyStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ date, ...data }));

    return stats;
  }

  /**
   * Get contact engagement history
   */
  getContactEngagement(contactId) {
    const contactData = Array.from(this.trackingData.values())
      .filter(data => data.contactId === contactId)
      .sort((a, b) => b.timestamp - a.timestamp);

    const engagement = {
      contactId,
      totalEmails: 0,
      totalOpens: 0,
      totalClicks: 0,
      openRate: 0,
      clickRate: 0,
      lastEngagement: null,
      campaigns: [],
      engagementScore: 0,
    };

    // Count unique emails
    const uniqueEmails = new Set(contactData.map(d => d.emailId));
    engagement.totalEmails = uniqueEmails.size;

    // Count opens
    const opens = contactData.filter(d => d.type === 'open' && d.opened);
    engagement.totalOpens = opens.length;

    // Count clicks
    const clicks = contactData.filter(d => d.type === 'click' && d.clicked);
    engagement.totalClicks = clicks.length;

    // Calculate rates
    if (engagement.totalEmails > 0) {
      engagement.openRate = (engagement.totalOpens / engagement.totalEmails) * 100;
      engagement.clickRate = (engagement.totalClicks / engagement.totalEmails) * 100;
    }

    // Last engagement
    const lastOpen = opens[0];
    const lastClick = clicks[0];
    if (lastOpen && lastClick) {
      engagement.lastEngagement =
        lastOpen.timestamp > lastClick.timestamp
          ? { type: 'open', timestamp: lastOpen.timestamp }
          : { type: 'click', timestamp: lastClick.timestamp };
    } else if (lastOpen) {
      engagement.lastEngagement = { type: 'open', timestamp: lastOpen.timestamp };
    } else if (lastClick) {
      engagement.lastEngagement = { type: 'click', timestamp: lastClick.timestamp };
    }

    // Campaign history
    const campaignData = {};
    contactData.forEach(data => {
      if (!campaignData[data.campaignId]) {
        campaignData[data.campaignId] = {
          campaignId: data.campaignId,
          emails: 0,
          opens: 0,
          clicks: 0,
        };
      }

      if (data.type === 'open') campaignData[data.campaignId].emails++;
      if (data.type === 'open' && data.opened) campaignData[data.campaignId].opens++;
      if (data.type === 'click' && data.clicked) campaignData[data.campaignId].clicks++;
    });

    engagement.campaigns = Object.values(campaignData);

    // Calculate engagement score (0-100)
    let score = 0;
    if (engagement.openRate > 50) score += 30;
    else if (engagement.openRate > 25) score += 20;
    else if (engagement.openRate > 10) score += 10;

    if (engagement.clickRate > 20) score += 40;
    else if (engagement.clickRate > 10) score += 30;
    else if (engagement.clickRate > 5) score += 20;
    else if (engagement.clickRate > 0) score += 10;

    if (engagement.lastEngagement) {
      const daysSinceLastEngagement =
        (Date.now() - engagement.lastEngagement.timestamp) / (1000 * 60 * 60 * 24);
      if (daysSinceLastEngagement < 7) score += 20;
      else if (daysSinceLastEngagement < 30) score += 10;
    }

    engagement.engagementScore = Math.min(100, score);

    return engagement;
  }

  /**
   * Generate email with tracking
   */
  generateTrackedEmail(emailContent, emailId, contactId, campaignId) {
    // Add tracking pixel
    const trackingPixel = this.generateTrackingPixel(emailId, contactId, campaignId);

    // Add tracking to links
    const trackedContent = this.generateTrackingLinks(emailContent, emailId, contactId, campaignId);

    // Combine content with tracking pixel
    const finalContent = trackedContent + '\n\n' + trackingPixel;

    return {
      content: finalContent,
      trackingData: {
        emailId,
        contactId,
        campaignId,
        pixelId: trackingPixel.match(/open\/([^"]+)/)?.[1],
        linkCount: (trackedContent.match(/track\/click\//g) || []).length,
      },
    };
  }

  /**
   * Get all tracking data for analysis
   */
  getAllTrackingData() {
    return Array.from(this.trackingData.values());
  }

  /**
   * Export tracking data to CSV
   */
  exportToCSV(campaignId = null) {
    let data = Array.from(this.trackingData.values());

    if (campaignId) {
      data = data.filter(d => d.campaignId === campaignId);
    }

    const headers = [
      'Type',
      'Email ID',
      'Contact ID',
      'Campaign ID',
      'Timestamp',
      'Opened/Clicked',
      'User Agent',
      'IP',
      'Original URL',
      'Link Text',
    ];

    const csvRows = [headers.join(',')];

    data.forEach(item => {
      const row = [
        item.type,
        item.emailId || '',
        item.contactId || '',
        item.campaignId || '',
        new Date(item.timestamp).toISOString(),
        item.opened || item.clicked ? 'Yes' : 'No',
        (item.userAgent || '').replace(/,/g, ';'),
        item.ip || '',
        item.originalUrl || '',
        (item.linkText || '').replace(/,/g, ';'),
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  /**
   * Generate unique tracking ID
   */
  generateUniqueId() {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Data persistence
   */
  loadTrackingData() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = JSON.parse(fs.readFileSync(this.dataFile, 'utf8'));
        this.trackingData = new Map(data);
        console.log(`📊 Loaded ${this.trackingData.size} tracking records`);
      }
    } catch (error) {
      console.error('⚠️  Failed to load tracking data:', error.message);
    }
  }

  saveTrackingData() {
    try {
      const dataDir = path.dirname(this.dataFile);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const data = Array.from(this.trackingData.entries());
      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('❌ Failed to save tracking data:', error.message);
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    return {
      status: 'healthy',
      totalRecords: this.trackingData.size,
      dataFile: this.dataFile,
      lastChecked: new Date().toISOString(),
    };
  }
}

module.exports = EmailTracking;
