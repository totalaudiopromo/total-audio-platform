import { NextRequest, NextResponse } from 'next/server';

/**
 * Export enriched contacts from Audio Intel to Tracker-compatible format
 *
 * This endpoint transforms Audio Intel contacts into a format that Tracker
 * can import as campaign contacts with all enrichment data preserved.
 */

interface AudioIntelContact {
  name: string;
  email: string;
  contactIntelligence?: string;
  researchConfidence?: string;
  lastResearched?: string;
  platform?: string;
  role?: string;
  company?: string;
  [key: string]: any;
}

interface TrackerContact {
  name: string;
  email: string;
  outlet: string; // maps to platform
  role?: string;
  notes?: string; // enrichment data stored here
  status: 'contacted' | 'responded' | 'pending' | 'rejected';
  contacted_date?: string;
  response_date?: string;
}

interface ExportToTrackerRequest {
  contacts: AudioIntelContact[];
  campaignName?: string;
  includeEnrichmentData?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body: ExportToTrackerRequest = await req.json();
    const { contacts, campaignName, includeEnrichmentData = true } = body;

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No contacts provided for export'
      }, { status: 400 });
    }

    // Transform Audio Intel contacts to Tracker format
    const trackerContacts: TrackerContact[] = contacts.map(contact => {
      const enrichmentNotes = includeEnrichmentData ? [
        contact.contactIntelligence ? `Intelligence: ${contact.contactIntelligence}` : null,
        contact.researchConfidence ? `Confidence: ${contact.researchConfidence}` : null,
        contact.lastResearched ? `Researched: ${contact.lastResearched}` : null,
        contact.company ? `Company: ${contact.company}` : null,
      ].filter(Boolean).join('\n') : '';

      return {
        name: contact.name || 'Unknown',
        email: contact.email || '',
        outlet: contact.platform || contact.company || 'Unknown',
        role: contact.role || undefined,
        notes: enrichmentNotes || `Imported from Audio Intel${campaignName ? ` for ${campaignName}` : ''}`,
        status: 'pending',
        contacted_date: undefined,
        response_date: undefined,
      };
    });

    // Generate CSV format for Tracker
    const csvHeaders = ['Name', 'Email', 'Outlet', 'Role', 'Status', 'Notes', 'Contacted Date', 'Response Date'];
    const csvRows = trackerContacts.map(contact => [
      escapeCSV(contact.name),
      escapeCSV(contact.email),
      escapeCSV(contact.outlet),
      escapeCSV(contact.role || ''),
      contact.status,
      escapeCSV(contact.notes || ''),
      contact.contacted_date || '',
      contact.response_date || '',
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = campaignName
      ? `${slugify(campaignName)}-contacts-${timestamp}.csv`
      : `audio-intel-tracker-export-${timestamp}.csv`;

    // Track export analytics
    try {
      await fetch(new URL('/api/analytics', req.url).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'export_to_tracker',
          data: {
            contactsCount: contacts.length,
            campaignName: campaignName || null,
            includeEnrichmentData,
          }
        })
      });
    } catch (analyticsError) {
      console.error('Analytics tracking failed:', analyticsError);
    }

    return NextResponse.json({
      success: true,
      format: 'tracker-csv',
      filename,
      content: csvContent,
      contactsCount: trackerContacts.length,
      downloadUrl: `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`,
      deepLink: `https://tracker.totalaudiopromo.com/dashboard/import?source=audio-intel&contacts=${trackerContacts.length}`,
    });

  } catch (error: any) {
    console.error('Export to Tracker API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Export processing failed'
    }, { status: 500 });
  }
}

function escapeCSV(value: string | undefined | null): string {
  if (!value) return '';
  const str = String(value);
  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function GET() {
  return new Response('This endpoint only supports POST requests. Use POST to export contacts to Tracker format.', {
    status: 405,
    headers: { 'Content-Type': 'text/plain' }
  });
}
