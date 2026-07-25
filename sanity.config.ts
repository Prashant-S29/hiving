"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

// homepageHero is a singleton — there's only ever one, at a fixed document
// ID, edited in place. The structure below gives it its own pinned entry in
// the Studio sidebar instead of showing it as a list you could add more to.
const SINGLETON_TYPES = new Set(["homepageHero"]);

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Homepage Hero")
              .id("homepageHero")
              .child(S.document().schemaType("homepageHero").documentId("homepageHero")),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => !SINGLETON_TYPES.has(listItem.getId() ?? "")
            ),
          ]),
    }),
  ],
});
