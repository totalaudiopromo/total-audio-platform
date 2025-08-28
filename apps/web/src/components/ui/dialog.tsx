import React from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
};

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

const DialogContent = ({ children, className = '' }: DialogContentProps) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

interface DialogHeaderProps {
  children: React.ReactNode;
}

const DialogHeader = ({ children }: DialogHeaderProps) => {
  return (
    <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
      {children}
    </div>
  );
};

interface DialogTitleProps {
  children: React.ReactNode;
}

const DialogTitle = ({ children }: DialogTitleProps) => {
  return (
    <h2 className="text-lg font-semibold leading-none tracking-tight">
      {children}
    </h2>
  );
};

interface DialogDescriptionProps {
  children: React.ReactNode;
}

const DialogDescription = ({ children }: DialogDescriptionProps) => {
  return (
    <p className="text-sm text-gray-500">
      {children}
    </p>
  );
};

interface DialogFooterProps {
  children: React.ReactNode;
}

const DialogFooter = ({ children }: DialogFooterProps) => {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
      {children}
    </div>
  );
};

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter }; 