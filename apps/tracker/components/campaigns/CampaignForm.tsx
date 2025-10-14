'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';

const schema = z
  .object({
    name: z.string().min(2, 'Campaign name is required'),
    artist_name: z.string().min(2, 'Artist name is required'),
    release_type: z.enum(['single', 'EP', 'album']).optional().nullable(),
    budget: z
      .string()
      .refine(v => !isNaN(Number(v)) && Number(v) >= 0, 'Budget must be a positive number'),
    start_date: z.string().optional().nullable(),
    end_date: z
      .string()
      .optional()
      .nullable(),
    platforms: z.array(z.string()).min(1, 'Select at least one platform'),
    goals: z.string().optional().nullable(),
  })
  .refine(
    data => {
      if (!data.start_date || !data.end_date) return true;
      return new Date(data.end_date) >= new Date(data.start_date);
    },
    { message: 'End date must be after start date', path: ['end_date'] }
  );

type FormData = z.infer<typeof schema>;

const PLATFORMS = [
  { id: 'spotify', label: 'Spotify' },
  { id: 'apple-music', label: 'Apple Music' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'radio', label: 'Radio' },
  { id: 'press', label: 'Press/Blogs' },
  { id: 'playlists', label: 'Playlists' },
];

export function CampaignForm({ onSubmit }: { onSubmit: (values: FormData) => Promise<void> | void }) {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { platforms: [] },
  });

  const submit = handleSubmit(async values => {
    await onSubmit(values);
  });

  const selected = watch('platforms');

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                s === step
                  ? 'bg-purple-600 text-white'
                  : s < step
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {s < step ? '✓' : s}
            </div>
            {s < 3 && <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-green-600' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Campaign Basics</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Campaign name *</label>
            <input
              {...register('name')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-purple-500"
              placeholder="e.g., Summer Single Release"
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Artist name *</label>
            <input
              {...register('artist_name')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-purple-500"
              placeholder="e.g., The Artist"
            />
            {errors.artist_name && <p className="text-sm text-red-600 mt-1">{errors.artist_name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Release type</label>
            <select
              {...register('release_type')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-purple-500"
            >
              <option value="">Select type</option>
              <option value="single">Single</option>
              <option value="EP">EP</option>
              <option value="album">Album</option>
            </select>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Budget & Timeline</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Budget (£) *</label>
            <input
              {...register('budget')}
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-purple-500"
              placeholder="0.00"
            />
            {errors.budget && <p className="text-sm text-red-600 mt-1">{errors.budget.message}</p>}
            <p className="text-xs text-slate-500 mt-1">Total budget for this campaign</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start date</label>
              <input
                type="date"
                {...register('start_date')}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End date</label>
              <input
                type="date"
                {...register('end_date')}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-purple-500"
              />
              {errors.end_date && <p className="text-sm text-red-600 mt-1">{errors.end_date.message}</p>}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Platforms & Goals</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select platforms *</label>
            <div className="grid grid-cols-2 gap-3">
              {PLATFORMS.map(p => (
                <label
                  key={p.id}
                  className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selected?.includes(p.id)
                      ? 'border-purple-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected?.includes(p.id)}
                    onChange={e => {
                      if (e.target.checked) setValue('platforms', [...selected, p.id]);
                      else setValue('platforms', selected.filter(v => v !== p.id));
                    }}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm font-medium">{p.label}</span>
                </label>
              ))}
            </div>
            {errors.platforms && <p className="text-sm text-red-600 mt-1">{errors.platforms.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Campaign goals (optional)</label>
            <textarea
              {...register('goals')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-purple-500"
              rows={4}
              placeholder="e.g., Reach 100k streams in first month, get BBC Radio 1 airplay, secure playlist placements"
            />
            <p className="text-xs text-slate-500 mt-1">Describe what you want to achieve with this campaign</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={isSubmitting}
            className="border-slate-300"
          >
            ← Back
          </Button>
        ) : (
          <div />
        )}
        {step < 3 ? (
          <Button
            type="button"
            onClick={() => setStep(s => Math.min(3, s + 1))}
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Next →
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSubmitting ? 'Creating campaign...' : 'Create Campaign'}
          </Button>
        )}
      </div>
    </form>
  );
}




