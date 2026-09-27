import type { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import { STLReact } from "@/components/stl-table";
import { parseStructuredTable } from "@/components/stl-table/parse";
import type { SanityTable } from "structured-table";

// Sanity encodes an asset's real pixel dimensions directly in its _ref, e.g.
// "image-f21a30f0...-1000x760-svg" — no extra GROQ projection needed to read
// them. Used to size each image's box to its own aspect ratio instead of
// force-cropping every image (of any shape) into a fixed 16:9 box.
function getAssetDimensions(assetRef: string | undefined): { width: number; height: number } | null {
  const match = assetRef?.match(/-(\d+)x(\d+)-/);
  if (!match) return null;
  return { width: Number(match[1]), height: Number(match[2]) };
}

export const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    normal: ({ children }) => <p>{children}</p>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const isExternal = /^https?:\/\//.test(href);
      return (
        <a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}>
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (value?.asset) {
        const url = urlForImage(value).width(1200).url();
        // Next's Image Optimization API rejects SVG sources by default (400
        // response) as an XSS guard — irrelevant here anyway, since resizing
        // a vector image through a raster pipeline has no benefit. Skip
        // optimization for SVGs rather than relaxing that guard site-wide.
        const isSvg = /\.svg(\?|$)/i.test(url);
        // Size the box to the image's own aspect ratio rather than a fixed
        // 16:9 — these are diagrams/screenshots where cropping cuts off
        // real content (labels, boxes), not photos where a uniform crop is
        // fine. Falls back to 16:9 only if the ref's dimensions can't be
        // parsed (shouldn't happen for a Sanity-hosted asset).
        const dimensions = getAssetDimensions(value.asset?._ref);
        const aspectRatio = dimensions ? `${dimensions.width} / ${dimensions.height}` : "16 / 9";
        return (
          <div className="my-8 relative w-full" style={{ aspectRatio }}>
            <Image src={url} alt={value.alt || ""} fill className="object-contain" unoptimized={isSvg} />
          </div>
        );
      }
      if (value?.src) {
        return (
          <img src={value.src} alt={value.alt || ""} className="my-8 w-full h-auto" />
        );
      }
      return null;
    },
    code: ({ value }) => (
      <pre>
        <code>{value?.code}</code>
      </pre>
    ),
    stlTableBlock: ({ value }) => {
      const tableValue = value as {
        _key: string;
        _type: string;
        stlString?: string;
        stlParsed?: string;
        caption?: string;
      };

      let tableData: SanityTable | null = null;
      try {
        if (tableValue.stlString) {
          tableData = parseStructuredTable(tableValue.stlString);
        } else if (tableValue.stlParsed) {
          tableData = JSON.parse(tableValue.stlParsed) as SanityTable;
        }
      } catch {
        return null;
      }

      if (!tableData) return null;
      if (tableValue.caption) tableData.caption = tableValue.caption;

      return (
        <div className="overflow-x-auto my-8">
          <STLReact.Table data={tableData} className="border" />
        </div>
      );
    },
  },
};