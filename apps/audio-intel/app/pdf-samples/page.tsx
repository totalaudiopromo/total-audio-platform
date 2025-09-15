'use client';

import React, { useState } from 'react';
import { Download, Eye, FileText, BarChart3, Brain, CheckCircle, Star, Crown, Zap, ArrowRight } from 'lucide-react';
import { 
  DEMO_CONTACTS, 
  DEMO_ANALYTICS, 
  DEMO_AI_AGENT_REPORT, 
  PDF_SAMPLES_INFO,
  generateAllSamplePdfs 
} from '../../utils/generateSamplePdfs';
import { exportContactsPreview, exportAnalyticsPreview } from '../../utils/exportToPdf';
import Link from 'next/link';

export default function PdfSamplesPage() {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleGenerateSample = async (type: 'contacts' | 'analytics' | 'aiAgent') => {
    setIsGenerating(type);
    
    try {
      switch (type) {
        case 'contacts':
          exportContactsPreview(DEMO_CONTACTS, 'free');
          break;
        case 'analytics':
          exportAnalyticsPreview(DEMO_ANALYTICS, 'free');
          break;
        case 'aiAgent':
          // Import and use AI agent export
          const { exportAIAgentReportToPdf } = await import('../../utils/exportToPdf');
          exportAIAgentReportToPdf(DEMO_AI_AGENT_REPORT);
          break;
      }
    } catch (error) {
      console.error(`Error generating ${type} sample:`, error);
    } finally {
      setIsGenerating(null);
    }
  };

  const SampleCard = ({ 
    type, 
    title, 
    description, 
    features, 
    icon: Icon,
    color,
    bgColor 
  }: {
    type: 'contacts' | 'analytics' | 'aiAgent';
    title: string;
    description: string;
    features: string[];
    icon: any;
    color: string;
    bgColor: string;
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className={`${bgColor} p-6`}>
        <div className="flex items-center gap-3 mb-2">
          <Icon className={`w-6 h-6 ${color}`} />
          <h3 className={`text-lg font-semibold ${color.replace('text-', 'text-gray-')}`}>{title}</h3>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
        
        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <span>📄 {PDF_SAMPLES_INFO[type].pages} pages</span>
          {type === 'contacts' && <span>👤 {PDF_SAMPLES_INFO[type].contacts} contacts</span>}
          {type === 'analytics' && <span>📊 {PDF_SAMPLES_INFO[type].metrics} metrics</span>}
          {type === 'aiAgent' && <span>💡 {PDF_SAMPLES_INFO[type].recommendations} recommendations</span>}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Features List */}
        <div className="space-y-2 mb-6">
          {features.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">{feature}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => handleGenerateSample(type)}
            disabled={isGenerating === type}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 ${bgColor.replace('bg-', 'bg-').replace('-50', '-100')} ${color} rounded-md hover:${bgColor.replace('-50', '-200')} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isGenerating === type ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                Generating...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Download Sample (Free)
              </>
            )}
          </button>
          
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <Crown className="w-4 h-4" />
            Generate Professional Version
          </button>
        </div>
      </div>
    </div>
  );

  const UpgradeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Unlock Professional PDF Reports</h3>
          <p className="text-gray-600 mb-6">
            Upgrade to Professional to generate unlimited high-quality PDFs with no watermarks
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium text-gray-700 mb-2">Free Samples</h4>
              <ul className="space-y-1 text-gray-600 text-xs">
                <li>• Watermarked PDFs</li>
                <li>• Limited content</li>
                <li>• Basic formatting</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-3 rounded-md">
              <h4 className="font-medium text-blue-700 mb-2">Professional</h4>
              <ul className="space-y-1 text-blue-600 text-xs">
                <li>• No watermarks</li>
                <li>• Complete data</li>
                <li>• Premium formatting</li>
                <li>• Email delivery</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                // Handle upgrade
                window.open('/pricing', '_blank');
                setShowUpgradeModal(false);
              }}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Upgrade to Professional - £19/month
            </button>
            
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="w-full text-gray-500 px-4 py-2 rounded-md hover:text-gray-700 transition-colors"
            >
              Continue with samples
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Professional PDF Samples</h1>
              <p className="text-gray-600 mt-1">
                Experience the quality of Audio Intel's professional PDF reports
              </p>
            </div>
            <Link 
              href="/export-demo"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              Try Export Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">See The Quality Before You Upgrade</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Download free samples of our professional PDF reports. Each sample demonstrates the quality, 
            formatting, and intelligence you'll get with Audio Intel Professional.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-blue-700">
              <CheckCircle className="w-4 h-4" />
              Professional formatting & design
            </div>
            <div className="flex items-center gap-2 text-blue-700">
              <CheckCircle className="w-4 h-4" />
              Real industry data examples
            </div>
            <div className="flex items-center gap-2 text-blue-700">
              <CheckCircle className="w-4 h-4" />
              Complete feature demonstration
            </div>
          </div>
        </div>

        {/* Sample PDFs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SampleCard
            type="contacts"
            title="Contact Intelligence Report"
            description="Detailed contact enrichment with industry insights and professional formatting"
            features={PDF_SAMPLES_INFO.contacts.features}
            icon={FileText}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          
          <SampleCard
            type="analytics"
            title="Performance Analytics"
            description="Comprehensive analytics dashboard with metrics and trend analysis"
            features={PDF_SAMPLES_INFO.analytics.features}
            icon={BarChart3}
            color="text-green-600" 
            bgColor="bg-green-50"
          />
          
          <SampleCard
            type="aiAgent"
            title="AI Strategy Report"
            description="Intelligent analysis with strategic recommendations and next steps"
            features={PDF_SAMPLES_INFO.aiAgent.features}
            icon={Brain}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Feature Comparison */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Sample vs Professional Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Free Sample
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Professional
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PDF Quality</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">Watermarked</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-green-600">Full Quality</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Contact Limit</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">First 3-5</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-green-600">Unlimited</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Email Delivery</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">❌</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-green-600">✅</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">White Label</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">❌</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-green-600">Agency Only</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Monthly Limit</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">View Only</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-green-600">Unlimited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready for Professional Quality?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Upgrade to Professional for unlimited high-quality PDF reports, email delivery, 
            and advanced features starting at just £19/month.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              <Crown className="w-5 h-5" />
              View Pricing Plans
            </Link>
            <Link 
              href="/export-demo"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white text-white rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              <Eye className="w-5 h-5" />
              Try Live Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && <UpgradeModal />}
    </div>
  );
}