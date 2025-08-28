import React, { createContext, useContext, useState } from 'react';

interface RadioGroupContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(undefined);

interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const RadioGroup = ({ value, onValueChange, children, className = '' }: RadioGroupProps) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={className}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

interface RadioGroupItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const RadioGroupItem = ({ value, children, className = '' }: RadioGroupItemProps) => {
  const context = useContext(RadioGroupContext);
  if (!context) throw new Error('RadioGroupItem must be used within RadioGroup');

  const { value: selectedValue, onValueChange } = context;
  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={() => onValueChange(value)}
      className={`
        flex items-center space-x-2 rounded-md border border-gray-300 p-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
        ${isSelected ? 'border-blue-500 bg-blue-50' : ''}
        ${className}
      `}
    >
      <div className={`
        h-4 w-4 rounded-full border-2 flex items-center justify-center
        ${isSelected ? 'border-blue-500' : 'border-gray-300'}
      `}>
        {isSelected && (
          <div className="h-2 w-2 rounded-full bg-blue-500" />
        )}
      </div>
      {children}
    </button>
  );
};

export { RadioGroup, RadioGroupItem }; 