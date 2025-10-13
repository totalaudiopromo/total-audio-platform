'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface SEOAnalysis {
  domain: string;
  score: number;
  issues: string[];
  recommendations: string[];
  metrics: {
    organicKeywords: number;
    organicTraffic: number;
    backlinks: number;
    domainAuthority: number;
  };
}

interface KeywordData {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  competition: string;
}

interface CompetitorData {
  domain: string;
  organicKeywords: number;
  organicTraffic: number;
  backlinks: number;
  domainAuthority: number;
}

interface SERPData {
  keyword: string;
  results: Array<{
    position: number;
    title: string;
    url: string;
    snippet: string;
    domain: string;
  }>;
}

export default function SEOAnalysisPage() {
  const [activeTab, setActiveTab] = useState<'domain' | 'keywords' | 'competitors' | 'serp'>('domain');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Domain Analysis
  const [domain, setDomain] = useState('');
  const [domainAnalysis, setDomainAnalysis] = useState<SEOAnalysis | null>(null);

  // Keyword Research
  const [seedKeyword, setSeedKeyword] = useState('');
  const [keywordLocation, setKeywordLocation] = useState('');
  const [keywords, setKeywords] = useState<KeywordData[]>([]);

  // Competitor Analysis
  const [competitorDomain, setCompetitorDomain] = useState('');
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);

  // SERP Results
  const [serpKeyword, setSerpKeyword] = useState('');
  const [serpLocation, setSerpLocation] = useState('');
  const [serpResults, setSerpResults] = useState<SERPData | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

  const handleDomainAnalysis = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/mcp/dataforseo/analyse-domain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setDomainAnalysis(data.analysis);
      } else {
        setError(data.error || 'Failed to analyse domain');
      }
    } catch (err) {
      setError('Failed to analyse domain');
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordResearch = async () => {
    if (!seedKeyword) {
      setError('Please enter a seed keyword');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/mcp/dataforseo/research-keywords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seedKeyword, location: keywordLocation })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setKeywords(data.keywords);
      } else {
        setError(data.error || 'Failed to research keywords');
      }
    } catch (err) {
      setError('Failed to research keywords');
    } finally {
      setLoading(false);
    }
  };

  const handleCompetitorAnalysis = async () => {
    if (!competitorDomain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/mcp/dataforseo/analyse-competitors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: competitorDomain })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCompetitors(data.competitors);
      } else {
        setError(data.error || 'Failed to analyse competitors');
      }
    } catch (err) {
      setError('Failed to analyse competitors');
    } finally {
      setLoading(false);
    }
  };

  const handleSERPResults = async () => {
    if (!serpKeyword) {
      setError('Please enter a keyword');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/mcp/dataforseo/get-serp-results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: serpKeyword, location: serpLocation })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSerpResults(data.results);
      } else {
        setError(data.error || 'Failed to get SERP results');
      }
    } catch (err) {
      setError('Failed to get SERP results');
    } finally {
      setLoading(false);
    }
  };

  const renderDomainAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Domain Analysis</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domain to Analyse
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g., example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={handleDomainAnalysis}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200"
          >
            {loading ? 'Analysing...' : 'Analyse Domain'}
          </button>
        </div>
      </div>

      {domainAnalysis && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">SEO Analysis for {domainAnalysis.domain}</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{domainAnalysis.score}/100</div>
              <div className="text-sm text-gray-600">SEO Score</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{domainAnalysis.metrics.organicKeywords}</div>
              <div className="text-sm text-gray-600">Organic Keywords</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{domainAnalysis.metrics.organicTraffic}</div>
              <div className="text-sm text-gray-600">Organic Traffic</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{domainAnalysis.metrics.domainAuthority}</div>
              <div className="text-sm text-gray-600">Domain Authority</div>
            </div>
          </div>

          {domainAnalysis.issues.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-red-600 mb-3">Issues Found:</h4>
              <ul className="space-y-2">
                {domainAnalysis.issues.map((issue, index) => (
                  <li key={index} className="flex items-center text-red-600">
                    <span className="mr-2">⚠️</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {domainAnalysis.recommendations.length > 0 && (
            <div>
              <h4 className="font-semibold text-green-600 mb-3">Recommendations:</h4>
              <ul className="space-y-2">
                {domainAnalysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-center text-green-600">
                    <span className="mr-2">✅</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderKeywordResearch = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Keyword Research</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seed Keyword
            </label>
            <input
              type="text"
              value={seedKeyword}
              onChange={(e) => setSeedKeyword(e.target.value)}
              placeholder="e.g., music promotion"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (optional)
            </label>
            <input
              type="text"
              value={keywordLocation}
              onChange={(e) => setKeywordLocation(e.target.value)}
              placeholder="e.g., US, UK, CA"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={handleKeywordResearch}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 disabled:opacity-50 transition-all duration-200"
          >
            {loading ? 'Researching...' : 'Research Keywords'}
          </button>
        </div>
      </div>

      {keywords.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Keyword Research Results</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keyword
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Search Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPC
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {keywords.map((keyword, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {keyword.keyword}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {keyword.searchVolume.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {keyword.difficulty}/100
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${keyword.cpc.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderCompetitorAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Competitor Analysis</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domain to Analyse Competitors
            </label>
            <input
              type="text"
              value={competitorDomain}
              onChange={(e) => setCompetitorDomain(e.target.value)}
              placeholder="e.g., example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={handleCompetitorAnalysis}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200"
          >
            {loading ? 'Analysing...' : 'Analyse Competitors'}
          </button>
        </div>
      </div>

      {competitors.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Competitor Analysis Results</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organic Keywords
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organic Traffic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Backlinks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Domain Authority
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {competitors.map((competitor, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {competitor.domain}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {competitor.organicKeywords.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {competitor.organicTraffic.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {competitor.backlinks.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {competitor.domainAuthority}/100
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderSERPResults = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">SERP Analysis</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keyword for SERP Analysis
            </label>
            <input
              type="text"
              value={serpKeyword}
              onChange={(e) => setSerpKeyword(e.target.value)}
              placeholder="e.g., music promotion services"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (optional)
            </label>
            <input
              type="text"
              value={serpLocation}
              onChange={(e) => setSerpLocation(e.target.value)}
              placeholder="e.g., US, UK, CA"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={handleSERPResults}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-700 hover:to-red-700 disabled:opacity-50 transition-all duration-200"
          >
            {loading ? 'Getting Results...' : 'Get SERP Results'}
          </button>
        </div>
      </div>

      {serpResults && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">SERP Results for "{serpResults.keyword}"</h3>
          <div className="space-y-4">
            {serpResults.results.slice(0, 10).map((result, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                        #{result.position}
                      </span>
                      <span className="text-sm text-gray-500">{result.domain}</span>
                    </div>
                    <h4 className="text-blue-600 hover:text-blue-800 font-medium mb-2">
                      <a href={result.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {result.title}
                      </a>
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{result.snippet}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AI</span>
                </div>
                <span className="text-lg font-bold text-gray-700">Audio Intel Live</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-blue-900 bg-clip-text text-transparent">
                  SEO Analysis
                </h1>
                <p className="text-gray-600 text-sm">
                  Analyse domains, research keywords, analyse competitors, and get SERP results
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'domain', label: 'Domain Analysis', icon: '🌐' },
                { id: 'keywords', label: 'Keyword Research', icon: '🔍' },
                { id: 'competitors', label: 'Competitor Analysis', icon: '🏆' },
                { id: 'serp', label: 'SERP Results', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'domain' && renderDomainAnalysis()}
        {activeTab === 'keywords' && renderKeywordResearch()}
        {activeTab === 'competitors' && renderCompetitorAnalysis()}
        {activeTab === 'serp' && renderSERPResults()}
      </div>
    </div>
  );
} 