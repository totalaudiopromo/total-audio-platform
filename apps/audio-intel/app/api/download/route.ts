import { NextRequest, NextResponse } from 'next/server';
import { exportToCsv } from '../../../utils/exportToCsv';
import * as XLSX from 'xlsx';
import nodemailer from 'nodemailer';

// Helper function to get display name with fallback
function getDisplayName(contact: any): string {
  if (contact.name && contact.name.trim()) {
    return contact.name.trim();
  }
  
  // Extract name from email if available
  if (contact.email) {
    const emailName = contact.email.split('@')[0];
    if (emailName && emailName !== 'unknown' && emailName !== 'n/a') {
      // Convert email name to proper case
      return emailName
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (l: string) => l.toUpperCase())
        .trim();
    }
  }
  
  return 'Contact Name Unavailable';
}

// Store latest results for download
let latestResults: any[] = [];

// Enhanced CSV export with proper formatting
function generateFormattedCSV(contacts: any[]): string {
  const headers = [
    'Name',
    'Email', 
    'Contact Intelligence',
    'Research Confidence',
    'Last Researched'
  ];

  const rows = contacts.map(contact => {
    // Format contact intelligence (keep original format)
    const contactIntelligence = contact.contactIntelligence || '';
    
    // Format confidence level
    const confidence = contact.researchConfidence || 'Low';
    
    // Format date
    const lastResearched = contact.lastResearched 
      ? new Date(contact.lastResearched).toISOString()
      : new Date().toISOString();

    return [
      getDisplayName(contact),
      contact.email || '',
      contactIntelligence,
      confidence,
      lastResearched
    ];
  });

  // Create CSV content with proper escaping
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(field => 
        // Escape commas, quotes, and newlines in CSV
        typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))
          ? `"${field.replace(/"/g, '""')}"`
          : field
      ).join(',')
    )
  ].join('\n');

  return csvContent;
}

// Email delivery function
async function sendEmailWithAttachment(
  toEmail: string,
  csvContent: string,
  fileName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Configure email transporter (using environment variables)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: toEmail,
      subject: 'Audio Intel - Enriched Contacts Export',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1E88E5;">🎵 Audio Intel Contact Export</h2>
          <p>Your enriched contact data is attached to this email.</p>
          <p><strong>Export Details:</strong></p>
          <ul>
            <li>File: ${fileName}</li>
            <li>Contacts: ${latestResults.length}</li>
            <li>Generated: ${new Date().toLocaleString()}</li>
          </ul>
          <p>Thank you for using Audio Intel!</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            This is an automated export from Audio Intel. 
            If you have any questions, please contact support.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: fileName,
          content: csvContent,
          contentType: 'text/csv',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: any) {
    console.error('Email sending failed:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to send email' 
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { enriched, emailDelivery } = body;
    
    if (!Array.isArray(enriched)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing enriched results' 
      }, { status: 400 });
    }
    
    // Save latest enriched results
    latestResults = enriched;
    
    // Handle email delivery if requested
    if (emailDelivery && emailDelivery.email) {
      const csvContent = generateFormattedCSV(enriched);
      const fileName = `enriched-contacts-${new Date().toISOString().split('T')[0]}.csv`;
      
      const emailResult = await sendEmailWithAttachment(
        emailDelivery.email,
        csvContent,
        fileName
      );
      
      if (!emailResult.success) {
        return NextResponse.json({ 
          success: false, 
          error: `Email delivery failed: ${emailResult.error}` 
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Export sent via email',
        fileName,
        contactsCount: enriched.length
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Export data saved for download',
      contactsCount: enriched.length
    });
    
  } catch (error: any) {
    console.error('Download API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Export processing failed' 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const format = req.nextUrl.searchParams.get('format');
    const email = req.nextUrl.searchParams.get('email');
    
    if (!latestResults || latestResults.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No export data available' 
      }, { status: 404 });
    }
    
    // Handle email delivery via GET request
    if (email) {
      const csvContent = generateFormattedCSV(latestResults);
      const fileName = `enriched-contacts-${new Date().toISOString().split('T')[0]}.csv`;
      
      const emailResult = await sendEmailWithAttachment(email, csvContent, fileName);
      
      if (!emailResult.success) {
        return NextResponse.json({ 
          success: false, 
          error: `Email delivery failed: ${emailResult.error}` 
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Export sent via email',
        fileName,
        contactsCount: latestResults.length
      });
    }
    
    if (format === 'excel') {
      // Generate Excel file with formatted data
      const formattedData = latestResults.map(contact => {
        return {
          Name: getDisplayName(contact),
          Email: contact.email || '',
          'Contact Intelligence': contact.contactIntelligence || '',
          'Research Confidence': contact.researchConfidence || 'Low',
          'Last Researched': contact.lastResearched 
            ? new Date(contact.lastResearched).toISOString()
            : new Date().toISOString()
        };
      });
      
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Enriched Contacts');
      
      // Auto-size columns
      const maxWidth = formattedData.reduce((max, row) => {
        return Math.max(max, ...Object.values(row).map(val => String(val).length));
      }, 0);
      
      worksheet['!cols'] = [{ width: Math.min(maxWidth + 2, 50) }];
      
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
      
      return new Response(wbout, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="enriched-contacts-${new Date().toISOString().split('T')[0]}.xlsx"`,
        },
      });
    }
    
    // Download as CSV with proper formatting
    const csvContent = generateFormattedCSV(latestResults);
    
    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="enriched-contacts-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
    
  } catch (error: any) {
    console.error('Download GET error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Download processing failed' 
    }, { status: 500 });
  }
} 