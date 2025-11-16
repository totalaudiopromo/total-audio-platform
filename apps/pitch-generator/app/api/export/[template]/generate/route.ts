import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@total-audio/core-db/server';
import { z } from 'zod';

// Validation schema
const GenerateExportSchema = z.object({
  templateId: z.string().uuid().optional(),
  templateType: z
    .enum(['press-kit', 'radio-plan', 'playlist-pack', 'client-report', 'custom'])
    .optional(),
  data: z.record(z.any()),
  outputFormat: z.enum(['pdf', 'csv', 'zip', 'docx', 'excel']).optional(),
  customBranding: z
    .object({
      logo: z.string().optional(),
      primaryColor: z.string().optional(),
      secondaryColor: z.string().optional(),
    })
    .optional(),
});

type GenerateExportInput = z.infer<typeof GenerateExportSchema>;

/**
 * POST /api/export/[template]/generate
 * Generate export using template
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ template: string }> }
) {
  const startTime = Date.now();

  try {
    const supabase = await createClient(cookies());

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { template: templateParam } = await params;
    const body = await req.json();
    const input = GenerateExportSchema.parse(body);

    // Get template configuration
    let template;
    if (input.templateId) {
      // Load specific template by ID
      const { data: templateData, error: templateError } = await supabase
        .from('export_templates')
        .select('*')
        .eq('id', input.templateId)
        .single();

      if (templateError || !templateData) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
      }

      template = templateData;
    } else if (input.templateType || templateParam) {
      // Load system template by type
      const templateType = input.templateType || templateParam;
      const { data: templateData, error: templateError } = await supabase
        .from('export_templates')
        .select('*')
        .eq('template_type', templateType)
        .eq('is_system_template', true)
        .single();

      if (templateError || !templateData) {
        return NextResponse.json(
          { error: `System template '${templateType}' not found` },
          { status: 404 }
        );
      }

      template = templateData;
    } else {
      return NextResponse.json(
        { error: 'Either templateId or templateType must be provided' },
        { status: 400 }
      );
    }

    // Determine output format
    const outputFormat = input.outputFormat || template.output_format;

    // Generate export based on format
    let exportResult;
    switch (outputFormat) {
      case 'csv':
        exportResult = await generateCSV(template, input.data);
        break;
      case 'pdf':
        exportResult = await generatePDF(template, input.data, input.customBranding);
        break;
      case 'zip':
        exportResult = await generateZIP(template, input.data);
        break;
      default:
        return NextResponse.json(
          { error: `Unsupported output format: ${outputFormat}` },
          { status: 400 }
        );
    }

    // Log export to history
    const { error: historyError } = await supabase.from('export_history').insert({
      user_id: user.id,
      template_id: template.id,
      export_type: template.template_type,
      file_name: exportResult.fileName,
      file_size_bytes: exportResult.fileSize,
      records_exported: exportResult.recordsExported,
      data_snapshot: {
        templateType: template.template_type,
        recordCount: exportResult.recordsExported,
      },
      generation_time_ms: Date.now() - startTime,
    });

    if (historyError) {
      console.error('Error logging export history:', historyError);
      // Non-fatal
    }

    // Update template usage count
    await supabase
      .from('export_templates')
      .update({
        times_used: template.times_used + 1,
        last_used_at: new Date().toISOString(),
      })
      .eq('id', template.id);

    return NextResponse.json({
      success: true,
      export: exportResult,
      metadata: {
        duration: Date.now() - startTime,
        templateType: template.template_type,
        outputFormat,
      },
    });
  } catch (error: any) {
    console.error('Export generation API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Generate CSV export
 */
async function generateCSV(template: any, data: any) {
  const schema = template.template_schema;
  const fields = schema.fields || Object.keys(data[0] || {});

  // Build CSV header
  const header = fields.join(',');

  // Build CSV rows
  const rows = (Array.isArray(data) ? data : [data]).map((row: any) => {
    return fields
      .map((field: string) => {
        const value = row[field] || '';
        // Escape CSV values
        return typeof value === 'string' && value.includes(',')
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      })
      .join(',');
  });

  const csvContent = [header, ...rows].join('\n');

  return {
    fileName: `${template.template_name.replace(/\s+/g, '_')}_${Date.now()}.csv`,
    fileContent: csvContent,
    fileSize: csvContent.length,
    recordsExported: rows.length,
    mimeType: 'text/csv',
  };
}

/**
 * Generate PDF export (simplified - would use proper PDF library in production)
 */
async function generatePDF(template: any, data: any, customBranding?: any) {
  // In production, use a library like pdfkit, jsPDF, or Puppeteer
  // For now, return a simple HTML that can be converted to PDF client-side

  const schema = template.template_schema;
  const sections = schema.sections || [];

  let htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${template.template_name}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      color: #333;
    }
    h1 { color: ${customBranding?.primaryColor || '#1a1a1a'}; margin-bottom: 30px; }
    h2 { color: ${customBranding?.secondaryColor || '#555'}; margin-top: 30px; }
    .section { margin-bottom: 30px; }
    .metadata { font-size: 14px; color: #666; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
  </style>
</head>
<body>
  <h1>${template.template_name}</h1>
  <div class="metadata">Generated: ${new Date().toLocaleDateString()}</div>
`;

  sections.forEach((section: string) => {
    htmlContent += `<div class="section"><h2>${section.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h2>`;

    if (data[section]) {
      if (Array.isArray(data[section])) {
        htmlContent += '<ul>';
        data[section].forEach((item: any) => {
          htmlContent += `<li>${typeof item === 'object' ? JSON.stringify(item) : item}</li>`;
        });
        htmlContent += '</ul>';
      } else if (typeof data[section] === 'object') {
        htmlContent += '<table>';
        Object.entries(data[section]).forEach(([key, value]) => {
          htmlContent += `<tr><th>${key}</th><td>${value}</td></tr>`;
        });
        htmlContent += '</table>';
      } else {
        htmlContent += `<p>${data[section]}</p>`;
      }
    }

    htmlContent += '</div>';
  });

  htmlContent += '</body></html>';

  return {
    fileName: `${template.template_name.replace(/\s+/g, '_')}_${Date.now()}.html`,
    fileContent: htmlContent,
    fileSize: htmlContent.length,
    recordsExported: 1,
    mimeType: 'text/html',
    note: 'HTML format - use browser print-to-PDF or server-side PDF renderer for final PDF',
  };
}

/**
 * Generate ZIP export (combined multiple files)
 */
async function generateZIP(template: any, data: any) {
  // In production, use a library like jszip or archiver
  // For now, return a structure that can be zipped client-side

  return {
    fileName: `${template.template_name.replace(/\s+/g, '_')}_${Date.now()}.zip`,
    files: [
      {
        name: 'README.txt',
        content: `Export generated from ${template.template_name}\nDate: ${new Date().toISOString()}`,
      },
      {
        name: 'data.json',
        content: JSON.stringify(data, null, 2),
      },
    ],
    fileSize: 0, // Would be calculated after zipping
    recordsExported: Array.isArray(data) ? data.length : 1,
    mimeType: 'application/zip',
    note: 'Structure ready for client-side zipping',
  };
}

/**
 * GET /api/export/[template]/generate
 * Get export template info
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ template: string }> }) {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { template: templateType } = await params;

    const { data: templateData, error } = await supabase
      .from('export_templates')
      .select('*')
      .eq('template_type', templateType)
      .eq('is_system_template', true)
      .single();

    if (error || !templateData) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      template: templateData,
    });
  } catch (error: any) {
    console.error('Export template GET error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
