import Link from "next/link";
import type { CmsLink as CmsLinkValue } from "@/lib/sanity/siteSettings";

export default function CmsLink({
  link,
  className,
  children,
}: {
  link: Pick<CmsLinkValue, "href" | "openInNewTab" | "ariaLabel">;
  className?: string;
  children: React.ReactNode;
}) {
  const external = /^https?:\/\//.test(link.href) || link.href.startsWith("mailto:");
  const openInNewTab = external && link.openInNewTab;

  return (
    <Link
      href={link.href}
      className={className}
      aria-label={link.ariaLabel}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
    >
      {children}
    </Link>
  );
}
