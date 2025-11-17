/**
 * OperatorDesktop
 * Main desktop environment component
 */

'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useOperatorStore } from '../state/operatorStore';
import { useOperatorHotkeys } from '../hooks/useOperatorHotkeys';
import { themes } from '../themes';
import { OperatorWindow } from './OperatorWindow';
import { OperatorDock } from './OperatorDock';
import { OperatorTopBar } from './OperatorTopBar';
import { OperatorCommandPalette } from './OperatorCommandPalette';
import { OperatorNotifications } from './OperatorNotifications';
import { OperatorStatusBar } from './OperatorStatusBar';

export function OperatorDesktop() {
  const { activeTheme, windows, focusedWindowId } = useOperatorStore();

  // Initialize hotkeys
  useOperatorHotkeys();

  const theme = themes[activeTheme];

  return (
    <div
      className="fixed inset-0 overflow-hidden font-['Inter']"
      style={{
        background: theme.background,
        transition: 'background 0.5s ease-out',
      }}
      onClick={() => {
        // Click on wallpaper clears selection
        if (focusedWindowId) {
          // Note: This would ideally unfocus all windows, but we'll leave focus management to window clicks
        }
      }}
    >
      {/* Background noise/texture for certain themes */}
      {theme.noise && (
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: theme.noise,
          }}
        />
      )}

      {/* Top Bar */}
      <OperatorTopBar />

      {/* Windows Layer */}
      <div className="absolute inset-0 top-[60px] bottom-[80px]">
        <AnimatePresence>
          {windows
            .filter(w => !w.isMinimised)
            .map(window => (
              <OperatorWindow key={window.id} window={window} />
            ))}
        </AnimatePresence>
      </div>

      {/* Dock */}
      <OperatorDock />

      {/* Status Bar */}
      <OperatorStatusBar />

      {/* Command Palette */}
      <OperatorCommandPalette />

      {/* Notifications */}
      <OperatorNotifications />
    </div>
  );
}
