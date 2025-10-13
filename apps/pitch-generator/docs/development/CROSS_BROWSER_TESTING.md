# Cross-Browser Testing Guide

## Supported Browsers

### Primary Support (95%+ of users)
- **Chrome** 100+ (Desktop & Mobile)
- **Safari** 15+ (Desktop & iOS)
- **Firefox** 100+
- **Edge** 100+

### Secondary Support
- **Samsung Internet** (Android)
- **Opera** 85+

## Testing Checklist

### 1. Visual & Layout Testing

#### Homepage (/)
- [ ] Hero section displays correctly
- [ ] Feature cards render properly
- [ ] CTA buttons have correct styling
- [ ] Images load with proper aspect ratios
- [ ] Glass-panel effects work correctly
- [ ] Responsive breakpoints (320px, 768px, 1024px, 1440px)

#### Dashboard (/dashboard)
- [ ] Onboarding checklist renders for new users
- [ ] Usage meter displays correctly
- [ ] Stats grid layout works on all screen sizes
- [ ] Recent pitches list scrolls properly
- [ ] Empty states display correctly

#### Pitch Generator (/pitch/generate)
- [ ] Form fields render correctly
- [ ] Genre dropdown works
- [ ] Textarea character counter updates in real-time
- [ ] Validation messages display properly
- [ ] Error banner positioning is correct
- [ ] Toast notifications appear in correct position

#### Pitch Review (/pitch/review/[id])
- [ ] Pitch content displays properly
- [ ] Subject line variations are selectable
- [ ] Copy button works
- [ ] PDF export triggers browser print dialog
- [ ] Edit mode textarea is editable

### 2. Functionality Testing

#### Authentication
- [ ] Sign in redirects work
- [ ] Session persists across page reloads
- [ ] Protected routes redirect to sign-in
- [ ] Sign out clears session

#### Forms
- [ ] All form inputs accept text
- [ ] Date picker works (native and fallback)
- [ ] File uploads work (if applicable)
- [ ] Form validation displays errors
- [ ] Submit buttons disable during submission

#### Interactive Elements
- [ ] Buttons respond to clicks
- [ ] Links navigate correctly
- [ ] Dropdowns open/close properly
- [ ] Modals/popups display correctly
- [ ] Toast notifications auto-dismiss

#### Client-Side Navigation
- [ ] Next.js Link components work
- [ ] Browser back/forward buttons work
- [ ] URL updates correctly
- [ ] Page transitions are smooth

### 3. Performance Testing

#### Load Times
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.5s
- [ ] Cumulative Layout Shift < 0.1

#### Bundle Size
- [ ] JavaScript bundle < 200KB (gzipped)
- [ ] CSS bundle < 50KB (gzipped)
- [ ] Images properly optimized
- [ ] Fonts load efficiently

### 4. Mobile-Specific Testing

#### Touch Interactions
- [ ] All buttons are tappable (min 44x44px)
- [ ] Swipe gestures work where applicable
- [ ] Pinch-to-zoom disabled appropriately
- [ ] Virtual keyboard doesn't break layout

#### Mobile Safari Specifics
- [ ] 100vh height issues handled
- [ ] Sticky positioning works
- [ ] Fixed positioning works
- [ ] Input zoom disabled (font-size: 16px)

#### Android Specifics
- [ ] Chrome address bar hiding handled
- [ ] Samsung Internet compatibility
- [ ] Back button behavior correct

### 5. Accessibility Testing

#### Keyboard Navigation
- [ ] Tab order is logical
- [ ] All interactive elements focusable
- [ ] Focus indicators visible
- [ ] Skip navigation links work
- [ ] Modal traps focus correctly

#### Screen Reader
- [ ] Semantic HTML used correctly
- [ ] ARIA labels present where needed
- [ ] Form labels properly associated
- [ ] Error messages announced
- [ ] Dynamic content updates announced

#### Visual
- [ ] Contrast ratios meet WCAG AA (4.5:1)
- [ ] Text resizes up to 200% without breaking
- [ ] Color not sole indicator of meaning
- [ ] Focus indicators have 3:1 contrast

### 6. Browser-Specific Issues

#### Chrome/Edge
- [ ] No console errors
- [ ] Autofill works correctly
- [ ] PDF export/print preview works

#### Firefox
- [ ] CSS Grid layouts correct
- [ ] Flexbox rendering correct
- [ ] Form autofill works
- [ ] Input types render correctly

