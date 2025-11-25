'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Upload as UploadIcon, X, Check, FileText, Image as ImageIcon } from 'lucide-react';
import PortalHeader from '@/components/portal/PortalHeader';
import PortalNav from '@/components/portal/PortalNav';
import Loading from '@/components/Loading';
import { fetchArtistBySlug, type PortalArtist } from '@/lib/api/portal';

export default function UploadPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [artist, setArtist] = useState<PortalArtist | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const artistData = await fetchArtistBySlug(slug);
        if (!artistData) {
          window.location.href = '/artist/login';
          return;
        }
        if (active) setArtist(artistData);
      } catch (err) {
        console.error('[Portal] Failed to load upload page', err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setUploadSuccess(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    // Mock upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUploading(false);
    setUploadSuccess(true);
    setSelectedFiles([]);

    // Reset success message after 3 seconds
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-6 h-6 tap-accent-crm" />;
    }
    return <FileText className="w-6 h-6 text-[#737373]" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading || !artist) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center">
        <Loading message="Loading upload page…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <PortalHeader artist={artist} />
      <PortalNav artistSlug={slug} />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="liberty-heading text-4xl mb-3">Upload Files</h1>
          <p className="liberty-body text-lg text-[#737373]">
            Share press shots, logos, lyrics, and other assets with your campaign team.
          </p>
        </div>

        {/* Success Message */}
        {uploadSuccess && (
          <div className="bg-tap-good/10 border border-tap-good rounded-lg p-4 mb-6 flex items-center gap-3">
            <Check className="w-5 h-5 tap-accent-radio" />
            <p className="tap-accent-radio font-medium">Files uploaded successfully!</p>
          </div>
        )}

        {/* Upload Area */}
        <div className="liberty-card p-8 mb-6">
          <label
            htmlFor="file-upload"
            className="block border-2 border-dashed border-[#D9D7D2] rounded-lg p-12 text-center hover:border-[#111] transition-colors cursor-pointer"
          >
            <UploadIcon className="w-12 h-12 text-[#737373] mx-auto mb-4" />
            <p className="text-lg font-jakarta font-medium text-[#111] mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-[#737373]">
              Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 50MB per file)
            </p>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            />
          </label>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="liberty-card p-6 mb-6">
            <h2 className="liberty-heading text-xl mb-4">
              Selected Files ({selectedFiles.length})
            </h2>
            <div className="space-y-3">
              {selectedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-[#F7F6F2] rounded-lg border border-[#D9D7D2]"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#111] truncate">{file.name}</p>
                      <p className="liberty-metadata">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(idx)}
                    className="p-2 hover:bg-[#FAFAF8] rounded-md transition-colors"
                  >
                    <X className="w-4 h-4 text-[#737373]" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-6 py-3 bg-[#111] text-white rounded-lg hover:bg-black transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <UploadIcon size={18} />
                    <span>Upload Files</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Guidelines */}
        <div className="bg-[#F7F6F2] border border-[#D9D7D2] rounded-xl p-6">
          <h3 className="liberty-heading text-lg mb-3">Upload Guidelines</h3>
          <ul className="space-y-2 text-sm text-[#111]">
            <li className="flex items-start gap-2">
              <span className="text-[#737373] mt-0.5">•</span>
              <span>
                <strong>Press Photos:</strong> High-resolution JPG or PNG (min 2000px width)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#737373] mt-0.5">•</span>
              <span>
                <strong>Logos:</strong> PNG with transparent background preferred
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#737373] mt-0.5">•</span>
              <span>
                <strong>Lyrics:</strong> PDF or DOCX format
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#737373] mt-0.5">•</span>
              <span>
                <strong>Bio/EPK:</strong> PDF format recommended
              </span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
