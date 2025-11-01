import type { WorkflowBreakdownData } from '@/types/case-study';

interface WorkflowBreakdownProps {
  data: WorkflowBreakdownData;
}

export function WorkflowBreakdown({ data }: WorkflowBreakdownProps) {
  return (
    <section id="audio-intel-workflow" className="space-y-6">
      <h2 className="text-3xl font-black text-gray-900">{data.heading}</h2>
      <p className="text-lg text-gray-700 leading-relaxed">{data.intro}</p>
      <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
        {data.steps.map((step, index) => (
          <li key={index}>
            <strong className="text-gray-900">{step.title}:</strong> {step.description}
          </li>
        ))}
      </ol>
    </section>
  );
}
