import { defineField, defineType } from "sanity";

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "linkType",
      title: "Link type",
      type: "string",
      options: {
        list: [
          { title: "Internal website path", value: "internal" },
          { title: "External URL", value: "external" },
        ],
        layout: "radio",
      },
      initialValue: "internal",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "internalPath",
      title: "Website path",
      type: "string",
      description: "For example: /intel or /intel?category=deep-dive",
      hidden: ({ parent }) => parent?.linkType === "external",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.parent && (context.parent as { linkType?: string }).linkType !== "external") {
            if (!value) return "A website path is required";
            if (!value.startsWith("/")) return "Internal paths must start with /";
          }
          return true;
        }),
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
      hidden: ({ parent }) => parent?.linkType !== "external",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https", "mailto"] }).custom((value, context) => {
          if ((context.parent as { linkType?: string } | undefined)?.linkType === "external" && !value) {
            return "An external URL is required";
          }
          return true;
        }),
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in a new tab",
      type: "boolean",
      initialValue: false,
      hidden: ({ parent }) => parent?.linkType !== "external",
    }),
    defineField({
      name: "ariaLabel",
      title: "Accessibility label",
      type: "string",
      description: "Optional. Use when the visible label does not fully describe the destination.",
    }),
  ],
  preview: {
    select: {
      linkType: "linkType",
      internalPath: "internalPath",
      externalUrl: "externalUrl",
    },
    prepare: ({ linkType, internalPath, externalUrl }) => ({
      title: linkType === "external" ? externalUrl || "External link" : internalPath || "Internal link",
      subtitle: linkType === "external" ? "External" : "Internal",
    }),
  },
});
