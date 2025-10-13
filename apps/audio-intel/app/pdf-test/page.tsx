'use client';

import React from 'react';
import { Download, FileText } from 'lucide-react';
import { 
  exportContactsPreview,
  exportAnalyticsPreview,
  checkPdfPermissions 
} from '../../utils/exportToPdf';
import { DEMO_CONTACTS, DEMO_ANALYTICS } from '../../utils/generateSamplePdfs';

export default function PdfTestPage() {
  const handleTestContactsPreview = () => {
    exportContactsPreview(DEMO_CONTACTS, 'free');
  };

  const handleTestAnalyticsPreview = () => {
    exportAnalyticsPreview(DEMO_ANALYTICS, 'free');
  };

  const handleTestContactsProfessional = () => {
    exportContactsPreview(DEMO_CONTACTS, 'professional');
  };

  const permissions = checkPdfPermissions('free', 0);
  const proPerm = checkPdfPermissions('professional', 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">PDF System Test Page</h1>
          
          {/* Test Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={handleTestContactsPreview}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Test Contacts Preview (Free)
            </button>
            
            <button
              onClick={handleTestAnalyticsPreview}
              className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Test Analytics Preview (Free)
            </button>
            
            <button
              onClick={handleTestContactsProfessional}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Test Contacts Professional
            </button>
          </div>

          {/* Permissions Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-900 mb-2">Free Tier Permissions</h3>
              <pre className="text-xs text-gray-600 bg-white p-2 rounded border overflow-auto">
                {JSON.stringify(permissions, null, 2)}
              </pre>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium text-blue-900 mb-2">Professional Permissions</h3>
              <pre className="text-xs text-blue-600 bg-white p-2 rounded border overflow-auto">
                {JSON.stringify(proPerm, null, 2)}
              </pre>
            </div>
          </div>

          {/* Demo Data Info */}
          <div className="mt-6 bg-yellow-50 p-4 rounded-md">
            <h3 className="font-medium text-yellow-900 mb-2">Demo Data</h3>
            <p className="text-sm text-yellow-800">
              • Contacts: {DEMO_CONTACTS.length} sample music industry contacts
            </p>
            <p className="text-sm text-yellow-800">
              • Analytics: {DEMO_ANALYTICS.totalContacts} total contacts, {DEMO_ANALYTICS.successRate}% success rate
            </p>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 p-4 rounded-md">
            <h3 className="font-medium text-blue-900 mb-2">Test Instructions</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Free previews should show watermarks and limited content</li>
              <li>• Professional versions should have no watermarks</li>
              <li>• Check browser console for tracking events</li>
              <li>• PDFs should download automatically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}