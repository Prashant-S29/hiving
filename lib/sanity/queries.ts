export const allArticlesQuery = `*[_type == "article"] | order(publishedAt desc) {
  _id, title, slug, tagType, industryTag, deck, heroImage, author,
  readTimeMinutes, publishedAt, platformTags, featured
}`;

export const featuredArticlesQuery = `*[_type == "article" && featured == true] | order(publishedAt desc)[0...4] {
  _id, title, slug, tagType, industryTag, deck, heroImage, author,
  readTimeMinutes, publishedAt, platformTags
}`;

export const latestArticlesQuery = `*[_type == "article"] | order(publishedAt desc)[0...5] {
  _id, title, slug, tagType, industryTag, deck, heroImage, author,
  readTimeMinutes, publishedAt, platformTags
}`;

export const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0] {
  _id, title, slug, tagType, industryTag, deck, heroImage, body, author,
  readTimeMinutes, publishedAt, platformTags, metaTitle, metaDescription
}`;

export const allSlugsQuery = `*[_type == "article"]{ "slug": slug.current }`;

export const homepageHeroQuery = `*[_type == "homepageHero"][0]{
  eyebrow, mediaType, heroImage, "heroVideoUrl": heroVideo.asset->url, choices
}`;
