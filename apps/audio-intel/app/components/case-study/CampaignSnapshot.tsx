import type { CampaignSnapshotData } from "@/types/case-study";

interface CampaignSnapshotProps {
  data: CampaignSnapshotData;
}

export function CampaignSnapshot({ data }: CampaignSnapshotProps) {
  return (
    <section id="campaign-snapshot" className="space-y-6">
      <h2 className="text-3xl font-black text-gray-900">Campaign Snapshot</h2>
      <p className="text-lg text-gray-700 leading-relaxed">{data.context}</p>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {data.manualEffort.title}
          </h3>
          <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
            {data.manualEffort.points.map((point, index) => (
              <li key={index}>• {point}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {data.aiRun.title}
          </h3>
          <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
            {data.aiRun.points.map((point, index) => (
              <li key={index}>• {point}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
