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
      'Contact Intelligence',
      'Research Confidence',
      'Last Researched',
      'Platform',
      'Role',
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
  const lines = data.map(row =>
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
    case 'Contact Intelligence':
      return 'contactIntelligence';
    case 'Research Confidence':
      return 'researchConfidence';
    case 'Last Researched':
      return 'lastResearched';
    case 'Platform':
      return 'platform';
    case 'Role':
      return 'role';
    case 'Company':
      return 'company';
    default:
      return label;
  }
}
