# Error Handling System - Total Audio Platform

Production-grade error handling infrastructure for Liberty Music PR pitch readiness.

## Overview

The error handling system provides:

- **Centralised error logging** with categorisation (network, auth, validation, integration)
- **React error boundaries** for client-side error capture
- **Toast notifications** with Postcraft aesthetic for user feedback
- **Integration service error handling** with OAuth token refresh support
- **UK English messaging** throughout for authenticity

## Architecture

```

                   Error Handling Layer                   

                                                          
  ErrorLogger          ErrorBoundary       ToastContainer 
  (Centralised         (React error        (Notifications)
   logging)            catching)                          
                                                          
  ↓ Integration        ↓ Component         ↓ Hook         
                       errors              (useToast)     
                                                          

         ↓                    ↓                 ↓

              Application & Service Layer                 

                                                          
  BaseIntegrationSync    API Routes         Components    
  (with error logging)   (try/catch)        (with toast)  
                                                          

```

## Components

### 1. ErrorLogger (`@total-audio/core-db`)

Centralised error logging utility with categorisation and workspace context.

```typescript
import { ErrorLogger, createErrorLogger } from '@total-audio/core-db';

// Create instance
const errorLogger = new ErrorLogger({
  isDevelopment: process.env.NODE_ENV === 'development',
  workspaceId: 'workspace-123',
});

// Log errors with categorisation
errorLogger.log(error, { context: 'contact_enrichment' });

// Log specific error types
errorLogger.logNetworkError(error, { url: '/api/contacts', retryCount: 1 });
errorLogger.logAuthError(error, { endpoint: '/api/oauth' });
errorLogger.logValidationError(error, { field: 'email' });
errorLogger.logIntegrationError(error, { integrationName: 'airtable' });

// Get user-friendly message (UK English)
const userMessage = errorLogger.getUserMessage(error);
// "Connection error. Please check your internet and try again."
```

**Features:**

- Automatic error categorisation
- Development console logging with formatting
- Production logging support (Sentry/LogRocket ready)
- Workspace-scoped error tracking
- User-friendly UK English messages

### 2. ErrorBoundary (`@total-audio/ui`)

React error boundary component that catches synchronous and async errors.

```typescript
import { ErrorBoundary } from '@total-audio/ui';

export default function Page() {
  return (
    <ErrorBoundary
      onError={(error, info) => console.error('Error:', error)}
      onReset={() => window.location.reload()}
      fallback={(error, reset) => (
        <div className="p-4 border-2 border-red-600">
          <p>Something went wrong: {error.message}</p>
          <button onClick={reset}>Try again</button>
        </div>
      )}
    >
      <YourComponent />
    </ErrorBoundary>
  );
}
```

**Features:**

- Catches React component errors
- Fallback UI with Postcraft aesthetic
- Development error details (stack trace)
- Reset functionality
- Optional error handler callback
- Bold borders, hard shadows (design system compliant)

### 3. Toast Notifications (`@total-audio/ui`)

User-friendly toast notifications with Postcraft design.

```typescript
import { ToastContainer, useToast } from '@total-audio/ui';

// In root layout
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}

// In components
export function MyComponent() {
  const { success, error, warning, info } = useToast();

  const handleSuccess = () => {
    success({
      title: 'Contact enriched',
      message: 'Contact details added successfully',
      duration: 3000,
    });
  };

  const handleError = () => {
    error('Something went wrong. Please try again.');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show success</button>
      <button onClick={handleError}>Show error</button>
    </div>
  );
}
```

**Features:**

- 4 toast types: success, error, warning, info
- Auto-dismiss after 5 seconds (configurable)
- Manual dismiss with close button
- UK English messaging
- Postcraft aesthetic (border-2 black, hard shadows)
- Bottom-right positioning with stacking
- Smooth animations

### 4. Integration Error Handling

BaseIntegrationSync now includes error handling with logging:

