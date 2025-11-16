'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Copy, Check, Sparkles } from 'lucide-react';

interface PitchVariation {
  id?: string;
  subjectLine: string;
  body: string;
  variationType: 'formal' | 'casual' | 'concise' | 'detailed' | 'follow-up';
  generatedBy?: string;
}

interface PitchVariationsViewerProps {
  artistName: string;
  trackTitle: string;
  genre?: string;
  targetContactType?: 'radio' | 'playlist' | 'press' | 'blog';
  contextInfo?: string;
  streamingLinks?: Record<string, string>;
  previousCoverage?: string[];
  className?: string;
}

export function PitchVariationsViewer({
  artistName,
  trackTitle,
  genre,
  targetContactType = 'radio',
  contextInfo,
  streamingLinks,
  previousCoverage,
  className = '',
}: PitchVariationsViewerProps) {
  const [variations, setVariations] = useState<Record<string, PitchVariation>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const variationTypes: Array<{ type: PitchVariation['variationType']; label: string }> = [
    { type: 'formal', label: 'Formal' },
    { type: 'casual', label: 'Casual' },
    { type: 'concise', label: 'Concise' },
    { type: 'detailed', label: 'Detailed' },
    { type: 'follow-up', label: 'Follow-up' },
  ];

  async function generateVariation(variationType: PitchVariation['variationType']) {
    try {
      setLoading({ ...loading, [variationType]: true });
      setError(null);

      const response = await fetch('/api/pitch/variations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artistName,
          trackTitle,
          genre,
          targetContactType,
          variationType,
          contextInfo,
          streamingLinks,
          previousCoverage,
          saveToDB: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate pitch');
      }

      setVariations({
        ...variations,
        [variationType]: data.variation,
      });
    } catch (err: any) {
      console.error('Error generating pitch variation:', err);
      setError(err.message);
    } finally {
      setLoading({ ...loading, [variationType]: false });
    }
  }

  async function copyToClipboard(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  return (
    <div className={className}>
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Pitch Variations</h2>
          <p className="text-sm text-gray-500">
            Generate AI-powered pitch variations for {artistName} - "{trackTitle}"
          </p>
        </div>

        {error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <Tabs defaultValue="formal" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {variationTypes.map(({ type, label }) => (
              <TabsTrigger key={type} value={type}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {variationTypes.map(({ type, label }) => (
            <TabsContent key={type} value={type} className="mt-4">
              {!variations[type] ? (
                <div className="rounded-lg border-2 border-dashed p-8 text-center">
                  <Sparkles className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                  <p className="mb-4 text-sm text-gray-600">
                    Generate a {label.toLowerCase()} pitch variation
                  </p>
                  <Button onClick={() => generateVariation(type)} disabled={loading[type]}>
                    {loading[type] ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate {label} Pitch
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Subject Line */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Subject Line</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(variations[type].subjectLine, `subject-${type}`)
                        }
                      >
                        {copiedId === `subject-${type}` ? (
                          <>
                            <Check className="mr-1 h-3 w-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="mr-1 h-3 w-3" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 font-medium">
                      {variations[type].subjectLine}
                    </div>
                  </div>

                  {/* Body */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Email Body</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(variations[type].body, `body-${type}`)}
                      >
                        {copiedId === `body-${type}` ? (
                          <>
                            <Check className="mr-1 h-3 w-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="mr-1 h-3 w-3" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4 whitespace-pre-wrap">
                      {variations[type].body}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between border-t pt-4">
                    <Button variant="outline" size="sm" onClick={() => generateVariation(type)}>
                      <Sparkles className="mr-2 h-3 w-3" />
                      Regenerate
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          `${variations[type].subjectLine}\n\n${variations[type].body}`,
                          `full-${type}`
                        )
                      }
                    >
                      {copiedId === `full-${type}` ? (
                        <>
                          <Check className="mr-2 h-3 w-3" />
                          Copied Full Pitch
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-3 w-3" />
                          Copy Full Pitch
                        </>
                      )}
                    </Button>
                  </div>

                  {variations[type].generatedBy && (
                    <div className="text-xs text-gray-400">
                      Generated by {variations[type].generatedBy}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}
