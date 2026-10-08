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

// Per-route <title>, meta description and robots (spec §5, §10 SEO). noindex is removed again when the
// page unmounts, so it never leaks onto the next route.
export function usePageMeta({ title, description, noindex = false }: PageMeta) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    if (description) metaTag('description').content = description;
  }, [description]);

  useEffect(() => {
    if (!noindex) return;
    const tag = metaTag('robots');
    tag.content = 'noindex';
    return () => tag.remove();
  }, [noindex]);
}
