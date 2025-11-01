#!/usr/bin/env node

/**
 * Success Prediction Engine
 *
 * Predicts campaign success before launching
 * Analyzes track characteristics, contact quality, and historical data
 * Suggests budget allocation for maximum ROI
 */

const fs = require('fs');
const path = require('path');

class SuccessPredictionEngine {
  constructor() {
    this.historicalData = new Map();
    this.predictionModels = new Map();
    this.successFactors = this.initializeSuccessFactors();

    // Data persistence
    this.dataFile = path.join(__dirname, '..', 'data', 'prediction-data.json');
    this.loadData();

    // Initialize prediction models
    this.initializeModels();
  }

  /**
   * Initialize success factors and their weights
   */
  initializeSuccessFactors() {
    return {
      // Track characteristics (40% weight)
      track: {
        genre: { weight: 0.15, factors: ['popularity', 'trending', 'radio_friendly'] },
        quality: { weight: 0.1, factors: ['production', 'mixing', 'mastering'] },
        uniqueness: { weight: 0.08, factors: ['originality', 'memorability', 'catchiness'] },
        length: { weight: 0.07, factors: ['radio_optimal', 'attention_span'] },
      },

      // Contact quality (30% weight)
      contacts: {
        station_importance: { weight: 0.12, factors: ['reach', 'influence', 'market_share'] },
        genre_match: { weight: 0.1, factors: ['genre_alignment', 'audience_match'] },
        relationship_strength: {
          weight: 0.08,
          factors: ['previous_success', 'response_rate', 'engagement'],
        },
      },

      // Campaign strategy (20% weight)
      strategy: {
        timing: { weight: 0.08, factors: ['release_timing', 'competition', 'seasonality'] },
        budget: { weight: 0.07, factors: ['budget_adequacy', 'resource_allocation'] },
        approach: { weight: 0.05, factors: ['personalization', 'follow_up_strategy'] },
      },

      // External factors (10% weight)
      external: {
        market_conditions: { weight: 0.05, factors: ['industry_trends', 'economic_climate'] },
        competition: { weight: 0.03, factors: ['competing_releases', 'market_saturation'] },
        seasonality: { weight: 0.02, factors: ['holiday_effects', 'listening_patterns'] },
      },
    };
  }

  /**
   * Initialize prediction models
   */
  initializeModels() {
    // Genre success model
    this.predictionModels.set('genre', {
      Electronic: { base_score: 0.7, factors: { trending: 0.8, radio_friendly: 0.6 } },
      Pop: { base_score: 0.8, factors: { trending: 0.9, radio_friendly: 0.9 } },
      Rock: { base_score: 0.6, factors: { trending: 0.5, radio_friendly: 0.7 } },
      'Hip-Hop': { base_score: 0.7, factors: { trending: 0.8, radio_friendly: 0.5 } },
      Indie: { base_score: 0.5, factors: { trending: 0.6, radio_friendly: 0.6 } },
      Alternative: { base_score: 0.6, factors: { trending: 0.7, radio_friendly: 0.7 } },
    });

    // Station importance model
    this.predictionModels.set('station_importance', {
      'BBC Radio 1': { score: 0.95, reach: 10000000, influence: 0.9 },
      'BBC Radio 2': { score: 0.9, reach: 15000000, influence: 0.8 },
      'Capital FM': { score: 0.85, reach: 8000000, influence: 0.7 },
      'Kiss FM': { score: 0.8, reach: 5000000, influence: 0.6 },
      'Radio X': { score: 0.75, reach: 3000000, influence: 0.5 },
      Regional: { score: 0.6, reach: 500000, influence: 0.4 },
      Local: { score: 0.4, reach: 100000, influence: 0.3 },
    });

    // Timing model
    this.predictionModels.set('timing', {
      Monday: { score: 0.6, factors: { competition: 0.8, listener_engagement: 0.5 } },
      Tuesday: { score: 0.7, factors: { competition: 0.7, listener_engagement: 0.6 } },
      Wednesday: { score: 0.8, factors: { competition: 0.6, listener_engagement: 0.7 } },
      Thursday: { score: 0.9, factors: { competition: 0.5, listener_engagement: 0.8 } },
      Friday: { score: 0.8, factors: { competition: 0.7, listener_engagement: 0.9 } },
      Saturday: { score: 0.6, factors: { competition: 0.4, listener_engagement: 0.6 } },
      Sunday: { score: 0.5, factors: { competition: 0.3, listener_engagement: 0.5 } },
    });
  }

