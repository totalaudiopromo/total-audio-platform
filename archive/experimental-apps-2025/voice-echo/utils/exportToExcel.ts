import * as XLSX from 'xlsx';
import { ContactData } from './exportService';

export function exportToExcel(
  data: ContactData[],
  filename = 'audio-intel-enriched-contacts.xlsx'
) {
  if (!data.length) return;

  // Transform data to include all fields
  const transformedData = data.map(
    ({
      name,
      email,
      contactIntelligence,
      researchConfidence,
      lastResearched,
      platform,
      role,
      company,
    }) => ({
      Name: name,
      Email: email,
      'Contact Intelligence': contactIntelligence,
      'Research Confidence': researchConfidence || '',
      'Last Researched': lastResearched || '',
      Platform: platform || '',
      Role: role || '',
      Company: company || '',
    })
  );

  const worksheet = XLSX.utils.json_to_sheet(transformedData);

  // Set column widths for better readability
  const columnWidths = [
    { wch: 25 }, // Name
    { wch: 35 }, // Email
    { wch: 60 }, // Contact Intelligence
    { wch: 15 }, // Research Confidence
    { wch: 15 }, // Last Researched
    { wch: 20 }, // Platform
    { wch: 20 }, // Role
    { wch: 20 }, // Company
  ];
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');

  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
