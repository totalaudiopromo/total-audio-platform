// Simplified demo page - just the essentials
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileSpreadsheet,
  TrendingUp,
  Loader2,
  Sparkles,
  Target
} from "lucide-react"
import SpreadsheetUploader, { EnhancedSpreadsheetUploader } from "@/components/SpreadsheetUploader"
import { ProfessionalExportService } from "@/utils/exportService"
import LoadingStateDemo from "../components/LoadingStateDemo"
import ContactLoadingState from "../components/ContactLoadingState"
import AgentOrchestrator from "@/components/AgentOrchestrator"

interface Contact {
  name: string
  email: string
  company?: string
  role?: string
  intelligence?: string
  confidence?: string
}

export default function SimpleAudioIntelDemo() {
  const [activeTab, setActiveTab] = useState('process')
  const [enrichmentResults, setEnrichmentResults] = useState<Contact[]>([])
  const [hasEnrichedData, setHasEnrichedData] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState<string>('')
  
  // Disable analytics tab until enrichment is complete
  const canAccessAnalytics = hasEnrichedData
  const canAccessEnrichment = true // Always allow since we removed the old 3-step flow

  // Professional export service
  const exportService = new ProfessionalExportService({
    companyName: 'Audio Intel',
    primaryColor: '#2563eb'
  })

  // Handle professional exports
  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    if (!enrichmentResults.length) return

    setIsExporting(true)
    setExportProgress(`Preparing ${format.toUpperCase()} export...`)

    try {
      // Convert enrichment results to export format
      const contactsForExport = enrichmentResults.map(contact => ({
        name: contact.name,
        email: contact.email,
        contactIntelligence: contact.intelligence || '',
        researchConfidence: contact.confidence || '',
        lastResearched: new Date().toISOString(),
        platform: contact.email.split('@')[1]?.split('.')[0] || '',
        role: contact.role || '',
        company: contact.company || ''
      }))

      const result = await exportService.exportContacts(
        contactsForExport,
        { 
          format,
          filename: `audio-intel-contacts-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : format}`,
          includeMetadata: true
        },
        'Demo User',
        (progress) => {
          setExportProgress(`${progress.message} (${progress.percentage}%)`)
        }
      )

      if (result.success) {
        setExportProgress(`Export completed! ${contactsForExport.length} contacts exported to ${format.toUpperCase()}`)
        setTimeout(() => {
          setIsExporting(false)
          setExportProgress('')
        }, 3000)
      } else {
        throw new Error(result.message)
      }

    } catch (error) {
      setExportProgress(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setTimeout(() => {
        setIsExporting(false)
        setExportProgress('')
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen audio-gradient">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <img 
              src="/images/total_audio_promo_logo_trans.png" 
              alt="Total Audio Promo Mascot" 
              className="w-16 h-16 object-contain filter drop-shadow-lg"
            />
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900">Audio Intel</h1>
              <p className="text-lg text-gray-600 font-medium">Transform Chaos Into Intelligence</p>
            </div>
          </div>
        </div>

        {/* Enhanced Workflow Progress Dashboard */}
        <div className="mb-8 bg-gradient-to-br from-slate-50 to-stone-50 rounded-2xl border-2 border-slate-200 shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-slate-800 mb-2">Your Audio Intel Workflow</h2>
            <p className="text-slate-600">Professional contact intelligence in three simple steps</p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12">
            {/* Step 1: Process & Enrich */}
            <div className={`flex flex-col lg:flex-row items-center gap-4 p-6 rounded-xl transition-all duration-300 ${
              activeTab === 'process' 
                ? 'bg-blue-100 border-2 border-blue-300 shadow-md scale-105' 
                : hasEnrichedData 
                ? 'bg-green-100 border-2 border-green-300 shadow-md'
                : 'bg-white border border-slate-200 hover:shadow-md'
            }`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 ${
                hasEnrichedData 
                  ? 'bg-green-500 text-white shadow-lg' 
                  : activeTab === 'process' 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {hasEnrichedData ? '•' : '1'}
              </div>
              <div className="text-center lg:text-left">
                <div className={`font-bold text-lg ${
                  activeTab === 'process' ? 'text-blue-700' : hasEnrichedData ? 'text-green-700' : 'text-slate-600'
                }`}>
                  Process & Enrich
                </div>
                <div className="text-sm text-slate-600 max-w-xs">
                  Upload spreadsheets → Automatic cleaning & enrichment
                </div>
              </div>
            </div>

            {/* Progress Arrow */}
            <div className="hidden lg:block">
              <div className={`text-3xl font-bold transition-colors duration-300 ${
                hasEnrichedData ? 'text-green-400' : 'text-slate-300'
              }`}>
                →
              </div>
            </div>
            <div className="lg:hidden">
              <div className={`text-2xl font-bold rotate-90 transition-colors duration-300 ${
                hasEnrichedData ? 'text-green-400' : 'text-slate-300'
              }`}>
                →
              </div>
            </div>

            {/* Step 2: Analytics & Export */}
            <div className={`flex flex-col lg:flex-row items-center gap-4 p-6 rounded-xl transition-all duration-300 ${
              activeTab === 'analytics' && hasEnrichedData
                ? 'bg-blue-100 border-2 border-blue-300 shadow-md scale-105'
                : hasEnrichedData
                ? 'bg-white border border-slate-200 hover:shadow-md cursor-pointer'
                : 'bg-slate-50 border border-slate-200 opacity-60'
            }`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 ${
                activeTab === 'analytics' && hasEnrichedData
                  ? 'bg-blue-500 text-white shadow-lg'
                  : hasEnrichedData
                  ? 'bg-slate-300 text-slate-700'
                  : 'bg-slate-200 text-slate-500'
              }`}>
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="text-center lg:text-left">
                <div className={`font-bold text-lg ${
                  activeTab === 'analytics' && hasEnrichedData ? 'text-blue-700' : hasEnrichedData ? 'text-slate-700' : 'text-slate-500'
                }`}>
                  Analytics & Export
                </div>
                <div className="text-sm text-slate-600 max-w-xs">
                  Review insights → Professional export formats
                </div>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {hasEnrichedData && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Data Ready for Analysis
              </div>
            )}
            {activeTab === 'process' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Processing Active
              </div>
            )}
            {!hasEnrichedData && activeTab !== 'process' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                Ready to Begin
              </div>
            )}
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="process" className="text-xl font-bold py-4">
              <FileSpreadsheet className="w-6 h-6 mr-2" />
              1. Process & Enrich
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className={`text-xl font-bold py-4 ${!canAccessAnalytics ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!canAccessAnalytics}
              title={!canAccessAnalytics ? 'Complete processing & enrichment first to unlock analytics' : 'Ready for analytics and export'}
            >
              <TrendingUp className="w-6 h-6 mr-2" />
              2. Analytics & Export
            </TabsTrigger>
          </TabsList>

          {/* Combined Processing & Enrichment Tab */}
          <TabsContent value="process" className="space-y-8">
            <Card className="border-0 bg-gradient-to-br from-slate-50 to-stone-50 shadow-2xl">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-4xl md:text-5xl font-black text-slate-800 mb-6 tracking-tight">
                  Drop Your Chaos Here
                </CardTitle>
                <CardDescription className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  Transform unorganised spreadsheets into actionable music industry intelligence with our automated processing pipeline.
                </CardDescription>
                
                <div className="grid md:grid-cols-2 gap-4 mt-8 max-w-4xl mx-auto">
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div className="text-slate-700 font-semibold mb-2">• Intelligent Processing</div>
                    <p className="text-sm text-slate-600">Upload → Clean → Deduplicate → Enrich → Export</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div className="text-slate-700 font-semibold mb-2"><Target className="w-4 h-4 inline mr-2" />Cost-Effective Intelligence</div>
                    <p className="text-sm text-slate-600">7x more affordable than traditional research methods</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <EnhancedSpreadsheetUploader 
              onDataEnriched={(enrichedData) => {
                setEnrichmentResults(enrichedData)
                setHasEnrichedData(true)
                setActiveTab('analytics')
              }}
            />
            
            {/* Loading States Demo - Always Visible */}
            <div className="mt-12">
              <LoadingStateDemo />
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            {!canAccessAnalytics ? (
              <Card className="border-2 border-yellow-300 bg-yellow-50">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-black text-gray-900">
                    Analytics Unavailable
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    Complete Step 1 (Process & Enrich) first by uploading your spreadsheets
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    onClick={() => setActiveTab('process')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 py-3"
                  >
                    Go to Process & Enrich
                  </Button>
                </CardContent>
              </Card>
            ) : (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-black text-gray-900">
                  Contact Intelligence Analytics
                </CardTitle>
                <CardDescription className="text-xl text-gray-600">
                  Insights and analytics from your contact enrichment campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-black text-blue-600 mb-2">{enrichmentResults.length}</div>
                    <div className="text-sm text-gray-600 font-medium">Total Contacts</div>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-black text-green-600 mb-2">
                      {enrichmentResults.filter(c => c.confidence === 'High').length}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">High Confidence</div>
                  </div>
                  <div className="text-center p-6 bg-yellow-50 rounded-lg">
                    <div className="text-3xl font-black text-yellow-600 mb-2">
                      {enrichmentResults.filter(c => c.confidence === 'Medium').length}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Medium Confidence</div>
                  </div>
                  <div className="text-center p-6 bg-red-50 rounded-lg">
                    <div className="text-3xl font-black text-red-600 mb-2">
                      {enrichmentResults.filter(c => c.confidence === 'Low').length}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Low Confidence</div>
                  </div>
                </div>

                {/* Professional Export Section */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
                  <h3 className="text-2xl font-black text-gray-900 mb-4">Professional Export Options</h3>
                  <p className="text-gray-700 mb-6">
                    Export your enriched contacts in professional formats for your PR campaigns, client deliverables, and team collaboration.
                  </p>
                  
                  {isExporting && (
                    <div className="mb-6">
                      <ContactLoadingState 
                        state="export" 
                        progress={0} 
                        message={exportProgress} 
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={() => handleExport('csv')}
                      disabled={isExporting}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FileSpreadsheet className="w-5 h-5" />
                      Export CSV
                      <Badge className="bg-green-500 text-white ml-2">Universal</Badge>
                    </Button>

                    <Button
                      onClick={() => handleExport('excel')}
                      disabled={isExporting}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FileSpreadsheet className="w-5 h-5" />
                      Export Excel
                      <Badge className="bg-blue-500 text-white ml-2">Advanced</Badge>
                    </Button>

                    <Button
                      onClick={() => handleExport('pdf')}
                      disabled={isExporting}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FileSpreadsheet className="w-5 h-5" />
                      Export PDF
                      <Badge className="bg-purple-500 text-white ml-2">Professional</Badge>
                    </Button>
                  </div>

                  <div className="mt-4 text-sm text-gray-600 space-y-1">
                    <p><strong>CSV:</strong> Universal format for any CRM, email platform, or spreadsheet software</p>
                    <p><strong>Excel:</strong> Multi-sheet workbook with platform summaries and analytics</p>
                    <p><strong>PDF:</strong> Professional report with Audio Intel branding for client deliverables</p>
                  </div>

                  {/* Fun mascot element for export actions */}
                  <div className="mt-6 flex items-center justify-center">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <img 
                        src="/assets/loading-states/vinyl-throw-action.png" 
                        alt="Total Audio Promo mascot throwing vinyl record - ready for action!" 
                        className="w-24 h-24 rounded-xl animate-bounce"
                        style={{ 
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                          imageRendering: 'crisp-edges',
                          objectFit: 'cover',
                          animationDuration: '2s'
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/images/total_audio_promo_logo_trans.png'
                        }}
                      />
                      <div className="text-center">
                        <p className="text-lg font-bold text-purple-700">Ready to throw your contacts into action!</p>
                        <p className="text-sm text-purple-600">Your Total Audio Promo mascot is here to make exports fun and professional</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Display */}
                {enrichmentResults.length > 0 && (
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-bold text-green-800 mb-2">Current Demo Capabilities</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Email domain analysis and company identification</li>
                        <li>• Username pattern recognition for role suggestions</li>
                        <li>• Basic email validation and formatting</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-bold text-blue-800 mb-2">Production Enrichment Includes</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• LinkedIn API integration for current employment verification</li>
                        <li>• Social media profile discovery and analysis</li>
                        <li>• Music industry database cross-referencing</li>
                        <li>• Contact preference analysis from previous campaigns</li>
                        <li>• Real engagement data and response rates</li>
                        <li>• Current project information and industry activity</li>
                      </ul>
                    </div>
                    
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Confidence-Based Results</h3>
                    
                    {/* High Confidence Contacts */}
                    {enrichmentResults.filter(c => c.confidence === 'High').length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-xl font-black text-green-700 mb-4">
                          High Confidence ({enrichmentResults.filter(c => c.confidence === 'High').length} contacts)
                        </h4>
                        <div className="space-y-3">
                          {enrichmentResults.filter(c => c.confidence === 'High').map((contact, index) => (
                            <Card key={index} className="border-l-4 border-l-green-500">
                              <CardContent className="p-4">
                                <div className="grid grid-cols-1 gap-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-bold text-gray-900">{contact.name}</div>
                                      <div className="text-blue-600 font-medium">{contact.email}</div>
                                    </div>
                                    <Badge className="bg-green-500 text-white">High Confidence</Badge>
                                  </div>
                                  <div className="text-sm text-gray-700">{contact.intelligence}</div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Medium Confidence Contacts */}
                    {enrichmentResults.filter(c => c.confidence === 'Medium').length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-xl font-black text-yellow-700 mb-4">
                          Medium Confidence ({enrichmentResults.filter(c => c.confidence === 'Medium').length} contacts)
                        </h4>
                        <div className="space-y-3">
                          {enrichmentResults.filter(c => c.confidence === 'Medium').map((contact, index) => (
                            <Card key={index} className="border-l-4 border-l-yellow-500">
                              <CardContent className="p-4">
                                <div className="grid grid-cols-1 gap-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-bold text-gray-900">{contact.name}</div>
                                      <div className="text-blue-600 font-medium">{contact.email}</div>
                                    </div>
                                    <Badge variant="outline" className="border-yellow-500 text-yellow-700">Medium Confidence</Badge>
                                  </div>
                                  <div className="text-sm text-gray-700">{contact.intelligence}</div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Low Confidence Contacts */}
                    {enrichmentResults.filter(c => c.confidence === 'Low').length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-xl font-black text-red-700 mb-4">
                          Low Confidence ({enrichmentResults.filter(c => c.confidence === 'Low').length} contacts) - Requires Manual Research
                        </h4>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                          <p className="text-sm text-red-800 font-bold">
                            <strong>Cost-Saving Tip:</strong> These contacts need manual research or paid API enrichment. 
                            Focus your budget on High and Medium confidence contacts first for better ROI.
                          </p>
                        </div>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {enrichmentResults.filter(c => c.confidence === 'Low').map((contact, index) => (
                            <Card key={index} className="border-l-4 border-l-red-500">
                              <CardContent className="p-4">
                                <div className="grid grid-cols-1 gap-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-bold text-gray-900">{contact.name}</div>
                                      <div className="text-blue-600 font-medium">{contact.email}</div>
                                    </div>
                                    <Badge variant="outline" className="border-red-500 text-red-700">Needs Research</Badge>
                                  </div>
                                  <div className="text-sm text-gray-600">{contact.intelligence}</div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Loading States Demo Section */}
                <div className="mt-12">
                  <LoadingStateDemo />
                </div>
              </CardContent>
            </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}// Force rebuild Wed 27 Aug 2025 22:00:04 BST
