const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

export function getUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return UTM_KEYS.reduce<UtmParams>((acc, key) => {
    const value = params.get(key);
    if (value) acc[key] = value;
    return acc;
  }, {});
}