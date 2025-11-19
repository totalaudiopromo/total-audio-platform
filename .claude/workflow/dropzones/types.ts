/**
 * Dropzone workflow types
 */

export interface DropzoneOptions {
  /**
   * Dry-run mode - log actions without executing them
   * @default true
   */
  dryRun?: boolean;

  /**
   * Verbose logging
   * @default false
   */
  verbose?: boolean;
}

export interface DropzoneConfig {
  enabled: boolean;
  paths: {
    'contacts-to-enrich': string;
    'test-this': string;
    'review-this': string;
    'changelog-from-commits': string;
  };
}

export type DropzoneType =
  | 'contacts-to-enrich'
  | 'test-this'
  | 'review-this'
  | 'changelog-from-commits';

export interface ProcessResult {
  success: boolean;
  file: string;
  dropzone: DropzoneType;
  action: 'processed' | 'failed' | 'skipped';
  message?: string;
}
