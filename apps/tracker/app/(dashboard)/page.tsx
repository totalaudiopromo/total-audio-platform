import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { 
  ChartBarIcon, 
  PlayIcon, 
  SpeakerWaveIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default async function DashboardHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const stats = [
    {
      label: 'Active Campaigns',
      value: '3',
      change: '+2 this week',
      icon: PlayIcon,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-100 to-blue-200',
    },
    {
      label: 'Total Streams',
      value: '24.5K',
      change: '+12% this month',
      icon: SpeakerWaveIcon,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-100 to-purple-200',
    },
    {
      label: 'Engagement Rate',
      value: '12.4%',
      change: '+3.2% vs last month',
      icon: ChartBarIcon,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-100 to-green-200',
    },
    {
      label: 'Campaign ROI',
      value: '+340%',
      change: 'Above industry avg',
      icon: DocumentTextIcon,
      gradient: 'from-yellow-500 to-yellow-600',
      bgGradient: 'from-yellow-100 to-yellow-200',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Welcome Back! 👋</h2>
        <p className="text-slate-600 dark:text-slate-300">Here's what's happening with your campaigns today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border-2 border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{stat.label}</p>
                  <p className={`text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.bgGradient} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-r ${stat.gradient} text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{stat.change}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border-2 border-slate-200 dark:border-slate-800 p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Recent Campaigns</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Your latest campaign activity</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href="/campaigns/new"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-white text-sm font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all"
            >
              + New Campaign
            </a>
            <a
              href="/contacts/import"
              className="inline-flex items-center rounded-xl border-2 border-slate-200 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition-all"
            >
              Import Contacts
            </a>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Summer Singles Release', artist: 'The Midnight Collective', status: 'Active', date: '2 hours ago' },
            { name: 'BBC Radio Campaign', artist: 'Luna Park', status: 'Active', date: '5 hours ago' },
            { name: 'TikTok Viral Push', artist: 'Echo Valley', status: 'Planning', date: 'Yesterday' },
          ].map((campaign, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
            >
              <div className="flex-1 mb-3 sm:mb-0">
                <p className="font-bold text-slate-900 dark:text-white mb-1">{campaign.name}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{campaign.artist} • {campaign.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  campaign.status === 'Active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {campaign.status}
                </span>
                <a
                  href="/campaigns"
                  className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:underline"
                >
                  View →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}




