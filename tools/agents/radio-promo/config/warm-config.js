#!/usr/bin/env node

/**
 * WARM API Configuration
 *
 * Critical integration for real-time radio play tracking
 * The game-changing breakthrough that enables automated monitoring
 * Core differentiator for the Liberty Radio Promo system
 */

class WarmConfig {
  constructor() {
    this.version = '1.0.0';

    // WARM API connection settings
    this.apiConfig = {
      baseUrl: process.env.WARM_API_URL || 'https://api.warm-music.com',
      apiKey: process.env.WARM_API_KEY,
      version: 'v2',
      timeout: 30000, // 30 seconds
      retryAttempts: 3,
      retryDelay: 2000, // 2 seconds between retries
      rateLimitDelay: 1000, // 1 second between requests
    };

    // API endpoints
    this.endpoints = {
      // Track management
      tracks: {
        search: '/tracks/search',
        register: '/tracks/register',
        details: '/tracks/{trackId}',
        update: '/tracks/{trackId}',
        delete: '/tracks/{trackId}',
      },

      // Play tracking
      plays: {
        recent: '/plays/recent',
        byTrack: '/plays/track/{trackId}',
        byArtist: '/plays/artist/{artistId}',
        byStation: '/plays/station/{stationId}',
        dateRange: '/plays/range',
        live: '/plays/live',
        summary: '/plays/summary',
      },

      // Station information
      stations: {
        list: '/stations',
        details: '/stations/{stationId}',
        search: '/stations/search',
        coverage: '/stations/coverage',
        genres: '/stations/genres',
      },

      // Analytics and reporting
      analytics: {
        overview: '/analytics/overview',
        trends: '/analytics/trends',
        comparison: '/analytics/comparison',
        demographics: '/analytics/demographics',
        reach: '/analytics/reach',
        performance: '/analytics/performance',
      },

      // Real-time monitoring
      monitoring: {
        status: '/monitoring/status',
        alerts: '/monitoring/alerts',
        websocket: '/monitoring/stream',
        notifications: '/monitoring/notifications',
      },

      // Playlists and charts
      charts: {
        current: '/charts/current',
        historical: '/charts/historical',
        genre: '/charts/genre/{genre}',
        regional: '/charts/regional/{region}',
      },
    };

    // Notification thresholds for milestone alerts
    this.notificationThresholds = {
      // Play count milestones
      playMilestones: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000],

      // Daily play thresholds
      dailyThresholds: [5, 10, 25, 50, 100],

      // Weekly play thresholds
      weeklyThresholds: [25, 50, 100, 250, 500],

      // Station count milestones
      stationMilestones: [1, 5, 10, 25, 50, 100],

      // Coverage percentage milestones
      coverageMilestones: [1, 5, 10, 25, 50, 75],

      // Trending thresholds
      trendingThresholds: {
        velocityIncrease: 50, // % increase over 24h
        chartMovement: 10, // positions up in charts
        newStationRate: 5, // new stations per day
      },
    };

    // UK radio station categories and priorities
    this.stationCategories = {
      tier1_commercial: {
        name: 'Tier 1 Commercial',
        priority: 'critical',
        examples: ['BBC Radio 1', 'BBC Radio 2', 'Capital FM', 'Heart', 'Absolute Radio'],
        reach: 'national',
        importance: 100,
        notificationLevel: 'immediate',
      },

      tier2_commercial: {
        name: 'Tier 2 Commercial',
        priority: 'high',
        examples: ['Kiss FM', 'Magic', 'Classic FM', 'Smooth', 'LBC'],
        reach: 'national',
        importance: 80,
        notificationLevel: 'high',
      },

      regional_commercial: {
        name: 'Regional Commercial',
        priority: 'medium',
        examples: ['Key 103', 'Radio City', 'Clyde 1', 'Cool FM', 'Wave 105'],
        reach: 'regional',
        importance: 60,
        notificationLevel: 'standard',
      },

      bbc_local: {
        name: 'BBC Local',
        priority: 'medium',
        examples: ['BBC Radio Manchester', 'BBC Radio London', 'BBC Radio Scotland'],
        reach: 'regional',
        importance: 70,
        notificationLevel: 'standard',
      },

      specialist_shows: {
        name: 'Specialist Shows',
        priority: 'high',
        examples: ['BBC 6 Music', 'BBC Radio 1Xtra', 'Kerrang! Radio'],
        reach: 'specialist',
        importance: 90,
        notificationLevel: 'high',
      },

      online_stations: {
        name: 'Online Stations',
        priority: 'medium',
        examples: ['Amazing Radio', 'Boom Radio', 'Union JACK'],
        reach: 'online',
        importance: 50,
        notificationLevel: 'standard',
      },

      community_radio: {
        name: 'Community Radio',
        priority: 'low',
        examples: ['Community stations', 'Hospital radio', 'Student radio'],
        reach: 'local',
        importance: 30,
        notificationLevel: 'low',
      },
    };

