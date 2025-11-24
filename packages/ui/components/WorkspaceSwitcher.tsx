'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, Users, Building2, ChevronDown } from 'lucide-react';
import type { Workspace } from '@total-audio/core-db/contexts/workspace-context';

// ========================================
// Types
// ========================================

interface WorkspaceSwitcherProps {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  onWorkspaceChange: (workspace: Workspace) => void;
  className?: string;
  accentColor?: string; // Tool-specific accent color (e.g., "#2563EB" for Intel)
}

// ========================================
// Component
// ========================================

export function WorkspaceSwitcher({
  currentWorkspace,
  workspaces,
  onWorkspaceChange,
  className = '',
  accentColor = '#14B8A6', // Default Tracker teal
}: WorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  // Get workspace icon
  const getWorkspaceIcon = (workspace: Workspace) => {
    switch (workspace.workspace_type) {
      case 'personal':
        return User;
      case 'team':
        return Users;
      case 'agency':
        return Building2;
      default:
        return User;
    }
  };

  // Get plan badge color
  const getPlanBadgeColor = (planTier: string) => {
    switch (planTier.toLowerCase()) {
      case 'free':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'pro':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'agency':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (!currentWorkspace || workspaces.length === 0) {
    return (
      <div className={`px-3 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg ${className}`}>
        <span className="text-sm font-bold text-gray-500">No workspace</span>
      </div>
    );
  }

  const CurrentIcon = getWorkspaceIcon(currentWorkspace);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-black shadow-brutal rounded-lg hover:shadow-brutal-lg hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{ ['--tw-ring-color' as string]: accentColor }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {/* Workspace Icon */}
        <div
          className="w-8 h-8 rounded-md border-2 border-black flex items-center justify-center"
          style={{ backgroundColor: accentColor }}
        >
          <CurrentIcon className="w-4 h-4 text-white" />
        </div>

        {/* Workspace Name */}
        <div className="flex flex-col items-start min-w-0">
          <span className="text-sm font-black text-gray-900 truncate max-w-[120px] sm:max-w-[200px]">
            {currentWorkspace.name}
          </span>
          <span
            className={`text-xs font-bold px-1.5 py-0.5 rounded border ${getPlanBadgeColor(currentWorkspace.plan_tier)}`}
          >
            {currentWorkspace.plan_tier.toUpperCase()}
          </span>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-full min-w-[280px] bg-white border-2 border-black shadow-brutal rounded-lg overflow-hidden z-50"
          role="listbox"
        >
          <div className="py-1">
            {workspaces.map(workspace => {
              const Icon = getWorkspaceIcon(workspace);
              const isActive = workspace.id === currentWorkspace.id;

              return (
                <button
                  key={workspace.id}
                  onClick={() => {
                    onWorkspaceChange(workspace);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors ${
                    isActive ? 'bg-gray-100' : ''
                  }`}
                  role="option"
                  aria-selected={isActive}
                >
                  {/* Workspace Icon */}
                  <div
                    className={`w-10 h-10 rounded-md border-2 flex items-center justify-center ${
                      isActive ? 'border-black' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: isActive ? accentColor : '#F3F4F6' }}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  </div>

                  {/* Workspace Info */}
                  <div className="flex-1 flex flex-col items-start min-w-0">
                    <div className="flex items-center gap-2 w-full">
                      <span
                        className={`text-sm font-black truncate ${isActive ? 'text-gray-900' : 'text-gray-700'}`}
                      >
                        {workspace.name}
                      </span>
                      {isActive && (
                        <span
                          className="text-xs font-bold px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: accentColor, color: 'white' }}
                        >
                          ACTIVE
                        </span>
                      )}
                    </div>

                    {/* Plan Badge & Apps */}
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs font-bold px-1.5 py-0.5 rounded border ${getPlanBadgeColor(workspace.plan_tier)}`}
                      >
                        {workspace.plan_tier.toUpperCase()}
                      </span>
                      <span className="text-xs font-medium text-gray-500">
                        {workspace.apps_enabled?.length || 0} app
                        {workspace.apps_enabled?.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer (optional: Add workspace management link) */}
          <div className="border-t-2 border-gray-200 px-3 py-2 bg-gray-50">
            <button className="w-full text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors text-left">
              Manage Workspaces →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
