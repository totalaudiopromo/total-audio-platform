/**
 * Identity Hints Panel - Shows Identity Kernel suggestions
 */

import React from 'react';
import { CISCard } from './CISCard';
import { PalettePreview } from './PalettePreview';
import type { IdentityProfile } from '@total-audio/cis-integrations';

export interface IdentityHintsPanelProps {
  identityProfile?: IdentityProfile;
}

export const IdentityHintsPanel: React.FC<IdentityHintsPanelProps> = ({
  identityProfile,
}) => {
  if (!identityProfile) {
    return (
      <CISCard title="Identity Hints">
        <p className="text-gray-500 text-sm">No identity profile available</p>
      </CISCard>
    );
  }

  return (
    <CISCard title="Identity Hints">
      <div className="space-y-4">
        {identityProfile.brandVoice && (
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Brand Voice</h4>
            <p className="text-white text-sm">{identityProfile.brandVoice}</p>
          </div>
        )}

        {identityProfile.coreValues && identityProfile.coreValues.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Core Values</h4>
            <div className="flex flex-wrap gap-2">
              {identityProfile.coreValues.map((value, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-[#3AA9BE] bg-opacity-20 text-[#3AA9BE] rounded text-xs"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}

        {identityProfile.narrativeThemes && identityProfile.narrativeThemes.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Narrative Themes</h4>
            <ul className="list-disc list-inside text-white text-sm space-y-1">
              {identityProfile.narrativeThemes.map((theme, i) => (
                <li key={i}>{theme}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </CISCard>
  );
};
