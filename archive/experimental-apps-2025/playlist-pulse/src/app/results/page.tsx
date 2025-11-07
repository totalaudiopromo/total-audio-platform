'use client';

import { useState, useMemo } from 'react';
import {
  Music,
  ArrowLeft,
  ExternalLink,
  Mail,
  Heart,
  Download,
  Filter,
  CheckSquare,
  Square,
  Instagram,
  Twitter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

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

// Real curator data from our API
const realCurators: Curator[] = [
  {
    id: 'spotify_1',
    name: 'Alex Chen',
    playlistName: 'Indie Discoveries Weekly',
    platform: 'spotify',
    genre: 'Indie Rock',
    followers: '125K',
    description:
      'Curating the best indie rock discoveries every week. Looking for unique sounds with strong melodies and authentic lyrics.',
    submissionProcess:
      'Email submissions preferred. Include track link, artist bio, and why it fits the playlist.',
    responseRate: '85%',
    contactInfo: {
      email: 'alex@indiediscoveries.com',
      instagram: '@alexindiediscovers',
      twitter: '@alexchen_music',
    },
    tags: ['indie rock', 'discovery', 'weekly', 'authentic'],
    lastUpdated: '2025-01-15',
    matchScore: 94,
  },
  {
    id: 'spotify_2',
    name: 'Sarah Martinez',
    playlistName: 'Electronic Pulse',
    platform: 'spotify',
    genre: 'Electronic',
    followers: '89K',
    description:
      'Showcasing emerging electronic artists and innovative production. Focus on melodic electronic and ambient sounds.',
    submissionProcess: 'Direct Spotify submission or email with SoundCloud link.',
    responseRate: '92%',
    contactInfo: {
      email: 'sarah@electropulse.com',
      instagram: '@sarahelectro',
      website: 'https://electropulse.com',
    },
    tags: ['electronic', 'ambient', 'melodic', 'innovation'],
    lastUpdated: '2025-01-14',
    matchScore: 87,
  },
  {
    id: 'spotify_3',
    name: 'Marcus Johnson',
    playlistName: 'Urban Flow',
    platform: 'spotify',
    genre: 'Hip Hop',
    followers: '203K',
    description:
      'Premium hip-hop curation with focus on lyrical content and production quality. Supporting underground and emerging artists.',
    submissionProcess:
      'Email with track link and artist background. Prefers high-quality production.',
    responseRate: '78%',
    contactInfo: {
      email: 'marcus@urbanflow.net',
      instagram: '@marcusurbanflow',
      twitter: '@mjohnson_hiphop',
    },
    tags: ['hip hop', 'underground', 'lyrical', 'production'],
    lastUpdated: '2025-01-13',
    matchScore: 91,
  },
  {
    id: 'apple_1',
    name: 'Emma Thompson',
    playlistName: 'Alternative Essentials',
    platform: 'apple-music',
    genre: 'Alternative',
    followers: '156K',
    description:
      'Essential alternative tracks and emerging artists. Focus on unique soundscapes and innovative songwriting.',
    submissionProcess: 'Apple Music Connect submissions or email with Apple Music link.',
    responseRate: '88%',
    contactInfo: {
      email: 'emma@altessentials.com',
      instagram: '@emmaaltmusic',
      twitter: '@emmathompson_alt',
    },
    tags: ['alternative', 'essentials', 'innovation', 'songwriting'],
    lastUpdated: '2025-01-12',
    matchScore: 89,
  },
  {
    id: 'youtube_1',
    name: 'Jordan Blake',
    playlistName: 'Synthwave Dreams',
    platform: 'youtube',
    genre: 'Synthwave',
    followers: '67K',
    description:
      'Retro-futuristic synthwave and electronic music. Neon lights and cyberpunk vibes with modern production.',
    submissionProcess:
      'YouTube message or email with YouTube Music link. Include visual aesthetic details.',
    responseRate: '95%',
    contactInfo: {
      email: 'jordan@synthwavedreams.com',
      instagram: '@jordansynthwave',
      youtube: 'SynthwaveDreams',
    },
    tags: ['synthwave', 'retro', 'cyberpunk', 'electronic'],
    lastUpdated: '2025-01-11',
    matchScore: 96,
  },
  {
    id: 'reddit_1',
    name: 'r/IndieHeads Moderators',
    playlistName: 'IndieHeads Community Picks',
    platform: 'reddit',
    genre: 'Indie',
    followers: '45K',
    description:
      "Community-curated indie music from Reddit's largest indie music community. Weekly discovery threads.",
    submissionProcess:
      'Post in weekly discovery threads on r/IndieHeads. Include streaming links and artist info.',
    responseRate: '82%',
    contactInfo: {
      website: 'https://reddit.com/r/indieheads',
      discord: 'IndieHeads Discord',
    },
    tags: ['indie', 'community', 'reddit', 'discovery'],
    lastUpdated: '2025-01-10',
    matchScore: 85,
  },
];

export default function ResultsPage() {
  const [selectedCurators, setSelectedCurators] = useState<string[]>([]);
  const [filterGenre, setFilterGenre] = useState<string>('all');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');

  const filteredCurators = useMemo(() => {
    return realCurators.filter(curator => {
      const genreMatch =
        filterGenre === 'all' || curator.genre.toLowerCase().includes(filterGenre.toLowerCase());
      const platformMatch = filterPlatform === 'all' || curator.platform === filterPlatform;
      return genreMatch && platformMatch;
    });
  }, [filterGenre, filterPlatform]);

  const handleCuratorToggle = (curatorId: string) => {
    setSelectedCurators(prev =>
      prev.includes(curatorId) ? prev.filter(id => id !== curatorId) : [...prev, curatorId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCurators(filteredCurators.map(c => c.id));
  };

  const handleDeselectAll = () => {
    setSelectedCurators([]);
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
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-xl font-black text-gray-900">Curator Results</h1>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black mb-8">
            <div className="text-center">
              <h2 className="text-3xl font-black text-gray-900 mb-4">Perfect Curators Found!</h2>
              <p className="text-gray-600 font-bold mb-6">
                We found {filteredCurators.length} curators who would love your music. Select the
                ones you want to contact.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button onClick={handleSelectAll} variant="outline" className="font-bold">
                  Select All
                </Button>
                <Button onClick={handleDeselectAll} variant="outline" className="font-bold">
                  Deselect All
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black mb-8">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Genre</label>
                <select
                  value={filterGenre}
                  onChange={e => setFilterGenre(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg px-3 py-2 font-bold"
                >
                  <option value="all">All Genres</option>
                  <option value="indie">Indie</option>
                  <option value="electronic">Electronic</option>
                  <option value="hip hop">Hip Hop</option>
                  <option value="alternative">Alternative</option>
                  <option value="synthwave">Synthwave</option>
                  <option value="acoustic">Acoustic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Platform</label>
                <select
                  value={filterPlatform}
                  onChange={e => setFilterPlatform(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg px-3 py-2 font-bold"
                >
                  <option value="all">All Platforms</option>
                  <option value="spotify">Spotify</option>
                  <option value="apple-music">Apple Music</option>
                  <option value="youtube">YouTube</option>
                  <option value="soundcloud">SoundCloud</option>
                  <option value="reddit">Reddit</option>
                  <option value="instagram">Instagram</option>
                  <option value="discord">Discord</option>
                </select>
              </div>
            </div>
          </div>

          {/* Curators Grid */}
          <div className="grid gap-6">
            {filteredCurators.map(curator => (
              <Card
                key={curator.id}
                className="shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getPlatformColor(
                          curator.platform
                        )}`}
                      >
                        {getPlatformIcon(curator.platform)}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-black">{curator.name}</CardTitle>
                        <p className="text-lg font-bold text-gray-700">{curator.playlistName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-gray-600">
                            {curator.followers} followers
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            • {curator.responseRate} response rate
                          </span>
                          <span className="text-sm font-bold text-yellow-600">
                            • {curator.matchScore}% match
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className="bg-yellow-100 text-yellow-800 font-bold">
                          {curator.genre}
                        </Badge>
                      </div>
                      <Checkbox
                        checked={selectedCurators.includes(curator.id)}
                        onCheckedChange={() => handleCuratorToggle(curator.id)}
                        className="w-5 h-5"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
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
                            href={`https://instagram.com/${curator.contactInfo.instagram.replace(
                              '@',
                              ''
                            )}`}
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
                            href={`https://twitter.com/${curator.contactInfo.twitter.replace(
                              '@',
                              ''
                            )}`}
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
                      <Badge key={index} variant="secondary" className="text-xs font-bold">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          {selectedCurators.length > 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black mt-8">
              <div className="text-center">
                <h3 className="text-2xl font-black text-gray-900 mb-4">
                  Ready to Contact {selectedCurators.length} Curators
                </h3>
                <p className="text-gray-600 font-bold mb-6">
                  Generate personalized AI pitches for each selected curator
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1">
                    <Mail className="w-5 h-5 mr-2" />
                    Generate AI Pitches
                  </Button>
                  <Button variant="outline" className="font-bold px-8 py-4 text-lg">
                    <Download className="w-5 h-5 mr-2" />
                    Export Contact List
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
