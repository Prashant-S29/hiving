import type { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";

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
      // Real Sanity-uploaded images carry an `asset` ref — go through the
      // CDN URL builder as before. Locally-added images (e.g. article
      // infographics shipped as static files in public/) instead carry a
      // plain `src` string and render as-is, unrecropped, since they're
      // often diagrams where cropping to 16:9 would cut off content.
      if (value?.asset) {
        const url = urlForImage(value).width(1200).url();
        return (
          <div className="my-8 relative w-full aspect-[16/9]">
            <Image src={url} alt={value.alt || ""} fill className="object-cover" />
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
  },
};
