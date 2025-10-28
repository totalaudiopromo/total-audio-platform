'use client';

import React from 'react';
import TeamManagement from '@/components/teams/TeamManagement';
import TeamSettings from '@/components/teams/TeamSettings';

export default function TeamPage() {
  const [activeTab, setActiveTab] = React.useState<'members' | 'settings'>('members');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#14B8A6]/5 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b-4 border-black shadow-brutal">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-black text-gray-900 mb-4">Team & Agency Settings</h1>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('members')}
              className={`px-6 py-3 rounded-xl font-black border-2 border-black transition-all ${
                activeTab === 'members'
                  ? 'bg-[#14B8A6] text-white shadow-brutal'
                  : 'bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              Team Members
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 rounded-xl font-black border-2 border-black transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#14B8A6] text-white shadow-brutal'
                  : 'bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              White-Label Settings
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'members' ? <TeamManagement /> : <TeamSettings />}
      </div>
    </div>
  );
}
