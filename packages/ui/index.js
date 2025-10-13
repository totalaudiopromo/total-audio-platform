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

export { SiteHeader } from './components/SiteHeader.tsx';
export { SiteFooter } from './components/SiteFooter.tsx';
export { ToolSwitcher } from './components/ToolSwitcher.tsx';

export type { SiteHeaderProps, SiteHeaderLink } from './components/SiteHeader.tsx';
export type { SiteFooterProps, SiteFooterLink } from './components/SiteFooter.tsx';
export type { ToolSwitcherProps } from './components/ToolSwitcher.tsx';
