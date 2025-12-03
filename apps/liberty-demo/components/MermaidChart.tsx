'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MermaidChartProps {
  code: string;
}

/**
 * MermaidChart component - renders Mermaid diagrams client-side only.
 *
 * Note: The mermaid library has SSR issues with localStorage access in v11.x.
 * This component lazily loads mermaid only on the client using script injection
 * to avoid webpack bundling issues.
 */
const MermaidChart: React.FC<MermaidChartProps> = ({ code }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [rendered, setRendered] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only run on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !ref.current) return;

    // Load mermaid from CDN to completely avoid bundling issues
    const loadMermaid = async () => {
      try {
        // Check if mermaid is already loaded
        if (!(window as unknown as { mermaid?: unknown }).mermaid) {
          // Load mermaid from CDN
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
          script.async = true;

          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load mermaid'));
            document.head.appendChild(script);
          });
        }

        // Wait a tick for mermaid to initialize
        await new Promise(resolve => setTimeout(resolve, 100));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mermaid = (window as unknown as { mermaid: any }).mermaid;

        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            primaryColor: '#F7F6F4',
            primaryTextColor: '#1C1C1C',
            lineColor: '#8F9BA6',
            primaryBorderColor: '#E5E3DE',
            secondaryColor: '#E5E3DE',
            tertiaryColor: '#FFFFFF',
            fontFamily: 'Inter',
          },
        });

        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, code);

        if (ref.current) {
          ref.current.innerHTML = svg;
          setRendered(true);
        }
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render chart');
      }
    };

    loadMermaid();
  }, [code, isClient]);

  // During SSR, show loading
  if (!isClient) {
    return (
      <div className="w-full overflow-hidden rounded-md border border-tap-line bg-tap-panel p-3">
        <div className="h-20 flex items-center justify-center text-tap-muted text-sm">
          Loading chart...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full overflow-hidden rounded-md border border-red-200 bg-red-50 p-3">
        <div className="h-20 flex items-center justify-center text-red-600 text-sm">
          Chart error: {error}
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full overflow-hidden rounded-md border border-tap-line bg-tap-panel p-3"
      ref={ref}
    >
      {!rendered && (
        <div className="h-20 flex items-center justify-center text-tap-muted text-sm">
          Rendering chart...
        </div>
      )}
    </div>
  );
};

export default MermaidChart;
