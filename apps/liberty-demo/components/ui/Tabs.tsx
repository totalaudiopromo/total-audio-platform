'use client';

import { useState, createContext, useContext } from 'react';

interface Tab {
  id: string;
  label: string;
  badge?: string | number;
}

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ tabs, defaultTab, onChange, children, className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={className}>
        <div className="flex gap-1 border-b border-[#D9D7D2] mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors duration-150 relative ${
                activeTab === tab.id ? 'text-[#111]' : 'text-[#737373] hover:text-[#111]'
              }`}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                {tab.badge !== undefined && (
                  <span className="px-1.5 py-0.5 bg-[#F5F5F5] text-[#737373] text-xs font-mono rounded">
                    {tab.badge}
                  </span>
                )}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabPanelProps {
  id: string;
  children: React.ReactNode;
}

export function TabPanel({ id, children }: TabPanelProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabPanel must be used within Tabs');
  }

  if (id !== context.activeTab) return null;
  return <div className="liberty-fade-in">{children}</div>;
}

export default Tabs;
