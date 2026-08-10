import { defineField, defineType } from "sanity";

export const sectionSettings = defineType({
  name: "sectionSettings",
  title: "Section appearance",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "enabled", title: "Show this section", type: "boolean", initialValue: true }),
    defineField({
      name: "theme",
      title: "Background",
      type: "string",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Surface", value: "surface" },
          { title: "Paper", value: "paper" },
          { title: "Deep", value: "deep" },
        ],
      },
      initialValue: "default",
    }),
    defineField({
      name: "width",
      title: "Content width",
      type: "string",
      options: { list: ["narrow", "content", "full"] },
      initialValue: "content",
    }),
    defineField({
      name: "spacing",
      title: "Vertical spacing",
      type: "string",
      options: { list: ["compact", "normal", "large"] },
      initialValue: "normal",
    }),
  ],
});
