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
  types: {
    image: ({ value }) => {
      const url = urlForImage(value).width(1200).url();
      return (
        <div className="my-8 relative w-full aspect-[16/9]">
          <Image src={url} alt={value.alt || ""} fill className="object-cover" />
        </div>
      );
    },
    code: ({ value }) => (
      <pre>
        <code>{value?.code}</code>
      </pre>
    ),
  },
};
