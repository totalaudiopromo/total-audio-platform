'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  ListTodo,
  BarChart3,
  Link2,
  Settings,
  Users,
  FileDown,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export type DashboardSection =
  | 'overview'
  | 'campaigns'
  | 'analytics'
  | 'integrations'
  | 'settings';

interface DashboardSidebarProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
  stats?: {
    totalCampaigns: number;
    activeCampaigns: number;
    integrations: number;
  };
}

const sections = [
  {
    id: 'overview' as const,
    label: 'Overview',
    icon: LayoutDashboard,
    description: 'Stats & insights',
  },
  {
    id: 'campaigns' as const,
    label: 'Campaigns',
    icon: ListTodo,
    description: 'Manage campaigns',
  },
  {
    id: 'analytics' as const,
    label: 'Analytics',
    icon: BarChart3,
    description: 'Performance data',
  },
  {
    id: 'integrations' as const,
    label: 'Integrations',
    icon: Link2,
    description: 'Connected apps',
  },
  {
    id: 'settings' as const,
    label: 'Settings',
    icon: Settings,
    description: 'Preferences',
  },
];

export function DashboardSidebar({
  activeSection,
  onSectionChange,
  stats,
}: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`bg-white border-r-4 border-black flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b-2 border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-600" />
            <span className="font-black text-gray-900">Tracker</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {sections.map(section => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-teal-50 text-teal-700 border-2 border-teal-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-2 border-transparent'
              }`}
              title={isCollapsed ? section.label : undefined}
            >
              <Icon
                className={`h-5 w-5 flex-shrink-0 ${
                  isActive ? 'text-teal-600' : 'text-gray-400'
                }`}
              />
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <div className="font-bold text-sm">{section.label}</div>
                  <div className="text-xs text-gray-500">
                    {section.description}
                  </div>
                </div>
              )}
              {!isCollapsed && section.id === 'campaigns' && stats && (
                <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-bold rounded-full">
                  {stats.totalCampaigns}
                </span>
              )}
              {!isCollapsed && section.id === 'integrations' && stats && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                  {stats.integrations}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Stats (when expanded) */}
      {!isCollapsed && stats && (
        <div className="p-4 border-t-2 border-gray-200">
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-3 border-2 border-teal-100">
            <div className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">
              Quick Stats
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Active</span>
                <span className="text-xs font-black text-teal-600">
                  {stats.activeCampaigns}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Total</span>
                <span className="text-xs font-black text-gray-900">
                  {stats.totalCampaigns}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
