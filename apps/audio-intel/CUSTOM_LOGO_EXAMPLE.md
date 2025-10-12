# Custom Logo PDF Export - Quick Start Guide

## For PRO/AGENCY Tier Users

### Step 1: Prepare Your Logo

Your logo must be converted to a base64 data URI. Here are three easy methods:

#### Method A: Online Converter (Fastest)
1. Visit https://base64-image.de/
2. Upload your logo (PNG or JPG, square format recommended)
3. Copy the entire data URI output (starts with `data:image/png;base64,`)

#### Method B: Command Line (macOS/Linux)
```bash
# Navigate to your logo file
cd /path/to/your/logo

# Convert to base64
base64 -i your-logo.png

# Or create full data URI in one command
echo "data:image/png;base64,$(base64 -i your-logo.png)" | pbcopy
```

#### Method C: JavaScript in Browser Console
```javascript
// Use a file input on any webpage
const input = document.createElement('input');
input.type = 'file';
input.accept = 'image/*';
input.onchange = async (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    console.log('Copy this data URI:');
    console.log(reader.result);
  };
  reader.readAsDataURL(file);
};
input.click();
```

### Step 2: Use Your Logo in Exports

#### Example 1: Basic Custom Logo Export
```typescript
import { exportContactsToPdf } from '@/utils/exportToPdf';

const contacts = [
  {
    name: 'Jack Saunders',
    email: 'jack.saunders@bbc.co.uk',
    contactIntelligence: 'BBC Radio 1 presenter, hosts "Jack Saunders New Music" show...',
    researchConfidence: 'High',
    lastResearched: new Date().toISOString(),
    platform: 'BBC Radio 1',
    role: 'Presenter',
    company: 'BBC'
  }
  // ... more contacts
];

const whiteLabel = {
  companyName: 'Stellar Music PR',
  logoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANS...', // Your base64 logo
  primaryColor: '#9333EA' // Your brand color (purple in this example)
};

exportContactsToPdf(contacts, 'stellar-music-contacts.pdf', whiteLabel);
```

#### Example 2: Full Export with Progress Tracking
```typescript
import { ProfessionalExportService } from '@/utils/exportService';

const exportService = new ProfessionalExportService({
  companyName: 'Liberty Records PR',
  logoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANS...', // Your base64 logo
  primaryColor: '#FF6B35' // Orange brand color
});

const result = await exportService.exportContacts(
  contacts,
  {
    format: 'pdf',
    filename: 'liberty-contacts-report.pdf',
    includeMetadata: true,
    whiteLabel: {
      companyName: 'Liberty Records PR',
      logoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
      primaryColor: '#FF6B35'
    }
  },
  'Your Name',
  (progress) => {
    console.log(`Exporting: ${progress.percentage}%`);
  }
);

console.log(result.message); // "Successfully exported 25 contacts to PDF"
```

### Logo Requirements

- **Format**: PNG or JPG (PNG recommended for transparency)
- **Size**: Square format works best (e.g., 500x500px, 1000x1000px)
- **Resolution**: Minimum 300x300px for print quality
- **File Size**: Keep under 100KB for best performance
- **Colors**: Works with any color scheme

### Visual Result

Your PDF will have:

```
╔══════════════════════════════════════╗
║  ┌──────┐                            ║
║  │ YOUR │  YOUR COMPANY NAME          ║
║  │ LOGO │  Contact Intelligence Rep  ║
║  └──────┘                            ║
╚══════════════════════════════════════╝

  ENRICHED CONTACT INTELLIGENCE
  25 Contacts Analyzed

  - Bold black borders (neobrutalist style)
  - Your brand color throughout
  - Professional appearance
```

### Fallback Behavior

If your logo fails to load, the system will automatically show your company's initials in a styled box:

```
╔═════════╗
║   SM    ║  Stellar Music PR
║         ║  Contact Intelligence Report
╚═════════╝
```

This ensures your PDFs always look professional, even if there's an image loading issue.

### Testing Your Logo

1. Start with a small test export (5-10 contacts)
2. Check the PDF renders correctly
3. Verify logo appears sharp and centered
4. Confirm brand color matches your website
5. Test on multiple devices (desktop, mobile, tablet)

### Brand Color Examples

Choose a primary color that represents your brand:

- **Purple Agency**: `#9333EA` - Creative, modern
- **Orange PR**: `#FF6B35` - Energetic, bold
- **Blue Professional**: `#2563EB` - Trust, corporate
- **Green Music**: `#22C55E` - Fresh, organic
- **Red Rock**: `#EF4444` - Passionate, powerful
- **Magenta Creative**: `#EC4899` - Unique, artistic

### Common Issues & Solutions

**Issue**: Logo doesn't appear
- **Solution**: Verify your data URI starts with `data:image/png;base64,` or `data:image/jpeg;base64,`

**Issue**: Logo looks pixelated
- **Solution**: Use a higher resolution source image (1000x1000px minimum)

**Issue**: PDF file size too large
- **Solution**: Compress your logo before converting to base64 (use TinyPNG or similar)

**Issue**: Logo is off-center
- **Solution**: Ensure your source image is perfectly square

### Real-World Example: Liberty Records PR

```typescript
// Liberty Records PR configuration
const libertyWhiteLabel = {
  companyName: 'Liberty Records PR',
  logoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...',
  primaryColor: '#FF6B35'
};

// Export 47 contacts for Delilah Bon campaign
const delilahContacts = [
  // BBC Radio 1 contacts
  { name: 'Jack Saunders', email: 'jack.saunders@bbc.co.uk', ... },
  { name: 'Clara Amfo', email: 'clara.amfo@bbc.co.uk', ... },

  // Spotify curators
  { name: 'Matt Stocks', email: 'matt@spotify.com', ... },

  // ... 44 more contacts
];

exportContactsToPdf(
  delilahContacts,
  'delilah-bon-radio-campaign.pdf',
  libertyWhiteLabel
);
```

**Result**: Professional 12-page PDF with Liberty Records PR branding, ready to share with the band.

---

## Need Help?

**PRO/AGENCY Support**: support@totalaudiopromo.com
**Community Forum**: https://community.totalaudiopromo.com
**Documentation**: [PDF_EXPORT_GUIDE.md](./PDF_EXPORT_GUIDE.md)

**Questions?**
- "Can I use my logo without base64?" → Not yet, but URL loading is planned
- "Can I change the logo per export?" → Yes, pass different `whiteLabel` config each time
- "Does FREE tier get custom logos?" → No, custom logos are PRO/AGENCY only

---

**Last Updated**: October 2025
**Tier**: PRO (£19/month) and AGENCY (£79/month) only
**Feature Status**: ✅ Fully operational with neobrutalist design
