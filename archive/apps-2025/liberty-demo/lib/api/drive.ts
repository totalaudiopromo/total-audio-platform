import { tapFetch } from '../httpClient';
import type { DriveAsset } from '@/lib/types';
import { DRIVE_ASSETS } from '@/lib/constants';
import {
  PRESS_PROFILES,
  ASSET_TO_PRESS_PROFILE,
  type PressProfile,
} from '@/lib/constants/pressProfiles';

const USE_MOCKS = !process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Fetch all assets from Google Drive
 */
export async function fetchAllAssets(): Promise<DriveAsset[]> {
  if (USE_MOCKS) {
    // Return mock data sorted by updated date descending
    return DRIVE_ASSETS.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  try {
    // TODO: Replace with actual Google Drive API endpoint
    return await tapFetch<DriveAsset[]>('/drive/assets');
  } catch (err) {
    console.warn('[TAP API] Google Drive assets fetch failed, falling back to mocks', err);
    return DRIVE_ASSETS.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }
}

/**
 * Fetch assets by folder
 */
export async function fetchAssetsByFolder(folder: string): Promise<DriveAsset[]> {
  if (USE_MOCKS) {
    // Filter assets by folder and sort by updated date descending
    const folderAssets = DRIVE_ASSETS.filter(asset => asset.folder === folder);
    return folderAssets.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  try {
    // TODO: Replace with actual Google Drive API endpoint
    return await tapFetch<DriveAsset[]>(`/drive/assets?folder=${encodeURIComponent(folder)}`);
  } catch (err) {
    console.warn('[TAP API] Google Drive folder assets fetch failed, falling back to mocks', err);
    const folderAssets = DRIVE_ASSETS.filter(asset => asset.folder === folder);
    return folderAssets.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }
}

/**
 * Search assets by query string
 */
export async function searchAssets(query: string): Promise<DriveAsset[]> {
  if (USE_MOCKS) {
    // Simple search in filename (case-insensitive)
    const lowerQuery = query.toLowerCase();
    const searchResults = DRIVE_ASSETS.filter(
      asset =>
        asset.name.toLowerCase().includes(lowerQuery) ||
        asset.folder.toLowerCase().includes(lowerQuery)
    );
    return searchResults.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  try {
    // TODO: Replace with actual Google Drive API endpoint
    return await tapFetch<DriveAsset[]>(`/drive/assets/search?q=${encodeURIComponent(query)}`);
  } catch (err) {
    console.warn('[TAP API] Google Drive search failed, falling back to mocks', err);
    const lowerQuery = query.toLowerCase();
    const searchResults = DRIVE_ASSETS.filter(
      asset =>
        asset.name.toLowerCase().includes(lowerQuery) ||
        asset.folder.toLowerCase().includes(lowerQuery)
    );
    return searchResults.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }
}

/**
 * Fetch a single asset by ID
 */
export async function fetchAssetById(id: string): Promise<DriveAsset | null> {
  if (USE_MOCKS) {
    const asset = DRIVE_ASSETS.find(asset => asset.id === id);
    return asset || null;
  }

  try {
    // TODO: Replace with actual Google Drive API endpoint
    return await tapFetch<DriveAsset>(`/drive/assets/${id}`);
  } catch (err) {
    console.warn('[TAP API] Google Drive asset by ID fetch failed, falling back to mocks', err);
    const asset = DRIVE_ASSETS.find(asset => asset.id === id);
    return asset || null;
  }
}

/**
 * Fetch assets by campaign ID
 * Alias: fetchAssetsForCampaign for consistency
 */
export async function fetchAssetsByCampaign(campaignId: string): Promise<DriveAsset[]> {
  if (USE_MOCKS) {
    // Filter assets by campaign ID
    const campaignAssets = DRIVE_ASSETS.filter(asset => asset.campaignId === campaignId);
    return campaignAssets.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  try {
    // TODO: Replace with actual Google Drive API endpoint
    return await tapFetch<DriveAsset[]>(
      `/drive/assets?campaignId=${encodeURIComponent(campaignId)}`
    );
  } catch (err) {
    console.warn('[TAP API] Google Drive campaign assets fetch failed, falling back to mocks', err);
    const campaignAssets = DRIVE_ASSETS.filter(asset => asset.campaignId === campaignId);
    return campaignAssets.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }
}

/**
 * Get unique folders list
 */
export async function fetchFolders(): Promise<string[]> {
  if (USE_MOCKS) {
    // Extract unique folders from mock data
    const folders = [...new Set(DRIVE_ASSETS.map(asset => asset.folder))];
    return folders.sort();
  }

  try {
    // TODO: Replace with actual Google Drive API endpoint
    return await tapFetch<string[]>('/drive/folders');
  } catch (err) {
    console.warn('[TAP API] Google Drive folders fetch failed, falling back to mocks', err);
    const folders = [...new Set(DRIVE_ASSETS.map(asset => asset.folder))];
    return folders.sort();
  }
}

/**
 * Alias for fetchAssetsByCampaign
 */
export const fetchAssetsForCampaign = fetchAssetsByCampaign;

/**
 * Fetch press profile for a specific asset
 * Mock-first pattern: looks up asset by ID, maps to press profile
 */
export async function fetchPressProfileForAsset(assetId: string): Promise<PressProfile | null> {
  // Look up asset by ID
  const asset = DRIVE_ASSETS.find(a => a.id === assetId);
  if (!asset) {
    return null;
  }

  // Map asset ID to press profile ID
  const profileId = ASSET_TO_PRESS_PROFILE[assetId];
  if (!profileId) {
    return null;
  }

  // Return press profile
  const profile = PRESS_PROFILES[profileId];
  return profile || null;
}

/**
 * Fetch available asset tags
 * Mock implementation: derives tags from asset names and folders
 */
export async function fetchAssetTags(): Promise<string[]> {
  if (USE_MOCKS) {
    const tags = new Set<string>();
    DRIVE_ASSETS.forEach(asset => {
      const name = asset.name.toLowerCase();
      const folder = asset.folder.toLowerCase();

      if (folder.includes('press') || name.includes('press')) tags.add('Press Shot');
      if (folder.includes('logo') || name.includes('logo')) tags.add('Logo');
      if (folder.includes('artwork') || name.includes('cover')) tags.add('Artwork');
      if (name.includes('live')) tags.add('Live');
      if (name.includes('bio') || name.includes('one-sheet')) tags.add('Bio');
      if (name.includes('lyric')) tags.add('Lyrics');
      if (name.includes('epk')) tags.add('EPK');
    });
    return Array.from(tags).sort();
  }

  // TODO: Real API
  return [];
}

/**
 * Fetch usage stats for an asset
 * Mock implementation: returns random usage data
 */
export async function fetchAssetUsageForCampaign(assetId: string): Promise<string | null> {
  if (USE_MOCKS) {
    // Deterministic mock based on ID
    const idNum = parseInt(assetId.replace(/\D/g, '') || '0');
    if (idNum % 3 === 0) {
      return `Used in ${Math.floor(Math.random() * 3) + 1} campaigns`;
    }
    if (idNum % 5 === 0) {
      return 'Included in Press Kit';
    }
    return null;
  }

  return null;
}
