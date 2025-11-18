/**
 * RCF Digest Page
 * View daily and weekly summaries with export options
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DigestView } from './components/DigestView';

interface DigestData {
  id?: string;
  period_start: string;
  period_end: string;
  period_type: 'daily' | 'weekly';
  top_events?: Array<{ event_type: string; artist_slug: string; weight: number }>;
  top_artists?: Array<{ artist_slug: string; score: number }>;
  top_scenes?: Array<{ scene_slug: string; score: number }>;
  top_sources?: Array<{ source_slug: string; count: number }>;
  biggest_movers?: Array<{ artist_slug: string; change: number }>;
  stats?: {
    total_events?: number;
    unique_artists?: number;
    unique_scenes?: number;
    avg_weight?: number;
  };
}

export default function RCFDigestPage() {
  const [digests, setDigests] = useState<DigestData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly'>('daily');
  const [viewFormat, setViewFormat] = useState<'visual' | 'markdown'>('visual');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDigests();
  }, [selectedPeriod]);

  async function fetchDigests() {
    try {
      setLoading(true);
      const response = await fetch(`/api/rcf/digest?period=${selectedPeriod}`);
      const result = await response.json();

      if (result.success) {
        setDigests(Array.isArray(result.data) ? result.data : [result.data]);
      }
    } catch (error) {
      console.error('Failed to fetch digests:', error);
    } finally {
      setLoading(false);
    }
  }

  function downloadMarkdown(digest: DigestData) {
    const markdown = generateMarkdownExport(digest);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rcf-digest-${digest.period_type}-${digest.period_start}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-[#0a0a0a]/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-start justify-between">
            <div>
              <Link
                href="/rcf"
                className="text-sm text-[#3AA9BE] hover:text-[#3AA9BE]/80 transition-colors duration-240"
              >
                ← Back to Feed
              </Link>
              <h1 className="mt-2 text-2xl font-bold tracking-tight">Coverage Digests</h1>
              <p className="text-sm text-slate-400 mt-1">
                Automated summaries of coverage activity
              </p>
            </div>

            <div className="flex flex-col items-end space-y-3">
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedPeriod('daily')}
                  className={`
                    px-4 py-2 text-sm font-medium font-mono rounded-lg
                    transition-all duration-240 ease-out
                    ${
                      selectedPeriod === 'daily'
                        ? 'bg-[#3AA9BE] text-white'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }
                  `}
                >
                  Daily
                </button>
                <button
                  onClick={() => setSelectedPeriod('weekly')}
                  className={`
                    px-4 py-2 text-sm font-medium font-mono rounded-lg
                    transition-all duration-240 ease-out
                    ${
                      selectedPeriod === 'weekly'
                        ? 'bg-[#3AA9BE] text-white'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }
                  `}
                >
                  Weekly
                </button>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setViewFormat('visual')}
                  className={`
                    px-4 py-2 text-sm font-medium font-mono rounded-lg
                    transition-all duration-240 ease-out
                    ${
                      viewFormat === 'visual'
                        ? 'bg-[#3AA9BE] text-white'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }
                  `}
                >
                  Visual
                </button>
                <button
                  onClick={() => setViewFormat('markdown')}
                  className={`
                    px-4 py-2 text-sm font-medium font-mono rounded-lg
                    transition-all duration-240 ease-out
                    ${
                      viewFormat === 'markdown'
                        ? 'bg-[#3AA9BE] text-white'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }
                  `}
                >
                  Markdown
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-pulse text-[#3AA9BE]">Loading digests...</div>
            </div>
          ) : digests.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <div className="text-lg mb-2">No digests available</div>
              <div className="text-sm">
                Digests are generated automatically once coverage events flow through the system
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {digests.map((digest, idx) => (
                <div
                  key={digest.id || `digest-${idx}`}
                  className="bg-slate-900/50 rounded-lg border border-slate-800 p-8"
                >
                  <div className="flex items-center justify-end mb-6">
                    <button
                      onClick={() => downloadMarkdown(digest)}
                      className="
                        px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium font-mono
                        transition-colors hover:bg-slate-700
                        flex items-center space-x-2
                      "
                    >
                      <span>⬇</span>
                      <span>Export Markdown</span>
                    </button>
                  </div>

                  <DigestView digest={digest} format={viewFormat} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function generateMarkdownExport(digest: DigestData): string {
  const lines: string[] = [];

  lines.push(`# RCF ${digest.period_type === 'daily' ? 'Daily' : 'Weekly'} Digest`);
  lines.push('');
  lines.push(
    `**Period**: ${new Date(digest.period_start).toLocaleDateString()} - ${new Date(digest.period_end).toLocaleDateString()}`
  );
  lines.push('');

  if (digest.stats) {
    lines.push('## Statistics');
    lines.push('');
    if (digest.stats.total_events) lines.push(`- Total Events: ${digest.stats.total_events}`);
    if (digest.stats.unique_artists) lines.push(`- Unique Artists: ${digest.stats.unique_artists}`);
    if (digest.stats.unique_scenes) lines.push(`- Unique Scenes: ${digest.stats.unique_scenes}`);
    if (digest.stats.avg_weight)
      lines.push(`- Average Weight: ${digest.stats.avg_weight.toFixed(2)}`);
    lines.push('');
  }

  if (digest.top_events && digest.top_events.length > 0) {
    lines.push('## Top Events');
    lines.push('');
    digest.top_events.forEach((event, idx) => {
      lines.push(`${idx + 1}. **${event.event_type}**: ${event.artist_slug} (weight: ${event.weight.toFixed(2)})`);
    });
    lines.push('');
  }

  if (digest.top_artists && digest.top_artists.length > 0) {
    lines.push('## Top Artists');
    lines.push('');
    digest.top_artists.forEach((artist, idx) => {
      lines.push(`${idx + 1}. ${artist.artist_slug} (score: ${artist.score.toFixed(1)})`);
    });
    lines.push('');
  }

  if (digest.top_scenes && digest.top_scenes.length > 0) {
    lines.push('## Top Scenes');
    lines.push('');
    digest.top_scenes.forEach((scene, idx) => {
      lines.push(`${idx + 1}. ${scene.scene_slug} (score: ${scene.score.toFixed(1)})`);
    });
    lines.push('');
  }

  if (digest.biggest_movers && digest.biggest_movers.length > 0) {
    lines.push('## Biggest Movers');
    lines.push('');
    digest.biggest_movers.forEach((mover) => {
      lines.push(`- ${mover.artist_slug}: +${mover.change.toFixed(1)}%`);
    });
    lines.push('');
  }

  if (digest.top_sources && digest.top_sources.length > 0) {
    lines.push('## Top Sources');
    lines.push('');
    digest.top_sources.forEach((source, idx) => {
      lines.push(`${idx + 1}. ${source.source_slug} (${source.count} events)`);
    });
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push(`*Generated by RCF Phase 2 on ${new Date().toLocaleDateString()}*`);

  return lines.join('\n');
}
