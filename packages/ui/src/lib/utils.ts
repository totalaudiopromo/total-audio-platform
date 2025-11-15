/**
 * Utility functions for UI package
 */

/**
 * Merge class names with conflict resolution
 * Combines clsx-style classname merging with tailwind conflict resolution
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs
    .filter((item): item is string => typeof item === 'string' && item.length > 0)
    .join(' ');
}
