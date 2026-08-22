export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string | string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  jsonLd?: Record<string, unknown>;
}

/**
 * Helper to update or create a meta tag by name or property attribute.
 */
function setMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string) {
  if (!content) return;
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Helper to update or create a link tag (like canonical).
 */
function setLinkTag(rel: string, href: string) {
  if (!href) return;
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

/**
 * Helper to inject or update JSON-LD Structured Data in head.
 */
function setJsonLd(data: Record<string, unknown> | null) {
  const existingScript = document.getElementById('seo-json-ld');
  if (!data) {
    if (existingScript) {
      existingScript.remove();
    }
    return;
  }

  let script = existingScript as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'seo-json-ld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

/**
 * Dynamically updates document title, Open Graph, Twitter, and canonical meta tags.
 */
export function updateDocumentSEO(config: SEOConfig) {
  const {
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogType = 'website',
    ogUrl,
    twitterCard = 'summary_large_image',
    canonicalUrl,
    jsonLd,
  } = config;

  // 1. Update Document Title
  if (title) {
    document.title = title;
  }

  // 2. Update Meta Description
  if (description) {
    setMetaTag('name', 'description', description);
  }

  // 3. Update Meta Keywords
  if (keywords) {
    const keywordString = Array.isArray(keywords) ? keywords.join(', ') : keywords;
    setMetaTag('name', 'keywords', keywordString);
  }

  // 4. Open Graph Tags
  setMetaTag('property', 'og:title', ogTitle || title || '');
  setMetaTag('property', 'og:description', ogDescription || description || '');
  setMetaTag('property', 'og:type', ogType);
  if (ogImage) {
    setMetaTag('property', 'og:image', ogImage);
  }
  if (ogUrl) {
    setMetaTag('property', 'og:url', ogUrl);
  } else if (typeof window !== 'undefined') {
    setMetaTag('property', 'og:url', window.location.href);
  }

  // 5. Twitter Card Tags
  setMetaTag('name', 'twitter:card', twitterCard);
  setMetaTag('name', 'twitter:title', ogTitle || title || '');
  setMetaTag('name', 'twitter:description', ogDescription || description || '');
  if (ogImage) {
    setMetaTag('name', 'twitter:image', ogImage);
  }

  // 6. Canonical Link Tag
  if (canonicalUrl) {
    setLinkTag('canonical', canonicalUrl);
  } else if (typeof window !== 'undefined') {
    setLinkTag('canonical', window.location.origin + window.location.pathname);
  }

  // 7. Structured Data
  if (jsonLd) {
    setJsonLd(jsonLd);
  }
}
