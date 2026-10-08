import { useEffect } from 'react';

export type PageMeta = {
  title: string;
  description?: string;
  noindex?: boolean;
};

function metaTag(name: string): HTMLMetaElement {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = name;
    document.head.appendChild(tag);
  }
  return tag;
}

// index.html's own description, read once before any page overwrites it.
let originalDescription: string | null = null;
function defaultDescription(): string {
  if (originalDescription === null) {
    originalDescription = document.head.querySelector<HTMLMetaElement>('meta[name="description"]')?.content ?? '';
  }
  return originalDescription;
}

// Per-route <title>, meta description and robots (spec §5, §10 SEO). noindex is removed again and the
// description reset to index.html's when the page unmounts (or passes none), so neither leaks onto the
// next route (a priced / description on /terms).
export function usePageMeta({ title, description, noindex = false }: PageMeta) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    const fallback = defaultDescription();
    metaTag('description').content = description || fallback;
    return () => {
      metaTag('description').content = fallback;
    };
  }, [description]);

  useEffect(() => {
    if (!noindex) return;
    const tag = metaTag('robots');
    tag.content = 'noindex';
    return () => tag.remove();
  }, [noindex]);
}
