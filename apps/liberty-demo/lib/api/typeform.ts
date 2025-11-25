import { tapFetch } from '../httpClient';
import { TYPEFORM_SUBMISSIONS } from '@/lib/constants';
import type { TypeformSubmission } from '@/lib/types';

const USE_MOCKS = !process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchRecentTypeformSubmissions(): Promise<TypeformSubmission[]> {
  if (USE_MOCKS) {
    // Return mock submissions sorted by submittedAt descending (most recent first)
    return TYPEFORM_SUBMISSIONS.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  try {
    // TODO: Replace with actual Typeform API endpoint
    return await tapFetch<TypeformSubmission[]>('/typeform/submissions?form=liberty-intake');
  } catch (err) {
    console.warn('[TAP API] Typeform submissions failed, falling back to mocks', err);
    return TYPEFORM_SUBMISSIONS.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }
}
