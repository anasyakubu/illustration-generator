import { useEffect } from 'react';

interface SeoOptions {
  title?: string;
  description?: string;
}

/**
 * Tiny runtime SEO helper — sets <title> and meta description on mount.
 * Index.html still ships the canonical defaults for crawlers that don't run JS.
 */
export function useSeo({ title, description }: SeoOptions): void {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      const tag = document.querySelector(
        'meta[name="description"]',
      ) as HTMLMetaElement | null;
      if (tag) tag.content = description;
    }
  }, [title, description]);
}
