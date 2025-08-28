# Playlist Pulse - Complete Development Package for Cursor

## 🎯 Executive Summary
**Product:** Playlist Pulse - AI-powered playlist rejection analyzer
**URL:** pulse.totalaudiopromo.com
**Purpose:** Help artists understand why they're getting rejected from playlists and find better matches
**Target Market:** Independent artists, music producers, small labels
**Pricing:** £19-47/month standalone, drives Total Audio Promo ecosystem adoption

## 🏗️ Technical Architecture

### **Frontend Stack**
- **Framework:** Next.js 14 with TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Lucide React icons, Custom components
- **State Management:** React hooks (useState, useEffect)
- **File Upload:** Native HTML5 with drag-and-drop
- **Audio Playback:** HTML5 Audio API
- **Charts:** Recharts for compatibility visualizations

### **Backend Stack**
- **Runtime:** Node.js with Express
- **Database:** PostgreSQL with Prisma ORM
- **File Storage:** AWS S3 for audio files
- **Queue System:** Bull/BullMQ with Redis for audio processing
- **Authentication:** NextAuth.js
- **API:** RESTful with TypeScript

### **AI & Audio Analysis**
- **Audio Analysis:** Web Audio API + Spotify Web API
- **AI Processing:** OpenAI API for insights generation
- **Playlist Data:** Spotify Web API + custom playlist database
- **Matching Algorithm:** Custom compatibility scoring system

## 📁 Project Structure

```
playlist-pulse/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Main upload page
│   │   ├── analysis/
│   │   │   └── [id]/page.tsx  # Analysis results page
│   │   ├── api/               # API routes
│   │   │   ├── upload/route.ts
│   │   │   ├── analyze/route.ts
│   │   │   └── playlists/route.ts
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── Modal.tsx
│   │   ├── UploadSection.tsx  # File upload component
│   │   ├── AnalysisProgress.tsx
│   │   ├── TrackAnalysis.tsx  # Audio features display
│   │   ├── RejectionAnalysis.tsx
│   │   ├── PlaylistMatches.tsx
│   │   └── AudioPlayer.tsx
│   ├── lib/
│   │   ├── audio-analysis.ts  # Audio processing utilities
│   │   ├── playlist-matching.ts
│   │   ├── spotify-api.ts     # Spotify integration
│   │   ├── db.ts             # Database connection
│   │   └── utils.ts          # Helper functions
│   ├── types/
│   │   ├── audio.ts          # Audio analysis types
│   │   ├── playlist.ts       # Playlist data types
│   │   └── api.ts            # API response types
│   └── hooks/
│       ├── useAudioAnalysis.ts
│       ├── usePlaylistMatching.ts
│       └── useFileUpload.ts
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── public/
│   ├── icons/               # App icons
│   └── audio-samples/       # Demo audio files
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## 🗄️ Database Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  analyses    Analysis[]
  subscription Subscription?
}

model Analysis {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  trackTitle      String
  artistName      String
  audioFileUrl    String
  audioFeatures   Json     // BPM, key, energy, etc.
  rejectedPlaylists Json   // Array of rejection analysis
  matchedPlaylists Json    // Array of compatible playlists
  status          AnalysisStatus @default(PENDING)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Playlist {
  id              String   @id @default(cuid())
  spotifyId       String   @unique
  name            String
  curator         String
  followers       Int
  genres          String[]
  audioFeatures   Json     // Average BPM, energy, etc.
  contactInfo     Json?    // Submission details
  lastUpdated     DateTime @default(now())
}

model Subscription {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  tier        SubscriptionTier
  status      SubscriptionStatus
  stripeId    String?
  currentPeriodEnd DateTime?
  createdAt   DateTime @default(now())
}

enum AnalysisStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

enum SubscriptionTier {
  FREE
  BASIC
  PREMIUM
}

enum SubscriptionStatus {
  ACTIVE
  INACTIVE
  CANCELLED
}
```

## 🎵 Audio Analysis Implementation

### **Core Audio Features to Extract**
```typescript
// src/types/audio.ts
export interface AudioFeatures {
  bpm: number;
  key: string;
  mode: 'major' | 'minor';
  energy: number;        // 0-1
  valence: number;       // 0-1 (happiness)
  danceability: number;  // 0-1
  acousticness: number;  // 0-1
  instrumentalness: number; // 0-1
  loudness: number;      // dB
  speechiness: number;   // 0-1
  duration: number;      // milliseconds
  genre: string[];
  mood: string;
}

export interface RejectionReason {
  playlistName: string;
  reason: string;
  specificGap: {
    feature: keyof AudioFeatures;
    yourValue: number;
    playlistAverage: number;
    difference: number;
  };
  compatibilityScore: number; // 0-1
}

export interface PlaylistMatch {
  id: string;
  name: string;
  curator: string;
  followers: number;
  compatibilityScore: number; // 0-1
  matchingFeatures: string[];
  contactInfo: {
    available: boolean;
    type: 'direct' | 'platform' | 'premium';
    url?: string;
  };
}
```