    // Genre-specific targeting configuration
    this.genreTargeting = {
      electronic: {
        primaryStations: ['BBC Radio 1', 'BBC Radio 1Xtra', 'Kiss FM'],
        specialistShows: ['BBC Radio 1 Dance', 'Ministry of Sound Radio'],
        onlineStations: ['Amazing Radio', 'Rinse FM'],
        optimalTimes: ['22:00-02:00', '18:00-20:00'],
        demographics: ['16-34'],
      },

      indie: {
        primaryStations: ['BBC 6 Music', 'BBC Radio 2', 'Absolute Radio'],
        specialistShows: ['BBC Introducing', 'Amazing Radio'],
        communityFocus: true,
        optimalTimes: ['08:00-10:00', '17:00-19:00'],
        demographics: ['25-44'],
      },

      pop: {
        primaryStations: ['BBC Radio 1', 'BBC Radio 2', 'Capital FM', 'Heart'],
        massMarket: true,
        optimalTimes: ['07:00-09:00', '16:00-18:00'],
        demographics: ['16-44'],
      },

      rock: {
        primaryStations: ['Kerrang!', 'Planet Rock', 'Absolute Radio'],
        specialistShows: ['BBC Radio 2 Rock Show'],
        demographics: ['25-54'],
        optimalTimes: ['19:00-22:00'],
      },

      hip_hop: {
        primaryStations: ['BBC Radio 1Xtra', 'Kiss FM', 'Capital XTRA'],
        specialistShows: ['BBC Radio 1 Hip Hop Show'],
        demographics: ['16-34'],
        optimalTimes: ['19:00-23:00'],
      },
    };

    // Tracking configuration presets
    this.trackingPresets = {
      standard_campaign: {
        name: 'Standard Campaign Tracking',
        duration: 30, // days
        checkFrequency: 4, // times per day
        notifications: {
          playMilestones: [10, 50, 100, 500, 1000],
          dailyReports: true,
          weeklyReports: true,
          realTimeAlerts: false,
        },
        analytics: {
          trendsAnalysis: true,
          competitorTracking: false,
          demographicAnalysis: true,
        },
      },

      rush_campaign: {
        name: 'Rush Campaign Tracking',
        duration: 14, // days
        checkFrequency: 12, // times per day
        notifications: {
          playMilestones: [1, 5, 10, 25, 50, 100],
          dailyReports: true,
          realTimeAlerts: true,
          immediateNotifications: true,
        },
        analytics: {
          trendsAnalysis: true,
          competitorTracking: true,
          hourlyReports: true,
        },
      },

      premium_campaign: {
        name: 'Premium Campaign Tracking',
        duration: 60, // days
        checkFrequency: 6, // times per day
        notifications: {
          playMilestones: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
          dailyReports: true,
          weeklyReports: true,
          monthlyReports: true,
          realTimeAlerts: true,
        },
        analytics: {
          trendsAnalysis: true,
          competitorTracking: true,
          demographicAnalysis: true,
          marketAnalysis: true,
          predictiveAnalysis: true,
        },
      },

      monitoring_only: {
        name: 'Basic Monitoring',
        duration: 90, // days
        checkFrequency: 1, // once per day
        notifications: {
          playMilestones: [100, 500, 1000],
          weeklyReports: true,
          realTimeAlerts: false,
        },
        analytics: {
          trendsAnalysis: false,
          basicReporting: true,
        },
      },
    };

