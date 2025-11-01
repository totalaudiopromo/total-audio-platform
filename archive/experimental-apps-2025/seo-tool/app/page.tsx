'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Music,
  Mic,
  Headphones,
  TrendingUp,
  BarChart3,
  Zap,
  Target,
  Globe,
  Users,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface SEOAnalysis {
  domain: string;
  keywords: string[];
  questions: string[];
  longTail: string[];
  suggestions: string[];
  summary: {
    totalKeywords: number;
    totalQuestions: number;
    totalLongTail: number;
    totalSuggestions: number;
  };
  audioSpecific: {
    musicKeywords: string[];
    podcastKeywords: string[];
    audioKeywords: string[];
  };
}

export default function SEOTool() {
  const [domain, setDomain] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [error, setError] = useState('');

  const analyzeDomain = async () => {
    if (!domain.trim()) return;

    setIsAnalyzing(true);
    setError('');
    setAnalysis(null);

    try {
      // Simulate API call - replace with actual backend integration
      const response = await fetch(`/api/analyze?domain=${encodeURIComponent(domain)}`);
      const data = await response.json();

      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError('Failed to analyze domain. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="brand-header">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="brand-logo">🎵</div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-gray-900">SEO Audio Tool</span>
                <span className="brand-badge">Beta</span>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="brand-nav-link">
                Pricing
              </a>
              <a href="#" className="brand-nav-link">
                How It Works
              </a>
              <a href="#" className="brand-nav-link">
                FAQ
              </a>
              <button className="brand-button-secondary">Sign In</button>
              <button className="brand-button">Get Started</button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="brand-badge-lg inline-flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5" />
              AI-Powered SEO Analysis
            </div>
            <h1 className="brand-title mb-6">
              Stop Wasting <span className="brand-title-highlight">15 Hours a Week</span>
              <br />
              Researching SEO Keywords
            </h1>
            <p className="brand-subtitle mb-12 max-w-3xl mx-auto">
              Get instant access to audio-specific SEO recommendations with AI-powered keyword
              analysis that gets 3x more organic traffic
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="brand-button text-lg px-8 py-6 flex items-center gap-2">
                <Search className="h-6 w-6" />
                Analyze Your Website - Get Keywords in Minutes
              </button>
              <button className="brand-button-secondary text-lg px-8 py-6">
                Start Free Trial - No Credit Card Required
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="brand-card-primary p-12">
          <h2 className="brand-heading text-center mb-4">🔍 Analyze Your Audio Website</h2>
          <p className="brand-text text-center mb-8">
            Enter your domain to get audio-specific SEO recommendations
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-12">
            <input
              type="text"
              placeholder="Enter your website (e.g., mymusic.com, mypodcast.com)"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              className="brand-input flex-1"
              onKeyPress={e => e.key === 'Enter' && analyzeDomain()}
            />
            <button
              onClick={analyzeDomain}
              disabled={isAnalyzing || !domain.trim()}
              className="brand-button px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Analyze SEO
                </>
              )}
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="brand-card p-6 text-center">
              <Music className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-900 mb-2">Music SEO</h3>
              <p className="brand-text">
                Optimize for music promotion, distribution, and discovery
              </p>
            </div>
            <div className="brand-card p-6 text-center">
              <Mic className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-900 mb-2">Podcast SEO</h3>
              <p className="brand-text">Boost podcast visibility and audience growth</p>
            </div>
            <div className="brand-card p-6 text-center">
              <Headphones className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-900 mb-2">Audio Content</h3>
              <p className="brand-text">Optimize sound design, production, and audio services</p>
            </div>
          </div>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-bold">
            {error}
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="brand-card-primary p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="brand-heading">📊 SEO Analysis Results</h3>
                <p className="brand-text">
                  Domain: <strong>{analysis.domain}</strong>
                </p>
              </div>
              <div className="flex items-center space-x-2 text-green-600 font-bold">
                <CheckCircle className="w-5 h-5" />
                <span>Analysis Complete</span>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="brand-card p-4 text-center">
                <div className="text-2xl font-black text-gray-900">
                  {analysis.summary.totalKeywords}
                </div>
                <div className="brand-text text-sm">Keywords</div>
              </div>
              <div className="brand-card p-4 text-center">
                <div className="text-2xl font-black text-gray-900">
                  {analysis.summary.totalQuestions}
                </div>
                <div className="brand-text text-sm">Questions</div>
              </div>
              <div className="brand-card p-4 text-center">
                <div className="text-2xl font-black text-gray-900">
                  {analysis.summary.totalLongTail}
                </div>
                <div className="brand-text text-sm">Long-tail</div>
              </div>
              <div className="brand-card p-4 text-center">
                <div className="text-2xl font-black text-gray-900">
                  {analysis.summary.totalSuggestions}
                </div>
                <div className="brand-text text-sm">Suggestions</div>
              </div>
            </div>

            {/* Audio-Specific Keywords */}
            <div className="mb-8">
              <h4 className="brand-heading text-xl mb-4 flex items-center">
                <Music className="w-5 h-5 mr-2" />
                Audio-Specific Keywords
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="brand-card p-4">
                  <h5 className="font-bold text-yellow-700 mb-3">Music Keywords</h5>
                  <div className="space-y-2">
                    {analysis.audioSpecific.musicKeywords.slice(0, 5).map((keyword, i) => (
                      <div key={i} className="brand-keyword">
                        {keyword}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="brand-card p-4">
                  <h5 className="font-bold text-yellow-700 mb-3">Podcast Keywords</h5>
                  <div className="space-y-2">
                    {analysis.audioSpecific.podcastKeywords.slice(0, 5).map((keyword, i) => (
                      <div key={i} className="brand-keyword">
                        {keyword}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="brand-card p-4">
                  <h5 className="font-bold text-yellow-700 mb-3">Audio Keywords</h5>
                  <div className="space-y-2">
                    {analysis.audioSpecific.audioKeywords.slice(0, 5).map((keyword, i) => (
                      <div key={i} className="brand-keyword">
                        {keyword}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* All Keywords */}
            <div>
              <h4 className="brand-heading text-xl mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                All Optimized Keywords
              </h4>
              <div className="brand-card p-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {analysis.keywords.map((keyword, i) => (
                    <div key={i} className="brand-keyword">
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-300 font-bold">
            © 2024 Total Audio Promo. Professional SEO tools for the audio industry.
          </p>
        </div>
      </footer>
    </div>
  );
}
