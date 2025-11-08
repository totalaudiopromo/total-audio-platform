'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  Wifi,
  WifiOff,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  Server,
  Globe,
} from 'lucide-react';

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
  const [overallStatus, setOverallStatus] = useState<'operational' | 'degraded' | 'down'>(
    'operational'
  );

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
        { name: 'Reports Generator', url: '/api/reports/generate' },
      ];

      const statusChecks = await Promise.allSettled(
        serviceChecks.map(async service => {
          const startTime = Date.now();
          try {
            const response = await fetch(service.url, { method: 'GET' });
            const responseTime = Date.now() - startTime;
            return {
              ...service,
              status: response.ok ? 'online' : ('warning' as const),
              uptime: '99.9%',
              responseTime: `${responseTime}ms`,
              lastCheck: new Date().toISOString(),
            };
          } catch (error) {
            return {
              ...service,
              status: 'offline' as const,
              uptime: '0%',
              responseTime: 'timeout',
              lastCheck: new Date().toISOString(),
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
            url: serviceChecks[index].url,
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
        body: JSON.stringify({ service: serviceName.toLowerCase().replace(' ', '-') }),
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
      case 'online':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'down':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="postcraft-page flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Checking System Status</h2>
          <p className="text-gray-600">Monitoring all Audio Intel services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="postcraft-container">
      {/* Header */}
      <div className="postcraft-section text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          System Status
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Real-time monitoring of all Audio Intel services
        </p>
        <div className="postcraft-status">
          <div
            className={`postcraft-status-dot ${
              overallStatus === 'operational'
                ? 'bg-green-500'
                : overallStatus === 'degraded'
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
          ></div>
          <span>
            {overallStatus === 'operational'
              ? 'All Systems Operational'
              : overallStatus === 'degraded'
              ? 'Some Services Degraded'
              : 'System Issues Detected'}
          </span>
        </div>
      </div>

      {/* Overall Status Card */}
      <div className="postcraft-section text-center">
        <div className="flex items-center justify-center mb-6">
          {overallStatus === 'operational' ? (
            <CheckCircle className="w-20 h-20 text-green-500" />
          ) : overallStatus === 'degraded' ? (
            <AlertTriangle className="w-20 h-20 text-yellow-500" />
          ) : (
            <WifiOff className="w-20 h-20 text-red-500" />
          )}
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4 capitalize">{overallStatus}</h2>

        <p className="text-gray-600">Last updated: {new Date().toLocaleString()}</p>
      </div>

      {/* Services Grid */}
      <div className="postcraft-section">
        <div className="postcraft-section-header">
          <h2>Service Status</h2>
          <p className="text-gray-600 mt-2">Individual service monitoring and management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => {
            const getStatusIcon = (status: string) => {
              switch (status) {
                case 'online':
                  return <Wifi className="w-5 h-5 text-green-600" />;
                case 'warning':
                  return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
                case 'offline':
                  return <WifiOff className="w-5 h-5 text-red-600" />;
                default:
                  return <Server className="w-5 h-5 text-gray-600" />;
              }
            };

            return (
              <div key={service.name} className="postcraft-card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-gray-600" />
                    {service.name}
                  </h3>

                  <div className="postcraft-status">
                    {getStatusIcon(service.status)}
                    <span className="uppercase text-xs">{service.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{service.uptime}</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{service.responseTime}</div>
                    <div className="text-sm text-gray-600">Response</div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  Last check: {new Date(service.lastCheck).toLocaleTimeString()}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestart(service.name)}
                    className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                      service.status === 'offline'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'postcraft-button'
                    }`}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Restart
                  </button>

                  <button
                    onClick={fetchSystemStatus}
                    className="postcraft-button flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Test
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
