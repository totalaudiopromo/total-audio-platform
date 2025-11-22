import React, { useState } from 'react';

interface CommandProps {
  children: React.ReactNode;
  className?: string;
}

const Command = ({ children, className = '' }: CommandProps) => {
  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-gray-950 ${className}`}
    >
      {children}
    </div>
  );
};

interface CommandInputProps {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

const CommandInput = ({ placeholder, value, onValueChange, className = '' }: CommandInputProps) => {
  return (
    <div className={`flex items-center border-b px-3 ${className}`}>
      <svg
        className="mr-2 h-4 w-4 shrink-0 opacity-50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={placeholder}
        value={value}
        onChange={e => onValueChange?.(e.target.value)}
      />
    </div>
  );
};

interface CommandListProps {
  children: React.ReactNode;
  className?: string;
}

const CommandList = ({ children, className = '' }: CommandListProps) => {
  return (
    <div className={`max-h-[300px] overflow-y-auto overflow-x-hidden ${className}`}>{children}</div>
  );
};

interface CommandItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  className?: string;
}

const CommandItem = ({ children, onSelect, className = '' }: CommandItemProps) => {
  return (
    <button
      className={`
        relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 hover:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50
        ${className}
      `}
      onClick={onSelect}
    >
      {children}
    </button>
  );
};

export { Command, CommandInput, CommandList, CommandItem };
