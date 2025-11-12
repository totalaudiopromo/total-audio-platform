'use client';

import { useState, useCallback } from 'react';
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface WarmReportUploaderProps {
  campaignId: string;
  onUploadComplete?: (reportId: string, summary: WarmReportSummary) => void;
}

interface WarmReportSummary {
  totalPlays: number;
  stationsCount: number;
  countriesCount: number;
  dateRangeStart: string;
  dateRangeEnd: string;
  playsByCountry: Record<string, number>;
  playsByStation: Record<string, number>;
}

export function WarmReportUploader({ campaignId, onUploadComplete }: WarmReportUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [summary, setSummary] = useState<WarmReportSummary | null>(null);

  const acceptedFileTypes = [
    '.csv',
    '.xlsx',
    '.xls',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  }, []);

  const validateAndSetFile = (selectedFile: File) => {
    // Check file type
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension || '')) {
      setError('Please upload a CSV or Excel file (.csv, .xlsx, .xls)');
      return;
    }

    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('campaignId', campaignId);

      // Upload file with progress tracking
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(Math.round(percentComplete));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);

          if (response.success) {
            setSuccess(true);
            setSummary(response.summary);

            if (onUploadComplete && response.reportId) {
              onUploadComplete(response.reportId, response.summary);
            }

            // Reset after 3 seconds
            setTimeout(() => {
              setFile(null);
              setSuccess(false);
              setProgress(0);
            }, 3000);
          } else {
            throw new Error(response.error || 'Upload failed');
          }
        } else {
          throw new Error(`Upload failed with status ${xhr.status}`);
        }
        setUploading(false);
      });

      xhr.addEventListener('error', () => {
        setError('Network error occurred during upload');
        setUploading(false);
      });

      xhr.open('POST', '/api/tracker/warm/upload');
      xhr.send(formData);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setSummary(null);
  };

  return (
    <div className="space-y-4">
      {/* Drag-and-Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 transition-all
          ${isDragging ? 'border-cyan-500 bg-cyan-50' : 'border-slate-300 bg-white'}
          ${file ? 'bg-slate-50' : ''}
          hover:border-cyan-400 cursor-pointer
        `}
      >
        <input
          type="file"
          id="warm-file-input"
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />

        <div className="text-center">
          {!file ? (
            <>
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-2 text-sm text-slate-600">
                <span className="font-semibold text-cyan-600">Click to upload</span> or drag and drop
              </p>
              <p className="mt-1 text-xs text-slate-500">
                CSV or Excel files up to 10MB
              </p>
            </>
          ) : (
            <div className="flex items-center justify-center space-x-3">
              <DocumentIcon className="h-10 w-10 text-cyan-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900">{file.name}</p>
                <p className="text-xs text-slate-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              {!uploading && !success && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Uploading and parsing...</span>
            <span className="text-slate-900 font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message with Summary */}
      {success && summary && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm font-medium text-green-800">WARM report uploaded successfully!</p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded p-3">
              <p className="text-2xl font-bold text-slate-900">{summary.totalPlays}</p>
              <p className="text-xs text-slate-600">Total Plays</p>
            </div>
            <div className="bg-white rounded p-3">
              <p className="text-2xl font-bold text-slate-900">{summary.stationsCount}</p>
              <p className="text-xs text-slate-600">Stations</p>
            </div>
            <div className="bg-white rounded p-3">
              <p className="text-2xl font-bold text-slate-900">{summary.countriesCount}</p>
              <p className="text-xs text-slate-600">Countries</p>
            </div>
          </div>

          <div className="text-xs text-slate-600">
            <p>
              Date range: {new Date(summary.dateRangeStart).toLocaleDateString()} -{' '}
              {new Date(summary.dateRangeEnd).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {file && !uploading && !success && (
        <button
          onClick={handleUpload}
          className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
        >
          Upload and Parse WARM Report
        </button>
      )}
    </div>
  );
}
