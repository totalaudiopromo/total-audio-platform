/**
 * /studio/library - Browse all projects and artifacts
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CISCard, CISButton } from '@total-audio/cis-ui';

export default function LibraryPage() {
  const [filter, setFilter] = useState<string>('all');

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'cover_art', label: 'Cover Art' },
    { value: 'moodboard', label: 'Moodboards' },
    { value: 'brand_kit', label: 'Brand Kits' },
    { value: 'storyboard', label: 'Storyboards' },
    { value: 'content_hooks', label: 'Content Hooks' },
    { value: 'trailer_script', label: 'Trailer Scripts' },
  ];

  // Mock projects
  const projects = [
    {
      id: '1',
      title: 'Album Cover Art',
      type: 'cover_art',
      updatedAt: '2 hours ago',
    },
    {
      id: '2',
      title: 'Brand Identity Kit',
      type: 'brand_kit',
      updatedAt: 'Yesterday',
    },
    {
      id: '3',
      title: 'Release Campaign Moodboard',
      type: 'moodboard',
      updatedAt: '3 days ago',
    },
  ];

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter((p) => p.type === filter);

  return (
    <div className="min-h-screen bg-[#0F172A] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Project Library</h1>
            <p className="text-gray-400">All your creative projects in one place</p>
          </div>
          <Link href="/studio">
            <CISButton variant="primary">+ New Project</CISButton>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {filters.map((f) => (
            <CISButton
              key={f.value}
              onClick={() => setFilter(f.value)}
              variant={filter === f.value ? 'primary' : 'secondary'}
              size="sm"
            >
              {f.label}
            </CISButton>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link key={project.id} href={`/studio/${project.id}`}>
              <CISCard className="h-full">
                <div className="aspect-square bg-[#374151] rounded-xl mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {project.title}
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 capitalize">
                    {project.type.replace('_', ' ')}
                  </span>
                  <span className="text-gray-500">{project.updatedAt}</span>
                </div>
              </CISCard>
            </Link>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No projects found</p>
            <Link href="/studio">
              <CISButton variant="primary">Create Your First Project</CISButton>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