#### Safari (Desktop & iOS)
- [ ] Date inputs work (or have fallback)
- [ ] Webkit-specific prefixes applied
- [ ] ITP (Intelligent Tracking Prevention) handled
- [ ] Touch events work on iOS
- [ ] No layout shift on orientation change

#### Internet Explorer (if required)
- [ ] Polyfills loaded for modern features
- [ ] Graceful degradation message shown
- [ ] Critical functionality still works

### 7. API & Integration Testing

#### Supabase
- [ ] Database queries execute correctly
- [ ] Real-time updates work
- [ ] Authentication flows complete
- [ ] Error handling displays properly

#### External Services
- [ ] Stripe checkout redirects work
- [ ] Plausible analytics tracks events
- [ ] API rate limits handled gracefully
- [ ] Network errors display user-friendly messages

### 8. Edge Cases

#### Network Conditions
- [ ] Slow 3G performance acceptable
- [ ] Offline mode shows appropriate message
- [ ] Failed requests retry or error gracefully
- [ ] Loading states display correctly

#### Content Edge Cases
- [ ] Long text doesn't break layout
- [ ] Empty states display correctly
- [ ] Missing images have fallbacks
- [ ] Special characters render correctly (emojis, unicode)

#### User States
- [ ] New user onboarding displays
- [ ] Free tier limitations enforced
- [ ] PRO tier features accessible
- [ ] Expired sessions handled

## Testing Tools

### Automated Testing
```bash
# Run build
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint

# Mobile testing (Playwright)
npm run test:mobile
```

### Manual Testing Tools
- **Browser DevTools** - Check console for errors
- **Lighthouse** - Performance, accessibility, SEO audits
- **BrowserStack** - Cross-browser/device testing
- **LambdaTest** - Alternative to BrowserStack
- **Chrome DevTools Device Mode** - Mobile simulation

### Performance Monitoring
```javascript
// In browser console
performance.getEntriesByType('navigation')[0]
performance.getEntriesByType('paint')
```

## Common Issues & Fixes

### Issue: Layout breaks on iOS Safari
**Cause:** 100vh includes URL bar height
**Fix:** Use `min-h-screen` Tailwind class or CSS custom properties

### Issue: Date input not working on Safari
**Cause:** Safari doesn't support all HTML5 input types
**Fix:** Provide fallback with text input and placeholder

### Issue: PDF export doesn't work
**Cause:** Browser blocking popups
**Fix:** Show alert asking user to allow popups

### Issue: Buttons too small on mobile
**Cause:** Touch target size < 44x44px
**Fix:** Add minimum padding to meet WCAG guidelines

### Issue: Flash of unstyled content (FOUC)
**Cause:** CSS loading after HTML
**Fix:** Ensure critical CSS inlined or CSS in <head>

## Deployment Checklist

Before production deployment:
- [ ] All tests passing
- [ ] No console errors in any browser
- [ ] Lighthouse score > 90 for all categories
- [ ] Tested on real mobile devices
- [ ] Tested with slow network throttling
- [ ] PDF export works in target browsers
- [ ] All forms submit correctly
- [ ] Authentication flows complete
- [ ] Error pages display correctly (404, 500)
- [ ] Cookie banner appears and functions
- [ ] Analytics tracking works

## Continuous Testing

### On Every Deploy
1. Run automated tests
2. Check Vercel deployment preview
3. Test critical user flows
4. Verify no console errors

### Weekly
1. Full cross-browser manual testing
2. Performance audit with Lighthouse
3. Accessibility audit
4. Mobile device testing

### Monthly
1. Comprehensive BrowserStack testing
2. Update browser support list
3. Review and address user-reported issues
4. Performance optimization review

## Reporting Issues

When reporting cross-browser issues, include:
1. Browser name and version
2. Operating system
3. Screenshot or video
4. Steps to reproduce
5. Expected vs actual behavior
6. Console errors (if any)

## Resources

- [Can I Use](https://caniuse.com/) - Browser compatibility tables
- [MDN Web Docs](https://developer.mozilla.org/) - Web standards documentation
- [WebPageTest](https://www.webpagetest.org/) - Performance testing
- [WAVE](https://wave.webaim.org/) - Accessibility evaluation tool
- [Browser Compatibility Data](https://github.com/mdn/browser-compat-data)

---

**Last Updated:** October 2025
**Next Review:** After major feature releases or browser updates
