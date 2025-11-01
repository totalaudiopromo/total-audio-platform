'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Code,
  Zap,
  Users,
  Search,
  TrendingUp,
  FileText,
  Download,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  Sparkles,
  Globe,
  Mail,
  Headphones,
  Radio,
  Instagram,
  MessageCircle,
} from 'lucide-react';
import { TextureOverlay, TextureBackground, TextureCard } from '@/components/ui/texture-overlay';

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState('getting-started');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <TextureBackground textureType="paper" textureVariant={1} className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-black text-gray-900 mb-4">Audio Intel Documentation</h1>
            <p className="text-2xl font-bold text-gray-700">
              Complete Guide to AI-Powered Music Industry Intelligence
            </p>
            <p className="text-lg text-gray-600 mt-2">
              Learn how to transform your contact lists into powerful music industry insights
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100">
                <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-bold text-gray-900">Getting Started</h3>
                <p className="text-sm text-gray-600">Quick setup guide</p>
              </Card>
              <Card className="p-4 text-center hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-green-50 to-green-100">
                <Code className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-bold text-gray-900">API Reference</h3>
                <p className="text-sm text-gray-600">Technical documentation</p>
              </Card>
              <Card className="p-4 text-center hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100">
                <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-bold text-gray-900">AI Agents</h3>
                <p className="text-sm text-gray-600">Agent capabilities</p>
              </Card>
              <Card className="p-4 text-center hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100">
                <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-bold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">Data insights</p>
              </Card>
            </div>
          </div>

          {/* Main Documentation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="getting-started" className="text-sm font-bold">
                <BookOpen className="w-4 h-4 mr-2" />
                Getting Started
              </TabsTrigger>
              <TabsTrigger value="contact-enrichment" className="text-sm font-bold">
                <Users className="w-4 h-4 mr-2" />
                Contact Enrichment
              </TabsTrigger>
              <TabsTrigger value="platform-search" className="text-sm font-bold">
                <Search className="w-4 h-4 mr-2" />
                Platform Search
              </TabsTrigger>
              <TabsTrigger value="ai-agents" className="text-sm font-bold">
                <Zap className="w-4 h-4 mr-2" />
                AI Agents
              </TabsTrigger>
              <TabsTrigger value="api" className="text-sm font-bold">
                <Code className="w-4 h-4 mr-2" />
                API Reference
              </TabsTrigger>
            </TabsList>

            {/* Getting Started Tab */}
            <TabsContent value="getting-started" className="space-y-8">
              <TextureCard textureType="paper" textureVariant={1} rotation={0} className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-black text-gray-900 mb-4">
                    Getting Started with Audio Intel
                  </h2>
                  <p className="text-xl font-bold text-gray-700">
                    Transform your music industry contact lists in minutes
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">🚀 Quick Start Guide</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          1
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Upload Your Contact List</h4>
                          <p className="text-gray-600">
                            Upload any CSV, TXT, or Excel file with names and emails. Our
                            intelligent parser handles messy data automatically.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                          2
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">AI Enrichment Process</h4>
                          <p className="text-gray-600">
                            Our AI analyzes each contact and adds music industry intelligence,
                            contact preferences, and research insights.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          3
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Export & Use</h4>
                          <p className="text-gray-600">
                            Download enriched contacts in multiple formats or integrate directly
                            with your CRM and marketing tools.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">✨ Key Features</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-bold text-gray-900">Intelligent Parsing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-bold text-gray-900">AI-Powered Research</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-bold text-gray-900">Multi-Platform Search</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-bold text-gray-900">Advanced Analytics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-bold text-gray-900">CRM Integration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-bold text-gray-900">White-Label Exports</span>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-bold text-blue-900 mb-2">💡 Pro Tip</h4>
                      <p className="text-blue-800 text-sm">
                        Start with our free tier to process 10 contacts and see the power of Audio
                        Intel in action. No credit card required!
                      </p>
                    </div>
                  </div>
                </div>
              </TextureCard>
            </TabsContent>

            {/* Contact Enrichment Tab */}
            <TabsContent value="contact-enrichment" className="space-y-8">
              <TextureCard textureType="paper" textureVariant={2} rotation={0} className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-black text-gray-900 mb-4">
                    Contact Enrichment Guide
                  </h2>
                  <p className="text-xl font-bold text-gray-700">
                    How our AI transforms basic contact lists into music industry intelligence
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">📁 File Formats</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-bold text-gray-900">CSV Files</h4>
                        <p className="text-sm text-gray-600">Standard comma-separated values</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-bold text-gray-900">TXT Files</h4>
                        <p className="text-sm text-gray-600">Plain text with any separator</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-bold text-gray-900">Excel Files</h4>
                        <p className="text-sm text-gray-600">XLSX and XLS formats</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">
                      🔧 Intelligent Parsing
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-bold text-blue-900">Auto-Detection</h4>
                        <p className="text-sm text-blue-800">
                          Headers, separators, and data patterns
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-bold text-green-900">Data Cleaning</h4>
                        <p className="text-sm text-green-800">
                          Remove quotes, fix spacing, normalize formats
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="font-bold text-purple-900">Auto-Fix</h4>
                        <p className="text-sm text-purple-800">
                          Generate missing names, validate emails
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">🎯 Enrichment Data</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <h4 className="font-bold text-orange-900">Contact Intelligence</h4>
                        <p className="text-sm text-orange-800">
                          Role, platform, reach, preferences
                        </p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <h4 className="font-bold text-red-900">Research Confidence</h4>
                        <p className="text-sm text-red-800">High, Medium, Low confidence levels</p>
                      </div>
                      <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                        <h4 className="font-bold text-indigo-900">Last Updated</h4>
                        <p className="text-sm text-indigo-800">Research timestamp and freshness</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                  <h3 className="text-2xl font-black mb-4">💡 Best Practices</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold mb-2">✅ Do's</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Include both name and email when possible</li>
                        <li>• Use consistent formatting across your list</li>
                        <li>• Include headers for better parsing</li>
                        <li>• Keep files under 10MB for faster processing</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">❌ Don'ts</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Don't worry about perfect formatting</li>
                        <li>• Don't manually clean data first</li>
                        <li>• Don't split large files unnecessarily</li>
                        <li>• Don't include sensitive personal data</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TextureCard>
            </TabsContent>

            {/* Platform Search Tab */}
            <TabsContent value="platform-search" className="space-y-8">
              <TextureCard textureType="paper" textureVariant={3} rotation={0} className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-black text-gray-900 mb-4">
                    Platform Search Documentation
                  </h2>
                  <p className="text-xl font-bold text-gray-700">
                    Discover music industry contacts across multiple platforms
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">
                      🔍 Supported Platforms
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">R</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Reddit</h4>
                          <p className="text-sm text-gray-600">Music communities and subreddits</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg border border-pink-200">
                        <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                          <Instagram className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Instagram</h4>
                          <p className="text-sm text-gray-600">Music influencers and curators</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <Headphones className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Spotify</h4>
                          <p className="text-sm text-gray-600">Playlist curators and artists</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Discord</h4>
                          <p className="text-sm text-gray-600">Music communities and servers</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">🎯 Search Strategies</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                        <h4 className="font-bold text-gray-900 mb-2">Keyword Optimization</h4>
                        <p className="text-sm text-gray-600 mb-2">Use specific terms like:</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            playlist curator
                          </Badge>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            music blogger
                          </Badge>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            radio dj
                          </Badge>
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            music journalist
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                        <h4 className="font-bold text-gray-900 mb-2">Platform-Specific Terms</h4>
                        <p className="text-sm text-gray-600">
                          Different platforms use different terminology for the same roles.
                        </p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                        <h4 className="font-bold text-gray-900 mb-2">Filtering Results</h4>
                        <p className="text-sm text-gray-600">
                          Use platform filters to focus on the most relevant results for your needs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TextureCard>
            </TabsContent>

            {/* AI Agents Tab */}
            <TabsContent value="ai-agents" className="space-y-8">
              <TextureCard textureType="paper" textureVariant={4} rotation={0} className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-black text-gray-900 mb-4">
                    AI Agents Documentation
                  </h2>
                  <p className="text-xl font-bold text-gray-700">
                    Specialized AI agents for music industry strategy and insights
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">🤖 Available Agents</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                        <h4 className="font-bold text-blue-900 mb-2">Music Industry Strategist</h4>
                        <p className="text-sm text-blue-800 mb-2">
                          Strategic planning and industry insights
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="bg-blue-200 text-blue-800 text-xs">
                            Strategy
                          </Badge>
                          <Badge variant="secondary" className="bg-blue-200 text-blue-800 text-xs">
                            Planning
                          </Badge>
                          <Badge variant="secondary" className="bg-blue-200 text-blue-800 text-xs">
                            Insights
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                        <h4 className="font-bold text-green-900 mb-2">
                          Music Marketing Mastermind
                        </h4>
                        <p className="text-sm text-green-800 mb-2">
                          Marketing strategy and campaign planning
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <Badge
                            variant="secondary"
                            className="bg-green-200 text-green-800 text-xs"
                          >
                            Marketing
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-green-200 text-green-800 text-xs"
                          >
                            Campaigns
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-green-200 text-green-800 text-xs"
                          >
                            Strategy
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                        <h4 className="font-bold text-purple-900 mb-2">Growth Hacking Optimizer</h4>
                        <p className="text-sm text-purple-800 mb-2">
                          Growth strategies and optimization
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <Badge
                            variant="secondary"
                            className="bg-purple-200 text-purple-800 text-xs"
                          >
                            Growth
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-purple-200 text-purple-800 text-xs"
                          >
                            Optimization
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-purple-200 text-purple-800 text-xs"
                          >
                            Hacking
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">
                      💬 Agent Interactions
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-bold text-gray-900 mb-2">Query Types</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Strategic planning questions</li>
                          <li>• Marketing campaign advice</li>
                          <li>• Industry trend analysis</li>
                          <li>• Growth strategy recommendations</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-bold text-gray-900 mb-2">Response Format</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Detailed analysis and insights</li>
                          <li>• Actionable recommendations</li>
                          <li>• Next steps and follow-up actions</li>
                          <li>• Industry-specific context</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TextureCard>
            </TabsContent>

            {/* API Reference Tab */}
            <TabsContent value="api" className="space-y-8">
              <TextureCard textureType="paper" textureVariant={5} rotation={0} className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-black text-gray-900 mb-4">API Reference</h2>
                  <p className="text-xl font-bold text-gray-700">
                    Integrate Audio Intel into your applications
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">🔑 Authentication</h3>
                    <div className="p-4 bg-gray-900 rounded-lg text-white font-mono text-sm">
                      <div className="text-green-400"># API Key Authentication</div>
                      <div className="text-gray-300">Authorization: Bearer YOUR_API_KEY</div>
                      <div className="text-gray-300">Content-Type: application/json</div>
                    </div>

                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-bold text-yellow-900 mb-2">⚠️ API Access</h4>
                      <p className="text-sm text-yellow-800">
                        API access is available for Professional and Agency tiers. Contact us at{' '}
                        <a
                          href="mailto:api@totalaudiopromo.com"
                          className="text-blue-600 hover:underline"
                        >
                          api@totalaudiopromo.com
                        </a>{' '}
                        for access.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">📡 Endpoints</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-bold text-blue-900 mb-2">POST /api/enrich</h4>
                        <p className="text-sm text-blue-800 mb-2">
                          Enrich contact list with AI intelligence
                        </p>
                        <div className="text-xs text-gray-600">Rate limit: 100 requests/hour</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-bold text-green-900 mb-2">GET /api/search</h4>
                        <p className="text-sm text-green-800 mb-2">
                          Search for contacts across platforms
                        </p>
                        <div className="text-xs text-gray-600">Rate limit: 200 requests/hour</div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="font-bold text-purple-900 mb-2">POST /api/agents</h4>
                        <p className="text-sm text-purple-800 mb-2">Query AI agents for insights</p>
                        <div className="text-xs text-gray-600">Rate limit: 50 requests/hour</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg text-white">
                  <h3 className="text-2xl font-black mb-4">📚 Code Examples</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold mb-2">JavaScript/Node.js</h4>
                      <div className="bg-gray-800 p-4 rounded font-mono text-sm">
                        <div className="text-blue-400">
                          const response = await fetch(&apos;/api/enrich&apos;, {'{'}
                        </div>
                        <div className="text-gray-300 ml-4">method: &apos;POST&apos;,</div>
                        <div className="text-gray-300 ml-4">headers: {'{'}</div>
                        <div className="text-gray-300 ml-8">
                          &apos;Authorization&apos;: &apos;Bearer YOUR_API_KEY&apos;,
                        </div>
                        <div className="text-gray-300 ml-8">
                          &apos;Content-Type&apos;: &apos;application/json&apos;
                        </div>
                        <div className="text-gray-300 ml-4">{'}'},</div>
                        <div className="text-gray-300 ml-4">
                          body: JSON.stringify({'{'}' contacts {'}'})
                        </div>
                        <div className="text-blue-400">{'}'});</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Python</h4>
                      <div className="bg-gray-800 p-4 rounded font-mono text-sm">
                        <div className="text-blue-400">import requests</div>
                        <div className="text-gray-300">response = requests.post(</div>
                        <div className="text-gray-300 ml-4">
                          &apos;https://api.audiointel.com/enrich&apos;,
                        </div>
                        <div className="text-gray-300 ml-4">
                          headers={'{'}&apos;Authorization&apos;: &apos;Bearer YOUR_API_KEY&apos;
                          {'}'},
                        </div>
                        <div className="text-gray-300 ml-4">
                          json={'{'}&apos;contacts&apos;: contacts{'}'}
                        </div>
                        <div className="text-blue-400">)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TextureCard>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Need help? Contact our support team</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" className="border-2 border-gray-300 hover:bg-gray-50">
                <Mail className="w-4 h-4 mr-2" />
                Email Support
              </Button>
              <Button variant="outline" className="border-2 border-gray-300 hover:bg-gray-50">
                <ExternalLink className="w-4 h-4 mr-2" />
                Live Chat
              </Button>
              <Button variant="outline" className="border-2 border-gray-300 hover:bg-gray-50">
                <FileText className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </TextureBackground>
    </div>
  );
}
