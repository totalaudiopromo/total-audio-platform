/**
 * /studio/new - Create new project
 */

'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CISCard, CISButton } from '@total-audio/cis-ui';

function NewProjectForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectType = searchParams.get('type') || 'cover_art';

  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    // In real implementation, this would call the API to create a project
    // For now, just simulate and redirect
    setTimeout(() => {
      router.push(`/studio/project-id-123`);
    }, 1000);
  };

  const typeLabels: Record<string, string> = {
    cover_art: 'Cover Art',
    moodboard: 'Moodboard',
    brand_kit: 'Brand Kit',
    storyboard: 'Storyboard',
    content_hooks: 'Content Hooks',
    trailer_script: 'Trailer Script',
  };

  return (
    <div className="min-h-screen bg-[#0F172A] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Create New {typeLabels[projectType] || 'Project'}
        </h1>

        <CISCard>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title..."
                className="w-full px-4 py-2 bg-[#374151] text-white rounded-lg focus:ring-2 focus:ring-[#3AA9BE] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Type
              </label>
              <div className="px-4 py-2 bg-[#374151] text-white rounded-lg">
                {typeLabels[projectType]}
              </div>
            </div>

            <div className="flex gap-4">
              <CISButton
                onClick={handleCreate}
                disabled={!title || isCreating}
                className="flex-1"
              >
                {isCreating ? 'Creating...' : 'Create Project'}
              </CISButton>
              <CISButton
                onClick={() => router.back()}
                variant="secondary"
              >
                Cancel
              </CISButton>
            </div>
          </div>
        </CISCard>
      </div>
    </div>
  );
}

export default function NewProjectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewProjectForm />
    </Suspense>
  );
}
