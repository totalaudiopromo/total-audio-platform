'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DateRangeFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [start, setStart] = useState<string>(searchParams?.get('start') ?? '');
  const [end, setEnd] = useState<string>(searchParams?.get('end') ?? '');

  useEffect(() => {
    setStart(searchParams?.get('start') ?? '');
    setEnd(searchParams?.get('end') ?? '');
  }, [searchParams]);

  const apply = () => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (start) params.set('start', start);
    else params.delete('start');
    if (end) params.set('end', end);
    else params.delete('end');
    router.push(`/analytics?${params.toString()}`);
  };

  const clear = () => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.delete('start');
    params.delete('end');
    router.push(`/analytics?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-wrap gap-4 items-end">
      <label className="text-sm font-bold text-gray-700">
        Start
        <input
          type="date"
          className="mt-1 block border-2 border-gray-300 rounded-xl p-2 font-medium focus:border-teal-500 focus:outline-none"
          value={start}
          onChange={e => setStart(e.target.value)}
        />
      </label>
      <label className="text-sm font-bold text-gray-700">
        End
        <input
          type="date"
          className="mt-1 block border-2 border-gray-300 rounded-xl p-2 font-medium focus:border-teal-500 focus:outline-none"
          value={end}
          onChange={e => setEnd(e.target.value)}
        />
      </label>
      <button
        className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        onClick={apply}
      >
        Apply
      </button>
      <button
        className="px-4 py-2 rounded-xl bg-white text-gray-700 font-bold border-2 border-gray-300 hover:border-gray-400 transition-colors"
        onClick={clear}
      >
        Clear
      </button>
    </div>
  );
}