```typescript
// BaseIntegrationSync.ts automatically handles:
// - Initialization errors
// - Configuration loading errors
// - OAuth token refresh failures
// - Sync errors with retry logic
// - Error count tracking and status updates

try {
  const sync = new AirtableSync(workspaceId, supabase);
  await sync.initialize(); // Errors are logged automatically
  const result = await sync.syncToExternal(contacts);
} catch (error) {
  // Error already logged via errorLogger
  // User gets toast notification via your component
}
```

## Usage Patterns

### Pattern 1: Component with Error Boundary and Toast

```typescript
'use client';

import { ErrorBoundary, useToast } from '@total-audio/ui';

function ContactEnrichmentComponent() {
  const { success, error } = useToast();

  const handleEnrich = async () => {
    try {
      const response = await fetch('/api/contacts/enrich', {
        method: 'POST',
        body: JSON.stringify({ contactId: '123' }),
      });

      if (!response.ok) {
        error('Failed to enrich contact. Please try again.');
        return;
      }

      success({
        title: 'Success',
        message: 'Contact enriched successfully',
      });
    } catch (err) {
      error((err as Error).message);
    }
  };

  return (
    <ErrorBoundary>
      <button onClick={handleEnrich}>Enrich contact</button>
    </ErrorBoundary>
  );
}

export default ContactEnrichmentComponent;
```

### Pattern 2: API Route with Error Logging

```typescript
// app/api/contacts/enrich/route.ts
import { createServerClient } from '@total-audio/core-db/server';
import { ErrorLogger } from '@total-audio/core-db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const errorLogger = new ErrorLogger({
    isDevelopment: process.env.NODE_ENV === 'development',
  });

  try {
    const data = await request.json();
    const supabase = createServerClient(cookies());

    // Validate input
    if (!data.contactId) {
      errorLogger.logValidationError('Missing contactId', { field: 'contactId' });
      return Response.json({ error: 'Missing contact ID' }, { status: 400 });
    }

    // Call enrichment service
    const result = await enrichContact(data.contactId);

    return Response.json(result);
  } catch (error) {
    errorLogger.logIntegrationError(error as Error, {
      integrationName: 'enrichment',
      action: 'enrich',
    });

    return Response.json({ error: errorLogger.getUserMessage(error as Error) }, { status: 500 });
  }
}
```

### Pattern 3: Integration Service with Error Handling

```typescript
// Custom integration extending BaseIntegrationSync
import { BaseIntegrationSync } from '@total-audio/core-db';

class CustomSync extends BaseIntegrationSync {
  async syncToExternal(data: any[]) {
    const startTime = new Date();

    try {
      // Implementation
      const result = await this.processData(data);

      return {
        success: true,
        direction: 'to_external' as const,
        records_synced: result.count,
        records_created: result.created,
        records_updated: result.updated,
        records_failed: 0,
        errors: [],
        duration_ms: new Date().getTime() - startTime.getTime(),
        started_at: startTime,
        completed_at: new Date(),
      };
    } catch (error) {
      // Error automatically logged via this.errorLogger
      this.errorLogger.logIntegrationError(error as Error, {
        integrationName: 'custom',
        action: 'syncToExternal',
      });

      return this.createFailedResult('to_external', error as Error, startTime);
    }
  }
}
```

## Error Categories & Messages

| Category        | Cause                            | User Message                                                         |
| --------------- | -------------------------------- | -------------------------------------------------------------------- |
| **network**     | Connection, fetch, timeout       | "Connection error. Please check your internet and try again."        |
| **auth**        | Unauthorized, token expired      | "Your authentication has expired. Please log in again."              |
| **validation**  | Invalid input, schema mismatch   | "Invalid input. Please check your data and try again."               |
| **integration** | Service sync, OAuth, third-party | "Service integration failed. Please try again or contact support."   |
| **unknown**     | Unexpected                       | "An unexpected error occurred. Please try again or contact support." |

## Design System Compliance

