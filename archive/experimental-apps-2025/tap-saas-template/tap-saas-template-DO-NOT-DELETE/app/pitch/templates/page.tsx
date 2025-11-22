'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, FileText, TrendingUp } from 'lucide-react';
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
        .order('genre');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredTemplates =
    selectedGenre === 'all' ? templates : templates.filter(t => t.genre === selectedGenre);

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
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <Link href="/dashboard" className="subtle-button inline-flex items-center gap-2 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="glass-panel px-8 py-10">
        {/* Header */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold">Template Library</h1>
          <p className="mt-2 text-gray-900/60">
            Genre-specific templates from 500+ successful campaigns
          </p>
        </div>

        {/* Genre Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGenre('all')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedGenre === 'all'
                  ? 'bg-brand-iris text-gray-900'
                  : 'bg-gray-100 text-gray-900/70 hover:bg-white/15'
              }`}
            >
              All Genres
            </button>
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedGenre === genre
                    ? 'bg-brand-iris text-gray-900'
                    : 'bg-gray-100 text-gray-900/70 hover:bg-white/15'
                }`}
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="space-y-6">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="rounded-2xl border border-white/10 bg-gray-50 px-6 py-6 transition hover:border-gray-300 hover:bg-white/[0.07]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="rounded-full bg-brand-magenta/20 p-3">
                    <FileText className="h-6 w-6 text-brand-magenta" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{template.name}</h3>
                    <p className="mt-1 text-sm text-gray-900/60">{template.description}</p>

                    {/* Stats */}
                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-brand-iris" />
                        <span className="text-gray-900/70">
                          {template.success_rate?.toFixed(0)}% success rate
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900/70">
                          Used {template.times_used || 0} times
                        </span>
                      </div>
                    </div>

                    {/* Template Preview */}
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm font-medium text-brand-iris hover:text-brand-iris/80">
                        View template structure
                      </summary>
                      <div className="mt-3 rounded-lg border border-white/10 bg-gray-50 p-4">
                        <pre className="whitespace-pre-wrap font-mono text-xs text-gray-900/70">
                          {template.template_body}
                        </pre>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-8 rounded-2xl border border-brand-amber/30 bg-brand-amber/10 px-6 py-6">
          <h3 className="font-semibold text-brand-amber">How templates work</h3>
          <p className="mt-2 text-sm text-gray-900/70">
            These templates are used as a foundation when you generate pitches. The AI adapts them
            with your contact's information, your artist details, and your key hook to create
            personalized pitches that sound natural and human.
          </p>
        </div>
      </div>
    </div>
  );
}
