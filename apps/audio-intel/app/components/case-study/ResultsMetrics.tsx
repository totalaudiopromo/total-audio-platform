import type { ResultsMetricsData } from '@/types/case-study';

interface ResultsMetricsProps {
  data: ResultsMetricsData;
}

export function ResultsMetrics({ data }: ResultsMetricsProps) {
  return (
    <section id="results" className="space-y-6">
      <h2 className="text-3xl font-black text-gray-900">{data.heading}</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 grid md:grid-cols-3 gap-6 text-gray-800">
        {data.metrics.map((metric, index) => (
          <div key={index}>
            <h3 className="text-2xl font-black mb-2">{metric.title}</h3>
            <p className="text-base leading-relaxed">{metric.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
