/**
 * WARM Report Upload API Route
 * Handles CSV and Excel file uploads, parses them, and stores in database
 * Optionally uploads to Google Drive for archival
 */

import { NextRequest, NextResponse } from 'next/server';
import { WarmReportParser } from '@/lib/integrations/warm-parser';
import { google } from 'googleapis';
import { Readable } from 'stream';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/tracker/warm/upload
 * Upload and parse WARM report
 */
export async function POST(request: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const campaignId = formData.get('campaignId') as string;
    const uploadToDrive = formData.get('uploadToDrive') === 'true';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!campaignId) {
      return NextResponse.json(
        { success: false, error: 'No campaign ID provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension || '')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only CSV and Excel files are supported.' },
        { status: 400 }
      );
    }

    // Read file content
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Optional: Upload to Google Drive first
    let driveFileId: string | undefined;
    if (uploadToDrive) {
      try {
        driveFileId = await uploadToGoogleDrive(file.name, fileBuffer);
      } catch (error) {
        console.error('Failed to upload to Google Drive:', error);
        // Continue without Drive upload
      }
    }

    // Parse the WARM report
    let result;
    if (fileExtension === 'csv') {
      const fileContent = fileBuffer.toString('utf-8');
      result = await WarmReportParser.parseCSV(
        campaignId,
        fileContent,
        file.name,
        driveFileId
      );
    } else {
      result = await WarmReportParser.parseExcel(
        campaignId,
        fileBuffer,
        file.name,
        driveFileId
      );
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      reportId: result.reportId,
      summary: result.summary,
      driveFileId,
    });
  } catch (error: any) {
    console.error('Error in WARM upload API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Upload file to Google Drive
 * Requires GOOGLE_DRIVE_API_KEY or OAuth token in environment
 */
async function uploadToGoogleDrive(
  fileName: string,
  fileBuffer: Buffer
): Promise<string> {
  // Check for Google Drive credentials
  const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const accessToken = process.env.GOOGLE_DRIVE_ACCESS_TOKEN;

  if (!credentials && !accessToken) {
    throw new Error('Google Drive credentials not configured');
  }

  // Initialize Google Drive API
  const auth = new google.auth.GoogleAuth({
    keyFile: credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({ version: 'v3', auth });

  // Get or create "WARM Reports" folder
  const folderId = await getOrCreateFolder(drive, 'WARM Reports');

  // Upload file
  const fileStream = Readable.from(fileBuffer);

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
      mimeType: fileName.endsWith('.csv')
        ? 'text/csv'
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    media: {
      mimeType: fileName.endsWith('.csv')
        ? 'text/csv'
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      body: fileStream,
    },
    fields: 'id, name, webViewLink',
  });

  if (!response.data.id) {
    throw new Error('Failed to upload file to Google Drive');
  }

  return response.data.id;
}

/**
 * Get or create folder in Google Drive
 */
async function getOrCreateFolder(drive: any, folderName: string): Promise<string> {
  // Search for existing folder
  const searchResponse = await drive.files.list({
    q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
    spaces: 'drive',
  });

  if (searchResponse.data.files && searchResponse.data.files.length > 0) {
    return searchResponse.data.files[0].id;
  }

  // Create folder if it doesn't exist
  const createResponse = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    },
    fields: 'id',
  });

  return createResponse.data.id;
}
