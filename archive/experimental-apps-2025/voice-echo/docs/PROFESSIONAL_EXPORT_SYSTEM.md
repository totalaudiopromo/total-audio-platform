# Professional Export System

A comprehensive export solution for Audio Intel that provides one-click export capabilities for contacts, analytics, and search results with professional email delivery and white-label branding support.

## Features

### 🚀 One-Click Export

- **Multiple Formats**: CSV, Excel, and PDF exports
- **Batch Operations**: Export multiple data types simultaneously
- **Professional Templates**: Agency-ready email templates
- **White-Label Support**: Custom branding for agencies

### 📊 Export Types

1. **Contact Exports**: Enriched contact intelligence with research data
2. **Analytics Reports**: Performance metrics and insights
3. **Search Results**: Curated music industry contacts
4. **Batch Exports**: Multiple data types in one operation

### 📧 Email Delivery

- **Automated Delivery**: Professional email templates
- **Custom Messaging**: Personalized export emails
- **Attachment Support**: Files delivered via email
- **White-Label Branding**: Custom company branding

## Quick Start

### Basic Usage

```typescript
import { ProfessionalExportService } from '../utils/exportService';

// Create export service
const exportService = new ProfessionalExportService();

// Export contacts
const result = await exportService.exportContacts(contacts, {
  format: 'excel',
  emailDelivery: true,
  recipientEmail: 'user@example.com',
});
```

### With White-Label Configuration

```typescript
const exportService = new ProfessionalExportService({
  companyName: 'Your Agency Name',
  primaryColor: '#FF6B35',
  logoUrl: 'https://your-logo.com/logo.png',
});
```

## API Reference

### ProfessionalExportService

#### Constructor

```typescript
new ProfessionalExportService(whiteLabelConfig?: {
  companyName?: string;
  logoUrl?: string;
  primaryColor?: string;
})
```

#### Methods

##### exportContacts()

```typescript
async exportContacts(
  contacts: ContactData[],
  options: ExportOptions,
  userName?: string
): Promise<{ success: boolean; downloadUrl?: string; message: string }>
```

##### exportAnalytics()

```typescript
async exportAnalytics(
  analyticsData: AnalyticsData,
  options: ExportOptions,
  userName?: string
): Promise<{ success: boolean; downloadUrl?: string; message: string }>
```

##### exportSearchResults()

```typescript
async exportSearchResults(
  searchData: SearchResultsData,
  options: ExportOptions,
  userName?: string
): Promise<{ success: boolean; downloadUrl?: string; message: string }>
```

##### batchExport()

```typescript
async batchExport(
  data: {
    contacts?: ContactData[];
    analytics?: AnalyticsData;
    searchResults?: SearchResultsData;
  },
  options: ExportOptions,
  userName?: string
): Promise<{
  success: boolean;
  results: Array<{ type: string; success: boolean; message: string; downloadUrl?: string }>;
}>
```

### ExportOptions Interface

```typescript
interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  emailDelivery?: boolean;
  recipientEmail?: string;
  customMessage?: string;
  whiteLabel?: {
    companyName?: string;
    logoUrl?: string;
    primaryColor?: string;
  };
  filename?: string;
}
```

## Data Interfaces

### ContactData

```typescript
interface ContactData {
  name: string;
  email: string;
  contactIntelligence: string;
  researchConfidence?: string;
  lastResearched?: string;
  platform?: string;
  role?: string;
  company?: string;
}
```

### AnalyticsData

```typescript
interface AnalyticsData {
  totalContacts: number;
  totalEnrichments: number;
  successRate: number;
  averageConfidence: number;
  platformBreakdown: Record<string, number>;
  dailyEnrichments: Array<{ date: string; count: number }>;
  topPlatforms: Array<{ platform: string; count: number; percentage: number }>;
  performanceMetrics: {
    averageProcessingTime: number;
    cacheHitRate: number;
    errorRate: number;
  };
}
```

### SearchResultsData

```typescript
interface SearchResultsData {
  query: string;
  results: ContactData[];
  totalFound: number;
  filters?: Record<string, any>;
}
```

## React Component Usage

### ExportButtons Component

```tsx
import ExportButtons from '../components/ExportButtons';

<ExportButtons
  contacts={contacts}
  analytics={analytics}
  searchResults={searchResults}
  userName="John Doe"
  whiteLabel={{
    companyName: 'Your Agency',
    primaryColor: '#FF6B35',
  }}
  onExportComplete={result => {
    console.log('Export completed:', result);
  }}
/>;
```

## Email Templates

The system includes three professional email templates:

1. **Contact Export Email**: For enriched contact deliveries
2. **Analytics Export Email**: For performance reports
3. **Search Results Email**: For search result deliveries

### Template Features

- Responsive design
- Professional branding
- Custom messaging support
- Download links
- White-label customization

## File Formats

### CSV Export

- Comma-separated values
- UTF-8 encoding
- Proper escaping for special characters
- All contact fields included

### Excel Export

- Multiple worksheets for analytics
- Formatted columns
- Professional styling
- Auto-sized columns

### PDF Export

- Professional layout
- Charts and tables
- Branded headers and footers
- Multi-page support

## Configuration

### Environment Variables

```env
RESEND_API_KEY=your_resend_api_key
```

### Email Configuration

The system uses Resend for email delivery. Configure your Resend API key in the environment variables.

## Demo Page

Visit `/export-demo` to see the complete export system in action with sample data.

## Agency Integration

### White-Label Setup

1. **Configure Branding**:

   ```typescript
   const whiteLabelConfig = {
     companyName: 'Your Agency Name',
     primaryColor: '#YourBrandColor',
     logoUrl: 'https://your-logo.com/logo.png',
   };
   ```

2. **Custom Email Templates**:
   - Templates automatically use your branding
   - Custom colors and logos
   - Agency-specific messaging

3. **Professional Reports**:
   - Your company name on all exports
   - Custom color schemes
   - Professional formatting

## Error Handling

The export system includes comprehensive error handling:

- **Validation**: Checks for required data and valid email addresses
- **Format Support**: Validates export format compatibility
- **Email Delivery**: Handles email service errors gracefully
- **User Feedback**: Clear success/error messages

## Performance Considerations

- **Large Datasets**: Optimized for handling thousands of contacts
- **Memory Management**: Efficient file generation
- **Async Operations**: Non-blocking export processes
- **Progress Feedback**: Real-time status updates

## Security

- **Email Validation**: Validates recipient email addresses
- **File Security**: Secure file generation and delivery
- **API Protection**: Rate limiting and validation
- **Data Privacy**: No data stored in exports

## Troubleshooting

### Common Issues

1. **Email Not Sending**:
   - Check RESEND_API_KEY configuration
   - Verify recipient email format
   - Check email service status

2. **Export Fails**:
   - Ensure data is properly formatted
   - Check browser console for errors
   - Verify file permissions

3. **PDF Generation Issues**:
   - Check jsPDF installation
   - Verify data structure
   - Check browser compatibility

### Debug Mode

Enable debug logging by setting:

```typescript
console.log('Export debug:', { data, options, result });
```

## Future Enhancements

- [ ] Scheduled exports
- [ ] Export templates
- [ ] Advanced filtering
- [ ] Integration with CRMs
- [ ] Custom report builder
- [ ] Export analytics
- [ ] Multi-language support

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.
