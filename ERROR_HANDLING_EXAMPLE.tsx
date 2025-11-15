/**
 * Error Handling Implementation Example
 *
 * Shows how to integrate error handling into Audio Intel components
 * for Liberty Music PR pitch readiness.
 *
 * Usage:
 * 1. Copy to apps/audio-intel/app/demo-error-handling/page.tsx
 * 2. Import and use in your components
 * 3. Replace with actual component logic
 */

'use client';

import { useState } from 'react';
import { ErrorBoundary, useToast, ToastContainer } from '@total-audio/ui';
import { ErrorLogger } from '@total-audio/core-db';

/**
 * Component demonstrating error boundary usage
 */
function DemoErrorBoundaryContent() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('Demonstration error for error boundary testing');
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Error Boundary Demo</h2>
      <p className="text-gray-600">Click the button below to trigger an error:</p>
      <button
        onClick={() => setShouldError(true)}
        className="px-4 py-2 bg-red-500 text-white rounded border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
      >
        Trigger Error
      </button>
    </div>
  );
}

/**
 * Component demonstrating toast notifications
 */
function DemoToastContent() {
  const { success, error, warning, info } = useToast();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Toast Notification Demo</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() =>
            success({
              title: 'Contact enriched',
              message: 'Contact details added successfully!',
              duration: 3000,
            })
          }
          className="px-4 py-2 bg-green-500 text-white rounded border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        >
          Success
        </button>
        <button
          onClick={() =>
            error({
              title: 'Enrichment failed',
              message: 'Unable to fetch contact details. Please try again.',
              duration: 5000,
            })
          }
          className="px-4 py-2 bg-red-500 text-white rounded border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        >
          Error
        </button>
        <button
          onClick={() =>
            warning({
              title: 'Warning',
              message: 'Contact already exists in your database',
              duration: 5000,
            })
          }
          className="px-4 py-2 bg-amber-500 text-white rounded border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        >
          Warning
        </button>
        <button
          onClick={() =>
            info({
              title: 'Info',
              message: 'Check your email for confirmation',
              duration: 5000,
            })
          }
          className="px-4 py-2 bg-blue-500 text-white rounded border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        >
          Info
        </button>
      </div>
    </div>
  );
}

/**
 * Component demonstrating error logging
 */
function DemoErrorLogging() {
  const { success, error } = useToast();
  const errorLogger = new ErrorLogger({
    isDevelopment: process.env.NODE_ENV === 'development',
    workspaceId: 'demo-workspace',
  });

  const handleNetworkError = () => {
    const testError = new Error('Failed to fetch contacts from server');
    errorLogger.logNetworkError(testError, {
      url: '/api/contacts/enrich',
      method: 'POST',
      retryCount: 1,
    });
    error(errorLogger.getUserMessage(testError));
  };

  const handleAuthError = () => {
    const testError = new Error('OAuth token has expired');
    errorLogger.logAuthError(testError, {
      endpoint: '/api/oauth/refresh',
    });
    error(errorLogger.getUserMessage(testError));
  };

  const handleValidationError = () => {
    const testError = new Error('Invalid email format');
    errorLogger.logValidationError(testError, {
      field: 'email',
      value: 'invalid-email',
    });
    error(errorLogger.getUserMessage(testError));
  };

  const handleIntegrationError = () => {
    const testError = new Error('Airtable sync failed: rate limit exceeded');
    errorLogger.logIntegrationError(testError, {
      integrationName: 'airtable',
      action: 'syncToExternal',
      recordId: 'contact-123',
    });
    error(errorLogger.getUserMessage(testError));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Error Logging Demo</h2>
      <p className="text-sm text-gray-600">
        Check browser console to see error categorisation and logging:
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleNetworkError}
          className="px-3 py-2 text-sm bg-gray-500 text-white rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          Network Error
        </button>
        <button
          onClick={handleAuthError}
          className="px-3 py-2 text-sm bg-gray-500 text-white rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          Auth Error
        </button>
        <button
          onClick={handleValidationError}
          className="px-3 py-2 text-sm bg-gray-500 text-white rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          Validation Error
        </button>
        <button
          onClick={handleIntegrationError}
          className="px-3 py-2 text-sm bg-gray-500 text-white rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          Integration Error
        </button>
      </div>
    </div>
  );
}

/**
 * Main demonstration page
 */
export default function ErrorHandlingDemoPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-3xl font-bold">Error Handling System Demo</h1>
          <p className="mt-2 text-gray-600">
            Test error boundaries, toast notifications, and error logging for Liberty Music PR pitch
            readiness.
          </p>
        </div>

        {/* Error Boundary Demo */}
        <div className="border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <ErrorBoundary
            onError={(error, info) => console.error('Error caught:', error, info)}
            onReset={() => window.location.reload()}
          >
            <DemoErrorBoundaryContent />
          </ErrorBoundary>
        </div>

        {/* Toast Demo */}
        <div className="border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <DemoToastContent />
        </div>

        {/* Error Logging Demo */}
        <div className="border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <DemoErrorLogging />
        </div>

        {/* Documentation */}
        <div className="border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-lg font-bold mb-4">Quick Reference</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-gray-300 rounded p-4">
              <h3 className="font-semibold mb-2">ErrorBoundary</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {`<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>`}
              </pre>
            </div>
            <div className="border border-gray-300 rounded p-4">
              <h3 className="font-semibold mb-2">useToast</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {`const { success, error } = useToast();
error('Something went wrong')`}
              </pre>
            </div>
            <div className="border border-gray-300 rounded p-4">
              <h3 className="font-semibold mb-2">ErrorLogger</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {`const logger = new ErrorLogger();
logger.logNetworkError(error)`}
              </pre>
            </div>
            <div className="border border-gray-300 rounded p-4">
              <h3 className="font-semibold mb-2">ToastContainer</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {`// Add to root layout
<ToastContainer />`}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>See ERROR_HANDLING.md for complete documentation</p>
        </div>
      </div>

      {/* Toast Container - Required for Toast notifications */}
      <ToastContainer />
    </div>
  );
}
