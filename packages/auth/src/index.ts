/**
 * Total Audio Authentication Package
 * Shared authentication utilities for all Total Audio apps
 */

// Client utilities
export { createClient as createBrowserClient, resetClient } from './client'

// Server utilities
export {
  createClient as createServerClient,
  getCurrentUser,
  getUserProfile,
  checkAppAccess,
} from './server'

// Middleware
export { createMiddleware, authMiddleware } from './middleware'
export type { MiddlewareConfig } from './middleware'

// TypeScript types
export * from './types'
export type { Database } from './types/database'

// React hooks
export * from './hooks'

// Utility functions
export * from './utils'
