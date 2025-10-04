/**
 * Campaign Intelligence Engine
 * Provides benchmarking, insights, and ROI analysis
 */

export interface Campaign {
  id: string;
  name: string;
  platform: string;
  genre: string;
  budget: number;
  start_date: string;
  end_date?: string;
  target_reach: number;
  actual_reach: number;
  status: string;
}

export interface Benchmark {
  platform: string;
  genre: string;
  avg_success_rate: number;
  avg_cost_per_result: number;
  best_day: string;
  best_month: string;
  optimal_budget_min: number;
  optimal_budget_max: number;
}

export interface CampaignIntelligence {
  successRate: number;
  costPerResult: number;
  performanceVsAvg: number;
  performanceLabel: string;
  percentile: number;
  costEfficiency: number;
  costEfficiencyLabel: string;
  insights: string[];
  recommendations: string[];
}

/**
 * Calculate success rate as percentage
 */
export function calculateSuccessRate(campaign: Campaign): number {
  if (campaign.target_reach === 0) return 0;
  return (campaign.actual_reach / campaign.target_reach) * 100;
}

/**
 * Calculate cost per result
 */
export function calculateCostPerResult(campaign: Campaign): number {
  if (campaign.actual_reach === 0) return 0;
  return campaign.budget / campaign.actual_reach;
}

/**
 * Compare campaign performance to benchmark
 */
export function comparePerformance(
  campaign: Campaign,
  benchmark: Benchmark
): number {
  const campaignRate = calculateSuccessRate(campaign);
  const benchmarkRate = benchmark.avg_success_rate;

  if (benchmarkRate === 0) return 0;
  return ((campaignRate - benchmarkRate) / benchmarkRate) * 100;
}

/**
 * Compare cost efficiency to benchmark
 */
export function compareCostEfficiency(
  campaign: Campaign,
  benchmark: Benchmark
): number {
  const campaignCost = calculateCostPerResult(campaign);
  const benchmarkCost = benchmark.avg_cost_per_result;

  if (benchmarkCost === 0) return 0;
  // Negative is good (spending less than average)
  return ((campaignCost - benchmarkCost) / benchmarkCost) * 100;
}

/**
 * Calculate percentile ranking
 */
export function calculatePercentile(
  campaign: Campaign,
  benchmark: Benchmark
): number {
  const performance = comparePerformance(campaign, benchmark);

  // Simple percentile calculation
  // 0% performance = 50th percentile
  // +50% performance = 90th percentile
  // -50% performance = 10th percentile
  const percentile = 50 + (performance / 2);
  return Math.max(10, Math.min(90, Math.round(percentile)));
}

/**
 * Generate full intelligence report for a campaign
 */
export function enrichCampaignWithIntelligence(
  campaign: Campaign,
  benchmark: Benchmark
): CampaignIntelligence {
  const successRate = calculateSuccessRate(campaign);
  const costPerResult = calculateCostPerResult(campaign);
  const performanceVsAvg = comparePerformance(campaign, benchmark);
  const costEfficiency = compareCostEfficiency(campaign, benchmark);
  const percentile = calculatePercentile(campaign, benchmark);

  // Generate insights
  const insights: string[] = [];
  const recommendations: string[] = [];

  // Performance insight
  if (performanceVsAvg > 20) {
    insights.push(`Exceptional performance - ${Math.round(performanceVsAvg)}% above average`);
  } else if (performanceVsAvg > 0) {
    insights.push(`Above average performance (+${Math.round(performanceVsAvg)}%)`);
  } else if (performanceVsAvg < -20) {
    insights.push(`Below average performance (${Math.round(performanceVsAvg)}%)`);
    recommendations.push('Consider reviewing your pitch strategy');
  }

  // Cost efficiency insight
  if (costEfficiency < -20) {
    insights.push(`Excellent ROI - spending ${Math.abs(Math.round(costEfficiency))}% less than average`);
  } else if (costEfficiency > 20) {
    insights.push(`Higher cost per result than average (+${Math.round(costEfficiency)}%)`);
    recommendations.push('Review budget allocation for better efficiency');
  }

  // Budget sweet spot
  if (
    campaign.budget >= benchmark.optimal_budget_min &&
    campaign.budget <= benchmark.optimal_budget_max
  ) {
    insights.push(`Budget in optimal range (£${benchmark.optimal_budget_min}-£${benchmark.optimal_budget_max})`);
  } else if (campaign.budget < benchmark.optimal_budget_min) {
    recommendations.push(
      `Consider increasing budget to £${benchmark.optimal_budget_min}-£${benchmark.optimal_budget_max} for optimal results`
    );
  }

  // Success rate feedback
  if (successRate < benchmark.avg_success_rate * 0.5) {
    recommendations.push('Low conversion rate - consider targeting more relevant contacts');
  } else if (successRate > benchmark.avg_success_rate * 1.5) {
    recommendations.push('Great targeting! This campaign format is working well');
  }

  return {
    successRate: Math.round(successRate * 10) / 10,
    costPerResult: Math.round(costPerResult * 100) / 100,
    performanceVsAvg: Math.round(performanceVsAvg * 10) / 10,
    performanceLabel: performanceVsAvg > 0
      ? `${Math.abs(Math.round(performanceVsAvg))}% above average`
      : `${Math.abs(Math.round(performanceVsAvg))}% below average`,
    percentile,
    costEfficiency: Math.round(costEfficiency * 10) / 10,
    costEfficiencyLabel: costEfficiency < 0
      ? `£${Math.abs(Math.round(costEfficiency))} below average`
      : `£${Math.round(costEfficiency)} above average`,
    insights,
    recommendations
  };
}

