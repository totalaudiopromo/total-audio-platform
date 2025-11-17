/**
 * OperatorDock
 * Application launcher dock at bottom of screen
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Radio,
  Send,
  Target,
  Sparkles,
  Users,
  Zap,
  Workflow,
  GraduationCap,
  Film,
  Briefcase,
  BarChart3,
  Settings,
  Terminal,
} from 'lucide-react';
import { useOperatorStore } from '../state/operatorStore';
import { themes } from '../themes';
import { dockItemVariants } from '../utils/animations';
import type { OperatorAppID } from '../types';

const appIcons: Record<OperatorAppID, React.ComponentType<{ size?: number }>> = {
  dashboard: LayoutDashboard,
  intel: Radio,
  pitch: Send,
  tracker: Target,
  studio: Sparkles,
  community: Users,
  autopilot: Zap,
  automations: Workflow,
  coach: GraduationCap,
  scenes: Film,
  mig: Briefcase,
  anr: BarChart3,
  settings: Settings,
  terminal: Terminal,
};

export function OperatorDock() {
  const { activeTheme, dockApps, windows, openApp, focusWindow } = useOperatorStore();
  const theme = themes[activeTheme];

  const handleAppClick = (appId: OperatorAppID) => {
    // Check if window exists
    const existingWindow = windows.find(w => w.appId === appId);

    if (existingWindow) {
      if (existingWindow.isMinimised) {
        focusWindow(existingWindow.id);
      } else {
        focusWindow(existingWindow.id);
      }
    } else {
      openApp(appId);
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-20 flex items-center justify-center"
      style={{
        background: theme.dock.background,
        borderTop: `1px solid ${theme.dock.border}`,
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-end gap-3 px-6">
        {dockApps.map((appId) => {
          const Icon = appIcons[appId];
          const isOpen = windows.some(w => w.appId === appId);

          return (
            <motion.button
              key={appId}
              variants={dockItemVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleAppClick(appId)}
              className="relative flex flex-col items-center gap-1 p-3 rounded-lg transition-colors"
              style={{
                color: theme.text.primary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.dock.itemHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Icon size={28} />

              {/* Active indicator */}
              {isOpen && (
                <div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{
                    background: theme.accent,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
