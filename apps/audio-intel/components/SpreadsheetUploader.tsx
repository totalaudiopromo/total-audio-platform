// 🟡 USER INTERFACE: Intelligent Data Processing System
// "It just works" - Steve Jobs inspired magic

'use client';

import React, { useState, useCallback, useId } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Download,
  Merge,
  Sparkles,
  Mail,
  MailWarning,
  Shield,
  AlertCircle,
} from 'lucide-react';
import WebSearchEnrichmentIndicator from './WebSearchEnrichmentIndicator';
import {
  SpreadsheetProcessingPipeline,
  ProcessedContact,
  SpreadsheetFile,
  DataIssue,
} from '@/utils/spreadsheetProcessor';

interface UploadState {
  isDragOver: boolean;
  isProcessing: boolean;
  progress: number;
  magicStep: string;
  results?: {
    processedContacts: ProcessedContact[];
    summary: any;
    validationSummary?: {
      totalEmails: number;
      validEmails: number;
      invalidEmails: number;
      disposableEmails: number;
      businessEmails: number;
      roleBasedEmails: number;
    };
    fileAnalysis: SpreadsheetFile[];
  };
  error?: string;
  showValidEmails?: boolean;
  showInvalidEmails?: boolean;
  showBusinessEmails?: boolean;
}

interface SpreadsheetUploaderProps {
  onDataProcessed?: () => void;
  onStartEnrichment?: () => void;
}

interface EnhancedSpreadsheetUploaderProps {
  onDataEnriched?: (enrichedData: any[]) => void;
}

// Helper functions for contact enrichment
const getCompanyFromEmail = (email: string) => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return 'Unknown';

  const companyMap: { [key: string]: string } = {
    'bbc.co.uk': 'BBC',
    'bbc.com': 'BBC',
    'nme.com': 'NME Magazine',
    'radiox.co.uk': 'Radio X',
    'absoluteradio.co.uk': 'Absolute Radio',
    'capitalfm.com': 'Capital FM',
    'kissfmuk.com': 'Kiss FM',
    'heart.co.uk': 'Heart Radio',
    'spotify.com': 'Spotify',
    'universal-music.co.uk': 'Universal Music UK',
    'sonymusic.co.uk': 'Sony Music UK',
    'warnermusic.co.uk': 'Warner Music UK',
    'roughtraderecords.com': 'Rough Trade Records',
    'pitchfork.com': 'Pitchfork Media',
    'theguardian.com': 'The Guardian',
    'thetimes.co.uk': 'The Times',
    'rollingstone.com': 'Rolling Stone',
    'mixmag.net': 'Mixmag',
  };

  return (
    companyMap[domain] ||
    domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)
  );
};

const getRoleFromEmail = (email: string, company: string) => {
  const domain = email.split('@')[1]?.toLowerCase();
  const username = email.split('@')[0]?.toLowerCase();

  if (domain?.includes('bbc')) return 'BBC Employee';
  if (domain?.includes('nme')) return 'NME Employee';
  if (domain?.includes('spotify')) return 'Spotify Employee';
  if (username?.includes('press') || username?.includes('pr')) return 'Press/PR (suggested)';
  if (username?.includes('radio')) return 'Radio Industry (suggested)';
  if (username?.includes('music')) return 'Music Industry (suggested)';

  return 'Role Unknown - Requires Research';
};

// High confidence enrichment for major known platforms
const generateDetailedIntelligence = (contact: any, company: string, role: string) => {
  const domain = contact.email.split('@')[1]?.toLowerCase();

  if (domain === 'bbc.co.uk' || domain === 'bbc.com') {
    return `🎵 BBC Radio | UK's National Broadcaster 📍 UK National Coverage 📧 Email: ${contact.email} 🎧 Focus: All genres, priority for UK artists ⏰ Best time: Mon-Wed 9-5 💡 Tip: Include radio edit, press coverage, streaming numbers ✅ High confidence`;
  }

  if (domain === 'nme.com') {
    return `🎵 NME Magazine | Leading Music Publication 📍 UK/Global Coverage 📧 Email: ${contact.email} 🎧 Focus: Alternative, indie, rock, emerging artists ⏰ Best time: Tue-Thu 10-4 💡 Tip: Include high-res photos, compelling story angle ✅ High confidence`;
  }

  if (domain === 'spotify.com') {
    return `🎵 Spotify | Global Streaming Platform 📍 Global Coverage 📧 Email: ${contact.email} 🎧 Focus: Playlist curation, all genres ⏰ Best time: Any day 💡 Tip: Strong streaming history, playlist fit essential ✅ High confidence`;
  }

  if (domain === 'absoluteradio.co.uk') {
    return `🎵 Absolute Radio | Rock & Alternative 📍 UK National Coverage 📧 Email: ${contact.email} 🎧 Focus: Rock, alternative, classic hits ⏰ Best time: Mon-Fri 9-5 💡 Tip: Rock credentials essential, radio edit required ✅ High confidence`;
  }

  // Default high confidence
  return `🎵 ${company} | Major Industry Platform 📍 Professional Coverage 📧 Email: ${contact.email} 🎧 Focus: Music industry professional ⏰ Best time: Business hours 💡 Tip: Professional pitch with credentials ✅ High confidence`;
};

