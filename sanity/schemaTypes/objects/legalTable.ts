import { defineArrayMember, defineField, defineType } from "sanity";

export const legalTable = defineType({
  name: "legalTable",
  title: "Table",
  type: "object",
  fields: [
    defineField({
      name: "headers",
      title: "Column headers",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "cells",
              title: "Cells",
              type: "array",
              of: [defineArrayMember({ type: "text", rows: 2 })],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: { cells: "cells" },
            prepare: ({ cells }) => ({ title: Array.isArray(cells) ? cells.join(" · ") : "Table row" }),
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { headers: "headers", rows: "rows" },
    prepare: ({ headers, rows }) => ({
      title: Array.isArray(headers) ? headers.join(" · ") : "Table",
      subtitle: `${Array.isArray(rows) ? rows.length : 0} rows`,
    }),
  },
});
