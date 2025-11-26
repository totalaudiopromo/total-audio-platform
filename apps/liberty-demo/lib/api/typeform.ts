import { TYPEFORM_SUBMISSIONS } from '@/lib/constants';
import type { TypeformSubmission } from '@/lib/types';

const USE_MOCKS = !process.env.NEXT_PUBLIC_ENABLE_LIVE_API;

export async function fetchRecentTypeformSubmissions(): Promise<TypeformSubmission[]> {
  if (USE_MOCKS) {
    // Return mock submissions sorted by submittedAt descending (most recent first)
    return TYPEFORM_SUBMISSIONS.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  try {
    const res = await fetch('/api/typeform');
    if (!res.ok) throw new Error('Typeform API error');
    const data = await res.json();
    return data.sort(
      (a: TypeformSubmission, b: TypeformSubmission) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  } catch (err) {
    console.warn('[Typeform] Submissions failed, falling back to mocks', err);
    return TYPEFORM_SUBMISSIONS.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }
}
