// User-friendly error messages and guidance
export interface ErrorContext {
  operation: 'upload' | 'enrichment' | 'export' | 'validation' | 'api';
  errorType: string;
  details?: any;
}

export function getUserFriendlyError(context: ErrorContext): {
  title: string;
  message: string;
  suggestions: string[];
  actionText?: string;
  actionUrl?: string;
} {
  const { operation, errorType, details } = context;

  // Upload errors
  if (operation === 'upload') {
    switch (errorType) {
      case 'FILE_TOO_LARGE':
        return {
          title: 'File Too Large',
          message: 'Your file is too big to process. Please try a smaller file.',
          suggestions: [
            'Split your contacts into smaller files (max 1000 contacts per file)',
            'Remove any unnecessary columns to reduce file size',
            'Try saving as CSV instead of Excel if you\'re using .xlsx'
          ],
          actionText: 'Upload Guidelines',
          actionUrl: '/documentation#upload-limits'
        };
      
      case 'INVALID_FORMAT':
        return {
          title: 'Invalid File Format',
          message: 'We couldn\'t read your file. Please check the format.',
          suggestions: [
            'Make sure your file is CSV, Excel (.xlsx), or plain text',
            'Check that your file isn\'t corrupted',
            'Try opening the file in Excel and saving as CSV'
          ],
          actionText: 'Supported Formats',
          actionUrl: '/documentation#supported-formats'
        };
      
      case 'NO_EMAILS_FOUND':
        return {
          title: 'No Email Addresses Found',
          message: 'We couldn\'t find any valid email addresses in your file.',
          suggestions: [
            'Make sure your file has a column with email addresses',
            'Check that email addresses are in a column named "email" or "Email"',
            'Verify that email addresses are properly formatted'
          ],
          actionText: 'File Format Guide',
          actionUrl: '/documentation#file-format'
        };
      
      case 'PARSE_ERROR':
        return {
          title: 'File Parsing Error',
          message: 'We had trouble reading your file. This usually means the format isn\'t quite right.',
          suggestions: [
            'Try saving your file as CSV with comma separators',
            'Make sure there are no special characters in headers',
            'Check that all rows have the same number of columns'
          ],
          actionText: 'Fix Your File',
          actionUrl: '/documentation#troubleshooting'
        };
    }
  }

  // Enrichment errors
  if (operation === 'enrichment') {
    switch (errorType) {
      case 'API_ERROR':
        return {
          title: 'Enrichment Service Temporarily Unavailable',
          message: 'Our AI enrichment service is having issues. Don\'t worry, your file is safe.',
          suggestions: [
            'Try again in a few minutes - this usually fixes itself',
            'Check our status page for service updates',
            'Contact support if the problem persists'
          ],
          actionText: 'Try Again',
          actionUrl: undefined
        };
      
      case 'RATE_LIMITED':
        return {
          title: 'Too Many Requests',
          message: 'You\'re processing contacts too quickly. Please slow down a bit.',
          suggestions: [
            'Wait 30 seconds before trying again',
            'Try processing smaller batches (max 50 contacts at once)',
            'Consider upgrading to Professional for faster processing'
          ],
          actionText: 'Upgrade for Faster Processing',
          actionUrl: '/pricing'
        };
      
      case 'INVALID_EMAILS':
        return {
          title: 'Invalid Email Addresses',
          message: 'Some email addresses in your file aren\'t valid.',
          suggestions: [
            'Check for typos in email addresses',
            'Remove any test or placeholder emails',
            'Use our email validation tool to clean your list first'
          ],
          actionText: 'Validate Emails First',
          actionUrl: '/email-validation'
        };
    }
  }

  // Export errors
  if (operation === 'export') {
    switch (errorType) {
      case 'EXPORT_FAILED':
        return {
          title: 'Export Failed',
          message: 'We couldn\'t create your export file. This is usually temporary.',
          suggestions: [
            'Try exporting again in a few moments',
            'Check that you have enough disk space',
            'Try a different export format (CSV instead of Excel)'
          ],
          actionText: 'Try Again',
          actionUrl: undefined
        };
      
      case 'FILE_TOO_LARGE_EXPORT':
        return {
          title: 'Export Too Large',
          message: 'Your enriched data is too big to export in this format.',
          suggestions: [
            'Try exporting as CSV instead of Excel',
            'Split your contacts into smaller batches',
            'Contact support for large file exports'
          ],
          actionText: 'Contact Support',
          actionUrl: 'mailto:support@totalaudiopromo.com'
        };
    }
  }

  // API errors
  if (operation === 'api') {
    switch (errorType) {
      case 'NETWORK_ERROR':
        return {
          title: 'Connection Problem',
          message: 'We can\'t connect to our servers right now. Check your internet connection.',
          suggestions: [
            'Check your internet connection',
            'Try refreshing the page',
            'Disable any VPN or proxy that might be blocking the connection'
          ],
          actionText: 'Refresh Page',
          actionUrl: undefined
        };
      
      case 'SERVER_ERROR':
        return {
          title: 'Server Error',
          message: 'Something went wrong on our end. We\'re working to fix it.',
          suggestions: [
            'Try again in a few minutes',
            'Check our status page for updates',
            'Contact support if the problem continues'
          ],
          actionText: 'Check Status',
          actionUrl: '/status'
        };
    }
  }

  // Default error
  return {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. We\'re sorry for the inconvenience.',
    suggestions: [
      'Try refreshing the page and starting over',
      'Check that all your information is correct',
      'Contact support if the problem persists'
    ],
    actionText: 'Contact Support',
    actionUrl: 'mailto:support@totalaudiopromo.com'
  };
}

// Error message components for React - moved to separate component file
// This file now only contains the error message logic and data
