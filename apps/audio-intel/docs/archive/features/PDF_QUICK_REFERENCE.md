# PDF Export - Quick Reference Card

## 🎯 Quick Facts

**Status**: ✅ Production ready
**Design**: Neobrutalist v2.0
**Tiers**: FREE (default logo) | PRO (custom logo, £19/mo) | AGENCY (bulk + custom logo, £79/mo)
**Performance**: < 1 second for 10 contacts, < 5 seconds for 100 contacts
**File Size**: ~140KB per 10 contacts, ~750KB per 100 contacts

---

## 📝 Basic Usage

### FREE Tier (Default Branding)

```typescript
import { exportContactsToPdf } from '@/utils/exportToPdf';

exportContactsToPdf(contacts, 'my-contacts.pdf');
```

### PRO/AGENCY Tier (Custom Branding)

```typescript
exportContactsToPdf(contacts, 'client-report.pdf', {
  companyName: 'Your Company',
  logoUrl: 'data:image/png;base64,iVBORw0KG...',
  primaryColor: '#9333EA',
});
```

---

## 🎨 Design System

**Borders**: 2px black (bold neobrutalist)
**Background**: Pure white (#FFFFFF)
**Text**: Pure black (#000000)
**Brand Color**: Your custom hex color
**Typography**: Helvetica Bold throughout
**Corners**: Sharp (0-2px radius)

---

## 🖼️ Logo Support

**Format**: Base64 data URI (`data:image/png;base64,`)
**Size**: 30x30mm container (300x300px minimum)
**Fallback**: Company initials (2 letters, bold, brand color)
**Conversion**: https://base64-image.de/ (online tool)

---

## 🎨 Brand Colors

**Purple Agency**: `#9333EA` - Creative, modern
**Orange PR**: `#FF6B35` - Energetic, bold
**Blue Professional**: `#2563EB` - Trust, corporate
**Green Music**: `#22C55E` - Fresh, organic
**Red Rock**: `#EF4444` - Passionate, powerful
**Magenta Creative**: `#EC4899` - Unique, artistic

---

## 📊 Tier Comparison

| Feature             | FREE | PRO (£19/mo) | AGENCY (£79/mo) |
| ------------------- | ---- | ------------ | --------------- |
| Neobrutalist Design | ✅   | ✅           | ✅              |
| Custom Logo         | ❌   | ✅           | ✅              |
| Custom Brand Color  | ❌   | ✅           | ✅              |
| Bulk Export (100+)  | ❌   | ❌           | ✅              |
| No Watermarks       | ❌   | ✅           | ✅              |
| Priority Support    | ❌   | ❌           | ✅              |

---

## 📚 Documentation

**Technical Guide**: [PDF_EXPORT_GUIDE.md](./PDF_EXPORT_GUIDE.md)
**Visual Examples**: [PDF_VISUAL_EXAMPLES.md](./PDF_VISUAL_EXAMPLES.md)
**Logo Quick Start**: [CUSTOM_LOGO_EXAMPLE.md](./CUSTOM_LOGO_EXAMPLE.md)
**Before/After**: [PDF_DESIGN_COMPARISON.md](./PDF_DESIGN_COMPARISON.md)
**Implementation**: [PDF_IMPLEMENTATION_COMPLETE.md](./PDF_IMPLEMENTATION_COMPLETE.md)
**Code Location**: [exportToPdf.ts](../utils/exportToPdf.ts)

---

## 🔧 Common Commands

**Convert logo to base64** (macOS):

```bash
echo "data:image/png;base64,$(base64 -i logo.png)" | pbcopy
```

**TypeScript type check**:

```bash
npx tsc --noEmit
```

**Run Audio Intel dev server**:

```bash
npm run dev:audio-intel
```

---

## ✨ Key Features

✅ Bold 2px black borders throughout
✅ High contrast black on white design
✅ Custom logo support (PRO/AGENCY)
✅ Company initials fallback
✅ Custom brand color system
✅ Color-coded confidence badges
✅ Professional table styling
✅ Neobrutalist contact cards
✅ Branded footer on all pages
✅ Efficient file sizes

---

## 🎯 Visual Structure

```
╔════════════════════════════╗
║ [LOGO] Your Company        ║  Header (custom branding)
╚════════════════════════════╝

ENRICHED CONTACT INTELLIGENCE
25 Contacts Analyzed            Summary

╔════════════════════════════╗
║ Name ║ Email ║ Confidence  ║  Table (brand color header)
╠════════════════════════════╣
║ ...  ║ ...   ║ [HIGH]      ║
╚════════════════════════════╝

╔════════════════════════════╗
║ Jack Saunders    [HIGH] ██ ║  Contact Card
║ jack@bbc.co.uk (color)     ║
╚════════════════════════════╝

BBC Radio 1 - UK national...   Intelligence Text

╔════════════════════════════╗
║ Page 1 of 3  Your Company ║  Footer
╚════════════════════════════╝
```

---

## 💡 Pro Tips

1. **Logo Size**: Keep under 100KB for best performance
2. **Brand Color**: Match your website for consistency
3. **Square Logos**: Work best in the 30x30mm container
4. **Testing**: Export 5-10 contacts first to verify appearance
5. **Fallback**: System automatically uses initials if logo fails
6. **Format**: PNG recommended for transparency support

---

## 🚀 Real-World Examples

**Radio Promoter** (47 contacts, 12 pages):

```typescript
exportContactsToPdf(contacts, 'delilah-bon-campaign.pdf', {
  companyName: 'Stellar Music PR',
  logoUrl: 'data:image/png;base64,...',
  primaryColor: '#9333EA',
});
```

**PR Agency** (125 contacts, 32 pages):

```typescript
exportContactsToPdf(contacts, 'liberty-campaign.pdf', {
  companyName: 'Liberty Records PR',
  logoUrl: 'data:image/png;base64,...',
  primaryColor: '#FF6B35',
});
```

**Independent Artist** (15 contacts, 4 pages):

```typescript
exportContactsToPdf(contacts, 'my-radio-campaign.pdf');
// Uses default Audio Intel branding
```

---

## 📞 Support

**PRO/AGENCY**: support@totalaudiopromo.com
**Community**: https://community.totalaudiopromo.com
**Issues**: GitHub Issues

---

**Last Updated**: October 2025
**Version**: 2.0 (Neobrutalist Redesign)
**Status**: ✅ Production Ready
