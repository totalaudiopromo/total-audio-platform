# Post-Deployment Testing Checklist - Week 3

**Deployment Date**: October 12, 2025
**Status**: Deployed to production (intel.totalaudiopromo.com)

---

## Quick Verification (5 minutes)

### 1. Legal Pages

- [ ] **Terms of Service**: Visit https://intel.totalaudiopromo.com/terms

  - Page loads without errors
  - Neo-brutalist design renders correctly
  - Related legal links work (Privacy, Cookies, Contact)

- [ ] **Contact & Support**: Visit https://intel.totalaudiopromo.com/contact
  - Page loads without errors
  - Email link works: support@totalaudiopromo.com
  - Newsletter link works
  - Social media links work

### 2. Footer Links (All Pages)

- [ ] Visit homepage: https://intel.totalaudiopromo.com
- [ ] Scroll to footer
- [ ] Verify legal links appear: Privacy Policy, Cookie Policy, Terms of Service, Contact & Support
- [ ] Click each link to confirm they work

### 3. Mobile Testing (Quick)

- [ ] Open https://intel.totalaudiopromo.com/terms on mobile
- [ ] Open https://intel.totalaudiopromo.com/contact on mobile
- [ ] Verify responsive design looks good

---

## SEO Verification (10 minutes)

### 1. Structured Data Validation

Use Google Rich Results Test: https://search.google.com/test/rich-results

**Test These URLs**:

1. [ ] https://intel.totalaudiopromo.com/blog/bbc-radio-1-contact-enrichment
2. [ ] https://intel.totalaudiopromo.com/blog/spotify-editorial-playlist-contacts
3. [ ] https://intel.totalaudiopromo.com/blog/bbc-radio-6-music-contact-enrichment

**Expected Results**:

- ✅ Valid BlogPosting structured data
- ✅ Author: Chris Schofield
- ✅ Publisher: Total Audio Promo
- ✅ Published date present
- ✅ Image URL present

### 2. Canonical URL Check

View page source for any blog post:

- [ ] Right-click → View Page Source
- [ ] Search for `<link rel="canonical"`
- [ ] Verify URL format: `https://intel.totalaudiopromo.com/blog/[slug]`

Example:

```html
<link
  rel="canonical"
  href="https://intel.totalaudiopromo.com/blog/bbc-radio-1-contact-enrichment"
/>
```

---

## Detailed Testing (30 minutes)

### Terms of Service Page

**URL**: https://intel.totalaudiopromo.com/terms

**Desktop Testing**:

- [ ] Page loads in < 3 seconds
- [ ] All 15 sections render correctly
- [ ] Glass panel design displays properly
- [ ] Related legal links work (Privacy, Cookies, Contact)
- [ ] Scroll to bottom works smoothly
- [ ] No console errors

**Mobile Testing (iPhone/Android)**:

- [ ] Page is readable without zooming
- [ ] Text size is appropriate
- [ ] Buttons are tappable (not too small)
- [ ] Glass panel design adapts to mobile
- [ ] Legal links are easily clickable

**Content Verification**:

- [ ] Last Updated date shows current date
- [ ] Company name: Total Audio Promo Ltd
- [ ] Support email: support@totalaudiopromo.com
- [ ] Pricing mentioned: £19/month Pro, £79/month Agency
- [ ] Governing law: England and Wales
- [ ] All 15 sections present (Agreement, Service Description, User Accounts, etc.)

---

### Contact & Support Page

**URL**: https://intel.totalaudiopromo.com/contact

**Desktop Testing**:

- [ ] Page loads in < 3 seconds
- [ ] Email link works: support@totalaudiopromo.com
- [ ] Newsletter link opens: https://totalaudiopromo.com/newsletter
- [ ] Social media links work:
  - X (Twitter): https://x.com/totalaudiopromo
  - LinkedIn: https://www.linkedin.com/company/total-audio-promo
- [ ] Support category cards display correctly (4 cards)
- [ ] Response time information is clear
- [ ] No console errors

**Mobile Testing**:

- [ ] Page is fully responsive
- [ ] Email link opens mail app
- [ ] Cards stack vertically on mobile
- [ ] All CTAs are tappable
- [ ] Footer legal links work

**Content Verification**:

- [ ] Support email: support@totalaudiopromo.com
- [ ] Response times mentioned:
  - Standard: 48 hours (Free/Pro)
  - Priority: 24 hours (Agency)
  - Critical: 4 hours
- [ ] 4 support categories displayed (Technical, Account, Product, Feedback)
- [ ] Before-you-contact checklist present
- [ ] Business info: Total Audio Promo Ltd, United Kingdom

---

