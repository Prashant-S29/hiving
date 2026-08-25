import React from "react";
import { LinkCellProps } from "structured-table";
import { normalizeTableLinkHref } from "../link";

const LinkCell = React.memo(({ data }: { data: LinkCellProps }) => {
    const href = normalizeTableLinkHref(data.href) ?? "#";
    // The STL parser currently returns this attribute as a string at runtime.
    const opensInNewTab = data.newTab === true || String(data.newTab).toLowerCase() === "true";

    return (
        <a
            href={href}
            target={opensInNewTab ? "_blank" : undefined}
            rel={opensInNewTab ? "noopener noreferrer" : undefined}
        >
            {data.text}
        </a>
    )
})
LinkCell.displayName = "LinkCell";

export { LinkCell };