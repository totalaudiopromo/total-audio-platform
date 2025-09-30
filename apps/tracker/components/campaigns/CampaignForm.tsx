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

const PLATFORMS = ['radio', 'playlists', 'press', 'social'];

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
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Campaign name</label>
            <input {...register('name')} className="w-full rounded-md border border-slate-300 px-3 py-2" />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Artist name</label>
            <input {...register('artist_name')} className="w-full rounded-md border border-slate-300 px-3 py-2" />
            {errors.artist_name && <p className="text-sm text-red-600 mt-1">{errors.artist_name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Release type</label>
            <select {...register('release_type')} className="w-full rounded-md border border-slate-300 px-3 py-2">
              <option value="">Select</option>
              <option value="single">Single</option>
              <option value="EP">EP</option>
              <option value="album">Album</option>
            </select>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Budget (£)</label>
            <input {...register('budget')} className="w-full rounded-md border border-slate-300 px-3 py-2" />
            {errors.budget && <p className="text-sm text-red-600 mt-1">{errors.budget.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start date</label>
              <input type="date" {...register('start_date')} className="w-full rounded-md border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End date</label>
              <input type="date" {...register('end_date')} className="w-full rounded-md border border-slate-300 px-3 py-2" />
              {errors.end_date && <p className="text-sm text-red-600 mt-1">{errors.end_date.message}</p>}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Platforms</label>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map(p => (
                <label key={p} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selected?.includes(p)}
                    onChange={e => {
                      if (e.target.checked) setValue('platforms', [...selected, p]);
                      else setValue('platforms', selected.filter(v => v !== p));
                    }}
                  />
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </label>
              ))}
            </div>
            {errors.platforms && <p className="text-sm text-red-600 mt-1">{errors.platforms.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Goals (optional)</label>
            <textarea {...register('goals')} className="w-full rounded-md border border-slate-300 px-3 py-2" rows={4} placeholder="Describe your campaign goals" />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1 || isSubmitting}>
          Back
        </Button>
        {step < 3 ? (
          <Button type="button" onClick={() => setStep(s => Math.min(3, s + 1))} disabled={isSubmitting}>
            Next
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Create Campaign'}
          </Button>
        )}
      </div>
    </form>
  );
}




