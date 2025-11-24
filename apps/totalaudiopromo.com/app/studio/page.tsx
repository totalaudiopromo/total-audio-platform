/**
 * /studio - Main studio hub
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { CISCard, CISButton } from '@total-audio/cis-ui';

export default function StudioPage() {
  const projectTypes = [
    {
      type: 'cover_art',
      title: 'Cover Art',
      description: 'Create professional cover art with AI-powered suggestions',
      icon: '🎨',
    },
    {
      type: 'moodboard',
      title: 'Moodboard',
      description: 'Curate visual references and inspiration',
      icon: '🖼️',
    },
    {
      type: 'brand_kit',
      title: 'Brand Kit',
      description: 'Build a complete brand identity system',
      icon: '🎯',
    },
    {
      type: 'storyboard',
      title: 'Storyboard',
      description: 'Plan visual narratives for campaigns',
      icon: '📽️',
    },
    {
      type: 'content_hooks',
      title: 'Content Hooks',
      description: 'Generate social media hooks and ideas',
      icon: '🎣',
    },
    {
      type: 'trailer_script',
      title: 'Trailer Script',
      description: 'Create scripts for music trailers',
      icon: '📝',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Creative Intelligence Studio
          </h1>
          <p className="text-xl text-gray-400">
            AI-powered creative tools for music promotion
          </p>
        </div>

        {/* Recent Projects */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Recent Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CISCard title="My Brand Kit">
              <p className="text-gray-400 text-sm">Last edited 2 hours ago</p>
            </CISCard>
            <CISCard title="Single Cover Art">
              <p className="text-gray-400 text-sm">Last edited yesterday</p>
            </CISCard>
            <CISCard title="Release Moodboard">
              <p className="text-gray-400 text-sm">Last edited 3 days ago</p>
            </CISCard>
          </div>
        </section>

        {/* Create New Project */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-6">
            Create New Project
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectTypes.map((pt) => (
              <CISCard
                key={pt.type}
                className="hover:ring-2 hover:ring-[#3AA9BE] cursor-pointer"
              >
                <div className="text-5xl mb-4">{pt.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {pt.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{pt.description}</p>
                <Link href={`/studio/new?type=${pt.type}`}>
                  <CISButton variant="primary" size="sm">
                    Create
                  </CISButton>
                </Link>
              </CISCard>
            ))}
          </div>
        </section>

        {/* Quick Access */}
        <section className="mt-12">
          <Link href="/studio/library">
            <CISButton variant="ghost">View All Projects →</CISButton>
          </Link>
        </section>
      </div>
    </div>
  );
}
