/**
 * Next.js Instrumentation File
 *
 * This file runs before any other code in the application.
 * We use it to fix Node.js 25+ compatibility issues with localStorage.
 *
 * Problem: Node.js 25+ ships with experimental localStorage API that Supabase
 * libraries detect and try to use, but it doesn't work like browser localStorage.
 * This causes "localStorage.getItem is not a function" errors during SSR.
 *
 * Solution: Delete the broken localStorage from globalThis during SSR, so libraries
 * fall back to their SSR-safe code paths.
 */
export async function register() {
  // Only run on server-side
  if (typeof window === 'undefined') {
    // Check if localStorage exists but is broken (Node.js 25+ experimental API)
    // @ts-ignore - accessing globalThis.localStorage
    if (typeof globalThis.localStorage !== 'undefined') {
      // @ts-ignore - accessing globalThis.localStorage
      if (typeof globalThis.localStorage.getItem !== 'function') {
        console.log(
          '[instrumentation] Removing broken Node.js experimental localStorage to fix SSR compatibility'
        );
        // @ts-ignore - deleting globalThis.localStorage
        delete globalThis.localStorage;
      }
    }
  }
}