All error UI components follow the **Postcraft aesthetic**:

- Bold black borders (`border-2 border-black`)
- Hard offset shadows (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`)
- UK English messaging throughout
- Solid colours (no gradients, no glassmorphism)
- High contrast text (black on white/coloured backgrounds)
-  No soft shadows
-  No transparency effects
-  No rounded corners >16px

## File Structure

```
packages/
 core-db/
    src/
        utils/
           error-logger.ts          # Centralised error logging
           index.ts                 # Exports error logger
        integrations/
            BaseIntegrationSync.ts   # With error handling

 ui/
     src/
        components/
           ErrorBoundary.tsx        # React error boundary
           Toast.tsx                # Toast notification
           ToastContainer.tsx       # Toast container
        hooks/
           useToast.ts              # useToast hook
        lib/
            utils.ts                 # cn() utility
     index.ts                         # Exports all components

apps/
 audio-intel/
    app/
        layout.tsx                   # Add ToastContainer
        [page]/
            page.tsx                 # Use ErrorBoundary + useToast
```

## Rollout Checklist

- [x] Create ErrorLogger utility with categorisation
- [x] Create ErrorBoundary component (Postcraft design)
- [x] Create Toast notification system (Postcraft design)
- [x] Create useToast hook
- [x] Integrate ErrorLogger into BaseIntegrationSync
- [x] Export from @total-audio/ui and @total-audio/core-db
- [ ] Add ToastContainer to root layout in each app
- [ ] Wrap critical sections with ErrorBoundary
- [ ] Add error handling to API routes
- [ ] Add useToast to components
- [ ] Test error flows end-to-end
- [ ] Document error scenarios in team wiki

## Testing Error Handling

```typescript
// Example test component
'use client';

import { ErrorBoundary, useToast } from '@total-audio/ui';
import { useState } from 'react';

export function ErrorTestingComponent() {
  const { success, error, warning, info } = useToast();
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Test error boundary');
  }

  return (
    <ErrorBoundary>
      <div className="p-4 space-y-4">
        <button onClick={() => success('Success toast')}>Show success</button>
        <button onClick={() => error('Error toast')}>Show error</button>
        <button onClick={() => warning('Warning toast')}>Show warning</button>
        <button onClick={() => info('Info toast')}>Show info</button>
        <button onClick={() => setShouldThrow(true)}>Trigger error boundary</button>
      </div>
    </ErrorBoundary>
  );
}
```

## Integration with Liberty Campaign Setup

For Liberty Music PR pitch readiness:

1. **Add to Audio Intel root layout** (`apps/audio-intel/app/layout.tsx`):

   ```typescript
   import { ToastContainer } from '@total-audio/ui';

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <ToastContainer />
         </body>
       </html>
     );
   }
   ```

2. **Wrap contact enrichment pages**:

   ```typescript
   import { ErrorBoundary } from '@total-audio/ui';

   export default function EnrichmentPage() {
     return (
       <ErrorBoundary>
         <ContactEnrichmentForm />
       </ErrorBoundary>
     );
   }
   ```

3. **Add error handling to enrichment API**:
   ```typescript
   // Integration service now logs all errors automatically
   // Components show toasts via useToast hook
   ```

## Future Enhancements

- [ ] Integration with Sentry for production error tracking
- [ ] LogRocket session replay on errors
- [ ] Error analytics dashboard
- [ ] Automatic error recovery strategies
- [ ] Customer support integration (error→support ticket)
- [ ] User feedback collection on error dismissal
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)

## References

- Design System: `/apps/tap-saas-template-DO-NOT-DELETE/DESIGN_SYSTEM.md`
- Error Logger: `/packages/core-db/src/utils/error-logger.ts`
- ErrorBoundary: `/packages/ui/src/components/ErrorBoundary.tsx`
- Toast System: `/packages/ui/src/components/Toast.tsx`
- Integration Service: `/packages/core-db/src/integrations/BaseIntegrationSync.ts`
