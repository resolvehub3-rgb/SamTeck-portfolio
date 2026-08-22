import { useState, useEffect } from 'react';
import { preloadImage, generateSrcSet } from '../utils/imageUtils';

export interface PreloadItem {
  src: string;
  generateResponsiveSrcSet?: boolean;
  sizes?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
}

export interface UseImagePreloadReturn {
  isLoaded: boolean;
  hasErrors: boolean;
  progress: number;
}

/**
 * Custom hook to preload key hero and project images into the browser cache.
 * Ensures the portfolio renders instantly without image pop-in or layout shifts.
 */
export function useImagePreload(
  images: Array<string | PreloadItem>,
  options?: {
    enabled?: boolean;
    onComplete?: () => void;
  }
): UseImagePreloadReturn {
  const enabled = options?.enabled ?? true;
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (!enabled || images.length === 0) {
      setIsLoaded(true);
      setProgress(100);
      return;
    }

    let isMounted = true;
    let completedCount = 0;
    let errorOccurred = false;

    const total = images.length;

    const runPreload = async () => {
      const promises = images.map(async (item) => {
        const src = typeof item === 'string' ? item : item.src;
        if (!src) {
          completedCount++;
          if (isMounted) setProgress(Math.round((completedCount / total) * 100));
          return;
        }

        const srcSet =
          typeof item !== 'string' && item.generateResponsiveSrcSet
            ? generateSrcSet(src)
            : undefined;

        const sizes = typeof item !== 'string' ? item.sizes : undefined;
        const fetchPriority = typeof item !== 'string' ? item.fetchPriority : 'high';

        try {
          await preloadImage(src, { srcSet, sizes, fetchPriority });
        } catch {
          errorOccurred = true;
        } finally {
          completedCount++;
          if (isMounted) {
            setProgress(Math.round((completedCount / total) * 100));
          }
        }
      });

      await Promise.allSettled(promises);

      if (isMounted) {
        setIsLoaded(true);
        setHasErrors(errorOccurred);
        if (options?.onComplete) {
          options.onComplete();
        }
      }
    };

    runPreload();

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(images), enabled]);

  return { isLoaded, hasErrors, progress };
}
