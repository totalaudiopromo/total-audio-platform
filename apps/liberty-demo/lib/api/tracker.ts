import { tapFetch } from '../httpClient';
import type { TrackerCampaignSummary, TrackerCampaignDetail } from '@/lib/types';
import { CAMPAIGNS, ARTISTS } from '@/lib/constants';

const USE_MOCKS = true; // Force mocks for demo

export async function fetchLibertyCampaignSummaries(): Promise<TrackerCampaignSummary[]> {
  if (USE_MOCKS) {
    return CAMPAIGNS.map(c => {
      const artist = ARTISTS[c.artistId];
      return {
        id: c.id,
        artistName: artist?.name || 'Unknown Artist',
        campaignName: c.title,
        status: c.status as TrackerCampaignSummary['status'],
        momentum: c.momentumScore,
        health: c.healthScore,
        pitchCount: c.stats.pitchesSent,
        openRate: c.stats.openRate,
        replyRate: c.stats.replyRate,
        placementValueGBP: c.coverage * 1200, // Mock calculation
      };
    });
  }

  // TODO: actual endpoint with Liberty org filter
  return tapFetch<TrackerCampaignSummary[]>('/tracker/campaigns?agency=Liberty');
}

export async function fetchCampaignDetail(campaignId: string): Promise<TrackerCampaignDetail> {
  if (USE_MOCKS) {
    const base = CAMPAIGNS.find(c => c.id === campaignId) ?? CAMPAIGNS[0];
    const artist = ARTISTS[base.artistId];

    return {
      id: base.id,
      artistName: artist?.name || 'Unknown Artist',
      campaignName: base.title,
      status: base.status as TrackerCampaignDetail['status'],
      momentum: base.momentumScore,
      health: base.healthScore,
      pitchCount: base.stats.pitchesSent,
      openRate: base.stats.openRate,
      replyRate: base.stats.replyRate,
      placementValueGBP: base.coverage * 1200,
      timelineMermaid: base.timeline,
      coverageLog: base.coverageLog?.map(c => ({
        id: `cov-${c.outlet}-${c.date}`,
        type: c.type,
        outlet: c.outlet,
        highlight: c.highlight,
        date: c.date,
      })),
      tasks: base.tasks?.map(t => ({
        id: t.id,
        title: t.text,
        completed: t.completed,
      })),
      assets: base.assets?.map(a => ({
        id: `asset-${a.name}`,
        name: a.name,
        type: a.type,
        url: a.url,
      })),
      aiSummary: base.aiSummary,
    };
  }

  // TODO: real endpoint
  return tapFetch<TrackerCampaignDetail>(`/tracker/campaigns/${campaignId}`);
}
