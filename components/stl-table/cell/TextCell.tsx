import React from "react";
import { TextCellProps } from "structured-table";
import { parseTableTextSegments } from "../link";

function TextWithLinks({ value, id }: { value: string; id: string }) {
    return parseTableTextSegments(value).map((segment, index) => {
        const key = `${id}-${index}`;
        if (segment.type === "text") return <React.Fragment key={key}>{segment.value}</React.Fragment>;

        return (
            <a
                href={segment.href}
                key={key}
                target={segment.newTab ? "_blank" : undefined}
                rel={segment.newTab ? "noopener noreferrer" : undefined}
            >
                {segment.text}
            </a>
        );
    });
}

const TextCell = React.memo(({ data }: { data: TextCellProps }) => {
    if (!Array.isArray(data.value)) {
        return <p><TextWithLinks id={data.uid} value={data.value} /></p>;
    }
    return (
        <p>
            {data.value.map((node) => {
                if (node.type === "string") return <TextWithLinks id={node.uid} key={node.uid} value={node.data} />;
                if (node.type === "html" && node.tag === "br") return <br key={node.uid} />;
                return null;
            })}
        </p>
    );
});
TextCell.displayName = "TextCell";

export { TextCell };
