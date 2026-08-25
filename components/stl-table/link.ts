const SAFE_LINK_PATTERN = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#|\?)/i;
const BARE_DOMAIN_PATTERN = /^(?:www\.)?[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,}(?:[/:?#].*)?$/i;

/** Returns a browser-safe table link, adding https:// to bare domains. */
export function normalizeTableLinkHref(value: string) {
  const href = value.trim();
  if (SAFE_LINK_PATTERN.test(href)) return href;
  if (BARE_DOMAIN_PATTERN.test(href)) return `https://${href}`;
  return null;
}
