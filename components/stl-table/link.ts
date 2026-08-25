const SAFE_LINK_PATTERN = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#|\?)/i;
const BARE_DOMAIN_PATTERN = /^(?:www\.)?[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,}(?:[/:?#].*)?$/i;
const INLINE_LINK_PATTERN = /\[link\b([^\]]*)\]/g;
const LINK_ATTRIBUTE_PATTERN = /(\w+)="(.*?)"/g;

export type TableTextSegment =
  | { type: "text"; value: string }
  | { type: "link"; text: string; href: string; newTab: boolean };

/** Returns a browser-safe table link, adding https:// to bare domains. */
export function normalizeTableLinkHref(value: string) {
  const href = value.trim();
  if (SAFE_LINK_PATTERN.test(href)) return href;
  if (BARE_DOMAIN_PATTERN.test(href)) return `https://${href}`;
  return null;
}

/** Splits a text cell into plain text and inline STL link segments. */
export function parseTableTextSegments(value: string): TableTextSegment[] {
  const segments: TableTextSegment[] = [];
  let previousEnd = 0;
  INLINE_LINK_PATTERN.lastIndex = 0;

  for (const match of value.matchAll(INLINE_LINK_PATTERN)) {
    const start = match.index;
    if (start > previousEnd) segments.push({ type: "text", value: value.slice(previousEnd, start) });

    const attributes = new Map<string, string>();
    LINK_ATTRIBUTE_PATTERN.lastIndex = 0;
    for (const attribute of match[1].matchAll(LINK_ATTRIBUTE_PATTERN)) {
      attributes.set(attribute[1], attribute[2]);
    }

    const text = attributes.get("text") ?? "";
    const href = normalizeTableLinkHref(attributes.get("href") ?? "");
    if (text && href) {
      segments.push({
        type: "link",
        text,
        href,
        newTab: attributes.get("newTab")?.toLowerCase() === "true",
      });
    } else {
      segments.push({ type: "text", value: text || match[0] });
    }

    previousEnd = start + match[0].length;
  }

  if (previousEnd < value.length) segments.push({ type: "text", value: value.slice(previousEnd) });
  return segments.length ? segments : [{ type: "text", value }];
}
