/**
 * Dropzone Type Definitions
 * Safe file processing types with kill-switch support
 */

/**
 * Supported dropzone types
 */
export type DropzoneType =
  | 'test-this'      // Test/QA files
  | 'deploy-this'    // Deployment files
  | 'review-this';   // Code review files

/**
 * Processing options
 */
export interface ProcessOptions {
  dryRun?: boolean;     // If true, log actions but don't execute
  verbose?: boolean;    // Enable detailed logging
}

/**
 * Processing result
 */
export interface ProcessResult {
  success: boolean;
  action?: string;      // Description of action taken
  message?: string;     // Success or error message
  filePath?: string;    // Path to processed file
}

/**
 * Approval options
 */
export interface ApprovalOptions {
  live?: boolean;       // If true, actually move files
  verbose?: boolean;    // Enable detailed logging
}

/**
 * Approval result
 */
export interface ApprovalResult {
  success: boolean;
  action?: string;      // Description of action taken
  message?: string;     // Success or error message
  from?: string;        // Source path
  to?: string;          // Destination path
}