### **Audio Analysis Service**
```typescript
// src/lib/audio-analysis.ts
import { AudioFeatures } from '@/types/audio';

export class AudioAnalysisService {
  
  async analyzeAudioFile(fileBuffer: Buffer): Promise<AudioFeatures> {
    // 1. Use Web Audio API for basic analysis
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(fileBuffer);
    
    // 2. Extract basic features
    const duration = audioBuffer.duration * 1000;
    const bpm = await this.extractBPM(audioBuffer);
    const key = await this.extractKey(audioBuffer);
    
    // 3. Use Spotify's Audio Features API for advanced analysis
    const spotifyFeatures = await this.getSpotifyAudioFeatures(audioBuffer);
    
    return {
      bpm,
      key,
      mode: spotifyFeatures.mode === 1 ? 'major' : 'minor',
      energy: spotifyFeatures.energy,
      valence: spotifyFeatures.valence,
      danceability: spotifyFeatures.danceability,
      acousticness: spotifyFeatures.acousticness,
      instrumentalness: spotifyFeatures.instrumentalness,
      loudness: spotifyFeatures.loudness,
      speechiness: spotifyFeatures.speechiness,
      duration,
      genre: await this.classifyGenre(audioBuffer),
      mood: this.determineMood(spotifyFeatures)
    };
  }

  private async extractBPM(audioBuffer: AudioBuffer): Promise<number> {
    // BPM detection algorithm
    // Use tempo detection libraries or implement custom algorithm
    return 120; // Placeholder
  }

  private async extractKey(audioBuffer: AudioBuffer): Promise<string> {
    // Key detection algorithm
    // Use music theory algorithms or ML models
    return 'C'; // Placeholder
  }

  private async getSpotifyAudioFeatures(audioBuffer: AudioBuffer) {
    // Upload to Spotify's Audio Analysis API
    // Or use similar service like LastFM, AcousticBrainz
    return {
      energy: 0.8,
      valence: 0.7,
      danceability: 0.6,
      acousticness: 0.1,
      instrumentalness: 0.0,
      loudness: -5.0,
      speechiness: 0.05,
      mode: 1
    }; // Placeholder
  }

  private async classifyGenre(audioBuffer: AudioBuffer): Promise<string[]> {
    // Genre classification using ML model
    // Could use TensorFlow.js or external API
    return ['pop', 'dance']; // Placeholder
  }

  private determineMood(features: any): string {
    // Mood classification based on valence and energy
    if (features.valence > 0.6 && features.energy > 0.6) return 'happy';
    if (features.valence < 0.4 && features.energy < 0.4) return 'sad';
    if (features.valence > 0.6 && features.energy < 0.4) return 'chill';
    if (features.valence < 0.4 && features.energy > 0.6) return 'aggressive';
    return 'neutral';
  }
}
```

## 🎯 Playlist Matching Algorithm

