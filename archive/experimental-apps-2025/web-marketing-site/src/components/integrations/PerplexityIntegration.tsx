import { useState } from 'react';
import { perplexityApi } from '../../services/mcpApi';

interface Journalist {
  name: string;
  outlet: string;
  email?: string;
  twitter?: string;
  linkedin?: string;
  beat: string;
}

interface IndustryResearch {
  trends: string[];
  insights: string[];
  opportunities: string[];
}

interface ContactList {
  name: string;
  description: string;
  contacts: Journalist[];
}

export default function PerplexityIntegration() {
  const [activeTab, setActiveTab] = useState<'journalists' | 'research' | 'contacts'>(
    'journalists'
  );
  const [loading, setLoading] = useState(false);
  const [journalists, setJournalists] = useState<Journalist[]>([]);
  const [research, setResearch] = useState<IndustryResearch | null>(null);
  const [contactLists, setContactLists] = useState<ContactList[]>([]);
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');

  const handleFindJournalists = async () => {
    if (!industry) return;

    setLoading(true);
    try {
      const result = await perplexityApi.findJournalists(industry, location);
      if (result.success) {
        setJournalists(result.journalists || []);
      }
    } catch (error) {
      console.error('Error finding journalists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResearchIndustry = async () => {
    if (!industry) return;

    setLoading(true);
    try {
      const result = await perplexityApi.researchIndustry(industry);
      if (result.success) {
        setResearch(result.research);
      }
    } catch (error) {
      console.error('Error researching industry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFindContactLists = async () => {
    if (!industry) return;

    setLoading(true);
    try {
      const result = await perplexityApi.findContactLists(industry);
      if (result.success) {
        setContactLists(result.contactLists || []);
      }
    } catch (error) {
      console.error('Error finding contact lists:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Integrations
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Perplexity AI Integration
                </h1>
                <p className="text-gray-600 mt-1">AI-powered research and journalist discovery</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
              <input
                type="text"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                placeholder="e.g., technology, healthcare, finance"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g., San Francisco, CA"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'journalists', label: 'Find Journalists', icon: '👥' },
                { id: 'research', label: 'Industry Research', icon: '📊' },
                { id: 'contacts', label: 'Contact Lists', icon: '📋' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Journalists Tab */}
            {activeTab === 'journalists' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Find Journalists</h3>
                  <button
                    onClick={handleFindJournalists}
                    disabled={!industry || loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Searching...' : 'Find Journalists'}
                  </button>
                </div>

                {journalists.length > 0 && (
                  <div className="grid gap-4">
                    {journalists.map((journalist, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{journalist.name}</h4>
                            <p className="text-sm text-gray-600">{journalist.outlet}</p>
                            <p className="text-sm text-gray-500">{journalist.beat}</p>
                          </div>
                          <div className="flex gap-2">
                            {journalist.email && (
                              <a
                                href={`mailto:${journalist.email}`}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                📧
                              </a>
                            )}
                            {journalist.twitter && (
                              <a
                                href={journalist.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                🐦
                              </a>
                            )}
                            {journalist.linkedin && (
                              <a
                                href={journalist.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                💼
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Research Tab */}
            {activeTab === 'research' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Industry Research</h3>
                  <button
                    onClick={handleResearchIndustry}
                    disabled={!industry || loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Researching...' : 'Research Industry'}
                  </button>
                </div>

                {research && (
                  <div className="grid gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Trends</h4>
                      <ul className="space-y-2">
                        {research.trends.map((trend, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span className="text-gray-700">{trend}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Insights</h4>
                      <ul className="space-y-2">
                        {research.insights.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span className="text-gray-700">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Opportunities</h4>
                      <ul className="space-y-2">
                        {research.opportunities.map((opportunity, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            <span className="text-gray-700">{opportunity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Contact Lists Tab */}
            {activeTab === 'contacts' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Lists</h3>
                  <button
                    onClick={handleFindContactLists}
                    disabled={!industry || loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Finding...' : 'Find Contact Lists'}
                  </button>
                </div>

                {contactLists.length > 0 && (
                  <div className="grid gap-4">
                    {contactLists.map((list, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{list.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{list.description}</p>
                        <div className="space-y-2">
                          {list.contacts.map((contact, contactIndex) => (
                            <div
                              key={contactIndex}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="text-gray-700">
                                {contact.name} - {contact.outlet}
                              </span>
                              <span className="text-gray-500">{contact.beat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
