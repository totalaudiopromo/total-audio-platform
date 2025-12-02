import type { FusionContext } from '@total-audio/fusion-layer';
import { Plus, Upload, Mail, Calendar } from 'lucide-react';

export function QuickActions({ context }: { context: FusionContext }) {
  const actions = [
    { name: 'New Campaign', href: '/dashboard/email/new', icon: Mail },
    { name: 'Upload Assets', href: '/dashboard/assets/upload', icon: Upload },
    { name: 'Create Release Plan', href: '/dashboard/releases/new', icon: Calendar },
    { name: 'Add Contact', href: '/dashboard/intel/add', icon: Plus },
  ];

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
      <div className="mt-4 space-y-2">
        {actions.map(action => {
          const Icon = action.icon;
          return (
            <a
              key={action.name}
              href={action.href}
              className="flex items-center gap-3 rounded-lg border border-transparent p-3 transition-all hover:border-[#3AA9BE] hover:bg-zinc-800/50"
            >
              <Icon className="h-4 w-4 text-zinc-400" />
              <span className="text-sm text-zinc-300">{action.name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
