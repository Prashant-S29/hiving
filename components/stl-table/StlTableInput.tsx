"use client";

import { LinkIcon } from "@sanity/icons";
import { Box, Button, Card, Checkbox, Dialog, Flex, Label, Stack, Text, TextArea, TextInput } from "@sanity/ui";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ObjectInputProps, PatchEvent, set, unset } from "sanity";
import type { SanityTable } from "structured-table";
import { normalizeTableLinkHref } from "./link";
import { parseStructuredTable } from "./parse";
import TableView from "./table/TableView";

type TableBlockValue = {
  _type?: string;
  stlString?: string;
  stlParsed?: string;
  caption?: string;
};

type Selection = {
  start: number;
  end: number;
};

function escapeAttribute(value: string) {
  return value.replaceAll('"', "'").replaceAll("\n", " ");
}

export function StlTableInput(props: ObjectInputProps<TableBlockValue>) {
  const { value, onChange, onPathFocus, readOnly } = props;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const selectionRef = useRef<Selection>({ start: 0, end: 0 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [href, setHref] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const stlString = value?.stlString ?? "";

  const tableData = useMemo<SanityTable | null>(() => {
    try {
      if (stlString) return parseStructuredTable(stlString);
      if (value?.stlParsed) return JSON.parse(value.stlParsed) as SanityTable;
      return null;
    } catch {
      return null;
    }
  }, [stlString, value?.stlParsed]);

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const nextValue = event.currentTarget.value;
      if (!nextValue) {
        onChange(PatchEvent.from([unset(["stlString"]), unset(["stlParsed"])]));
        return;
      }

      let parsedJson: string | undefined;
      try {
        parsedJson = JSON.stringify(parseStructuredTable(nextValue));
      } catch {
        parsedJson = undefined;
      }

      onChange(
        PatchEvent.from([
          set(nextValue, ["stlString"]),
          parsedJson ? set(parsedJson, ["stlParsed"]) : unset(["stlParsed"]),
        ]),
      );
    },
    [onChange],
  );

  const handleCaptionChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const caption = event.currentTarget.value;
      onChange(caption ? PatchEvent.from(set(caption, ["caption"])) : PatchEvent.from(unset(["caption"])));
    },
    [onChange],
  );

  const openLinkDialog = () => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? stlString.length;
    const end = textarea?.selectionEnd ?? start;
    const selectedText = stlString.slice(start, end).trim();

    selectionRef.current = { start, end };
    setLinkText(selectedText && !/[|\n\[\]]/.test(selectedText) ? selectedText : "");
    setHref("");
    setOpenInNewTab(true);
    setDialogOpen(true);
  };

  const closeLinkDialog = () => setDialogOpen(false);
  const normalizedHref = normalizeTableLinkHref(href);

  const insertLink = () => {
    const label = linkText.trim();
    if (!label || !normalizedHref) return;

    const start = Math.min(selectionRef.current.start, stlString.length);
    const end = Math.min(Math.max(selectionRef.current.end, start), stlString.length);
    const link = `[link text="${escapeAttribute(label)}" href="${escapeAttribute(normalizedHref)}"${openInNewTab ? ' newTab="true"' : ""}]`;
    const nextValue = `${stlString.slice(0, start)}${link}${stlString.slice(end)}`;
    const parsedJson = JSON.stringify(parseStructuredTable(nextValue));

    onChange(
      PatchEvent.from([
        set(nextValue, ["stlString"]),
        set(parsedJson, ["stlParsed"]),
      ]),
    );
    setDialogOpen(false);

    requestAnimationFrame(() => {
      const nextCursorPosition = start + link.length;
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(nextCursorPosition, nextCursorPosition);
    });
  };

  const hasTableContent = Boolean(
    tableData &&
      ((tableData.header?.cells.length ?? 0) > 0 || tableData.body.length > 0 || (tableData.footer?.cells.length ?? 0) > 0),
  );

  return (
    <Stack space={4}>
      <Card border padding={3} radius={2} tone="transparent">
        <Flex align="center" gap={3} justify="space-between" wrap="wrap">
          <Box flex={1}>
            <Text size={1} weight="semibold">
              Hyperlinks
            </Text>
            <Text muted size={1} style={{ marginTop: 6 }}>
              Place the cursor where the link should appear, or select text to turn it into a hyperlink.
            </Text>
          </Box>
          <Button
            disabled={readOnly}
            icon={LinkIcon}
            mode="ghost"
            onClick={openLinkDialog}
            text="Add hyperlink"
            tone="primary"
          />
        </Flex>
      </Card>

      <Card border padding={0}>
        <TextArea
          onChange={handleTextChange}
          onFocus={() => onPathFocus(["stlString"])}
          placeholder={'[header]\nColumn 1 | Column 2\n[body]\nValue 1 | Value 2'}
          readOnly={readOnly}
          ref={textareaRef}
          rows={10}
          style={{ fontFamily: "monospace", fontSize: "0.9em" }}
          value={stlString}
        />
      </Card>

      <Card border padding={3} radius={2} tone="transparent">
        <Stack space={3}>
          <Text muted size={1} weight="bold">
            Live Preview
          </Text>
          {hasTableContent && tableData ? (
            <TableView className="border" data={tableData} />
          ) : (
            <Text muted size={1}>
              Start with a [header] or [body] section to see the table preview.
            </Text>
          )}
        </Stack>
      </Card>

      <Stack space={2}>
        <Label htmlFor="stl-table-caption" size={1}>
          Caption
        </Label>
        <TextInput
          id="stl-table-caption"
          onChange={handleCaptionChange}
          onFocus={() => onPathFocus(["caption"])}
          placeholder="Enter table caption..."
          readOnly={readOnly}
          value={value?.caption ?? ""}
        />
      </Stack>

      {dialogOpen && (
        <Dialog
          footer={
            <Flex gap={2} justify="flex-end" padding={3}>
              <Button mode="ghost" onClick={closeLinkDialog} text="Cancel" />
              <Button
                disabled={!linkText.trim() || !normalizedHref}
                icon={LinkIcon}
                onClick={insertLink}
                text="Insert hyperlink"
                tone="primary"
              />
            </Flex>
          }
          header="Add hyperlink to table"
          id="stl-table-link-dialog"
          onClickOutside={closeLinkDialog}
          onClose={closeLinkDialog}
          width={1}
        >
          <Stack padding={4} space={4}>
            <Stack space={2}>
              <Label htmlFor="stl-table-link-text" size={1}>
                Link text
              </Label>
              <TextInput
                autoFocus
                id="stl-table-link-text"
                onChange={(event) => setLinkText(event.currentTarget.value)}
                placeholder="Read the report"
                value={linkText}
              />
            </Stack>

            <Stack space={2}>
              <Label htmlFor="stl-table-link-url" size={1}>
                URL
              </Label>
              <TextInput
                id="stl-table-link-url"
                onChange={(event) => setHref(event.currentTarget.value)}
                placeholder="https://example.com or /internal-page"
                value={href}
              />
              {href && !normalizedHref && (
                <Card padding={2} radius={2} tone="critical">
                  <Text size={1}>
                    Enter an http:// or https:// URL, email link, phone link, anchor, or internal path beginning with /.
                  </Text>
                </Card>
              )}
            </Stack>

            <Flex align="center" gap={2}>
              <Checkbox
                checked={openInNewTab}
                id="stl-table-link-new-tab"
                onChange={(event) => setOpenInNewTab(event.currentTarget.checked)}
              />
              <Label htmlFor="stl-table-link-new-tab" size={1}>
                Open in a new tab
              </Label>
            </Flex>
          </Stack>
        </Dialog>
      )}
    </Stack>
  );
}
