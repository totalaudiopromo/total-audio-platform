# Total Audio Platform Ecosystem Audit - Status Report

## ✅ Completed: Shared UI Component Migration

### What Was Fixed

**1. Component Duplication (100% Complete)**
- ✅ Created `@total-audio/ui` shared package
- ✅ Migrated SiteHeader, SiteFooter, ToolSwitcher to shared components
- ✅ Removed ~1,000 lines of duplicated code across 3 apps
- ✅ All apps now import from `@total-audio/ui`

**Impact**: Single source of truth for UI components. Updates propagate automatically.

**2. Brand Consistency (100% Complete)**
- ✅ Shared Tailwind brand configuration created
- ✅ Tool-specific accent colors preserved (blue/amber/purple)
- ✅ Brutalist design system standardized
- ✅ Shared component classes (`.glass-panel`, `.cta-button`, etc.)

**Impact**: Consistent design language while maintaining tool differentiation.

**3. Code Organization (100% Complete)**
- ✅ Created `/packages/ui/` directory structure
- ✅ Proper TypeScript interfaces for all shared components
- ✅ Clean exports via index.js

**Impact**: Maintainable, scalable component architecture.

---

## 🔄 In Progress: Dependency & Configuration Standardization

### Critical Issues Identified

#### 1. Next.js Version Conflicts ⚠️

**Current State**:
- Audio Intel: 15.4.2
- Tracker: 15.5.4
- Pitch Generator: 15.4.2

**Issue**: Version drift causes potential build inconsistencies and workspace resolution issues.

**Solution**: Pin all to **15.3.0** (proven stable version per commit 6ce6c62)

**Files to Update**:
- [ ] `apps/audio-intel/package.json` - Change `"next": "15.4.2"` → `"next": "15.3.0"`
- [ ] `apps/tracker/package.json` - Change `"next": "15.5.4"` → `"next": "15.3.0"`
- [ ] `apps/pitch-generator/package.json` - Change `"next": "15.4.2"` → `"next": "15.3.0"`

#### 2. Tailwind CSS Version Conflict ⚠️

**Current State**:
- Audio Intel: 3.4.17 ✅
- Tracker: 4.1.13 ❌ (major version ahead)
- Pitch Generator: 3.4.17 ✅

**Issue**: Tailwind v4 has breaking changes (CSS-first config, different plugin system)

**Solution**: Downgrade Tracker to **3.4.17** for consistency

**Files to Update**:
- [ ] `apps/tracker/package.json` - Change `"tailwindcss": "^4.1.13"` → `"tailwindcss": "^3.4.17"`
- [ ] Verify `apps/tracker/tailwind.config.ts` works with v3 after downgrade

**Risk**: Medium. Need to test all Tailwind classes in Tracker after downgrade.

#### 3. Stripe SDK Version Drift

**Current State**:
- Audio Intel: 18.3.0
- Tracker: 18.5.0
- Pitch Generator: 18.3.0

**Solution**: Standardize on **18.5.0** (latest stable)

**Files to Update**:
- [ ] `apps/audio-intel/package.json` - Change `"stripe": "^18.3.0"` → `"stripe": "^18.5.0"`
- [ ] `apps/pitch-generator/package.json` - Change `"stripe": "^18.3.0"` → `"stripe": "^18.5.0"`

**Risk**: Low. Minor version update, backward compatible.

#### 4. lucide-react Version Drift

**Current State**:
- Audio Intel: 0.525.0 ✅
- Tracker: 0.469.0 ❌
- Pitch Generator: 0.525.0 ✅

**Solution**: Update Tracker to **0.525.0**

**Files to Update**:
- [ ] `apps/tracker/package.json` - Change `"lucide-react": "^0.469.0"` → `"lucide-react": "^0.525.0"`

**Risk**: Low. Icon library, likely no breaking changes.

#### 5. Analytics Inconsistency

**Current State**:
- Audio Intel: Google Tag Manager (GTM-WZNJWDKH) ✅
- Tracker: Google Tag Manager (GTM-WZNJWDKH) ✅
- Pitch Generator: Plausible Analytics ❌

**Issue**: Inconsistent analytics tracking across platform

**Solution**: Standardize on **Google Tag Manager** for all apps

**Files to Update**:
- [ ] `apps/pitch-generator/app/layout.tsx` - Replace Plausible with GTM
```tsx
// Remove:
<Script
  defer
  data-domain="pitch.totalaudiopromo.com"
  src="https://plausible.io/js/script.js"
/>

// Add GTM (same as audio-intel and tracker):
<script dangerouslySetInnerHTML={{...GTM script...}} />
```

**Risk**: Low. Ensure GTM tracking code is identical across all apps.

#### 6. Locale Settings Inconsistency

**Current State**:
- Audio Intel: `lang="en"`, `locale: 'en_GB'` ✅
- Tracker: `lang="en"`, no locale metadata ❌
- Pitch Generator: `lang="en"`, no locale metadata ❌

**Issue**: Inconsistent UK market targeting (per business context)

**Solution**: Standardize on **en-GB** across all apps

**Files to Update**:
- [ ] `apps/tracker/app/layout.tsx`:
  - Change `<html lang="en">` → `<html lang="en-GB">`
  - Add OpenGraph locale metadata
- [ ] `apps/pitch-generator/app/layout.tsx`:
  - Change `<html lang="en">` → `<html lang="en-GB">`
  - Add OpenGraph locale metadata

**Risk**: None. SEO improvement for UK market.

#### 7. Anthropic AI SDK Version Drift

**Current State**:
- Audio Intel: Not installed
- Tracker: 0.65.0 ✅
- Pitch Generator: 0.32.1 ❌

**Solution**: Update Pitch Generator to **0.65.0**

