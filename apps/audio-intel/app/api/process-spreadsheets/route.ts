// 🟣 INTEGRATION: Multi-Agent Spreadsheet Processing API
// Backend endpoint for the multi-agent pipeline

import { NextRequest, NextResponse } from 'next/server';
import { SpreadsheetProcessingPipeline } from '@/utils/spreadsheetProcessor';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files: File[] = [];
    
    // Extract files from form data
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file_') && value instanceof File) {
        files.push(value);
      }
    }
    
    if (files.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No files provided'
      }, { status: 400 });
    }
    
    // Process files through multi-agent pipeline
    const results = await SpreadsheetProcessingPipeline.processFiles(files);
    
    return NextResponse.json({
      success: true,
      data: results,
      processed: files.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Spreadsheet processing error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Spreadsheet processing failed'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Multi-agent spreadsheet processing API is running',
    agents: [
      '🤖 Data Quality Agent - Analyses files for issues',
      '🤖 Column Mapping Agent - Detects data types intelligently', 
      '🤖 Normalisation Agent - Cleans and standardises data',
      '🤖 Deduplication Agent - Finds and merges duplicates'
    ],
    timestamp: new Date().toISOString()
  });
}