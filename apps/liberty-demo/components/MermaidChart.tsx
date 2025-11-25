import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidChartProps {
  code: string;
}

const MermaidChart: React.FC<MermaidChartProps> = ({ code }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

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

    mermaid
      .render(id, code)
      .then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      })
      .catch(err => {
        // Fail silently in UI, log for dev
        console.error('Mermaid render error:', err);
      });
  }, [code]);

  return (
    <div
      className="w-full overflow-hidden rounded-md border border-tap-line bg-tap-panel p-3"
      ref={ref}
    />
  );
};

export default MermaidChart;
