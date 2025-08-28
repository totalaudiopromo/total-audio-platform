import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface GmailStatus {
  connected: boolean;
  lastSyncAt?: string;
}

interface EmailAnalytics {
  totalEmails: number;
  totalReplies: number;
  replyRate: number;
  recentReplies: any[];
}

const GmailIntegration: React.FC = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<GmailStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<EmailAnalytics | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    checkGmailStatus();
    fetchCampaigns();
  }, []);

  const checkGmailStatus = async () => {
    try {
      const response = await fetch('/api/gmail/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Failed to check Gmail status:', error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
  };

  const connectGmail = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gmail/auth', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Failed to initiate Gmail auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const disconnectGmail = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gmail/disconnect', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        setStatus({ connected: false });
      }
    } catch (error) {
      console.error('Failed to disconnect Gmail:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackReplies = async (campaignId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/gmail/track-replies/${campaignId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        alert('Reply tracking started successfully!');
      }
    } catch (error) {
      console.error('Failed to start reply tracking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAnalytics = async (campaignId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/gmail/analytics/${campaignId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to get analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async (to: string, subject: string, content: string, campaignId?: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/gmail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, content, campaignId }),
      });
      
      if (response.ok) {
        alert('Email sent successfully!');
      }
    } catch (error) {
      console.error('Failed to send email:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gmail Integration</h2>
          <p className="text-gray-600 mt-1">
            Track email replies and send emails directly from your Gmail account
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {status?.connected ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              Disconnected
            </span>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-6">
        {status?.connected ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Gmail Connected
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Last synced: {status.lastSyncAt ? new Date(status.lastSyncAt).toLocaleString() : 'Never'}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={disconnectGmail}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Disconnecting...' : 'Disconnect Gmail'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Gmail Not Connected
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Connect your Gmail account to track email replies and send emails directly.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={connectGmail}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Connect Gmail'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Campaign Tracking */}
      {status?.connected && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Tracking</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="campaign" className="block text-sm font-medium text-gray-700">
                Select Campaign
              </label>
              <select
                id="campaign"
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Choose a campaign...</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedCampaign && (
              <div className="flex space-x-4">
                <button
                  onClick={() => trackReplies(selectedCampaign)}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? 'Starting...' : 'Start Reply Tracking'}
                </button>
                
                <button
                  onClick={() => getAnalytics(selectedCampaign)}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Get Analytics'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Display */}
      {analytics && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Email Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalEmails}</div>
              <div className="text-sm text-blue-600">Total Emails</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{analytics.totalReplies}</div>
              <div className="text-sm text-green-600">Total Replies</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{analytics.replyRate.toFixed(1)}%</div>
              <div className="text-sm text-purple-600">Reply Rate</div>
            </div>
          </div>
          
          {analytics.recentReplies.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-medium text-gray-900 mb-2">Recent Replies</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                {analytics.recentReplies.slice(0, 5).map((reply, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{reply.contact.name}</div>
                      <div className="text-xs text-gray-500">{reply.contact.email}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(reply.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Email Sender */}
      {status?.connected && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Email Sender</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-to" className="block text-sm font-medium text-gray-700">
                To
              </label>
              <input
                type="email"
                id="email-to"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="recipient@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="email-subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                id="email-subject"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email subject"
              />
            </div>
            
            <div>
              <label htmlFor="email-content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                id="email-content"
                rows={4}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email content..."
              />
            </div>
            
            <button
              onClick={() => {
                const to = (document.getElementById('email-to') as HTMLInputElement).value;
                const subject = (document.getElementById('email-subject') as HTMLInputElement).value;
                const content = (document.getElementById('email-content') as HTMLTextAreaElement).value;
                
                if (to && subject && content) {
                  sendEmail(to, subject, content);
                } else {
                  alert('Please fill in all fields');
                }
              }}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GmailIntegration; 