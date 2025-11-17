/**
 * /studio/[projectId] - Project editor
 */

'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CoverArtCanvas } from '@total-audio/cis-canvases';
import { CISButton, ExportToolbar } from '@total-audio/cis-ui';
import type { CISElement } from '@total-audio/cis-core';

export default function ProjectEditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  // Mock data - in real implementation, fetch from API
  const [elements, setElements] = useState<CISElement[]>([]);
  const [projectTitle] = useState('My Project');

  const handleExportJPG = () => {
    console.log('Export JPG');
  };

  const handleExportPDF = () => {
    console.log('Export PDF');
  };

  const handleExportBundle = () => {
    console.log('Export Bundle');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      {/* Top Bar */}
      <div className="bg-[#1F2937] p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CISButton onClick={() => router.push('/studio')} variant="ghost" size="sm">
            ← Back
          </CISButton>
          <h1 className="text-xl font-semibold text-white">{projectTitle}</h1>
        </div>

        <div className="flex items-center gap-4">
          <ExportToolbar
            onExportJPG={handleExportJPG}
            onExportPDF={handleExportPDF}
            onExportBundle={handleExportBundle}
          />
          <CISButton size="sm">Save</CISButton>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 p-4">
        <CoverArtCanvas
          projectId={projectId}
          elements={elements}
          onElementCreate={(input) => {
            console.log('Create element', input);
          }}
          onElementUpdate={(id, input) => {
            console.log('Update element', id, input);
          }}
          onElementDelete={(id) => {
            console.log('Delete element', id);
          }}
        />
      </div>
    </div>
  );
}