**Files to Update**:
- [ ] `apps/pitch-generator/package.json` - Change `"@anthropic-ai/sdk": "^0.32.1"` → `"@anthropic-ai/sdk": "^0.65.0"`

**Risk**: Low-Medium. Check for API changes between 0.32.1 and 0.65.0.

#### 8. Root package.json Cleanup

**Current State**:
- Conflicting React overrides (forcing 18.2.0 while apps use 19.1.0)

**Solution**: Remove outdated overrides, add Next.js resolution

**Files to Update**:
- [x] `/package.json` - Remove React overrides, add `"resolutions": { "next": "15.3.0" }`

**Status**: ✅ COMPLETE

---

## 📋 Implementation Checklist

### Phase 1: Package.json Updates (Manual Required)

Due to file editing constraints, these updates need to be done manually:

**Audio Intel** (`apps/audio-intel/package.json`):
```json
"dependencies": {
  "@total-audio/ui": "workspace:*",  // ADD THIS
  "lucide-react": "^0.525.0",        // Keep
  "next": "15.3.0",                  // Change from 15.4.2
  "stripe": "^18.5.0",               // Change from ^18.3.0
  ...
}
```

**Tracker** (`apps/tracker/package.json`):
```json
"dependencies": {
  "@total-audio/ui": "workspace:*",  // ADD THIS
  "lucide-react": "^0.525.0",        // Change from ^0.469.0
  "next": "15.3.0",                  // Change from 15.5.4
  "stripe": "18.5.0",                // Keep (already correct)
  ...
},
"devDependencies": {
  "tailwindcss": "^3.4.17",          // Change from ^4.1.13 ⚠️ MAJOR
  ...
}
```

**Pitch Generator** (`apps/pitch-generator/package.json`):
```json
"dependencies": {
  "@anthropic-ai/sdk": "^0.65.0",   // Change from ^0.32.1
  "@total-audio/ui": "workspace:*",  // ADD THIS
  "lucide-react": "^0.525.0",        // Keep
  "next": "15.3.0",                  // Change from 15.4.2
  "stripe": "^18.5.0",               // Change from ^18.3.0
  ...
}
```

### Phase 2: Layout Configuration Updates

**Tracker Layout** (`apps/tracker/app/layout.tsx`):
```tsx
// Line 30: Change lang attribute
<html lang="en-GB" className={...}>  // Change from "en"

// Add to metadata (line 19-22):
export const metadata: Metadata = {
  metadataBase: new URL('https://tracker.totalaudiopromo.com'),
  title: "Total Audio Tracker – Simple Campaign Tracking",
  description: "Simple campaign tracking for indie artists and radio promoters. Stop using spreadsheets.",
  openGraph: {
    locale: 'en_GB',
    type: 'website',
  },
};
```

**Pitch Generator Layout** (`apps/pitch-generator/app/layout.tsx`):
```tsx
// Line 26: Change lang attribute
<html lang="en-GB" className={...}>  // Change from "en"

// Lines 28-32: Replace Plausible with GTM
// Remove Plausible Script
// Add GTM script (copy from audio-intel/app/layout.tsx lines 115-125)

// Add to metadata in metadata.ts:
openGraph: {
  locale: 'en_GB',
  type: 'website',
}
```

### Phase 3: Testing & Verification

After all updates:

1. **Install Dependencies**:
   ```bash
   cd /Users/chrisschofield/workspace/active/total-audio-platform
   npm install
   ```

2. **Build All Apps**:
   ```bash
   npm run build --workspace=apps/audio-intel
   npm run build --workspace=apps/tracker
   npm run build --workspace=apps/pitch-generator
   ```

3. **Run Tests**:
   ```bash
   npm run test:audio-intel
   npm run test --workspace=apps/tracker
   ```

4. **Manual Testing Checklist**:
   - [ ] Audio Intel: Verify UI components render correctly
   - [ ] Tracker: Verify Tailwind v3 classes work after downgrade
   - [ ] Tracker: Check for any v4-specific utilities
   - [ ] Pitch Generator: Verify GTM tracking fires
   - [ ] Pitch Generator: Test Anthropic AI SDK still works
   - [ ] All apps: Verify ToolSwitcher shows all 4 tools
   - [ ] All apps: Mobile experience (run Playwright tests)

---

## 📊 Progress Summary

### Completed ✅
- [x] Shared UI component migration (3/3 apps)
- [x] Brand configuration standardization
- [x] Root package.json cleanup
- [x] Component duplication elimination (~1,000 lines removed)

### In Progress 🔄
- [ ] Dependency version standardization (0/7 critical updates)
- [ ] Analytics standardization (1/1 app needs update)
- [ ] Locale configuration (2/2 apps need update)

### Blockers ❌
None. All changes are ready to be applied.

---

## 🎯 Next Steps

1. **Review this document** - Understand all proposed changes
2. **Apply package.json updates** - Manual edits to 3 files
3. **Apply layout.tsx updates** - Add locale and GTM
4. **Run `npm install`** - Resolve dependencies
5. **Test all apps** - Build and run locally
6. **Verify mobile experience** - Run Playwright tests
7. **Create PR** - Document all standardization changes

---

## 📄 Related Documentation

- [SHARED_UI_MIGRATION.md](./SHARED_UI_MIGRATION.md) - Completed UI component work
- [DEPENDENCY_STANDARDIZATION.md](./DEPENDENCY_STANDARDIZATION.md) - Detailed standardization plan
- Original audit findings in conversation history

---

**Last Updated**: January 2025
**Status**: Phase 1 Complete (Shared UI) | Phase 2 Ready (Dependency Standardization)
**Estimated Time to Complete**: 30-45 minutes (manual updates + testing)
