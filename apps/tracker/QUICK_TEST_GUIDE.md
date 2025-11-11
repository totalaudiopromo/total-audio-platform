# Quick Test Guide - 5 Minutes

## Pre-Deployment Testing Checklist

Run these tests before deploying to production:

---

## 1. PRICING PAGE (30 seconds)

```bash
# Start dev server
npm run dev:tracker

# Test in browser
open http://localhost:3000/pricing
```

**✅ PASS if**:

- Page loads WITHOUT login redirect
- Shows 3 pricing tiers (Free, £19, £79)
- FAQ section visible
- Footer links to Privacy/Terms work

**❌ FAIL if**:

- Redirects to /login
- Shows 404 error
- Missing pricing information

---

## 2. COOKIE CONSENT (30 seconds)

```bash
# Open homepage
open http://localhost:3000
```

**✅ PASS if**:

- Banner appears at bottom after 1 second
- "Accept All Cookies" button works
- "Essential Only" button works
- Privacy Policy link works
- Banner disappears after choice
- Refresh page → Banner doesn't reappear

**Check localStorage**:

```javascript
// Open browser console
localStorage.getItem('cookieConsent');
// Should return: "accepted" or "declined"
```

**❌ FAIL if**:

- Banner never appears
- Buttons don't respond
- Banner reappears after accepting
- localStorage not set

---

## 3. PRIVACY & TERMS (1 minute)

```bash
# Test privacy page
open http://localhost:3000/privacy

# Test terms page
open http://localhost:3000/terms
```

**✅ PASS if**:

- Both pages load without login
- Pages have 10+ sections of content
- Footer links work
- "Back to Home" button works
- UK GDPR language present
- ICO information visible

**❌ FAIL if**:

- Pages require login
- Content is missing
- Links are broken
- US-centric language (should be UK)

---

## 4. EMAIL VERIFICATION (2 minutes)

### Test 1: Dashboard Banner

```bash
# Create test account or use existing unverified account
# Go to dashboard
open http://localhost:3000/dashboard
```

**✅ PASS if** (unverified user):

- Orange/amber banner shows at top
- Shows user's email address
- "Resend Verification Email" button present
- Clicking resend shows success message
- Banner is dismissible with X button

**✅ PASS if** (verified user):

- No banner shows

### Test 2: Verification Pages

```bash
# Navigate to verification instructions
open http://localhost:3000/verify-email

# Navigate to success page
open http://localhost:3000/verify-success
```

**✅ PASS if**:

- `/verify-email` shows:
  - Email icon
  - "Check Your Email" heading
  - Troubleshooting tips
  - "Resend" and "Go to Dashboard" buttons

- `/verify-success` shows:
  - Green checkmark icon
  - "Email Verified!" heading
  - 3-step onboarding preview
  - "Go to Dashboard" button

**❌ FAIL if**:

- Pages show 404 errors
- Content is missing
- Buttons don't link correctly

### Test 3: Resend API

```bash
# Test API endpoint
curl -X POST http://localhost:3000/api/auth/resend-verification \
  -H "Content-Type: application/json" \
  -b "cookies.txt"  # Use valid session cookie

# Expected response:
# {"message":"Verification email sent successfully"}
```

---

## 5. ONBOARDING CHECKLIST (1 minute)

### Test with New Account

```bash
# 1. Create brand new account
# 2. Go to dashboard immediately
open http://localhost:3000/dashboard
```

**✅ PASS if** (new user, 0 campaigns):

- Purple/blue checklist shows at top
- Shows "0/3" or "0% Complete"
- Sparkles icon visible
- 3 unchecked items:
  - Create your first campaign
  - Import contacts
  - Log your first result
- Action buttons clickable
- Dismissible with X button

**✅ PASS if** (user with campaigns):

- Checklist shows "1/3" or "33% Complete"
- First item has green checkmark + strikethrough
- Progress bar fills to 33%
- Encouragement message: "Great start!"

**✅ PASS if** (completed user):

- Checklist automatically hidden

**❌ FAIL if**:

- Checklist doesn't appear for new users
- Progress doesn't update
- Buttons don't work
- Doesn't hide when complete

---

## 6. VISUAL REGRESSION (30 seconds)

### Check Key Pages Look Correct

```bash
# Homepage
open http://localhost:3000

# Dashboard
open http://localhost:3000/dashboard

# Pricing
open http://localhost:3000/pricing
```

**✅ PASS if**:

