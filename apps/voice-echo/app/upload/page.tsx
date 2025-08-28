"use client";
import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ProgressBarWithDog from '../components/ProgressBarWithDog';
import ExportButtons from '../components/ExportButtons';

interface Contact {
  name: string;
  email: string;
}

function parseCsv(text: string): Contact[] {
  // Simple CSV parser for name/email columns
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const [header, ...rows] = lines;
  const headers = header.split(',').map(h => h.trim().toLowerCase());
  const nameIdx = headers.findIndex(h => h.includes('name'));
  const emailIdx = headers.findIndex(h => h.includes('email'));
  return rows.map(row => {
    const cols = row.split(',');
    return {
      name: cols[nameIdx] || '',
      email: cols[emailIdx] || '',
    };
  }).filter(c => c.email);
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
function trackFileUpload(fileType: string, contactCount: number) {
  trackEvent('file_upload', { fileType, contactCount });
}
function trackEnrichment(contactCount: number, processingTime: number) {
  trackEvent('enrichment_completed', { contactCount, processingTime });
}
function trackExport(format: string, enrichedCount: number) {
  trackEvent('export', { format, enrichedCount });
}
function trackError(errorType: string, details: string) {
  trackEvent('error', { errorType, details });
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [preview, setPreview] = useState<Contact[]>([]);
  const [enriching, setEnriching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [enriched, setEnriched] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [notifyStatus, setNotifyStatus] = useState<string | null>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setError(null);
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const parsed = parseCsv(text);
      setContacts(parsed);
      setPreview(parsed.slice(0, 5));
      trackFileUpload(f.type, parsed.length);
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(f);
  };

  const handleEnrich = async () => {
    setEnriching(true);
    setProgress(0);
    setEnriched([]);
    setError(null);
    setEmailSubmitted(!!userEmail);
    setNotifyStatus(null);
    try {
      // Batch in groups of 5 for progress demo (can adjust as needed)
      const batchSize = 5;
      let results: any[] = [];
      for (let i = 0; i < contacts.length; i += batchSize) {
        const batch = contacts.slice(i, i + batchSize);
        const res = await fetch('/api/enrich', {
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
      trackEnrichment(results.length, 0); // Placeholder for processing time
    } catch (e: any) {
      setError(e.message || 'Enrichment failed');
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
      {error && <div className="text-red-600 mt-4">{error}</div>}
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
            <ExportButtons enriched={enriched.map(({ name, email, contactIntelligence }) => ({ name, email, contactIntelligence }))} onExport={() => trackExport('csv', enriched.length)} />
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
    </div>
  );
} 