import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
}

const Avatar = ({ src, alt, fallback, className = '' }: AvatarProps) => {
  const [imageError, setImageError] = React.useState(false);

  if (src && !imageError) {
    return (
      <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
        <img
          className="aspect-square h-full w-full"
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 ${className}`}
    >
      <span className="text-sm font-medium text-gray-600">{fallback || 'U'}</span>
    </div>
  );
};

export { Avatar };
