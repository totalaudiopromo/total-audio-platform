import { NextRequest, NextResponse } from 'next/server';
import { exportToCsv } from '@/utils/exportToCsv';
import { exportToExcel } from '@/utils/exportToExcel';
import { exportAnalyticsToPdf, exportContactsToPdf } from '@/utils/exportToPdf';
import {
  generateContactExportEmail,
  generateAnalyticsExportEmail,
  generateSearchResultsEmail,
} from '@/utils/emailTemplates';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  try {
    return new Resend(key);
  } catch {
    return null;
  }
}

interface ExportRequest {
  type: 'contacts' | 'analytics' | 'search-results';
  format: 'csv' | 'excel' | 'pdf';
  data: any;
  emailDelivery?: {
    enabled: boolean;
    recipientEmail: string;
    recipientName?: string;
    customMessage?: string;
    whiteLabel?: {
      companyName?: string;
      logoUrl?: string;
      primaryColor?: string;
    };
  };
  filename?: string;
}

// Email configuration
const emailConfig = {
  from: process.env.EMAIL_FROM || 'noreply@totalaudiopromo.com',
  subject: 'Your Audio Intel Export is Ready',
};

export async function POST(req: NextRequest) {
  try {
    const body: ExportRequest = await req.json();
    const { type, format, data, emailDelivery, filename } = body;

    if (!type || !format || !data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: type, format, or data',
        },
        { status: 400 }
      );
    }

    let exportResult: any = {};
    let downloadUrl: string | undefined;

    // Generate export based on type and format
    switch (type) {
      case 'contacts':
        exportResult = await handleContactExport(data, format, filename);
        break;
      case 'analytics':
        exportResult = await handleAnalyticsExport(data, format, filename);
        break;
      case 'search-results':
        exportResult = await handleSearchResultsExport(data, format, filename);
        break;
      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid export type',
          },
          { status: 400 }
        );
    }

    // Handle email delivery if requested
    if (emailDelivery?.enabled && emailDelivery.recipientEmail) {
      try {
        await sendExportEmail({
          type,
          format,
          recipientEmail: emailDelivery.recipientEmail,
          recipientName: emailDelivery.recipientName,
          customMessage: emailDelivery.customMessage,
          whiteLabel: emailDelivery.whiteLabel,
          data,
          downloadUrl: exportResult.downloadUrl,
          filename: exportResult.filename,
        });

        // Track email delivery in analytics
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'export_email',
            data: {
              type,
              format,
              contactsCount: data.length || 0,
              recipientEmail: emailDelivery.recipientEmail,
            },
          }),
        });
      } catch (emailError) {
        console.error('Email delivery failed:', emailError);
        // Continue with export even if email fails
      }
    }

    // Track export in analytics
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'export_download',
          data: {
            type,
            format,
            contactsCount: data.length || 0,
          },
        }),
      });
    } catch (analyticsError) {
      console.error('Analytics tracking failed:', analyticsError);
    }

    return NextResponse.json({
      success: true,
      ...exportResult,
      emailSent: emailDelivery?.enabled || false,
    });
  } catch (error: any) {
    console.error('Export API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Export processing failed',
      },
      { status: 500 }
    );
  }
}

async function handleContactExport(data: any[], format: string, filename?: string) {
  const baseFilename = filename || `audio-intel-contacts-${new Date().toISOString().split('T')[0]}`;

  switch (format) {
    case 'csv':
      const csvContent = exportToCsv(data);
      return {
        format: 'csv',
        content: csvContent,
        filename: `${baseFilename}.csv`,
        downloadUrl: `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`,
      };

    case 'excel':
      const excelFilename = `${baseFilename}.xlsx`;
      exportToExcel(data, excelFilename);
      return {
        format: 'excel',
        filename: excelFilename,
        message: 'Excel file generated successfully',
      };

    case 'pdf':
      const pdfFilename = `${baseFilename}.pdf`;
      exportContactsToPdf(data, pdfFilename);
      return {
        format: 'pdf',
        filename: pdfFilename,
        message: 'PDF report generated successfully',
      };

    default:
      throw new Error('Unsupported format for contact export');
  }
}

