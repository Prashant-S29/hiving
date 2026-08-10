import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { mockArticles } from "@/lib/mockArticles";
import type { ArticleBodyBlock } from "@/lib/types";

function loadLocalEnv() {
  if (!fs.existsSync(".env.local")) return;
  for (const rawLine of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (!process.env[key]) process.env[key] = value;
  }
}

loadLocalEnv();
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !dataset || !token) throw new Error("Sanity project, dataset, and Editor write token are required.");

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

async function migrateBody(body: ArticleBodyBlock[] | undefined) {
  if (!body) return undefined;
  const migrated: ArticleBodyBlock[] = [];

  for (const block of body) {
    const value = block as ArticleBodyBlock & { _type: string; src?: string; alt?: string };
    if (value._type !== "image" || !value.src) {
      migrated.push(block);
      continue;
    }

    const absolutePath = path.join(process.cwd(), "public", value.src.replace(/^\//, ""));
    if (!fs.existsSync(absolutePath)) {
      console.warn(`Skipping missing article image: ${value.src}`);
      continue;
    }

    const filename = path.basename(absolutePath);
    let assetId = await client.fetch<string | null>(
      '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id',
      { filename }
    );
    if (!assetId) {
      const asset = await client.assets.upload("image", fs.createReadStream(absolutePath), { filename });
      assetId = asset._id;
    }

    const { src: _removedSource, ...imageFields } = value;
    migrated.push({
      ...imageFields,
      asset: { _type: "reference", _ref: assetId },
    });
  }

  return migrated;
}

async function main() {
  let created = 0;
  let skipped = 0;
  for (const article of mockArticles) {
    const slug = article.slug.current;
    const existing = await client.fetch<string | null>('*[_type == "article" && slug.current == $slug][0]._id', { slug });
    const documentId = `article-${slug}`;
    if (existing === documentId) {
      console.log(`Skipped existing article: ${slug}`);
      skipped += 1;
      continue;
    }

    const body = await migrateBody(article.body);
    const { _id: _mockId, ...fields } = article;
    const document = {
      ...fields,
      _id: documentId,
      _type: "article",
      ...(body ? { body } : {}),
    };

    const transaction = client.transaction().create(document);
    if (existing) transaction.delete(existing);
    await transaction.commit();
    console.log(`${existing ? "Replaced private-ID" : "Created"} article: ${slug}`);
    created += 1;
  }

  console.log(`Article migration complete. Created: ${created}; skipped: ${skipped}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
