import { ContactData } from './exportService';

export function exportToCsv(data: ContactData[]): string {
  if (!data.length) return '';

  // Enhanced headers with all available fields
  const headers = [
    'Name',
    'Email',
    'Contact Intelligence',
    'Research Confidence',
    'Last Researched',
    'Platform',
    'Role',
    'Company',
  ];

  const escape = (val: string | undefined) => {
    if (val == null || val === undefined) return '';
    // Escape quotes by doubling them, wrap in quotes if contains comma, quote, or newline
    const needsQuotes = /[",\n]/.test(val);
    let out = val.replace(/"/g, '""');
    if (needsQuotes) out = `"${out}"`;
    return out;
  };

  const rows = data.map(row =>
    [
      row.name,
      row.email,
      row.contactIntelligence,
      row.researchConfidence || '',
      row.lastResearched || '',
      row.platform || '',
      row.role || '',
      row.company || '',
    ]
      .map(escape)
      .join(',')
  );

  return [headers.join(','), ...rows].join('\r\n');
}
