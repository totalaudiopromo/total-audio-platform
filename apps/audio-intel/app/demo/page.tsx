// Simplified demo page - just the essentials
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  FileSpreadsheet,
  TrendingUp,
  Loader2
} from "lucide-react"
import SpreadsheetUploader from "@/components/SpreadsheetUploader"

interface Contact {
  name: string
  email: string
  company?: string
  role?: string
  intelligence?: string
}

export default function SimpleAudioIntelDemo() {
  const [activeTab, setActiveTab] = useState('spreadsheet')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [enrichedContacts, setEnrichedContacts] = useState<Contact[]>([])
  const [isEnriching, setIsEnriching] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900">Audio Intel</h1>
              <p className="text-lg text-gray-600 font-bold">AI-Powered Music Industry Intelligence Platform</p>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="spreadsheet" className="text-lg font-bold">
              <FileSpreadsheet className="w-5 h-5 mr-2" />
              Data Processing
            </TabsTrigger>
            <TabsTrigger value="enrich" className="text-lg font-bold">
              <Users className="w-5 h-5 mr-2" />
              Contact Enrichment
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-lg font-bold">
              <TrendingUp className="w-5 h-5 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Spreadsheet Processing Tab */}
          <TabsContent value="spreadsheet" className="space-y-8">
            <SpreadsheetUploader />
          </TabsContent>

          {/* Contact Enrichment Tab */}
          <TabsContent value="enrich" className="space-y-8">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-black text-gray-900">
                  AI Contact Enrichment
                </CardTitle>
                <CardDescription className="text-xl text-gray-600">
                  Transform basic contact info into rich intelligence profiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-bold text-gray-700 mb-2">
                      Contact Information (CSV format)
                    </label>
                    <Textarea
                      placeholder="Enter contacts like:
john@bbc.co.uk
jane@nme.com, Jane Smith, NME
contact@radiox.co.uk"
                      className="h-32 text-lg"
                    />
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 text-lg"
                    disabled={isEnriching}
                  >
                    {isEnriching ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Enriching Contacts...
                      </>
                    ) : (
                      'Start AI Enrichment'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-black text-blue-600 mb-2">0</div>
                    <div className="text-sm text-gray-600 font-medium">Contacts Processed</div>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-black text-green-600 mb-2">0</div>
                    <div className="text-sm text-gray-600 font-medium">Successful Enrichments</div>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-black text-purple-600 mb-2">0</div>
                    <div className="text-sm text-gray-600 font-medium">Quality Score</div>
                  </div>
                  <div className="text-center p-6 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-black text-orange-600 mb-2">0</div>
                    <div className="text-sm text-gray-600 font-medium">Export Downloads</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}// Force rebuild Wed 27 Aug 2025 22:00:04 BST
