import { tapFetch } from '../httpClient';
import type { IntelContact } from '@/lib/types';
import { CONTACTS } from '@/lib/constants';

const USE_MOCKS = true; // Force mocks for demo

export async function fetchPriorityContacts(): Promise<IntelContact[]> {
  if (USE_MOCKS) {
    // Map from existing mock shape to IntelContact
    return CONTACTS.map(c => ({
      id: c.id,
      name: c.name,
      role: c.type as IntelContact['role'],
      outlet: c.outlet,
      email: `${c.name.toLowerCase().replace(/\s+/g, '.')}@${c.outlet.toLowerCase().replace(/\s+/g, '')}.com`,
      credibilityScore: c.credibilityScore,
      emailStatus: c.emailStatus,
      lastActionAt: c.lastContact,
      country: 'UK',
    }));
  }

  // TODO: replace path with real Audio Intel endpoint
  return tapFetch<IntelContact[]>('/intel/contacts/priority');
}

export async function fetchLeadSuggestionsForArtist(artistId: string): Promise<IntelContact[]> {
  if (USE_MOCKS) {
    // Return top 5 contacts as suggestions
    const all = await fetchPriorityContacts();
    return all.slice(0, 5);
  }

  // TODO: replace with actual endpoint & query params
  return tapFetch<IntelContact[]>(`/intel/leads?artistId=${encodeURIComponent(artistId)}`);
}
