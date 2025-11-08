import 'server-only';

import { chromium } from 'playwright';

// Types are defined inline since pdf-render.server was removed
export interface BrutalistPDFContact {
  name: string;
  email: string;
  contactIntelligence?: string;
  researchConfidence?: string;
  platform?: string;
  role?: string;
  company?: string;
  lastResearched?: string;
}

export interface BrutalistPDFMetrics {
  total: number;
  high: number;
  medium: number;
  low: number;
  platforms: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
}

interface WhiteLabelConfig {
  companyName?: string;
  logoUrl?: string;
  primaryColor?: string;
}

/**
 * Generate a brutalist PDF using Playwright
 * This creates a professional agency-quality PDF that matches Audio Intel's design system
 */
export async function generateBrutalistPDF(
  contacts: BrutalistPDFContact[],
  metrics: BrutalistPDFMetrics,
  filename: string = 'audio-intel-contacts.pdf',
  whiteLabel?: WhiteLabelConfig,
  renderFn?: (contacts: any[], metrics: any, whiteLabel?: any) => Promise<string>
): Promise<Buffer> {
  console.log('[PDF Generator] Starting PDF generation for', contacts.length, 'contacts');

  // Use provided render function or throw error
  let htmlContent: string;
  try {
    console.log('[PDF Generator] Rendering React component to HTML...');
    if (!renderFn) {
      throw new Error('Render function must be provided');
    }
    htmlContent = await renderFn(contacts, metrics, whiteLabel);
    console.log('[PDF Generator] HTML rendered, length:', htmlContent.length);
  } catch (error) {
    console.error('[PDF Generator] React rendering error:', error);
    throw new Error(
      `Failed to render PDF template: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  // Create full HTML document with Tailwind CSS
  const fullHTML = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Audio Intel - Contact Intelligence Report</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page {
            margin: 0;
            size: A4;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          /* Ensure brutalist shadows print correctly */
          * {
            box-sizing: border-box;
          }
          /* Prevent page breaks inside contact cards and sections */
          .contact-card {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          /* Ensure proper spacing between pages */
          @media print {
            .contact-card {
              margin-bottom: 1rem;
            }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

  // Launch headless browser
  let browser;
  try {
    console.log('[PDF Generator] Launching Playwright browser...');
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    console.log('[PDF Generator] Browser launched successfully');
  } catch (error: any) {
    console.error('[PDF Generator] Browser launch error:', error);
    const errorMessage = error.message || 'Unknown error';
    if (errorMessage.includes('Executable') || errorMessage.includes('browser')) {
      throw new Error(
        'Playwright browser not installed. Please run: npx playwright install chromium'
      );
    }
    throw new Error(`Failed to launch browser: ${errorMessage}`);
  }

  try {
    console.log('[PDF Generator] Creating new page...');
    const page = await browser.newPage();

    // Set content and wait for it to load
    console.log('[PDF Generator] Setting page content...');
    await page.setContent(fullHTML, {
      waitUntil: 'networkidle',
    });

    // Wait a bit for Tailwind to fully render
    console.log('[PDF Generator] Waiting for Tailwind to render...');
    await page.waitForTimeout(500);

    // Generate PDF
    console.log('[PDF Generator] Generating PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
      preferCSSPageSize: false,
    });
    console.log('[PDF Generator] PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    return Buffer.from(pdfBuffer);
  } catch (error: any) {
    console.error('[PDF Generator] PDF generation error:', error);
    throw new Error(`PDF generation failed: ${error.message || 'Unknown error'}`);
  } finally {
    console.log('[PDF Generator] Closing browser...');
    await browser.close();
  }
}
