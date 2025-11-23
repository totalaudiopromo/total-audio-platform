import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '../components/shared';

async function getShowcases() {
  try {
    const workspaceId = 'demo-workspace';
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}/api/anr/showcases?workspace_id=${workspaceId}`,
      { cache: 'no-store' }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return data.showcases || [];
  } catch (error) {
    console.error('Failed to fetch showcases:', error);
    return [];
  }
}

export const metadata = {
  title: 'Showcases | A&R Radar',
  description: 'Curated artist one-pagers for sharing',
};

export default async function ShowcasesPage() {
  const showcases = await getShowcases();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Showcases</h1>
          <p className="text-slate-400">Curated artist one-pagers for sharing</p>
        </div>

        <Button>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Showcase
        </Button>
      </div>

      {/* Showcases Grid */}
      {showcases.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="No Showcases Yet"
            description="Create showcases to build curated one-pagers for pitching and sharing"
            action={<Button>Create Showcase</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcases.map((showcase: any) => (
            <Link key={showcase.id} href={`/anr/showcases/${showcase.id}`}>
              <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 hover:bg-slate-900/50 transition-all duration-200 cursor-pointer">
                <h3 className="text-lg font-semibold text-slate-100 mb-2">
                  {showcase.name}
                </h3>
                {showcase.description && (
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{showcase.description}</p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">0 artists</span>
                  <span className="text-slate-600 font-mono">
                    {new Date(showcase.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
