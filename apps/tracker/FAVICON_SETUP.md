# Favicon & App Icon Setup Instructions

## Required Files

Place these files in `/Users/chrisschofield/workspace/active/total-audio-platform/apps/tracker/public/`:

### 1. **favicon.ico**(16x16 and 32x32)

- Standard browser favicon
- Should use Total Audio Promo logo or "T" monogram
- Generate at: https://realfavicongenerator.net/

### 2. **apple-touch-icon.png**(180x180)

- iOS home screen icon
- Should be 180x180px PNG
- No transparency, add background color

### 3. **icon.png**(512x512)

- Android/PWA icon
- 512x512px PNG with transparency
- Used for app manifest

### 4. **manifest.json**(Web App Manifest)

```json
{
  "name": "Tracker - Campaign Tracking",
  "short_name": "Tracker",
  "description": "AI-powered campaign tracking for music promoters",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#9333ea",
  "icons": [
    {
      "src": "/icon.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png"
    }
  ]
}
```

## Implementation

### Add to `app/layout.tsx` in `<head>`:

```tsx
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="icon" type="image/png" sizes="512x512" href="/icon.png" />
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#9333ea" />
```

## Quick Generation Steps

1. **Use existing logo**from `/public/images/total_audio_promo_logo_trans.png`

2. **Generate favicons**at https://realfavicongenerator.net/:
   - Upload logo
   - Adjust settings:
     - iOS: Add purple (#9333ea) background
     - Android: Keep transparent
     - Windows: Purple background
   - Download package

3. **Place files**in `/public/` directory

4. **Update layout.tsx**with links above

5. **Test**:
   - Clear browser cache
   - Load `http://localhost:3000`
   - Check browser tab icon
   - Add to iOS home screen (test on iPhone)
   - Add to Android home screen

## Brand Colors

- **Primary Purple**: `#9333ea` (--color-purple-600)
- **Background**: `#ffffff` (white)
- **Text**: `#111827` (--color-gray-900)

## Notes

- Favicon appears in browser tabs and bookmarks
- Apple Touch Icon appears when user adds site to iOS home screen
- Manifest.json enables "Add to Home Screen" functionality
- Theme color affects Android Chrome toolbar color

## Quick Fix (Temporary)

If you don't have time to create custom icons, use a text-based favicon generator:

```bash
# Using ImageMagick (if installed)
convert -size 32x32 -background "#9333ea" -fill white -font Arial-Bold \
  -gravity center label:"T" favicon.ico
```

Or use online tool: https://favicon.io/favicon-generator/

- Text: "T"
- Background: #9333ea (purple)
- Font: Inter Bold
- Shape: Square