    // Chart and trending configurations
    this.chartConfig = {
      updateFrequency: 'daily',
      regions: ['uk', 'england', 'scotland', 'wales', 'northern_ireland'],
      genres: ['all', 'pop', 'rock', 'electronic', 'indie', 'hip_hop', 'country'],
      chartTypes: ['plays', 'stations', 'reach', 'trending'],
      historicalPeriods: [7, 14, 30, 90, 365], // days
    };

    // Performance benchmarks for analysis
    this.benchmarks = {
      new_artist: {
        plays: { good: 50, excellent: 100 },
        stations: { good: 5, excellent: 10 },
        reach: { good: 10000, excellent: 25000 },
      },

      established_artist: {
        plays: { good: 200, excellent: 500 },
        stations: { good: 15, excellent: 30 },
        reach: { good: 50000, excellent: 100000 },
      },

      major_artist: {
        plays: { good: 1000, excellent: 2500 },
        stations: { good: 50, excellent: 100 },
        reach: { good: 250000, excellent: 500000 },
      },
    };

    // Error handling and fallback configuration
    this.errorHandling = {
      maxRetries: 3,
      backoffMultiplier: 2,
      fallbackMethods: ['cache_data', 'estimated_tracking', 'manual_verification'],
      criticalErrors: ['api_key_invalid', 'track_not_found', 'quota_exceeded'],
      recoveryStrategies: {
        rate_limit: 'exponential_backoff',
        server_error: 'retry_with_delay',
        network_error: 'fallback_to_cache',
        auth_error: 'refresh_credentials',
      },
    };

