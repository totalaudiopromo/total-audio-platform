'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Star, TrendingUp, Music } from 'lucide-react';
import { supabase, type PitchTemplate } from '@/lib/supabase';

export default function TemplatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [templates, setTemplates] = useState<PitchTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    try {
      const { data, error } = await supabase
        .from('pitch_templates')
        .select('*')
        .eq('is_system', true)
        .order('success_rate', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredTemplates = selectedGenre === 'all'
    ? templates
    : templates.filter(t => t.genre === selectedGenre);

  const genres = Array.from(new Set(templates.map(t => t.genre)));

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-iris" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6">
        <Link href="/dashboard" className="subtle-button inline-flex items-center gap-2 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="glass-panel px-8 py-10">
        {/* Header */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold">Pitch Templates</h1>
          <p className="mt-2 text-gray-900/60">
            Proven templates from 500+ successful campaigns to BBC Radio 1, 6 Music, and more
          </p>
        </div>

        {/* Genre Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGenre('all')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                selectedGenre === 'all'
                  ? 'bg-brand-iris text-white'
                  : 'bg-gray-100 text-gray-900/70 hover:bg-gray-200'
              }`}
            >
              All Genres
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  selectedGenre === genre
                    ? 'bg-brand-iris text-white'
                    : 'bg-gray-100 text-gray-900/70 hover:bg-gray-200'
                }`}
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-8 py-12 text-center">
            <Music className="mx-auto h-12 w-12 text-gray-900/30" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900/70">No templates found</h3>
            <p className="mt-2 text-sm text-gray-900/50">
              Try selecting a different genre
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition hover:border-brand-iris/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold">{template.name}</h3>
                      <span className="rounded-full bg-brand-iris/20 px-3 py-1 text-xs font-medium text-brand-iris">
                        {template.genre}
                      </span>
                      {template.is_system && (
                        <span className="rounded-full bg-success/20 px-3 py-1 text-xs font-medium text-success">
                          System
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-900/60">{template.description}</p>

                    {/* Stats */}
                    <div className="mt-4 flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-brand-iris" />
                        <span className="text-sm font-medium">
                          {(template.success_rate || 0).toFixed(0)}% success rate
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-gray-900/50" />
                        <span className="text-sm text-gray-900/60">
                          Used {template.times_used || 0} times
                        </span>
                      </div>
                    </div>

                    {/* Template Preview */}
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm font-medium text-brand-iris hover:underline">
                        View Template Structure
                      </summary>
                      <div className="mt-3 space-y-4 rounded-xl bg-white/50 p-4">
                        {template.opening_lines && Array.isArray(template.opening_lines) && template.opening_lines.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-900/50">
                              Opening Lines (Random selection)
                            </p>
                            <ul className="mt-2 space-y-1">
                              {template.opening_lines.map((line: string, idx: number) => (
                                <li key={idx} className="text-sm text-gray-900/70">
                                  • {line}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-900/50">
                            Template Structure
                          </p>
                          <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-900/80 font-sans">
                            {template.template_body}
                          </pre>
                        </div>
                        {template.closing_ctas && Array.isArray(template.closing_ctas) && template.closing_ctas.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-900/50">
                              Closing CTAs (Random selection)
                            </p>
                            <ul className="mt-2 space-y-1">
                              {template.closing_ctas.map((cta: string, idx: number) => (
                                <li key={idx} className="text-sm text-gray-900/70">
                                  • {cta}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </details>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/pitch/generate?template=${template.id}`}
                    className="cta-button whitespace-nowrap"
                  >
                    Use Template
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 rounded-2xl border border-brand-iris/30 bg-brand-iris/5 p-6">
          <h3 className="font-semibold">How Templates Work</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-900/70">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-iris" />
              <span>
                Templates provide proven pitch structures used by successful radio promoters
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-iris" />
              <span>
                AI personalises each template based on your track and contact details
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-iris" />
              <span>
                Success rates are based on real response data from BBC Radio 1, 6 Music, and more
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-iris" />
              <span>
                Each template includes multiple opening/closing variations for authenticity
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