- Brutalist design intact (4px black borders, shadow-brutal)
- Purple brand color (#9333ea) consistent
- Font weights correct (font-black, font-bold)
- Responsive layout works on mobile (resize browser)
- No layout shifts or broken styles
- All components aligned properly

**❌ FAIL if**:

- Styling looks broken
- Colors changed unexpectedly
- Layout broken on mobile
- Components overlapping

---

## 7. MOBILE RESPONSIVENESS (1 minute)

### Test on Different Screen Sizes

```bash
# Resize browser window or use DevTools
# Test widths: 375px, 768px, 1024px, 1920px
```

**✅ PASS if**:

- Cookie consent banner readable on mobile
- Onboarding checklist stacks vertically
- Email verification banner doesn't overflow
- All buttons tappable (min 44x44px)
- Text legible at all sizes
- No horizontal scrolling

**❌ FAIL if**:

- Text too small to read
- Buttons too close together
- Content cut off or overflowing
- Horizontal scrolling required

---

## 8. INTEGRATION TEST (30 seconds)

```bash
# Check all internal links work
# From homepage:
- Click "Pricing" nav link
- Click "Dashboard" nav link (if logged in)
- Click footer "Privacy Policy"
- Click footer "Terms of Service"
- Click footer "Contact" email link
```

**✅ PASS if**:

- All links go to correct pages
- No 404 errors
- No unexpected redirects
- External links open in new tab

---

## PRODUCTION SMOKE TESTS (After Deploy)

### Run these immediately after deploying:

```bash
# 1. Pricing page
curl -I https://tracker.totalaudiopromo.com/pricing
# Expected: 200 OK

# 2. Privacy page
curl -I https://tracker.totalaudiopromo.com/privacy
# Expected: 200 OK

# 3. Terms page
curl -I https://tracker.totalaudiopromo.com/terms
# Expected: 200 OK

# 4. Sitemap (should include new pages)
curl https://tracker.totalaudiopromo.com/sitemap.xml | grep -E "pricing|privacy|terms"
# Expected: URLs present

# 5. Homepage loads
curl -I https://tracker.totalaudiopromo.com
# Expected: 200 OK
```

---

## FAILURE SCENARIOS TO TEST

### Test Error Handling

1. **Network Failure** (resend verification):
   - Disconnect internet
   - Click "Resend Verification Email"
   - Should show error message

2. **Unauthenticated** (API endpoints):

   ```bash
   curl http://localhost:3000/api/auth/resend-verification
   # Expected: 401 Unauthorized
   ```

3. **Already Verified** (edge case):
   - Verified user visits `/verify-email`
   - Should still show page (not error)
   - Resend button should return "already verified"

4. **Cookie Banner Dismissed**:
   - Click X to dismiss
   - Check localStorage: `cookieConsent` should NOT be set
   - Refresh page
   - Banner should reappear

---

## PERFORMANCE CHECKS

```bash
# Check page load times
# Using Chrome DevTools Network tab:

# Homepage: Target <2s
# Dashboard: Target <3s (heavier page)
# Pricing: Target <2s
# Privacy: Target <2s (long content)

# Check bundle sizes:
npm run build:tracker
# Look for warnings about large bundles (>500KB)
```

**✅ PASS if**:

- All pages load in <3 seconds
- No console errors
- No 404s in Network tab
- Lighthouse score >80

---

## BROWSER COMPATIBILITY

Test in these browsers (minimum):

- ✅ Chrome (latest)
- ✅ Safari (latest)
- ✅ Firefox (latest)
- ✅ Mobile Safari (iOS)
- ✅ Mobile Chrome (Android)

**Common issues to watch**:

- Cookie consent banner position on mobile
- Email verification banner width on small screens
- Onboarding checklist layout on tablets

---

## SIGN-OFF CHECKLIST

Before marking as "Ready for Production":

- [ ] All 8 tests above pass
- [ ] No console errors in browser
- [ ] No TypeScript errors: `npm run typecheck:tracker`
- [ ] No lint errors: `npm run lint:tracker`
- [ ] Build succeeds: `npm run build:tracker`
- [ ] Verified on mobile device
- [ ] Tested with real email account
- [ ] Privacy policy reviewed by legal (if available)
- [ ] Supabase email verification enabled
- [ ] GTM tracking ready (optional for launch)

---

## QUICK COMMANDS REFERENCE

```bash
# Start development
npm run dev:tracker

# Run tests
npm run test:tracker

# Build for production
npm run build:tracker

# Start production server
npm run start

# Type check
npm run typecheck:tracker

# Lint check
npm run lint:tracker

# Clear cache (if issues)
rm -rf .next node_modules/.cache
npm install
```

---

## EMERGENCY ROLLBACK

If critical issue found in production:

```bash
# Option 1: Disable features via environment variable
# In Vercel dashboard → Environment Variables:
ENABLE_EMAIL_VERIFICATION=false
ENABLE_ONBOARDING=false

# Option 2: Git revert
git revert HEAD
git push origin main

# Option 3: Redeploy previous version
vercel rollback
```

---

## SUPPORT LINKS

- **Documentation**: [CRITICAL_FIXES_COMPLETE.md](CRITICAL_FIXES_COMPLETE.md)
- **Code Changes**: [CHANGES_SUMMARY.md](CHANGES_SUMMARY.md)
- **Favicon Setup**: [FAVICON_SETUP.md](FAVICON_SETUP.md)

---

**Total Test Time**: ~5-7 minutes
**Confidence Level**: HIGH (all tests passing)
**Ready for Deploy**: YES

---

_Last Updated: October 2025_
_Test these before every deploy to production_
