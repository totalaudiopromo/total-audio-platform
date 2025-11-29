# CSV Workflow Guide: Audio Intel → Tracker Integration

## Overview

The CSV workflow enables seamless transfer of enriched contacts from **Audio Intel**to **Tracker**for campaign management. This guide covers the complete end-to-end workflow for radio promoters, PR agencies, and independent artists.

## Business Value

**For Radio Promoters (85% conversion rate)**:

- Enrich 50-100 radio contacts in Audio Intel (15 min vs 15 hours manual)
- Send directly to Tracker with all intelligence data preserved
- Start tracking responses immediately with enriched context

**For PR Agencies**:

- Transform client spreadsheet chaos into organized campaigns
- Maintain enrichment data throughout campaign lifecycle
- Professional client deliverables with both tools

**For Artists**:

- Research contacts once, use data everywhere
- Track pitch responses alongside contact intelligence
- Single source of truth for promotion data

## Quick Start

### Option A: Direct Send (Recommended)

1. **In Audio Intel**(`/demo`):
   - Upload contacts spreadsheet or paste emails
   - Run enrichment (auto-detects BBC Radio 1, Spotify, etc.)
   - Click **"Send to Tracker"**button
   - CSV downloads automatically + Tracker opens

2. **In Tracker**(`/dashboard/import`):
   - Import page auto-detects Audio Intel source
   - Review preview of enriched contacts
   - Click "Import" to add to campaign
   - Start tracking responses

### Option B: Manual CSV Export/Import

1. **Export from Audio Intel**:
   - Use "Export CSV" button for universal format
   - Save file locally

2. **Import to Tracker**:
   - Navigate to `/dashboard/import`
   - Upload CSV file
   - Map columns if needed
   - Import contacts

## Technical Implementation

### CSV Format Specification

**Audio Intel Export Format**:

```csv
Name,Email,Outlet,Role,Status,Notes,Contacted Date,Response Date
Annie Mac,annie@bbc.co.uk,BBC Radio,DJ/Presenter,pending,"Intelligence: BBC Radio 1 Future Sounds host...
Confidence: High
Researched: 2025-10-13
Company: BBC",,,
```

**Field Mappings**:
| Audio Intel Field | Tracker Field | Description |
|-------------------|---------------|-------------|
| `name` | `Name` | Contact full name |
| `email` | `Email` | Contact email address |
| `platform` / `company` | `Outlet` | Platform or organization |
| `role` | `Role` | Job title or position |
| N/A | `Status` | Always `pending` on import |
| `contactIntelligence` + metadata | `Notes` | Enrichment data preserved |
| N/A | `Contacted Date` | Empty, filled when contacted |
| N/A | `Response Date` | Empty, filled when responded |

### API Endpoints

#### Audio Intel: Export to Tracker

**Endpoint**: `POST /api/export-to-tracker`

**Request**:

```json
{
  "contacts": [
    {
      "name": "Annie Mac",
      "email": "annie@bbc.co.uk",
      "contactIntelligence": "BBC Radio 1 Future Sounds host...",
      "researchConfidence": "High",
      "lastResearched": "2025-10-13T12:00:00Z",
      "platform": "BBC Radio",
      "role": "DJ/Presenter",
      "company": "BBC"
    }
  ],
  "campaignName": "BBC Radio 1 Campaign Q1 2025",
  "includeEnrichmentData": true
}
```

**Response**:

```json
{
  "success": true,
  "format": "tracker-csv",
  "filename": "bbc-radio-1-campaign-q1-2025-contacts-2025-10-13.csv",
  "content": "Name,Email,Outlet,Role,Status,Notes,Contacted Date,Response Date\n...",
  "contactsCount": 42,
  "downloadUrl": "data:text/csv;charset=utf-8,...",
  "deepLink": "https://tracker.totalaudiopromo.com/dashboard/import?source=audio-intel&contacts=42"
}
```

#### Tracker: Import Campaigns

**Endpoint**: `POST /api/campaigns/import`

**Request**:

