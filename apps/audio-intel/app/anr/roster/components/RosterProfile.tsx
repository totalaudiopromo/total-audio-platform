import { SectionCard } from '../../components/SectionCard';
import { TagPill } from '../../components/shared';

async function getRosterProfile(rosterId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}/api/anr/rosters/${rosterId}`,
      { cache: 'no-store' }
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data.profile;
  } catch (error) {
    console.error('Failed to fetch roster profile:', error);
    return null;
  }
}

export async function RosterProfile({ rosterId }: { rosterId: string }) {
  const profile = await getRosterProfile(rosterId);

  if (!profile) {
    return <div className="text-slate-500">No profile data available</div>;
  }

  return (
    <SectionCard title="Roster Profile" description="Distribution and overview">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scenes */}
        <div>
          <h4 className="text-sm font-medium text-slate-400 mb-3">Scenes</h4>
          <div className="flex flex-wrap gap-2">
            {profile.scenes_represented?.map((scene: string) => (
              <TagPill key={scene}>{scene}</TagPill>
            ))}
          </div>
        </div>

        {/* Countries */}
        <div>
          <h4 className="text-sm font-medium text-slate-400 mb-3">Countries</h4>
          <div className="flex flex-wrap gap-2">
            {profile.countries_represented?.map((country: string) => (
              <TagPill key={country}>{country}</TagPill>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div>
          <h4 className="text-sm font-medium text-slate-400 mb-3">Stats</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Artists:</span>
              <span className="text-slate-100 font-medium">{profile.total_artists || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Avg Score:</span>
              <span className="text-slate-100 font-medium">
                {profile.avg_composite_score ? Math.round(profile.avg_composite_score * 100) + '%' : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
