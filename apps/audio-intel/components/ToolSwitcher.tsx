'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const tools = [
  {
    name: 'Audio Intel',
    url: 'https://intel.totalaudiopromo.com',
    description: 'Contact enrichment & database',
    active: true,
  },
  {
    name: 'Pitch Generator',
    url: 'https://pitch.totalaudiopromo.com',
    description: 'AI-powered music PR pitches',
  },
  {
    name: 'Tracker',
    url: 'https://tracker.totalaudiopromo.com',
    description: 'Campaign tracking & AI intelligence',
  },
  {
    name: 'Command Centre',
    url: 'https://command.totalaudiopromo.com',
    description: 'Marketing automation & analytics',
  },
];

export function ToolSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const activeTool = tools.find(t => t.active);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border-2 border-black bg-white px-4 py-2 text-sm font-semibold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
      >
        <span>{activeTool?.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="p-4">
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                Total Audio Tools
              </p>
              <div className="space-y-2">
                {tools.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.url}
                    className={`block rounded-lg border-2 border-black p-4 transition ${
                      tool.active
                        ? 'bg-purple-100'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-black">{tool.name}</p>
                        <p className="mt-1 text-xs text-gray-600">{tool.description}</p>
                      </div>
                      {tool.active && (
                        <span className="rounded-full bg-purple-600 px-2 py-0.5 text-xs font-bold text-white">
                          CURRENT
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
              <div className="mt-4 border-t-2 border-gray-200 pt-4">
                <a
                  href="https://totalaudiopromo.com"
                  className="block text-center text-xs font-semibold text-gray-600 transition hover:text-purple-600"
                >
                  View all tools →
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
