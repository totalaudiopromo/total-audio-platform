import { tapFetch } from '../httpClient';
import type { PitchEvent } from '@/lib/types';
import { MOCK_PITCH_EVENTS } from '@/lib/constants';

const USE_MOCKS = !process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchPitchEventsForCampaign(campaignId: string): Promise<PitchEvent[]> {
  if (USE_MOCKS) {
    return MOCK_PITCH_EVENTS.filter(e => e.campaignId === campaignId);
  }

  // TODO: real endpoint
  return tapFetch<PitchEvent[]>(`/pitch/events?campaignId=${encodeURIComponent(campaignId)}`);
}

export async function fetchRecentPitchEventsForContact(contactId: string): Promise<PitchEvent[]> {
  if (USE_MOCKS) {
    return MOCK_PITCH_EVENTS.filter(e => e.contactId === contactId);
  }

  return tapFetch<PitchEvent[]>(`/pitch/events?contactId=${encodeURIComponent(contactId)}`);
}
