/**
 * API Route: /api/anr/showcases/[showcaseId]/export
 *
 * Showcase export in various formats
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  exportShowcaseAsMarkdown,
  exportShowcaseAsHTML,
  exportShowcaseAsPDFSpec,
} from '@total-audio/anr-radar';

/**
 * GET /api/anr/showcases/[showcaseId]/export?format=markdown|html|pdf-spec
 * Export showcase in specified format
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { showcaseId: string } }
) {
  try {
    const { showcaseId } = params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'markdown';

    let content: string | object | null = null;
    let contentType = 'text/plain';

    switch (format) {
      case 'markdown':
        content = await exportShowcaseAsMarkdown(showcaseId);
        contentType = 'text/markdown';
        break;

      case 'html':
        content = await exportShowcaseAsHTML(showcaseId);
        contentType = 'text/html';
        break;

      case 'pdf-spec':
        content = await exportShowcaseAsPDFSpec(showcaseId);
        contentType = 'application/json';
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid format. Supported: markdown, html, pdf-spec' },
          { status: 400 }
        );
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Failed to export showcase' },
        { status: 500 }
      );
    }

    if (format === 'pdf-spec') {
      return NextResponse.json(content);
    }

    return new NextResponse(content as string, {
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    console.error('Failed to export showcase:', error);
    return NextResponse.json(
      { error: 'Failed to export showcase' },
      { status: 500 }
    );
  }
}
