import ExcelJS from 'exceljs';
import { ContactData } from './exportService';

export async function exportToExcel(
  data: ContactData[],
  filename = 'audio-intel-enriched-contacts.xlsx'
) {
  try {
    if (!data.length) {
      console.warn('No data to export');
      return;
    }

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Contacts');

    // Define headers
    const headers = [
      'Name',
      'Email', 
      'Contact Intelligence',
      'Research Confidence',
      'Last Researched',
      'Platform',
      'Role',
      'Company'
    ];
    
    // Add headers to worksheet with styling
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F6AB00' } // Total Audio yellow
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Add data rows
    data.forEach(({ 
      name, 
      email, 
      contactIntelligence, 
      researchConfidence, 
      lastResearched, 
      platform, 
      role, 
      company 
    }) => {
      const row = worksheet.addRow([
        name,
        email,
        contactIntelligence,
        researchConfidence || '',
        lastResearched || '',
        platform || '',
        role || '',
        company || ''
      ]);
      
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Set column widths for better readability
    worksheet.getColumn(1).width = 25; // Name
    worksheet.getColumn(2).width = 35; // Email
    worksheet.getColumn(3).width = 60; // Contact Intelligence
    worksheet.getColumn(4).width = 15; // Research Confidence
    worksheet.getColumn(5).width = 15; // Last Researched
    worksheet.getColumn(6).width = 20; // Platform
    worksheet.getColumn(7).width = 20; // Role
    worksheet.getColumn(8).width = 20; // Company

    // Generate buffer and download
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Create blob and download
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    console.log(`Excel file exported successfully: ${filename}`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export to Excel');
  }
} 