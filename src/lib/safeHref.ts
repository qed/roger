// URL checks for config-supplied links and images (spec §8.1: a slot whose config is unusable hides).
// Framework-free and tested.

// A same-origin path: starts with one "/" (not "//" or "/\", which browsers read as another host).
export function sameOriginPath(value: string | null | undefined): string | null {
  const v = (value ?? '').trim();
  return /^\/(?![/\\])/.test(v) ? v : null;
}

// An endorsement logo: same-origin only; anything else renders no image.
export function endorsementLogoSrc(logo: string | null | undefined): string | null {
  return sameOriginPath(logo);
}

// The /workshops host pack (§6B.5): a same-origin path or an https:// URL with a host; anything else
// (http, javascript:, data:, protocol-relative, whitespace inside) hides the section.
export function hostPackHref(value: string | null | undefined): string | null {
  const v = (value ?? '').trim();
  if (/\s/.test(v)) return null;
  if (sameOriginPath(v)) return v;
  return /^https:\/\/[^/\\]/i.test(v) ? v : null;
}
