/**
 * Scene Context Panel - Shows MIG scene hints
 */

import React from 'react';
import { CISCard } from './CISCard';
import { ColorSwatch } from './ColorSwatch';
import type { ScenePaletteHint, SceneNarrativeAngle } from '@total-audio/cis-integrations';

export interface SceneContextPanelProps {
  paletteHints?: ScenePaletteHint[];
  narrativeAngles?: SceneNarrativeAngle[];
}

export const SceneContextPanel: React.FC<SceneContextPanelProps> = ({
  paletteHints,
  narrativeAngles,
}) => {
  if (!paletteHints?.length && !narrativeAngles?.length) {
    return (
      <CISCard title="Scene Context">
        <p className="text-gray-500 text-sm">No scene hints available</p>
      </CISCard>
    );
  }

  return (
    <div className="space-y-4">
      {paletteHints && paletteHints.length > 0 && (
        <CISCard title="Scene Palettes">
          <div className="space-y-3">
            {paletteHints.map((hint, i) => (
              <div key={i}>
                <div className="text-sm font-medium text-white mb-2 capitalize">
                  {hint.scene.replace(/-/g, ' ')}
                </div>
                <div className="flex gap-2 mb-2">
                  {hint.suggestedColors.map((color, j) => (
                    <ColorSwatch key={j} color={color} size="sm" showHex={false} />
                  ))}
                </div>
                {hint.rationale && (
                  <p className="text-xs text-gray-500">{hint.rationale}</p>
                )}
              </div>
            ))}
          </div>
        </CISCard>
      )}

      {narrativeAngles && narrativeAngles.length > 0 && (
        <CISCard title="Narrative Angles">
          <div className="space-y-3">
            {narrativeAngles.map((angle, i) => (
              <div key={i}>
                <div className="text-sm font-medium text-white mb-1">
                  {angle.angle}
                </div>
                {angle.hooks && angle.hooks.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-gray-400 space-y-1">
                    {angle.hooks.map((hook, j) => (
                      <li key={j}>{hook}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </CISCard>
      )}
    </div>
  );
};
