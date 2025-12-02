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
        <SectionHeader title="Identity Kernel" description="Your unified artist identity profile" />
        <Card>
          <div className="p-4">
            <p className="text-slate-500">Loading identity profile...</p>
          </div>
        </Card>
      </PageContainer>
    );
  }

  if (!identity) {
    return (
      <PageContainer>
        <SectionHeader title="Identity Kernel" description="Your unified artist identity profile" />
        <Card>
          <div className="p-4">
            <p className="text-slate-500">No identity data available</p>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionHeader title="Identity Kernel" description="Your unified artist identity profile" />

      <div className="space-y-6">
        {/* Brand Voice */}
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Brand Voice</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Tone</p>
                <p className="text-sm text-slate-700">{identity.brandVoice.tone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Themes</p>
                <div className="flex flex-wrap gap-2">
                  {identity.brandVoice.themes.map((theme: string) => (
                    <Badge key={theme} variant="teal">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Style</p>
                <p className="text-sm text-slate-700">{identity.brandVoice.style}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Creative Profile */}
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Creative Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Primary Motifs
                </p>
                <div className="flex flex-wrap gap-2">
                  {identity.creativeProfile.primaryMotifs.map((motif: string) => (
                    <Badge key={motif} variant="slate">
                      {motif}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Emotional Range
                </p>
                <p className="text-sm text-slate-700">{identity.creativeProfile.emotionalRange}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Structural Signature
                </p>
                <p className="text-sm text-slate-700">
                  {identity.creativeProfile.structuralSignature}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Scene Identity */}
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Scene Identity</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Primary Scene
                </p>
                <Badge variant="teal" size="md">
                  {identity.sceneIdentity.primaryScene}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Secondary Scenes
                </p>
                <div className="flex flex-wrap gap-2">
                  {identity.sceneIdentity.secondaryScenes.map((scene: string) => (
                    <Badge key={scene} variant="slate">
                      {scene}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Geographic Roots
                </p>
                <p className="text-sm text-slate-700">{identity.sceneIdentity.geographicRoots}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* EPK Fragments */}
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Auto-Generated EPK Fragments
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">One-Liner</p>
                <p className="text-sm text-slate-700">{identity.epkFragments.oneLiner}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Press Angle</p>
                <p className="text-sm text-slate-700">{identity.epkFragments.pressAngle}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Pitch Hook</p>
                <p className="text-sm text-slate-700">{identity.epkFragments.pitchHook}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Bios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Short Bio</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{identity.bioShort}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Long Bio</h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {identity.bioLong}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
