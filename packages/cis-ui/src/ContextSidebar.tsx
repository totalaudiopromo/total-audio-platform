/**
 * Context Sidebar - Shows artist/campaign/scene context
 */

import React from 'react';
import { CISCard } from './CISCard';
import type { CISContext } from '@total-audio/cis-integrations';

export interface ContextSidebarProps {
  context: CISContext;
  onRefresh?: () => void;
}

export const ContextSidebar: React.FC<ContextSidebarProps> = ({
  context,
  onRefresh,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Context</h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-[#3AA9BE] hover:text-[#2d8a9e] text-sm"
          >
            Refresh
          </button>
        )}
      </div>

      {context.artistContext && (
        <CISCard title="Artist">
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-400">Name:</span>{' '}
              <span className="text-white">{context.artistContext.name}</span>
            </div>
            {context.artistContext.genre && (
              <div>
                <span className="text-gray-400">Genre:</span>{' '}
                <span className="text-white">{context.artistContext.genre}</span>
              </div>
            )}
          </div>
        </CISCard>
      )}

      {context.campaignContext && (
        <CISCard title="Campaign">
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-400">Title:</span>{' '}
              <span className="text-white">{context.campaignContext.title}</span>
            </div>
            <div>
              <span className="text-gray-400">Status:</span>{' '}
              <span className="text-white capitalize">{context.campaignContext.status}</span>
            </div>
          </div>
        </CISCard>
      )}

      {context.sceneContext?.primaryScene && (
        <CISCard title="Scene">
          <div className="text-sm">
            <span className="text-white capitalize">
              {context.sceneContext.primaryScene.replace(/-/g, ' ')}
            </span>
          </div>
        </CISCard>
      )}

      {context.creativeFingerprint && (
        <CISCard title="Creative Fingerprint">
          <div className="space-y-2 text-sm">
            {context.creativeFingerprint.brandPersonality && (
              <div>
                <span className="text-gray-400">Personality:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {context.creativeFingerprint.brandPersonality.map((trait, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-[#374151] text-white rounded text-xs"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CISCard>
      )}
    </div>
  );
};