  /**
   * Predict campaign success
   */
  async predictCampaignSuccess(campaignData, contacts, options = {}) {
    console.log(`🔮 Predicting success for campaign: ${campaignData.campaignId}`);

    try {
      // Calculate individual factor scores
      const trackScore = this.calculateTrackScore(campaignData);
      const contactScore = this.calculateContactScore(contacts);
      const strategyScore = this.calculateStrategyScore(campaignData, options);
      const externalScore = this.calculateExternalScore(campaignData);

      // Calculate weighted overall score
      const overallScore = this.calculateOverallScore({
        track: trackScore,
        contacts: contactScore,
        strategy: strategyScore,
        external: externalScore,
      });

      // Generate predictions
      const predictions = {
        overallScore,
        successProbability: this.convertScoreToProbability(overallScore),
        expectedPlays: this.predictExpectedPlays(overallScore, contacts.length),
        expectedROI: this.predictROI(overallScore, campaignData.budget || 0),
        riskLevel: this.assessRiskLevel(overallScore),
        recommendations: this.generateRecommendations({
          track: trackScore,
          contacts: contactScore,
          strategy: strategyScore,
          external: externalScore,
        }),
        factorBreakdown: {
          track: trackScore,
          contacts: contactScore,
          strategy: strategyScore,
          external: externalScore,
        },
        confidence: this.calculateConfidence(overallScore),
        timestamp: Date.now(),
      };

      // Store prediction for learning
      this.storePrediction(campaignData.campaignId, predictions, campaignData, contacts);

      console.log(
        `✅ Success prediction complete: ${Math.round(predictions.successProbability * 100)}% probability`
      );

      return predictions;
    } catch (error) {
      console.error('❌ Failed to predict campaign success:', error.message);
      throw error;
    }
  }

