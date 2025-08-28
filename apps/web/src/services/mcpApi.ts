const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

// Perplexity AI API calls
export const perplexityApi = {
  findJournalists: async (industry: string, location?: string) => {
    const response = await fetch(`${API_BASE_URL}/api/mcp/perplexity/find-journalists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ industry, location })
    });
    return response.json();
  },

  researchIndustry: async (industry: string) => {
    const response = await fetch(`${API_BASE_URL}/api/mcp/perplexity/research-industry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ industry })
    });
    return response.json();
  },

  findContactLists: async (industry: string) => {
    const response = await fetch(`${API_BASE_URL}/api/mcp/perplexity/find-contact-lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ industry })
    });
    return response.json();
  }
};

// Open Router API calls
export const openRouterApi = {
  getModels: async () => {
    const response = await fetch(`${API_BASE_URL}/api/mcp/openrouter/models`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  },

  chatCompletion: async (messages: any[], model: string, options?: any) => {
    const response = await fetch(`${API_BASE_URL}/api/mcp/openrouter/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, model, options })
    });
    return response.json();
  },

  generatePressRelease: async (client: string, news: string, industry: string) => {
    const response = await fetch(`${API_BASE_URL}/api/mcp/openrouter/generate-press-release`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client, news, industry })
    });
    return response.json();
  },

  generatePitchEmail: async (journalist: string, outlet: string, story: string, client: string) => {
    const response = await fetch(`${API_BASE_URL}/api/mcp/openrouter/generate-pitch-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ journalist, outlet, story, client })
    });
    return response.json();
  }
};

// Data for SEO API calls
export const dataForSEOApi = {
  analyzeDomain: async (domain: string) => {
    const response = await fetch(`${API_BASE_URL}/api/mcp/dataforseo/analyze-domain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain })
    });
    return response.json();
  },

  researchKeywords: async (seedKeyword: string, location?: string) => {
    const response = await fetch(`${API_BASE_URL}/api/mcp/dataforseo/research-keywords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seedKeyword, location })
    });
    return response.json();
  },

  analyzeCompetitors: async (domain: string) => {
    const response = await fetch(`${API_BASE_URL}/api/mcp/dataforseo/analyze-competitors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain })
    });
    return response.json();
  },

  getSERPResults: async (keyword: string, location?: string) => {
    const response = await fetch(`${API_BASE_URL}/api/mcp/dataforseo/get-serp-results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword, location })
    });
    return response.json();
  }
};



// Aura AI API calls
export const auraApi = {
  generatePitch: async (client: string, journalist: string, story: string) => {
    const response = await fetch(`${API_BASE_URL}/api/mcp/aura/generate-pitch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client, journalist, story })
    });
    return response.json();
  },

  generatePressRelease: async (client: string, news: string, industry: string) => {
    const response = await fetch(`${API_BASE_URL}/api/mcp/aura/generate-press-release`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client, news, industry })
    });
    return response.json();
  },

  suggestCampaigns: async (industry: string, budget: number) => {
    const response = await fetch(`${API_BASE_URL}/api/mcp/aura/suggest-campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ industry, budget })
    });
    return response.json();
  },

  optimizeSubjectLine: async (emailContent: string, targetAudience: string) => {
    const response = await fetch(`${API_BASE_URL}/api/mcp/aura/optimize-subject-line`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailContent, targetAudience })
    });
    return response.json();
  }
};

// Test endpoint
export const testMCPConnection = async () => {
  const response = await fetch(`${API_BASE_URL}/api/mcp/test`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
}; 