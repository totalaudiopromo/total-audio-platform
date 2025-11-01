'use client';

import React from 'react';
import {
  ArrowLeft,
  Upload,
  Users,
  BarChart,
  Settings,
  LogOut,
  Music,
  Target,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const handleSignOut = () => {
    // In a real app, you would handle sign out logic here
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-xl font-black text-gray-900">Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black mb-8">
            <div className="text-center">
              <h2 className="text-3xl font-black text-gray-900 mb-4">Welcome to Playlist Pulse!</h2>
              <p className="text-gray-600 font-bold mb-6">
                Ready to get your music heard by the right people?
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 rounded-lg transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
              >
                <Upload className="w-5 h-5" />
                Upload Your First Track
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black text-center">
              <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Music className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">0</h3>
              <p className="text-gray-600 font-bold">Tracks Uploaded</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">0</h3>
              <p className="text-gray-600 font-bold">Curators Contacted</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <BarChart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">0%</h3>
              <p className="text-gray-600 font-bold">Response Rate</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-yellow-100 rounded-full p-3">
                  <Upload className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Upload New Track</h3>
                  <p className="text-gray-600 font-bold">Get matched with curators instantly</p>
                </div>
              </div>
              <Link
                href="/upload"
                className="block w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg text-center transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
              >
                Start Upload
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Browse Curators</h3>
                  <p className="text-gray-600 font-bold">Explore our curator database</p>
                </div>
              </div>
              <button className="block w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-3 rounded-lg transition-colors">
                Coming Soon
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Recent Activity</h3>
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-bold text-gray-600 mb-2">No activity yet</h4>
              <p className="text-gray-500 font-bold">
                Upload your first track to see your activity here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
