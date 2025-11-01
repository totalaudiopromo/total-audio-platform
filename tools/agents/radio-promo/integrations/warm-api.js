const logger = console; // Fallback logger
const https = require('https');
const http = require('http');

class WarmusicAPI {
  constructor() {
    // WARM API configuration with token-based authentication
    this.baseURL = process.env.WARM_API_BASE_URL || 'https://public-api.warmmusic.net/api/v1';
    this.token = process.env.WARM_API_TOKEN || null;
    this.tokenExpiry = null;
    this.isAvailable = false; // Track if API is available

    // Legacy email/password support (fallback)
    this.credentials = {
      email: process.env.WARM_API_EMAIL || 'promo@totalaudiopromo.com',
      password: process.env.WARM_API_PASSWORD || '',
    };

    if (this.token) {
      logger.info(`🔗 WARM API configured with token authentication`);
      // Parse token expiry from JWT
      try {
        const payloadSegment = this.token.split('.')[1];
        const decodedPayload = Buffer.from(payloadSegment, 'base64').toString('utf8');
        const payload = JSON.parse(decodedPayload);
        this.tokenExpiry = payload.exp * 1000; // Convert to milliseconds
        logger.info(`🎫 Token expires: ${new Date(this.tokenExpiry).toISOString()}`);
      } catch (error) {
        logger.warn('⚠️ Could not parse token expiry, assuming 24 hours');
        this.tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
      }
    } else {
      logger.info(`🔗 WARM API configured for ${this.credentials.email} (email/password auth)`);
    }
  }

