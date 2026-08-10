import { defineArrayMember, defineField, defineType } from "sanity";

const formFields = [
  defineField({ name: "namePlaceholder", title: "Name placeholder", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "emailPlaceholder", title: "Email placeholder", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "companyPlaceholder", title: "Company placeholder", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "messagePlaceholder", title: "Message placeholder", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "consentPrefix", title: "Consent text before privacy link", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "privacyLabel", title: "Privacy link label", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "consentSuffix", title: "Consent text after privacy link", type: "string" }),
  defineField({ name: "submitLabel", title: "Submit button", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "submittingLabel", title: "Submitting label", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "successMessage", title: "Success message", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "errorMessage", title: "Error message", type: "string", validation: (Rule) => Rule.required() }),
];

export const consultancyPage = defineType({
  name: "consultancyPage",
  title: "Consultancy",
  type: "document",
  groups: [
    { name: "landing", title: "Landing Page", default: true },
    { name: "enquiry", title: "Enquiry Page" },
    { name: "form", title: "Enquiry Form" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", group: "landing", validation: (Rule) => Rule.required() }),
    defineField({ name: "heading", title: "Heading", type: "string", group: "landing", validation: (Rule) => Rule.required() }),
    defineField({ name: "headingEmphasis", title: "Italic emphasis", type: "string", group: "landing", validation: (Rule) => Rule.required() }),
    defineField({ name: "introduction", title: "Introduction", type: "text", rows: 5, group: "landing", validation: (Rule) => Rule.required() }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      group: "landing",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({ name: "ctaHeading", title: "CTA heading", type: "string", group: "landing", validation: (Rule) => Rule.required() }),
    defineField({ name: "ctaBody", title: "CTA body", type: "text", rows: 3, group: "landing", validation: (Rule) => Rule.required() }),
    defineField({ name: "ctaAction", title: "CTA action", type: "callToAction", group: "landing", validation: (Rule) => Rule.required() }),
    defineField({ name: "enquiryEyebrow", title: "Eyebrow", type: "string", group: "enquiry", validation: (Rule) => Rule.required() }),
    defineField({ name: "enquiryHeadingLineOne", title: "Heading line one", type: "string", group: "enquiry", validation: (Rule) => Rule.required() }),
    defineField({ name: "enquiryHeadingLineTwo", title: "Heading line two", type: "string", group: "enquiry", validation: (Rule) => Rule.required() }),
    defineField({ name: "enquiryHeadingEmphasis", title: "Italic emphasis", type: "string", group: "enquiry", validation: (Rule) => Rule.required() }),
    defineField({ name: "enquiryIntroduction", title: "Introduction", type: "text", rows: 5, group: "enquiry", validation: (Rule) => Rule.required() }),
    defineField({ name: "enquiryFormCaption", title: "Form caption", type: "string", group: "enquiry", validation: (Rule) => Rule.required() }),
    defineField({ name: "formCopy", title: "Form copy", type: "object", group: "form", fields: formFields, validation: (Rule) => Rule.required() }),
    defineField({ name: "seo", title: "Consultancy SEO", type: "seo", group: "seo", validation: (Rule) => Rule.required() }),
    defineField({ name: "enquirySeo", title: "Enquiry SEO", type: "seo", group: "seo", validation: (Rule) => Rule.required() }),
  ],
  preview: { prepare: () => ({ title: "Consultancy", subtitle: "Landing page, enquiry page and form" }) },
});
