/**
 * Intelligence API Client
 * Wraps all intelligence endpoint calls
 */

const API_BASE = '/api/intelligence';

export interface NavigatorQuestion {
  question: string;
}

export interface NavigatorAnswer {
  answer: string;
  evidence: any[];
  deepLinks: string[];
  recommendedActions: string[];
  confidence: number;
}

export interface CorrelationResult {
  correlations: Record<string, any>;
  highlights: string[];
  patterns: string[];
  recommendations: string[];
  confidence: number;
}

export interface TrajectoryForecast {
  forecast: Record<string, any>;
  opportunityWindows: any[];
  riskIndicators: string[];
  confidence: number;
}

export interface AutomationPayload {
  action: string;
  payload: Record<string, any>;
}

export interface AutomationResult {
  success: boolean;
  result: Record<string, any>;
  executionTimeMs: number;
  error?: string;
}

export interface IdentityProfile {
  brandVoice: any;
  creativeProfile: any;
  narrativeProfile: any;
  sceneIdentity: any;
  microgenreMap: any;
  epkFragments: any;
  bioShort: string;
  bioLong: string;
}

export interface CoverageFusionData {
  events: any[];
  geographicClusters: any[];
  temporalDensity: any[];
  coverage: any;
  visualizations: any;
}

export interface BenchmarkSnapshot {
  snapshotDate: Date;
  metrics: any;
  artistComparisons: any[];
  insights: string[];
  topPerformers: any[];
  improvementAreas: any[];
}

export interface SignalThread {
  threadType: string;
  thread: any;
  events: any[];
  milestones: any[];
  narrativeSummary: string;
  insights: string[];
}

export interface ModeRecommendation {
  recommendedMode: string;
  insights: string[];
}

// API functions
export const intelligenceAPI = {
  // Navigator
  async askNavigator(question: string): Promise<NavigatorAnswer> {
    const res = await fetch(`${API_BASE}/navigator/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) throw new Error('Navigator request failed');
    return res.json();
  },

  // Correlations
  async getCorrelations(artistSlug: string, windowDays = 90): Promise<CorrelationResult> {
    const res = await fetch(`${API_BASE}/correlations/${artistSlug}?windowDays=${windowDays}`);
    if (!res.ok) throw new Error('Correlations request failed');
    return res.json();
  },

  // Trajectory
  async getTrajectory(artistSlug: string, forecastDays = 90): Promise<TrajectoryForecast> {
    const res = await fetch(`${API_BASE}/trajectory/${artistSlug}?forecastDays=${forecastDays}`);
    if (!res.ok) throw new Error('Trajectory request failed');
    return res.json();
  },

  // Automations
  async runAutomation(action: string, payload: Record<string, any>): Promise<AutomationResult> {
    const res = await fetch(`${API_BASE}/automations/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload }),
    });
    if (!res.ok) throw new Error('Automation request failed');
    return res.json();
  },

  // Identity
  async getIdentity(artistSlug: string): Promise<IdentityProfile> {
    const res = await fetch(`${API_BASE}/identity/${artistSlug}`);
    if (!res.ok) throw new Error('Identity request failed');
    return res.json();
  },

  // Coverage Fusion
  async getCoverageFusion(
    artistSlug: string,
    startDate?: string,
    endDate?: string
  ): Promise<CoverageFusionData> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await fetch(`${API_BASE}/coverage-fusion/${artistSlug}${query}`);
    if (!res.ok) throw new Error('Coverage Fusion request failed');
    return res.json();
  },

  // Benchmarks
  async getBenchmarks(workspaceId: string): Promise<BenchmarkSnapshot> {
    const res = await fetch(`${API_BASE}/benchmarks/${workspaceId}`);
    if (!res.ok) throw new Error('Benchmarks request failed');
    return res.json();
  },

  // Signal Threads
  async getSignalThread(artistSlug: string, threadType = 'narrative'): Promise<SignalThread> {
    const res = await fetch(`${API_BASE}/signal-threads/${artistSlug}?threadType=${threadType}`);
    if (!res.ok) throw new Error('Signal Thread request failed');
    return res.json();
  },

  // Modes
  async getModeRecommendation(mode?: string): Promise<ModeRecommendation> {
    const query = mode ? `?mode=${mode}` : '';
    const res = await fetch(`${API_BASE}/modes/recommend${query}`);
    if (!res.ok) throw new Error('Mode recommendation request failed');
    return res.json();
  },
};
