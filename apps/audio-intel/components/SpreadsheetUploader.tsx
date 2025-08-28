// 🟡 USER INTERFACE: Intelligent Data Processing System
// "It just works" - Steve Jobs inspired magic

'use client';

import React, { useState, useCallback } from 'react';
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
  Sparkles
} from 'lucide-react';
import { 
  SpreadsheetProcessingPipeline, 
  ProcessedContact, 
  SpreadsheetFile, 
  DataIssue 
} from '@/utils/spreadsheetProcessor';

interface UploadState {
  isDragOver: boolean;
  isProcessing: boolean;
  progress: number;
  magicStep: string;
  results?: {
    processedContacts: ProcessedContact[];
    summary: any;
    fileAnalysis: SpreadsheetFile[];
  };
  error?: string;
}

export default function SpreadsheetUploader() {
  const [state, setState] = useState<UploadState>({
    isDragOver: false,
    isProcessing: false,
    progress: 0,
    magicStep: ''
  });

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
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.name.endsWith('.csv') || 
      file.name.endsWith('.xlsx') || 
      file.name.endsWith('.xls')
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
      error: undefined 
    }));

    try {
      // Step 1: Understanding your data
      setState(prev => ({ ...prev, progress: 25, magicStep: 'Reading your spreadsheets...' }));
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 2: Finding patterns
      setState(prev => ({ ...prev, progress: 50, magicStep: 'Detecting columns automatically...' }));
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
        magicStep: '✨ Your data is ready!',
        results,
        isProcessing: false
      }));

    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Something went wrong',
        isProcessing: false,
        progress: 0,
        magicStep: ''
      }));
    }
  };

  // 🟡 UI RENDERING: Dynamic Interface Components
  const renderUploadZone = () => (
    <Card className={`border-2 border-dashed transition-all duration-300 ${
      state.isDragOver 
        ? 'border-blue-500 bg-blue-50 shadow-lg' 
        : 'border-gray-300 hover:border-gray-400'
    }`}>
      <CardContent 
        className="p-12 text-center cursor-pointer"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept=".csv,.xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-brutal">
            <Upload className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-3xl font-black text-gray-900 mb-3">
              Drop your chaos here
            </h3>
            <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
              Upload any messy spreadsheets. We'll automatically organise everything 
              into clean, ready-to-use contacts.
            </p>
          </div>
          
          <div className="text-6xl mb-4">✨</div>
          
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1 text-sm font-medium">
              Detects any column layout
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-medium">
              Removes duplicates automatically
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 px-3 py-1 text-sm font-medium">
              Fixes formatting issues
            </Badge>
          </div>
          
          <p className="text-sm text-gray-500 font-medium">
            CSV, Excel files • Multiple files at once • It just works
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderProcessingStatus = () => (
    <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50">
      <CardContent className="p-10">
        <div className="text-center space-y-8">
          <div className="text-8xl animate-pulse">✨</div>
          
          <div>
            <h3 className="text-3xl font-black text-gray-900 mb-3">
              Working our magic
            </h3>
            <p className="text-xl text-gray-600 mb-6 font-medium">
              {state.magicStep}
            </p>
            
            <div className="max-w-sm mx-auto">
              <Progress value={state.progress} className="h-2 mb-3" />
              <p className="text-lg font-bold text-gray-700">
                {state.progress}%
              </p>
            </div>
          </div>
          
          <div className="text-gray-500 text-lg font-medium">
            Transforming chaos into organised contacts...
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderResults = () => {
    if (!state.results) return null;

    const { processedContacts, summary, fileAnalysis } = state.results;

    return (
      <div className="space-y-6">
        {/* The Magic Moment */}
        <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="text-center pb-4">
            <div className="text-6xl mb-4">🎉</div>
            <CardTitle className="text-3xl font-black text-gray-900 mb-2">
              Your data is ready!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 font-medium">
              We've transformed your chaos into organised, clean contacts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="text-4xl font-black text-green-600 mb-2">{summary.totalContacts}</div>
                <div className="text-sm text-gray-600 font-medium">Ready contacts</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="text-4xl font-black text-blue-600 mb-2">{summary.duplicatesRemoved}</div>
                <div className="text-sm text-gray-600 font-medium">Duplicates cleaned</div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-lg text-gray-700 font-medium mb-6">
                From {summary.totalFiles} messy {summary.totalFiles === 1 ? 'file' : 'files'} to organised contacts
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start AI Enrichment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Optional: Simple quality overview - can be collapsed/hidden by default */}
        <Card className="border-gray-200">
          <CardHeader className="cursor-pointer" onClick={() => {/* Toggle expanded view if needed */}}>
            <CardTitle className="text-lg">Quality Summary</CardTitle>
            <CardDescription>
              {summary.confidence.high} excellent • {summary.confidence.medium} good • {summary.confidence.low} needs attention
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  };

  const renderError = () => (
    <Card className="border-2 border-orange-300 bg-orange-50">
      <CardContent className="p-8 text-center">
        <div className="text-6xl mb-4">😅</div>
        <h3 className="text-2xl font-black text-gray-900 mb-3">Something didn't work</h3>
        <p className="text-gray-700 mb-6 text-lg">Don't worry, let's try that again.</p>
        <Button 
          onClick={() => setState(prev => ({ ...prev, error: undefined }))}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 py-2 rounded-lg"
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