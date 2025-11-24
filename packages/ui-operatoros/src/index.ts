/**
 * @total-audio/ui-operatoros
 *
 * OperatorOS Design System
 * For totalaud.io / OperatorOS ONLY
 *
 * Design principles:
 * - Cinematic, OS-like experience
 * - Multiple themes (xp, aqua, daw, ascii, analogue)
 * - Flow State aesthetics (matte, cyan accent, 240ms transitions)
 * - Window chrome, panels, toolbars
 * - Keyboard-first interaction design
 */

// Themes
export { themes, getTheme } from './themes';
export type { Theme, ThemeId } from './themes';

// Components
export { OperatorWindowChrome } from './components/OperatorWindowChrome';
export type { OperatorWindowChromeProps } from './components/OperatorWindowChrome';

export { OperatorPanel } from './components/OperatorPanel';
export type { OperatorPanelProps } from './components/OperatorPanel';

export { OperatorToolbar } from './components/OperatorToolbar';
export type { OperatorToolbarProps } from './components/OperatorToolbar';

export { OperatorBadge } from './components/OperatorBadge';
export type { OperatorBadgeProps } from './components/OperatorBadge';

export { OperatorListItem } from './components/OperatorListItem';
export type { OperatorListItemProps } from './components/OperatorListItem';

export { OperatorGrid } from './components/OperatorGrid';
export type { OperatorGridProps } from './components/OperatorGrid';

export { OperatorHotkeyHint } from './components/OperatorHotkeyHint';
export type { OperatorHotkeyHintProps } from './components/OperatorHotkeyHint';
