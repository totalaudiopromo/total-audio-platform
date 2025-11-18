# Core Awareness Type Fixes Required

## Remaining TypeScript Errors (20 errors)

### 1. IdentityKernelProfile missing narrative property
**File**: `src/types.ts` line 290
**Fix**: Add narrative property to IdentityKernelProfile interface

```typescript
export interface IdentityKernelProfile {
  profileId: string;
  narrative: {
    themes: string[];
    archetype: string;
  };
  corePillars: string[];
  voiceTone: string[];
  cohesionScore: number;
}
```

### 2. Predictor.ts - Trajectory objects incomplete
**File**: `src/predictor.ts`
**Fix**: Add direction, confidence, and projectedMetrics to returned Trajectory objects

Need to:
- Calculate direction from projections
- Add confidence score
- Create projectedMetrics object

### 3. Alerts.ts - Priority type mismatch
**Files**: `src/alerts.ts` line 46, 81, 314
**Fix**: Update mapRiskSeverityToAlertSeverity to ensure it only returns allowed severity values

### 4. Index.ts - Missing type imports
**File**: `src/index.ts`
**Fix**: Import Alert type from alerts.ts, and fix type declarations in runAwarenessCycle

### 5. RecommendationInput - missing integrationData
**File**: `src/types.ts`
**Fix**: Add integrationData to RecommendationInput interface

### 6. Observer.ts - Type issues
**Files**: `src/observer.ts` lines 390, 470, 492
**Fix**: Handle null/undefined for workspace IDs and fix return type

### 7. Integrations.ts - AutopilotMissionState missing isActive
**File**: `src/integrations.ts` line 152
**Fix**: Add isActive: true to mock autopilot states

## Implementation Plan

1. Update IdentityKernelProfile in types.ts
2. Update predictor.ts to return complete Trajectory objects
3. Fix alerts.ts type mismatches
4. Update index.ts type imports and declarations
5. Update RecommendationInput interface
6. Fix observer.ts null handling
7. Fix integrations.ts mock data
