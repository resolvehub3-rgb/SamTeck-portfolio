import React, { useEffect, DependencyList } from 'react';
import { updateDocumentSEO, SEOConfig } from '../utils/seo';

/**
 * Custom hook to dynamically manage page and project SEO tags.
 * Reverts or updates SEO when the component mounts/updates.
 */
export function useSEO(config: SEOConfig, deps: DependencyList = []) {
  useEffect(() => {
    updateDocumentSEO(config);
  }, [
    config.title,
    config.description,
    config.ogTitle,
    config.ogDescription,
    config.ogImage,
    config.ogUrl,
    config.canonicalUrl,
    ...deps,
  ]);
}
