
# Texture System Setup

## Overview
The texture system provides visual depth and character to the Audio Intel interface using both image-based and CSS-only textures.

## Image Textures
- Located in: /public/textures/
- Formats: JPG (optimized for web)
- Sizes: Various (optimized for performance)

## CSS-only Textures
Fallback textures that work even when images fail to load:
- Paper: Subtle dot pattern
- Grain: Diagonal noise pattern  
- Luma: Grid pattern

## Usage
```tsx
import { TextureOverlay, TextureBackground, TextureCard } from "@/components/ui/texture-overlay"

// Overlay texture on existing content
<TextureOverlay textureType="paper" textureVariant={1} blendMode="overlay" opacity={0.15}>
  <div>Your content here</div>
</TextureOverlay>

// Background texture
<TextureBackground textureType="grain" textureVariant={2} blendMode="multiply" opacity={0.08}>
  <div>Your content here</div>
</TextureBackground>

// Card with texture
<TextureCard textureType="luma" textureVariant={3} rotation={-1} floating={true}>
  <div>Your content here</div>
</TextureCard>
```

## Performance Notes
- CSS-only textures are always available as fallbacks
- Image textures are loaded asynchronously
- Large texture files are automatically optimized
- Blend modes and opacity can be adjusted for performance

## Troubleshooting
If textures don't appear:
1. Check browser console for image loading errors
2. Verify texture files exist in /public/textures/
3. CSS-only textures should always work as fallbacks
4. Check network tab for failed image requests
