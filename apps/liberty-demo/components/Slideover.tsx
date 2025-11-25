import React from 'react';
import { X } from 'lucide-react';

interface SlideoverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Slideover: React.FC<SlideoverProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Slideover Panel */}
      <div className="relative z-10 w-full max-w-2xl h-full bg-white shadow-2xl border-l border-[#D9D7D2] flex flex-col transform transition-transform duration-300 ease-in-out animate-in slide-in-from-right">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D9D7D2]">
          <h2 className="text-xl font-sans font-semibold tracking-tight text-black">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">{children}</div>
      </div>
    </div>
  );
};

export default Slideover;
