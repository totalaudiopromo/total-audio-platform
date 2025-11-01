'use client';

import React from 'react';
import SocialMediaScheduler from '../../components/SocialMediaScheduler';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Share2, Clock, CheckCircle, BarChart3 } from 'lucide-react';

export default function SocialMediaDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📱 Social Media Scheduler Interface
          </h1>
          <p className="text-gray-600">Your complete social media automation command center</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">1</div>
                  <div className="text-sm text-gray-600">Scheduled Posts</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-sm text-gray-600">Platforms</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <div className="text-sm text-gray-600">Performance</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-600">Posted Today</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Media Scheduler Component */}
        <SocialMediaScheduler />

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🚀 How to Use</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">1. Add Content to Notion</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Write your social media posts in your Notion workspace. The system will
                  automatically detect and sync content.
                </p>

                <h3 className="font-semibold mb-2">2. Review Scheduled Posts</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Check the "Upcoming Posts" section to see what's scheduled and when it will be
                  posted.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Manual Posting</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Use the "Post Now" button to manually trigger posts or adjust timing as needed.
                </p>

                <h3 className="font-semibold mb-2">4. Track Performance</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Monitor engagement metrics and posting consistency in the "Recent Posts" section.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
