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
        <SectionHeader title="identity kernel" description="your unified artist identity profile" />
        <Card>
          <p className="text-tap-grey lowercase">loading identity profile...</p>
        </Card>
      </PageContainer>
    );
  }

  if (!identity) {
    return (
      <PageContainer>
        <SectionHeader title="identity kernel" description="your unified artist identity profile" />
        <Card>
          <p className="text-tap-grey lowercase">no identity data available</p>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionHeader title="identity kernel" description="your unified artist identity profile" />

      <div className="space-y-6">
        {/* Brand Voice */}
        <Card>
          <h3 className="text-lg font-semibold text-tap-white lowercase mb-4">brand voice</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-tap-grey uppercase tracking-wider mb-2">tone</p>
              <p className="text-sm text-tap-white lowercase">{identity.brandVoice.tone}</p>
            </div>
            <div>
              <p className="text-xs text-tap-grey uppercase tracking-wider mb-2">themes</p>
              <div className="flex flex-wrap gap-2">
                {identity.brandVoice.themes.map((theme: string) => (
                  <Badge key={theme} variant="info">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-tap-grey uppercase tracking-wider mb-2">style</p>
              <p className="text-sm text-tap-white lowercase">{identity.brandVoice.style}</p>
            </div>
          </div>
        </Card>

        {/* Creative Profile */}
        <Card>
          <h3 className="text-lg font-semibold text-tap-white lowercase mb-4">creative profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-tap-grey uppercase tracking-wider mb-2">primary motifs</p>
              <div className="flex flex-wrap gap-2">
                {identity.creativeProfile.primaryMotifs.map((motif: string) => (
                  <Badge key={motif} variant="default">
                    {motif}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-tap-grey uppercase tracking-wider mb-2">emotional range</p>
              <p className="text-sm text-tap-white lowercase">
                {identity.creativeProfile.emotionalRange}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-tap-grey uppercase tracking-wider mb-2">
                structural signature
              </p>
              <p className="text-sm text-tap-white lowercase">
                {identity.creativeProfile.structuralSignature}
              </p>
            </div>
          </div>
        </Card>

        {/* Scene Identity */}
        <Card>
          <h3 className="text-lg font-semibold text-tap-white lowercase mb-4">scene identity</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-tap-grey uppercase tracking-wider mb-2">primary scene</p>
              <Badge variant="success" size="md">
                {identity.sceneIdentity.primaryScene}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-tap-grey uppercase tracking-wider mb-2">
                secondary scenes
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
              <p className="text-xs text-tap-grey uppercase tracking-wider mb-2">
                geographic roots
              </p>
              <p className="text-sm text-tap-white lowercase">
                {identity.sceneIdentity.geographicRoots}
              </p>
            </div>
          </div>
        </Card>

        {/* EPK Fragments */}
        <Card>
          <h3 className="text-lg font-semibold text-tap-white lowercase mb-4">
            auto-generated epk fragments
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-tap-grey uppercase tracking-wider mb-2">one-liner</p>
              <p className="text-sm text-tap-white lowercase">{identity.epkFragments.oneLiner}</p>
            </div>
            <div>
              <p className="text-xs text-tap-grey uppercase tracking-wider mb-2">press angle</p>
              <p className="text-sm text-tap-white lowercase">{identity.epkFragments.pressAngle}</p>
            </div>
            <div>
              <p className="text-xs text-tap-grey uppercase tracking-wider mb-2">pitch hook</p>
              <p className="text-sm text-tap-white lowercase">{identity.epkFragments.pitchHook}</p>
            </div>
          </div>
        </Card>

        {/* Bios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-tap-white lowercase mb-4">short bio</h3>
            <p className="text-sm text-tap-white lowercase leading-relaxed">{identity.bioShort}</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-tap-white lowercase mb-4">long bio</h3>
            <p className="text-sm text-tap-white lowercase leading-relaxed whitespace-pre-line">
              {identity.bioLong}
            </p>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