  async authenticate() {
    try {
      // If we have a token, use it directly
      if (this.token) {
        logger.info('🔐 Using existing WARM API token...');
        logger.info(`🎫 Token: ${this.token.substring(0, 20)}...`);
        logger.info(`⏰ Token expires: ${new Date(this.tokenExpiry).toISOString()}`);

        // Check if token is still valid
        if (Date.now() >= this.tokenExpiry) {
          throw new Error('Token expired. Please get a new token from WARM dashboard.');
        }

        this.warnIfTokenExpiring();

        return this.token;
      }

      // Fallback to email/password authentication
      logger.info('🔐 Authenticating with WARM API using email/password...');
      logger.info(`📧 Using email: ${this.credentials.email}`);
      logger.info(`🌐 API URL: ${this.baseURL}`);

      const response = await fetch(`${this.baseURL}/auth/exchange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Liberty-Music-PR-Agent/1.0',
        },
        body: JSON.stringify(this.credentials),
      });

      const responseText = await response.text();
      logger.info(`📡 Response status: ${response.status}`);
      logger.info(`📡 Response: ${responseText}`);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            `Authentication failed (403): Invalid credentials or account not active. Check email/password and ensure 250-song trial is active.`
          );
        } else if (response.status === 400) {
          // Check if it's a 400 with a 403 message (nested error)
          if (responseText.includes('403')) {
            throw new Error(
              `Authentication failed (400→403): Invalid credentials or account not active. Check email/password and ensure 250-song trial is active. Response: ${responseText}`
            );
          } else {
            throw new Error(
              `Authentication failed (400): Bad request format. Response: ${responseText}`
            );
          }
        } else {
          throw new Error(
            `Authentication failed: ${response.status} ${response.statusText}. Response: ${responseText}`
          );
        }
      }

      this.token = responseText; // Returns JWT string directly
      this.tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // 23 hours

      logger.info('✅ WARM API authentication successful');
      logger.info(`🎫 Token received: ${this.token.substring(0, 20)}...`);
      this.warnIfTokenExpiring();
      return this.token;
    } catch (error) {
      logger.error('❌ WARM API authentication failed:', error);
      throw error;
    }
  }

  warnIfTokenExpiring() {
    if (!this.tokenExpiry) {
      return;
    }

    const timeRemaining = this.tokenExpiry - Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (timeRemaining <= 0) {
      logger.error('⚠️ WARM token has expired. Generate a new token in the WARM dashboard.');
    } else if (timeRemaining < oneDay) {
      const hours = Math.round(timeRemaining / (60 * 60 * 1000));
      logger.warn(`⚠️ WARM token expires in ~${hours} hours. Refresh it soon to avoid outages.`);
    }
  }

  async ensureValidToken() {
    if (!this.token || Date.now() >= this.tokenExpiry) {
      await this.authenticate();
    }
    return this.token;
  }

  async getPlaysForArtist(artistName, fromDate, untilDate) {
    try {
      await this.ensureValidToken();

      const params = new URLSearchParams({
        artistName: artistName,
        countryCode: 'GB', // UK focus
        ...(fromDate && { fromDate }),
        ...(untilDate && { untilDate }),
      });

      logger.info(
        `📻 Fetching plays for ${artistName} (${fromDate || 'all time'} - ${untilDate || 'now'})`
      );

      const response = await fetch(`${this.baseURL}/plays?${params}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'User-Agent': 'Liberty-Music-PR-Agent/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch plays: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Handle paginated response format
      const plays = data.currentPagesEntities || data.plays || data.data || data || [];
      const totalPlays = data.totalNumberOfEntities || data.total || plays.length;

      logger.info(`✅ Found ${totalPlays} plays for ${artistName}`);
      return {
        plays: plays,
        total: totalPlays,
        hasMore: data.hasMore || false,
        pageSize: data.pageSize || 1000,
      };
    } catch (error) {
      logger.error(`❌ Error fetching plays for ${artistName}:`, error);
      throw error;
    }
  }

  async getUKRadioStations() {
    try {
      await this.ensureValidToken();

      logger.info('📻 Fetching UK radio stations...');

      const response = await fetch(
        `${this.baseURL}/radio-stations?countryCode=GB&isMonitored=true`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'User-Agent': 'Liberty-Music-PR-Agent/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch radio stations: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Handle paginated response format
      const stations = data.currentPagesEntities || data.stations || data.data || data || [];
      const totalStations = data.totalNumberOfEntities || data.total || stations.length;

      logger.info(`✅ Found ${totalStations} UK radio stations`);
      return {
        stations: stations,
        total: totalStations,
        hasMore: data.hasMore || false,
        pageSize: data.pageSize || 10,
      };
    } catch (error) {
      logger.error('❌ Error fetching UK radio stations:', error);
      throw error;
    }
  }

  async generateCSVReport(artistName, fromDate, untilDate) {
    try {
      await this.ensureValidToken();

      const params = new URLSearchParams({
        artistName: artistName,
        countryCode: 'GB',
        fromDate: fromDate,
        untilDate: untilDate,
      });

      logger.info(`📊 Generating CSV report for ${artistName}`);

      const response = await fetch(`${this.baseURL}/reports/csv?${params}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to generate CSV report: ${response.status} ${response.statusText}`);
      }

      const csvData = await response.text();
      logger.info(`✅ Generated CSV report for ${artistName} (${csvData.length} characters)`);
      return csvData;
    } catch (error) {
      logger.error(`❌ Error generating CSV report for ${artistName}:`, error);
      throw error;
    }
  }

  // Liberty Music PR specific methods
  async getLibertyArtistPlays(artistName, campaignStartDate = null) {
    try {
      const fromDate = campaignStartDate || this.getDefaultCampaignStartDate();
      const untilDate = new Date().toISOString().split('T')[0]; // Today

      const playsData = await this.getPlaysForArtist(artistName, fromDate, untilDate);
      return playsData.plays || playsData || [];
    } catch (error) {
      logger.error(`❌ Error getting Liberty plays for ${artistName}:`, error);
      throw error;
    }
  }

  async getCampaignPlaySummary(artistName, campaignStartDate) {
    try {
      const plays = await this.getLibertyArtistPlays(artistName, campaignStartDate);

      // Group plays by station
      const stationPlays = {};
      const totalPlays = plays.length;

      plays.forEach(play => {
        const station = play.radioStation || play.station || 'Unknown Station';
        if (!stationPlays[station]) {
          stationPlays[station] = 0;
        }
        stationPlays[station]++;
      });

      return {
        artistName,
        campaignStartDate,
        totalPlays,
        stationBreakdown: stationPlays,
        plays: plays,
      };
    } catch (error) {
      logger.error(`❌ Error generating campaign summary for ${artistName}:`, error);
      throw error;
    }
  }

  getDefaultCampaignStartDate() {
    // Default to 6 weeks ago (standard campaign length)
    const date = new Date();
    date.setDate(date.getDate() - 42);
    return date.toISOString().split('T')[0];
  }

  /**
   * Generate weekly WARM report and save to Google Drive
   */
  async generateWeeklyReport(artistName, trackName, campaignStartDate, driveAPI, campaignData) {
    const endDate = new Date();
    const startDate = new Date(campaignStartDate);

    // Format dates for WARM API (YYYYMMDD)
    const fromDate = startDate.toISOString().slice(0, 10).replace(/-/g, '');
    const untilDate = endDate.toISOString().slice(0, 10).replace(/-/g, '');

    try {
      logger.info(`📊 Generating weekly WARM report for ${artistName}...`);

      // Get CSV report from WARM API
      const csvData = await this.generateCSVReport(artistName, fromDate, untilDate);

      // Save to Google Drive
      const fileName = `WARM Report - ${artistName} - Week ${this.getWeekNumber(startDate, endDate)}.csv`;

      const file = await driveAPI.files.create({
        requestBody: {
          name: fileName,
          parents: [campaignData.driveFolder.reportsFolder], // Weekly Reports subfolder
        },
        media: {
          mimeType: 'text/csv',
          body: csvData,
        },
      });

      // Make shareable
      await driveAPI.permissions.create({
        fileId: file.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      const reportUrl = `https://drive.google.com/file/d/${file.data.id}/view`;
      logger.success(`✅ Weekly WARM report saved: ${fileName}`);
      logger.info(`📁 Report URL: ${reportUrl}`);

      return reportUrl;
    } catch (error) {
      logger.error('Weekly report generation failed:', error);
      return null;
    }
  }

  /**
   * Calculate week number for campaign
   */
  getWeekNumber(startDate, currentDate) {
    const diffTime = Math.abs(currentDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil(diffDays / 7);
  }

  /**
   * Generate campaign performance summary
   */
  async generateCampaignPerformanceSummary(artistName, campaignStartDate) {
    try {
      logger.info(`📈 Generating campaign performance summary for ${artistName}...`);

      const playsData = await this.getLibertyArtistPlays(artistName, campaignStartDate);
      const plays = playsData.plays || playsData || [];

      if (!plays || plays.length === 0) {
        return {
          artistName,
          campaignStartDate,
          totalPlays: 0,
          stations: [],
          weeklyBreakdown: [],
          summary: 'No plays detected yet',
        };
      }

      // Group plays by week
      const weeklyBreakdown = this.groupPlaysByWeek(plays, campaignStartDate);

      // Get unique stations
      const stations = [
        ...new Set(plays.map(play => play.radioStation || play.station).filter(s => s)),
      ];

      // Calculate performance metrics
      const totalPlays = plays.length;
      const totalStations = stations.length;
      const averagePlaysPerWeek = totalPlays / Math.max(weeklyBreakdown.length, 1);

      const summary = {
        artistName,
        campaignStartDate,
        totalPlays,
        totalStations,
        stations,
        weeklyBreakdown,
        averagePlaysPerWeek: Math.round(averagePlaysPerWeek * 10) / 10,
        performanceRating: this.calculatePerformanceRating(totalPlays, totalStations),
        topStations: this.getTopStations(plays, 3),
      };

      logger.info(`✅ Campaign performance summary generated for ${artistName}`);
      return summary;
    } catch (error) {
      logger.error('Campaign performance summary generation failed:', error);
      throw error;
    }
  }

  /**
   * Group plays by week for performance tracking
   */
  groupPlaysByWeek(plays, campaignStartDate) {
    const weeklyData = {};

    plays.forEach(play => {
      const playDate = new Date(play.date || play.timestamp || new Date());
      const weekNumber = this.getWeekNumber(new Date(campaignStartDate), playDate);

      if (!weeklyData[weekNumber]) {
        weeklyData[weekNumber] = {
          week: weekNumber,
          plays: 0,
          stations: new Set(),
        };
      }

      weeklyData[weekNumber].plays++;
      weeklyData[weekNumber].stations.add(play.radioStation || play.station || 'Unknown');
    });

    return Object.values(weeklyData).map(week => ({
      ...week,
      stations: Array.from(week.stations),
      stationCount: week.stations.size,
    }));
  }

  /**
   * Calculate performance rating based on plays and stations
   */
  calculatePerformanceRating(totalPlays, totalStations) {
    if (totalPlays === 0) return 'No Activity';
    if (totalPlays < 5) return 'Low';
    if (totalPlays < 15) return 'Moderate';
    if (totalPlays < 30) return 'Good';
    if (totalPlays < 50) return 'Strong';
    return 'Excellent';
  }

  /**
   * Get top performing stations
   */
  getTopStations(plays, limit = 3) {
    const stationCounts = {};

    plays.forEach(play => {
      const station = play.radioStation || play.station || 'Unknown';
      stationCounts[station] = (stationCounts[station] || 0) + 1;
    });

    return Object.entries(stationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([station, count]) => ({ station, plays: count }));
  }

  // Health check method
  async healthCheck() {
    try {
      // Try to authenticate directly (skip health endpoint)
      await this.ensureValidToken();

      // Try to get UK radio stations to verify API is working
      const stations = await this.getUKRadioStations();

      this.isAvailable = true;
      return {
        status: 'healthy',
        authenticated: !!this.token,
        tokenExpiry: this.tokenExpiry,
        ukStations: stations.length,
        apiAvailable: true,
        email: this.credentials.email,
        trialActive: true,
      };
    } catch (error) {
      this.isAvailable = false;

      // Check if it's an authentication issue
      if (error.message.includes('403') || error.message.includes('Invalid credentials')) {
        return {
          status: 'auth_failed',
          error: 'Authentication failed - check credentials and trial status',
          details: error.message,
          apiAvailable: true,
          suggestion: 'Verify email/password and ensure 250-song trial is active',
        };
      }

      // Check if it's a network/DNS issue
      if (
        error.code === 'ENOTFOUND' ||
        error.message.includes('fetch failed') ||
        error.message.includes('Cannot resolve host')
      ) {
        return {
          status: 'domain_unavailable',
          error: 'WARM API domain not found - API endpoint may have changed',
          details: error.message,
          apiAvailable: false,
          suggestion:
            'Contact WARM support to verify current API endpoint URL. The domain public-api.warmmusic.net appears to be unavailable.',
        };
      }

      return {
        status: 'unhealthy',
        error: error.message,
        apiAvailable: false,
        details: error.message,
      };
    }
  }
}

// Mock WARM API for testing when real API is not available
class MockWarmusicAPI {
  constructor() {
    this.mockPlaysData = {
      totalNumberOfEntities: 8,
      currentPagesEntities: [
        {
          radioStationName: 'BBC Radio 6 Music',
          playDateTime: '2025-09-12T14:30:00Z',
          artistName: 'Test Artist',
          trackName: 'Test Track',
        },
        {
          radioStationName: 'Amazing Radio',
          playDateTime: '2025-09-12T16:45:00Z',
          artistName: 'Test Artist',
          trackName: 'Test Track',
        },
        {
          radioStationName: 'Absolute Radio',
          playDateTime: '2025-09-11T20:15:00Z',
          artistName: 'Test Artist',
          trackName: 'Test Track',
        },
      ],
    };
  }

  async authenticate() {
    console.log('🧪 Using mock WARM API for testing');
    this.token = 'mock-jwt-token';
    this.tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
    return this.token;
  }

  async ensureValidToken() {
    if (!this.token) await this.authenticate();
    return this.token;
  }

  async getPlaysForArtist(artistName, fromDate, untilDate) {
    await this.ensureValidToken();

    // Simulate some artists having plays, others not
    const hasPlays = Math.random() > 0.6; // 40% chance of plays

    if (hasPlays) {
      const mockData = JSON.parse(JSON.stringify(this.mockPlaysData));
      mockData.currentPagesEntities.forEach(play => {
        play.artistName = artistName;
      });

      console.log(`🎵 MOCK WARM: ${artistName} - ${mockData.totalNumberOfEntities} plays found`);
      return mockData;
    } else {
      console.log(`🎵 MOCK WARM: ${artistName} - 0 plays found`);
      return { totalNumberOfEntities: 0, currentPagesEntities: [] };
    }
  }

  async getUKRadioStations() {
    await this.ensureValidToken();

    const mockStations = [
      { name: 'BBC Radio 1', countryCode: 'GB', isMonitored: true },
      { name: 'BBC Radio 6 Music', countryCode: 'GB', isMonitored: true },
      { name: 'Amazing Radio', countryCode: 'GB', isMonitored: true },
      { name: 'Absolute Radio', countryCode: 'GB', isMonitored: true },
      { name: 'Capital FM', countryCode: 'GB', isMonitored: true },
    ];

    console.log(`📻 MOCK WARM: Found ${mockStations.length} UK radio stations`);
    return mockStations;
  }

  async generateCSVReport(artistName, fromDate, untilDate) {
    await this.ensureValidToken();

    const csvData = `Date,Station,Artist,Track,Time
2025-09-12,BBC Radio 6 Music,${artistName},Test Track,14:30
2025-09-12,Amazing Radio,${artistName},Test Track,16:45
2025-09-11,Absolute Radio,${artistName},Test Track,20:15`;

    console.log(`📊 MOCK WARM: Generated CSV report for ${artistName}`);
    return csvData;
  }

  formatDateForWARM(date) {
    return date.toISOString().slice(0, 10).replace(/-/g, '');
  }

  async healthCheck() {
    return {
      status: 'healthy',
      authenticated: true,
      tokenExpiry: this.tokenExpiry,
      ukStations: 5,
      apiAvailable: true,
      email: 'mock@test.com',
      trialActive: true,
      mockMode: true,
    };
  }

  async generateWeeklyReport(
    artistName,
    trackName,
    campaignStartDate,
    driveAPI = null,
    campaignData = null
  ) {
    await this.ensureValidToken();

    const csvData = await this.generateCSVReport(artistName, campaignStartDate, new Date());
    const fileName = `MOCK WARM Report - ${artistName} - Week ${this.getWeekNumber(new Date(campaignStartDate), new Date())}.csv`;

    console.log(`📊 MOCK WARM: Generated weekly report for ${artistName}`);
    console.log(`📁 MOCK WARM: Would save to Google Drive as: ${fileName}`);

    // Return mock URL
    return `https://drive.google.com/mock/file/d/mock-report-id/view`;
  }

  getWeekNumber(startDate, currentDate) {
    const diffTime = Math.abs(currentDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil(diffDays / 7);
  }

  async generateCampaignPerformanceSummary(artistName, campaignStartDate) {
    await this.ensureValidToken();

    const mockSummary = {
      artistName: artistName,
      campaignStartDate: campaignStartDate,
      totalPlays: 8,
      uniqueStations: 3,
      weeklyBreakdown: [
        { week: 1, plays: 3, stations: 2 },
        { week: 2, plays: 5, stations: 3 },
      ],
      performanceRating: 'Good',
      topStations: [
        { station: 'BBC Radio 6 Music', plays: 4 },
        { station: 'Amazing Radio', plays: 3 },
        { station: 'Absolute Radio', plays: 1 },
      ],
    };

    console.log(`📈 MOCK WARM: Generated performance summary for ${artistName}`);
    return mockSummary;
  }

  groupPlaysByWeek(plays, startDate) {
    // Mock implementation
    return [
      { week: 1, plays: 3, stations: 2 },
      { week: 2, plays: 5, stations: 3 },
    ];
  }

  calculatePerformanceRating(totalPlays, weeks) {
    const playsPerWeek = totalPlays / weeks;
    if (playsPerWeek >= 5) return 'Excellent';
    if (playsPerWeek >= 3) return 'Good';
    if (playsPerWeek >= 1) return 'Fair';
    return 'Poor';
  }

  getTopStations(plays, limit = 5) {
    // Mock implementation
    return [
      { station: 'BBC Radio 6 Music', plays: 4 },
      { station: 'Amazing Radio', plays: 3 },
      { station: 'Absolute Radio', plays: 1 },
    ];
  }
}

module.exports = WarmusicAPI;
module.exports.MockWarmusicAPI = MockWarmusicAPI;
