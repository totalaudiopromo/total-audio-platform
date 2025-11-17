/**
 * OperatorOS Package Entry Point
 * Exports all public components, hooks, and utilities
 */

// Components
export { OperatorDesktop } from './components/OperatorDesktop';
export { OperatorWindow } from './components/OperatorWindow';
export { OperatorDock } from './components/OperatorDock';
export { OperatorTopBar } from './components/OperatorTopBar';
export { OperatorCommandPalette } from './components/OperatorCommandPalette';
export { OperatorNotifications } from './components/OperatorNotifications';
export { OperatorStatusBar } from './components/OperatorStatusBar';
export { OperatorAppSwitcher } from './components/OperatorAppSwitcher';

// Hooks
export { useOperatorHotkeys } from './hooks/useOperatorHotkeys';
export { useWindowManager } from './hooks/useWindowManager';

// State
export { useOperatorStore } from './state/operatorStore';
export { useLayoutStore } from './state/layoutStore';
export { useThemeStore } from './state/themeStore';

// Themes
export { themes, xpTheme, aquaTheme, dawTheme, asciiTheme, analogueTheme } from './themes';

// Types
export type {
  OperatorOSTheme,
  OperatorAppID,
  OperatorPersona,
  OperatorWindow,
  OperatorNotification,
  OperatorState,
  ThemeTokens,
  OperatorCommand,
} from './types';

// Utils
export * from './utils/windowLayout';
export * from './utils/animations';
