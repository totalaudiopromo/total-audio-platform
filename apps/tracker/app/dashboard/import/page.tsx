'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Papa from 'papaparse';
import { useRouter, useSearchParams } from 'next/navigation';

interface CampaignImportRow {
  name: string;
  artist_name?: string;
  platform?: string;
  genre?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  target_reach?: number;
  actual_reach?: number;
  status?: string;
  notes?: string;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

function ImportCampaignsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [preview, setPreview] = useState<CampaignImportRow[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Detect Audio Intel import
  useEffect(() => {
    const source = searchParams?.get('source');
    if (source === 'audio-intel') {
      const contactsCount = searchParams?.get('contacts');
      setNotification(
        contactsCount
          ? `Ready to import ${contactsCount} enriched contacts from Audio Intel!`
          : 'Ready to import enriched contacts from Audio Intel!'
      );
      setTimeout(() => setNotification(null), 5000);
    }
  }, [searchParams]);

  // Detect clipboard import from Pitch Generator
  useEffect(() => {
    async function handleClipboardImport() {
      const source = searchParams?.get('source');
      if (source !== 'clipboard') return;

      try {
        // Read clipboard data
        const clipboardText = await navigator.clipboard.readText();
        const clipboardData = JSON.parse(clipboardText);

        // Validate structure
        if (
          !clipboardData.source ||
          clipboardData.source !== 'pitch' ||
          !clipboardData.campaign
        ) {
          setNotification('Invalid clipboard data format');
          setTimeout(() => setNotification(null), 3000);
          return;
        }

        const campaign = clipboardData.campaign;

        // Import the campaign directly via API
        setImporting(true);
        const response = await fetch('/api/campaigns/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            campaigns: [
              {
                name: campaign.name,
                artist_name: campaign.artist,
                platform: campaign.contacts?.[0]?.outlet || 'Pitch Generator',
                status: 'active',
                start_date: new Date().toISOString().split('T')[0],
                notes: `Imported from Pitch Generator\nContact: ${campaign.contacts?.[0]?.name || ''}\nEmail: ${campaign.contacts?.[0]?.email || ''}\nPitch: ${campaign.contacts?.[0]?.pitchBody?.substring(0, 200) || ''}...`,
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error('Import failed');
        }

        const importResult = await response.json();

        // Show success notification
        setNotification(
          `Campaign "${campaign.name}" imported from Pitch Generator!`
        );
        setResult(importResult);

        // Clean up URL
        window.history.replaceState({}, '', '/dashboard/import');

        // Clear notification and redirect to dashboard after delay
        setTimeout(() => {
          setNotification('Redirecting to dashboard...');
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        }, 2500);
      } catch (error) {
        console.error('Error importing from clipboard:', error);
        setNotification('Failed to import campaign from clipboard');
        setTimeout(() => setNotification(null), 3000);
      } finally {
        setImporting(false);
      }
    }

    handleClipboardImport();
  }, [searchParams]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);

    // Parse CSV for preview
    Papa.parse(selectedFile, {
      header: true,
      preview: 5,
      skipEmptyLines: true,
      complete: results => {
        setPreview(results.data as CampaignImportRow[]);
      },
      error: error => {
        console.error('CSV parse error:', error);
        alert('Failed to parse CSV file. Please check the format.');
      },
    });
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setResult(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async results => {
        try {
          const response = await fetch('/api/campaigns/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ campaigns: results.data }),
          });

          if (!response.ok) {
            throw new Error('Import failed');
          }

          const importResult = await response.json();
          setResult(importResult);

          // Reset form
          setFile(null);
          setPreview([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } catch (error: any) {
          alert(`Import failed: ${error.message}`);
        } finally {
          setImporting(false);
        }
      },
      error: error => {
        console.error('CSV parse error:', error);
        alert('Failed to parse CSV file.');
        setImporting(false);
      },
    });
  };

  const downloadTemplate = () => {
    const csvContent = `name,artist_name,platform,genre,start_date,end_date,budget,target_reach,actual_reach,status,notes
BBC Radio 1 - Future Sounds,sadact,BBC Radio,Electronic,2025-01-15,2025-02-15,550,25,18,completed,Pitched to Annie Mac successor
Spotify UK Editorial Playlists,sadact,Playlists,Electronic,2025-02-01,2025-03-01,380,15,22,completed,Got into Singled Out and Fresh Finds
Commercial Radio - Kiss FM Push,sadact,Commercial Radio,Electronic,2025-03-01,,850,12,0,active,Targeting daytime rotation`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tracker-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black font-bold max-w-md">
          {notification}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="mb-4 px-4 py-2 bg-white rounded-xl font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 transition-all text-sm"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Import Campaigns
          </h1>
          <p className="text-lg font-bold text-gray-700">
            Upload your existing campaign spreadsheet and save hours of manual
            data entry
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-2xl p-6 border-4 border-teal-500 shadow-brutal mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-gray-900 mb-3">
                How to Import
              </h3>
              <ol className="space-y-2 text-sm font-bold text-gray-800">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-black">1.</span>
                  <span>
                    Download the CSV template below to see the correct format
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-black">2.</span>
                  <span>
                    Fill in your campaign data (name is required, everything
                    else is optional)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-black">3.</span>
                  <span>Upload your CSV file and review the preview</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-black">4.</span>
                  <span>
                    Click "Import Campaigns" to add them to your dashboard
                  </span>
                </li>
              </ol>
              <button
                onClick={downloadTemplate}
                className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl font-black hover:bg-teal-700 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 text-sm"
              >
                Download CSV Template
              </button>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-2xl p-8 border-4 border-black shadow-brutal mb-6">
          <div className="border-4 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-lg font-black text-gray-900 mb-2">
                {file ? file.name : 'Click to select CSV file'}
              </p>
              <p className="text-sm font-bold text-gray-600">
                {file
                  ? `${preview.length} campaigns detected`
                  : 'Upload your campaign spreadsheet'}
              </p>
            </label>
          </div>

          {file && preview.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-black text-gray-900 mb-4">
                Preview (first 5 rows)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 px-3 font-black text-gray-700">
                        Name
                      </th>
                      <th className="text-left py-2 px-3 font-black text-gray-700">
                        Artist
                      </th>
                      <th className="text-left py-2 px-3 font-black text-gray-700">
                        Platform
                      </th>
                      <th className="text-left py-2 px-3 font-black text-gray-700">
                        Budget
                      </th>
                      <th className="text-left py-2 px-3 font-black text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-2 px-3 font-bold text-gray-800">
                          {row.name || '—'}
                        </td>
                        <td className="py-2 px-3 font-medium text-gray-700">
                          {row.artist_name || '—'}
                        </td>
                        <td className="py-2 px-3 font-medium text-gray-700">
                          {row.platform || '—'}
                        </td>
                        <td className="py-2 px-3 font-medium text-gray-700">
                          {row.budget ? `£${row.budget}` : '—'}
                        </td>
                        <td className="py-2 px-3 font-medium text-gray-700">
                          {row.status || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {file && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-xl font-black hover:bg-teal-700 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importing ? 'Importing...' : 'Import Campaigns'}
              </button>
              <button
                onClick={() => {
                  setFile(null);
                  setPreview([]);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="px-6 py-3 bg-white text-gray-900 rounded-xl font-bold border-2 border-black hover:bg-gray-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Import Results */}
        {result && (
          <div
            className={`rounded-2xl p-6 border-4 shadow-brutal ${
              result.failed === 0
                ? 'bg-green-50 border-green-500'
                : 'bg-orange-50 border-orange-500'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                  result.failed === 0 ? 'bg-green-600' : 'bg-orange-600'
                }`}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {result.failed === 0 ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  )}
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  Import{' '}
                  {result.failed === 0 ? 'Complete' : 'Completed with Errors'}
                </h3>
                <div className="space-y-2 text-sm font-bold">
                  <p className="text-green-700">
                    ✓ {result.success} campaigns imported successfully
                  </p>
                  {result.failed > 0 && (
                    <>
                      <p className="text-orange-700">
                        ⚠️ {result.failed} campaigns failed to import
                      </p>
                      {result.errors.length > 0 && (
                        <div className="mt-3 p-3 bg-white/50 rounded-lg">
                          <p className="font-black text-gray-900 mb-2">
                            Errors:
                          </p>
                          <ul className="space-y-1">
                            {result.errors.map((error, i) => (
                              <li key={i} className="text-xs text-gray-800">
                                • {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="mt-4 px-4 py-2 bg-white rounded-xl font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 transition-all text-sm"
                >
                  View Imported Campaigns
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Supported Fields */}
        <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
          <h3 className="text-lg font-black text-gray-900 mb-4">
            Supported CSV Fields
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-black text-gray-900">name</span>
              <span className="text-red-600 ml-1">*</span>
              <span className="text-gray-600 font-medium ml-2">
                Campaign name (required)
              </span>
            </div>
            <div>
              <span className="font-black text-gray-900">artist_name</span>
              <span className="text-gray-600 font-medium ml-2">
                Artist or band name
              </span>
            </div>
            <div>
              <span className="font-black text-gray-900">platform</span>
              <span className="text-gray-600 font-medium ml-2">
                BBC Radio, Playlists, Blogs, etc.
              </span>
            </div>
            <div>
              <span className="font-black text-gray-900">genre</span>
              <span className="text-gray-600 font-medium ml-2">
                Electronic, Indie, Rock, etc.
              </span>
            </div>
            <div>
              <span className="font-black text-gray-900">start_date</span>
              <span className="text-gray-600 font-medium ml-2">
                YYYY-MM-DD format
              </span>
            </div>
            <div>
              <span className="font-black text-gray-900">end_date</span>
              <span className="text-gray-600 font-medium ml-2">
                YYYY-MM-DD format
              </span>
            </div>
            <div>
              <span className="font-black text-gray-900">budget</span>
              <span className="text-gray-600 font-medium ml-2">
                Number (e.g., 550)
              </span>
            </div>
            <div>
              <span className="font-black text-gray-900">target_reach</span>
              <span className="text-gray-600 font-medium ml-2">
                Number of targets
              </span>
            </div>
            <div>
              <span className="font-black text-gray-900">actual_reach</span>
              <span className="text-gray-600 font-medium ml-2">
                Actual results achieved
              </span>
            </div>
            <div>
              <span className="font-black text-gray-900">status</span>
              <span className="text-gray-600 font-medium ml-2">
                planning, active, completed
              </span>
            </div>
            <div className="md:col-span-2">
              <span className="font-black text-gray-900">notes</span>
              <span className="text-gray-600 font-medium ml-2">
                Any additional campaign details
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ImportCampaignsPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      }
    >
      <ImportCampaignsPage />
    </Suspense>
  );
}
