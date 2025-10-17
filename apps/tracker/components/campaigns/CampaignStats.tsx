import type { Campaign } from '@/lib/types';

export function CampaignStats({ campaigns }: { campaigns: Campaign[] }) {
  const total = campaigns.length;
  const active = campaigns.filter(c => c.status === 'active').length;
  const draft = campaigns.filter(c => c.status === 'draft').length;
  const completed = campaigns.filter(c => c.status === 'completed').length;

  const cards = [
    { label: 'Total Campaigns', value: total, gradient: 'from-teal-500 to-teal-600' },
    { label: 'Active', value: active, gradient: 'from-green-500 to-green-600' },
    { label: 'Draft', value: draft, gradient: 'from-yellow-500 to-yellow-600' },
    { label: 'Completed', value: completed, gradient: 'from-teal-500 to-teal-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {cards.map(card => (
        <div
          key={card.label}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all"
        >
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{card.label}</p>
          <p className={`text-4xl font-black bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}




