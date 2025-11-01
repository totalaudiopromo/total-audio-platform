'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DashboardMetrics {
  beta_signups: number;
  email_subscribers: number;
  social_engagement: number;
  content_performance: number;
  conversion_rate: number;
  weekly_goals: {
    beta_signups: number;
    email_subscribers: number;
    social_engagement: number;
  };
}

interface SocialPost {
  platform: string;
  content: string;
  scheduled_time: string;
  status: 'draft' | 'scheduled' | 'posted';
  engagement: number;
}

export default function UserAcquisitionDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    beta_signups: 0,
    email_subscribers: 0,
    social_engagement: 0,
    content_performance: 0,
    conversion_rate: 0,
    weekly_goals: {
      beta_signups: 10,
      email_subscribers: 50,
      social_engagement: 100,
    },
  });

  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setIsLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data - in real implementation, fetch from APIs
      setMetrics({
        beta_signups: 23,
        email_subscribers: 127,
        social_engagement: 89,
        content_performance: 78,
        conversion_rate: 18.5,
        weekly_goals: {
          beta_signups: 10,
          email_subscribers: 50,
          social_engagement: 100,
        },
      });

      setSocialPosts([
        {
          platform: 'Twitter',
          content: '🎵 BREAKTHROUGH: I just automated radio contact research...',
          scheduled_time: '2024-01-15 09:00',
          status: 'posted',
          engagement: 45,
        },
        {
          platform: 'LinkedIn',
          content: 'The Hidden Cost of Manual Contact Research in Music Promotion...',
          scheduled_time: '2024-01-15 10:30',
          status: 'scheduled',
          engagement: 0,
        },
        {
          platform: 'Blue Sky',
          content: "Music industry professionals: What's your biggest time-waster...",
          scheduled_time: '2024-01-15 14:00',
          status: 'draft',
          engagement: 0,
        },
      ]);

      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted':
        return 'bg-green-500';
      case 'scheduled':
        return 'bg-blue-500';
      case 'draft':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Acquisition Dashboard</h1>
          <p className="text-gray-600">
            Track your progress towards acquiring 50+ beta users for Audio Intel
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Beta Signups</CardTitle>
              <Badge variant="outline">{metrics.beta_signups}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.beta_signups}</div>
              <div className="flex items-center mt-2">
                <Progress
                  value={getProgressPercentage(
                    metrics.beta_signups,
                    metrics.weekly_goals.beta_signups
                  )}
                  className="flex-1 mr-2"
                />
                <span className="text-sm text-gray-500">
                  {metrics.weekly_goals.beta_signups} goal
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email Subscribers</CardTitle>
              <Badge variant="outline">{metrics.email_subscribers}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.email_subscribers}</div>
              <div className="flex items-center mt-2">
                <Progress
                  value={getProgressPercentage(
                    metrics.email_subscribers,
                    metrics.weekly_goals.email_subscribers
                  )}
                  className="flex-1 mr-2"
                />
                <span className="text-sm text-gray-500">
                  {metrics.weekly_goals.email_subscribers} goal
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Social Engagement</CardTitle>
              <Badge variant="outline">{metrics.social_engagement}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.social_engagement}</div>
              <div className="flex items-center mt-2">
                <Progress
                  value={getProgressPercentage(
                    metrics.social_engagement,
                    metrics.weekly_goals.social_engagement
                  )}
                  className="flex-1 mr-2"
                />
                <span className="text-sm text-gray-500">
                  {metrics.weekly_goals.social_engagement} goal
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Badge variant="outline">{metrics.conversion_rate}%</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conversion_rate}%</div>
              <p className="text-xs text-gray-500 mt-1">Beta signup to paid conversion</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Management */}
        <Tabs defaultValue="social" className="space-y-6">
          <TabsList>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="content">Content Calendar</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Posts</CardTitle>
                <CardDescription>
                  Manage your social media content across all platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {socialPosts.map((post, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{post.platform}</Badge>
                          <div
                            className={`w-2 h-2 rounded-full ${getStatusColor(post.status)}`}
                          ></div>
                          <span className="text-sm text-gray-500">{post.status}</span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {post.scheduled_time} • {post.engagement} engagements
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Calendar</CardTitle>
                <CardDescription>Plan and schedule your content for maximum impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Content calendar coming soon</p>
                  <Button>Create New Content</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Track what's working and optimize your strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Analytics dashboard coming soon</p>
                  <Button>View Detailed Analytics</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Take immediate action to drive user acquisition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center">
                <span className="text-lg mb-1">📱</span>
                <span>Post to Social</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center">
                <span className="text-lg mb-1">📧</span>
                <span>Send Newsletter</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center">
                <span className="text-lg mb-1">📊</span>
                <span>View Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
