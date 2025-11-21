import { Card } from '../ui/Card';
import { Metric } from '../ui/Metric';

interface SnapshotCardProps {
  data: {
    activeCampaigns: number;
    totalContacts: number;
    coverageEvents: number;
    avgReplyRate: number;
  };
}

export function SnapshotCard({ data }: SnapshotCardProps) {
  return (
    <Card>
      <h3 className="text-lg font-bold text-postcraft-black mb-6">
        Snapshot
      </h3>
      <div className="grid grid-cols-2 gap-6">
        <Metric
          label="Active Campaigns"
          value={data.activeCampaigns}
          format="number"
        />
        <Metric
          label="Total Contacts"
          value={data.totalContacts}
          format="number"
        />
        <Metric
          label="Coverage Events"
          value={data.coverageEvents}
          format="number"
        />
        <Metric
          label="Avg Reply Rate"
          value={(data.avgReplyRate * 100).toFixed(1)}
          format="percentage"
        />
      </div>
    </Card>
  );
}