### Blog Post Structured Data

**Test URLs**:

1. https://intel.totalaudiopromo.com/blog/bbc-radio-1-contact-enrichment
2. https://intel.totalaudiopromo.com/blog/spotify-editorial-playlist-contacts
3. https://intel.totalaudiopromo.com/blog/bbc-radio-1xtra-contact-enrichment
4. https://intel.totalaudiopromo.com/blog/bbc-radio-2-contact-enrichment
5. https://intel.totalaudiopromo.com/blog/bbc-radio-6-music-contact-enrichment
6. https://intel.totalaudiopromo.com/blog/apple-music-editorial-contacts
7. https://intel.totalaudiopromo.com/blog/kerrang-radio-contact-enrichment
8. https://intel.totalaudiopromo.com/blog/absolute-radio-contact-enrichment

**For Each URL**:

- [ ] Page loads correctly
- [ ] View page source (Right-click → View Page Source)
- [ ] Search for `<script type="application/ld+json">`
- [ ] Verify structured data contains:
  - "@type": "BlogPosting"
  - "headline": "..."
  - "author": "Chris Schofield"
  - "publisher": "Total Audio Promo"
  - "datePublished": "..."
  - "inLanguage": "en-GB"

**Google Rich Results Test**:

- [ ] Visit: https://search.google.com/test/rich-results
- [ ] Paste blog post URL
- [ ] Click "Test URL"
- [ ] Verify "BlogPosting" appears as detected schema
- [ ] Check for zero errors/warnings

---

### Canonical URLs

**Test on All 8 Blog Posts**:

- [ ] View page source
- [ ] Search for `<link rel="canonical"`
- [ ] Verify format: `https://intel.totalaudiopromo.com/blog/[slug]`
- [ ] No duplicate canonical tags
- [ ] URL matches current page URL

---

## Performance Testing

### Google PageSpeed Insights

**Test URLs**:

1. [ ] https://intel.totalaudiopromo.com/terms
2. [ ] https://intel.totalaudiopromo.com/contact

**Expected Scores**:

- Desktop: 90+ (Green)
- Mobile: 80+ (Green/Yellow)

**Tool**: https://pagespeed.web.dev/

---

## SEO Monitoring Setup (15 minutes)

### Google Search Console

1. [ ] Log in to Google Search Console
2. [ ] Add property: intel.totalaudiopromo.com (if not already added)
3. [ ] Submit sitemap: https://intel.totalaudiopromo.com/sitemap.xml
4. [ ] Verify sitemap includes all 19 URLs
5. [ ] Request indexing for new pages:
   - /terms
   - /contact
   - All 8 blog posts with new structured data

### Google Analytics

1. [ ] Log in to Google Analytics
2. [ ] Verify tracking code is active on new pages
3. [ ] Check real-time users on /terms and /contact
4. [ ] Set up custom alert for organic traffic changes

---

## Issue Tracking

**Found Issues**: Document any problems here

| Issue                | URL    | Severity | Status |
| -------------------- | ------ | -------- | ------ |
| Example: Link broken | /terms | High     | Fixed  |
|                      |        |          |        |
|                      |        |          |        |

---

## Deployment Success Criteria

All boxes checked = Successful deployment ✅

**Critical (Must Fix Immediately)**:

- [ ] Terms of Service page loads without errors
- [ ] Contact page loads without errors
- [ ] Footer legal links work on all pages
- [ ] No 404 errors on new pages

**High Priority (Fix Within 24 Hours)**:

- [ ] Structured data validates with Google Rich Results Test
- [ ] Canonical URLs present on all blog posts
- [ ] Mobile experience is responsive

**Medium Priority (Fix Within 1 Week)**:

- [ ] PageSpeed scores above 80
- [ ] Google Search Console shows no errors
- [ ] All external links work (newsletter, social media)

---

## Next Steps After Testing

### Immediate (Today)

- [ ] Complete this checklist
- [ ] Fix any critical issues found
- [ ] Submit sitemap to Google Search Console

### This Week

- [ ] Monitor Google Search Console for crawl errors
- [ ] Check Google Analytics for traffic to new pages
- [ ] Test on additional devices (iPad, different browsers)

### This Month

- [ ] Monitor rich snippet appearances in Google search
- [ ] Track organic traffic trends
- [ ] Review customer support email volume

---

## Notes

**Deployment Time**: [Fill in after deployment]
**Issues Found**: [Fill in during testing]
**Time to Complete Checklist**: [Fill in when done]

**Completed By**: \***\*\_\_\_\*\***
**Date**: \***\*\_\_\_\*\***

---

**Status**: Week 3 optimizations deployed and ready for testing! 🚀
