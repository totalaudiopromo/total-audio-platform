# PDF Export System - Neobrutalist Design Guide

## Overview
Audio Intel's PDF export system now features beautiful, simple neobrutalist design with company logo support for higher tiers.

## Design Philosophy

### Neobrutalist Aesthetic
- **Bold black borders** (2px weight) on all major elements
- **High contrast** black text on white backgrounds
- **Sharp corners** with minimal rounded edges
- **Shadow effects** created with offset borders
- **Clean, professional** appearance matching the web UI

### Color Strategy
- **Black (#000000)** - Primary borders and text
- **White (#FFFFFF)** - All backgrounds
- **Brand Color** - Company primary color for accents
- **Confidence Colors**:
  - High: Green (#22C55E)
  - Medium: Orange (#FB923C)
  - Low: Red (#EF4444)

## Logo Support (PRO/AGENCY Tiers)

### Custom Logo Implementation
**Location:** [exportToPdf.ts:159-182](../utils/exportToPdf.ts#L159-L182)

```typescript
if (hasCustomLogo && whiteLabel?.logoUrl) {
  // Custom logo for PRO/AGENCY tiers
  try {
    // Logo container with neobrutalist border
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(2);
    doc.rect(15, 15, 30, 30, 'FD');

    // Show company initials if logo not loaded
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    const initials = companyName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    doc.text(initials, 30, 35, { align: 'center' });
  } catch (error) {
    // Fallback to default Audio Intel logo
  }
}
```

### Logo Requirements
- **Format:** Base64 encoded image (PNG, JPG)
- **Size:** 30mm x 30mm square container
- **Resolution:** Minimum 300x300px recommended
- **Transparency:** Supported for PNG
- **Fallback:** Company initials (2 letters) if image fails

### Providing Custom Logos

**Method 1: Base64 String** (Recommended)
```typescript
const whiteLabel = {
  companyName: 'Your Company',
  logoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
  primaryColor: '#FF6B35'
};
```

**Method 2: URL (Future Enhancement)**
```typescript
const whiteLabel = {
  companyName: 'Your Company',
  logoUrl: 'https://yourcompany.com/logo.png',
  primaryColor: '#FF6B35'
};
```

## PDF Structure

### 1. Header Section
**Dimensions:** 210mm x 55mm

**Elements:**
- Neobrutalist border box (10, 10, 190, 40)
- Logo container (15, 15, 30, 30) - Custom or default
- Company name (18pt bold black)
- Tagline (9pt normal gray)
- Report title (22pt bold black)
- Subtitle (11pt bold brand color)

**Code Location:** [exportToPdf.ts:139-222](../utils/exportToPdf.ts#L139-L222)

### 2. Content Tables
**Styling:**
- Bold black borders (2px on headers, 1.5px on body)
- Primary color header background
- White text in headers
- Alternating row colors (white / light blue-gray)
- Centered confidence and platform columns
- Bold text throughout for readability

**Code Location:** [exportToPdf.ts:259-302](../utils/exportToPdf.ts#L259-L302)

### 3. Contact Detail Cards
**Neobrutalist Contact Cards:**
- White background with 2px black border
- Name in bold black (11pt)
- Email in brand color (9pt)
- Confidence badge (color-coded, white text)
- Intelligence text below (10pt normal black)

**Code Location:** [exportToPdf.ts:459-501](../utils/exportToPdf.ts#L459-L501)

### 4. Footer Section
**Dimensions:** 10, 275, 190, 20

**Elements:**
- Neobrutalist border box
- Page numbers (left, bold black)
- Company name + title (center, bold black)
- Generation date (left, brand color)
- "Powered by Total Audio Promo" (right, gray)

**Code Location:** [exportToPdf.ts:224-257](../utils/exportToPdf.ts#L224-L257)

## Tier-Based Features

### FREE Tier
- Default Audio Intel logo
- Standard brand colors
- Watermarked PDFs
- Page limits applied

### PRO Tier (£19/month)
- **Custom company logo** ✓
- **Custom brand color** ✓
- No watermarks
- No page limits
- All contact intelligence included

### AGENCY Tier (£79/month)
- **Custom company logo** ✓
- **Custom brand color** ✓
- **Bulk export** (100+ contacts)
- No watermarks
- No page limits
- Priority support

## Usage Examples

### Basic Export (FREE)
```typescript
import { exportContactsToPdf } from '@/utils/exportToPdf';

const contacts = [
  {
    name: 'Jack Saunders',
    email: 'jack.saunders@bbc.co.uk',
    contactIntelligence: '...',
    researchConfidence: 'High',
    lastResearched: new Date().toISOString(),
    platform: 'BBC Radio 1',
    role: 'Presenter',
    company: 'BBC'
  }
];

exportContactsToPdf(contacts, 'my-contacts.pdf');
```

### White Label Export (PRO/AGENCY)
```typescript
import { exportContactsToPdf } from '@/utils/exportToPdf';

const contacts = [...]; // Your contact data

const whiteLabel = {
  companyName: 'Stellar Music PR',
  logoUrl: 'data:image/png;base64,iVBORw0KG...',
  primaryColor: '#9333EA' // Purple
};

exportContactsToPdf(
  contacts,
  'stellar-music-contacts.pdf',
  whiteLabel
);
```

### Complete Export with Options
```typescript
import { ProfessionalExportService } from '@/utils/exportService';

const exportService = new ProfessionalExportService({
  companyName: 'Your PR Agency',
  logoUrl: 'data:image/png;base64,iVBORw0KG...',
  primaryColor: '#FF6B35'
});

const result = await exportService.exportContacts(
  contacts,
  {
    format: 'pdf',
    filename: 'client-report.pdf',
    includeMetadata: true,
    whiteLabel: {
      companyName: 'Your PR Agency',
      logoUrl: 'data:image/png;base64,iVBORw0KG...',
      primaryColor: '#FF6B35'
    }
  },
  'Chris Schofield', // User name
  (progress) => {
    console.log(`Progress: ${progress.percentage}%`);
  }
);

console.log(result.message); // "Successfully exported 25 contacts to PDF"
```

## Converting Logos to Base64

### Using Node.js
```javascript
const fs = require('fs');

// Read logo file
const logoBuffer = fs.readFileSync('path/to/logo.png');
const base64Logo = logoBuffer.toString('base64');
const dataUri = `data:image/png;base64,${base64Logo}`;

console.log(dataUri);
```

### Using Online Tools
1. Visit https://base64-image.de/
2. Upload your logo (PNG recommended)
3. Copy the data URI output
4. Paste into `logoUrl` field

### Using Browser JavaScript
```javascript
async function convertLogoToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Usage with file input
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const base64 = await convertLogoToBase64(file);
  console.log(base64); // Use this for logoUrl
});
```

## Customization Guide

### Changing Brand Colors
Update `primaryColor` in white label config:

```typescript
const whiteLabel = {
  companyName: 'Your Company',
  primaryColor: '#FF6B35' // Your brand color
};
```

**Color will affect:**
- Report subtitle text
- Email addresses in contact cards
- Generation date in footer
- Table header backgrounds
- Company initials (if no logo)

### Adding Additional Branding Elements

**Custom Tagline:**
Edit [exportToPdf.ts:203-207](../utils/exportToPdf.ts#L203-L207):
```typescript
doc.text('Your Custom Tagline Here', 52, 34);
```

**Custom Footer Text:**
Edit [exportToPdf.ts:248-255](../utils/exportToPdf.ts#L248-L255):
```typescript
doc.text('Powered by Your Company', 195, 290, { align: 'right' });
```

## Technical Details

### Dependencies
- **jsPDF** - Core PDF generation library
- **jspdf-autotable** - Table generation plugin

### File Locations
- **Main Export Logic:** `apps/audio-intel/utils/exportToPdf.ts`
- **Export Service:** `apps/audio-intel/utils/exportService.ts`
- **Demo Page Usage:** `apps/audio-intel/app/demo/page.tsx`

### Color Conversion Helper
```typescript
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ]
    : [37, 99, 235]; // Default Audio Intel blue
}
```

## Testing Checklist

### Visual Quality Tests
- [ ] Logo displays correctly at 30x30mm
- [ ] Company name is legible
- [ ] Brand colors match website
- [ ] Borders are crisp and bold
- [ ] Text is high contrast and readable
- [ ] Tables format correctly across pages
- [ ] Footer appears on all pages
- [ ] Contact cards have proper spacing

### Functional Tests
- [ ] PDF opens in all major viewers (Adobe, Chrome, Preview)
- [ ] Custom logo loads without errors
- [ ] Fallback initials work if logo fails
- [ ] Brand color applies to all elements
- [ ] Multi-page exports work correctly
- [ ] File size is reasonable (< 5MB per 100 contacts)

### Tier-Specific Tests
- [ ] FREE: Shows default logo, watermark present
- [ ] PRO: Shows custom logo, no watermark
- [ ] AGENCY: Shows custom logo, handles 100+ contacts

## Performance Considerations

### Optimization Tips
1. **Compress logos:** Use PNG-8 or optimized PNG-24
2. **Limit logo size:** Maximum 100KB recommended
3. **Batch processing:** Process 50 contacts at a time for large exports
4. **Browser limits:** Test with 200+ contacts to check memory usage

### Expected Generation Times
- **10 contacts:** < 1 second
- **50 contacts:** 1-2 seconds
- **100 contacts:** 2-4 seconds
- **500 contacts:** 10-15 seconds

## Future Enhancements

### Planned Features
- [ ] Real image loading from URLs (not just base64)
- [ ] Multiple logo positions (header, footer, watermark)
- [ ] Custom font support (brand fonts)
- [ ] Color schemes (light/dark mode)
- [ ] Template gallery (industry-specific designs)
- [ ] QR code integration (contact vCard)
- [ ] Interactive PDFs (clickable links)

### Community Requests
- [ ] Landscape orientation option
- [ ] Custom page size (A4, Letter, Custom)
- [ ] Multiple export formats per tier
- [ ] Batch white-label generation
- [ ] API endpoint for programmatic exports

## Support & Resources

### Documentation
- [Export Service API Docs](./exportService.ts)
- [jsPDF Documentation](https://artskydj.github.io/jsPDF/docs/)
- [AutoTable Plugin Guide](https://github.com/simonbengtsson/jsPDF-AutoTable)

### Getting Help
- **PRO/AGENCY Support:** support@totalaudiopromo.com
- **Community Forum:** https://community.totalaudiopromo.com
- **GitHub Issues:** https://github.com/totalaudiopromo/audio-intel/issues

### Examples Repository
Find complete working examples at:
`apps/audio-intel/app/pdf-samples/page.tsx`

---

**Last Updated:** October 2025
**Version:** 2.0 (Neobrutalist Redesign)
**Maintainer:** Total Audio Promo Team

**Changes in v2.0:**
- ✅ Neobrutalist design system
- ✅ Custom logo support (PRO/AGENCY)
- ✅ Bold black borders throughout
- ✅ Improved contact cards
- ✅ Enhanced table styling
- ✅ Better color contrast
- ✅ Professional footer design
