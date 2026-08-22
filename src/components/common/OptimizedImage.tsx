import React, { useState } from 'react';
import { generateSrcSet } from '../../utils/imageUtils';
import { ImageOff } from 'lucide-react';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  sizes?: string;
  responsiveWidths?: number[];
  autoSrcSet?: boolean;
  priority?: boolean;
  fallbackSrc?: string;
  containerClassName?: string;
}

/**
 * High-performance responsive image component that integrates
 * native browser lazy-loading, async decoding, responsive srcsets,
 * and graceful fallback states.
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  responsiveWidths,
  autoSrcSet = true,
  priority = false,
  fallbackSrc = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Generate responsive srcset
  const srcSet = autoSrcSet ? generateSrcSet(src || fallbackSrc, responsiveWidths) : undefined;
  const currentSrc = hasError ? fallbackSrc : (src || fallbackSrc);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Loading Skeleton / Blur background */}
      {!hasLoaded && !hasError && (
        <div className="absolute inset-0 bg-[#0A1A3F] animate-pulse" />
      )}

      {/* Main Image */}
      <img
        src={currentSrc}
        srcSet={!hasError ? srcSet : undefined}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setHasLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-all duration-500 ${
          hasLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-xs'
        } ${className}`}
        {...props}
      />

      {/* Fallback Icon if failed */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#061845] text-gray-400 p-2 text-center">
          <ImageOff className="w-6 h-6 mb-1 text-gray-500" />
          <span className="text-[10px]">Image unavailable</span>
        </div>
      )}
    </div>
  );
};
