'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import Link from 'next/link'
import { UserMenu } from '@/components/auth/UserMenu'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Not Signed In</h2>
          <p className="text-gray-600 mb-6">Please sign in to access your dashboard.</p>
          <Link 
            href="/signin"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'there'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with User Menu */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audio Intel</h1>
            <p className="text-sm text-gray-600">Contact Enrichment Dashboard</p>
          </div>
          <UserMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {displayName}! 👋
          </h2>
          <p className="text-lg text-gray-600">
            You're successfully signed in. Here's what you can do:
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Demo Card */}
          <Link href="/demo" className="group">
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <span className="text-blue-600 font-medium">Try Now →</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Try Contact Enrichment
              </h3>
              <p className="text-gray-600">
                Upload a CSV or paste contact names to see AI-powered enrichment in action
              </p>
            </div>
          </Link>

          {/* Pricing Card */}
          <Link href="/pricing" className="group">
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-purple-500 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💎</span>
                </div>
                <span className="text-purple-600 font-medium">View Plans →</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Upgrade Your Plan
              </h3>
              <p className="text-gray-600">
                Get unlimited enrichments and advanced features with Pro or Agency plans
              </p>
            </div>
          </Link>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-600">Email:</span>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Plan:</span>
              <p className="text-gray-900">Free (10 enrichments/month)</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Member Since:</span>
              <p className="text-gray-900">
                {new Date(user.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Auth Success Message */}
        <div className="mt-8 bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h4 className="font-bold text-green-900 mb-1">Authentication Working!</h4>
              <p className="text-green-700">
                Your unified authentication is now active. You can sign in once and access all Total Audio tools.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
