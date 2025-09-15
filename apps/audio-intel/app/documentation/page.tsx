'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  MessageCircle
} from "lucide-react"

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState('getting-started')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-black text-gray-900 mb-4">
              Audio Intel Documentation
            </h1>
            <p className="text-2xl font-bold text-gray-700">
              Complete Guide to AI-Powered Music Industry Intelligence
            </p>
            <p className="text-lg text-gray-600 mt-2">
              Learn how to transform your contact lists into powerful music industry insights
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                className="p-4 text-center hover:shadow-lg transition-all cursor-pointer border-2 border-black bg-white"
                onClick={() => setActiveTab('getting-started')}
              >
                <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-bold text-gray-900">Getting Started</h3>
                <p className="text-sm text-gray-600">Quick setup guide</p>
              </Card>
              <Card 
                className="p-4 text-center hover:shadow-lg transition-all cursor-pointer border-2 border-black bg-white"
                onClick={() => setActiveTab('contact-enrichment')}
              >
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-bold text-gray-900">Contact Enrichment</h3>
                <p className="text-sm text-gray-600">AI-powered enrichment</p>
              </Card>
              <Card 
                className="p-4 text-center hover:shadow-lg transition-all cursor-pointer border-2 border-black bg-white"
                onClick={() => setActiveTab('api')}
              >
                <Code className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-bold text-gray-900">API Reference</h3>
                <p className="text-sm text-gray-600">Technical documentation</p>
              </Card>
            </div>
          </div>

          {/* Main Documentation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="getting-started" className="text-sm font-bold">
                <BookOpen className="w-4 h-4 mr-2" />
                Getting Started
              </TabsTrigger>
              <TabsTrigger value="contact-enrichment" className="text-sm font-bold">
                <Users className="w-4 h-4 mr-2" />
                Contact Enrichment
              </TabsTrigger>
              <TabsTrigger value="api" className="text-sm font-bold">
                <Code className="w-4 h-4 mr-2" />
                API Reference
              </TabsTrigger>
            </TabsList>

            {/* Getting Started Tab */}
            <TabsContent value="getting-started" className="space-y-8">
              <Card className="p-8 border-2 border-black">
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
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Quick Start Guide</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                        <div>
                          <h4 className="font-bold text-gray-900">Upload Your Contact List</h4>
                          <p className="text-gray-600">Upload any CSV, TXT, or Excel file with names and emails. Our intelligent parser handles messy data automatically.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                        <div>
                          <h4 className="font-bold text-gray-900">AI Enrichment Process</h4>
                          <p className="text-gray-600">Our AI analyses each contact and adds music industry intelligence, contact preferences, and research insights.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                        <div>
                          <h4 className="font-bold text-gray-900">Export & Use</h4>
                          <p className="text-gray-600">Download enriched contacts in multiple formats or integrate directly with your CRM and marketing tools.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Key Features</h3>
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
                      <h4 className="font-bold text-blue-900 mb-2">Pro Tip</h4>
                      <p className="text-blue-800 text-sm">
                        Start with our free tier to process 10 contacts and see the power of Audio Intel in action. 
                        No credit card required!
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Contact Enrichment Tab */}
            <TabsContent value="contact-enrichment" className="space-y-8">
              <Card className="p-8 border-2 border-black">
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
                    <h3 className="text-2xl font-black text-gray-900 mb-4">File Formats</h3>
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
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Intelligent Parsing</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-bold text-blue-900">Auto-Detection</h4>
                        <p className="text-sm text-blue-800">Headers, separators, and data patterns</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-bold text-green-900">Data Cleaning</h4>
                        <p className="text-sm text-green-800">Remove quotes, fix spacing, normalize formats</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="font-bold text-purple-900">Auto-Fix</h4>
                        <p className="text-sm text-purple-800">Generate missing names, validate emails</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Enrichment Data</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <h4 className="font-bold text-orange-900">Contact Intelligence</h4>
                        <p className="text-sm text-orange-800">Role, platform, reach, preferences</p>
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
                  <h3 className="text-2xl font-black mb-4">Best Practices</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold mb-2">Do's</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Include both name and email when possible</li>
                        <li>• Use consistent formatting across your list</li>
                        <li>• Include headers for better parsing</li>
                        <li>• Keep files under 10MB for faster processing</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Don'ts</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Don't worry about perfect formatting</li>
                        <li>• Don't manually clean data first</li>
                        <li>• Don't split large files unnecessarily</li>
                        <li>• Don't include sensitive personal data</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* API Reference Tab */}
            <TabsContent value="api" className="space-y-8">
              <Card className="p-8 border-2 border-black">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-black text-gray-900 mb-4">
                    API Reference
                  </h2>
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
                        API access is available for Professional and Agency tiers. 
                        Contact us at <a href="mailto:api@totalaudiopromo.com" className="text-blue-600 hover:underline">api@totalaudiopromo.com</a> for access.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">📡 Endpoints</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-bold text-blue-900 mb-2">POST /api/enrich-claude</h4>
                        <p className="text-sm text-blue-800 mb-2">Enrich contact list with AI intelligence</p>
                        <div className="text-xs text-gray-600">
                          Rate limit: 100 requests/hour
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-bold text-green-900 mb-2">GET /api/search</h4>
                        <p className="text-sm text-green-800 mb-2">Search for contacts across platforms</p>
                        <div className="text-xs text-gray-600">
                          Rate limit: 200 requests/hour
                        </div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="font-bold text-purple-900 mb-2">POST /api/agents</h4>
                        <p className="text-sm text-purple-800 mb-2">Query AI agents for insights</p>
                        <div className="text-xs text-gray-600">
                          Rate limit: 50 requests/hour
                        </div>
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
                        <div className="text-blue-400">const response = await fetch(&apos;/api/enrich-claude&apos;, {'{'}</div>
                        <div className="text-gray-300 ml-4">method: &apos;POST&apos;,</div>
                        <div className="text-gray-300 ml-4">headers: {'{'}</div>
                        <div className="text-gray-300 ml-8">&apos;Authorization&apos;: &apos;Bearer YOUR_API_KEY&apos;,</div>
                        <div className="text-gray-300 ml-8">&apos;Content-Type&apos;: &apos;application/json&apos;</div>
                        <div className="text-gray-300 ml-4">{'}'},</div>
                        <div className="text-gray-300 ml-4">body: JSON.stringify({'{'}' contacts {'}'})</div>
                        <div className="text-blue-400">{'}'});</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Python</h4>
                      <div className="bg-gray-800 p-4 rounded font-mono text-sm">
                        <div className="text-blue-400">import requests</div>
                        <div className="text-gray-300">response = requests.post(</div>
                        <div className="text-gray-300 ml-4">&apos;https://api.audiointel.com/enrich&apos;,</div>
                        <div className="text-gray-300 ml-4">headers={'{'}&apos;Authorization&apos;: &apos;Bearer YOUR_API_KEY&apos;{'}'},</div>
                        <div className="text-gray-300 ml-4">json={'{'}&apos;contacts&apos;: contacts{'}'}</div>
                        <div className="text-blue-400">)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Need help? Contact our support team
            </p>
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
    </div>
  )
} 