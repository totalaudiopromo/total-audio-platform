import React, { createContext, useContext, useState } from 'react';

interface CollapsibleContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CollapsibleContext = createContext<CollapsibleContextType | undefined>(undefined);

interface CollapsibleProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

const Collapsible = ({ open: controlledOpen, onOpenChange, children, className = '' }: CollapsibleProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <div className={className}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
};

interface CollapsibleTriggerProps {
  children: React.ReactNode;
  className?: string;
}

const CollapsibleTrigger = ({ children, className = '' }: CollapsibleTriggerProps) => {
  const context = useContext(CollapsibleContext);
  if (!context) throw new Error('CollapsibleTrigger must be used within Collapsible');

  const { open, setOpen } = context;

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={className}
    >
      {children}
    </button>
  );
};

interface CollapsibleContentProps {
  children: React.ReactNode;
  className?: string;
}

const CollapsibleContent = ({ children, className = '' }: CollapsibleContentProps) => {
  const context = useContext(CollapsibleContext);
  if (!context) throw new Error('CollapsibleContent must be used within Collapsible');

  const { open } = context;

  if (!open) return null;

  return (
    <div className={`overflow-hidden transition-all ${className}`}>
      <div className="pb-4 pt-0">
        {children}
      </div>
    </div>
  );
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent }; 