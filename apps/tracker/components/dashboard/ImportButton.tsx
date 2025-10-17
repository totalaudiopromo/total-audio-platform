'use client';

import { useRouter } from 'next/navigation';

export function ImportButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/dashboard/import')}
      className="px-6 py-3 bg-white text-gray-900 rounded-xl hover:bg-gray-50 transition-all font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 text-base whitespace-nowrap w-full sm:w-auto text-center border-2 border-black"
    >
      Import CSV
    </button>
  );
}
