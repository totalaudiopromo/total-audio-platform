'use client';

import React, { useState } from 'react';
import { Download, Eye, Star, Zap, CheckCircle, AlertCircle, Crown, Users } from 'lucide-react';
import { 
  exportContactsPreview, 
  exportAnalyticsPreview, 
  checkPdfPermissions
} from '../../utils/exportToPdf';
import {
  trackPdfConversion,
  PDF_CONVERSION_EVENTS,
  getUpgradeMessage,
  UPGRADE_MESSAGES 
} from '../../utils/pdfWatermark';
import { ContactData, AnalyticsData } from '../../utils/exportService';

interface PdfExportProgressiveProps {
  contacts?: ContactData[];
  analytics?: AnalyticsData;
  userTier?: 'free' | 'professional' | 'agency';
  monthlyPdfUsage?: number;
  onUpgradeClick?: () => void;
  whiteLabel?: {
    companyName?: string;
    logoUrl?: string;
    primaryColor?: string;
  };
}

export default function PdfExportProgressive({
  contacts = [],
  analytics,
  userTier = 'free',
  monthlyPdfUsage = 0,
  onUpgradeClick,
  whiteLabel
}: PdfExportProgressiveProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeContext, setUpgradeContext] = useState('afterPreview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastAction, setLastAction] = useState<'preview' | 'full' | null>(null);

  const permissions = checkPdfPermissions(userTier, monthlyPdfUsage);
  
  const handlePreviewPdf = async (type: 'contacts' | 'analytics') => {
    setIsGenerating(true);
    setLastAction('preview');
    
    try {
      if (type === 'contacts' && contacts.length > 0) {
        // Convert ContactData to EnrichedContact format
        const enrichedContacts = contacts.map(contact => ({
          ...contact,
          researchConfidence: contact.researchConfidence || 'Medium',
          lastResearched: contact.lastResearched || new Date().toISOString().split('T')[0]
        }));
        exportContactsPreview(enrichedContacts, userTier, whiteLabel);
      } else if (type === 'analytics' && analytics) {
        exportAnalyticsPreview(analytics, userTier, whiteLabel);
      }
      
      // Show upgrade prompt after preview for free users
      if (userTier === 'free') {
        setTimeout(() => {
          setUpgradeContext('afterPreview');
          setShowUpgradeModal(true);
        }, 2000);
      }
      
    } catch (error) {
      console.error('Preview generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFullExport = async (type: 'contacts' | 'analytics') => {
    if (!permissions.canExportFull) {
      setUpgradeContext(monthlyPdfUsage >= permissions.monthlyLimit ? 'monthlyLimit' : 'qualityUpgrade');
      setShowUpgradeModal(true);
      return;
    }
    
    setIsGenerating(true);
    setLastAction('full');
    
    try {
      // Import and use the full export functions
      const { exportContactsToPdf, exportAnalyticsToPdf } = await import('../../utils/exportToPdf');
      
      if (type === 'contacts' && contacts.length > 0) {
        // Convert ContactData to EnrichedContact format
        const enrichedContacts = contacts.map(contact => ({
          ...contact,
          researchConfidence: contact.researchConfidence || 'Medium',
          lastResearched: contact.lastResearched || new Date().toISOString().split('T')[0]
        }));
        exportContactsToPdf(enrichedContacts, undefined, whiteLabel, { userTier, includeWatermark: false });
      } else if (type === 'analytics' && analytics) {
        exportAnalyticsToPdf(analytics, undefined, whiteLabel, { userTier, includeWatermark: false });
      }
      
    } catch (error) {
      console.error('Full export failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const UpgradeModal = () => {
    const message = getUpgradeMessage(upgradeContext, userTier);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{message.title}</h3>
            <p className="text-gray-600 mb-6">{message.description}</p>
            
            <div className="space-y-2 mb-6">
              {message.benefits.slice(0, 4).map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {benefit}
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  trackPdfConversion(PDF_CONVERSION_EVENTS.UPGRADE_CLICKED, {
                    userTier,
                    context: upgradeContext,
                    source: 'pdf_export_modal'
                  });
                  onUpgradeClick?.();
                  setShowUpgradeModal(false);
                }}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                {message.cta} - From £19/month
              </button>
              
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full text-gray-500 px-4 py-2 rounded-md hover:text-gray-700 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getTierBadge = () => {
    const badges = {
      free: { icon: Users, color: 'text-gray-600', bg: 'bg-gray-100', text: 'Free' },
      professional: { icon: Star, color: 'text-blue-600', bg: 'bg-blue-100', text: 'Professional' },
      agency: { icon: Crown, color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Agency' }
    };
    
    const badge = badges[userTier];
    const Icon = badge.icon;
    
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </div>
    );
  };

  const hasData = contacts.length > 0 || analytics;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              Professional PDF Reports
            </h3>
            {getTierBadge()}
          </div>
          <p className="text-sm text-gray-600">
            Generate professional reports with your data
          </p>
          {permissions.monthlyLimit > 0 && (
            <p className="text-xs text-blue-600 mt-1">
              {permissions.monthlyLimit - monthlyPdfUsage} of {permissions.monthlyLimit} free PDFs remaining this month
            </p>
          )}
        </div>
      </div>

      {!hasData ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-2">No data available for export</p>
          <p className="text-sm text-gray-500">Upload contacts or run analytics to generate PDF reports</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Contacts Export */}
          {contacts.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">Contact Intelligence Report</h4>
                  <p className="text-sm text-gray-600">{contacts.length} enriched contacts</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreviewPdf('contacts')}
                    disabled={isGenerating}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  
                  {permissions.canExportFull ? (
                    <button
                      onClick={() => handleFullExport('contacts')}
                      disabled={isGenerating}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Full Report
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setUpgradeContext(monthlyPdfUsage >= permissions.monthlyLimit ? 'monthlyLimit' : 'qualityUpgrade');
                        setShowUpgradeModal(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all text-sm"
                    >
                      <Crown className="w-4 h-4" />
                      {monthlyPdfUsage >= permissions.monthlyLimit ? 'Upgrade' : 'Get Full Report'}
                    </button>
                  )}
                </div>
              </div>
              
              {userTier === 'free' && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-xs text-blue-700">
                    <span className="font-medium">Preview:</span> First 3 contacts with watermark • 
                    <span className="font-medium"> Full Report:</span> All contacts, no watermark, email delivery
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Analytics Export */}
          {analytics && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">Analytics Dashboard Report</h4>
                  <p className="text-sm text-gray-600">Performance insights and metrics</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreviewPdf('analytics')}
                    disabled={isGenerating}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  
                  {permissions.canExportFull ? (
                    <button
                      onClick={() => handleFullExport('analytics')}
                      disabled={isGenerating}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Full Report
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setUpgradeContext(monthlyPdfUsage >= permissions.monthlyLimit ? 'monthlyLimit' : 'qualityUpgrade');
                        setShowUpgradeModal(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-md hover:from-green-700 hover:to-blue-700 transition-all text-sm"
                    >
                      <Crown className="w-4 h-4" />
                      {monthlyPdfUsage >= permissions.monthlyLimit ? 'Upgrade' : 'Get Full Report'}
                    </button>
                  )}
                </div>
              </div>
              
              {userTier === 'free' && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-xs text-green-700">
                    <span className="font-medium">Preview:</span> Key metrics with watermark • 
                    <span className="font-medium"> Full Report:</span> Complete analytics, charts, insights
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="flex items-center justify-center gap-2 py-4 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">
                Generating {lastAction === 'preview' ? 'preview' : 'full report'}...
              </span>
            </div>
          )}

          {/* Feature Comparison */}
          {userTier === 'free' && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mt-6">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                Upgrade for Premium Features
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Free Preview</h5>
                  <ul className="space-y-1 text-gray-600">
                    <li>• First 3 contacts only</li>
                    <li>• Watermarked reports</li>
                    <li>• 1 PDF per month</li>
                    <li>• Basic formatting</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-700 mb-2">Professional (£19/mo)</h5>
                  <ul className="space-y-1 text-blue-600">
                    <li>• All contacts & analytics</li>
                    <li>• No watermarks</li>
                    <li>• Unlimited PDFs</li>
                    <li>• Professional formatting</li>
                    <li>• Email delivery</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => {
                  setUpgradeContext('qualityUpgrade');
                  setShowUpgradeModal(true);
                }}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Upgrade to Professional - £19/month
              </button>
            </div>
          )}
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && <UpgradeModal />}
    </div>
  );
}