async function handleAnalyticsExport(data: any, format: string, filename?: string) {
  const baseFilename =
    filename || `audio-intel-analytics-${new Date().toISOString().split('T')[0]}`;

  switch (format) {
    case 'csv':
      // Convert analytics data to CSV format
      const csvData = [
        ['Metric', 'Value'],
        ['Total Contacts', data.totalContacts || 0],
        ['Total Enrichments', data.totalEnrichments || 0],
        ['Success Rate', `${data.successRate || 0}%`],
        ['Average Confidence', `${data.averageConfidence || 0}%`],
        ['Average Processing Time', `${data.performanceMetrics?.averageProcessingTime || 0}s`],
        ['Cache Hit Rate', `${data.performanceMetrics?.cacheHitRate || 0}%`],
        ['Error Rate', `${data.performanceMetrics?.errorRate || 0}%`],
      ];

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      return {
        format: 'csv',
        content: csvContent,
        filename: `${baseFilename}.csv`,
        downloadUrl: `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`,
      };

    case 'excel':
      const excelFilename = `${baseFilename}.xlsx`;
      // Create analytics data in the correct format for Excel export
      const analyticsData = [
        {
          name: 'Total Contacts',
          email: '',
          contactIntelligence: data.totalContacts || 0,
          researchConfidence: '',
          lastResearched: '',
          platform: '',
          role: '',
          company: '',
        },
        {
          name: 'Total Enrichments',
          email: '',
          contactIntelligence: data.totalEnrichments || 0,
          researchConfidence: '',
          lastResearched: '',
          platform: '',
          role: '',
          company: '',
        },
        {
          name: 'Success Rate',
          email: '',
          contactIntelligence: `${data.successRate || 0}%`,
          researchConfidence: '',
          lastResearched: '',
          platform: '',
          role: '',
          company: '',
        },
        {
          name: 'Average Confidence',
          email: '',
          contactIntelligence: `${data.averageConfidence || 0}%`,
          researchConfidence: '',
          lastResearched: '',
          platform: '',
          role: '',
          company: '',
        },
        {
          name: 'Average Processing Time',
          email: '',
          contactIntelligence: `${data.performanceMetrics?.averageProcessingTime || 0}s`,
          researchConfidence: '',
          lastResearched: '',
          platform: '',
          role: '',
          company: '',
        },
        {
          name: 'Cache Hit Rate',
          email: '',
          contactIntelligence: `${data.performanceMetrics?.cacheHitRate || 0}%`,
          researchConfidence: '',
          lastResearched: '',
          platform: '',
          role: '',
          company: '',
        },
        {
          name: 'Error Rate',
          email: '',
          contactIntelligence: `${data.performanceMetrics?.errorRate || 0}%`,
          researchConfidence: '',
          lastResearched: '',
          platform: '',
          role: '',
          company: '',
        },
      ];
      exportToExcel(analyticsData, excelFilename);
      return {
        format: 'excel',
        filename: excelFilename,
        message: 'Excel analytics report generated successfully',
      };

    case 'pdf':
      const pdfFilename = `${baseFilename}.pdf`;
      exportAnalyticsToPdf(data, pdfFilename);
      return {
        format: 'pdf',
        filename: pdfFilename,
        message: 'PDF analytics report generated successfully',
      };

    default:
      throw new Error('Unsupported format for analytics export');
  }
}

async function handleSearchResultsExport(data: any[], format: string, filename?: string) {
  const baseFilename =
    filename || `audio-intel-search-results-${new Date().toISOString().split('T')[0]}`;

  switch (format) {
    case 'csv':
      const csvContent = exportToCsv(data);
      return {
        format: 'csv',
        content: csvContent,
        filename: `${baseFilename}.csv`,
        downloadUrl: `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`,
      };

    case 'excel':
      const excelFilename = `${baseFilename}.xlsx`;
      exportToExcel(data, excelFilename);
      return {
        format: 'excel',
        filename: excelFilename,
        message: 'Excel search results generated successfully',
      };

    case 'pdf':
      const pdfFilename = `${baseFilename}.pdf`;
      exportContactsToPdf(data, pdfFilename);
      return {
        format: 'pdf',
        filename: pdfFilename,
        message: 'PDF search results generated successfully',
      };

    default:
      throw new Error('Unsupported format for search results export');
  }
}

async function sendExportEmail(params: {
  type: string;
  format: string;
  recipientEmail: string;
  recipientName?: string;
  customMessage?: string;
  whiteLabel?: any;
  data: any;
  downloadUrl?: string;
  filename?: string;
}) {
  const {
    type,
    format,
    recipientEmail,
    recipientName,
    customMessage,
    whiteLabel,
    data,
    downloadUrl,
    filename,
  } = params;

  let emailHtml: string;
  let subject: string;

  switch (type) {
    case 'contacts':
      emailHtml = generateContactExportEmail({
        userName: recipientName,
        contactsCount: data.length,
        downloadUrl,
        customMessage,
        whiteLabel,
      });
      subject = 'Your Enriched Contacts Are Ready - Audio Intel';
      break;

    case 'analytics':
      emailHtml = generateAnalyticsExportEmail({
        userName: recipientName,
        analyticsData: data,
        downloadUrl,
        customMessage,
        whiteLabel,
      });
      subject = 'Your Analytics Report Is Ready - Audio Intel';
      break;

    case 'search-results':
      emailHtml = generateSearchResultsEmail({
        userName: recipientName,
        contactsCount: data.length,
        downloadUrl,
        customMessage,
        whiteLabel,
      });
      subject = 'Your Search Results Are Ready - Audio Intel';
      break;

    default:
      throw new Error('Invalid export type for email');
  }

  // Use Resend for email delivery
  const resend = getResend();
  if (resend) {
    await resend.emails.send({
      from: emailConfig.from,
      to: recipientEmail,
      subject: whiteLabel?.companyName
        ? subject.replace('Audio Intel', whiteLabel.companyName)
        : subject,
      html: emailHtml,
    });
  } else {
    // Fallback to nodemailer if Resend is not configured
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: emailConfig.from,
      to: recipientEmail,
      subject: whiteLabel?.companyName
        ? subject.replace('Audio Intel', whiteLabel.companyName)
        : subject,
      html: emailHtml,
    });
  }
}

export async function GET() {
  return new Response('This endpoint only supports POST requests.', { status: 405 });
}
