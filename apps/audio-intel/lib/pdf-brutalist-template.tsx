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
  const primaryColor = whiteLabel?.primaryColor || '#3B82F6'; // blue-500 electric blue
  const generatedDate = new Date().toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="p-12 bg-white min-h-screen">
      {/* Header with logo and branding */}
      <div className="border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-12 bg-white">
        <div className="flex items-center gap-4">
          {whiteLabel?.logoUrl ? (
            <img
              src={whiteLabel.logoUrl}
              alt={companyName}
              className="w-20 h-20 border-4 border-black rounded-xl object-contain"
            />
          ) : (
            <div
              className="w-20 h-20 bg-blue-500 border-4 border-black rounded-xl flex items-center justify-center"
              style={{ backgroundColor: primaryColor }}
            >
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2v20M8 6v12M16 6v12M4 10v4M20 10v4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
          <div>
            <h1 className="font-black text-3xl text-black">{companyName}</h1>
            <p className="text-gray-600 font-bold text-lg">
              Audio Intel - Contact Intelligence Report
            </p>
          </div>
        </div>
      </div>

      {/* Title Section */}
      <div className="mb-12">
        <h2 className="font-black text-4xl mb-2 text-black">Contact Intelligence Report</h2>
        <p className="text-blue-600 font-bold text-xl">{contacts.length} Contacts Enriched</p>
        <div className="mt-4 border-t-4 border-black w-full"></div>
      </div>

      {/* Summary Metrics */}
      <div className="mb-12">
        <h3 className="font-black text-2xl mb-4 text-black">Summary Metrics</h3>
        <div className="grid grid-cols-3 gap-6">
          {/* Total Contacts */}
          <div className="border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-center bg-white">
            <div className="font-black text-5xl text-black mb-2">{metrics.total}</div>
            <div className="font-bold text-gray-600 text-sm">Total Contacts</div>
          </div>

          {/* High Confidence */}
          <div className="border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-center bg-green-50">
            <div className="font-black text-5xl text-green-600 mb-2">{metrics.high}</div>
            <div className="font-bold text-gray-600 text-sm">High Confidence</div>
          </div>

          {/* Medium Confidence */}
          <div className="border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-center bg-orange-50">
            <div className="font-black text-5xl text-orange-600 mb-2">{metrics.medium}</div>
            <div className="font-bold text-gray-600 text-sm">Medium Confidence</div>
          </div>
        </div>
      </div>

      {/* Top Platforms Table */}
      {metrics.platforms.length > 0 && (
        <div className="mb-12">
          <h3 className="font-black text-2xl mb-4 text-black">Top Platforms</h3>
          <table className="w-full border-4 border-black rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-blue-500">
                <th className="border-2 border-black p-4 text-left font-black text-white">
                  Platform
                </th>
                <th className="border-2 border-black p-4 text-left font-black text-white">
                  Contacts
                </th>
                <th className="border-2 border-black p-4 text-left font-black text-white">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {metrics.platforms.map((platform, idx) => (
                <tr key={platform.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border-2 border-black p-4 font-bold text-black">
                    {platform.name}
                  </td>
                  <td className="border-2 border-black p-4 text-black">{platform.count}</td>
                  <td className="border-2 border-black p-4 text-black">{platform.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Divider */}
      <div className="border-t-4 border-black w-full my-12"></div>

      {/* Contact Details */}
      <div className="mb-12">
        <h3 className="font-black text-2xl mb-6 text-black">Contact Details</h3>
        <div className="space-y-8">
          {contacts.map((contact, idx) => {
            const confidence = contact.researchConfidence || 'Low';
            const isHigh = confidence.toLowerCase().includes('high');
            const isMedium = confidence.toLowerCase().includes('medium');

            return (
              <div
                key={idx}
                className="contact-card border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 bg-white"
              >
                {/* Contact Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="font-black text-2xl text-black mb-1">{contact.name}</h4>
                    <p className="text-blue-600 font-bold text-lg">{contact.email}</p>
                  </div>
                  <span
                    className={`
                      px-4 py-2 rounded-lg font-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-sm
                      ${
                        isHigh
                          ? 'bg-green-500 text-white'
                          : isMedium
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-500 text-white'
                      }
                    `}
                  >
                    {confidence.toUpperCase()}
                  </span>
                </div>

                {/* Contact Details */}
                <div className="space-y-3 text-gray-700">
                  {contact.platform && (
                    <p>
                      <span className="font-bold text-black">Platform:</span> {contact.platform}
                    </p>
                  )}
                  {contact.company && (
                    <p>
                      <span className="font-bold text-black">Organisation:</span> {contact.company}
                    </p>
                  )}
                  {contact.role && (
                    <p>
                      <span className="font-bold text-black">Role:</span> {contact.role}
                    </p>
                  )}
                  {contact.contactIntelligence && (
                    <div className="mt-4 pt-4 border-t-2 border-gray-200">
                      <p className="font-bold text-black mb-2">Intelligence:</p>
                      <p className="text-gray-600 leading-relaxed">{contact.contactIntelligence}</p>
                    </div>
                  )}
                  {contact.lastResearched && (
                    <p className="text-sm text-gray-400 mt-4">
                      Last researched:{' '}
                      {new Date(contact.lastResearched).toLocaleDateString('en-GB')}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t-4 border-black text-center">
        <p className="font-bold text-gray-700 text-lg">Powered by Total Audio Promo</p>
        <a
          href="mailto:info@totalaudiopromo.com"
          className="text-blue-600 font-bold hover:underline"
        >
          info@totalaudiopromo.com
        </a>
        <p className="text-gray-500 mt-2">Generated: {generatedDate}</p>
      </div>
    </div>
  );
}
