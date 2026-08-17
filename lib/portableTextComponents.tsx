import type { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import { STLReact } from "@/components/stl-table";
import { STL, type SanityTable } from "structured-table";

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
        if (tableValue.stlParsed) {
          tableData = JSON.parse(tableValue.stlParsed) as SanityTable;
        } else if (tableValue.stlString) {
          tableData = STL.parse(tableValue.stlString);
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