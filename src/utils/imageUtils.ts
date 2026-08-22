/**
 * Utility functions for responsive imagery, dynamic srcSet generation, and preloading.
 */

/**
 * Standard widths for responsive srcset generation.
 */
export const DEFAULT_RESPONSIVE_WIDTHS = [320, 480, 640, 768, 1024, 1280, 1600, 1920];

/**
 * Generates a responsive srcset string for a given image URL.
 * Supports Unsplash image URLs (by modifying the w= and q= parameters)
 * as well as generic URLs.
 */
export function generateSrcSet(
  url: string,
  widths: number[] = [320, 640, 960, 1200, 1600]
): string {
  if (!url) return '';

  // Check if it's an Unsplash URL which natively supports width parameters
  if (url.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(url);
      return widths
        .map((w) => {
          const clone = new URL(url);
          clone.searchParams.set('w', w.toString());
          clone.searchParams.set('auto', 'format');
          clone.searchParams.set('fit', 'crop');
          clone.searchParams.set('q', '80');
          return `${clone.toString()} ${w}w`;
        })
        .join(', ');
    } catch {
      // If URL parsing fails, fallback
    }
  }

  // Generic fallback if not dynamically resizable via query string
  return `${url} 1x`;
}

/**
 * Preload an image using the browser's native <link rel="preload"> tag or Image constructor.
 * Preloading critical hero assets allows the browser to discover them before layout parsing.
 */
export function preloadImage(
  src: string,
  options?: {
    srcSet?: string;
    sizes?: string;
    fetchPriority?: 'high' | 'low' | 'auto';
  }
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !src) {
      resolve();
      return;
    }

    // Try link tag preload first for HTTP/2 priority benefits
    const existingLink = document.querySelector(`link[rel="preload"][href="${src}"]`);
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      if (options?.fetchPriority) {
        link.setAttribute('fetchpriority', options.fetchPriority);
      }
      if (options?.srcSet) {
        link.setAttribute('imagesrcset', options.srcSet);
      }
      if (options?.sizes) {
        link.setAttribute('imagesizes', options.sizes);
      }
      document.head.appendChild(link);
    }

    // Also warm up browser cache in memory
    const img = new Image();
    if (options?.srcSet) {
      img.srcset = options.srcSet;
    }
    if (options?.sizes) {
      img.sizes = options.sizes;
    }
    img.src = src;
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
}

/**
 * Preloads a batch of images concurrently.
 */
export async function preloadImages(
  urls: Array<string | { src: string; srcSet?: string; sizes?: string; fetchPriority?: 'high' | 'low' | 'auto' }>
): Promise<void> {
  const tasks = urls.map((item) => {
    if (typeof item === 'string') {
      return preloadImage(item);
    }
    return preloadImage(item.src, item);
  });
  await Promise.allSettled(tasks);
}
