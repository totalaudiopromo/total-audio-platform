'use client';

import { ShieldCheck, Users, AlertCircle } from 'lucide-react';

export default function BetaManagementPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-black text-gray-900">Beta Management</h2>
        </div>
        <p className="text-sm text-gray-600">Manage beta users and feature access</p>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-yellow-50 border-2 border-yellow-600 rounded-lg p-8 text-center">
        <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
        <h3 className="text-lg font-black text-gray-900 mb-2">Beta Management UI Coming Soon</h3>
        <p className="text-sm text-gray-600 mb-4">
          This page will be migrated from existing Command Centre beta management tools
        </p>
        <p className="text-xs text-gray-500">Phase 9D - Week 2</p>
      </div>

      {/* Placeholder Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-gray-600 uppercase">Beta Users</span>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-gray-900">—</div>
        </div>
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-gray-600 uppercase">Active Features</span>
            <ShieldCheck className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-black text-gray-900">—</div>
        </div>
        <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-gray-600 uppercase">Usage Limits</span>
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="text-3xl font-black text-gray-900">—</div>
        </div>
      </div>
    </div>
  );
}
