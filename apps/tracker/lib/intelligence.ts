// ============================================================================
// TOTAL AUDIO TRACKER - Intelligence Engine
// Pattern recognition, performance scoring, and insight generation
// ============================================================================

import type {
  Campaign,
  Benchmark,
  Pattern,
  InsightType,
  CampaignPrediction,
  IntelligenceAnalysis,
} from './types/tracker';

// ============================================================================
// PERFORMANCE SCORING
// ============================================================================

/**
 * Calculate performance score vs industry benchmarks
 * Returns 0-100 score where 50 = average, >50 = above average
 */
export function calculatePerformanceScore(
  campaign: Campaign,
  benchmark: Benchmark | null
): number {
  if (!benchmark || campaign.target_reach === 0) {
    return 50; // Default to average if no benchmark
  }

  const successRateDiff =
    (campaign.success_rate - benchmark.avg_success_rate) /
    benchmark.avg_success_rate;

  let costEfficiency = 0;
  if (campaign.cost_per_result > 0) {
    costEfficiency =
      (benchmark.avg_cost_per_result - campaign.cost_per_result) /
      benchmark.avg_cost_per_result;
  }

  const score = 50 + successRateDiff * 25 + costEfficiency * 25;
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculate percentile rank based on performance score
 */
export function calculatePercentileRank(performanceScore: number): number {
  if (performanceScore >= 80) return 90; // Top 10%
  if (performanceScore >= 70) return 80; // Top 20%
  if (performanceScore >= 60) return 70; // Top 30%
  if (performanceScore >= 50) return 50; // Average
  if (performanceScore >= 40) return 30; // Below average
  return 20; // Bottom 20%
}

// ============================================================================
// INSIGHT GENERATION
// ============================================================================

/**
 * Generate human-readable insights from campaign data
 */
export function generateCampaignInsights(
  campaign: Campaign,
  benchmark: Benchmark | null
): string[] {
  const insights: string[] = [];

  if (!benchmark) {
    return [
      'Complete your campaign details to get personalized insights and industry comparisons.',
    ];
  }

  // Performance comparison
  const performanceDiff =
    ((campaign.success_rate - benchmark.avg_success_rate) /
      benchmark.avg_success_rate) *
    100;

  if (performanceDiff > 20) {
    insights.push(
      `🎉 Outstanding! Your campaign performed ${Math.round(
        performanceDiff
      )}% better than industry average`
    );
  } else if (performanceDiff > 0) {
    insights.push(
      `✨ Good work! Your campaign beat industry average by ${Math.round(
        performanceDiff
      )}%`
    );
  } else if (performanceDiff < -20) {
    insights.push(
      `⚠️ Below average performance. Consider reviewing your approach or targeting`
    );
  }

  // Cost efficiency
  if (campaign.cost_per_result > 0) {
    const costSavings =
      benchmark.avg_cost_per_result - campaign.cost_per_result;
    if (costSavings > 0) {
      insights.push(
        `💰 You saved £${Math.round(
          costSavings
        )} per result vs industry average`
      );
    } else if (costSavings < -30) {
      insights.push(
        `📊 Cost per result is £${Math.abs(
          Math.round(costSavings)
        )} above average - room for optimization`
      );
    }
  }

  // Success rate analysis
  if (campaign.success_rate > 30) {
    insights.push(
      `🎯 Excellent ${Math.round(
        campaign.success_rate
      )}% success rate - top 20% performance`
    );
  } else if (campaign.success_rate > benchmark.avg_success_rate) {
    insights.push(
      `👍 Solid ${Math.round(
        campaign.success_rate
      )}% success rate - above average`
    );
  }

  // Budget efficiency
  if (
    benchmark.optimal_budget_min &&
    benchmark.optimal_budget_max &&
    campaign.budget >= benchmark.optimal_budget_min &&
    campaign.budget <= benchmark.optimal_budget_max
  ) {
    insights.push(
      `✅ Your budget of £${campaign.budget} is in the optimal range for ${campaign.platform}`
    );
  }

  // Completion status
  if (campaign.status === 'completed' && campaign.actual_reach > 0) {
    const roi = (campaign.actual_reach / campaign.budget) * 100;
    insights.push(
      `📈 Campaign completed with ${
        campaign.actual_reach
      } results (${roi.toFixed(1)} results per £100 spent)`
    );
  }

  return insights.length > 0
    ? insights
    : [
        'Start tracking results to unlock intelligent insights about your campaign performance.',
      ];
}

// ============================================================================
// PATTERN RECOGNITION
// ============================================================================

/**
 * Analyze patterns across user's campaigns
 */
export function analyzePatterns(campaigns: Campaign[]): Pattern[] {
  const patterns: Pattern[] = [];

  if (campaigns.length < 3) {
    return [
      {
        type: 'recommendation',
        message:
          'Complete more campaigns to unlock personalized pattern recognition',
        confidence: 100,
      },
    ];
  }

  // Filter campaigns with results
  const completedCampaigns = campaigns.filter(
    c => c.actual_reach > 0 && c.target_reach > 0
  );

  if (completedCampaigns.length === 0) {
    return patterns;
  }

  // Genre performance analysis
  const genrePerformance = analyzeGenrePerformance(completedCampaigns);
  if (genrePerformance) {
    patterns.push(genrePerformance);
  }

  // Platform effectiveness
  const platformPerformance = analyzePlatformPerformance(completedCampaigns);
  if (platformPerformance) {
    patterns.push(platformPerformance);
  }

  // Budget optimization
  const budgetPattern = analyzeBudgetEfficiency(completedCampaigns);
  if (budgetPattern) {
    patterns.push(budgetPattern);
  }

  // Overall success trends
  const overallSuccess = analyzeOverallSuccess(completedCampaigns);
  if (overallSuccess) {
    patterns.push(overallSuccess);
  }

  return patterns;
}

/**
 * Analyze genre performance
 */
function analyzeGenrePerformance(campaigns: Campaign[]): Pattern | null {
  const genreStats = new Map<
    string,
    { successRate: number; count: number; avgCost: number }
  >();

  campaigns.forEach(c => {
    if (!c.genre) return;

    const existing = genreStats.get(c.genre) || {
      successRate: 0,
      count: 0,
      avgCost: 0,
    };
    existing.successRate += c.success_rate;
    existing.avgCost += c.cost_per_result;
    existing.count += 1;
    genreStats.set(c.genre, existing);
  });

  type GenreStats = {
    genre: string;
    successRate: number;
    avgCost: number;
  };

  let bestGenre: GenreStats | undefined;

  genreStats.forEach((stats, genre) => {
    const avgSuccessRate = stats.successRate / stats.count;
    const avgCost = stats.avgCost / stats.count;

    if (stats.count >= 2 && avgSuccessRate > 25) {
      if (!bestGenre || avgSuccessRate > bestGenre.successRate) {
        bestGenre = {
          genre,
          successRate: avgSuccessRate,
          avgCost,
        };
      }
    }
  });

  if (!bestGenre) return null;

  const avgOverall =
    campaigns.reduce((sum, c) => sum + c.success_rate, 0) / campaigns.length;
  const multiplier = bestGenre.successRate / avgOverall;

  return {
    type: 'genre_performance',
    message: `Your ${bestGenre.genre} tracks perform ${multiplier.toFixed(
      1
    )}x better than your average (${Math.round(
      bestGenre.successRate
    )}% success rate)`,
    confidence: 85,
    metadata: {
      genre: bestGenre.genre,
      successRate: Math.round(bestGenre.successRate),
      multiplier: multiplier,
    },
  };
}

/**
 * Analyze platform effectiveness
 */
function analyzePlatformPerformance(campaigns: Campaign[]): Pattern | null {
  const platformStats = new Map<
    string,
    { successRate: number; count: number }
  >();

  campaigns.forEach(c => {
    if (!c.platform) return;

    const existing = platformStats.get(c.platform) || {
      successRate: 0,
      count: 0,
    };
    existing.successRate += c.success_rate;
    existing.count += 1;
    platformStats.set(c.platform, existing);
  });

  type PlatformStats = { platform: string; successRate: number };
  let bestPlatform: PlatformStats | undefined;

  platformStats.forEach((stats, platform) => {
    const avgSuccessRate = stats.successRate / stats.count;

    if (
      stats.count >= 2 &&
      (!bestPlatform || avgSuccessRate > bestPlatform.successRate)
    ) {
      bestPlatform = {
        platform,
        successRate: avgSuccessRate,
      };
    }
  });

  if (!bestPlatform) return null;

  return {
    type: 'platform_effectiveness',
    message: `${bestPlatform.platform} campaigns show ${Math.round(
      bestPlatform.successRate
    )}% success rate - your most effective platform`,
    confidence: 90,
    metadata: {
      platform: bestPlatform.platform,
      successRate: Math.round(bestPlatform.successRate),
    },
  };
}

/**
 * Analyze budget efficiency
 */
function analyzeBudgetEfficiency(campaigns: Campaign[]): Pattern | null {
  const campaignsWithBudget = campaigns.filter(
    c => c.budget > 0 && c.actual_reach > 0
  );

  if (campaignsWithBudget.length < 3) return null;

  // Calculate ROI (results per £100)
  const budgetRanges = campaignsWithBudget.map(c => ({
    budget: c.budget,
    roi: (c.actual_reach / c.budget) * 100,
  }));

  // Find sweet spot
  budgetRanges.sort((a, b) => b.roi - a.roi);
  const topPerformers = budgetRanges.slice(
    0,
    Math.ceil(budgetRanges.length / 3)
  );

  const avgBudget =
    topPerformers.reduce((sum, b) => sum + b.budget, 0) / topPerformers.length;
  const minBudget = Math.floor(avgBudget * 0.8);
  const maxBudget = Math.ceil(avgBudget * 1.2);

  return {
    type: 'budget_optimization',
    message: `Your optimal budget range is £${minBudget}-£${maxBudget} based on your most efficient campaigns`,
    confidence: 75,
    metadata: {
      budgetRange: {
        min: minBudget,
        max: maxBudget,
      },
    },
  };
}

/**
 * Analyze overall success trends
 */
function analyzeOverallSuccess(campaigns: Campaign[]): Pattern | null {
  const avgSuccessRate =
    campaigns.reduce((sum, c) => sum + c.success_rate, 0) / campaigns.length;

  if (avgSuccessRate > 30) {
    return {
      type: 'success',
      message: `Excellent overall performance! Your campaigns average ${Math.round(
        avgSuccessRate
      )}% success rate`,
      confidence: 100,
      metadata: {
        successRate: Math.round(avgSuccessRate),
      },
    };
  } else if (avgSuccessRate > 20) {
    return {
      type: 'pattern',
      message: `Solid ${Math.round(
        avgSuccessRate
      )}% average success rate across your campaigns`,
      confidence: 85,
      metadata: {
        successRate: Math.round(avgSuccessRate),
      },
    };
  }

  return null;
}

// ============================================================================
// CAMPAIGN PREDICTIONS
// ============================================================================

/**
 * Predict campaign performance before starting
 */
export function predictCampaignPerformance(
  formData: Partial<Campaign>,
  benchmark: Benchmark | null,
  userHistory: Campaign[]
): CampaignPrediction {
  if (!benchmark) {
    return {
      expected_success_rate: { min: 15, max: 35 },
      typical_cost_per_result: { min: 50, max: 150 },
      avg_response_time: 7,
      recommendations: [
        'Complete platform and genre details for accurate predictions',
      ],
      confidence: 30,
    };
  }

  // Base prediction on benchmark
  const baseSuccessRate = benchmark.avg_success_rate;
  const baseCostPerResult = benchmark.avg_cost_per_result;

  // Adjust based on user history for same platform/genre
  const relevantHistory = userHistory.filter(
    c =>
      c.platform === formData.platform &&
      c.genre === formData.genre &&
      c.actual_reach > 0
  );

  let adjustedSuccessRate = baseSuccessRate;
  let adjustedCostPerResult = baseCostPerResult;

  if (relevantHistory.length > 0) {
    const avgUserSuccess =
      relevantHistory.reduce((sum, c) => sum + c.success_rate, 0) /
      relevantHistory.length;
    const avgUserCost =
      relevantHistory.reduce((sum, c) => sum + c.cost_per_result, 0) /
      relevantHistory.length;

    // Blend user history (60%) with benchmark (40%)
    adjustedSuccessRate = avgUserSuccess * 0.6 + baseSuccessRate * 0.4;
    adjustedCostPerResult = avgUserCost * 0.6 + baseCostPerResult * 0.4;
  }

  const recommendations: string[] = [];

  // Budget recommendations
  if (
    formData.budget &&
    benchmark.optimal_budget_min &&
    benchmark.optimal_budget_max
  ) {
    if (formData.budget < benchmark.optimal_budget_min) {
      recommendations.push(
        `Consider increasing budget to £${benchmark.optimal_budget_min} for better results`
      );
    } else if (formData.budget > benchmark.optimal_budget_max) {
      recommendations.push(
        `Budget above optimal range - diminishing returns likely beyond £${benchmark.optimal_budget_max}`
      );
    } else {
      recommendations.push(
        `Budget is in optimal range for ${formData.platform}`
      );
    }
  }

  // Genre-specific advice
  if (formData.genre && baseSuccessRate > 30) {
    recommendations.push(
      `${formData.genre} music shows strong ${Math.round(
        baseSuccessRate
      )}% success rate on ${formData.platform}`
    );
  }

  // Timing advice
  if (benchmark.best_day) {
    recommendations.push(
      `Best submission day: ${benchmark.best_day} (based on industry data)`
    );
  }

  return {
    expected_success_rate: {
      min: Math.round(adjustedSuccessRate * 0.8),
      max: Math.round(adjustedSuccessRate * 1.2),
    },
    typical_cost_per_result: {
      min: Math.round(adjustedCostPerResult * 0.8),
      max: Math.round(adjustedCostPerResult * 1.2),
    },
    avg_response_time: benchmark.avg_response_time || 7,
    recommendations,
    confidence: relevantHistory.length > 0 ? 85 : 70,
  };
}

// ============================================================================
// COMPREHENSIVE INTELLIGENCE ANALYSIS
// ============================================================================

/**
 * Full intelligence analysis for dashboard
 */
export function generateIntelligenceAnalysis(
  campaigns: Campaign[],
  benchmarks: Map<string, Benchmark>
): IntelligenceAnalysis {
  const patterns = analyzePatterns(campaigns);

  const recommendations: string[] = [];
  const warnings: string[] = [];

  // Overall performance calculation
  let totalPerformance = 0;
  let campaignsWithBenchmarks = 0;

  campaigns.forEach(campaign => {
    if (campaign.platform && campaign.genre) {
      const key = `${campaign.platform}-${campaign.genre}`;
      const benchmark = benchmarks.get(key);
      if (benchmark) {
        totalPerformance += calculatePerformanceScore(campaign, benchmark);
        campaignsWithBenchmarks++;
      }
    }
  });

  const overall_performance =
    campaignsWithBenchmarks > 0
      ? Math.round(totalPerformance / campaignsWithBenchmarks)
      : 50;

  // Generate recommendations from patterns
  patterns.forEach(pattern => {
    if (pattern.type === 'genre_performance' && pattern.metadata?.genre) {
      recommendations.push(
        `Focus future campaigns on ${pattern.metadata.genre} music for best results`
      );
    }

    if (
      pattern.type === 'platform_effectiveness' &&
      pattern.metadata?.platform
    ) {
      recommendations.push(
        `${pattern.metadata.platform} shows strongest performance for your campaigns`
      );
    }

    if (
      pattern.type === 'budget_optimization' &&
      pattern.metadata?.budgetRange
    ) {
      recommendations.push(
        `Optimal budget: £${pattern.metadata.budgetRange.min}-£${pattern.metadata.budgetRange.max}`
      );
    }
  });

  // Check for warnings
  const recentCampaigns = campaigns.slice(-5);
  const recentAvgSuccess =
    recentCampaigns.length > 0
      ? recentCampaigns.reduce((sum, c) => sum + c.success_rate, 0) /
        recentCampaigns.length
      : 0;

  if (recentAvgSuccess < 15 && recentCampaigns.length >= 3) {
    warnings.push(
      'Recent campaigns showing lower than average success rates - consider reviewing strategy'
    );
  }

  return {
    patterns,
    recommendations,
    warnings,
    overall_performance,
    best_genre: patterns.find(p => p.type === 'genre_performance')?.metadata
      ?.genre,
    best_platform: patterns.find(p => p.type === 'platform_effectiveness')
      ?.metadata?.platform,
    optimal_budget: patterns.find(p => p.type === 'budget_optimization')
      ?.metadata?.budgetRange,
  };
}
