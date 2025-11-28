/**
 * Audio Intel PDF Export Template
 * Neobrutalist design with Total Audio Promo branding and Audio the Dog mascot
 */

import React from 'react';

export interface BrutalistPDFContact {
  name: string;
  email: string;
  contactIntelligence?: string;
  researchConfidence?: string;
  platform?: string;
  role?: string;
  company?: string;
  lastResearched?: string;
}

export interface BrutalistPDFMetrics {
  total: number;
  high: number;
  medium: number;
  low: number;
  platforms: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
}

export interface BrutalistPDFProps {
  contacts: BrutalistPDFContact[];
  metrics: BrutalistPDFMetrics;
  whiteLabel?: {
    companyName?: string;
    logoUrl?: string;
    primaryColor?: string;
  };
}

export function BrutalistPDFTemplate({ contacts, metrics, whiteLabel }: BrutalistPDFProps) {
  const companyName = whiteLabel?.companyName || 'Total Audio Promo';
  const primaryColor = whiteLabel?.primaryColor || '#3B82F6'; // blue-500
  const generatedDate = new Date().toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="p-12 bg-gradient-to-br from-blue-50 via-white to-slate-50 min-h-screen">
      {/* Header with Logo, Mascot, and Branding */}
      <div className="border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-12 bg-white">
        <div className="flex items-center justify-between">
          {/* Left side: Logo and Company Name */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            {whiteLabel?.logoUrl ? (
              <img
                src={whiteLabel.logoUrl}
                alt={companyName}
                className="w-24 h-24 border-4 border-black rounded-xl object-contain bg-white"
              />
            ) : (
              <div className="w-24 h-24 border-4 border-black rounded-xl overflow-hidden bg-white flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/total_audio_promo_logo_trans.png"
                  alt="Total Audio Promo"
                  className="w-20 h-20 object-contain"
                  onError={e => {
                    // Fallback to styled initials if image fails
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full bg-blue-500 flex items-center justify-center">
                          <span class="text-white font-black text-2xl">TAP</span>
                        </div>
                      `;
                    }
                  }}
                />
              </div>
            )}

            <div>
              <h1 className="font-black text-3xl text-black">{companyName}</h1>
              <p className="text-blue-600 font-bold text-lg mt-1">
                Audio Intel - Contact Intelligence Report
              </p>
              <p className="text-gray-500 text-sm mt-2">Generated: {generatedDate}</p>
            </div>
          </div>

          {/* Right side: Audio the Dog Mascot */}
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 border-4 border-black rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/loading-states/success-complete.png"
                alt="Audio the Dog - celebrating your enriched contacts!"
                className="w-full h-full object-contain p-2"
                onError={e => {
                  // Fallback to text if mascot image fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full bg-blue-100 flex items-center justify-center">
                        <span class="text-4xl">🎧</span>
                      </div>
                    `;
                  }
                }}
              />
            </div>
            <p className="text-xs font-bold text-gray-500 mt-2">Audio the Dog</p>
          </div>
        </div>
      </div>

      {/* Title Section with Gradient Bar */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-2 h-16 rounded-full" style={{ backgroundColor: primaryColor }}></div>
          <div>
            <h2 className="font-black text-4xl text-black">Contact Intelligence Report</h2>
            <p className="text-blue-600 font-bold text-xl mt-1">
              {contacts.length} Contacts Enriched
            </p>
          </div>
        </div>
        <div className="border-t-4 border-black w-full"></div>
      </div>

      {/* Summary Metrics */}
      <div className="mb-12">
        <h3 className="font-black text-2xl mb-6 text-black flex items-center gap-3">
          <span className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </span>
          Summary Metrics
        </h3>

        <div className="grid grid-cols-4 gap-6">
          {/* Total Contacts */}
          <div className="border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 text-center bg-white">
            <div className="font-black text-5xl text-black mb-2">{metrics.total}</div>
            <div className="font-bold text-gray-600 text-sm uppercase tracking-wide">Total</div>
          </div>

          {/* High Confidence */}
          <div className="border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(34,197,94,0.4)] p-6 text-center bg-green-50">
            <div className="font-black text-5xl text-green-600 mb-2">{metrics.high}</div>
            <div className="font-bold text-green-700 text-sm uppercase tracking-wide">High</div>
          </div>

          {/* Medium Confidence */}
          <div className="border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(249,115,22,0.4)] p-6 text-center bg-orange-50">
            <div className="font-black text-5xl text-orange-600 mb-2">{metrics.medium}</div>
            <div className="font-bold text-orange-700 text-sm uppercase tracking-wide">Medium</div>
          </div>

          {/* Low Confidence */}
          <div className="border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(107,114,128,0.4)] p-6 text-center bg-gray-50">
            <div className="font-black text-5xl text-gray-600 mb-2">{metrics.low}</div>
            <div className="font-bold text-gray-700 text-sm uppercase tracking-wide">Low</div>
          </div>
        </div>
      </div>

      {/* Top Platforms Table */}
      {metrics.platforms.length > 0 && (
        <div className="mb-12">
          <h3 className="font-black text-2xl mb-6 text-black flex items-center gap-3">
            <span className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </span>
            Platform Breakdown
          </h3>

          <div className="border-4 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-500">
                  <th className="border-b-4 border-r-2 border-black p-4 text-left font-black text-white">
                    Platform
                  </th>
                  <th className="border-b-4 border-r-2 border-black p-4 text-center font-black text-white w-32">
                    Contacts
                  </th>
                  <th className="border-b-4 border-black p-4 text-center font-black text-white w-32">
                    Share
                  </th>
                </tr>
              </thead>
              <tbody>
                {metrics.platforms.map((platform, idx) => (
                  <tr key={platform.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                    <td className="border-r-2 border-b border-black p-4 font-bold text-black">
                      {platform.name}
                    </td>
                    <td className="border-r-2 border-b border-black p-4 text-center text-black font-bold">
                      {platform.count}
                    </td>
                    <td className="border-b border-black p-4 text-center">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold text-sm border-2 border-blue-300">
                        {platform.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Divider with mascot accent */}
      <div className="flex items-center gap-4 my-12">
        <div className="flex-1 border-t-4 border-black"></div>
        <div className="w-16 h-16 border-4 border-black rounded-full overflow-hidden bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/loading-states/processing-contacts.png"
            alt="Audio the Dog processing"
            className="w-full h-full object-contain p-1"
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="w-full h-full bg-blue-100 flex items-center justify-center"><span class="text-2xl">🎵</span></div>`;
              }
            }}
          />
        </div>
        <div className="flex-1 border-t-4 border-black"></div>
      </div>

      {/* Contact Details */}
      <div className="mb-12">
        <h3 className="font-black text-2xl mb-6 text-black flex items-center gap-3">
          <span className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </span>
          Contact Details ({contacts.length})
        </h3>

        <div className="space-y-6">
          {contacts.map((contact, idx) => {
            const confidence = contact.researchConfidence || 'Low';
            const isHigh = confidence.toLowerCase().includes('high');
            const isMedium = confidence.toLowerCase().includes('medium');

            return (
              <div
                key={idx}
                className="contact-card border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white"
              >
                {/* Contact Header with Confidence Badge */}
                <div
                  className={`px-6 py-4 border-b-4 border-black ${
                    isHigh ? 'bg-green-50' : isMedium ? 'bg-orange-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-black text-2xl text-black">{contact.name}</h4>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-blue-600 font-bold text-lg hover:underline"
                      >
                        {contact.email}
                      </a>
                    </div>
                    <span
                      className={`
                        px-4 py-2 rounded-lg font-black border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-sm uppercase tracking-wide
                        ${
                          isHigh
                            ? 'bg-green-500 text-white'
                            : isMedium
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-500 text-white'
                        }
                      `}
                    >
                      {confidence}
                    </span>
                  </div>
                </div>

                {/* Contact Body */}
                <div className="p-6 space-y-4">
                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {contact.platform && (
                      <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">
                          Platform
                        </p>
                        <p className="font-bold text-black">{contact.platform}</p>
                      </div>
                    )}
                    {contact.company && (
                      <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">
                          Organisation
                        </p>
                        <p className="font-bold text-black">{contact.company}</p>
                      </div>
                    )}
                    {contact.role && (
                      <div className="bg-teal-50 rounded-lg p-3 border-2 border-teal-200">
                        <p className="text-xs font-bold text-teal-600 uppercase tracking-wide mb-1">
                          Role
                        </p>
                        <p className="font-bold text-black">{contact.role}</p>
                      </div>
                    )}
                  </div>

                  {/* Intelligence Section */}
                  {contact.contactIntelligence && (
                    <div className="mt-4 pt-4 border-t-2 border-gray-200">
                      <p className="font-black text-black mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        </span>
                        Intelligence
                      </p>
                      <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                        {contact.contactIntelligence}
                      </p>
                    </div>
                  )}

                  {/* Last Researched */}
                  {contact.lastResearched && (
                    <p className="text-sm text-gray-400 mt-4 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Last researched:{' '}
                      {new Date(contact.lastResearched).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer with Mascot and Branding */}
      <div className="mt-16 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border-4 border-black rounded-xl overflow-hidden bg-white flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/total_audio_promo_logo_trans.png"
                alt="Total Audio Promo"
                className="w-12 h-12 object-contain"
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="font-black text-xl text-blue-600">TAP</span>`;
                  }
                }}
              />
            </div>
            <div>
              <p className="font-black text-xl text-black">Total Audio Promo</p>
              <p className="text-gray-600 font-bold">Contact Intelligence Platform</p>
              <a
                href="mailto:info@totalaudiopromo.com"
                className="text-blue-600 font-bold hover:underline text-sm"
              >
                info@totalaudiopromo.com
              </a>
            </div>
          </div>

          {/* Right: Mascot with message */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-black text-gray-900">Thanks for using Audio Intel!</p>
              <p className="text-sm text-gray-500">
                {contacts.length} contacts ready for your campaign
              </p>
            </div>
            <div className="w-20 h-20 border-4 border-black rounded-full overflow-hidden bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/loading-states/vinyl-throw-action.png"
                alt="Audio the Dog ready for action!"
                className="w-full h-full object-contain p-1"
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="w-full h-full bg-blue-100 flex items-center justify-center"><span class="text-2xl">🎧</span></div>`;
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
