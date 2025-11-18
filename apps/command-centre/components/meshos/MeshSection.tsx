/**
 * MeshSection Component
 * Section container with heading
 */

import { ReactNode } from 'react';

interface MeshSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function MeshSection({ title, subtitle, children, action }: MeshSectionProps) {
  return (
    <section
      style={{
        marginBottom: '2rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1rem',
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#F9FAFB',
              margin: 0,
              marginBottom: subtitle ? '0.25rem' : 0,
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                color: '#9CA3AF',
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </section>
  );
}
