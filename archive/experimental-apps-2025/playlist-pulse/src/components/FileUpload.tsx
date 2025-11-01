'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { Upload, Music, Play, X, FileAudio, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/context/AppContext';

const ACCEPTED_AUDIO_TYPES = [
  'audio/mp3',
  'audio/mpeg',
  'audio/wav',
  'audio/wave',
  'audio/flac',
  'audio/aac',
  'audio/ogg',
  'audio/m4a',
  'audio/x-m4a',
];

export default function FileUpload() {
  const { state, dispatch } = useApp();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploadIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (uploadIntervalRef.current) {
        clearInterval(uploadIntervalRef.current);
      }
    };
  }, []);

  const handleFileUpload = useCallback(
    (file: File) => {
      setError(null);

      // Validate file type
      if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
        setError('Please upload a valid audio file (MP3, WAV, FLAC, AAC, OGG, M4A)');
        return;
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }

      dispatch({ type: 'SET_UPLOADED_FILE', payload: file });
      dispatch({ type: 'SET_IS_UPLOADING', payload: true });
      dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: 0 });

      // Simulate upload progress with smooth animation
      let progress = 0;

      // Clear any existing interval
      if (uploadIntervalRef.current) {
        clearInterval(uploadIntervalRef.current);
      }

      uploadIntervalRef.current = setInterval(() => {
        progress += Math.random() * 8 + 2; // Add 2-10% each time for smooth forward movement

        if (progress >= 100) {
          progress = 100;
          if (uploadIntervalRef.current) {
            clearInterval(uploadIntervalRef.current);
            uploadIntervalRef.current = null;
          }
          dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: progress });
          dispatch({ type: 'SET_IS_UPLOADING', payload: false });
          dispatch({ type: 'SET_UPLOAD_COMPLETE', payload: true });

          // Navigate to results page after upload completes
          setTimeout(() => {
            window.location.href = '/results';
          }, 1000);
        } else {
          dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: progress });
        }
      }, 150);
    },
    [dispatch]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileUpload(e.dataTransfer.files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFileUpload(e.target.files[0]);
      }
    },
    [handleFileUpload]
  );

  const removeFile = useCallback(() => {
    // Clear any ongoing upload
    if (uploadIntervalRef.current) {
      clearInterval(uploadIntervalRef.current);
      uploadIntervalRef.current = null;
    }

    dispatch({ type: 'SET_UPLOAD_COMPLETE', payload: false });
    dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: 0 });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'upload' });
    dispatch({ type: 'SET_UPLOADED_FILE', payload: null });
    setError(null);
  }, [dispatch]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (_file: File) => {
    // This would normally use the Web Audio API to get actual duration
    // For demo purposes, we'll show a placeholder
    return '3:42';
  };

  // Show uploaded file info with enhanced styling
  if (state.uploadedFile && !state.uploadComplete) {
    return (
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Selected Audio File</h2>
            <Button
              onClick={removeFile}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-white/30 rounded-3xl p-8 mb-8 shadow-2xl">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center shadow-2xl">
                <FileAudio className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="text-xl font-bold text-white mb-3 truncate"
                  title={state.uploadedFile.name}
                >
                  {state.uploadedFile.name}
                </h3>
                <div className="flex items-center space-x-4 text-white/90 text-sm">
                  <span className="bg-white/15 backdrop-blur-xl px-3 py-2 rounded-xl border border-white/20">
                    {formatFileSize(state.uploadedFile.size)}
                  </span>
                  <span className="bg-white/15 backdrop-blur-xl px-3 py-2 rounded-xl border border-white/20">
                    {state.uploadedFile.type.split('/')[1].toUpperCase()}
                  </span>
                  <span className="bg-white/15 backdrop-blur-xl px-3 py-2 rounded-xl border border-white/20">
                    {formatDuration(state.uploadedFile)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={removeFile}
                variant="outline"
                className="border-red-500/30 text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-xl transition-all duration-300 px-6 py-3"
              >
                Remove File
              </Button>
              <Button
                onClick={() => {
                  // Trigger upload simulation
                  dispatch({ type: 'SET_IS_UPLOADING', payload: true });
                  dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: 0 });

                  // Simulate upload progress
                  let progress = 0;
                  const interval = setInterval(() => {
                    progress += Math.random() * 8 + 2;
                    if (progress >= 100) {
                      progress = 100;
                      clearInterval(interval);
                      dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: progress });
                      dispatch({ type: 'SET_IS_UPLOADING', payload: false });
                      dispatch({ type: 'SET_UPLOAD_COMPLETE', payload: true });

                      setTimeout(() => {
                        window.location.href = '/results';
                      }, 1000);
                    } else {
                      dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: progress });
                    }
                  }, 150);
                }}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl flex items-center space-x-3 px-8 py-3 transition-all duration-300 hover:scale-105 shadow-2xl font-semibold"
                disabled={state.isUploading}
              >
                <Upload className="w-5 h-5" />
                <span>{state.isUploading ? 'Uploading...' : 'Upload & Analyze'}</span>
              </Button>
            </div>

            {state.isUploading && (
              <div className="mt-6">
                <Progress
                  value={state.uploadProgress}
                  className="w-full h-4 bg-white/20 rounded-full overflow-hidden"
                  style={
                    {
                      '--progress-color': 'linear-gradient(90deg, #10b981, #059669, #047857)',
                    } as React.CSSProperties
                  }
                />
                <p className="text-white/90 text-sm mt-3 font-semibold">
                  {Math.round(state.uploadProgress)}% uploaded
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (state.uploadComplete && state.uploadedFile) {
    return (
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Track Uploaded Successfully!</h2>
            <Button
              onClick={removeFile}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>

            <p className="text-white/90 mb-8 text-xl font-medium">
              Your track has been analyzed and is ready for promotion
            </p>

            <div className="bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-white/30 rounded-3xl p-8 mb-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 flex-1 min-w-0">
                  <Play className="w-6 h-6 text-white/90" />
                  <div className="text-left flex-1 min-w-0">
                    <div
                      className="text-white font-bold text-lg truncate"
                      title={state.uploadedFile.name}
                    >
                      {state.uploadedFile.name}
                    </div>
                    <div className="text-white/80 text-sm mt-1">
                      {formatFileSize(state.uploadedFile.size)} •{' '}
                      {formatDuration(state.uploadedFile)}
                    </div>
                  </div>
                </div>
                <div className="text-white/70 text-sm bg-white/15 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/20">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-white/70 mb-2 font-medium">File Type</div>
                <div className="text-white font-bold text-lg">
                  {state.uploadedFile.type.split('/')[1].toUpperCase()}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-white/70 mb-2 font-medium">Quality</div>
                <div className="text-white font-bold text-lg">High Quality</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
      <CardContent className="p-0">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Upload Your Track</h2>

        <div
          className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-300 ${
            dragActive
              ? 'border-purple-400 bg-purple-400/10'
              : 'border-white/30 hover:border-white/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Upload className="w-10 h-10 text-white" />
          </div>

          <h3 className="text-2xl font-bold text-white mb-4">
            {dragActive ? 'Drop your music file here' : 'Drag and drop your music file here'}
          </h3>

          <p className="text-white/80 mb-8 text-lg">or</p>

          <div className="relative">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={state.isUploading}
            />
            <Button
              disabled={state.isUploading}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              {state.isUploading ? 'Uploading...' : 'Choose Audio File'}
            </Button>
          </div>

          <p className="text-white/70 text-sm mt-6 font-medium">
            Supports MP3, WAV, FLAC, AAC, OGG, M4A (Max 50MB)
          </p>

          {state.isUploading && (
            <div className="mt-8">
              <Progress
                value={state.uploadProgress}
                className="w-full h-4 bg-white/20 rounded-full overflow-hidden"
                style={
                  {
                    '--progress-color': 'linear-gradient(90deg, #10b981, #059669, #047857)',
                  } as React.CSSProperties
                }
              />
              <p className="text-white/90 text-sm mt-3 font-semibold">
                {Math.round(state.uploadProgress)}% uploaded
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl">
              <p className="text-red-200 text-sm font-medium">{error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
