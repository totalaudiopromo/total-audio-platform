# Pre-Deployment Verification Checklist

**Date**: October 16, 2025
**All tools running**:

- Audio Intel: http://localhost:3000
- Tracker: http://localhost:3001
- Pitch Generator: http://localhost:3002

---

## 🔴 CRITICAL BLOCKERS (Must Fix Before Deploy)

### 1. TRACKER: Sign in 500 internal error

- [ ] **TEST**: Visit http://localhost:3001/login
- [ ] **TEST**: Click "Sign in" button with valid credentials
- [ ] **TEST**: Click "Sign in with Google" button
- [ ] **EXPECTED**: No 500 errors, successful sign in
- **STATUS**: 🟡 NEEDS TESTING
- **NOTES**: Login form code looks correct, Supabase client configured

### 2. PITCH: Recent pitches 404 "pitch not found" errors

- [ ] **TEST**: Visit http://localhost:3002/dashboard
- [ ] **TEST**: Click on any recent pitch in the list
- [ ] **EXPECTED**: Opens pitch review page, no 404 errors
- **STATUS**: 🟡 NEEDS TESTING
- **NOTES**: May be session/database related

### 3. INTEL: 500 server error on click

- [ ] **TEST**: Visit http://localhost:3000/dashboard
- [ ] **TEST**: Click "Enrich Your Contacts" button
- [ ] **TEST**: Upload CSV or use demo data
- [ ] **EXPECTED**: No 500 errors during enrichment
- **STATUS**: 🟡 NEEDS TESTING
- **NOTES**: Need to identify which specific click causes error

---

## 🟡 HIGH PRIORITY (UX Issues - Should Fix)

### INTEL Issues

#### Mobile post-sign-in dashboard confusion

- [ ] **TEST**: Sign in on mobile (Chrome DevTools mobile view)
- [ ] **TEST**: Check if dashboard navigation is clear
- [ ] **EXPECTED**: Clear next steps, not confusing
- **STATUS**: 🟡 NEEDS TESTING

#### Mobile header text splitting

- [ ] **TEST**: View site header on mobile (320px width)
- [ ] **EXPECTED**: Text doesn't split awkwardly
- **STATUS**: 🟡 NEEDS TESTING

#### PDF export janky characters

- [ ] **TEST**: Enrich contacts, export PDF
- [ ] **EXPECTED**: Clean PDF with no weird characters
- **STATUS**: 🟡 NEEDS TESTING

#### No breadcrumb/burger menu on enrichment page

- [ ] **TEST**: Navigate to enrichment page
- [ ] **EXPECTED**: Has navigation to get back to dashboard
- **STATUS**: 🟡 NEEDS TESTING

### PITCH Issues

#### "Edit Your Authentic Voice" button not clear

- [ ] **TEST**: Visit dashboard or settings
- [ ] **EXPECTED**: Clear button to edit voice profile
- **STATUS**: 🟡 NEEDS TESTING

#### Newsletter section text leaving edge of screen (mobile)

- [ ] **TEST**: View dashboard on mobile (375px width)
- [ ] **TEST**: Scroll to newsletter section
- [ ] **EXPECTED**: Text stays within screen bounds
- **STATUS**: 🟡 NEEDS TESTING

#### Template library buttons appearing off screen (mobile)

- [ ] **TEST**: Visit /pitch/templates on mobile
- [ ] **EXPECTED**: All buttons visible and clickable
- **STATUS**: 🟡 NEEDS TESTING

#### Contacts page layout issues (mobile)

- [ ] **TEST**: Visit /pitch/contacts on mobile
- [ ] **EXPECTED**: Proper layout, all content visible
- **STATUS**: 🟡 NEEDS TESTING

### TRACKER Issues

#### Header logo not showing

- [ ] **TEST**: Visit http://localhost:3001 (any page)
- [ ] **EXPECTED**: Total Audio Promo logo visible in header
- **STATUS**: ✅ FIXED (Header text changed to black)
- **NOTES**: Logo path may need checking

#### Campaign Intelligence feature too prominent

- [ ] **TEST**: Visit dashboard
- [ ] **EXPECTED**: Campaign list is primary focus, Intel is secondary
- **STATUS**: 🟡 NEEDS TESTING

#### CSV preview and import errors

- [ ] **TEST**: Try to import CSV file
- [ ] **EXPECTED**: Preview shows correctly, import succeeds
- **STATUS**: 🟡 NEEDS TESTING

#### Sign in button shows when logged in

- [ ] **TEST**: Log in, check if button changes to "Sign out"
- [ ] **EXPECTED**: Button shows "Sign out" when authenticated
- **STATUS**: 🟡 NEEDS TESTING

#### Blog section not showing

- [ ] **TEST**: Check if blog section appears like Pitch site
- [ ] **EXPECTED**: Blog content visible
- **STATUS**: 🟡 NEEDS TESTING

---

## 🟢 ENHANCEMENTS (Nice to Have)

### PITCH Enhancements

#### Auto-mark sent after Gmail send + Tracker link

- [ ] **TEST**: Send pitch via Gmail integration
- [ ] **EXPECTED**: Auto-marks as sent, offers Tracker integration
- **STATUS**: 🟡 NEEDS IMPLEMENTATION

#### PDF export styling

- [ ] **TEST**: Export pitch to PDF
- [ ] **EXPECTED**: PDF matches site design (neobrutalist style)
- **STATUS**: 🟡 NEEDS TESTING

---

## ✅ VERIFIED WORKING

### PITCH Features

- [x] Pitch analysis AI feature (implemented with Apply Suggestions)
- [x] Regenerate pitch functionality (fixed to preserve context)
- [x] Edit pitch functionality
- [x] Supabase authentication working across all 3 apps

### TRACKER Features

- [x] Header text color fixed (changed from teal to black)

---

## 🎯 TESTING PROTOCOL

### For Each Issue:

1. **Open browser DevTools** (F12)
2. **Check Console tab** for JavaScript errors
3. **Check Network tab** for 500/404 errors
4. **Test on desktop first** (easier to debug)
5. **Then test on mobile** (Chrome DevTools responsive mode)
6. **Document findings** in this checklist

### Mobile Testing Breakpoints:

- **320px** - Small phone (iPhone SE)
- **375px** - Standard phone (iPhone 12/13)
- **428px** - Large phone (iPhone 14 Pro Max)
- **768px** - Tablet (iPad)

---

## 📊 VERIFICATION SUMMARY

**Last Updated**: October 16, 2025

### Status Legend:

- 🔴 CRITICAL - Blocks deployment
- 🟡 TESTING NEEDED - Unknown status
- ✅ VERIFIED WORKING - Tested and confirmed
- ❌ BROKEN - Confirmed issue

### Overall Deployment Status:

- **CRITICAL BLOCKERS**: 3 need testing
- **HIGH PRIORITY**: 12 need testing
- **ENHANCEMENTS**: 2 nice-to-have
- **VERIFIED WORKING**: 4 features confirmed

**RECOMMENDATION**: Test all 3 critical blockers before deploying to production.

---

## 🚀 DEPLOYMENT CHECKLIST

Once all critical blockers are resolved:

- [ ] Run `npm run build` for each app (audio-intel, tracker, pitch-generator)
- [ ] Check build errors/warnings
- [ ] Test production builds locally
- [ ] Deploy to Vercel
- [ ] Test production deployments
- [ ] Verify environment variables in Vercel
- [ ] Check production logs for errors

---

## 📝 NOTES

Add testing notes here as you verify each issue...
