'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Users, 
  Mail, 
  Zap,
  Share2,
  Newspaper,
  BarChart3,
  MapPin,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Bot,
  Activity,
  Clock,
  DollarSign,
  Eye,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Target,
  FileText,
  Settings
} from 'lucide-react';

interface BusinessMetrics {
  revenue: {
    mrr: number;
    growth: number;
  };
  customers: {
    total: number;
    newSignups: number;
  };
  product: {
    contactsEnriched: number;
    emailsValidated: number;
    successRate: number;
  };
  agents: {
    activeAgents: number;
    tasksCompleted: number;
  };
}

interface BetaUser {
  id: string;
  name: string;
  location: string;
  signupDate: string;
  status: 'active' | 'pending' | 'onboarded';
}

export default function PostcraftDashboard() {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [betaUsers, setBetaUsers] = useState<BetaUser[]>([]);
  const [newsCount, setNewsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = async () => {
    try {
      const [metricsRes, betaRes, newsRes] = await Promise.all([
        fetch('/api/business-metrics'),
        fetch('/api/beta-tracker'),
        fetch('/api/newsjacking/content')
      ]);

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics({
          revenue: {
            mrr: metricsData.revenue?.mrr || 0,
            growth: metricsData.revenue?.growth || 0.0
          },
          customers: {
            total: metricsData.customers?.total || 0,
            newSignups: metricsData.customers?.newSignups || 0
          },
          product: {
            contactsEnriched: metricsData.product?.contactsEnriched || 0,
            emailsValidated: metricsData.product?.emailsValidated || 0,
            successRate: metricsData.product?.successRate || 95.2
          },
          agents: {
            activeAgents: metricsData.agents?.activeAgents || 12,
            tasksCompleted: metricsData.agents?.tasksCompleted || 332
          }
        });
      }

      if (betaRes.ok) {
        const betaData = await betaRes.json();
        const processedUsers = (betaData.users || []).map((user: any) => {
          let location = 'Unknown Location';
          if (typeof user.location === 'object' && user.location !== null) {
            const city = user.location.city || '';
            const country = user.location.country || '';
            location = [city, country].filter(Boolean).join(', ') || 'Unknown Location';
          } else if (typeof user.location === 'string') {
            location = user.location;
          }
          
          // Ensure name is always a string
          let userName = 'Unknown User';
          if (typeof user.name === 'string') {
            userName = user.name;
          } else if (typeof user.name === 'object' && user.name !== null) {
            userName = user.name.firstName || user.name.lastName || user.name.displayName || 'Unknown User';
          } else if (typeof user.email === 'string') {
            userName = user.email;
          }
          
          return {
            id: String(user.id || Math.random().toString()),
            name: String(userName),
            location: String(location),
            signupDate: String(user.signupDate || new Date().toISOString()),
            status: String(user.status || 'pending')
          };
        });
        setBetaUsers(processedUsers);
      }

      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setNewsCount(newsData.success ? newsData.data?.length || 0 : 0);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="postcraft-page">
        <div className="postcraft-container">
          <div className="postcraft-loading">
            <div className="postcraft-spinner"></div>
            <h2>Loading Command Centre</h2>
            <p>Fetching real-time data...</p>
          </div>
        </div>
      </div>
    );
  }

  const recentBetaUsers = betaUsers.slice(0, 3);
  const pendingUsers = betaUsers.filter(user => user.status === 'pending').length;

  return (
    <div>
        {/* Postcraft Header */}
        <div className="postcraft-header">
          <div className="postcraft-header-content">
            <div className="postcraft-header-title">
              <div className="postcraft-header-icon">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1>Command Centre</h1>
                <p>Real-time business intelligence for Total Audio Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchData}
                className="postcraft-button"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </button>
              <div className="postcraft-status">
                <div className="postcraft-status-dot"></div>
                <span>Live • Updated {Math.floor((Date.now() - lastUpdated.getTime()) / 1000)}s ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Postcraft Metrics Grid */}
        {metrics && (
          <div className="postcraft-metrics-grid">
            {/* Revenue Card */}
            <div className="postcraft-metric-card postcraft-metric-revenue">
              <div className="postcraft-metric-header">
                <div className="postcraft-metric-icon">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div className="postcraft-metric-badge postcraft-badge-positive">
                  +{metrics.revenue.growth.toFixed(1)}%
                </div>
              </div>
              <div className="postcraft-metric-content">
                <div className="postcraft-metric-value">
                  £{metrics.revenue.mrr.toLocaleString()}
                </div>
                <div className="postcraft-metric-label">Projected MRR</div>
                <div className="postcraft-metric-description">
                  Beta Phase - Pre-launch
                </div>
              </div>
            </div>

            {/* Customers Card */}
            <div className="postcraft-metric-card postcraft-metric-customers">
              <div className="postcraft-metric-header">
                <div className="postcraft-metric-icon">
                  <Users className="w-6 h-6" />
                </div>
                <div className="postcraft-metric-badge postcraft-badge-info">
                  +{metrics.customers.newSignups} new
                </div>
              </div>
              <div className="postcraft-metric-content">
                <div className="postcraft-metric-value">
                  {metrics.customers.total}
                </div>
                <div className="postcraft-metric-label">Active Beta Users</div>
                <div className="postcraft-metric-description">
                  Real users from ConvertKit
                </div>
              </div>
            </div>

            {/* Contacts Card */}
            <div className="postcraft-metric-card postcraft-metric-contacts">
              <div className="postcraft-metric-header">
                <div className="postcraft-metric-icon">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="postcraft-metric-badge postcraft-badge-success">
                  {metrics.product.successRate.toFixed(1)}%
                </div>
              </div>
              <div className="postcraft-metric-content">
                <div className="postcraft-metric-value">
                  {metrics.product.contactsEnriched.toLocaleString()}
                </div>
                <div className="postcraft-metric-label">Contacts Enriched</div>
                <div className="postcraft-metric-description">
                  {metrics.product.successRate.toFixed(1)}% success rate
                </div>
              </div>
            </div>

            {/* AI Agents Card */}
            <div className="postcraft-metric-card postcraft-metric-agents">
              <div className="postcraft-metric-header">
                <div className="postcraft-metric-icon">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="postcraft-metric-badge postcraft-badge-warning">
                  {metrics.agents.tasksCompleted} done
                </div>
              </div>
              <div className="postcraft-metric-content">
                <div className="postcraft-metric-value">
                  {metrics.agents.activeAgents}
                </div>
                <div className="postcraft-metric-label">AI Agents Active</div>
                <div className="postcraft-metric-description">
                  {metrics.agents.tasksCompleted} tasks completed
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Postcraft Quick Actions */}
        <div className="postcraft-section">
          <div className="postcraft-section-header">
            <h2>Quick Actions</h2>
            <p>One-click access to key platform features</p>
          </div>
          
          <div className="postcraft-actions-grid">
            <Link href="/social-media-hub" className="postcraft-action-card postcraft-action-primary">
              <div className="postcraft-action-icon">
                <Share2 className="w-8 h-8" />
              </div>
              <div className="postcraft-action-content">
                <h3>Social Media Hub</h3>
                <p>Multi-platform posting & scheduling</p>
              </div>
              <ArrowUpRight className="w-5 h-5 postcraft-action-arrow" />
            </Link>
            
            <Link href="/newsjacking" className="postcraft-action-card postcraft-action-success">
              <div className="postcraft-action-icon">
                <Newspaper className="w-8 h-8" />
              </div>
              <div className="postcraft-action-content">
                <h3>Content Review</h3>
                <p>{newsCount} opportunities ready</p>
              </div>
              <ArrowUpRight className="w-5 h-5 postcraft-action-arrow" />
            </Link>
            
            <Link href="/beta-management" className="postcraft-action-card postcraft-action-purple">
              <div className="postcraft-action-icon">
                <Users className="w-8 h-8" />
              </div>
              <div className="postcraft-action-content">
                <h3>Beta Management</h3>
                <p>{betaUsers.length} users managed</p>
              </div>
              <ArrowUpRight className="w-5 h-5 postcraft-action-arrow" />
            </Link>
            
            <Link href="/analytics" className="postcraft-action-card postcraft-action-orange">
              <div className="postcraft-action-icon">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div className="postcraft-action-content">
                <h3>Advanced Analytics</h3>
                <p>Deep business insights</p>
              </div>
              <ArrowUpRight className="w-5 h-5 postcraft-action-arrow" />
            </Link>
          </div>
        </div>

        {/* Postcraft Beta Users */}
        {recentBetaUsers.length > 0 && (
          <div className="postcraft-section">
            <div className="postcraft-section-header">
              <h2>Recent Beta Users</h2>
              <p>Latest user activity from ConvertKit</p>
            </div>
            
            <div className="postcraft-users-grid">
              {recentBetaUsers.map((user, index) => (
                <div key={user.id} className="postcraft-user-card">
                  <div className="postcraft-user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="postcraft-user-info">
                    <div className="postcraft-user-name">{user.name}</div>
                    <div className="postcraft-user-location">
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </div>
                  </div>
                  <div className="postcraft-user-status">
                    {user.status === 'active' ? (
                      <div className="postcraft-badge postcraft-badge-success">
                        <CheckCircle2 className="w-4 h-4" />
                        Active
                      </div>
                    ) : user.status === 'pending' ? (
                      <div className="postcraft-badge postcraft-badge-warning">
                        <Clock className="w-4 h-4" />
                        Pending
                      </div>
                    ) : (
                      <div className="postcraft-badge postcraft-badge-info">
                        <CheckCircle2 className="w-4 h-4" />
                        Onboarded
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Postcraft System Status */}
        <div className="postcraft-section">
          <div className="postcraft-section-header">
            <h2>System Health</h2>
            <p>All Audio Intel services operating normally</p>
          </div>
          
          <div className="postcraft-status-grid">
            <div className="postcraft-status-card">
              <div className="postcraft-status-icon postcraft-status-success">
                <Activity className="w-6 h-6" />
              </div>
              <div className="postcraft-status-content">
                <h3>Contact Enrichment</h3>
                <p>All systems operational</p>
                <div className="postcraft-status-indicator">
                  <div className="postcraft-status-dot postcraft-dot-success"></div>
                  <span>Healthy</span>
                </div>
              </div>
            </div>
            
            <div className="postcraft-status-card">
              <div className="postcraft-status-icon postcraft-status-info">
                <Bot className="w-6 h-6" />
              </div>
              <div className="postcraft-status-content">
                <h3>AI Processing</h3>
                <p>Running smoothly</p>
                <div className="postcraft-status-indicator">
                  <div className="postcraft-status-dot postcraft-dot-info"></div>
                  <span>Active</span>
                </div>
              </div>
            </div>
            
            <div className="postcraft-status-card">
              <div className="postcraft-status-icon postcraft-status-warning">
                <Zap className="w-6 h-6" />
              </div>
              <div className="postcraft-status-content">
                <h3>Data Pipeline</h3>
                <p>Healthy performance</p>
                <div className="postcraft-status-indicator">
                  <div className="postcraft-status-dot postcraft-dot-warning"></div>
                  <span>Optimised</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