    // WebSocket configuration for real-time updates
    this.websocketConfig = {
      url: process.env.WARM_WEBSOCKET_URL || 'wss://stream.warm-music.com',
      autoReconnect: true,
      reconnectDelay: 5000,
      maxReconnectAttempts: 10,
      pingInterval: 30000,
      subscriptionTypes: ['track_plays', 'station_updates', 'chart_changes', 'trending_alerts'],
    };
  }

  /**
   * Get API configuration
   */
  getApiConfig() {
    return { ...this.apiConfig };
  }

  /**
   * Get endpoint URL
   */
  getEndpoint(category, endpoint, params = {}) {
    const categoryEndpoints = this.endpoints[category];
    if (!categoryEndpoints) {
      throw new Error(`Category '${category}' not found`);
    }

    let url = categoryEndpoints[endpoint];
    if (!url) {
      throw new Error(`Endpoint '${endpoint}' not found in category '${category}'`);
    }

    // Replace path parameters
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, value);
    });

    return `${this.apiConfig.baseUrl}${url}`;
  }

  /**
   * Get notification configuration for campaign type
   */
  getNotificationConfig(campaignType = 'standard_campaign') {
    const preset = this.trackingPresets[campaignType];
    if (!preset) {
      return this.trackingPresets['standard_campaign'].notifications;
    }

    return preset.notifications;
  }

  /**
   * Get tracking preset
   */
  getTrackingPreset(presetName) {
    return this.trackingPresets[presetName] || this.trackingPresets['standard_campaign'];
  }

  /**
   * Get station category information
   */
  getStationCategory(categoryName) {
    return this.stationCategories[categoryName];
  }

  /**
   * Get genre targeting configuration
   */
  getGenreTargeting(genre) {
    return (
      this.genreTargeting[genre.toLowerCase()] || {
        primaryStations: ['BBC Radio 1', 'BBC Radio 2'],
        demographics: ['16-44'],
        optimalTimes: ['08:00-10:00', '17:00-19:00'],
      }
    );
  }

  /**
   * Get performance benchmarks for artist type
   */
  getBenchmarks(artistType = 'new_artist') {
    return this.benchmarks[artistType] || this.benchmarks['new_artist'];
  }

  /**
   * Build tracking configuration for campaign
   */
  buildTrackingConfig(campaignData, options = {}) {
    const preset = options.preset || this.determineOptimalPreset(campaignData);
    const baseConfig = this.getTrackingPreset(preset);

    // Customise based on campaign data
    const trackingConfig = {
      ...baseConfig,
      trackInfo: {
        artistName: campaignData.artistName,
        trackTitle: campaignData.trackTitle,
        genre: campaignData.genre,
        releaseDate: campaignData.releaseDate,
      },
      targeting: this.getGenreTargeting(campaignData.genre),
      benchmarks: this.getBenchmarks(options.artistType),
      notifications: {
        ...baseConfig.notifications,
        ...options.notifications,
      },
    };

    return trackingConfig;
  }

  /**
   * Determine optimal tracking preset based on campaign data
   */
  determineOptimalPreset(campaignData) {
    // Rush campaign indicators
    if (campaignData.priority === 'critical' || campaignData.campaignType === 'rush') {
      return 'rush_campaign';
    }

    // Premium campaign indicators
    if (campaignData.budget && parseFloat(campaignData.budget.replace(/[£$,]/g, '')) > 5000) {
      return 'premium_campaign';
    }

    // Default to standard
    return 'standard_campaign';
  }

  /**
   * Validate API configuration
   */
  validateConfig() {
    const issues = [];

    if (!this.apiConfig.apiKey) {
      issues.push('WARM_API_KEY environment variable not set');
    }

    if (!this.apiConfig.baseUrl) {
      issues.push('WARM API base URL not configured');
    }

    if (issues.length > 0) {
      throw new Error(`WARM API configuration issues: ${issues.join(', ')}`);
    }

    return true;
  }

  /**
   * Get WebSocket configuration
   */
  getWebSocketConfig() {
    return { ...this.websocketConfig };
  }

  /**
   * Get error handling configuration
   */
  getErrorHandling() {
    return { ...this.errorHandling };
  }

  /**
   * Get chart configuration
   */
  getChartConfig() {
    return { ...this.chartConfig };
  }

  /**
   * Generate API headers
   */
  generateHeaders(additionalHeaders = {}) {
    return {
      Authorization: `Bearer ${this.apiConfig.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Liberty-Music-PR-v1.0',
      'X-API-Version': this.apiConfig.version,
      ...additionalHeaders,
    };
  }

  /**
   * Build query parameters for API requests
   */
  buildQueryParams(params = {}) {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, value);
        }
      }
    });

    return queryParams.toString();
  }

  /**
   * Get milestone notification settings
   */
  getMilestoneSettings(campaignType = 'standard_campaign') {
    const preset = this.getTrackingPreset(campaignType);

    return {
      playMilestones:
        preset.notifications.playMilestones || this.notificationThresholds.playMilestones,
      stationMilestones: this.notificationThresholds.stationMilestones,
      coverageMilestones: this.notificationThresholds.coverageMilestones,
      trendingThresholds: this.notificationThresholds.trendingThresholds,
    };
  }

  /**
   * Get optimal check frequency based on campaign urgency
   */
  getCheckFrequency(campaignType = 'standard_campaign') {
    const preset = this.getTrackingPreset(campaignType);
    return preset.checkFrequency || 4; // times per day
  }

  /**
   * Get complete configuration summary
   */
  getConfigSummary() {
    return {
      version: this.version,
      apiConfig: {
        baseUrl: this.apiConfig.baseUrl,
        hasApiKey: !!this.apiConfig.apiKey,
        version: this.apiConfig.version,
      },
      trackingPresets: Object.keys(this.trackingPresets),
      stationCategories: Object.keys(this.stationCategories),
      genreTargeting: Object.keys(this.genreTargeting),
      endpointCategories: Object.keys(this.endpoints),
      notificationTypes: Object.keys(this.notificationThresholds),
    };
  }
}

module.exports = WarmConfig;
