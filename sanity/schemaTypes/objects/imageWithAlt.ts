import { defineField, defineType } from "sanity";

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "decorative",
      title: "Decorative image",
      type: "boolean",
      description: "Enable only when the image adds no information and should be ignored by screen readers.",
      initialValue: false,
    }),
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      hidden: ({ parent }) => parent?.decorative === true,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!(context.parent as { decorative?: boolean } | undefined)?.decorative && !value) {
            return "Alternative text is required unless the image is decorative";
          }
          return true;
        }),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({ name: "credit", title: "Credit", type: "string" }),
    defineField({ name: "sourceUrl", title: "Source URL", type: "url" }),
  ],
  preview: {
    select: { title: "alt", subtitle: "caption", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Decorative image",
      subtitle,
      media,
    }),
  },
});
