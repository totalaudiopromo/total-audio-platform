import React from 'react';

interface AlertProps {
  variant?: 'default' | 'destructive';
  children: React.ReactNode;
  className?: string;
}

const Alert = ({ variant = 'default', children, className = '' }: AlertProps) => {
  const variantClasses = {
    default: 'border-blue-200 bg-blue-50 text-blue-800',
    destructive: 'border-red-200 bg-red-50 text-red-800',
  };

  const classes = `relative w-full rounded-lg border p-4 ${variantClasses[variant]} ${className}`;

  return <div className={classes}>{children}</div>;
};

interface AlertTitleProps {
  children: React.ReactNode;
}

const AlertTitle = ({ children }: AlertTitleProps) => {
  return <h5 className="mb-1 font-medium leading-none tracking-tight">{children}</h5>;
};

interface AlertDescriptionProps {
  children: React.ReactNode;
}

const AlertDescription = ({ children }: AlertDescriptionProps) => {
  return <div className="text-sm">{children}</div>;
};

export { Alert, AlertTitle, AlertDescription };
