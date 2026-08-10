"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { codeInput } from "@sanity/code-input";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

// Singleton documents are pinned to fixed IDs and edited in place.
const SINGLETON_TYPES = new Set([
  "aboutPage",
  "agentDiscoverPage",
  "agentPricingPage",
  "agentStorePage",
  "consultancyPage",
  "editorialSettings",
  "homepageHero",
  "manifestoPage",
  "notFoundPage",
  "privacyPage",
  "raceSettings",
  "siteSettings",
  "subscribePage",
  "termsPage",
]);

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  document: {
    actions: (previousActions, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? previousActions.filter(({ action }) => action !== "delete" && action !== "duplicate")
        : previousActions,
    newDocumentOptions: (previousOptions) =>
      previousOptions.filter(({ templateId }) => !SINGLETON_TYPES.has(templateId)),
  },
  plugins: [
    codeInput(),
    structureTool({
      structure: (S) =>
        S.list()
          .title("Hivig CMS")
          .items([
            S.listItem()
              .title("Website")
              .child(
                S.list()
                  .title("Website")
                  .items([
                    S.listItem()
                      .title("Site Settings")
                      .id("siteSettings")
                      .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
                    S.listItem()
                      .title("Homepage")
                      .id("homepageHero")
                      .child(S.document().schemaType("homepageHero").documentId("homepageHero")),
                    S.listItem()
                      .title("About")
                      .id("aboutPage")
                      .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
                    S.listItem()
                      .title("Manifesto")
                      .id("manifestoPage")
                      .child(S.document().schemaType("manifestoPage").documentId("manifestoPage")),
                    S.listItem()
                      .title("Agent Store")
                      .child(
                        S.list()
                          .title("Agent Store")
                          .items([
                            S.listItem()
                              .title("Store & Quote")
                              .id("agentStorePage")
                              .child(S.document().schemaType("agentStorePage").documentId("agentStorePage")),
                            S.listItem()
                              .title("Pricing")
                              .id("agentPricingPage")
                              .child(S.document().schemaType("agentPricingPage").documentId("agentPricingPage")),
                            S.listItem()
                              .title("Discover")
                              .id("agentDiscoverPage")
                              .child(S.document().schemaType("agentDiscoverPage").documentId("agentDiscoverPage")),
                          ])
                      ),
                    S.listItem()
                      .title("The Race")
                      .id("raceSettings")
                      .child(S.document().schemaType("raceSettings").documentId("raceSettings")),
                    S.listItem()
                      .title("Consultancy")
                      .id("consultancyPage")
                      .child(S.document().schemaType("consultancyPage").documentId("consultancyPage")),
                    S.listItem()
                      .title("Subscribe")
                      .id("subscribePage")
                      .child(S.document().schemaType("subscribePage").documentId("subscribePage")),
                    S.listItem()
                      .title("Legal")
                      .child(
                        S.list()
                          .title("Legal")
                          .items([
                            S.listItem()
                              .title("Privacy Policy")
                              .id("privacyPage")
                              .child(S.document().schemaType("privacyPage").documentId("privacyPage")),
                            S.listItem()
                              .title("Terms of Use")
                              .id("termsPage")
                              .child(S.document().schemaType("termsPage").documentId("termsPage")),
                          ])
                      ),
                    S.listItem()
                      .title("Not Found (404)")
                      .id("notFoundPage")
                      .child(S.document().schemaType("notFoundPage").documentId("notFoundPage")),
                    S.listItem()
                      .title("Pages")
                      .child(S.documentTypeList("page").title("Pages")),
                  ])
              ),
            S.listItem()
              .title("Editorial")
              .child(
                S.list()
                  .title("Editorial")
                  .items([
                    S.listItem()
                      .title("Editorial Settings")
                      .id("editorialSettings")
                      .child(S.document().schemaType("editorialSettings").documentId("editorialSettings")),
                    S.documentTypeListItem("article").title("Articles"),
                    S.documentTypeListItem("author").title("Authors"),
                    S.documentTypeListItem("articleType").title("Article Types"),
                    S.documentTypeListItem("industry").title("Industries"),
                    S.documentTypeListItem("platform").title("Platforms"),
                    S.documentTypeListItem("sourceCitation").title("Sources"),
                  ])
              ),
            S.listItem()
              .title("Race Data")
              .child(
                S.list()
                  .title("Race Data")
                  .items([
                    S.documentTypeListItem("aiModel").title("AI Models"),
                    S.documentTypeListItem("organization").title("Organizations"),
                    S.documentTypeListItem("benchmarkRecord").title("Benchmarks"),
                    S.documentTypeListItem("sourceCitation").title("Sources"),
                  ])
              ),
          ]),
    }),
    presentationTool({
      previewUrl: {
        initial: process.env.SANITY_STUDIO_PREVIEW_ORIGIN || "http://localhost:3000",
        previewMode: { enable: "/api/draft-mode/enable" },
      },
      resolve: {
        mainDocuments: [
          { route: "/intel/:slug", type: "article" },
          { route: "/race/models/:slug", type: "aiModel" },
        ],
        locations: {
          article: {
            select: { title: "title", slug: "slug.current" },
            resolve: (document) => ({
              locations: document?.slug
                ? [
                    { title: document.title || "Article", href: `/intel/${document.slug}` },
                    { title: "Intel archive", href: "/intel" },
                  ]
                : [{ title: "Intel archive", href: "/intel" }],
            }),
          },
          aiModel: {
            select: { title: "name", slug: "slug.current" },
            resolve: (document) => ({
              locations: document?.slug
                ? [
                    { title: document.title || "AI model", href: `/race/models/${document.slug}` },
                    { title: "The Race", href: "/race" },
                  ]
                : [{ title: "The Race", href: "/race" }],
            }),
          },
          raceSettings: { locations: [{ title: "The Race", href: "/race" }, { title: "Methodology", href: "/race/methodology" }] },
          editorialSettings: { locations: [{ title: "Intel archive", href: "/intel" }] },
        },
      },
    }),
  ],
});
