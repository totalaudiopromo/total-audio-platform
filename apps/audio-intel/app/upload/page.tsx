"use client";
import React, { useEffect, useState } from 'react';
import FileUpload from '../components/FileUpload';
import ProgressBarWithDog from '../components/ProgressBarWithDog';
import ExportButtons from '../components/ExportButtons';
import { ErrorMessage, SuccessMessage } from '@/components/ErrorMessage';
import { getUserFriendlyError } from '@/utils/errorMessages';
import { trackFileUpload, trackEnrichmentStart, trackEnrichmentComplete, trackExport, trackFunnelProgression, trackPageView, trackError } from '@/utils/analytics';

interface Contact {
  name: string;
  email: string;
}

function parseCsv(text: string): Contact[] {
  // Enhanced CSV parser with better debugging
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  if (!lines.length) return [];
  
  const [header, ...rows] = lines;
  console.log('CSV Debug - Total lines:', lines.length);
  console.log('CSV Debug - Header:', header);
  
  // Try different delimiters
  let delimiter = ',';
  if (header.includes(';')) delimiter = ';';
  if (header.includes('\t')) delimiter = '\t';
  
  const headers = header.split(delimiter).map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
  console.log('CSV Debug - Headers found:', headers);
  console.log('CSV Debug - Using delimiter:', delimiter);
  
  const nameIdx = headers.findIndex(h => h.includes('name'));
  const emailIdx = headers.findIndex(h => h.includes('email') || h.includes('mail'));
  
  console.log('CSV Debug - Name column index:', nameIdx);
  console.log('CSV Debug - Email column index:', emailIdx);
  
  const contacts = rows.map((row, idx) => {
    const cols = row.split(delimiter).map(col => col.trim().replace(/['"]/g, ''));
    const contact = {
      name: nameIdx >= 0 ? cols[nameIdx] || '' : `Contact ${idx + 1}`,
      email: emailIdx >= 0 ? cols[emailIdx] || '' : '',
    };
    return contact;
  });
  
  const withEmails = contacts.filter(c => c.email && c.email.includes('@'));
  const withoutEmails = contacts.length - withEmails.length;
  
  console.log('CSV Debug - Total parsed:', contacts.length);
  console.log('CSV Debug - With valid emails:', withEmails.length);
  console.log('CSV Debug - Without emails:', withoutEmails);
  
  return withEmails;
}

// --- Analytics Utility ---
function trackEvent(event: string, data: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, data);
  }
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, data: { ...data, timestamp: new Date().toISOString() } }),
  });
}
// Tracking functions are now imported from analytics utils

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [preview, setPreview] = useState<Contact[]>([]);
  const [enriching, setEnriching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [enriched, setEnriched] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [errorContext, setErrorContext] = useState<any>(null);
  const [userEmail, setUserEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [notifyStatus, setNotifyStatus] = useState<string | null>(null);
  // New: user-controlled export schema and format preferences
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'Name','Email','Contact Intelligence','Research Confidence','Last Researched'
  ]);
  const [formatPreference, setFormatPreference] = useState<'csv'|'excel'|'pdf'>('csv');
  const [delimiter, setDelimiter] = useState<',' | ';' | '\t'>(',');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [columnMap, setColumnMap] = useState<Array<{ key: string; header: string }>>([
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'contactIntelligence', header: 'Contact Intelligence' },
    { key: 'researchConfidence', header: 'Research Confidence' },
    { key: 'lastResearched', header: 'Last Researched' },
    { key: 'platform', header: 'Platform' },
    { key: 'role', header: 'Role' },
    { key: 'company', header: 'Company' },
  ]);
  // Presets with localStorage persistence
  const [presets, setPresets] = useState<Array<{ name: string; fields: string[]; columns: {key:string; header:string}[]; format: 'csv'|'excel'|'pdf'; delimiter: ','|';'|'\t'; includeHeaders: boolean }>>([]);
  const [presetName, setPresetName] = useState('');

  // Load presets and last selection
  useEffect(() => {
    // Track page view
    trackPageView('upload', document.title);
    trackFunnelProgression('FILE_UPLOAD', { page: 'upload' });
    
    try {
      const raw = localStorage.getItem('audio-intel:export-presets');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setPresets(parsed);
      }
      const last = localStorage.getItem('audio-intel:export-last');
      if (last) {
        const p = JSON.parse(last);
        if (p?.fields) setSelectedFields(p.fields);
        if (p?.columns) setColumnMap(p.columns);
        if (p?.formatPreference) setFormatPreference(p.formatPreference);
        if (p?.delimiter) setDelimiter(p.delimiter);
        if (typeof p?.includeHeaders === 'boolean') setIncludeHeaders(p.includeHeaders);
      }
    } catch {}
  }, []);

  function mapKeyToLabel(key: string): string {
    switch (key) {
      case 'name': return 'Name';
      case 'email': return 'Email';
      case 'contactIntelligence': return 'Contact Intelligence';
      case 'researchConfidence': return 'Research Confidence';
      case 'lastResearched': return 'Last Researched';
      case 'platform': return 'Platform';
      case 'role': return 'Role';
      case 'company': return 'Company';
      default: return key;
    }
  }

  const handleFile = (f: File) => {
    setFile(f);
    setError(null);
    setErrorContext(null);
    
    // Check file size (max 10MB)
    if (f.size > 10 * 1024 * 1024) {
      setErrorContext({
        operation: 'upload',
        errorType: 'FILE_TOO_LARGE',
        details: { size: f.size, maxSize: 10 * 1024 * 1024 }
      });
      return;
    }
    
    // Check file type
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain'];
    if (!allowedTypes.includes(f.type) && !f.name.match(/\.(csv|xlsx|xls|txt)$/i)) {
      setErrorContext({
        operation: 'upload',
        errorType: 'INVALID_FORMAT',
        details: { type: f.type, name: f.name }
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const text = e.target?.result as string;
        const parsed = parseCsv(text);
        
        if (parsed.length === 0) {
          setErrorContext({
            operation: 'upload',
            errorType: 'NO_EMAILS_FOUND',
            details: { fileType: f.type, content: text.substring(0, 200) }
          });
          return;
        }
        
        setContacts(parsed);
        setPreview(parsed.slice(0, 5));
        trackFileUpload(f.type, parsed.length, f.size);
        trackFunnelProgression('FILE_UPLOAD', { fileType: f.type, contactCount: parsed.length });
      } catch (parseError) {
        setErrorContext({
          operation: 'upload',
          errorType: 'PARSE_ERROR',
          details: { error: parseError, fileType: f.type }
        });
      }
    };
    reader.onerror = () => {
      setErrorContext({
        operation: 'upload',
        errorType: 'INVALID_FORMAT',
        details: { error: 'File read failed' }
      });
    };
    reader.readAsText(f);
  };

  const handleEnrich = async () => {
    setEnriching(true);
    setProgress(0);
    setEnriched([]);
    setError(null);
    setEmailSubmitted(!!userEmail);
    setNotifyStatus(null);
    
    // Track enrichment start
    trackEnrichmentStart(contacts.length, userEmail);
    trackFunnelProgression('ENRICHMENT_START', { contactCount: contacts.length, userEmail });
    
    try {
      // Batch in groups of 5 for progress demo (can adjust as needed)
      const batchSize = 5;
      let results: any[] = [];
      for (let i = 0; i < contacts.length; i += batchSize) {
        const batch = contacts.slice(i, i + batchSize);
        const res = await fetch('/api/enrich-claude', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contacts: batch }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Enrichment failed');
        results = results.concat(data.enriched);
        setProgress(Math.min(results.length, contacts.length));
      }
      setEnriched(results);
      
      // Track enrichment completion
      const processingTime = (Date.now() - Date.now()) / 1000; // Calculate actual processing time
      const successRate = results.filter(r => r.confidence !== 'Low' && !r.errors).length / results.length * 100;
      trackEnrichmentComplete(results.length, processingTime, successRate);
      trackFunnelProgression('ENRICHMENT_COMPLETE', { contactCount: results.length, successRate });
      
      // Save results for download
      let downloadUrl = '';
      try {
        const saveRes = await fetch('/api/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enriched: results.map(({ name, email, contactIntelligence }) => ({ name, email, contactIntelligence })) }),
        });
        if (saveRes.ok) {
          downloadUrl = '/api/download';
        }
      } catch {}
      // Notify by email if user provided one
      if (userEmail) {
        try {
          const notifyRes = await fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, downloadUrl }),
          });
          const notifyData = await notifyRes.json();
          if (notifyData.success) {
            setNotifyStatus('Notification email sent!');
          } else {
            setNotifyStatus('Failed to send notification email: ' + (notifyData.error || 'Unknown error'));
          }
        } catch (err: any) {
          setNotifyStatus('Failed to send notification email: ' + (err.message || 'Unknown error'));
        }
      }
    } catch (e: any) {
      // Determine error type based on error message
      let errorType = 'API_ERROR';
      if (e.message?.includes('rate limit') || e.message?.includes('too many')) {
        errorType = 'RATE_LIMITED';
      } else if (e.message?.includes('email') || e.message?.includes('invalid')) {
        errorType = 'INVALID_EMAILS';
      }
      
      setErrorContext({
        operation: 'enrichment',
        errorType,
        details: { error: e.message, contacts: contacts.length }
      });
      trackError('enrichment_failed', e.message || 'Unknown error');
    } finally {
      setEnriching(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Upload Contacts for Enrichment</h1>
      <div className="mb-6">
        <label className="block font-semibold mb-1" htmlFor="user-email">
          Email (optional)
        </label>
        <input
          id="user-email"
          type="email"
          className="w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email to get notified when results are ready"
          value={userEmail}
          onChange={e => setUserEmail(e.target.value)}
        />
        <div className="text-xs text-gray-500 mt-1">We'll email you when your results are ready. (Optional)</div>
      </div>
      <FileUpload onFile={handleFile} />
      {errorContext && (
        <ErrorMessage 
          context={errorContext} 
          onRetry={() => {
            setErrorContext(null);
            setError(null);
          }}
          onDismiss={() => {
            setErrorContext(null);
            setError(null);
          }}
        />
      )}
      {error && !errorContext && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
          <div className="text-red-800 font-bold">{error}</div>
        </div>
      )}
      {preview.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Preview (first 5 contacts):</h2>
          <table className="w-full border text-sm mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Email</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((c, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1">{c.name}</td>
                  <td className="border px-2 py-1">{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
            disabled={enriching || contacts.length === 0}
            onClick={handleEnrich}
          >
            {enriching ? 'Enriching...' : 'Start Enrichment'}
          </button>
        </div>
      )}
      {enriching && (
        <div className="mt-8">
          <ProgressBarWithDog current={progress} total={contacts.length} />
        </div>
      )}
      {enriched.length > 0 && (
        <div className="mt-10">
          <SuccessMessage 
            message={`Successfully enriched ${enriched.length} contact${enriched.length !== 1 ? 's' : ''}!`}
            details="Your contacts are ready for export. Choose your preferred format below."
          />
          {emailSubmitted && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700">
              We will email you at <span className="font-semibold">{userEmail}</span> when your results are ready.
              {notifyStatus && (
                <div className="mt-2 text-sm text-green-700">{notifyStatus}</div>
              )}
            </div>
          )}
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="font-semibold text-lg mb-2 md:mb-0">
              Enriched {enriched.length} contact{enriched.length !== 1 ? 's' : ''}
            </div>
            <ExportButtons 
              enriched={enriched.map(({ name, email, contactIntelligence, researchConfidence, lastResearched, platform, role, company }) => ({ 
                name, email, contactIntelligence, researchConfidence, lastResearched, platform, role, company 
              }))}
              onExport={() => trackExport(formatPreference, enriched.length, selectedFields)}
              fields={selectedFields}
              columns={columnMap.filter(c => selectedFields.includes(mapKeyToLabel(c.key)))}
              formatPreference={formatPreference}
              delimiter={delimiter}
              includeHeaders={includeHeaders}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Email</th>
                  <th className="border px-2 py-1">Contact Intelligence</th>
                </tr>
              </thead>
              <tbody>
                {enriched.map((c, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1 align-top">{c.name}</td>
                    <td className="border px-2 py-1 align-top">{c.email}</td>
                    <td className="border px-2 py-1 whitespace-pre-line align-top" style={{ maxWidth: 400 }}>
                      {c.contactIntelligence}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Export Preferences */}
      {enriched.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="font-semibold mb-3">Export Preferences</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="font-medium text-sm mb-2">Fields to include</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[ 'Name','Email','Contact Intelligence','Research Confidence','Last Researched','Platform','Role','Company' ].map(f => (
                  <label key={f} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" checked={selectedFields.includes(f)} onChange={(e) => {
                      setSelectedFields(prev => e.target.checked ? [...prev, f] : prev.filter(v => v !== f));
                    }} />
                    {f}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="font-medium text-sm mb-1">Format</div>
                <select value={formatPreference} onChange={(e) => setFormatPreference(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
                  <option value="csv">CSV</option>
                  <option value="excel">Excel</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm">Delimiter</label>
                <select value={delimiter} onChange={(e) => setDelimiter(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
                  <option value=",">Comma (,)</option>
                  <option value=";">Semicolon (;)</option>
                  <option value="\t">Tab</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300" checked={includeHeaders} onChange={(e) => setIncludeHeaders(e.target.checked)} />
                Include headers row
              </label>
            </div>
          </div>
          <div className="mt-4">
            <div className="font-medium text-sm mb-2">Per-contact field mapping</div>
            <div className="grid md:grid-cols-2 gap-3">
              {columnMap.map((c, idx) => (
                <div key={c.key} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-36">{c.key}</span>
                  <input
                    value={c.header}
                    onChange={(e) => setColumnMap(prev => prev.map((p,i)=> i===idx ? { ...p, header: e.target.value } : p))}
                    className="flex-1 border rounded px-2 py-1 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input value={presetName} onChange={(e)=>setPresetName(e.target.value)} placeholder="Preset name" className="border rounded px-2 py-1 text-sm"/>
            <button
              className="text-sm px-3 py-1 bg-blue-600 text-white rounded"
              onClick={() => {
                if (!presetName.trim()) return;
                const newPreset = { name: presetName.trim(), fields: selectedFields, columns: columnMap, format: formatPreference, delimiter, includeHeaders };
                const newPresets = [...presets.filter(p => p.name !== newPreset.name), newPreset];
                setPresets(newPresets);
                try { localStorage.setItem('audio-intel:export-presets', JSON.stringify(newPresets)); } catch {}
                try { localStorage.setItem('audio-intel:export-last', JSON.stringify({ ...newPreset, formatPreference })); } catch {}
                setPresetName('');
              }}
            >Save preset</button>
            {presets.length > 0 && (
              <select className="text-sm border rounded px-2 py-1" onChange={(e)=>{
                const p = presets.find(x => x.name === e.target.value);
                if (!p) return;
                setSelectedFields(p.fields);
                setColumnMap(p.columns);
                setFormatPreference(p.format);
                setDelimiter(p.delimiter);
                setIncludeHeaders(p.includeHeaders);
                try { localStorage.setItem('audio-intel:export-last', JSON.stringify({ ...p, formatPreference: p.format })); } catch {}
              }}>
                <option value="">Load preset…</option>
                {presets.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
              </select>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 