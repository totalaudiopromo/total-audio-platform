# Dependency Standardization Plan

## Current State Analysis

### Critical Version Conflicts

| Dependency | Audio Intel | Tracker | Pitch Generator | Target Version |
|------------|-------------|---------|-----------------|----------------|
| **next** | 15.4.2 | 15.5.4 | 15.4.2 | **15.3.0** (pinned) |
| **react** | 19.1.0 | 19.1.0 | 19.1.0 | **19.1.0** ✅ |
| **react-dom** | 19.1.0 | 19.1.0 | 19.1.0 | **19.1.0** ✅ |
| **tailwindcss** | 3.4.17 | 4.1.13 | 3.4.17 | **3.4.17** |
| **stripe** | 18.3.0 | 18.5.0 | 18.3.0 | **18.5.0** (latest) |
| **lucide-react** | 0.525.0 | 0.469.0 | 0.525.0 | **0.525.0** |
| **@anthropic-ai/sdk** | ❌ | 0.65.0 | 0.32.1 | **0.65.0** (latest) |

### Analytics Configuration

| App | Analytics Provider | GTM ID | Plausible |
|-----|-------------------|---------|-----------|
| Audio Intel | Google Tag Manager | GTM-WZNJWDKH | ❌ |
| Tracker | Google Tag Manager | GTM-WZNJWDKH | ❌ |
| Pitch Generator | Plausible | ❌ | pitch.totalaudiopromo.com |

**Decision**: Standardize on **Google Tag Manager** (GTM-WZNJWDKH) for consistency.

### Locale Settings

| App | HTML lang | OpenGraph locale | Metadata locale |
|-----|-----------|------------------|-----------------|
| Audio Intel | en | en_GB | en_GB ✅ |
| Tracker | en | ❌ | ❌ |
| Pitch Generator | en | ❌ | ❌ |

**Decision**: Standardize on **en_GB** (UK market focus per business context).

## Standardization Actions

### Phase 1: Critical Dependencies (Immediate)

1. **Pin Next.js to 15.3.0** across all apps (avoid 15.4.4 workspace resolution issues)
2. **Upgrade Tailwind to v3.4.17** for tracker (downgrade from v4 - breaking changes)
3. **Standardize Stripe to 18.5.0** (latest stable)
4. **Standardize lucide-react to 0.525.0** (latest)
5. **Add Anthropic SDK to audio-intel** if needed (0.65.0)

### Phase 2: Analytics & Tracking

1. **Replace Plausible with GTM** in Pitch Generator
2. **Ensure GTM ID consistency** (GTM-WZNJWDKH)
3. **Verify GTM tracking** across all apps

### Phase 3: Locale & i18n

1. **Set lang="en-GB"** on all HTML elements
2. **Add OpenGraph locale="en_GB"** to all metadata
3. **Standardize metadata structure** across apps

### Phase 4: Root Package.json Cleanup

1. **Remove outdated React overrides** (currently forcing 18.2.0 but apps use 19.1.0)
2. **Update workspace configuration** for consistency
3. **Add shared dependency management**

## Implementation Order

```bash
# 1. Update root package.json (remove conflicting overrides)
# 2. Update audio-intel/package.json (Next.js, Stripe, add shared UI)
# 3. Update tracker/package.json (Next.js, Tailwind downgrade, Stripe, lucide)
# 4. Update pitch-generator/package.json (Next.js, Stripe, Anthropic, add shared UI)
# 5. Update all layout.tsx files (analytics, locale)
# 6. Run npm install at root to resolve workspace dependencies
# 7. Test all apps individually
```

## Breaking Changes to Watch

### Tailwind v4 → v3 Downgrade (Tracker)

Tracker is currently on Tailwind v4.1.13 which has **breaking changes**:
- New CSS-first configuration
- Different plugin system
- PostCSS changes

**Risk**: Medium. Need to verify all Tailwind classes still work after downgrade.

**Mitigation**:
- Keep tailwind.config.ts as-is (already v3 format)
- Test all pages after downgrade
- Check for v4-specific utilities

### Next.js 15.5.4 → 15.3.0 Downgrade (Tracker)

**Risk**: Low. Minor version downgrade, likely just bug fixes.

**Mitigation**: Test routing, API routes, middleware after downgrade.

## Shared Dependencies to Add

All apps should include:
```json
{
  "@total-audio/ui": "workspace:*",
  "lucide-react": "^0.525.0",
  "tailwindcss": "^3.4.17",
  "next": "15.3.0",
  "react": "19.1.0",
  "react-dom": "19.1.0"
}
```

## Files to Update

### Root
- [x] `package.json` - Remove React overrides, add shared deps

### Audio Intel
- [x] `package.json` - Pin Next.js, update Stripe, add @total-audio/ui
- [x] `app/layout.tsx` - Already en_GB ✅

### Tracker
- [x] `package.json` - Pin Next.js, downgrade Tailwind, update deps
- [x] `app/layout.tsx` - Add en_GB locale, verify GTM
- [ ] `tailwind.config.ts` - Verify v3 compatibility after downgrade

### Pitch Generator
- [x] `package.json` - Pin Next.js, update deps, add @total-audio/ui
- [x] `app/layout.tsx` - Replace Plausible with GTM, add en_GB locale

## Testing Checklist

After changes:
- [ ] `npm install` at root (resolve workspace dependencies)
- [ ] Build all apps: `npm run build --workspaces`
- [ ] Test Audio Intel locally
- [ ] Test Tracker locally (verify Tailwind classes)
- [ ] Test Pitch Generator locally (verify GTM tracking)
- [ ] Verify mobile experience (Playwright tests)
- [ ] Check for TypeScript errors
- [ ] Verify shared UI components work in all apps

## Success Criteria

✅ All apps use same Next.js version (15.3.0)
✅ All apps use same Tailwind version (3.4.17)
✅ All apps use same analytics (GTM-WZNJWDKH)
✅ All apps use same locale (en_GB)
✅ All apps import from @total-audio/ui
✅ No workspace resolution conflicts
✅ All builds successful
✅ All tests passing