```typescript
// src/lib/playlist-matching.ts
import { AudioFeatures, RejectionReason, PlaylistMatch } from '@/types/audio';

export class PlaylistMatchingService {
  
  async findMatches(audioFeatures: AudioFeatures): Promise<{
    rejections: RejectionReason[];
    matches: PlaylistMatch[];
  }> {
    // 1. Get playlists from database
    const playlists = await this.getAllPlaylists();
    
    // 2. Calculate compatibility scores
    const scoredPlaylists = playlists.map(playlist => ({
      playlist,
      score: this.calculateCompatibility(audioFeatures, playlist.audioFeatures),
      reasons: this.analyzeCompatibility(audioFeatures, playlist.audioFeatures)
    }));

    // 3. Separate rejections (score < 0.5) and matches (score >= 0.5)
    const rejections = scoredPlaylists
      .filter(item => item.score < 0.5)
      .slice(0, 5) // Top 5 rejections to analyze
      .map(item => this.createRejectionReason(item.playlist, item.reasons, item.score));

    const matches = scoredPlaylists
      .filter(item => item.score >= 0.5)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10) // Top 10 matches
      .map(item => this.createPlaylistMatch(item.playlist, item.score));

    return { rejections, matches };
  }

  private calculateCompatibility(trackFeatures: AudioFeatures, playlistFeatures: any): number {
    // Weighted scoring algorithm
    const weights = {
      bpm: 0.25,        // BPM similarity is very important
      energy: 0.20,     // Energy level matching
      valence: 0.15,    // Mood compatibility
      danceability: 0.15, // Danceability matching
      genre: 0.25       // Genre compatibility is crucial
    };

    // BPM compatibility (within 10 BPM is good, within 5 is excellent)
    const bpmDiff = Math.abs(trackFeatures.bpm - playlistFeatures.avgBpm);
    const bpmScore = Math.max(0, 1 - (bpmDiff / 20)); // 20 BPM max difference

    // Energy compatibility
    const energyDiff = Math.abs(trackFeatures.energy - playlistFeatures.avgEnergy);
    const energyScore = Math.max(0, 1 - energyDiff);

    // Valence compatibility
    const valenceDiff = Math.abs(trackFeatures.valence - playlistFeatures.avgValence);
    const valenceScore = Math.max(0, 1 - valenceDiff);

    // Danceability compatibility
    const danceabilityDiff = Math.abs(trackFeatures.danceability - playlistFeatures.avgDanceability);
    const danceabilityScore = Math.max(0, 1 - danceabilityDiff);

    // Genre compatibility (exact match = 1, similar = 0.7, different = 0)
    const genreScore = this.calculateGenreCompatibility(trackFeatures.genre, playlistFeatures.genres);

    // Calculate weighted total
    const totalScore = (
      bpmScore * weights.bpm +
      energyScore * weights.energy +
      valenceScore * weights.valence +
      danceabilityScore * weights.danceability +
      genreScore * weights.genre
    );

    return Math.round(totalScore * 100) / 100; // Round to 2 decimal places
  }

  private calculateGenreCompatibility(trackGenres: string[], playlistGenres: string[]): number {
    // Check for exact matches
    const exactMatches = trackGenres.filter(genre => playlistGenres.includes(genre));
    if (exactMatches.length > 0) return 1.0;

    // Check for similar genres (could use genre similarity mapping)
    const similarGenres = this.findSimilarGenres(trackGenres, playlistGenres);
    if (similarGenres.length > 0) return 0.7;

    return 0.0;
  }

  private findSimilarGenres(trackGenres: string[], playlistGenres: string[]): string[] {
    // Genre similarity mapping
    const genreSimilarity: Record<string, string[]> = {
      'pop': ['dance-pop', 'electropop', 'indie-pop'],
      'dance': ['house', 'techno', 'edm', 'electronic'],
      'rock': ['indie-rock', 'alternative', 'pop-rock'],
      'hip-hop': ['rap', 'trap', 'r&b'],
      // Add more mappings
    };

    const similar: string[] = [];
    trackGenres.forEach(trackGenre => {
      const similarToTrack = genreSimilarity[trackGenre] || [];
      playlistGenres.forEach(playlistGenre => {
        if (similarToTrack.includes(playlistGenre)) {
          similar.push(playlistGenre);
        }
      });
    });

    return similar;
  }
}
```

## 🚀 API Routes Implementation

### **File Upload Route**
```typescript
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AudioAnalysisService } from '@/lib/audio-analysis';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const audioAnalysis = new AudioAnalysisService();

export async function POST(request: NextRequest) {
  try {
    // 1. Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('audio') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 2. Validate file type and size
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/m4a'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    // 3. Upload to S3
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const s3Url = await uploadToS3(fileBuffer, file.name);

    // 4. Create analysis record
    const analysis = await prisma.analysis.create({
      data: {
        userId: 'temp-user', // Replace with actual user ID
        trackTitle: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
        artistName: 'Unknown Artist', // Will be updated later
        audioFileUrl: s3Url,
        audioFeatures: {},
        rejectedPlaylists: {},
        matchedPlaylists: {},
        status: 'PENDING'
      }
    });

    // 5. Queue analysis job
    await queueAnalysisJob(analysis.id);

    return NextResponse.json({ 
      analysisId: analysis.id,
      status: 'uploaded',
      message: 'File uploaded successfully. Analysis starting...'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

async function uploadToS3(buffer: Buffer, fileName: string): Promise<string> {
  // S3 upload implementation
  // Return the uploaded file URL
  return `https://your-bucket.s3.amazonaws.com/audio/${fileName}`;
}

async function queueAnalysisJob(analysisId: string): Promise<void> {
  // Add job to processing queue
  // This will trigger the audio analysis worker
}
```

### **Analysis Route**
```typescript
// src/app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AudioAnalysisService } from '@/lib/audio-analysis';
import { PlaylistMatchingService } from '@/lib/playlist-matching';

