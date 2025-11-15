/**
 * @total-audio/ui - Shared UI components for Total Audio Promo platform
 *
 * This package provides shared React components and Tailwind configuration
 * for the Total Audio Promo platform brutalist design system.
 *
 * Usage:
 *   import { SiteHeader, SiteFooter, ToolSwitcher } from '@total-audio/ui'
 *   import { getBrandConfig } from '@total-audio/ui/tailwind-brand'
 */

export { SiteHeader } from './components/SiteHeader';
export { SiteFooter } from './components/SiteFooter';
export { ToolSwitcher } from './components/ToolSwitcher';
export { FeedbackButton } from './src/components/FeedbackButton';
export { ErrorBoundary, AsyncErrorBoundary } from './src/components/ErrorBoundary';
export { Toast } from './src/components/Toast';
export { ToastContainer } from './src/components/ToastContainer';
export { useToast } from './src/hooks/useToast';

export type { ToastProps, ToastType } from './src/components/Toast';
export type { ErrorBoundaryProps } from './src/components/ErrorBoundary';
export type { UseToastOptions, ShowToastOptions } from './src/hooks/useToast';

// Type exports available directly from component files:
// import type { SiteHeaderProps, SiteHeaderLink } from '@total-audio/ui/SiteHeader';
// import type { SiteFooterProps, SiteFooterLink } from '@total-audio/ui/SiteFooter';
// import type { ToolSwitcherProps } from '@total-audio/ui/ToolSwitcher';
// import type { FeedbackButtonProps } from '@total-audio/ui/src/components/FeedbackButton';
// import type { ErrorBoundaryProps } from '@total-audio/ui';
// import type { ToastProps } from '@total-audio/ui';
