import React, { useState } from 'react';
import { Film, Tv, User, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ImageProps {
  src?: string;
  alt?: string;
  className?: string;
  type?: 'movie' | 'tv' | 'person' | 'default';
  loading?: 'lazy' | 'eager';
  [key: string]: any;
}

const Image = ({ 
  src, 
  alt, 
  className, 
  type = 'default',
  loading = 'lazy',
  ...rest 
}: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'movie': return <Film size={32} className="text-on-surface-variant/40" />;
      case 'tv': return <Tv size={32} className="text-on-surface-variant/40" />;
      case 'person': return <User size={32} className="text-on-surface-variant/40" />;
      default: return <ImageIcon size={32} className="text-on-surface-variant/40" />;
    }
  };

  return (
    <div className={cn("relative overflow-hidden bg-surface-variant/30 flex items-center justify-center", className)}>
      {/* Placeholder Icon */}
      {(error || !src) && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-variant/50">
          {getIcon()}
        </div>
      )}
      
      {/* Skeleton */}
      {!isLoaded && !error && src && (
        <div className="absolute inset-0 animate-pulse bg-surface-variant/50" />
      )}
      
      <img
        src={src}
        alt={alt}
        loading={loading}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          (isLoaded && !error) ? "opacity-100" : "opacity-0"
        )}
        {...rest}
      />
    </div>
  );
};

export default React.memo(Image);
