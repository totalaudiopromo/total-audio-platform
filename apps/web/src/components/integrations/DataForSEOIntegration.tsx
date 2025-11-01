import React, { useState } from 'react';
import { dataForSEOApi } from '../../services/mcpApi';

interface DataForSEOIntegrationProps {
  className?: string;
}

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

export default function DataForSEOIntegration({ className = '' }: DataForSEOIntegrationProps) {
  const [activeTab, setActiveTab] = useState<'domain' | 'keywords' | 'competitors' | 'serp'>(
    'domain'
  );
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
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

  const handleDomainAnalysis = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await dataForSEOApi.analyzeDomain(domain);

      if (response.success) {
        setDomainAnalysis(response.analysis);
        setResults(response.analysis);
      } else {
        setError(response.error || 'Failed to analyze domain');
      }
    } catch (err) {
      setError('Failed to analyze domain');
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
      const response = await dataForSEOApi.researchKeywords(seedKeyword, keywordLocation);

      if (response.success) {
        setKeywords(response.keywords);
        setResults(response.keywords);
      } else {
        setError(response.error || 'Failed to research keywords');
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
      const response = await dataForSEOApi.analyzeCompetitors(competitorDomain);

      if (response.success) {
        setCompetitors(response.competitors);
        setResults(response.competitors);
      } else {
        setError(response.error || 'Failed to analyze competitors');
      }
    } catch (err) {
      setError('Failed to analyze competitors');
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
      const response = await dataForSEOApi.getSERPResults(serpKeyword, serpLocation);

      if (response.success) {
        setSerpResults(response.results);
        setResults(response.results);
      } else {
        setError(response.error || 'Failed to get SERP results');
      }
    } catch (err) {
      setError('Failed to get SERP results');
    } finally {
      setLoading(false);
    }
  };

  const renderDomainAnalysis = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Domain to Analyze</label>
        <input
          type="text"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          placeholder="e.g., example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleDomainAnalysis}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze Domain'}
      </button>

      {domainAnalysis && (
        <div className="mt-6 space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3">SEO Analysis for {domainAnalysis.domain}</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{domainAnalysis.score}/100</div>
                <div className="text-sm text-gray-600">SEO Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {domainAnalysis.metrics.organicKeywords}
                </div>
                <div className="text-sm text-gray-600">Organic Keywords</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {domainAnalysis.metrics.organicTraffic}
                </div>
                <div className="text-sm text-gray-600">Organic Traffic</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {domainAnalysis.metrics.domainAuthority}
                </div>
                <div className="text-sm text-gray-600">Domain Authority</div>
              </div>
            </div>

            {domainAnalysis.issues.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-red-600 mb-2">Issues Found:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {domainAnalysis.issues.map((issue, index) => (
                    <li key={index} className="text-red-600">
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {domainAnalysis.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Recommendations:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {domainAnalysis.recommendations.map((rec, index) => (
                    <li key={index} className="text-green-600">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderKeywordResearch = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Seed Keyword</label>
        <input
          type="text"
          value={seedKeyword}
          onChange={e => setSeedKeyword(e.target.value)}
          placeholder="e.g., music promotion"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location (optional)</label>
        <input
          type="text"
          value={keywordLocation}
          onChange={e => setKeywordLocation(e.target.value)}
          placeholder="e.g., US, UK, CA"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleKeywordResearch}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Researching...' : 'Research Keywords'}
      </button>

      {keywords.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Keyword Research Results</h3>
          <div className="bg-white rounded-lg border overflow-hidden">
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
                  <tr key={index}>
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
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Domain to Analyze Competitors
        </label>
        <input
          type="text"
          value={competitorDomain}
          onChange={e => setCompetitorDomain(e.target.value)}
          placeholder="e.g., example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleCompetitorAnalysis}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze Competitors'}
      </button>

      {competitors.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Competitor Analysis Results</h3>
          <div className="bg-white rounded-lg border overflow-hidden">
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
                  <tr key={index}>
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
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Keyword for SERP Analysis
        </label>
        <input
          type="text"
          value={serpKeyword}
          onChange={e => setSerpKeyword(e.target.value)}
          placeholder="e.g., music promotion services"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location (optional)</label>
        <input
          type="text"
          value={serpLocation}
          onChange={e => setSerpLocation(e.target.value)}
          placeholder="e.g., US, UK, CA"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleSERPResults}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Getting Results...' : 'Get SERP Results'}
      </button>

      {serpResults && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">SERP Results for "{serpResults.keyword}"</h3>
          <div className="space-y-3">
            {serpResults.results.slice(0, 10).map((result, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        #{result.position}
                      </span>
                      <span className="text-sm text-gray-500">{result.domain}</span>
                    </div>
                    <h4 className="text-blue-600 hover:text-blue-800 font-medium mb-1">
                      <a href={result.url} target="_blank" rel="noopener noreferrer">
                        {result.title}
                      </a>
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{result.snippet}</p>
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
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Data for SEO Integration</h2>
        <p className="text-gray-600">
          Analyze domains, research keywords, analyze competitors, and get SERP results using Data
          for SEO.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'domain', label: 'Domain Analysis' },
              { id: 'keywords', label: 'Keyword Research' },
              { id: 'competitors', label: 'Competitor Analysis' },
              { id: 'serp', label: 'SERP Results' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        {activeTab === 'domain' && renderDomainAnalysis()}
        {activeTab === 'keywords' && renderKeywordResearch()}
        {activeTab === 'competitors' && renderCompetitorAnalysis()}
        {activeTab === 'serp' && renderSERPResults()}
      </div>
    </div>
  );
}
