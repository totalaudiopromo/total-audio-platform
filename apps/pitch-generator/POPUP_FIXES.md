# Exit Intent Popup Fixes

## Changes Made

### 1. Less Aggressive Timing

- **Before:** Popup triggered immediately on mouse leave
- **After:** 30-second delay before popup becomes active
- **Before:** Guilt-inducing copy ("I'll keep wasting 15 hours")
- **After:** Simple "No thanks" button

### 2. Better User Control

- **Before:** Popup could show multiple times per session
- **After:** "No thanks" button dismisses permanently (localStorage)
- **Before:** Only session-based dismissal
- **After:** Permanent dismissal option

### 3. More Respectful UX

- Users must stay on page for 30 seconds before popup becomes active
- Clear way to permanently dismiss
- Less manipulative copy

## About the 404 Issue

The "existing campaigns" link might be:

1. A link in the dashboard that should go to `/pitch/history` (which works - tested 200 response)
2. A navigation item that needs updating
3. A cached link from an old version

**To investigate:** Check where you're clicking "existing campaigns" and I can fix the specific link.

## Files Modified

- `components/ExitIntentPopup.tsx` - Made less aggressive and more respectful

## Deploy

These changes need to be deployed to take effect:

```bash
git add components/ExitIntentPopup.tsx
git commit -m "Make exit intent popup less aggressive"
git push
```

The popup will now:

- Wait 30 seconds before becoming active
- Allow permanent dismissal
- Use less manipulative copy
