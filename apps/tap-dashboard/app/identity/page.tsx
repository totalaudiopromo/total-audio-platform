'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useIdentity } from '@/lib/hooks/use-intelligence';

export default function IdentityPage() {
  const artistSlug = 'current-artist';
  const { data: identity, isLoading } = useIdentity(artistSlug);

  if (isLoading) {
    return (
      <PageContainer>
        <SectionHeader
          title="Identity Kernel"
          description="Your unified artist identity profile"
        />
        <Card>
          <p className="text-postcraft-gray-600">Loading identity profile...</p>
        </Card>
      </PageContainer>
    );
  }

  if (!identity) {
    return (
      <PageContainer>
        <SectionHeader
          title="Identity Kernel"
          description="Your unified artist identity profile"
        />
        <Card>
          <p className="text-postcraft-gray-600">No identity data available</p>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Identity Kernel"
        description="Your unified artist identity profile"
      />

      <div className="space-y-6">
        {/* Brand Voice */}
        <Card>
          <h3 className="text-lg font-bold text-postcraft-black mb-4">
            Brand Voice
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-2 font-bold">
                Tone
              </p>
              <p className="text-sm text-postcraft-gray-900">{identity.brandVoice.tone}</p>
            </div>
            <div>
              <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-2 font-bold">
                Themes
              </p>
              <div className="flex flex-wrap gap-2">
                {identity.brandVoice.themes.map((theme: string) => (
                  <Badge key={theme} variant="info">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-2 font-bold">
                Style
              </p>
              <p className="text-sm text-postcraft-gray-900">{identity.brandVoice.style}</p>
            </div>
          </div>
        </Card>

        {/* Creative Profile */}
        <Card>
          <h3 className="text-lg font-bold text-postcraft-black mb-4">
            Creative Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-2 font-bold">
                Primary Motifs
              </p>
              <div className="flex flex-wrap gap-2">
                {identity.creativeProfile.primaryMotifs.map((motif: string) => (
                  <Badge key={motif} variant="default">
                    {motif}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-2 font-bold">
                Emotional Range
              </p>
              <p className="text-sm text-postcraft-gray-900">
                {identity.creativeProfile.emotionalRange}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-2 font-bold">
                Structural Signature
              </p>
              <p className="text-sm text-postcraft-gray-900">
                {identity.creativeProfile.structuralSignature}
              </p>
            </div>
          </div>
        </Card>

        {/* Scene Identity */}
        <Card>
          <h3 className="text-lg font-bold text-postcraft-black mb-4">
            Scene Identity
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-2 font-bold">
                Primary Scene
              </p>
              <Badge variant="success" size="md">
                {identity.sceneIdentity.primaryScene}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-2 font-bold">
                Secondary Scenes
              </p>
              <div className="flex flex-wrap gap-2">
                {identity.sceneIdentity.secondaryScenes.map((scene: string) => (
                  <Badge key={scene} variant="default">
                    {scene}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-2 font-bold">
                Geographic Roots
              </p>
              <p className="text-sm text-postcraft-gray-900">
                {identity.sceneIdentity.geographicRoots}
              </p>
            </div>
          </div>
        </Card>

        {/* EPK Fragments */}
        <Card>
          <h3 className="text-lg font-bold text-postcraft-black mb-4">
            Auto-Generated EPK Fragments
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-2 font-bold">
                One-Liner
              </p>
              <p className="text-sm text-postcraft-gray-900">
                {identity.epkFragments.oneLiner}
              </p>
            </div>
            <div>
              <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-2 font-bold">
                Press Angle
              </p>
              <p className="text-sm text-postcraft-gray-900">
                {identity.epkFragments.pressAngle}
              </p>
            </div>
            <div>
              <p className="text-xs text-postcraft-gray-700 uppercase tracking-wider mb-2 font-bold">
                Pitch Hook
              </p>
              <p className="text-sm text-postcraft-gray-900">
                {identity.epkFragments.pitchHook}
              </p>
            </div>
          </div>
        </Card>

        {/* Bios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-bold text-postcraft-black mb-4">
              Short Bio
            </h3>
            <p className="text-sm text-postcraft-gray-900 leading-relaxed">
              {identity.bioShort}
            </p>
          </Card>
          <Card>
            <h3 className="text-lg font-bold text-postcraft-black mb-4">
              Long Bio
            </h3>
            <p className="text-sm text-postcraft-gray-900 leading-relaxed whitespace-pre-line">
              {identity.bioLong}
            </p>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
