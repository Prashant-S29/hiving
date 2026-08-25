import { defineField, defineType } from "sanity";
import { StlTableInput } from "../../../components/stl-table/StlTableInput";

export const stlTableBlock = defineType({
  name: "stlTableBlock",
  title: "Structured Table",
  type: "object",
  icon: () => "📊",
  fields: [
    defineField({
      name: "stlString",
      title: "Table data",
      type: "string",
      description: "Structured Table Language (STL) source. Use the table editor below.",
    }),
    defineField({
      name: "stlParsed",
      title: "Parsed table data",
      type: "text",
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
  components: {
    input: StlTableInput,
  },
  preview: {
    select: {
      title: "caption",
      subtitle: "stlString",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Structured table",
        subtitle: subtitle || "Empty table",
      };
    },
  },
});
