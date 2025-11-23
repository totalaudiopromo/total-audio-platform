/**
 * /studio/[projectId]/trailer - Trailer creation and editing
 */

'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CISButton } from '@total-audio/cis-ui';
import { createTrailerAssembler, createVideoExporter } from '@total-audio/cis-video';
import type { CISTrailerTimeline } from '@total-audio/cis-video';

export default function TrailerPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [timeline, setTimeline] = useState<CISTrailerTimeline | null>(null);
  const [format, setFormat] = useState<'10s' | '15s' | '30s' | '60s'>('30s');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);

    const assembler = createTrailerAssembler();
    const newTimeline = assembler.createSimpleTrailer(projectId, format, {
      title: 'New Single Out Now',
      subtitle: 'Available Everywhere',
      callToAction: 'Stream Now',
      brandColors: ['#3AA9BE', '#0F172A'],
    });

    setTimeline(newTimeline);
    setIsGenerating(false);
  };

  const handleExport = async () => {
    if (!timeline) return;

    const exporter = createVideoExporter();
    const spec = exporter.generateRenderSpec(timeline, {
      width: 1920,
      height: 1080,
      fps: 30,
      format: 'mp4',
      quality: 'high',
    });

    const json = await exporter.exportToJSON(spec);

    // Download JSON
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trailer-${format}-spec.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push(`/studio/${projectId}`)}
              className="text-[#3AA9BE] hover:text-[#2d8a9e] mb-2"
            >
              ← Back to Project
            </button>
            <h1 className="text-3xl font-bold text-white">Trailer Creator</h1>
          </div>
          <div className="flex gap-4">
            {timeline && (
              <CISButton onClick={handleExport}>
                Export Render Spec
              </CISButton>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-[#1F2937] p-6 rounded-2xl">
              <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full px-4 py-2 bg-[#374151] text-white rounded-lg"
                  >
                    <option value="10s">10 seconds</option>
                    <option value="15s">15 seconds</option>
                    <option value="30s">30 seconds</option>
                    <option value="60s">60 seconds</option>
                  </select>
                </div>

                <CISButton
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? 'Generating...' : 'Generate Trailer'}
                </CISButton>
              </div>
            </div>

            {timeline && (
              <div className="bg-[#1F2937] p-6 rounded-2xl">
                <h2 className="text-xl font-semibold text-white mb-4">Timeline</h2>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Duration:</span>{' '}
                    <span className="text-white">{timeline.duration}s</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Clips:</span>{' '}
                    <span className="text-white">{timeline.clips.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Music Cues:</span>{' '}
                    <span className="text-white">{timeline.musicCues?.length || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="bg-[#1F2937] p-6 rounded-2xl">
              <h2 className="text-xl font-semibold text-white mb-4">Preview</h2>

              {!timeline ? (
                <div className="aspect-video bg-[#0F172A] rounded-xl flex items-center justify-center">
                  <p className="text-gray-500">Generate a trailer to see preview</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="aspect-video bg-[#0F172A] rounded-xl flex items-center justify-center">
                    <p className="text-gray-400">Preview rendering not available</p>
                    <p className="text-gray-600 text-sm ml-2">(Export spec for rendering)</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-400">Clips</h3>
                    {timeline.clips.map((clip, i) => (
                      <div key={clip.id} className="bg-[#374151] p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-white font-medium">{clip.type}</span>
                            <span className="text-gray-400 text-sm ml-2">
                              {clip.startTime}s - {clip.startTime + clip.duration}s
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">{clip.duration}s</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