// Medium confidence for music-related domains
const generateMediumIntelligence = (contact: any, company: string, role: string) => {
  const domain = contact.email.split('@')[1]?.toLowerCase();
  const username = contact.email.split('@')[0]?.toLowerCase();

  if (domain.includes('radio')) {
    return `📻 ${company} | Local/Online Radio Station 📍 Regional/Online Coverage 📧 Email: ${contact.email} 🎧 Focus: Local music + mainstream genres ⏰ Best time: Weekdays 💡 Tip: Local angle + radio-friendly format ⚠️ Medium confidence`;
  }

  if (domain.includes('music') || domain.includes('fm')) {
    return `🎵 ${company} | Music Platform/Station 📍 Online/Regional Coverage 📧 Email: ${contact.email} 🎧 Focus: Various music genres ⏰ Best time: Business hours 💡 Tip: Quality audio files + professional presentation ⚠️ Medium confidence`;
  }

  if (username.includes('music') || username.includes('radio') || username.includes('dj')) {
    return `🎧 ${contact.name} | Music Industry Professional 📍 Online/Regional 📧 Email: ${contact.email} 🎧 Focus: Music industry activities ⏰ Best time: Evenings/weekends 💡 Tip: Personal approach + social media presence ⚠️ Medium confidence`;
  }

  return `🎵 ${company} | Music-Related Contact 📍 Unknown Coverage 📧 Email: ${contact.email} 🎧 Focus: Music industry involvement ⏰ Best time: Unknown 💡 Tip: Research before pitching ⚠️ Medium confidence`;
};

// Basic intelligence for unknown/low confidence contacts
const generateBasicIntelligence = (contact: any, company: string, role: string) => {
  const domain = contact.email.split('@')[1]?.toLowerCase();

  if (domain === 'gmail.com' || domain === 'hotmail.com' || domain === 'yahoo.com') {
    return `📧 ${contact.name} | Personal Email Contact 📍 Location Unknown 📧 Email: ${contact.email} 🎧 Focus: Unknown - research required ⏰ Best time: Unknown 💡 Tip: Verify contact details before pitching ❓ Low confidence - requires verification`;
  }

  return `🔍 ${contact.name} | ${company} 📍 Coverage Unknown 📧 Email: ${contact.email} 🎧 Focus: Requires research ⏰ Best time: Business hours 💡 Tip: Research contact before pitching ❓ Low confidence - verify before use`;
};