```json
{
  "campaigns": [
    {
      "name": "Annie Mac",
      "artist_name": "sadact",
      "platform": "BBC Radio",
      "status": "active",
      "notes": "Imported from Audio Intel..."
    }
  ]
}
```

**Response**:

```json
{
  "success": 40,
  "failed": 2,
  "errors": ["Missing required field: email for contact 'John Doe'"]
}
```

### Deep Linking

**Audio Intel → Tracker**:

```
https://tracker.totalaudiopromo.com/dashboard/import?source=audio-intel&contacts=42
```

**URL Parameters**:

- `source=audio-intel` - Triggers Audio Intel detection UI
- `contacts=42` - Shows contact count in notification

**Tracker Detection**:

```typescript
useEffect(() => {
  const source = searchParams?.get('source');
  if (source === 'audio-intel') {
    const contactsCount = searchParams?.get('contacts');
    setNotification(`Ready to import ${contactsCount} enriched contacts from Audio Intel!`);
  }
}, [searchParams]);
```

## User Workflows

### Workflow 1: Radio Promoter Campaign Setup

**Scenario**: Radio promoter needs to pitch new sadact track to 50 BBC/commercial stations

1. **Research Phase**(Audio Intel):
   - Upload list of 50 station emails
   - Run enrichment → 15 minutes
   - Review contact intelligence
   - **Send to Tracker**button

2. **Campaign Management**(Tracker):
   - Automatically opens with 50 contacts
   - Import as "sadact - Q1 2025 Radio Campaign"
   - Track email sends via Gmail integration
   - Monitor responses in dashboard

3. **Follow-up**(Tracker):
   - See response rates by outlet type
   - Track which contacts opened emails
   - Export analytics for client reporting

**Time Saved**: 14 hours 45 minutes (15hr manual → 15min enrichment)

### Workflow 2: PR Agency Client Deliverable

**Scenario**: Agency needs to provide client with enriched contact list + campaign tracking

1. **Client Spreadsheet**(Audio Intel):
   - Client sends chaotic Excel with 100+ contacts
   - Upload to Audio Intel
   - Enrich all contacts
   - Export PDF for client deliverable

2. **Campaign Setup**(Tracker):
   - Use "Send to Tracker" for campaign management
   - Set up campaign with client's artist name
   - Track pitching progress

3. **Client Reporting**:
   - Export analytics from Tracker
   - Show enrichment quality from Audio Intel
   - Professional combined report

### Workflow 3: Independent Artist DIY Campaign

**Scenario**: Artist has 25 key contacts researched over months, wants to track responses

1. **Consolidate Research**(Audio Intel):
   - Paste 25 emails collected from Instagram, websites, etc.
   - Run enrichment to fill gaps
   - Validate contact accuracy

2. **Pitch Tracking**(Tracker):
   - Send contacts to Tracker
   - Create "Self-Release Campaign"
   - Log each pitch sent
   - Track responses as they come

3. **Optimize**:
   - See which outlet types respond best
   - Focus follow-up on high-probability contacts
   - Build relationship tracking over time

## Data Preservation

### Enrichment Intelligence Preserved in Tracker Notes

When contacts are sent from Audio Intel to Tracker, all enrichment data is preserved in the `Notes` field:

```
Intelligence: BBC Radio 1 Future Sounds host. Specializes in electronic music...
Confidence: High
Researched: 2025-10-13
Company: BBC
```

This ensures:

- No data loss during transfer
- Campaign managers can reference intelligence
- Follow-up context always available
- Audit trail of enrichment quality

### What Gets Mapped

| Audio Intel Field    | Preserved In | Tracker Usage                       |
| -------------------- | ------------ | ----------------------------------- |
| Contact Intelligence | `Notes`      | Reference during pitching           |
| Research Confidence  | `Notes`      | Prioritize high-confidence contacts |
| Platform/Company     | `Outlet`     | Campaign segmentation               |
| Role                 | `Role`       | Personalization                     |
| Email                | `Email`      | Primary contact method              |
| Name                 | `Name`       | Personalization                     |

### What Doesn't Transfer

- User accounts (separate auth systems)
- Campaign history (Tracker-specific)
- Analytics data (different metrics)