/**
 * Analyze patterns across multiple campaigns
 */
export interface PatternAnalysis {
  bestGenre?: { genre: string; successRate: number };
  bestPlatform?: { platform: string; successRate: number };
  optimalBudgetRange?: { min: number; max: number };
  totalCampaigns: number;
  avgSuccessRate: number;
  totalSpent: number;
  totalReach: number;
}

export function analyzePatterns(campaigns: Campaign[]): PatternAnalysis {
  if (campaigns.length === 0) {
    return {
      totalCampaigns: 0,
      avgSuccessRate: 0,
      totalSpent: 0,
      totalReach: 0
    };
  }

  // Calculate totals
  const totalSpent = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalReach = campaigns.reduce((sum, c) => sum + c.actual_reach, 0);
  const avgSuccessRate = campaigns.reduce((sum, c) =>
    sum + calculateSuccessRate(c), 0
  ) / campaigns.length;

  // Find best genre
  const genreStats = new Map<string, { total: number; success: number }>();
  campaigns.forEach(c => {
    const current = genreStats.get(c.genre) || { total: 0, success: 0 };
    genreStats.set(c.genre, {
      total: current.total + c.target_reach,
      success: current.success + c.actual_reach
    });
  });

  let bestGenre: { genre: string; successRate: number } | undefined;
  genreStats.forEach((stats, genre) => {
    const rate = (stats.success / stats.total) * 100;
    if (!bestGenre || rate > bestGenre.successRate) {
      bestGenre = { genre, successRate: rate };
    }
  });

  // Find best platform
  const platformStats = new Map<string, { total: number; success: number }>();
  campaigns.forEach(c => {
    const current = platformStats.get(c.platform) || { total: 0, success: 0 };
    platformStats.set(c.platform, {
      total: current.total + c.target_reach,
      success: current.success + c.actual_reach
    });
  });

  let bestPlatform: { platform: string; successRate: number } | undefined;
  platformStats.forEach((stats, platform) => {
    const rate = (stats.success / stats.total) * 100;
    if (!bestPlatform || rate > bestPlatform.successRate) {
      bestPlatform = { platform, successRate: rate };
    }
  });

  // Find optimal budget range
  const successfulCampaigns = campaigns
    .filter(c => calculateSuccessRate(c) > avgSuccessRate)
    .map(c => c.budget)
    .sort((a, b) => a - b);

  const optimalBudgetRange = successfulCampaigns.length > 0
    ? {
        min: Math.round(successfulCampaigns[0]),
        max: Math.round(successfulCampaigns[successfulCampaigns.length - 1])
      }
    : undefined;

  return {
    bestGenre,
    bestPlatform,
    optimalBudgetRange,
    totalCampaigns: campaigns.length,
    avgSuccessRate: Math.round(avgSuccessRate * 10) / 10,
    totalSpent,
    totalReach
  };
}
