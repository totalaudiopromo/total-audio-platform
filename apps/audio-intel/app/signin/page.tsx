import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sign In | Audio Intel",
  description: "Sign in to your Audio Intel account to access contact enrichment tools and analytics.",
};

export default function SignIn() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="/images/total_audio_promo_logo_trans.png" 
              alt="Total Audio Promo Logo" 
              className="w-12 h-12"
            />
            <span className="text-2xl font-black text-gray-900">Audio Intel</span>
          </Link>
        </div>

        {/* Sign In Card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your Audio Intel account</p>
          </div>

          {/* Beta Access Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">β</span>
              </div>
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Beta Access</h3>
                <p className="text-sm text-blue-800 mb-4">
                  Audio Intel is currently in free beta. If you've signed up for beta access, 
                  you can start using the platform immediately - no login required!
                </p>
                <Link href="/demo">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                    Try Audio Intel Beta →
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Future Authentication Notice */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-gray-900 mb-2">🚀 Coming Soon</h4>
            <p className="text-sm text-gray-600 mb-3">
              Full user accounts with saved projects, history, and advanced features are coming soon.
            </p>
            <Link href="/beta">
              <Button variant="outline" size="sm" className="font-semibold">
                Join Beta List
              </Button>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Link href="/demo" className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Upload & Enrich Contacts
              </Button>
            </Link>
            <Link href="/demo" className="block">
              <Button variant="outline" className="w-full font-semibold">
                View Live Demo
              </Button>
            </Link>
            <Link href="/blog" className="block">
              <Button variant="ghost" className="w-full font-semibold text-gray-600">
                Read Industry Guides
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-gray-600">
            Need help? <a href="mailto:chris@totalaudiopromo.com" className="text-blue-600 hover:text-blue-700 font-semibold">Contact Support</a>
          </p>
          <p className="text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-700">Home</Link> • 
            <Link href="/pricing" className="hover:text-gray-700 ml-1">Pricing</Link> • 
            <Link href="/blog" className="hover:text-gray-700 ml-1">Blog</Link>
          </p>
        </div>
      </div>
    </div>
  );
}