import { parseIntelligenceFields, formatForCSV } from './intelligenceFormatter';

type ExportCsvColumn = { key: string; header: string };
type ExportCsvOptions = {
  fields?: string[]; // legacy: list of headers using default mapping
  columns?: ExportCsvColumn[]; // preferred: explicit key/header mapping
  delimiter?: ',' | ';' | '\t';
  includeHeaders?: boolean;
};

export function exportToCsv(data: Array<Record<string, any>>, opts: ExportCsvOptions = {}): string {
  if (!data.length) return '';
  const {
    fields = [
      'Name',
      'Email',
      'Platform',
      'Role',
      'Format',
      'Coverage',
      'Genres',
      'Contact Method',
      'Best Timing',
      'Submission Guidelines',
      'Pitch Tips',
      'Notes',
      'Research Confidence',
      'Last Researched',
      'Company',
    ],
    columns,
    delimiter = ',',
    includeHeaders = true,
  } = opts;

  const escape = (val: any) => {
    const str = val == null ? '' : String(val);
    const needsQuotes = new RegExp(`["${delimiter}\n]`).test(str);
    let out = str.replace(/"/g, '""');
    if (needsQuotes) out = `"${out}"`;
    return out;
  };

  const effectiveColumns: ExportCsvColumn[] =
    columns ?? fields.map(label => ({ key: labelToKey(label), header: label }));

  const headerLine = includeHeaders ? effectiveColumns.map(c => c.header).join(delimiter) : null;

  // Process data to extract intelligence fields using formatter
  const processedData = data.map(row => {
    // If contact has intelligence string, parse it into separate fields
    if (row.contactIntelligence && typeof row.contactIntelligence === 'string') {
      const intelligenceFields = parseIntelligenceFields(row.contactIntelligence);
      const csvFields = formatForCSV(intelligenceFields);

      // Merge parsed intelligence fields with existing row data
      return { ...row, ...csvFields };
    }
    return row;
  });

  const lines = processedData.map(row =>
    effectiveColumns.map(col => escape(row[col.key] ?? '')).join(delimiter)
  );

  return [headerLine, ...lines].filter(Boolean).join('\r\n');
}

function labelToKey(label: string): string {
  switch (label) {
    case 'Name':
      return 'name';
    case 'Email':
      return 'email';
    case 'Platform':
      return 'platform';
    case 'Role':
      return 'role';
    case 'Format':
      return 'format';
    case 'Coverage':
      return 'coverage';
    case 'Genres':
      return 'genres';
    case 'Contact Method':
      return 'contactMethod';
    case 'Best Timing':
      return 'bestTiming';
    case 'Submission Guidelines':
      return 'submissionGuidelines';
    case 'Pitch Tips':
      return 'pitchTips';
    case 'Notes':
      return 'notes';
    case 'Research Confidence':
      return 'researchConfidence';
    case 'Last Researched':
      return 'lastResearched';
    case 'Company':
      return 'company';
    case 'Contact Intelligence':
      return 'contactIntelligence';
    default:
      return label;
  }
}
