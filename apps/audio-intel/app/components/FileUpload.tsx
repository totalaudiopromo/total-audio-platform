import React, { useState } from 'react';
import { Upload, Music, FileText, X, Check, Sparkles } from 'lucide-react';

interface FileUploadProps {
  onFile: (file: File) => void;
  onAnalytics?: (fileType: string, contactCount: number) => void;
  fileType?: 'audio' | 'csv'; // Add fileType prop to determine behavior
}

export default function FileUpload({ onFile, onAnalytics, fileType = 'csv' }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('FileUpload: handleChange called', e.target.files);
    const file = e.target.files?.[0];
    if (file) {
      console.log('FileUpload: File selected', file.name, file.type, file.size);
      if (fileType === 'audio') {
        // Validate audio file
        const validAudioTypes = [
          'audio/mpeg',
          'audio/mp3',
          'audio/wav',
          'audio/ogg',
          'audio/aac',
          'audio/flac',
          'audio/m4a',
          'audio/webm',
        ];

        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const validExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'webm'];

        console.log('FileUpload: Validating audio file', file.type, fileExtension);

        if (
          !validAudioTypes.includes(file.type) &&
          !validExtensions.includes(fileExtension || '')
        ) {
          console.log('FileUpload: Invalid audio file');
          setError('Please select a valid audio file (MP3, WAV, OGG, AAC, FLAC, M4A, or WEBM)');
          setSelectedFile(null);
          return;
        }

        console.log('FileUpload: Valid audio file, calling onFile');
        setError(null);
        setSelectedFile(file);
        onFile(file);

        if (onAnalytics) {
          const ext = fileExtension || 'unknown';
          onAnalytics(ext, 0);
        }
      } else {
        // Handle CSV/Excel files (existing logic)
        console.log('FileUpload: Valid file, calling onFile');
        setError(null);
        setSelectedFile(file);
        onFile(file);

        if (onAnalytics) {
          const ext = file.name.split('.').pop() || 'unknown';
          onAnalytics(ext, 0);
        }
      }
    } else {
      console.log('FileUpload: No file selected');
    }
  };

  const handleRemoveFile = () => {
    console.log('FileUpload: Removing file');
    setSelectedFile(null);
    setError(null);
    // Reset the input
    const input = document.getElementById('file-upload') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // Handle the file directly instead of creating a synthetic event
      if (file) {
        setSelectedFile(file);
        onFile(file);
        if (onAnalytics) {
          onAnalytics(fileType, 1);
        }
      }
    }
  };

  const getAcceptTypes = () => {
    if (fileType === 'audio') {
      return 'audio/*,.mp3,.wav,.ogg,.aac,.flac,.m4a,.webm';
    }
    return '.csv,.xlsx,.xls,.txt';
  };

  const getSupportedFormats = () => {
    if (fileType === 'audio') {
      return 'Supported formats: MP3, WAV, OGG, AAC, FLAC, M4A, WEBM';
    }
    return 'Supported formats: CSV, Excel, TXT';
  };

  console.log(
    'FileUpload: Rendering with fileType:',
    fileType,
    'selectedFile:',
    selectedFile?.name
  );

  return (
    <div
      className={`card-glass-hover border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
        isDragOver ? 'border-blue-400 bg-blue-500/10 scale-105' : 'border-white/30'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="hidden"
        id="file-upload"
        onChange={handleChange}
        accept={getAcceptTypes()}
      />

      {!selectedFile ? (
        <div className="space-y-4">
          <div className="text-white/80 mb-4">
            <div className="flex items-center justify-center mb-3">
              {fileType === 'audio' ? (
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-400 rounded-2xl flex items-center justify-center animate-bounce-in">
                  <Music className="w-8 h-8 text-white" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-400 rounded-2xl flex items-center justify-center animate-bounce-in">
                  <FileText className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <div className="text-lg font-semibold mb-2 text-white">
              {fileType === 'audio' ? 'Upload Audio File' : 'Upload Contact List'}
            </div>
            <div className="text-sm text-white/70">
              {isDragOver ? 'Drop your file here' : 'Click below to select a file or drag and drop'}
            </div>
          </div>
          <label
            htmlFor="file-upload"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
          >
            <Upload className="w-5 h-5 mr-2 inline group-hover:animate-bounce" />
            <Sparkles className="w-4 h-4 mr-2 inline group-hover:animate-spin-slow" />
            Choose File
          </label>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium border border-green-400/30 backdrop-blur-xl">
              <Check className="w-4 h-4 inline mr-2" />
              File Selected
            </div>
            <button
              onClick={handleRemoveFile}
              className="text-red-400 hover:text-red-300 text-sm font-medium bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 px-3 py-2 rounded-lg hover:bg-red-500 hover:bg-opacity-20 transition-all duration-300 hover:scale-105"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="text-white font-medium text-lg">{selectedFile.name}</div>
          <div className="text-white/60 text-sm">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full max-w-xs bg-white bg-opacity-10 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-400 text-sm font-medium bg-white bg-opacity-10 backdrop-blur-sm border border-red-400 border-opacity-30 p-4 rounded-xl animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <X className="w-4 h-4" />
            {error}
          </div>
        </div>
      )}

      {!selectedFile && <div className="mt-4 text-white/60 text-sm">{getSupportedFormats()}</div>}
    </div>
  );
}
