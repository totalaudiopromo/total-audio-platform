'use client';

import React, { useState } from 'react';
import { Download, FileText, Building2, Zap } from 'lucide-react';
import { exportWhiteLabelContactsPdf, exportDemoContactsPdf, EnrichedContact, WhiteLabelBranding } from '@/utils/premiumPdfExport';

export default function PdfDemoPage() {
  const [agencyName, setAgencyName] = useState('Liberty Promotions');
  const [primaryColor, setPrimaryColor] = useState('#FF006B');
  const [website, setWebsite] = useState('liberty-promotions.co.uk');
  const [contactEmail, setContactEmail] = useState('dan@liberty-promotions.co.uk');

  const demoContacts: EnrichedContact[] = [
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@bbc.co.uk',
      contactIntelligence: 'BBC Radio 1 producer with focus on new music. Previously worked at BBC Radio 6 Music. Strong track record supporting emerging UK artists. Best contact time: Tue-Thu mornings. Prefers submissions via official BBC Introducing platform.',
      researchConfidence: 'High',
      lastResearched: '2025-10-17',
      platform: 'BBC Radio 1',
      role: 'Producer - New Music',
      company: 'BBC'
    },
    {
      name: 'Tom Davies',
      email: 'tom@spotify.com',
      contactIntelligence: 'Spotify UK editorial team member. Curates "New Music Friday UK" and "The Rock List" playlists. Open to submissions via official Spotify for Artists platform. Strong focus on emerging UK rock/alternative acts.',
      researchConfidence: 'Medium',
      lastResearched: '2025-10-17',
      platform: 'Spotify Editorial',
      role: 'Editorial Curator',
      company: 'Spotify UK'
    },
    {
      name: 'Emma Williams',
      email: 'emma.williams@kerrang.com',
      contactIntelligence: 'Kerrang! Radio presenter and music journalist. Covers rock, metal, and alternative scenes. Active on Twitter/X (@emmawilliams) for submissions. Prefers EPKs with streaming links. Responds well to personalized pitches.',
      researchConfidence: 'High',
      lastResearched: '2025-10-17',
      platform: 'Kerrang! Radio',
      role: 'Presenter & Journalist',
      company: 'Kerrang!'
    },
    {
      name: 'Dan Murphy',
      email: 'dan.murphy@libertymusicgroup.com',
      contactIntelligence: 'A&R at Liberty Music Group. Works with Royal Blood, Architects, Rolo Tomassi. Strong connections across UK rock scene. Best approached via warm introduction from existing roster artists.',
      researchConfidence: 'High',
      lastResearched: '2025-10-17',
      platform: 'Record Label',
      role: 'A&R Manager',
      company: 'Liberty Music Group'
    },
    {
      name: 'Lucy Chen',
      email: 'lucy@bbc.co.uk',
      contactIntelligence: 'BBC Radio 6 Music producer. Focus on indie, alternative, and experimental music. Previously at NME. Strong supporter of DIY artists. Prefers organic discovery via Bandcamp and SoundCloud.',
      researchConfidence: 'Medium',
      lastResearched: '2025-10-17',
      platform: 'BBC Radio 6 Music',
      role: 'Producer',
      company: 'BBC'
    }
  ];

  const handleExportDefault = () => {
    exportDemoContactsPdf();
  };

  const handleExportCustom = () => {
    const branding: WhiteLabelBranding = {
      agencyName,
      primaryColor,
      website,
      contactEmail
    };

    exportWhiteLabelContactsPdf(demoContacts, branding);
  };

  const handleExportAudioIntel = () => {
    exportWhiteLabelContactsPdf(demoContacts);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-white">
      {/* Header */}
      <div className="bg-white border-b-4 border-black shadow-brutal">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#FF006B] border-4 border-black rounded-none flex items-center justify-center shadow-brutal">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Premium PDF Export Demo</h1>
              <p className="text-base font-bold text-gray-700 mt-1">White-label contact intelligence reports for PR agencies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="bg-white border-4 border-black shadow-brutal rounded-none p-8">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6 text-[#FF006B]" />
              <h2 className="text-2xl font-black text-gray-900">White-Label Settings</h2>
            </div>

            <div className="space-y-5">
              {/* Agency Name */}
              <div>
                <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
                  Agency Name
                </label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full px-4 py-3 border-3 border-black rounded-none font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#FF006B]/20"
                  placeholder="Your Agency Name"
                />
              </div>

              {/* Primary Color */}
              <div>
                <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
                  Primary Brand Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-16 h-12 border-3 border-black rounded-none cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-4 py-3 border-3 border-black rounded-none font-mono font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#FF006B]/20"
                    placeholder="#FF006B"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
                  Website
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-4 py-3 border-3 border-black rounded-none font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#FF006B]/20"
                  placeholder="yourAgency.com"
                />
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-3 border-3 border-black rounded-none font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#FF006B]/20"
                  placeholder="contact@yourAgency.com"
                />
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-6">
            {/* Custom Branded Export */}
            <div className="bg-white border-4 border-black shadow-brutal rounded-none p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#FF006B] border-3 border-black flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">White-Label Export</h3>
                  <p className="text-sm font-bold text-gray-700">Your branding, professional quality</p>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm font-medium text-gray-700">
                  <span className="text-[#FF006B] font-black">✓</span>
                  Custom agency name and colors
                </li>
                <li className="flex items-start gap-2 text-sm font-medium text-gray-700">
                  <span className="text-[#FF006B] font-black">✓</span>
                  Brutalist professional design
                </li>
                <li className="flex items-start gap-2 text-sm font-medium text-gray-700">
                  <span className="text-[#FF006B] font-black">✓</span>
                  Client-ready intelligence reports
                </li>
                <li className="flex items-start gap-2 text-sm font-medium text-gray-700">
                  <span className="text-[#FF006B] font-black">✓</span>
                  No "Audio Intel" watermark
                </li>
              </ul>

              <button
                onClick={handleExportCustom}
                className="w-full px-6 py-4 bg-[#FF006B] text-white rounded-none font-black text-base border-4 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export White-Label PDF
              </button>
            </div>

            {/* Default Audio Intel Export */}
            <div className="bg-white border-4 border-black shadow-brutal rounded-none p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-900 border-3 border-black flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Audio Intel Branded</h3>
                  <p className="text-sm font-bold text-gray-700">Default branding</p>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm font-medium text-gray-700">
                  <span className="text-gray-900 font-black">✓</span>
                  Audio Intel branding
                </li>
                <li className="flex items-start gap-2 text-sm font-medium text-gray-700">
                  <span className="text-gray-900 font-black">✓</span>
                  Professional brutalist design
                </li>
                <li className="flex items-start gap-2 text-sm font-medium text-gray-700">
                  <span className="text-gray-900 font-black">✓</span>
                  Same intelligence quality
                </li>
              </ul>

              <button
                onClick={handleExportAudioIntel}
                className="w-full px-6 py-4 bg-gray-900 text-white rounded-none font-black text-base border-4 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export Audio Intel PDF
              </button>
            </div>
          </div>
        </div>

        {/* Demo Data Preview */}
        <div className="mt-12 bg-white border-4 border-black shadow-brutal rounded-none p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Demo Contact Data ({demoContacts.length} contacts)</h2>

          <div className="space-y-4">
            {demoContacts.map((contact, idx) => (
              <div key={idx} className="border-2 border-gray-300 rounded-none p-4 hover:border-[#FF006B] transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-black text-gray-900">{contact.name}</h3>
                    <p className="text-sm font-bold text-[#FF006B]">{contact.email}</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">
                      {contact.role} • {contact.company}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-black rounded-none border-2 border-black ${
                    contact.researchConfidence === 'High'
                      ? 'bg-green-400 text-green-900'
                      : contact.researchConfidence === 'Medium'
                      ? 'bg-orange-400 text-orange-900'
                      : 'bg-red-400 text-red-900'
                  }`}>
                    {contact.researchConfidence.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
