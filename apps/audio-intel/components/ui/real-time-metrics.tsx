'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Zap,
  Clock,
  TrendingUp,
  Globe,
  Music,
  Radio,
  Newspaper,
  CheckCircle,
} from 'lucide-react';

interface MetricUpdate {
  id: string;
  type: 'contact_enriched' | 'campaign_started' | 'contact_discovered' | 'email_validated';
  timestamp: Date;
  data: {
    contact?: string;
    platform?: string;
    genre?: string;
    location?: string;
    confidence?: number;
  };
}

interface LiveMetric {
  label: string;
  value: number;
  change: string;
  icon: any;
  color: string;
}

export function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<LiveMetric[]>([
    {
      label: 'Contacts Enriched Today',
      value: 1247,
      change: '+23 in last hour',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      label: 'Active Campaigns',
      value: 89,
      change: '+12 this week',
      icon: Zap,
      color: 'text-green-600',
    },
    {
      label: 'Avg Processing Time',
      value: 4.2,
      change: '-0.8s vs yesterday',
      icon: Clock,
      color: 'text-blue-600',
    },
    {
      label: 'Success Rate',
      value: 94,
      change: '+2.1% this month',
      icon: TrendingUp,
      color: 'text-yellow-600',
    },
  ]);

  const [recentActivity, setRecentActivity] = useState<MetricUpdate[]>([
    {
      id: '1',
      type: 'contact_enriched',
      timestamp: new Date(Date.now() - 2 * 1000),
      data: {
        contact: 'BBC Radio 1 Music Team',
        platform: 'BBC Radio 1 | Contact via website form',
        genre: 'Electronic',
        confidence: 95,
      },
    },
    {
      id: '2',
      type: 'campaign_started',
      timestamp: new Date(Date.now() - 8 * 1000),
      data: {
        contact: 'SADACT - Brighton Electronic Producer',
        platform: 'Multi-platform radio campaign',
      },
    },
    {
      id: '3',
      type: 'contact_discovered',
      timestamp: new Date(Date.now() - 15 * 1000),
      data: {
        contact: 'NME Editorial Team',
        platform: 'NME | Submit via NME.com/submit',
        genre: 'Alternative Rock',
        confidence: 88,
      },
    },
    {
      id: '4',
      type: 'email_validated',
      timestamp: new Date(Date.now() - 23 * 1000),
      data: {
        contact: 'Spotify Editorial Team',
        platform: 'Spotify for Artists | Pitch via dashboard',
        confidence: 92,
      },
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics periodically
      setMetrics(prev =>
        prev.map(metric => ({
          ...metric,
          value:
            metric.label === 'Contacts Enriched Today'
              ? metric.value + Math.floor(Math.random() * 3)
              : metric.value,
        }))
      );

      // Add new activity periodically
      if (Math.random() > 0.7) {
        const newActivity: MetricUpdate = {
          id: Math.random().toString(36).substr(2, 9),
          type: ['contact_enriched', 'email_validated', 'contact_discovered'][
            Math.floor(Math.random() * 3)
          ] as any,
          timestamp: new Date(),
          data: {
            contact: [
              'Pitchfork Editorial Team',
              'Apple Music Editorial',
              'Kiss FM Music Team',
              'Resident Advisor Contributors',
              'Tidal Editorial Team',
              'Radio 1Xtra Music Team',
              'Mixmag Editorial Team',
            ][Math.floor(Math.random() * 7)],
            platform: [
              'Pitchfork | Submit via pitchfork.com/contact',
              'Apple Music | Pitch via Apple Music for Artists',
              'Kiss FM | Contact via kissfm.co.uk/music',
              'Resident Advisor | Submit via residentadvisor.net/contact',
              'Tidal | Editorial team contact via support',
              'BBC Radio 1Xtra | Submit via BBC Music website',
              'Mixmag | Editorial submissions via website',
            ][Math.floor(Math.random() * 7)],
            confidence: 85 + Math.floor(Math.random() * 15),
          },
        };

        setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contact_enriched':
        return <Users className="w-4 h-4" />;
      case 'campaign_started':
        return <Zap className="w-4 h-4" />;
      case 'contact_discovered':
        return <Globe className="w-4 h-4" />;
      case 'email_validated':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Music className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'contact_enriched':
        return 'bg-blue-500';
      case 'campaign_started':
        return 'bg-green-500';
      case 'contact_discovered':
        return 'bg-blue-500';
      case 'email_validated':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'contact_enriched':
        return 'Contact Enriched';
      case 'campaign_started':
        return 'Campaign Started';
      case 'contact_discovered':
        return 'Contact Discovered';
      case 'email_validated':
        return 'Email Validated';
      default:
        return 'Activity';
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <Card
            key={index}
            className="bg-white border-2 border-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <metric.icon className={`w-6 h-6 md:w-8 md:h-8 ${metric.color}`} />
                <Badge variant="secondary" className="text-xs font-bold">
                  LIVE
                </Badge>
              </div>
              <div className="text-2xl md:text-3xl font-black text-gray-900 mb-1 md:mb-2">
                {metric.label.includes('Time')
                  ? `${metric.value}s`
                  : metric.label.includes('Rate')
                    ? `${metric.value}%`
                    : metric.value.toLocaleString()}
              </div>
              <p className="text-xs md:text-sm font-bold text-gray-600 break-words">
                {metric.label}
              </p>
              <p className="text-xs font-medium text-green-600 mt-1">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Activity Feed */}
      <Card className="bg-white border-2 border-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="pb-3 md:pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg md:text-xl font-black text-gray-900">
              Live Activity
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-green-600">REAL-TIME</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 md:space-y-3 max-h-80 md:max-h-96 overflow-y-auto">
          {recentActivity.map(activity => (
            <div
              key={activity.id}
              className="flex items-start gap-2 md:gap-3 p-2 md:p-3 rounded-lg bg-gray-50"
            >
              <div
                className={`w-6 h-6 md:w-8 md:h-8 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center text-white flex-shrink-0`}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-bold text-gray-900">
                  {getActivityLabel(activity.type)}
                </p>
                <p className="text-xs md:text-sm text-gray-600 break-words">
                  {activity.data.contact}
                </p>
                {activity.data.platform && (
                  <p className="text-xs text-blue-600 font-medium break-words">
                    {activity.data.platform}
                  </p>
                )}
                {activity.data.confidence && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    {activity.data.confidence}% confidence
                  </Badge>
                )}
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                {Math.floor((Date.now() - activity.timestamp.getTime()) / 1000)}s ago
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
