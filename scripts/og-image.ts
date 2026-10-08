// Open Graph and Twitter images must be absolute URLs. index.html ships "/og.png"; production builds on
// Vercel rewrite it to https://{production host}/og.png. Previews keep the relative path, because the
// production host wouldn't serve a branch's new image yet. Pure, so it's tested.
const OG_IMAGE_ATTR = /(content=["'])\/og\.png(["'])/g;

export function absoluteOgImage(html: string, host: string): { html: string; replaced: number } {
  const clean = host.trim();
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(clean)) return { html, replaced: 0 };
  let replaced = 0;
  const out = html.replace(OG_IMAGE_ATTR, (_m, open: string, close: string) => {
    replaced += 1;
    return `${open}https://${clean}/og.png${close}`;
  });
  return { html: out, replaced };
}