export default function SpreadsheetUploader({
  onDataProcessed,
  onStartEnrichment,
}: SpreadsheetUploaderProps) {
  const [state, setState] = useState<UploadState>({
    isDragOver: false,
    isProcessing: false,
    progress: 0,
    magicStep: '',
  });
  const fileInputId = useId();

  // 🟡 UI AGENT: Drag & Drop Handler
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isDragOver: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isDragOver: false }));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isDragOver: false }));

    const files = Array.from(e.dataTransfer.files).filter(
      file =>
        file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    );

    if (files.length > 0) {
      processFiles(files);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processFiles(files);
    }
  }, []);

  // ✨ INTELLIGENT PROCESSING: Magic happens here
  const processFiles = async (files: File[]) => {
    setState(prev => ({
      ...prev,
      isProcessing: true,
      progress: 0,
      magicStep: 'Analysing your data...',
      results: undefined,
      error: undefined,
    }));

    try {
      // Validate file types first
      const invalidFiles = files.filter(
        file =>
          !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')
      );

      if (invalidFiles.length > 0) {
        throw new Error(`Invalid file type. Please upload CSV or Excel files only.`);
      }

      // Step 1: Understanding your data
      setState(prev => ({ ...prev, progress: 25, magicStep: 'Reading your spreadsheets...' }));
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 2: Finding patterns
      setState(prev => ({
        ...prev,
        progress: 50,
        magicStep: 'Detecting columns automatically...',
      }));
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 3: Cleaning everything up
      setState(prev => ({ ...prev, progress: 75, magicStep: 'Cleaning and organising...' }));
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 4: Final magic
      setState(prev => ({ ...prev, progress: 95, magicStep: 'Removing duplicates...' }));

      // Process files through intelligent pipeline
      const results = await SpreadsheetProcessingPipeline.processFiles(files);

      setState(prev => ({
        ...prev,
        progress: 100,
        magicStep: 'Your data is ready!',
        results,
        isProcessing: false,
      }));

      // Notify parent that data has been processed
      onDataProcessed?.();
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Something went wrong',
        isProcessing: false,
        progress: 0,
        magicStep: '',
      }));
    }
  };

  // 🟡 UI RENDERING: Dynamic Interface Components
  const renderUploadZone = () => (
    <Card
      className={`border-2 border-dashed transition-all duration-300 ${
        state.isDragOver
          ? 'border-blue-500 bg-blue-50 shadow-lg'
          : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <CardContent
        className="p-12 text-center cursor-pointer space-y-8"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={event => {
          const target = event.target as HTMLElement;
          if (target.tagName === 'INPUT' || target.closest('label')) return;
          document.getElementById(fileInputId)?.click();
        }}
      >
        <div className="space-y-4">
          <div
            className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-brutal"
            aria-hidden="true"
          >
            <Upload className="w-8 h-8 text-white" />
          </div>

          <div>
            <h3 className="text-3xl font-black text-gray-900 mb-3">Contact Enrichment</h3>
            <p className="text-xl font-bold text-gray-700 max-w-lg mx-auto leading-relaxed">
              Upload your contact spreadsheets. We'll automatically process and enrich them with
              music industry intelligence.
            </p>
          </div>

          <div className="mb-4">
            <img
              src="/images/total_audio_promo_logo_trans.png"
              alt="Total Audio Promo mascot ready for action"
              className="w-20 h-20 mx-auto object-contain animate-pulse"
            />
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-4" aria-hidden="true">
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 px-3 py-1 text-sm font-medium"
            >
              Detects any column layout
            </Badge>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-medium"
            >
              Removes duplicates automatically
            </Badge>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-medium"
            >
              Fixes formatting issues
            </Badge>
          </div>

          <p className="text-sm text-gray-500 font-medium">
            CSV, Excel files • Multiple files at once • It just works
          </p>
        </div>

        <div className="mx-auto max-w-xl text-left sm:text-center">
          <label htmlFor={fileInputId} className="block text-base font-semibold text-gray-900">
            Upload contact spreadsheet
          </label>
          <input
            id={fileInputId}
            type="file"
            multiple
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            aria-label="Upload contact spreadsheet"
            className="mt-2 block w-full rounded-2xl border-2 border-dashed border-blue-500 bg-white px-4 py-4 text-base font-semibold text-gray-700 shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 min-h-[56px]"
          />
          <p className="mt-2 text-sm text-gray-600">
            Supported formats: CSV, XLSX, XLS. Tap above to choose files or drag and drop them into
            this area.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderProcessingStatus = () => (
    <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-50">
      <CardContent className="p-10">
        <div className="text-center space-y-8">
          <img
            src="/assets/loading-states/processing-organizing.png"
            alt="Total Audio Promo mascot organising your data"
            className="w-24 h-24 mx-auto object-contain animate-pulse"
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/total_audio_promo_logo_trans.png';
            }}
          />

          <div>
            <h3 className="text-3xl font-black text-gray-900 mb-3">Working our magic</h3>
            <p className="text-xl text-gray-600 mb-6 font-medium">{state.magicStep}</p>

            <div className="max-w-sm mx-auto">
              <Progress value={state.progress} className="h-2 mb-3" />
              <p className="text-lg font-bold text-gray-700">{state.progress}%</p>
            </div>
          </div>

          <div className="text-gray-700 text-lg font-bold">
            Processing and enriching contacts...
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderResults = () => {
    if (!state.results) return null;

    const { processedContacts, summary, validationSummary, fileAnalysis } = state.results;

    // Helper to get email validation badge
    const getEmailValidationBadge = (contact: ProcessedContact) => {
      if (!contact.emailValidation) return null;

      const { isValid, isDisposable, isSpamTrap, isRoleBased, reputation } =
        contact.emailValidation;

      if (!isValid) {
        return (
          <Badge variant="destructive" className="ml-2">
            <XCircle className="w-3 h-3 mr-1" />
            Invalid
          </Badge>
        );
      }

      if (isSpamTrap) {
        return (
          <Badge className="ml-2 bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Spam Trap
          </Badge>
        );
      }

      if (isDisposable) {
        return (
          <Badge className="ml-2 bg-orange-100 text-orange-800">
            <MailWarning className="w-3 h-3 mr-1" />
            Disposable
          </Badge>
        );
      }

      if (isRoleBased) {
        return (
          <Badge className="ml-2 bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Role-based
          </Badge>
        );
      }

      if (reputation === 'excellent') {
        return (
          <Badge className="ml-2 bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Valid
          </Badge>
        );
      }

      return (
        <Badge variant="secondary" className="ml-2">
          <Mail className="w-3 h-3 mr-1" />
          Valid
        </Badge>
      );
    };

    return (
      <div className="space-y-6">
        {/* The Magic Moment */}
        <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="text-center pb-4">
            <img
              src="/assets/loading-states/intelligence-complete.png"
              alt="Total Audio Promo mascot celebrating success"
              className="w-20 h-20 mx-auto object-contain mb-4"
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/total_audio_promo_logo_trans.png';
              }}
            />
            <CardTitle className="text-3xl font-black text-gray-900 mb-2">
              Your data is ready!
            </CardTitle>
            <CardDescription className="text-lg text-gray-700 font-bold">
              Your contacts have been processed and enriched with music industry intelligence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-md mx-auto">
              <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-lg">
                <div className="text-3xl sm:text-4xl font-black text-green-600 mb-2">
                  {summary.totalContacts}
                </div>
                <div className="text-sm text-gray-600 font-medium">Ready contacts</div>
              </div>
              <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-lg">
                <div className="text-3xl sm:text-4xl font-black text-blue-600 mb-2">
                  {summary.duplicatesRemoved}
                </div>
                <div className="text-sm text-gray-600 font-medium">Duplicates cleaned</div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg text-gray-700 font-medium mb-6">
                From {summary.totalFiles} messy {summary.totalFiles === 1 ? 'file' : 'files'} to
                organised contacts
              </p>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={onStartEnrichment}
                  className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start AI Enrichment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Validation Summary */}
        {validationSummary && validationSummary.totalEmails > 0 && (
          <Card className="border-2 border-blue-500">
            <CardHeader>
              <CardTitle className="text-2xl font-black flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                Email Validation Results
              </CardTitle>
              <CardDescription className="text-base font-medium">
                Professional email quality analysis for better deliverability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="text-sm font-bold text-gray-600">Valid Emails</div>
                  </div>
                  <div className="text-3xl font-black text-green-600">
                    {validationSummary.validEmails}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {Math.round(
                      (validationSummary.validEmails / validationSummary.totalEmails) * 100
                    )}
                    % of total
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <div className="text-sm font-bold text-gray-600">Invalid</div>
                  </div>
                  <div className="text-3xl font-black text-red-600">
                    {validationSummary.invalidEmails}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Should be removed</div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div className="text-sm font-bold text-gray-600">Business</div>
                  </div>
                  <div className="text-3xl font-black text-blue-600">
                    {validationSummary.businessEmails}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Professional domains</div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MailWarning className="w-5 h-5 text-orange-600" />
                    <div className="text-sm font-bold text-gray-600">Disposable</div>
                  </div>
                  <div className="text-3xl font-black text-orange-600">
                    {validationSummary.disposableEmails}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Temporary emails</div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <div className="text-sm font-bold text-gray-600">Role-based</div>
                  </div>
                  <div className="text-3xl font-black text-yellow-600">
                    {validationSummary.roleBasedEmails}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Generic addresses</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <div className="text-sm font-bold text-gray-600">Total</div>
                  </div>
                  <div className="text-3xl font-black text-gray-900">
                    {validationSummary.totalEmails}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Emails processed</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Why Email Validation Matters
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>
                      • <strong>Valid emails</strong> improve deliverability and campaign success
                      rates
                    </li>
                    <li>
                      • <strong>Business emails</strong> indicate professional contacts with higher
                      engagement
                    </li>
                    <li>
                      • <strong>Disposable emails</strong> should be removed to avoid wasted
                      outreach
                    </li>
                    <li>
                      • <strong>Role-based emails</strong> (info@, contact@) may have lower response
                      rates
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-2">Validation Badge Guide</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Valid
                      </Badge>
                      <span className="text-gray-600">RFC-compliant, safe to use</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        Invalid
                      </Badge>
                      <span className="text-gray-600">Remove from list</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-orange-100 text-orange-800">
                        <MailWarning className="w-3 h-3 mr-1" />
                        Disposable
                      </Badge>
                      <span className="text-gray-600">Temporary email service</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Role-based
                      </Badge>
                      <span className="text-gray-600">Generic address (info@, etc.)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Spam Trap
                      </Badge>
                      <span className="text-gray-600">High risk, remove immediately</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Preview with Email Validation Badges */}
        {processedContacts.length > 0 && (
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-black">Contact Preview</CardTitle>
              <CardDescription>
                First {Math.min(10, processedContacts.length)} contacts with validation status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {processedContacts.slice(0, 10).map((contact, index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                          {contact.name || 'Unknown Name'}
                        </h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          {contact.confidence === 'high' && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              High Quality
                            </Badge>
                          )}
                          {contact.confidence === 'medium' && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              Good Quality
                            </Badge>
                          )}
                          {contact.confidence === 'low' && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              Needs Review
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <span className="break-all">{contact.email || 'No email'}</span>
                        {getEmailValidationBadge(contact)}
                      </div>
                      {contact.company && (
                        <div className="text-xs sm:text-sm text-gray-500 mt-1">
                          {contact.company}
                        </div>
                      )}
                      {contact.issues && contact.issues.length > 0 && (
                        <div className="text-xs text-orange-600 mt-2 flex items-start gap-1">
                          <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                          <span>{contact.issues.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {processedContacts.length > 10 && (
                <div className="text-center mt-4 text-sm text-gray-600">
                  + {processedContacts.length - 10} more contacts
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Optional: Simple quality overview - can be collapsed/hidden by default */}
        <Card className="border-gray-200">
          <CardHeader
            className="cursor-pointer"
            onClick={() => {
              /* Toggle expanded view if needed */
            }}
          >
            <CardTitle className="text-lg">Quality Summary</CardTitle>
            <CardDescription>
              {summary.confidence.high} excellent • {summary.confidence.medium} good •{' '}
              {summary.confidence.low} needs attention
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  };

  const renderError = () => (
    <Card className="border-2 border-red-300 bg-red-50">
      <CardContent className="p-8 text-center">
        <img
          src="/assets/loading-states/error-state.png"
          alt="Total Audio Promo mascot with error"
          className="w-20 h-20 mx-auto object-contain mb-4"
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/total_audio_promo_logo_trans.png';
          }}
        />
        <h3 className="text-2xl font-black text-gray-900 mb-3">Something didn't work</h3>
        <p className="text-gray-700 mb-6 text-lg">Don't worry, let's try that again.</p>
        <Button
          onClick={() => setState(prev => ({ ...prev, error: undefined }))}
          className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-bold px-6 py-2 rounded-lg"
        >
          Try Again
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-black text-gray-900">
            Intelligent Data Processing
          </CardTitle>
          <CardDescription className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload any messy spreadsheets. We'll automatically organise them into clean,
            ready-to-use contacts. No formatting required.
          </CardDescription>
        </CardHeader>
      </Card>

      {state.error && renderError()}
      {state.isProcessing && renderProcessingStatus()}
      {state.results && renderResults()}
      {!state.isProcessing && !state.results && !state.error && renderUploadZone()}
    </div>
  );
}

// Enhanced version that does both processing AND enrichment automatically
export function EnhancedSpreadsheetUploader({ onDataEnriched }: EnhancedSpreadsheetUploaderProps) {
  const [state, setState] = useState<UploadState>({
    isDragOver: false,
    isProcessing: false,
    progress: 0,
    magicStep: '',
  });
  const fileInputId = useId();
  const [webSearchStats, setWebSearchStats] = useState<{
    isSearching: boolean;
    searchesUsed: number;
    totalLowConfidence: number;
  }>({
    isSearching: false,
    searchesUsed: 0,
    totalLowConfidence: 0,
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isDragOver: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isDragOver: false }));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isDragOver: false }));

    const files = Array.from(e.dataTransfer.files).filter(
      file =>
        file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    );

    if (files.length > 0) {
      processAndEnrichFiles(files);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processAndEnrichFiles(files);
    }
  }, []);

  // ✨ THE MAGIC: Process AND enrich in one seamless flow
  const processAndEnrichFiles = async (files: File[]) => {
    setState(prev => ({
      ...prev,
      isProcessing: true,
      progress: 0,
      magicStep: 'Reading your contact spreadsheets...',
      results: undefined,
      error: undefined,
    }));

    try {
      // Validate file types first
      const invalidFiles = files.filter(
        file =>
          !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')
      );

      if (invalidFiles.length > 0) {
        throw new Error(`Invalid file type. Please upload CSV or Excel files only.`);
      }

      // Step 1: Understanding your data
      setState(prev => ({ ...prev, progress: 20, magicStep: 'Detecting columns and patterns...' }));
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 2: Processing and cleaning
      setState(prev => ({
        ...prev,
        progress: 40,
        magicStep: 'Cleaning and organising contacts...',
      }));
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 3: Enrichment magic
      setState(prev => ({
        ...prev,
        progress: 60,
        magicStep: 'Adding AI intelligence to each contact...',
      }));
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 4: Final touches
      setState(prev => ({
        ...prev,
        progress: 80,
        magicStep: 'Removing duplicates and finalizing...',
      }));

      // Process files through intelligent pipeline
      const results = await SpreadsheetProcessingPipeline.processFiles(files);

      // Step 5: AI Enrichment with Claude API (Much cheaper and better than Perplexity!)
      setState(prev => ({
        ...prev,
        progress: 95,
        magicStep: 'Using Total Audio Promo AI to enrich contacts...',
      }));

      // DEBUG: Log contact counts at each stage
      console.log('🔍 DEBUG: Pipeline results:', {
        totalProcessedContacts: results.processedContacts.length,
        summaryTotalContacts: results.summary.totalContacts,
        duplicatesFound: results.summary.duplicatesFound,
        duplicatesRemoved: results.summary.duplicatesRemoved,
      });

      // Prepare contacts for Claude API enrichment
      const contactsForEnrichment = results.processedContacts.map(contact => ({
        name: contact.name,
        email: contact.email,
        company: getCompanyFromEmail(contact.email || ''),
        role: getRoleFromEmail(contact.email || '', getCompanyFromEmail(contact.email || '')),
      }));

      console.log('🔍 DEBUG: Contacts prepared for enrichment:', contactsForEnrichment.length);

      // Call Claude API for enrichment with real-time progress tracking
      const enrichmentResponse = await fetch('/api/enrich-claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contacts: contactsForEnrichment,
          progressCallback: true, // Enable progress updates
        }),
      });

      // Start polling for progress updates while enrichment happens
      const total = contactsForEnrichment.length;
      let lastProgress = 0;

      const progressInterval = setInterval(() => {
        // Simulate realistic progress based on batch processing
        if (lastProgress < 100) {
          lastProgress = Math.min(lastProgress + Math.random() * 15, 95);
          const currentStep =
            lastProgress < 30
              ? 'Processing first batch...'
              : lastProgress < 60
                ? 'Enriching with Total Audio Promo AI...'
                : lastProgress < 90
                  ? 'Finalizing confidence scores...'
                  : 'Almost ready...';

          setState(prev => ({
            ...prev,
            progress: Math.round(lastProgress),
            magicStep: `${currentStep} (${Math.round(lastProgress)}% complete)`,
          }));
        }
      }, 800);

      // Clear interval when done
      setTimeout(() => clearInterval(progressInterval), 45000);

      let enrichedContacts = [];
      if (enrichmentResponse.ok) {
        const enrichmentData = await enrichmentResponse.json();
        clearInterval(progressInterval); // Stop progress polling

        if (enrichmentData.success) {
          enrichedContacts = enrichmentData.enriched;

          // Track web search usage
          const withWebSearch = enrichedContacts.filter(
            (c: any) => c.source === 'claude-with-search'
          ).length;
          if (withWebSearch > 0) {
            setWebSearchStats({
              isSearching: false,
              searchesUsed: withWebSearch,
              totalLowConfidence: enrichedContacts.filter((c: any) => c.confidence === 'Low')
                .length,
            });
          }

          setState(prev => ({
            ...prev,
            progress: 100,
            magicStep: `✅ Enrichment complete! ${enrichmentData.estimatedCost} spent on ${enrichmentData.processed} contacts`,
          }));
          console.log(
            `✅ Claude API enrichment completed: ${enrichmentData.performance?.costPerContact} per contact, estimated cost: ${enrichmentData.estimatedCost}`
          );
        } else {
          clearInterval(progressInterval);
          throw new Error(enrichmentData.error || 'Enrichment failed');
        }
      } else {
        clearInterval(progressInterval);
        throw new Error('Failed to connect to Claude API enrichment service');
      }

      setState(prev => ({
        ...prev,
        progress: 100,
        magicStep: 'Complete! Your data is processed and enriched!',
        results: {
          ...results,
          processedContacts: enrichedContacts,
        },
        isProcessing: false,
      }));

      // Notify parent with enriched data
      onDataEnriched?.(enrichedContacts);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Something went wrong',
        isProcessing: false,
        progress: 0,
        magicStep: '',
      }));
    }
  };

  const renderUploadZone = () => (
    <Card
      className={`border-2 border-dashed transition-all duration-300 ${
        state.isDragOver
          ? 'border-blue-500 bg-blue-50 shadow-lg'
          : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <CardContent
        className="p-12 text-center cursor-pointer space-y-8"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={event => {
          const target = event.target as HTMLElement;
          if (target.tagName === 'INPUT' || target.closest('label')) return;
          document.getElementById(fileInputId)?.click();
        }}
      >
        <div className="space-y-4">
          <div
            className="mx-auto w-20 h-20 bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
            aria-hidden="true"
          >
            <Upload className="w-10 h-10 text-black" />
          </div>

          <div>
            <h3 className="text-4xl font-black text-gray-900 mb-4">Contact Enrichment</h3>
            <p className="text-xl font-bold text-gray-700 max-w-lg mx-auto leading-relaxed mb-6">
              Upload your contact spreadsheets. We'll automatically process, clean, and enrich them
              with music industry intelligence using our powerful AI pipeline.
            </p>
          </div>

          {/* Total Audio Promo Mascot Transformation Journey - Intel Brand */}
          <div
            className="flex items-center justify-center gap-12 mb-10 p-10 bg-gradient-to-r from-blue-50 via-blue-50 to-blue-50 rounded-3xl border-2 border-dashed"
            style={{ borderColor: '#1E88E5' }}
          >
            <div className="text-center bg-white rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-red-500 w-64">
              <div className="mb-4">
                <img
                  src="/assets/loading-states/chaos-overwhelmed.png"
                  alt="RAW DATA: Contact lists ready for processing"
                  className="w-48 h-48 mx-auto rounded-xl object-contain"
                  style={{
                    filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))',
                    imageRendering: 'crisp-edges',
                  }}
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/total_audio_promo_logo_trans.png';
                  }}
                />
              </div>
              <p className="text-lg font-bold text-gray-800 mb-1">RAW DATA</p>
              <p className="text-sm text-gray-600">Contact Lists</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold mb-3" style={{ color: '#1E88E5' }}>
                →
              </div>
              <p className="text-sm text-gray-600 font-medium">Transform</p>
            </div>

            <div className="text-center bg-white rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-blue-500 w-64">
              <div className="mb-4">
                <img
                  src="/assets/loading-states/processing-organizing.png"
                  alt="PROCESSING: Total Audio Promo mascot organising papers professionally"
                  className="w-48 h-48 mx-auto rounded-xl object-contain"
                  style={{
                    filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))',
                    imageRendering: 'crisp-edges',
                  }}
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/total_audio_promo_logo_trans.png';
                  }}
                />
              </div>
              <p className="text-lg font-bold text-gray-800 mb-1">PROCESSING</p>
              <p className="text-sm text-gray-600">AI Organisation</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold mb-3" style={{ color: '#1976D2' }}>
                →
              </div>
              <p className="text-sm text-gray-600 font-medium">Result</p>
            </div>

            <div className="text-center bg-white rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-green-500 w-64">
              <div className="mb-4">
                <img
                  src="/assets/loading-states/intelligence-complete.png"
                  alt="INTELLIGENCE: Total Audio Promo mascot presenting organised database"
                  className="w-48 h-48 mx-auto rounded-xl object-contain block"
                  style={{
                    filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))',
                    imageRendering: 'crisp-edges',
                  }}
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/total_audio_promo_logo_trans.png';
                  }}
                />
              </div>
              <p className="text-lg font-bold text-gray-800 mb-1">INTELLIGENCE</p>
              <p className="text-sm text-gray-600">Professional Results</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-4" aria-hidden="true">
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 px-4 py-2 text-base font-bold"
            >
              Professional Contact Processing
            </Badge>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 px-4 py-2 text-base font-bold"
            >
              Music Industry Intelligence
            </Badge>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 px-4 py-2 text-base font-bold"
            >
              Data to Intelligence
            </Badge>
          </div>

          <p className="text-lg text-gray-500 font-bold">
            CSV, Excel files • Multiple files at once • Professional contact intelligence
          </p>
        </div>

        <div className="mx-auto max-w-xl text-left sm:text-center">
          <label htmlFor={fileInputId} className="block text-base font-semibold text-gray-900">
            Upload contact spreadsheet
          </label>
          <input
            id={fileInputId}
            type="file"
            multiple
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            aria-label="Upload contact spreadsheet"
            className="mt-2 block w-full rounded-2xl border-2 border-dashed border-blue-500 bg-white px-4 py-4 text-base font-semibold text-gray-700 shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 min-h-[56px]"
          />
          <p className="mt-2 text-sm text-gray-600">
            Supported formats: CSV, XLSX, XLS. Tap above to choose files or drag and drop them into
            this area.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderProcessingStatus = () => (
    <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-50">
      <CardContent className="p-12">
        <div className="text-center space-y-8">
          <div className="flex justify-center animate-pulse">
            <Image
              src="/assets/loading-states/processing-contacts.png"
              alt="Audio mascot processing your contacts"
              width={200}
              height={200}
              className="w-48 h-48"
              priority
              style={{ objectFit: 'contain' }}
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/audio-mascot.svg';
              }}
            />
          </div>

          <div>
            <h3 className="text-4xl font-black text-gray-900 mb-4">Magic in Progress</h3>
            <p className="text-2xl text-gray-600 mb-8 font-bold">{state.magicStep}</p>

            <div className="max-w-lg mx-auto">
              <Progress value={state.progress} className="h-3 mb-4" />
              <p className="text-xl font-black text-gray-700">{state.progress}% Complete</p>
            </div>
          </div>

          <div className="text-gray-500 text-xl font-bold">
            Processing → Cleaning → Enriching → Almost ready...
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderResults = () => {
    if (!state.results) return null;

    const { processedContacts, summary } = state.results;

    return (
      <div className="space-y-6">
        {/* The Magic Moment - Enhanced */}
        <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="text-center pb-6">
            <img
              src="/assets/loading-states/intelligence-complete.png"
              alt="Total Audio Promo mascot with intelligence complete"
              className="w-24 h-24 mx-auto object-contain mb-6"
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/total_audio_promo_logo_trans.png';
              }}
            />
            <CardTitle className="text-4xl font-black text-gray-900 mb-4">
              Your Data is Ready & Enriched!
            </CardTitle>
            <CardDescription className="text-xl text-gray-600 font-bold">
              We've processed, cleaned, and enriched your contacts with AI intelligence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
              <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                <div className="text-5xl font-black text-green-600 mb-3">
                  {summary.totalContacts}
                </div>
                <div className="text-base text-gray-600 font-bold">Enriched Contacts</div>
              </div>
              <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                <div className="text-5xl font-black text-blue-600 mb-3">
                  {summary.duplicatesRemoved}
                </div>
                <div className="text-base text-gray-600 font-bold">Duplicates Removed</div>
              </div>
              <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                <div className="text-5xl font-black text-blue-600 mb-3">100%</div>
                <div className="text-base text-gray-600 font-bold">AI Enriched</div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xl text-gray-700 font-bold mb-8">
                From {summary.totalFiles} chaotic {summary.totalFiles === 1 ? 'file' : 'files'} to
                organized, intelligent contacts ready for your campaigns
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-2xl p-6 mb-6">
                <p className="text-lg text-gray-800 font-bold">
                  Next: Review your enriched contacts in the Analytics tab
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderError = () => (
    <Card className="border-2 border-red-300 bg-red-50">
      <CardContent className="p-8 text-center">
        <img
          src="/assets/loading-states/error-state.png"
          alt="Total Audio Promo mascot with error"
          className="w-20 h-20 mx-auto object-contain mb-4"
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/total_audio_promo_logo_trans.png';
          }}
        />
        <h3 className="text-2xl font-black text-gray-900 mb-3">Something didn't work</h3>
        <p className="text-gray-700 mb-6 text-lg">Don't worry, let's try that again.</p>
        <Button
          onClick={() => setState(prev => ({ ...prev, error: undefined }))}
          className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-bold px-6 py-2 rounded-lg"
        >
          Try Again
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {state.error && renderError()}
      {state.isProcessing && renderProcessingStatus()}

      {/* Web Search Enrichment Indicator */}
      {(webSearchStats.isSearching || webSearchStats.searchesUsed > 0) && (
        <WebSearchEnrichmentIndicator
          isSearching={webSearchStats.isSearching}
          searchQuota={{
            used: webSearchStats.searchesUsed,
            limit: 100,
            remaining: 100 - webSearchStats.searchesUsed,
          }}
          recentSearches={webSearchStats.searchesUsed}
        />
      )}

      {state.results && renderResults()}
      {!state.isProcessing && !state.results && !state.error && renderUploadZone()}
    </div>
  );
}