  /**
   * Calculate track score
   */
  calculateTrackScore(campaignData) {
    const genre = campaignData.genre || 'Unknown';
    const genreModel = this.predictionModels.get('genre')[genre] || {
      base_score: 0.5,
      factors: {},
    };

    // Base genre score
    let score = genreModel.base_score;

    // Adjust based on track characteristics
    if (campaignData.trackLength) {
      const optimalLength = 180; // 3 minutes
      const lengthDiff = Math.abs(campaignData.trackLength - optimalLength);
      const lengthScore = Math.max(0, 1 - lengthDiff / 120); // Penalty for being far from optimal
      score += lengthScore * 0.1;
    }

    // Quality indicators
    if (campaignData.hasPressKit) score += 0.05;
    if (campaignData.hasHighQualityAudio) score += 0.05;
    if (campaignData.hasProfessionalPhotos) score += 0.03;
    if (campaignData.hasSocialMedia) score += 0.02;

    // Uniqueness factors
    if (campaignData.isOriginal) score += 0.05;
    if (campaignData.hasUniqueElements) score += 0.03;

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Calculate contact score
   */
  calculateContactScore(contacts) {
    if (!contacts || contacts.length === 0) return 0;

    let totalScore = 0;
    let validContacts = 0;

    for (const contact of contacts) {
      const stationScore = this.getStationImportanceScore(contact.station || contact.stationName);
      const genreMatch = this.calculateGenreMatch(contact.genre, contact.preferredGenres);
      const relationshipScore = this.calculateRelationshipScore(contact);

      const contactScore = stationScore * 0.5 + genreMatch * 0.3 + relationshipScore * 0.2;
      totalScore += contactScore;
      validContacts++;
    }

    return validContacts > 0 ? totalScore / validContacts : 0;
  }

  /**
   * Get station importance score
   */
  getStationImportanceScore(stationName) {
    if (!stationName) return 0.5;

    const stationModel = this.predictionModels.get('station_importance');

    // Try exact match first
    if (stationModel[stationName]) {
      return stationModel[stationName].score;
    }

    // Try partial matches
    for (const [station, data] of Object.entries(stationModel)) {
      if (
        stationName.toLowerCase().includes(station.toLowerCase()) ||
        station.toLowerCase().includes(stationName.toLowerCase())
      ) {
        return data.score;
      }
    }

    // Default to medium importance
    return 0.6;
  }

  /**
   * Calculate genre match
   */
  calculateGenreMatch(contactGenre, preferredGenres) {
    if (!contactGenre || !preferredGenres) return 0.5;

    const genres = Array.isArray(preferredGenres) ? preferredGenres : [preferredGenres];
    return genres.includes(contactGenre) ? 1.0 : 0.3;
  }

  /**
   * Calculate relationship score
   */
  calculateRelationshipScore(contact) {
    let score = 0.5; // Base score for new contacts

    // Previous success
    if (contact.previousSuccess) score += 0.2;
    if (contact.responseRate > 0.5) score += 0.2;
    if (contact.engagement > 0.7) score += 0.1;

    // Contact quality indicators
    if (contact.hasEmail) score += 0.05;
    if (contact.hasPhone) score += 0.05;
    if (contact.hasSocialMedia) score += 0.05;

    return Math.min(1, score);
  }

  /**
   * Calculate strategy score
   */
  calculateStrategyScore(campaignData, options) {
    let score = 0.5;

    // Timing
    const dayOfWeek = new Date(campaignData.startDate || Date.now()).getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timingModel = this.predictionModels.get('timing');
    const timingScore = timingModel[dayNames[dayOfWeek]]?.score || 0.5;
    score += timingScore * 0.3;

    // Budget adequacy
    const budget = campaignData.budget || 0;
    const contactCount = options.contactCount || 10;
    const budgetPerContact = budget / contactCount;

    if (budgetPerContact > 50) score += 0.2;
    else if (budgetPerContact > 25) score += 0.1;
    else if (budgetPerContact < 10) score -= 0.1;

    // Approach quality
    if (options.personalization) score += 0.1;
    if (options.followUpStrategy) score += 0.1;
    if (options.tracking) score += 0.05;

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Calculate external factors score
   */
  calculateExternalScore(campaignData) {
    let score = 0.5;

    // Seasonality
    const month = new Date(campaignData.startDate || Date.now()).getMonth();
    const seasonalFactors = {
      0: 0.8, // January - New year, fresh start
      1: 0.7, // February - Valentine's
      2: 0.6, // March - Spring
      3: 0.7, // April - Easter
      4: 0.8, // May - Spring peak
      5: 0.9, // June - Summer start
      6: 0.8, // July - Summer
      7: 0.7, // August - Summer holidays
      8: 0.6, // September - Back to school
      9: 0.7, // October - Autumn
      10: 0.6, // November - Pre-holiday
      11: 0.8, // December - Holiday season
    };

    score += seasonalFactors[month] * 0.3;

    // Market conditions (simplified)
    score += 0.2; // Assume stable market

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Calculate overall weighted score
   */
  calculateOverallScore(factorScores) {
    const weights = {
      track: 0.4,
      contacts: 0.3,
      strategy: 0.2,
      external: 0.1,
    };

    let weightedScore = 0;
    Object.entries(weights).forEach(([factor, weight]) => {
      weightedScore += factorScores[factor] * weight;
    });

    return weightedScore;
  }

  /**
   * Convert score to probability
   */
  convertScoreToProbability(score) {
    // Use sigmoid function for probability conversion
    return 1 / (1 + Math.exp(-10 * (score - 0.5)));
  }

  /**
   * Predict expected plays
   */
  predictExpectedPlays(score, contactCount) {
    const basePlays = contactCount * 0.1; // 10% base success rate
    const scoreMultiplier = score * 2; // Scale by score
    return Math.round(basePlays * scoreMultiplier);
  }

  /**
   * Predict ROI
   */
  predictROI(score, budget) {
    if (budget === 0) return 0;

    const expectedPlays = this.predictExpectedPlays(score, 10); // Assume 10 contacts
    const valuePerPlay = 50; // Estimated value per play
    const expectedValue = expectedPlays * valuePerPlay;

    return (expectedValue - budget) / budget;
  }

  /**
   * Assess risk level
   */
  assessRiskLevel(score) {
    if (score >= 0.8) return 'low';
    if (score >= 0.6) return 'medium';
    if (score >= 0.4) return 'high';
    return 'very_high';
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(factorScores) {
    const recommendations = [];

    // Track recommendations
    if (factorScores.track < 0.6) {
      recommendations.push({
        category: 'track',
        priority: 'high',
        message: 'Improve track quality and ensure professional production',
        actions: [
          'Get professional mastering',
          'Create high-quality press kit',
          'Ensure radio-friendly length (3-4 minutes)',
        ],
      });
    }

    // Contact recommendations
    if (factorScores.contacts < 0.6) {
      recommendations.push({
        category: 'contacts',
        priority: 'high',
        message: 'Focus on higher-quality contacts and better targeting',
        actions: [
          'Target more influential stations',
          'Improve genre matching',
          'Build stronger relationships',
        ],
      });
    }

    // Strategy recommendations
    if (factorScores.strategy < 0.6) {
      recommendations.push({
        category: 'strategy',
        priority: 'medium',
        message: 'Optimize campaign timing and approach',
        actions: [
          'Choose better launch timing',
          'Increase budget per contact',
          'Improve personalization',
        ],
      });
    }

    // External recommendations
    if (factorScores.external < 0.6) {
      recommendations.push({
        category: 'external',
        priority: 'low',
        message: 'Consider market conditions and timing',
        actions: [
          'Wait for better market conditions',
          'Consider seasonal factors',
          'Monitor competition',
        ],
      });
    }

    return recommendations;
  }

  /**
   * Calculate confidence level
   */
  calculateConfidence(score) {
    // Higher confidence for scores closer to 0.5 (more certain)
    // Lower confidence for extreme scores (less certain)
    const distanceFromCenter = Math.abs(score - 0.5);
    return Math.max(0.1, 1 - distanceFromCenter * 2);
  }

  /**
   * Store prediction for learning
   */
  storePrediction(campaignId, prediction, campaignData, contacts) {
    this.historicalData.set(campaignId, {
      prediction,
      campaignData,
      contacts,
      timestamp: Date.now(),
    });

    this.saveData();
  }

  /**
   * Learn from campaign results
   */
  learnFromResults(campaignId, actualResults) {
    const historical = this.historicalData.get(campaignId);
    if (!historical) return;

    const prediction = historical.prediction;
    const accuracy = this.calculateAccuracy(prediction, actualResults);

    // Update models based on accuracy
    this.updateModels(historical, actualResults, accuracy);

    console.log(`📚 Learned from campaign ${campaignId}: ${Math.round(accuracy * 100)}% accuracy`);
  }

  /**
   * Calculate prediction accuracy
   */
  calculateAccuracy(prediction, actualResults) {
    const predictedPlays = prediction.expectedPlays;
    const actualPlays = actualResults.totalPlays || 0;

    if (predictedPlays === 0 && actualPlays === 0) return 1.0;
    if (predictedPlays === 0 || actualPlays === 0) return 0.0;

    const error = Math.abs(predictedPlays - actualPlays) / Math.max(predictedPlays, actualPlays);
    return Math.max(0, 1 - error);
  }

  /**
   * Update models based on results
   */
  updateModels(historical, actualResults, accuracy) {
    // This would implement machine learning updates
    // For now, just log the learning
    console.log(`🧠 Updating models with accuracy: ${Math.round(accuracy * 100)}%`);
  }

  /**
   * Get prediction analytics
   */
  getPredictionAnalytics() {
    const predictions = Array.from(this.historicalData.values());
    const totalPredictions = predictions.length;

    if (totalPredictions === 0) {
      return {
        totalPredictions: 0,
        averageAccuracy: 0,
        averageConfidence: 0,
        successRate: 0,
      };
    }

    const averageAccuracy =
      predictions.reduce((sum, p) => sum + (p.accuracy || 0), 0) / totalPredictions;
    const averageConfidence =
      predictions.reduce((sum, p) => sum + p.prediction.confidence, 0) / totalPredictions;
    const successRate = predictions.filter(p => p.accuracy > 0.7).length / totalPredictions;

    return {
      totalPredictions,
      averageAccuracy,
      averageConfidence,
      successRate,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Data persistence
   */
  loadData() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = JSON.parse(fs.readFileSync(this.dataFile, 'utf8'));
        this.historicalData = new Map(data.historicalData || []);
        console.log(`📚 Loaded prediction data: ${this.historicalData.size} campaigns`);
      }
    } catch (error) {
      console.error('⚠️  Failed to load prediction data:', error.message);
    }
  }

  saveData() {
    try {
      const dataDir = path.dirname(this.dataFile);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const data = {
        historicalData: Array.from(this.historicalData.entries()),
        lastSaved: Date.now(),
      };

      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('❌ Failed to save prediction data:', error.message);
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    const analytics = this.getPredictionAnalytics();

    return {
      status: 'healthy',
      totalPredictions: analytics.totalPredictions,
      averageAccuracy: analytics.averageAccuracy,
      averageConfidence: analytics.averageConfidence,
      successRate: analytics.successRate,
      lastChecked: new Date().toISOString(),
    };
  }
}

module.exports = SuccessPredictionEngine;
