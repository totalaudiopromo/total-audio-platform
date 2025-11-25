import { tapFetch } from '../httpClient';
import { ARTISTS } from '@/lib/constants';
import { fetchLibertyCampaignSummaries } from './tracker';
import type { TrackerCampaignSummary } from '@/lib/types';

// Mock Data for Portal
const MOCK_GMAIL_THREADS = [
  {
    id: 'th_1',
    subject: 'Re: Premiere Confirmation - Clash Magazine',
    sender: 'Robin Murray <robin@clashmusic.com>',
    snippet: 'Hi team, thanks for sending this over. We’d love to run the premiere on Friday...',
    timestamp: '2023-11-20T14:30:00Z',
    tags: ['artist/kyara', 'outlet/clash'],
  },
  {
    id: 'th_2',
    subject: 'Radio Play: BBC 6 Music',
    sender: 'Steve Lamacq <steve.lamacq@bbc.co.uk>',
    snippet: 'Just to let you know we gave the track a spin last night. Great reaction!',
    timestamp: '2023-11-19T18:15:00Z',
    tags: ['artist/kyara', 'outlet/bbc6'],
  },
  {
    id: 'th_3',
    subject: 'Interview Request - DIY',
    sender: 'Lisa Wright <lisa@diymag.com>',
    snippet: 'Would the band be available for a Zoom chat next week? We are planning a feature...',
    timestamp: '2023-11-18T09:45:00Z',
    tags: ['artist/kyara', 'outlet/diy'],
  },
];

const MOCK_SPOTIFY_ANALYTICS = {
  popularityScore: 68,
  popularityHistory: [
    { date: '2023-10-25', score: 62 },
    { date: '2023-11-01', score: 64 },
    { date: '2023-11-08', score: 65 },
    { date: '2023-11-15', score: 67 },
    { date: '2023-11-22', score: 68 },
  ],
  playlistAdds: [
    { id: 'pl_1', name: 'Fresh Finds UK', followers: 125000, addedAt: '2023-11-20' },
    { id: 'pl_2', name: 'Alt. Pop', followers: 85000, addedAt: '2023-11-18' },
    { id: 'pl_3', name: 'New Music Friday', followers: 4500000, addedAt: '2023-11-10' },
  ],
  playlistAddsHistory: [
    { date: '2023-10-25', count: 12 },
    { date: '2023-11-01', count: 15 },
    { date: '2023-11-08', count: 28 },
    { date: '2023-11-15', count: 45 },
    { date: '2023-11-22', count: 52 },
  ],
};

export interface PortalArtist {
  id: string;
  name: string;
  slug: string;
  image: string;
  genre: string;
  label: string;
}

/**
 * Verify artist access token
 * (Mock implementation)
 */
export async function verifyArtistToken(token: string): Promise<PortalArtist | null> {
  // Mock token validation: "liberty-{slug}"
  if (token.startsWith('liberty-')) {
    const slug = token.replace('liberty-', '');
    const artist = Object.values(ARTISTS).find(
      a => a.name.toLowerCase().replace(/\s+/g, '-') === slug
    );
    if (artist) {
      return {
        id: artist.id,
        name: artist.name,
        slug: slug,
        image: artist.image,
        genre: 'Alternative Pop', // Mock
        label: 'Independent', // Mock
      };
    }
  }
  return null;
}

/**
 * Fetch artist details by slug
 */
export async function fetchArtistBySlug(slug: string): Promise<PortalArtist | null> {
  const artist = Object.values(ARTISTS).find(
    a => a.name.toLowerCase().replace(/\s+/g, '-') === slug
  );
  if (artist) {
    return {
      id: artist.id,
      name: artist.name,
      slug: slug,
      image: artist.image,
      genre: 'Alternative Pop',
      label: 'Independent',
    };
  }
  return null;
}

/**
 * Fetch campaigns for an artist
 */
export async function fetchArtistCampaigns(artistName: string): Promise<TrackerCampaignSummary[]> {
  const allCampaigns = await fetchLibertyCampaignSummaries();
  return allCampaigns.filter(c => c.artistName === artistName);
}

/**
 * Fetch full campaign detail for artist
 */
export async function fetchArtistCampaignDetail(campaignId: string) {
  const { fetchCampaignDetail } = await import('./tracker');
  return fetchCampaignDetail(campaignId);
}

/**
 * Fetch Gmail threads for artist
 */
export async function fetchArtistGmailThreads(slug: string) {
  // In real app, filter by artist slug tag
  return MOCK_GMAIL_THREADS;
}

/**
 * Fetch Spotify analytics
 */
export async function fetchSpotifyAnalytics(slug: string) {
  return MOCK_SPOTIFY_ANALYTICS;
}