export async function POST(request: NextRequest) {
  try {
    const { analysisId } = await request.json();
    
    // 1. Get analysis record
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId }
    });

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    // 2. Update status to processing
    await prisma.analysis.update({
      where: { id: analysisId },
      data: { status: 'PROCESSING' }
    });

    // 3. Download audio file and analyze
    const audioBuffer = await downloadFromS3(analysis.audioFileUrl);
    const audioFeatures = await audioAnalysis.analyzeAudioFile(audioBuffer);

    // 4. Find playlist matches
    const playlistMatching = new PlaylistMatchingService();
    const { rejections, matches } = await playlistMatching.findMatches(audioFeatures);

    // 5. Update analysis with results
    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        audioFeatures: audioFeatures as any,
        rejectedPlaylists: rejections as any,
        matchedPlaylists: matches as any,
        status: 'COMPLETED'
      }
    });

    return NextResponse.json({
      status: 'completed',
      audioFeatures,
      rejections,
      matches
    });

  } catch (error) {
    console.error('Analysis error:', error);
    
    // Update status to failed
    await prisma.analysis.update({
      where: { id: analysisId },
      data: { status: 'FAILED' }
    });

    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
```

## 🎨 Component Implementation

### **Main Upload Component**
```typescript
// src/components/UploadSection.tsx
'use client';

import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface UploadSectionProps {
  onUploadComplete: (analysisId: string) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (response.ok) {
        onUploadComplete(result.analysisId);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center">
        <div 
          className={`border-2 border-dashed rounded-xl p-12 transition-colors ${
            dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Track</h3>
          <p className="text-gray-600 mb-6">
            Upload your audio file to analyze why it's getting rejected from playlists
          </p>
          
          <input
            type="file"
            accept=".mp3,.wav,.m4a"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <label
            htmlFor="file-upload"
            className={`inline-flex items-center px-6 py-3 font-medium rounded-lg cursor-pointer transition-colors ${
              uploading 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {uploading ? 'Uploading...' : 'Choose Audio File'}
          </label>
          
          <p className="text-sm text-gray-500 mt-4">
            Supports MP3, WAV, M4A up to 50MB
          </p>
        </div>
      </div>
    </div>
  );
};
```

## 🔧 Environment Variables

```bash
# .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/playlist_pulse"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="playlist-pulse-audio"

# Spotify API
SPOTIFY_CLIENT_ID="your-spotify-client-id"
SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"

# OpenAI (for AI insights)
OPENAI_API_KEY="your-openai-api-key"

# Redis (for queues)
REDIS_URL="redis://localhost:6379"

# Stripe (for payments)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## 🚀 Deployment Instructions

### **1. Development Setup**
```bash
# Clone and setup
npm install
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

### **2. Production Deployment (Vercel)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Setup environment variables in Vercel dashboard
# Setup database (recommend Supabase or PlanetScale)
# Setup Redis (recommend Upstash)
```

## 📊 Success Metrics & Analytics

### **Key Metrics to Track**
- **Upload Success Rate:** % of successful file uploads
- **Analysis Completion Rate:** % of analyses that complete successfully
- **User Engagement:** Time spent on results page
- **Conversion Rate:** % of users who upgrade to paid tier
- **Playlist Match Accuracy:** User feedback on match quality

### **Analytics Implementation**
```typescript
// src/lib/analytics.ts
export const trackEvent = (event: string, properties: any) => {
  // PostHog, Mixpanel, or similar
  if (typeof window !== 'undefined') {
    // Client-side tracking
    posthog.capture(event, properties);
  }
};

// Track key events
trackEvent('file_uploaded', { fileSize, fileType });
trackEvent('analysis_completed', { processingTime, matchCount });
trackEvent('playlist_clicked', { playlistName, compatibilityScore });
```

## 🔄 Integration with Total Audio Promo Ecosystem

### **Data Sharing**
- Share playlist database with main platform
- Cross-promote other mini tools
- Unified user accounts and billing
- Shared contact database from Audio Intel

### **Bundle Pricing Strategy**
- Standalone: £19/month
- With 2 other tools: £39/month (33% discount)
- Full ecosystem: £89/month (50% discount)

## 🎯 Phase 2 Features (Future Development)

1. **Real-time Spotify Integration:** Direct playlist submission
2. **Curator Contact Database:** Integration with Audio Intel
3. **A/B Testing:** Test different track versions
4. **Success Tracking:** Follow up on submitted playlists
5. **White-label Version:** For PR agencies to use with clients

---

## 🚀 Ready to Build!

This comprehensive package includes everything needed to build Playlist Pulse in Cursor:

✅ **Complete technical specification**
✅ **Database schema and migrations**  
✅ **API routes and business logic**
✅ **Component architecture**
✅ **Deployment instructions**
✅ **Integration guidelines**

**Next Steps:**
1. Create new Next.js project in Cursor
2. Copy this specification as reference
3. Implement components one by one
4. Test with sample audio files
5. Deploy MVP and start user testing

**Estimated Development Time:** 3-4 weeks for MVP, 6-8 weeks for full features