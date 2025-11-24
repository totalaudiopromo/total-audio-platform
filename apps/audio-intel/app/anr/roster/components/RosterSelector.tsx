'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface RosterSelectorProps {
  rosters: Array<{ id: string; name: string }>;
  selectedId?: string;
}

export function RosterSelector({ rosters, selectedId }: RosterSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (rosterId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('roster', rosterId);
    router.push(`/anr/roster?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium text-slate-300">Select Roster:</label>
      <select
        value={selectedId || ''}
        onChange={(e) => handleChange(e.target.value)}
        className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#3AA9BE]/50"
      >
        <option value="">-- Select --</option>
        {rosters.map((roster) => (
          <option key={roster.id} value={roster.id}>
            {roster.name}
          </option>
        ))}
      </select>

      <Button variant="outline" size="sm">
        New Roster
      </Button>
    </div>
  );
}
