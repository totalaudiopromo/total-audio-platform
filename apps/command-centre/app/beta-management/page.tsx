'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import BetaUserMap from '../components/BetaUserMap';

interface BetaSignup {
  name: string;
  email: string;
  role: 'independent-artist' | 'pr-agency' | 'label' | 'other';
  interests: string[];
  referralSource: string;
  currentTools: string;
  goals: string;
}

interface BetaUser {
  id: string;
  email: string;
  name?: string;
  app: string;
  status: 'active' | 'idle' | 'offline';
  lastSeen: string;
  location: {
    country: string;
    city: string;
    countryCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  engagement: {
    contactsEnriched: number;
    emailsValidated: number;
    timeSpent: number;
  };
}

interface BetaTrackingData {
  totalUsers: number;
  activeUsers: number;
  newToday: number;
  users: BetaUser[];
  analytics?: {
    topFeatures: Array<{ feature: string; usage: number }>;
    engagementMetrics: {
      avgSessionTime: number;
      avgContactsPerUser: number;
      conversionRate: number;
    };
  };
}

export default function BetaManagementPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'signup'>('dashboard');
  const [betaData, setBetaData] = useState<BetaTrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<BetaSignup>({
    name: '',
    email: '',
    role: 'independent-artist',
    interests: [],
    referralSource: '',
    currentTools: '',
    goals: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fetchBetaData = async () => {
    try {
      const response = await fetch(`/api/convertkit-subscribers?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBetaData(data);
      }
    } catch (error) {
      console.error('Error fetching beta data:', error);
      setBetaData({ totalUsers: 4, activeUsers: 2, newToday: 0, users: [] });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBetaData();
    const interval = setInterval(fetchBetaData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/beta-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        await fetch('/api/beta-tracker', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: `beta-${Date.now()}`,
            email: formData.email,
            app: 'beta-signup',
            action: 'signup',
            timestamp: new Date().toISOString()
          }),
        });
        // Refresh beta data
        fetchBetaData();
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      console.error('Beta signup error:', error);
      alert('Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #ddd6fe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ color: '#64748b', marginTop: '1rem', fontSize: '0.875rem' }}>
            Loading Beta Management...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #ddd6fe 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => window.history.back()}
              style={{
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.5rem',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              ← Back
            </button>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)'
            }}>
              <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" fill="none"/>
              </svg>
            </div>
            <div>
              <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: '900', 
                margin: 0, 
                color: '#1a202c',
                letterSpacing: '-0.025em'
              }}>
                Beta Management
              </h1>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#64748b', 
                margin: 0,
                fontWeight: '500'
              }}>
                Manage Audio Intel beta users and signups
              </p>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', borderRadius: '12px', padding: '0.25rem' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'dashboard' ? '#3b82f6' : 'transparent',
                color: activeTab === 'dashboard' ? 'white' : '#64748b',
                fontWeight: '600',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'signup' ? '#3b82f6' : 'transparent',
                color: activeTab === 'signup' ? 'white' : '#64748b',
                fontWeight: '600',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              New Signup
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
        {activeTab === 'dashboard' ? (
          /* Beta Dashboard */
          <div>
            {/* Beta User Tracking */}
            {betaData && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 25px 50px rgba(99, 102, 241, 0.15)',
                marginBottom: '2rem'
              }}>
                <h3 style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: '900', 
                  color: '#1a202c', 
                  marginBottom: '2rem',
                  letterSpacing: '-0.025em'
                }}>
                  Beta User Analytics
                </h3>
                
                {/* Metrics Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    border: '1px solid #93c5fd'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '700', 
                          color: '#1e40af',
                          textTransform: 'uppercase',
                          margin: '0 0 0.5rem 0'
                        }}>
                          Total Beta Users
                        </p>
                        <p style={{ 
                          fontSize: '2rem', 
                          fontWeight: '900', 
                          color: '#1e3a8a',
                          margin: 0
                        }}>
                          {betaData.totalUsers}
                        </p>
                      </div>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: '#3b82f6',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke="currentColor" fill="none"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    border: '1px solid #6ee7b7'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '700', 
                          color: '#047857',
                          textTransform: 'uppercase',
                          margin: '0 0 0.5rem 0'
                        }}>
                          Active Now
                        </p>
                        <p style={{ 
                          fontSize: '2rem', 
                          fontWeight: '900', 
                          color: '#064e3b',
                          margin: 0
                        }}>
                          {betaData.activeUsers}
                        </p>
                      </div>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: '#10b981',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          background: 'white',
                          borderRadius: '50%',
                          animation: 'pulse 2s infinite'
                        }}></div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, #e9d5ff, #ddd6fe)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    border: '1px solid #c4b5fd'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '700', 
                          color: '#7c3aed',
                          textTransform: 'uppercase',
                          margin: '0 0 0.5rem 0'
                        }}>
                          New Today
                        </p>
                        <p style={{ 
                          fontSize: '2rem', 
                          fontWeight: '900', 
                          color: '#581c87',
                          margin: 0
                        }}>
                          {betaData.newToday}
                        </p>
                      </div>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: '#8b5cf6',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="currentColor" fill="none"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Global User Map */}
                <BetaUserMap users={betaData.users} />

                {/* Detailed User List */}
                {betaData.users && betaData.users.length > 0 && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.85)',
                    borderRadius: '20px',
                    padding: '2rem',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    <h4 style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      color: '#1e3a8a',
                      marginBottom: '1rem'
                    }}>
                      Active Beta Users
                    </h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: '1rem'
                    }}>
                      {betaData.users.map((user: any, index: number) => (
                        <div key={user.id} style={{
                          background: user.status === 'active' ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' : 
                                     user.status === 'idle' ? 'linear-gradient(135deg, #fef3c7, #fed7aa)' :
                                     'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                          borderRadius: '12px',
                          padding: '1.5rem',
                          border: '1px solid ' + (
                            user.status === 'active' ? '#6ee7b7' :
                            user.status === 'idle' ? '#fbbf24' : '#d1d5db'
                          )
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ flex: 1 }}>
                              <h5 style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: '#1a202c',
                                margin: '0 0 0.25rem 0'
                              }}>
                                {user.name || user.email.split('@')[0]}
                              </h5>
                              <p style={{
                                fontSize: '0.75rem',
                                color: '#6b7280',
                                margin: '0 0 0.5rem 0'
                              }}>
                                {user.email}
                              </p>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                              }}>
                                <div style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: user.status === 'active' ? '#10b981' :
                                             user.status === 'idle' ? '#f59e0b' : '#9ca3af'
                                }}></div>
                                <span style={{
                                  fontSize: '0.75rem',
                                  fontWeight: '600',
                                  color: user.status === 'active' ? '#047857' :
                                         user.status === 'idle' ? '#d97706' : '#6b7280',
                                  textTransform: 'capitalize'
                                }}>
                                  {user.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '0.75rem',
                            fontSize: '0.75rem'
                          }}>
                            <div>
                              <span style={{ color: '#6b7280' }}>Contacts:</span>
                              <div style={{ fontWeight: '600', color: '#8b5cf6' }}>
                                {user.engagement.contactsEnriched.toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <span style={{ color: '#6b7280' }}>Validated:</span>
                              <div style={{ fontWeight: '600', color: '#059669' }}>
                                {user.engagement.emailsValidated.toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <span style={{ color: '#6b7280' }}>Sessions:</span>
                              <div style={{ fontWeight: '600', color: '#3b82f6' }}>
                                {user.sessionCount}
                              </div>
                            </div>
                            <div>
                              <span style={{ color: '#6b7280' }}>Location:</span>
                              <div style={{ fontWeight: '600', color: '#374151' }}>
                                {user.location.city}, {user.location.countryCode}
                              </div>
                            </div>
                          </div>

                          <div style={{
                            marginTop: '1rem',
                            fontSize: '0.75rem',
                            color: '#6b7280'
                          }}>
                            Last seen: {new Date(user.lastSeen).toLocaleString('en-GB', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Beta Signup Form */
          <div>
            {isSubmitted ? (
              <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '24px',
                padding: '3rem',
                textAlign: 'center',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 2rem auto',
                  boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
                }}>
                  <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" stroke="currentColor" fill="none"/>
                  </svg>
                </div>
                
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: '900',
                  color: '#1a202c',
                  margin: '0 0 1rem 0'
                }}>
                  Beta User Added Successfully!
                </h2>
                
                <p style={{
                  fontSize: '1.125rem',
                  color: '#64748b',
                  margin: '0 0 2rem 0'
                }}>
                  The new beta user has been added to Audio Intel. They will receive access details shortly.
                </p>

                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      role: 'independent-artist',
                      interests: [],
                      referralSource: '',
                      currentTools: '',
                      goals: ''
                    });
                  }}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem 2rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginRight: '1rem'
                  }}
                >
                  Add Another User
                </button>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  style={{
                    background: '#f1f5f9',
                    color: '#64748b',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem 2rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  View Dashboard
                </button>
              </div>
            ) : (
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '24px',
                  padding: '3rem',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 2rem auto',
                      boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
                    }}>
                      <Image 
                        src="/t-a-p-new dog logo.png" 
                        alt="Total Audio Promo Logo" 
                        width={50} 
                        height={50}
                        className="rounded-lg"
                      />
                    </div>
                    
                    <h2 style={{
                      fontSize: '2.5rem',
                      fontWeight: '900',
                      color: '#1a202c',
                      margin: '0 0 1rem 0',
                      letterSpacing: '-0.025em'
                    }}>
                      Add New Beta User
                    </h2>
                    
                    <p style={{
                      fontSize: '1.125rem',
                      color: '#64748b',
                      margin: 0
                    }}>
                      Manually add a new user to the Audio Intel beta program
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Basic Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#374151', marginBottom: '0.5rem' }}>
                          Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '500',
                            color: '#374151',
                            background: 'white'
                          }}
                          placeholder="Enter full name"
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#374151', marginBottom: '0.5rem' }}>
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '500',
                            color: '#374151',
                            background: 'white'
                          }}
                          placeholder="user@example.com"
                        />
                      </div>
                    </div>

                    {/* Role */}
                    <div style={{ marginBottom: '2rem' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#374151', marginBottom: '1rem' }}>
                        User Type *
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        {[
                          { value: 'independent-artist', label: 'Independent Artist' },
                          { value: 'pr-agency', label: 'PR Agency' },
                          { value: 'label', label: 'Record Label' },
                          { value: 'other', label: 'Other' }
                        ].map((role) => (
                          <label key={role.value} style={{ position: 'relative', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name="role"
                              value={role.value}
                              checked={formData.role === role.value}
                              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                              style={{ display: 'none' }}
                            />
                            <div style={{
                              padding: '1rem',
                              borderRadius: '12px',
                              border: '2px solid ' + (formData.role === role.value ? '#3b82f6' : '#e5e7eb'),
                              background: formData.role === role.value ? '#eff6ff' : 'white',
                              textAlign: 'center',
                              fontWeight: '600',
                              color: formData.role === role.value ? '#1e40af' : '#6b7280',
                              transition: 'all 0.2s'
                            }}>
                              {role.label}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Interests */}
                    <div style={{ marginBottom: '2rem' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#374151', marginBottom: '1rem' }}>
                        Interested Features (select all that apply)
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.75rem' }}>
                        {[
                          'Contact enrichment & data enhancement',
                          'Email validation & verification',
                          'Industry contact database access',
                          'AI-powered contact intelligence',
                          'Multi-client agency dashboard',
                          'CSV export & data management'
                        ].map((interest) => (
                          <label key={interest} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            background: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}>
                            <input
                              type="checkbox"
                              checked={formData.interests.includes(interest)}
                              onChange={() => handleInterestToggle(interest)}
                              style={{ width: '16px', height: '16px' }}
                            />
                            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                              {interest}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Current Tools */}
                    <div style={{ marginBottom: '2rem' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#374151', marginBottom: '0.5rem' }}>
                        Current Tools
                      </label>
                      <textarea
                        value={formData.currentTools}
                        onChange={(e) => setFormData(prev => ({ ...prev, currentTools: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: '500',
                          color: '#374151',
                          background: 'white',
                          minHeight: '100px',
                          resize: 'vertical'
                        }}
                        placeholder="e.g., SubmitHub, Groover, Chartmetric, Apollo, ZoomInfo, etc."
                      />
                    </div>

                    {/* Goals */}
                    <div style={{ marginBottom: '3rem' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#374151', marginBottom: '0.5rem' }}>
                        Goals with Audio Intel
                      </label>
                      <textarea
                        value={formData.goals}
                        onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: '500',
                          color: '#374151',
                          background: 'white',
                          minHeight: '100px',
                          resize: 'vertical'
                        }}
                        placeholder="e.g., Build verified industry contacts, validate email lists, enrich existing contacts with social data..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '1rem 2rem',
                        fontSize: '1.125rem',
                        fontWeight: '700',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.7 : 1,
                        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
                        transition: 'all 0.2s'
                      }}
                    >
                      {isSubmitting ? 'Adding User...' : 'Add Beta User'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        
        input:focus, textarea:focus {
          outline: none;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
}