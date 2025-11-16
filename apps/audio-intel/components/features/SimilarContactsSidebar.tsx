'use client';

import { useState } from 'react';
import { Button } from '@total-audio/ui/components/button';
import { Card } from '@total-audio/ui/components/card';
import { Loader2, Users, TrendingUp } from 'lucide-react';

interface SimilarContact {
  contactId: string;
  contact: any;
  similarityScore: number;
  genreSimilarity: number;
  locationSimilarity: number;
  roleSimilarity: number;
  platformSimilarity: number;
  recommendationReason: string;
  matchingAttributes: Record<string, any>;
}

interface SimilarContactsSidebarProps {
  contactId: string;
  contactName?: string;
  onSelectContact?: (contactId: string) => void;
  className?: string;
}

export function SimilarContactsSidebar({
  contactId,
  contactName,
  onSelectContact,
  className = '',
}: SimilarContactsSidebarProps) {
  const [similar, setSimilar] = useState<SimilarContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  async function findSimilar() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/contacts/similar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId,
          limit: 10,
          minSimilarityScore: 50,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to find similar contacts');
      }

      setSimilar(data.similar || []);
      setIsOpen(true);
    } catch (err: any) {
      console.error('Error finding similar contacts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <Button
        onClick={findSimilar}
        disabled={loading}
        variant="outline"
        size="sm"
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Finding Similar...
          </>
        ) : (
          <>
            <Users className="mr-2 h-4 w-4" />
            Find Similar Contacts
          </>
        )}
      </Button>

      {error && (
        <div className="mt-2 rounded bg-red-50 p-2 text-sm text-red-600">{error}</div>
      )}

      {isOpen && similar.length > 0 && (
        <Card className="mt-4 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Similar to {contactName || 'this contact'}</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              ✕
            </Button>
          </div>

          <div className="space-y-3">
            {similar.map((item, idx) => (
              <div
                key={item.contactId}
                className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-gray-50"
                onClick={() => onSelectContact?.(item.contactId)}
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {item.contact.name || item.contact.email}
                    </div>
                    <div className="text-xs text-gray-500">{item.contact.email}</div>
                  </div>
                  <div className="ml-2 flex items-center text-sm font-semibold text-green-600">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {item.similarityScore.toFixed(0)}%
                  </div>
                </div>

                <div className="text-xs text-gray-600">{item.recommendationReason}</div>

                {Object.keys(item.matchingAttributes).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {Object.entries(item.matchingAttributes).map(([key, value]) => (
                      <span
                        key={key}
                        className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700"
                      >
                        {key}: {value as string}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {isOpen && similar.length === 0 && !loading && (
        <Card className="mt-4 p-4">
          <p className="text-sm text-gray-500">No similar contacts found</p>
        </Card>
      )}
    </div>
  );
}
