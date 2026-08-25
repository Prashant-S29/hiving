import { STL, type SanityTable, type TextCellProps } from "structured-table";

const LINK_TAG_PATTERN = /\[link\b[^\]]*\]/g;
const PROTECTED_LINK_TAG_PATTERN = /\[stl-inline-link\b/g;

function protectMixedContentLinks(source: string) {
  return source
    .split("\n")
    .map((line) =>
      line
        .split("|")
        .map((cell) => {
          const links = cell.match(LINK_TAG_PATTERN);
          if (!links) return cell;

          const textOutsideLinks = cell.replace(LINK_TAG_PATTERN, "").trim();
          return textOutsideLinks ? cell.replaceAll("[link", "[stl-inline-link") : cell;
        })
        .join("|"),
    )
    .join("\n");
}

function restoreLinkTags(cell: TextCellProps) {
  if (typeof cell.value === "string") {
    cell.value = cell.value.replace(PROTECTED_LINK_TAG_PATTERN, "[link");
    return;
  }

  cell.value = cell.value.map((node) =>
    node.type === "string"
      ? { ...node, data: node.data.replace(PROTECTED_LINK_TAG_PATTERN, "[link") }
      : node,
  );
}

/** Parses STL while preserving regular text placed beside links in the same cell. */
export function parseStructuredTable(source: string): SanityTable {
  const table = STL.parse(protectMixedContentLinks(source));
  const rows = [table.header, ...table.body, table.footer].filter((row) => row !== undefined);

  for (const row of rows) {
    for (const cell of row.cells) {
      if (cell.type === "text") restoreLinkTags(cell);
    }
  }

  return table;
}
