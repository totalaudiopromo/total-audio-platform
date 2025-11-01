import type { PainPointsSectionData } from '@/types/case-study';

interface PainPointsSectionProps {
  data: PainPointsSectionData;
}

export function PainPointsSection({ data }: PainPointsSectionProps) {
  return (
    <section id="why-manual-failed" className="space-y-6">
      <h2 className="text-3xl font-black text-gray-900">{data.heading}</h2>
      <p className="text-lg text-gray-700 leading-relaxed">{data.intro}</p>
      <ul className="space-y-4 text-base text-gray-700 leading-relaxed pl-4">
        {data.painPoints.map((painPoint, index) => (
          <li key={index}>
            <strong className="text-gray-900">{painPoint.title}:</strong> {painPoint.description}
          </li>
        ))}
      </ul>
    </section>
  );
}
