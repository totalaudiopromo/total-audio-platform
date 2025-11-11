// Simplified demo page - just the essentials
'use client';

// Force dynamic rendering to ensure middleware auth checks run
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileSpreadsheet, TrendingUp, Loader2, Sparkles, Target } from 'lucide-react';
import Link from 'next/link';
import SpreadsheetUploader, { EnhancedSpreadsheetUploader } from '@/components/SpreadsheetUploader';
import { ProfessionalExportService } from '@/utils/exportService';
import ContactLoadingState from '../components/ContactLoadingState';
import BetaTrialStatus from '@/components/BetaTrialStatus';
import { trackPageView } from '@/utils/analytics';
import { SiteHeader } from '../components/SiteHeader';
import { CondensedIntelligenceCard } from '@/components/CondensedIntelligenceCard';

interface Contact {
  name: string;
  email: string;
  company?: string;
  role?: string;
  intelligence?: string;
  confidence?: string;
}

export default function SimpleAudioIntelDemo() {
  const [activeTab, setActiveTab] = useState('process');
  const [enrichmentResults, setEnrichmentResults] = useState<Contact[]>([]);
  const [hasEnrichedData, setHasEnrichedData] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [betaTrialStatus, setBetaTrialStatus] = useState<any>(null);
  const [notifyStatus, setNotifyStatus] = useState<string | null>(null);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  // Get user email from localStorage or URL params (from beta signup)
  useEffect(() => {
    // Track page view
    trackPageView('demo', document.title);

    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    const storedEmail = localStorage.getItem('beta_user_email');

    const email = emailParam || storedEmail;
    if (email) {
      setUserEmail(email);
      localStorage.setItem('beta_user_email', email);

      // Check beta trial status
      checkBetaStatus(email);
    }
  }, []);

  const checkBetaStatus = async (email: string) => {
    try {
      const response = await fetch(`/api/beta-status?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (data.success) {
        setBetaTrialStatus(data.betaStatus);
      }
    } catch (error) {
      console.error('Error checking beta status:', error);
    }
  };

  const handleUpgradeClick = () => {
    // Redirect to Stripe checkout with 50% lifetime discount
    window.location.href = '/api/checkout?plan=beta_founder&email=' + encodeURIComponent(userEmail);
  };

  // Disable analytics tab until enrichment is complete
  const canAccessAnalytics = hasEnrichedData;
  const canAccessEnrichment = true; // Always allow since we removed the old 3-step flow

  // Professional export service
  const exportService = new ProfessionalExportService({
    companyName: 'Audio Intel',
    primaryColor: '#2563eb',
  });

  // Load Liberty demo data
  const loadLibertyDemoData = () => {
    setIsLoadingDemo(true);
    setNotifyStatus('Loading Liberty demo data...');

    // Real industry contacts for demonstration (BBC Radio 1, Spotify, major outlets)
    const libertyDemoContacts: Contact[] = [
      {
        name: 'Jack Saunders',
        email: 'jack.saunders@bbc.co.uk',
        company: 'BBC Radio 1',
        role: 'Presenter',
        intelligence:
          '🎵 BBC Radio 1 - UK national broadcaster\n📻 Presenter of "Jack Saunders New Music" show\n🎧 Genres: Alternative, Indie, Rock, Electronic\n⭐ Key tastemaker for breaking new artists in the UK\n📍 Broadcasting House, London\n🎯 Best contact time: Weekday mornings for submissions',
        confidence: 'High',
      },
      {
        name: 'Nick Grimshaw',
        email: 'nick.grimshaw@bbc.co.uk',
        company: 'BBC 6 Music',
        role: 'Presenter',
        intelligence:
          '🎵 BBC 6 Music - National digital radio station\n📻 Presenter specialising in alternative and indie music\n🎧 Genres: Indie, Alternative, Pop, Electronic\n⭐ Former Radio 1 Breakfast Show host, influential tastemaker\n📍 Broadcasting House, London\n🎯 Known for championing new and emerging artists',
        confidence: 'High',
      },
      {
        name: 'Clara Amfo',
        email: 'clara.amfo@bbc.co.uk',
        company: 'BBC Radio 1',
        role: 'Presenter',
        intelligence:
          '🎵 BBC Radio 1\n📻 Mid-morning show presenter\n🎧 Genres: Pop, R&B, Hip-Hop, UK artists\n⭐ Champion of diverse new music\n📍 Broadcasting House, London\n🎯 Focus on emerging UK talent',
        confidence: 'High',
      },
      {
        name: 'Spotify Editorial',
        email: 'editorial@spotify.com',
        company: 'Spotify',
        role: 'Playlist Curators',
        intelligence:
          '🎵 Spotify - Global streaming platform\n📻 Editorial team managing major playlists\n🎧 Genres: All genres, playlist-specific\n⭐ Controls major playlists like New Music Friday UK\n📍 London office + global teams\n🎯 Submit via Spotify for Artists platform',
        confidence: 'Medium',
      },
      {
        name: 'Huw Stephens',
        email: 'huw.stephens@bbc.co.uk',
        company: 'BBC Radio 1',
        role: 'Presenter',
        intelligence:
          '🎵 BBC Radio 1 & 6 Music\n📻 Specialist presenter for new music\n🎧 Genres: Alternative, Indie, Welsh artists\n⭐ Long-standing champion of new music scenes\n📍 Wales & London\n🎯 Covers festivals and breaking artists',
        confidence: 'High',
      },
    ];

    setTimeout(() => {
      setEnrichmentResults(libertyDemoContacts);
      setHasEnrichedData(true);
      setActiveTab('analytics');
      setIsLoadingDemo(false);
      setNotifyStatus('Demo data loaded! 5 industry contacts enriched (BBC Radio 1, Spotify).');
      setTimeout(() => setNotifyStatus(null), 3000);
    }, 1500); // Simulate loading time
  };

  // Send contact to Pitch Generator
  const handleSendToPitch = async (contact: Contact) => {
    try {
      // Parse the intelligence field to extract structured data
      const intelligence = contact.intelligence || '';

      // Extract outlet (first line with 🎵 emoji)
      const outletMatch = intelligence.match(/🎵\s*([^\n|]+)/);
      const outlet = outletMatch ? outletMatch[1].trim() : '';

      // Extract role (look for common role keywords)
      const roleMatch = intelligence.match(
        /(presenter|producer|editor|curator|director|manager|host|dj)/i
      );
      const role = roleMatch ? roleMatch[1] : '';

      // Extract genres (look for genre mentions or music format)
      const genreMatch = intelligence.match(/🎧\s*([^\n]+)/);
      const genres = genreMatch ? genreMatch[1].trim() : '';

      // Use the full intelligence as notes
      const notes = intelligence;

      // Create the data structure for clipboard
      const clipboardData = {
        source: 'intel',
        contacts: [
          {
            name: contact.name,
            outlet: outlet,
            role: role || contact.role || '',
            genres: genres,
            notes: notes,
            email: contact.email,
          },
        ],
      };

      // Copy to clipboard
      await navigator.clipboard.writeText(JSON.stringify(clipboardData));

      // Show success notification
      setNotifyStatus('Contact copied! Opening Pitch Generator...');

      // Open Pitch Generator with import flag - goes directly to pitch generation with contact loaded
      window.open('https://pitch.totalaudiopromo.com/pitch/generate?import=clipboard', '_blank');

      // Clear notification after 3 seconds
      setTimeout(() => setNotifyStatus(null), 3000);
    } catch (error) {
      console.error('Error sending to Pitch Generator:', error);
      setNotifyStatus('Failed to copy contact data. Please try again.');
      setTimeout(() => setNotifyStatus(null), 3000);
    }
  };

  // Handle professional exports
  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    if (!enrichmentResults.length) return;

    setIsExporting(true);
    setExportProgress(`Preparing ${format.toUpperCase()} export...`);

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
        company: contact.company || '',
      }));

      const result = await exportService.exportContacts(
        contactsForExport,
        {
          format,
          filename: `audio-intel-contacts-${new Date().toISOString().split('T')[0]}.${
            format === 'excel' ? 'xlsx' : format
          }`,
          includeMetadata: true,
        },
        'Demo User',
        progress => {
          setExportProgress(`${progress.message} (${progress.percentage}%)`);
        }
      );

      if (result.success) {
        setExportProgress(
          `Export completed! ${
            contactsForExport.length
          } contacts exported to ${format.toUpperCase()}`
        );
        setTimeout(() => {
          setIsExporting(false);
          setExportProgress('');
        }, 3000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setExportProgress(
        `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress('');
      }, 3000);
    }
  };

  // Handle sending contacts to Tracker
  const handleSendToTracker = async () => {
    if (!enrichmentResults.length) return;

    setIsExporting(true);
    setExportProgress('Preparing contacts for Tracker...');

    try {
      // Convert enrichment results to Tracker format
      const contactsForTracker = enrichmentResults.map(contact => ({
        name: contact.name,
        email: contact.email,
        contactIntelligence: contact.intelligence || '',
        researchConfidence: contact.confidence || '',
        lastResearched: new Date().toISOString(),
        platform: contact.email.split('@')[1]?.split('.')[0] || '',
        role: contact.role || '',
        company: contact.company || '',
      }));

      const response = await fetch('/api/export-to-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contacts: contactsForTracker,
          campaignName: 'Audio Intel Export',
          includeEnrichmentData: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Export to Tracker failed');
      }

      const result = await response.json();

      if (result.success) {
        setExportProgress(`Opening Tracker...`);

        // Download the CSV
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = result.filename;
        link.click();

        // Open Tracker import page with deep link
        setTimeout(() => {
          window.open(result.deepLink, '_blank');
          setExportProgress(`${contactsForTracker.length} contacts sent to Tracker!`);
          setTimeout(() => {
            setIsExporting(false);
            setExportProgress('');
          }, 3000);
        }, 500);
      } else {
        throw new Error(result.error || 'Export failed');
      }
    } catch (error) {
      setExportProgress(
        `Failed to send to Tracker: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen audio-gradient">
      {/* Navigation Header */}
      <SiteHeader />

      {/* Toast Notification */}
      {notifyStatus && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black font-bold animate-slide-in">
          {notifyStatus}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Beta Trial Status */}
        {userEmail && betaTrialStatus && (
          <BetaTrialStatus
            userEmail={userEmail}
            signupTimestamp={betaTrialStatus.signupDate}
            onUpgradeClick={handleUpgradeClick}
          />
        )}
        {/* Block access if trial expired */}
        {betaTrialStatus?.hasExpired && (
          <div className="max-w-4xl mx-auto">
            <Card className="border-4 border-red-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-8">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-black text-red-900 mb-4">🔒 Free Trial Expired</h2>
                <p className="text-xl font-bold text-red-800 mb-6">
                  Your 14-day free trial has ended. Upgrade now to continue using Audio Intel with
                  your exclusive 50% lifetime discount!
                </p>
                <Button
                  onClick={handleUpgradeClick}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-black text-xl px-8 py-4 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                  Unlock Audio Intel - £9.99/month Forever
                </Button>
              </CardContent>
            </Card>
            <div style={{ filter: 'blur(5px)', pointerEvents: 'none' }}>
              {/* Demo content will be blurred when trial expired */}
            </div>
          </div>
        )}
        {/* Main Demo Content - only show if trial is active */}
        {(!betaTrialStatus || !betaTrialStatus.hasExpired) && (
          <>
            {/* Enhanced Workflow Progress Dashboard */}
            <div className="mb-8 bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
                  Your Audio Intel Workflow
                </h2>
                <p className="text-sm md:text-base text-gray-600 font-bold">
                  Professional contact intelligence in two simple steps
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-4">
                  <button
                    onClick={() => setActiveTab('process')}
                    className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 rounded-xl border-4 transition-all ${
                      activeTab === 'process'
                        ? 'bg-blue-600 text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                        : hasEnrichedData
                          ? 'bg-white text-gray-900 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5'
                          : 'bg-white text-gray-600 border-gray-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                        activeTab === 'process'
                          ? 'bg-white text-blue-600'
                          : hasEnrichedData
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {hasEnrichedData ? '✓' : '1'}
                    </div>
                    <div className="text-left">
                      <div className="font-black text-sm md:text-lg">Process & Enrich</div>
                      <div className="text-xs font-bold opacity-80 hidden md:block">
                        Upload → Clean → Enrich
                      </div>
                    </div>
                  </button>

                  <div className="hidden md:flex flex-1 mx-4 h-2 bg-gray-200 border-2 border-black rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        hasEnrichedData ? 'bg-green-500 border-r-2 border-black' : 'bg-blue-600'
                      }`}
                      style={{ width: hasEnrichedData ? '100%' : '50%' }}
                    />
                  </div>

                  <button
                    onClick={() => hasEnrichedData && setActiveTab('analytics')}
                    disabled={!hasEnrichedData}
                    className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 rounded-xl border-4 transition-all ${
                      activeTab === 'analytics' && hasEnrichedData
                        ? 'bg-blue-500 text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                        : hasEnrichedData
                          ? 'bg-white text-gray-900 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-pointer'
                          : 'bg-gray-50 text-gray-400 border-gray-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                        activeTab === 'analytics' && hasEnrichedData
                          ? 'bg-white text-blue-500'
                          : hasEnrichedData
                            ? 'bg-gray-300 text-gray-700'
                            : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-black text-sm md:text-lg">Analytics & Export</div>
                      <div className="text-xs font-bold opacity-80 hidden md:block">
                        Review → Export
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex flex-wrap justify-center gap-3">
                {hasEnrichedData && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-900 rounded-full text-xs md:text-sm font-black border-2 border-green-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Data Ready for Analysis
                  </div>
                )}
                {activeTab === 'process' && !hasEnrichedData && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-900 rounded-full text-xs md:text-sm font-black border-2 border-blue-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    Ready to Process
                  </div>
                )}
              </div>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 gap-3 mb-6 md:mb-8 bg-transparent p-0">
                <TabsTrigger
                  value="process"
                  className="text-sm md:text-xl font-black py-4 md:py-6 border-4 border-black rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 data-[state=inactive]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
                >
                  <FileSpreadsheet className="w-5 h-5 md:w-6 md:h-6 mr-1.5 md:mr-2" />
                  <span className="hidden sm:inline">1. Process & Enrich</span>
                  <span className="sm:hidden">Process</span>
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className={`text-sm md:text-xl font-black py-4 md:py-6 border-4 border-black rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 data-[state=inactive]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 ${
                    !canAccessAnalytics ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!canAccessAnalytics}
                  title={
                    !canAccessAnalytics
                      ? 'Complete processing & enrichment first to unlock analytics'
                      : 'Ready for analytics and export'
                  }
                >
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 mr-1.5 md:mr-2" />
                  <span className="hidden sm:inline">2. Analytics & Export</span>
                  <span className="sm:hidden">Analytics</span>
                </TabsTrigger>
              </TabsList>

              {/* Combined Processing & Enrichment Tab */}
              <TabsContent value="process" className="space-y-8">
                <div className="bg-white p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
                  <div className="text-center pb-8">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                      Contact Enrichment
                    </h2>
                    <p className="text-xl font-bold text-gray-700 max-w-3xl mx-auto leading-relaxed">
                      Transform your contact lists into actionable music industry intelligence with
                      automated processing and AI-powered enrichment.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 mt-8 max-w-4xl mx-auto">
                      <div className="bg-white border-4 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="text-gray-900 font-black mb-2 text-lg">
                          Intelligent Processing Pipeline
                        </div>
                        <p className="text-sm text-gray-700 font-bold">
                          Upload → Clean → Deduplicate → Enrich → Export
                        </p>
                      </div>
                      <div className="bg-white border-4 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="text-gray-900 font-black mb-2 text-lg flex items-center justify-center gap-2">
                          <Target className="w-5 h-5" />
                          Cost-Effective Intelligence
                        </div>
                        <p className="text-sm text-gray-700 font-bold">
                          7x more affordable than traditional research methods
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Demo Data Loader */}
                <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-gray-900 mb-2">
                        🎯 Quick Demo: Real Industry Contacts
                      </h3>
                      <p className="text-sm text-gray-700 font-bold">
                        Load 5 pre-enriched contacts from BBC Radio 1 and Spotify instantly to see
                        Audio Intel in action. Real emails, real enrichment data.
                      </p>
                    </div>
                    <Button
                      onClick={loadLibertyDemoData}
                      disabled={isLoadingDemo}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isLoadingDemo ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2 inline" />
                          Load Demo Data
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="text-center my-6">
                  <div className="inline-flex items-center gap-4 text-gray-500 font-bold">
                    <div className="h-px bg-gray-300 flex-1 w-32"></div>
                    <span>OR</span>
                    <div className="h-px bg-gray-300 flex-1 w-32"></div>
                  </div>
                </div>

                <EnhancedSpreadsheetUploader
                  onDataEnriched={enrichedData => {
                    setEnrichmentResults(enrichedData);
                    setHasEnrichedData(true);
                    setActiveTab('analytics');
                  }}
                />
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-8">
                {!canAccessAnalytics ? (
                  <div className="border-4 border-yellow-500 bg-yellow-50 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
                    <div className="text-center">
                      <h3 className="text-2xl font-black text-gray-900 mb-4">
                        Analytics Unavailable
                      </h3>
                      <p className="text-lg text-gray-700 font-bold mb-6">
                        Complete Step 1 (Process & Enrich) first by uploading your spreadsheets
                      </p>
                    </div>
                    <div className="text-center">
                      <Button
                        onClick={() => setActiveTab('process')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                      >
                        Go to Process & Enrich
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-black text-gray-900 mb-4">
                        Contact Intelligence Analytics
                      </h3>
                      <p className="text-xl text-gray-600 font-bold">
                        Insights and analytics from your contact enrichment campaigns
                      </p>
                    </div>
                    <div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="text-center p-6 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <div className="text-3xl font-black text-blue-600 mb-2">
                            {enrichmentResults.length}
                          </div>
                          <div className="text-sm text-gray-700 font-bold">Total Contacts</div>
                        </div>
                        <div className="text-center p-6 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <div className="text-3xl font-black text-green-600 mb-2">
                            {enrichmentResults.filter(c => c.confidence === 'High').length}
                          </div>
                          <div className="text-sm text-gray-700 font-bold">High Confidence</div>
                        </div>
                        <div className="text-center p-6 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <div className="text-3xl font-black text-yellow-600 mb-2">
                            {enrichmentResults.filter(c => c.confidence === 'Medium').length}
                          </div>
                          <div className="text-sm text-gray-700 font-bold">Medium Confidence</div>
                        </div>
                        <div className="text-center p-6 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <div className="text-3xl font-black text-red-600 mb-2">
                            {enrichmentResults.filter(c => c.confidence === 'Low').length}
                          </div>
                          <div className="text-sm text-gray-700 font-bold">Low Confidence</div>
                        </div>
                      </div>

                      {/* Professional Export Section */}
                      <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-8">
                        <h3 className="text-2xl font-black text-gray-900 mb-4">
                          Professional Export Options
                        </h3>
                        <p className="text-gray-700 font-bold mb-6">
                          Export your enriched contacts in professional formats for your PR
                          campaigns, client deliverables, and team collaboration.
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
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <FileSpreadsheet className="w-5 h-5" />
                            Export CSV
                            <Badge className="bg-blue-700 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ml-2 font-bold">
                              Universal
                            </Badge>
                          </Button>

                          <Button
                            onClick={() => handleExport('excel')}
                            disabled={isExporting}
                            className="bg-teal-500 hover:bg-teal-600 text-white font-black py-4 px-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <FileSpreadsheet className="w-5 h-5" />
                            Export Excel
                            <Badge className="bg-teal-600 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ml-2 font-bold">
                              Advanced
                            </Badge>
                          </Button>

                          <Button
                            onClick={() => handleExport('pdf')}
                            disabled={isExporting}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-black py-4 px-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <FileSpreadsheet className="w-5 h-5" />
                            Export PDF
                            <Badge className="bg-blue-600 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ml-2 font-bold">
                              Professional
                            </Badge>
                          </Button>
                        </div>

                        <div className="mt-4 text-sm text-gray-600 space-y-1 font-medium">
                          <p>
                            <strong className="font-black">CSV:</strong> Universal format for any
                            CRM, email platform, or spreadsheet software
                          </p>
                          <p>
                            <strong className="font-black">Excel:</strong> Multi-sheet workbook with
                            platform summaries and analytics
                          </p>
                          <p>
                            <strong className="font-black">PDF:</strong> Professional report with
                            Audio Intel branding for client deliverables
                          </p>
                        </div>

                        {/* Tool Integration - Send to Tracker */}
                        <div className="mt-6 pt-6 border-t-4 border-black">
                          <h4 className="text-lg font-black text-gray-900 mb-3">
                            🚀 Tool Integration
                          </h4>
                          <p className="text-sm text-gray-700 font-bold mb-4">
                            Send your enriched contacts directly to Tracker for campaign management
                          </p>
                          <Button
                            onClick={handleSendToTracker}
                            disabled={isExporting}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 text-lg"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                            Send {enrichmentResults.length} Contacts to Tracker
                            <Badge className="bg-blue-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ml-2 font-bold">
                              Direct Import
                            </Badge>
                          </Button>
                          <p className="text-xs text-gray-500 mt-2 text-center font-medium">
                            Automatically opens Tracker import page with your enriched contacts
                            ready to import
                          </p>
                        </div>
                      </div>

                      {/* Results Display */}
                      {enrichmentResults.length > 0 && (
                        <div className="space-y-6">
                          <div className="bg-white border-4 border-green-500 rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                            <h4 className="font-black text-green-800 mb-3 text-lg">
                              Current Demo Capabilities
                            </h4>
                            <ul className="text-sm text-green-700 space-y-2 font-bold">
                              <li>• Email domain analysis and company identification</li>
                              <li>• Username pattern recognition for role suggestions</li>
                              <li>• Basic email validation and formatting</li>
                            </ul>
                          </div>

                          <div className="bg-white border-4 border-blue-500 rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                            <h4 className="font-black text-blue-800 mb-3 text-lg">
                              Production Enrichment Includes
                            </h4>
                            <ul className="text-sm text-blue-700 space-y-2 font-bold">
                              <li>
                                • LinkedIn API integration for current employment verification
                              </li>
                              <li>• Social media profile discovery and analysis</li>
                              <li>• Music industry database cross-referencing</li>
                              <li>• Contact preference analysis from previous campaigns</li>
                              <li>• Real engagement data and response rates</li>
                              <li>• Current project information and industry activity</li>
                            </ul>
                          </div>

                          <h3 className="text-2xl font-black text-gray-900 mb-4">
                            Confidence-Based Results
                          </h3>

                          {/* High Confidence Contacts */}
                          {enrichmentResults.filter(c => c.confidence === 'High').length > 0 && (
                            <div className="mb-8">
                              <h4 className="text-xl font-black text-green-700 mb-4">
                                High Confidence (
                                {enrichmentResults.filter(c => c.confidence === 'High').length}{' '}
                                contacts)
                              </h4>
                              <div className="space-y-4">
                                {enrichmentResults
                                  .filter(c => c.confidence === 'High')
                                  .map((contact, index) => (
                                    <Card
                                      key={index}
                                      className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                                    >
                                      <CardContent className="p-6">
                                        <div className="grid grid-cols-1 gap-4">
                                          <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                              <div className="text-xl font-black text-gray-900 mb-1">
                                                {contact.name}
                                              </div>
                                              <div className="text-blue-600 font-bold text-sm">
                                                {contact.email}
                                              </div>
                                              {contact.company && (
                                                <div className="text-gray-600 font-medium text-sm mt-1">
                                                  {contact.company}
                                                </div>
                                              )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                              <Badge className="bg-green-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold px-3 py-1">
                                                High Confidence
                                              </Badge>
                                              <Button
                                                onClick={() => handleSendToPitch(contact)}
                                                size="sm"
                                                className="bg-yellow-500 hover:bg-yellow-600 text-black font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                                              >
                                                → Pitch
                                              </Button>
                                            </div>
                                          </div>
                                          <CondensedIntelligenceCard
                                            intelligence={contact.intelligence}
                                            confidence={contact.confidence}
                                          />
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
                                Medium Confidence (
                                {enrichmentResults.filter(c => c.confidence === 'Medium').length}{' '}
                                contacts)
                              </h4>
                              <div className="space-y-4">
                                {enrichmentResults
                                  .filter(c => c.confidence === 'Medium')
                                  .map((contact, index) => (
                                    <Card
                                      key={index}
                                      className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                                    >
                                      <CardContent className="p-6">
                                        <div className="grid grid-cols-1 gap-4">
                                          <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                              <div className="text-xl font-black text-gray-900 mb-1">
                                                {contact.name}
                                              </div>
                                              <div className="text-blue-600 font-bold text-sm">
                                                {contact.email}
                                              </div>
                                              {contact.company && (
                                                <div className="text-gray-600 font-medium text-sm mt-1">
                                                  {contact.company}
                                                </div>
                                              )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                              <Badge className="bg-yellow-500 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold px-3 py-1">
                                                Medium Confidence
                                              </Badge>
                                              <Button
                                                onClick={() => handleSendToPitch(contact)}
                                                size="sm"
                                                className="bg-yellow-500 hover:bg-yellow-600 text-black font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                                              >
                                                → Pitch
                                              </Button>
                                            </div>
                                          </div>
                                          <CondensedIntelligenceCard
                                            intelligence={contact.intelligence}
                                            confidence={contact.confidence}
                                          />
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
                                Low Confidence (
                                {enrichmentResults.filter(c => c.confidence === 'Low').length}{' '}
                                contacts) - Requires Manual Research
                              </h4>
                              <div className="bg-red-50 border-4 border-red-500 rounded-xl p-4 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <p className="text-sm text-red-800 font-bold">
                                  <strong>Cost-Saving Tip:</strong> These contacts need manual
                                  research or paid API enrichment. Focus your budget on High and
                                  Medium confidence contacts first for better ROI.
                                </p>
                              </div>
                              <div className="space-y-4 max-h-64 overflow-y-auto">
                                {enrichmentResults
                                  .filter(c => c.confidence === 'Low')
                                  .map((contact, index) => (
                                    <Card
                                      key={index}
                                      className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                                    >
                                      <CardContent className="p-6">
                                        <div className="grid grid-cols-1 gap-4">
                                          <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                              <div className="text-xl font-black text-gray-900 mb-1">
                                                {contact.name}
                                              </div>
                                              <div className="text-blue-600 font-bold text-sm">
                                                {contact.email}
                                              </div>
                                              {contact.company && (
                                                <div className="text-gray-600 font-medium text-sm mt-1">
                                                  {contact.company}
                                                </div>
                                              )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                              <Badge className="bg-red-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold px-3 py-1">
                                                Needs Research
                                              </Badge>
                                              <Button
                                                onClick={() => handleSendToPitch(contact)}
                                                size="sm"
                                                className="bg-yellow-500 hover:bg-yellow-600 text-black font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                                              >
                                                → Pitch
                                              </Button>
                                            </div>
                                          </div>
                                          <CondensedIntelligenceCard
                                            intelligence={contact.intelligence}
                                            confidence={contact.confidence}
                                          />
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}{' '}
        {/* End of conditional for trial active content */}
      </div>
    </div>
  );
} // Force rebuild Wed 27 Aug 2025 22:00:04 BST
