import type { DualCTAData } from '@/types/case-study';

interface DualCTAProps {
  data: DualCTAData;
}

export function DualCTA({ data }: DualCTAProps) {
  return (
    <section id="cta" className="space-y-6">
      <h2 className="text-3xl font-black text-gray-900">{data.heading}</h2>
      <p className="text-lg text-gray-700 leading-relaxed">{data.intro}</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href={data.primaryButton.href}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-base px-8 py-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 active:scale-95"
        >
          {data.primaryButton.text}
        </a>
        <a
          href={data.secondaryButton.href}
          className="inline-flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 font-bold text-base px-8 py-4 rounded-2xl hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 active:scale-95"
        >
          {data.secondaryButton.text}
        </a>
      </div>
    </section>
  );
}
