'use client';

import { useState, useEffect } from 'react';

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'warning';
  uptime: string;
  responseTime: string;
  lastCheck: string;
  url?: string;
}

export default function SystemStatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallStatus, setOverallStatus] = useState<'operational' | 'degraded' | 'down'>('operational');

  useEffect(() => {
    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemStatus = async () => {
    try {
      // Check multiple services
      const serviceChecks = [
        { name: 'Command Centre', url: '/api/audio-intel-metrics' },
        { name: 'Audio Intel API', url: '/api/system/restart' },
        { name: 'User Management', url: '/api/users/update' },
        { name: 'Beta Signup', url: '/api/beta-signup' },
        { name: 'Marketing Agent', url: '/api/saas-marketing' },
        { name: 'Social Media', url: '/api/social-media/schedule' },
        { name: 'Reports Generator', url: '/api/reports/generate' }
      ];

      const statusChecks = await Promise.allSettled(
        serviceChecks.map(async (service) => {
          const startTime = Date.now();
          try {
            const response = await fetch(service.url, { method: 'GET' });
            const responseTime = Date.now() - startTime;
            return {
              ...service,
              status: response.ok ? 'online' : 'warning' as const,
              uptime: '99.9%',
              responseTime: `${responseTime}ms`,
              lastCheck: new Date().toISOString()
            };
          } catch (error) {
            return {
              ...service,
              status: 'offline' as const,
              uptime: '0%',
              responseTime: 'timeout',
              lastCheck: new Date().toISOString()
            };
          }
        })
      );

      const serviceStatuses = statusChecks.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            name: serviceChecks[index].name,
            status: 'offline' as 'online' | 'offline' | 'warning',
            uptime: '0%',
            responseTime: 'error',
            lastCheck: new Date().toISOString(),
            url: serviceChecks[index].url
          };
        }
      });

      // @ts-ignore
      setServices(serviceStatuses);

      // Determine overall status
      const onlineCount = serviceStatuses.filter(s => s.status === 'online').length;
      const totalCount = serviceStatuses.length;
      
      if (onlineCount === totalCount) {
        setOverallStatus('operational');
      } else if (onlineCount > totalCount / 2) {
        setOverallStatus('degraded');
      } else {
        setOverallStatus('down');
      }

    } catch (error) {
      console.error('Failed to fetch system status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = async (serviceName: string) => {
    try {
      const response = await fetch('/api/system/restart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: serviceName.toLowerCase().replace(' ', '-') })
      });
      
      const result = await response.json();
      if (result.success) {
        alert(`✅ ${serviceName} restart initiated`);
        setTimeout(fetchSystemStatus, 2000); // Refresh after 2 seconds
      } else {
        alert(`❌ Failed to restart ${serviceName}`);
      }
    } catch (error) {
      alert(`❌ Restart failed: ${error}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return { bg: '#d1fae5', text: '#047857', border: '#10b981' };
      case 'warning': return { bg: '#fef3c7', text: '#d97706', border: '#f59e0b' };
      case 'offline': return { bg: '#fed7d7', text: '#c53030', border: '#f56565' };
      default: return { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' };
    }
  };

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case 'operational': return { bg: '#d1fae5', text: '#047857' };
      case 'degraded': return { bg: '#fef3c7', text: '#d97706' };
      case 'down': return { bg: '#fed7d7', text: '#c53030' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Checking system status...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '2rem'
    }}>
      {/* Overall Status */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1a202c', margin: '0 0 1rem 0' }}>
          System Status
        </h1>
        
        <div style={{
          display: 'inline-block',
          padding: '1rem 2rem',
          borderRadius: '50px',
          background: getOverallStatusColor().bg,
          color: getOverallStatusColor().text,
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textTransform: 'capitalize',
          marginBottom: '1rem'
        }}>
          {overallStatus === 'operational' ? '🟢' : overallStatus === 'degraded' ? '🟡' : '🔴'} {overallStatus}
        </div>
        
        <p style={{ color: '#6b7280', margin: 0 }}>
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>

      {/* Services Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {services.map((service) => {
          const statusColors = getStatusColor(service.status);
          
          return (
            <div key={service.name} style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '1.5rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
              border: `2px solid ${statusColors.border}20`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>
                  {service.name}
                </h3>
                
                <div style={{
                  background: statusColors.bg,
                  color: statusColors.text,
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {service.status}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Uptime</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1a202c' }}>{service.uptime}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Response</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1a202c' }}>{service.responseTime}</div>
                </div>
              </div>
              
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '1rem' }}>
                Last check: {new Date(service.lastCheck).toLocaleString()}
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleRestart(service.name)}
                  style={{
                    background: service.status === 'offline' ? '#ef4444' : 'transparent',
                    color: service.status === 'offline' ? 'white' : '#ef4444',
                    border: '2px solid #ef4444',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  🔄 Restart
                </button>
                
                <button
                  onClick={fetchSystemStatus}
                  style={{
                    background: 'transparent',
                    color: '#3b82f6',
                    border: '2px solid #3b82f6',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ✅ Test
                </button>
              </div>
            </div>
          );
        })}
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