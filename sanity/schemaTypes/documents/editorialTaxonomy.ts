import { defineArrayMember, defineField, defineType } from "sanity";

const activeSortFields = [
  defineField({ name: "sortOrder", title: "Sort order", type: "number", initialValue: 100, validation: (Rule) => Rule.required().integer().min(0) }),
  defineField({ name: "active", title: "Active", type: "boolean", initialValue: true, validation: (Rule) => Rule.required() }),
];

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: "role", title: "Role / title", type: "string" }),
    defineField({ name: "biography", title: "Short biography", type: "text", rows: 5 }),
    defineField({ name: "portrait", title: "Portrait", type: "imageWithAlt" }),
    defineField({ name: "credentials", title: "Credentials", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "profileLinks", title: "Profile links", type: "array", of: [defineArrayMember({ type: "link" })] }),
    defineField({ name: "active", title: "Active", type: "boolean", initialValue: true, validation: (Rule) => Rule.required() }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "portrait.image" } },
});

export const articleType = defineType({
  name: "articleType",
  title: "Article Type",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Public name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "value",
      title: "Stable value",
      type: "string",
      description: "Used in filter URLs and controlled frontend styling.",
      options: { list: [
        { title: "Deep Dive", value: "deep-dive" },
        { title: "How-To Guide", value: "how-to" },
        { title: "Watchdog Report", value: "watchdog" },
        { title: "Opinion", value: "opinion" },
        { title: "Fact-Checked Analysis", value: "verify" },
      ] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "accent", title: "Accent", type: "string", options: { list: ["signal", "verify", "amber"] }, validation: (Rule) => Rule.required() }),
    ...activeSortFields,
  ],
  preview: { select: { title: "name", value: "value", active: "active" }, prepare: ({ title, value, active }) => ({ title, subtitle: `${value || "no value"}${active === false ? " · inactive" : ""}` }) },
});

export const industry = defineType({
  name: "industry",
  title: "Industry",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Public name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "value", title: "Stable value", type: "string", description: "Stable machine value used by article queries.", validation: (Rule) => Rule.required().regex(/^[a-z0-9-]+$/) }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    ...activeSortFields,
  ],
  preview: { select: { title: "name", subtitle: "value" } },
});

export const platform = defineType({
  name: "platform",
  title: "Platform",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Public name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "website", title: "Website", type: "url" }),
    defineField({ name: "logo", title: "Logo", type: "imageWithAlt" }),
    ...activeSortFields,
  ],
  preview: { select: { title: "name", subtitle: "website", media: "logo.image" } },
});
