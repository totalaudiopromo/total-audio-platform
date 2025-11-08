# Pitch Generator V1 - Testing Checklist

## 🧪 Local Testing (Before Deployment)

### 1. Authentication Flow ✓

- [ ] Visit http://localhost:3001
- [ ] Click "Sign In"
- [ ] Sign in with: `founder@totalaudiopromo.com` / `buildfast`
- [ ] Verify redirect to dashboard
- [ ] Check session persists on page refresh

### 2. Dashboard ✓

- [ ] View dashboard at http://localhost:3001/dashboard
- [ ] Stats cards show correct data
- [ ] Recent pitches table loads
- [ ] All navigation links work

### 3. Contact Management ✓

- [ ] Navigate to "Contacts" (http://localhost:3001/pitch/contacts)
- [ ] Click "Add Contact"
- [ ] Fill in contact form:
  - Name: Test Contact
  - Email: test@example.com
  - Outlet: Test Radio
  - Role: Producer
  - Genre Tags: electronic, house
- [ ] Click "Add Contact"
- [ ] Verify contact appears in list
- [ ] Click Edit on contact
- [ ] Update contact details
- [ ] Verify changes saved
- [ ] Delete the test contact
- [ ] Verify contact removed from list

### 4. Pitch Generation (CRITICAL) ✓

- [ ] Navigate to "Generate Pitch" (http://localhost:3001/pitch/generate)
- [ ] Fill in pitch form:
  - Contact: Select from dropdown
  - Artist Name: sadact
  - Track Title: maybe i
  - Genre: electronic
  - Key Hook: "Sounds like it was made in a basement in Central London in 1999 during the UK garage boom"
  - Track Link: https://open.spotify.com/track/57kM0Yr2bvCEnU416hxtFS
  - Tone: Casual
- [ ] Click "Generate Pitch"
- [ ] Wait for AI generation (~5 seconds)
- [ ] Verify pitch body appears
- [ ] Verify 3 subject line options appear
- [ ] Check AI respects UK garage genre (should NOT mention Aphex Twin)
- [ ] Click "Review & Edit"

### 5. Pitch Review & Edit ✓

- [ ] Verify pitch loads on review page
- [ ] Click "Edit Pitch Body"
- [ ] Make changes to pitch text
- [ ] Click "Save Changes"
- [ ] Verify changes saved (green checkmark)
- [ ] Select different subject line option
- [ ] Click "Copy to Clipboard"
- [ ] Verify copied notification appears
- [ ] Paste in text editor to verify full pitch copied

### 6. Pitch History ✓

- [ ] Navigate to "History" (http://localhost:3001/pitch/history)
- [ ] Verify all generated pitches appear
- [ ] Click on a pitch to view details
- [ ] Verify pitch details load correctly
- [ ] Test search/filter (if implemented)

### 7. Pricing Page ✓

- [ ] Navigate to "Pricing" (http://localhost:3001/pricing)
- [ ] Verify 3 tiers show: FREE (£0), PRO (£14), AGENCY (£49)
- [ ] Toggle between Monthly/Annual billing
- [ ] Verify annual prices update (£140, £490)
- [ ] Select PRO tier
- [ ] Enter email: your-test-email@example.com
- [ ] Click "Proceed to checkout"
- [ ] Verify redirects to Stripe checkout
- [ ] **IMPORTANT**: Use test card `4242 4242 4242 4242`
- [ ] Complete test payment
- [ ] Verify redirect to success page

### 8. Settings/Profile (if implemented) ✓

- [ ] Navigate to settings
- [ ] Update profile information
- [ ] Save changes
- [ ] Verify changes persist

## 🎯 Critical User Flows

### Flow 1: First-Time User Journey

1. Sign up/Sign in
2. Add first contact
3. Generate first pitch
4. Review and edit pitch
5. Copy to send
   **Expected Result**: User can generate and use a pitch within 2 minutes

### Flow 2: Returning User Journey

1. Sign in
2. View dashboard
3. Generate pitch for existing contact
4. Review history
   **Expected Result**: User can generate pitch in under 1 minute

### Flow 3: Upgrade Flow

1. Generate 5+ pitches (hit free limit)
2. See upgrade prompt
3. Visit pricing page
4. Complete checkout
5. Verify unlimited access
   **Expected Result**: Seamless upgrade without losing data

## 🐛 Bug Testing

### Genre Matching Test

Generate pitches with these Key Hooks and verify AI respects genre:

1. **UK Garage**: "Sounds like 1999 UK garage from So Solid Crew era"

   - Should mention: UK garage artists (Artful Dodger, Craig David era)
   - Should NOT mention: Aphex Twin, techno artists

2. **Techno**: "Detroit techno influenced by Derrick May and Carl Craig"

   - Should mention: Detroit techno artists
   - Should NOT mention: UK garage, drum & bass

3. **Indie Rock**: "Influenced by Arctic Monkeys and early Strokes"
   - Should mention: Indie rock artists
   - Should NOT mention: electronic music

### Edge Cases

- [ ] Generate pitch with empty optional fields
- [ ] Generate pitch with very long key hook (500+ characters)
- [ ] Generate pitch with special characters in names
- [ ] Try generating 10 pitches in a row
- [ ] Test with slow internet connection

## 📊 Performance Checks

- [ ] Dashboard loads in < 2 seconds
- [ ] Pitch generation completes in < 7 seconds
- [ ] No console errors in browser
- [ ] No 500 errors in server logs
- [ ] Mobile responsive (test on phone or use browser dev tools)

## 🔐 Security Checks

- [ ] Cannot access other users' pitches (try manipulating URL IDs)
- [ ] Cannot access dashboard without authentication
- [ ] API routes return 401 when not authenticated
- [ ] Stripe checkout uses correct test keys (not live keys!)

## ✅ Pre-Deployment Final Checks

Before deploying to production:

1. [ ] All local tests pass
2. [ ] No errors in browser console
3. [ ] No errors in server logs
4. [ ] Test Stripe checkout completes successfully
5. [ ] Mobile experience tested
6. [ ] All environment variables documented
7. [ ] Database migrations documented
8. [ ] RLS policies ready to apply
9. [ ] Webhook endpoints configured
10. [ ] Domain/SSL configured

## 🚀 Post-Deployment Smoke Test

After deploying to Vercel:

1. [ ] Visit production URL
2. [ ] Sign in
3. [ ] Generate one test pitch
4. [ ] Complete test Stripe checkout
5. [ ] Verify webhook received (check Stripe dashboard)
6. [ ] Check Vercel logs for errors
7. [ ] Test on mobile device
8. [ ] Share with 2-3 beta testers

---

**Date**: October 2025
**Version**: 1.0
**Tester**: **\*\***\_**\*\***
**Status**: [ ] PASS / [ ] FAIL
**Notes**: **\*\*\*\***\_\_\_\_**\*\*\*\***