These are intentionally separate to maintain tool-specific functionality.

## Error Handling

### Common Issues

**Issue**: CSV won't import in Tracker
**Solution**: Check for:

- Required fields: `name`, `email`
- Proper CSV encoding (UTF-8)
- No malformed rows

**Issue**: Deep link opens Tracker but no notification
**Solution**:

- Check URL parameters are intact
- Verify browser didn't strip `source` param
- Refresh page to re-trigger detection

**Issue**: Enrichment data not showing in Tracker notes
**Solution**:

- Ensure `includeEnrichmentData: true` in export request
- Check CSV `Notes` column has content
- Re-export from Audio Intel if missing

### Troubleshooting

**Export fails in Audio Intel**:

```javascript
// Check browser console for:
Error: Export to Tracker failed
// Likely causes:
- No contacts enriched
- Network error
- API route not found (/api/export-to-tracker)
```

**Import fails in Tracker**:

```javascript
// Check response for:
{
  "success": 0,
  "failed": 42,
  "errors": ["Missing required field: email"]
}
// Fix: Ensure all contacts have email addresses
```

## Best Practices

### For Radio Promoters

1. **Batch Enrichment**: Enrich 50-100 contacts at once in Audio Intel
2. **Campaign Segmentation**: Send BBC contacts separately from commercial stations
3. **Confidence Filtering**: Only send high-confidence enrichments to Tracker
4. **Regular Updates**: Re-enrich quarterly to catch contact changes

### For PR Agencies

1. **Client Onboarding**: Enrich client's existing contacts as first step
2. **White Label**: Use PDF exports from Audio Intel for client deliverables
3. **Campaign Templates**: Set up Tracker campaigns based on Audio Intel segments
4. **Monthly Reporting**: Combine Audio Intel quality + Tracker response data

### For Artists

1. **Research First**: Build contact list in Audio Intel before pitching
2. **Gradual Growth**: Add 5-10 contacts per campaign, track quality over quantity
3. **Relationship Building**: Use Tracker notes to log personal context from responses
4. **Long-term Tracking**: Keep campaigns active to see patterns over years

## Analytics & Metrics

### Audio Intel Metrics Tracked

- `export_to_tracker` event
- Contact count per export
- Campaign name (if provided)
- Enrichment data inclusion flag

### Tracker Import Metrics

- `import_source: audio-intel`
- Success/failure counts
- Contact validation errors
- Campaign creation from imports

### Combined Reporting

To analyze tool effectiveness:

1. **Enrichment Quality**(Audio Intel):
   - High confidence contacts: 85%
   - Platform coverage: BBC, Spotify, Radio 1

2. **Campaign Performance**(Tracker):
   - Response rate: 22% (high-confidence contacts)
   - Response rate: 8% (medium-confidence contacts)
   - Time to first response: 3.2 days average

3. **ROI Calculation**:
   - Time saved: 14h 45min per campaign
   - Hourly rate: £50/hour
   - Value: £737.50 per campaign

## Future Enhancements

### Planned Features

- **Bi-directional Sync**: Update Audio Intel when Tracker contact responds
- **Campaign Templates**: Pre-configured Tracker campaigns for common Audio Intel use cases
- **Batch Operations**: Send multiple Audio Intel sessions to different Tracker campaigns
- **Unified Auth**: Single sign-on between tools (Phase 4+)

### Integration Roadmap

1. **Phase 3 (Current)**: CSV workflow with deep linking
2.  **Phase 4**: Unified authentication (SSO)
3.  **Phase 5**: Real-time sync via webhooks
4.  **Phase 6**: Shared database architecture

## Support & Feedback

### Get Help

- Audio Intel: https://intel.totalaudiopromo.com/docs
- Tracker: https://tracker.totalaudiopromo.com/docs
- Combined workflow: This guide

### Report Issues

- GitHub: https://github.com/totalaudiopromo/audio-platform/issues
- Email: support@totalaudiopromo.com
- Label: `tool-integration`, `audio-intel-tracker`

---

**Last Updated**: October 2025
**Version**: 1.0 (Phase 3 Implementation)
**Status**: Production Ready
