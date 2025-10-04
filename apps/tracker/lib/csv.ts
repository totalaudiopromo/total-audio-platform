export function toCSV<T extends Record<string, any>>(rows: T[], headers?: string[]): string {
  if (!rows.length) return '';
  const cols = headers ?? Array.from(new Set(rows.flatMap(r => Object.keys(r))));
  const escape = (v: any) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    if (s.includes('"') || s.includes(',') || s.includes('\n')) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const headerLine = cols.join(',');
  const dataLines = rows.map(r => cols.map(c => escape(r[c])).join(','));
  return [headerLine, ...dataLines].join('\n');
}






