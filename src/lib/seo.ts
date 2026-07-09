import { useEffect } from 'react';

// ── Per-route SEO for the SPA ────────────────────────────────────────────
// A tiny, dependency-free head manager. Build-time per-route HTML shells
// (scripts/gen-seo.mjs) give crawlers correct metadata WITHOUT running JS;
// this hook keeps the head correct during in-app client-side navigation so
// the title/description/canonical/OG/JSON-LD always match the current view.

export const SITE_URL = 'https://math10x.com';
export const SITE_NAME = 'Math10x';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og.png`;

export interface SeoOptions {
  title: string;
  description: string;
  /** Path only, e.g. "/trail/6.RP". Combined with SITE_URL for canonical/OG. */
  canonicalPath: string;
  image?: string;
  /** JSON-LD object(s) for this route. */
  jsonLd?: object | object[];
  noindex?: boolean;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Set document head for the current route. Reverts nothing on unmount beyond
 * removing any route-scoped JSON-LD it injected — the next route's useSeo call
 * overwrites the shared tags.
 */
export function useSeo(opts: SeoOptions) {
  const { title, description, canonicalPath, image = DEFAULT_OG_IMAGE, jsonLd, noindex } = opts;
  useEffect(() => {
    const url = SITE_URL + canonicalPath;
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex,follow' : 'index,follow');
    setLink('canonical', url);

    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', SITE_NAME);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);

    let ldEl: HTMLScriptElement | null = null;
    if (jsonLd) {
      ldEl = document.createElement('script');
      ldEl.type = 'application/ld+json';
      ldEl.dataset.routeLd = '1';
      ldEl.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(ldEl);
    }
    return () => {
      if (ldEl && ldEl.parentNode) ldEl.parentNode.removeChild(ldEl);
    };
  }, [title, description, canonicalPath, image, noindex, JSON.stringify(jsonLd)]);
}

/** A schema.org Course for a domain or a single lesson. */
export function courseJsonLd(name: string, description: string, url: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url,
    provider: {
      '@type': 'EducationalOrganization',
      name: SITE_NAME,
      url: SITE_URL + '/',
    },
  };
}

/** A schema.org BreadcrumbList from [{name, path}] items. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: SITE_URL + it.path,
    })),
  };
}
