'use client';

import { useState } from 'react';
import { Upload, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function TestPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate audio file
      const audioTypes = [
        'audio/mpeg',
        'audio/wav',
        'audio/ogg',
        'audio/aac',
        'audio/flac',
        'audio/mp4',
      ];
      if (!audioTypes.includes(file.type)) {
        setError('Please select a valid audio file (MP3, WAV, OGG, AAC, FLAC, M4A)');
        return;
      }

      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }

      setSelectedFile(file);
      setError(null);
      console.log('File selected:', file.name, file.size, file.type);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 max-w-md w-full">
        <CardContent className="p-0">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">File Upload Test</h2>

            {!selectedFile ? (
              <div className="space-y-4">
                <div className="text-white/70 mb-4">Click below to select an audio file</div>
                <input
                  type="file"
                  accept="audio/*,.mp3,.wav,.ogg,.aac,.flac,.m4a,.webm"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer">
                    <Upload className="w-5 h-5 mr-2" />
                    Choose File
                  </Button>
                </label>
                {error && <p className="text-red-400 text-sm">{error}</p>}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Selected File:</h3>
                  <p className="text-white/80 text-sm">{selectedFile.name}</p>
                  <p className="text-white/60 text-xs">
                    Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-white/60 text-xs">Type: {selectedFile.type}</p>
                </div>
                <Button
                  onClick={() => setSelectedFile(null)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Remove File
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
