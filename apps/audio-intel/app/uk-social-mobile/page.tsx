'use client';

import React from 'react';
import UKSocialMediaHub from '../../components/UKSocialMediaHub';
import { ArrowLeft, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function UKSocialMobile() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Link
            href="/agent-dashboard"
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Command Centre
          </Link>
          <div className="flex items-center text-blue-600">
            <Smartphone className="w-5 h-5 mr-2" />
            <span className="font-semibold">UK Social</span>
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="p-4">
        <UKSocialMediaHub compact={false} />
      </div>

      {/* Mobile Footer */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 fixed bottom-0 left-0 right-0">
        <div className="text-center text-sm text-gray-500">
          Optimised for UK audiences • GMT times • One-click posting
        </div>
      </div>
    </div>
  );
}
