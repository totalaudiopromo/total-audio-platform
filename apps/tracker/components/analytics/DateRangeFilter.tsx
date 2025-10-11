"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DateRangeFilter() {
  const sp = useSearchParams();
  const router = useRouter();
  const [start, setStart] = useState<string>(sp.get('start') ?? '');
  const [end, setEnd] = useState<string>(sp.get('end') ?? '');

  useEffect(() => {
    setStart(sp.get('start') ?? '');
    setEnd(sp.get('end') ?? '');
  }, [sp]);

  const apply = () => {
    const params = new URLSearchParams(Array.from(sp.entries()));
    if (start) params.set('start', start);
    else params.delete('start');
    if (end) params.set('end', end);
    else params.delete('end');
    router.push(`/analytics?${params.toString()}`);
  };

  const clear = () => {
    const params = new URLSearchParams(Array.from(sp.entries()));
    params.delete('start');
    params.delete('end');
    router.push(`/analytics?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 items-end">
      <label className="text-sm">Start
        <input type="date" className="mt-1 border rounded p-2" value={start} onChange={e => setStart(e.target.value)} />
      </label>
      <label className="text-sm">End
        <input type="date" className="mt-1 border rounded p-2" value={end} onChange={e => setEnd(e.target.value)} />
      </label>
      <button className="px-3 py-2 rounded bg-black text-white" onClick={apply}>Apply</button>
      <button className="px-3 py-2 rounded border" onClick={clear}>Clear</button>
    </div>
  );
}







