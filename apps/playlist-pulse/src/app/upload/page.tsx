"use client";

import React, { useState } from 'react';
import { ArrowLeft, Upload, Music, Users, Target, Zap, CheckCircle, ExternalLink, Mail, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

interface Curator {
  id: string;
  name: string;
  playlistName: string;
  platform: string;
  genre: string;
  followers: string;
  description: string;
  submissionProcess: string;
  responseRate: string;
  contactInfo: {
    email?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
    discord?: string;
  };
  tags: string[];
  lastUpdated: string;
  matchScore: number;
}

export default function UploadPage() {
  const router = useRouter();
  const { dispatch } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [curatorMatches, setCuratorMatches] = useState<Curator[]>([]);
  const [detectedGenre, setDetectedGenre] = useState<string>('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalysisComplete(true);
          setIsUploading(false);
          
          // Simulate genre detection and curator matching
          setTimeout(() => {
            detectGenreAndFindCurators();
          }, 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const detectGenreAndFindCurators = async () => {
    // Simulate genre detection based on file name or random selection
    const genres = ['Indie Rock', 'Electronic', 'Hip Hop', 'Alternative', 'Synthwave', 'Acoustic', 'Lo-Fi/Chill'];
    const detectedGenre = genres[Math.floor(Math.random() * genres.length)];
    setDetectedGenre(detectedGenre);

    try {
      // Call the real curator discovery API
      const response = await fetch('/api/discover-curators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          genre: detectedGenre,
          platforms: ['all'],
          limit: 10
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const curators = data.curators || [];
        setCuratorMatches(curators);
        
        // Store curators in context for results page
        dispatch({ type: 'SET_CURATORS', payload: curators });
      } else {
        // Fallback to mock data if API fails
        const fallbackCurators = [
          {
            id: "1",
            name: "Alex Chen",
            playlistName: "Indie Discoveries Weekly",
            platform: "spotify",
            genre: "Indie Rock",
            followers: "125K",
            description: "Curating the best indie rock discoveries every week. Looking for unique sounds with strong melodies and authentic lyrics.",
            submissionProcess: "Email submissions preferred. Include track link, artist bio, and why it fits the playlist.",
            responseRate: "85%",
            contactInfo: {
              email: "alex@indiediscoveries.com",
              instagram: "@alexindiediscovers",
              twitter: "@alexchen_music"
            },
            tags: ["indie rock", "discovery", "weekly", "authentic"],
            lastUpdated: "2025-01-15",
            matchScore: 94
          },
          {
            id: "2",
            name: "Sarah Martinez",
            playlistName: "Electronic Pulse",
            platform: "spotify",
            genre: "Electronic",
            followers: "89K",
            description: "Showcasing emerging electronic artists and innovative production. Focus on melodic electronic and ambient sounds.",
            submissionProcess: "Direct Spotify submission or email with SoundCloud link.",
            responseRate: "92%",
            contactInfo: {
              email: "sarah@electropulse.com",
              instagram: "@sarahelectro",
              website: "https://electropulse.com"
            },
            tags: ["electronic", "ambient", "melodic", "innovation"],
            lastUpdated: "2025-01-14",
            matchScore: 87
          },
          {
            id: "3",
            name: "Marcus Johnson",
            playlistName: "Urban Flow",
            platform: "spotify",
            genre: "Hip Hop",
            followers: "203K",
            description: "Premium hip-hop curation with focus on lyrical content and production quality. Supporting underground and emerging artists.",
            submissionProcess: "Email with track link and artist background. Prefers high-quality production.",
            responseRate: "78%",
            contactInfo: {
              email: "marcus@urbanflow.net",
              instagram: "@marcusurbanflow",
              twitter: "@mjohnson_hiphop"
            },
            tags: ["hip hop", "underground", "lyrical", "production"],
            lastUpdated: "2025-01-13",
            matchScore: 91
          }
        ];
        setCuratorMatches(fallbackCurators);
        dispatch({ type: 'SET_CURATORS', payload: fallbackCurators });
      }
    } catch (error) {
      console.error('Error discovering curators:', error);
      // Fallback to mock data
      const fallbackCurators = [
        {
          id: "1",
          name: "Alex Chen",
          playlistName: "Indie Discoveries Weekly",
          platform: "spotify",
          genre: "Indie Rock",
          followers: "125K",
          description: "Curating the best indie rock discoveries every week. Looking for unique sounds with strong melodies and authentic lyrics.",
          submissionProcess: "Email submissions preferred. Include track link, artist bio, and why it fits the playlist.",
          responseRate: "85%",
          contactInfo: {
            email: "alex@indiediscoveries.com",
            instagram: "@alexindiediscovers",
            twitter: "@alexchen_music"
          },
          tags: ["indie rock", "discovery", "weekly", "authentic"],
          lastUpdated: "2025-01-15",
          matchScore: 94
        }
      ];
      setCuratorMatches(fallbackCurators);
      dispatch({ type: 'SET_CURATORS', payload: fallbackCurators });
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'spotify':
        return '🎵';
      case 'apple-music':
        return '🍎';
      case 'youtube':
        return '📺';
      case 'soundcloud':
        return '☁️';
      case 'reddit':
        return '🤖';
      case 'instagram':
        return '📷';
      case 'discord':
        return '💬';
      case 'forums':
        return '💻';
      case 'music-sites':
        return '📰';
      default:
        return '🎵';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'spotify':
        return 'bg-green-100 text-green-800';
      case 'apple-music':
        return 'bg-pink-100 text-pink-800';
      case 'youtube':
        return 'bg-red-100 text-red-800';
      case 'soundcloud':
        return 'bg-orange-100 text-orange-800';
      case 'reddit':
        return 'bg-orange-100 text-orange-800';
      case 'instagram':
        return 'bg-purple-100 text-purple-800';
      case 'discord':
        return 'bg-blue-100 text-blue-800';
      case 'forums':
        return 'bg-gray-100 text-gray-800';
      case 'music-sites':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-xl font-black text-gray-900">Upload Your Track</h1>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-gray-900 mb-4">Upload Your Track</h2>
              <p className="text-gray-600 font-bold">
                Upload your audio file and we'll analyze it to find the perfect playlist curators for your music.
              </p>
            </div>

            <div className="space-y-6">
              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-yellow-400 transition-colors">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="audio-upload"
                />
                <label htmlFor="audio-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-bold text-gray-700 mb-2">
                    {file ? file.name : 'Click to upload your audio file'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports MP3, WAV, FLAC, and other audio formats (max 50MB)
                  </p>
                </label>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700">Uploading...</span>
                    <span className="text-sm font-bold text-gray-700">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Analysis Progress */}
              {analysisComplete && !curatorMatches.length && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                  <p className="text-gray-600 font-bold">Analyzing your track and finding curators...</p>
                </div>
              )}

              {/* Upload Button */}
              {file && !isUploading && !analysisComplete && (
                <button
                  onClick={handleUpload}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 rounded-lg transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
                >
                  <Upload className="w-5 h-5 inline mr-2" />
                  Upload and Find Curators
                </button>
              )}
            </div>
          </div>

          {/* Results Section */}
          {curatorMatches.length > 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-4">Perfect Curators Found!</h2>
                {detectedGenre && (
                  <p className="text-gray-600 font-bold mb-4">
                    Detected Genre: <span className="text-yellow-600 font-black">{detectedGenre}</span>
                  </p>
                )}
                <p className="text-gray-600 font-bold">
                  We found {curatorMatches.length} curators who would love your music. Here are the best matches:
                </p>
              </div>

              <div className="space-y-6">
                {curatorMatches.map((curator) => (
                  <div key={curator.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-yellow-400 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getPlatformColor(curator.platform)}`}>
                          {getPlatformIcon(curator.platform)}
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-gray-900">{curator.name}</h3>
                          <p className="text-lg font-bold text-gray-700">{curator.playlistName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-bold text-gray-600">{curator.followers} followers</span>
                            <span className="text-sm font-bold text-green-600">• {curator.responseRate} response rate</span>
                            <span className="text-sm font-bold text-yellow-600">• {curator.matchScore}% match</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                          {curator.genre}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 font-bold mb-4">{curator.description}</p>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-black text-gray-900 mb-2">Submission Process:</h4>
                        <p className="text-sm text-gray-600 font-bold">{curator.submissionProcess}</p>
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 mb-2">Contact Info:</h4>
                        <div className="flex flex-wrap gap-2">
                          {curator.contactInfo.email && (
                            <a 
                              href={`mailto:${curator.contactInfo.email}`}
                              className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800"
                            >
                              <Mail className="w-4 h-4" />
                              Email
                            </a>
                          )}
                          {curator.contactInfo.instagram && (
                            <a 
                              href={`https://instagram.com/${curator.contactInfo.instagram.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm font-bold text-purple-600 hover:text-purple-800"
                            >
                              <Instagram className="w-4 h-4" />
                              Instagram
                            </a>
                          )}
                          {curator.contactInfo.twitter && (
                            <a 
                              href={`https://twitter.com/${curator.contactInfo.twitter.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800"
                            >
                              <Twitter className="w-4 h-4" />
                              Twitter
                            </a>
                          )}
                          {curator.contactInfo.website && (
                            <a 
                              href={curator.contactInfo.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-gray-800"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Website
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {curator.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <button 
                  onClick={() => {
                    // Store curators in context and navigate to results
                    dispatch({ type: 'SET_CURATORS', payload: curatorMatches });
                    dispatch({ type: 'SET_CURRENT_STEP', payload: 'results' });
                    router.push('/results');
                  }}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 rounded-lg transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
                >
                  <Zap className="w-5 h-5 inline mr-2" />
                  Generate AI Pitches for These Curators
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 