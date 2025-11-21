'use client';

import { ReactNode, useState } from 'react';
import clsx from 'clsx';

export interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabbedProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function Tabbed({ tabs, defaultTab }: TabbedProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b-3 border-postcraft-black pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'px-4 py-2.5 text-sm font-bold transition-all duration-150 rounded-lg border-2',
              {
                'bg-postcraft-blue text-postcraft-white border-postcraft-black shadow-brutal-sm': activeTab === tab.id,
                'text-postcraft-gray-700 hover:text-postcraft-black hover:bg-postcraft-gray-50 border-transparent': activeTab !== tab.id,
              }
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{activeContent}</div>
    </div>
  );
}
