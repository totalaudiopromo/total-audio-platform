'use client';

import { useState } from 'react';
import { X, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ImportRow {
  name: string;
  artist_name?: string;
  platform?: string;
  genre?: string;
  budget?: number | string;
  target_reach?: number | string;
  status?: string;
  errors?: string[];
}

interface ImportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ImportRow[];
  onConfirm: () => void;
  isImporting: boolean;
}

export function ImportPreviewModal({
  isOpen,
  onClose,
  data,
  onConfirm,
  isImporting,
}: ImportPreviewModalProps) {
  const [showErrors, setShowErrors] = useState(true);

  if (!isOpen) return null;

  const validRows = data.filter(row => !row.errors || row.errors.length === 0);
  const errorRows = data.filter(row => row.errors && row.errors.length > 0);

  const downloadSampleCSV = () => {
    const sample = `name,artist_name,platform,genre,budget,target_reach,status
Radio Campaign,Artist Name,Radio,Electronic,500,50,planning
Spotify Pitch,Artist Name,Spotify,Electronic,300,30,active
PR Campaign,Artist Name,Press,Electronic,800,100,planning`;

    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tracker-sample-import.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />

      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[9999] md:w-full md:max-w-4xl md:max-h-[90vh] overflow-auto">
        <div className="bg-white rounded-2xl border-4 border-black shadow-brutal relative">
          <button
            onClick={onClose}
            disabled={isImporting}
            className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 border-2 border-black hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-900 font-black" />
          </button>

          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              Import Preview
            </h2>
            <p className="text-sm font-bold text-gray-600 mb-6">
              Review your import data before confirming
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 rounded-xl p-4 border-2 border-green-500">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-black text-green-900 uppercase">
                    Valid
                  </span>
                </div>
                <p className="text-3xl font-black text-green-600">
                  {validRows.length}
                </p>
                <p className="text-xs font-bold text-green-700">
                  campaigns ready to import
                </p>
              </div>

              <div
                className={`rounded-xl p-4 border-2 ${errorRows.length > 0 ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-300'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle
                    className={`h-5 w-5 ${errorRows.length > 0 ? 'text-red-600' : 'text-gray-400'}`}
                  />
                  <span
                    className={`text-sm font-black uppercase ${errorRows.length > 0 ? 'text-red-900' : 'text-gray-500'}`}
                  >
                    Errors
                  </span>
                </div>
                <p
                  className={`text-3xl font-black ${errorRows.length > 0 ? 'text-red-600' : 'text-gray-400'}`}
                >
                  {errorRows.length}
                </p>
                <p
                  className={`text-xs font-bold ${errorRows.length > 0 ? 'text-red-700' : 'text-gray-500'}`}
                >
                  rows with issues
                </p>
              </div>
            </div>

            {/* Errors Section */}
            {errorRows.length > 0 && (
              <div className="mb-6 bg-red-50 rounded-xl p-4 border-2 border-red-500">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <h3 className="text-base font-black text-red-900">
                      Found {errorRows.length} Error
                      {errorRows.length > 1 ? 's' : ''}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowErrors(!showErrors)}
                    className="text-xs font-bold text-red-700 hover:text-red-800 underline"
                  >
                    {showErrors ? 'Hide' : 'Show'} Details
                  </button>
                </div>

                {showErrors && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {errorRows.map((row, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-lg p-3 border border-red-200"
                      >
                        <p className="text-sm font-bold text-gray-900 mb-1">
                          Row {data.indexOf(row) + 1}:{' '}
                          {row.name || 'Unnamed campaign'}
                        </p>
                        <ul className="text-xs text-red-700 space-y-1">
                          {row.errors?.map((error, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-red-600 mt-0.5">→</span>
                              <span>{error}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs font-bold text-red-700 mt-3">
                  ⚠️ Rows with errors will be skipped. Only valid rows will be
                  imported.
                </p>
              </div>
            )}

            {/* Valid Rows Preview */}
            {validRows.length > 0 && (
              <div className="mb-6">
                <h3 className="text-base font-black text-gray-900 mb-3">
                  Valid Campaigns ({validRows.length})
                </h3>
                <div className="bg-gray-50 rounded-xl border-2 border-gray-300 overflow-hidden max-h-64 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-100 border-b-2 border-gray-300 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left font-black text-gray-900">
                          Campaign Name
                        </th>
                        <th className="px-3 py-2 text-left font-black text-gray-900">
                          Platform
                        </th>
                        <th className="px-3 py-2 text-left font-black text-gray-900">
                          Budget
                        </th>
                        <th className="px-3 py-2 text-left font-black text-gray-900">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {validRows.slice(0, 10).map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-200 hover:bg-gray-100"
                        >
                          <td className="px-3 py-2 font-bold text-gray-900">
                            {row.name}
                          </td>
                          <td className="px-3 py-2 font-medium text-gray-700">
                            {row.platform || '-'}
                          </td>
                          <td className="px-3 py-2 font-medium text-gray-700">
                            {row.budget ? `£${row.budget}` : '-'}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                row.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {row.status || 'planning'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {validRows.length > 10 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-3 py-2 text-center text-xs font-bold text-gray-500"
                          >
                            + {validRows.length - 10} more campaigns...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sample CSV Download */}
            <div className="mb-6 bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-sm font-black text-teal-900 mb-1">
                    Need a template?
                  </h4>
                  <p className="text-xs font-bold text-teal-700">
                    Download our sample CSV to see the correct format for
                    imports
                  </p>
                </div>
                <button
                  onClick={downloadSampleCSV}
                  className="flex-shrink-0 px-4 py-2 bg-teal-600 text-white rounded-lg font-bold text-xs hover:bg-teal-700 transition-all flex items-center gap-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
                >
                  <Download className="h-4 w-4" />
                  Download Sample
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t-2 border-gray-200">
              <button
                onClick={onClose}
                disabled={isImporting}
                className="px-6 py-3 bg-white text-gray-900 rounded-xl font-bold border-2 border-black hover:bg-gray-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isImporting || validRows.length === 0}
                className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-xl font-black hover:bg-teal-700 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isImporting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Importing...
                  </>
                ) : (
                  `Import ${validRows.length} Campaign${validRows.length !== 1 ? 's' : ''}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
