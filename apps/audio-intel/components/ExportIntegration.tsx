'use client';

import React, { useState } from 'react';
import ExportButtons from './ExportButtons';
import { ContactData, AnalyticsData, SearchResultsData } from '../utils/exportService';

interface ExportIntegrationProps {
  // Data sources
  contacts?: ContactData[];
  analytics?: AnalyticsData;
  searchResults?: SearchResultsData;
  
  // User context
  userName?: string;
  
  // White label configuration
  whiteLabel?: {
    companyName?: string;
    logoUrl?: string;
    primaryColor?: string;
  };
  
  // Display options
  showHeader?: boolean;
  compact?: boolean;
  position?: 'top' | 'bottom' | 'sidebar';
  
  // Callbacks
  onExportComplete?: (result: { success: boolean; message: string }) => void;
}

export default function ExportIntegration({
  contacts,
  analytics,
  searchResults,
  userName,
  whiteLabel,
  showHeader = true,
  compact = false,
  position = 'bottom',
  onExportComplete
}: ExportIntegrationProps) {
  const [isVisible, setIsVisible] = useState(true);

  const getDataCount = () => {
    let count = 0;
    if (contacts) count += contacts.length;
    if (analytics) count += 1;
    if (searchResults) count += searchResults.results.length;
    return count;
  };

  const hasData = getDataCount() > 0;

  if (!hasData) {
    return null; // Don't render if no data
  }

  if (compact) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Export Ready</span>
            </div>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {isVisible && (
            <div className="space-y-2">
              <div className="text-xs text-gray-600">
                {getDataCount()} items available for export
              </div>
              <ExportButtons
                contacts={contacts}
                analytics={analytics}
                searchResults={searchResults}
                userName={userName}
                whiteLabel={whiteLabel}
                onExportComplete={onExportComplete}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full export system
  return (
    <div className={`${position === 'top' ? 'mb-6' : 'mt-6'}`}>
      {showHeader && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Export Your Data</h3>
          <p className="text-sm text-gray-600">
            Download your data in multiple formats with professional email delivery
          </p>
        </div>
      )}
      
      <ExportButtons
        contacts={contacts}
        analytics={analytics}
        searchResults={searchResults}
        userName={userName}
        whiteLabel={whiteLabel}
        onExportComplete={onExportComplete}
      />
    </div>
  );
}

// Convenience components for common use cases
export function ContactExport({ contacts, userName, whiteLabel, onExportComplete }: {
  contacts: ContactData[];
  userName?: string;
  whiteLabel?: { companyName?: string; logoUrl?: string; primaryColor?: string };
  onExportComplete?: (result: { success: boolean; message: string }) => void;
}) {
  return (
    <ExportIntegration
      contacts={contacts}
      userName={userName}
      whiteLabel={whiteLabel}
      onExportComplete={onExportComplete}
    />
  );
}

export function AnalyticsExport({ analytics, userName, whiteLabel, onExportComplete }: {
  analytics: AnalyticsData;
  userName?: string;
  whiteLabel?: { companyName?: string; logoUrl?: string; primaryColor?: string };
  onExportComplete?: (result: { success: boolean; message: string }) => void;
}) {
  return (
    <ExportIntegration
      analytics={analytics}
      userName={userName}
      whiteLabel={whiteLabel}
      onExportComplete={onExportComplete}
    />
  );
}

export function SearchResultsExport({ searchResults, userName, whiteLabel, onExportComplete }: {
  searchResults: SearchResultsData;
  userName?: string;
  whiteLabel?: { companyName?: string; logoUrl?: string; primaryColor?: string };
  onExportComplete?: (result: { success: boolean; message: string }) => void;
}) {
  return (
    <ExportIntegration
      searchResults={searchResults}
      userName={userName}
      whiteLabel={whiteLabel}
      onExportComplete={onExportComplete}
    />
  );
}

// Floating export button for quick access
export function FloatingExportButton({ 
  contacts, 
  analytics, 
  searchResults, 
  userName, 
  whiteLabel, 
  onExportComplete 
}: {
  contacts?: ContactData[];
  analytics?: AnalyticsData;
  searchResults?: SearchResultsData;
  userName?: string;
  whiteLabel?: { companyName?: string; logoUrl?: string; primaryColor?: string };
  onExportComplete?: (result: { success: boolean; message: string }) => void;
}) {
  const [showExport, setShowExport] = useState(false);

  const getDataCount = () => {
    let count = 0;
    if (contacts) count += contacts.length;
    if (analytics) count += 1;
    if (searchResults) count += searchResults.results.length;
    return count;
  };

  const hasData = getDataCount() > 0;

  if (!hasData) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setShowExport(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-50"
        title={`Export ${getDataCount()} items`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Export Data</h2>
                <button
                  onClick={() => setShowExport(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <ExportButtons
                contacts={contacts}
                analytics={analytics}
                searchResults={searchResults}
                userName={userName}
                whiteLabel={whiteLabel}
                onExportComplete={(result) => {
                  onExportComplete?.(result);
                  if (result.success) {
                    setShowExport(false);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
} 