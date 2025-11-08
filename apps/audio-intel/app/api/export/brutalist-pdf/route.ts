import { NextRequest, NextResponse } from 'next/server';

// Inline the rendering logic to avoid Next.js analyzing server-only files
// This ensures react-dom/server is never bundled for the client
async function renderPDFTemplate(contacts: any[], metrics: any, whiteLabel?: any): Promise<string> {
  // Dynamic import inside the API route - Next.js won't analyze this
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const templateModule = await import('@/lib/pdf-brutalist-template');
  const BrutalistPDFTemplate = templateModule.BrutalistPDFTemplate;

  return renderToStaticMarkup(
    React.createElement(BrutalistPDFTemplate, {
      contacts,
      metrics,
      whiteLabel,
    })
  );
}

async function calculateMetrics(contacts: any[]): Promise<any> {
  const confidenceBreakdown = { high: 0, medium: 0, low: 0 };
  const platformBreakdown: Record<string, number> = {};

  contacts.forEach(contact => {
    const confidence = (contact.researchConfidence || 'Low').toLowerCase();
    if (confidence.includes('high')) confidenceBreakdown.high++;
    else if (confidence.includes('medium')) confidenceBreakdown.medium++;
    else confidenceBreakdown.low++;

    const platform = contact.platform || contact.email?.match(/@(.+)/)?.[1] || 'Unknown';
    platformBreakdown[platform] = (platformBreakdown[platform] || 0) + 1;
  });

  const topPlatforms = Object.entries(platformBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([platform, count]) => ({
      name: platform,
      count,
      percentage: Math.round((count / contacts.length) * 100),
    }));

  return {
    total: contacts.length,
    high: confidenceBreakdown.high,
    medium: confidenceBreakdown.medium,
    low: confidenceBreakdown.low,
    platforms: topPlatforms,
  };
}

// Use dynamic import to ensure server-only code stays on server
async function getPDFGenerator() {
  const { generateBrutalistPDF } = await import('@/lib/generate-brutalist-pdf');
  return { generateBrutalistPDF };
}

interface BrutalistPDFRequest {
  contacts: Array<{
    name: string;
    email: string;
    contactIntelligence?: string;
    researchConfidence?: string;
    platform?: string;
    role?: string;
    company?: string;
    lastResearched?: string;
  }>;
  whiteLabel?: {
    companyName?: string;
    logoUrl?: string;
    primaryColor?: string;
  };
  filename?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: BrutalistPDFRequest = await req.json();
    const { contacts, whiteLabel, filename } = body;

    console.log('[Brutalist PDF] Request received:', {
      contactsCount: contacts?.length,
      hasWhiteLabel: !!whiteLabel,
      filename,
    });

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing or invalid contacts data',
        },
        { status: 400 }
      );
    }

    // Calculate metrics from contacts
    console.log('[Brutalist PDF] Calculating metrics...');
    const metrics = await calculateMetrics(contacts);
    console.log('[Brutalist PDF] Metrics calculated:', metrics);

    // Generate PDF
    console.log('[Brutalist PDF] Starting PDF generation...');
    const { generateBrutalistPDF } = await getPDFGenerator();
    const pdfBuffer = await generateBrutalistPDF(
      contacts,
      metrics,
      filename || `audio-intel-contacts-${new Date().toISOString().split('T')[0]}.pdf`,
      whiteLabel,
      renderPDFTemplate // Pass the render function
    );
    console.log('[Brutalist PDF] PDF generated, size:', pdfBuffer.length, 'bytes');

    // Return PDF as base64 for client-side download
    const base64Pdf = pdfBuffer.toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64Pdf}`;

    return NextResponse.json({
      success: true,
      pdf: base64Pdf,
      downloadUrl: dataUrl,
      filename: filename || `audio-intel-contacts-${new Date().toISOString().split('T')[0]}.pdf`,
      message: `Successfully generated brutalist PDF with ${contacts.length} contacts`,
    });
  } catch (error: any) {
    console.error('[Brutalist PDF] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'PDF generation failed',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return new Response('This endpoint only supports POST requests.', { status: 405 });
}
