# Hivig — Web Platform

Hi-Tech Vigilance for the Agentic Age. This is the Next.js + Sanity codebase
for hivig.com, scoped to the Phase 1 MVP: a content publishing platform
(Intel), the Manifesto, About, Subscribe, a Consultancy teaser, and the
supporting legal pages.

This README is written for a non-developer to follow step by step. Every
command below is meant to be copy-pasted exactly as written.

---

## What's in this MVP (and what isn't, on purpose)

**In scope:** Home, Intel (article index + article template), Manifesto,
About, Subscribe, Consultancy (single teaser page), Legal pages, and the
Sanity Studio CMS embedded at `/studio`.

**Deliberately out of scope for this MVP**, per the phased roadmap: the
Industry Hub, Business Problem Hub, Workflow Library, Model Intelligence,
Agent Registry, Vendor Intelligence, Tools, Contributor Network, and
Comparisons. These come in Phase 2 once the content base and contributor
network are real. Building them now, empty, would undercut the trust this
platform is meant to establish.

---

## Step 1 — Local setup

You need [Node.js](https://nodejs.org) version 18 or higher installed.
Check with:

```
node -v
```

Then, inside this folder:

```
npm install
```

This will take a couple of minutes the first time.

---

## Step 2 — Create your Sanity project (the CMS)

Sanity is free for a single-user project at this scale. Run:

```
npx create-sanity@latest --project-plan free
```

When it asks questions, choose: create a new project, name it "Hivig",
use the **production** dataset, and when it asks about a template, choose
**"Clean project with no predefined schemas"** — this project already has
the Article schema built in under `sanity/schemaTypes`.

This command will print a **Project ID**. Copy it.

---

## Step 3 — Set your environment variables

Copy the example file:

```
cp .env.local.example .env.local
```

Open `.env.local` and paste in your Sanity Project ID:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

---

## Step 4 — Run it locally

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the full
site rendering with sample placeholder articles, so it looks complete even
before you've published anything real.

Open [http://localhost:3000/studio](http://localhost:3000/studio) — this is
your content editor. Log in with the same account you used to create the
Sanity project. This is where you and anyone on your team will write and
publish articles.

The moment you publish a real article in the Studio, it replaces the
placeholder content on the live site automatically — no code changes
needed.

---

## Step 5 — Deploy to Vercel

Push this folder to a GitHub repository, then:

1. Go to [vercel.com/new](https://vercel.com/new) and import that repository.
2. When it asks for environment variables, add the same three
   `NEXT_PUBLIC_SANITY_*` values from your `.env.local` file.
3. Click Deploy.

Vercel will give you a `.vercel.app` URL first. Once that works correctly,
go to your Vercel project's Domains settings and add **hivig.com**. Vercel
will give you DNS records (usually an A record and a CNAME) — add those at
your domain registrar, wherever hivig.com is currently registered. DNS
changes can take anywhere from a few minutes to a few hours to propagate.

---

## Step 6 — Publish your launch articles

Aim for eight to twelve articles live before announcing publicly, so the
site has real substance on day one. Use the Studio at `/studio` to write
them. Every article needs: a title, a slug, an article type (Deep Dive,
How-To, Watchdog, Opinion, or Fact-Checked), an industry tag, a one or two
sentence deck, the body content, an author, an estimated read time, and a
publish date. Mark up to four articles as "Featured" so they appear in the
homepage's lead section.

---

## Editing the homepage hero (no code, no developer)

Go to `/studio` → **Homepage Hero** in the sidebar (it's pinned above the
Articles list — there's only ever one Homepage Hero document, so you can't
accidentally create a second one). You can change:

- **Eyebrow label** — the small line above the headline.
- **Hero style** — `Interactive animation` (the default: an animated,
  clickable "choose your path" picker), `Image`, or `Video`. Picking Image or
  Video reveals an upload field for that media; the same choice cards still
  render on top of it.
- **Choice cards** (up to 4) — each has a label, a one-line description, a
  link (e.g. `/race`, `/agents`, or a full URL), and an accent color
  (`signal` red / `verify` green / `amber` gold, matching the rest of the
  site's palette).

Publish, and it's live — no redeploy needed. If no Homepage Hero document
exists yet (e.g. fresh Sanity project), the site falls back to sensible
placeholder content defined in `lib/mockHero.ts`, so the homepage never
breaks while you're setting this up.

One thing that is **not** editable from the Studio: the actual motion of the
interactive animation (the particle/constellation effect) is built into the
code. What IS editable is everything it displays — labels, links, colors.

## Light / dark mode

There's a toggle (☾ / ☀) in the top-right of the nav. It's site-wide, applies
instantly, and remembers the visitor's choice. Dark is the default brand
look; light is the alternate. This isn't something to edit per-page — if you
want to adjust either theme's exact colors, that's a single edit in
`app/globals.css`'s `:root[data-theme="light"]` (or the default block above
it for dark) — every page and component updates together automatically.

---

## What still needs a decision before full launch

**Email delivery for Subscribe.** The subscribe form currently logs
submissions on the server but doesn't send anything anywhere yet. Open
`app/api/subscribe/route.ts` and wire in an email provider — Resend,
ConvertKit, and Beehiiv are all good fits for a publication like this and
each has a simple API.

**Legal pages.** `app/legal/privacy/page.tsx` and `app/legal/terms/page.tsx`
are clearly marked placeholders. Get real privacy and terms copy reviewed
by counsel before public launch.

**Images.** The current build is intentionally text-and-typography led, the
same way the original design was. If you want hero images on articles, add
them directly in the Sanity Studio — the schema already supports it.

---

## Project structure, if you bring in a developer

```
app/              — every page and route (Next.js App Router)
components/       — shared UI: Nav, Footer, article cards, ticker, cursor
lib/sanity/       — the CMS client, image helper, and content queries
lib/types.ts      — shared TypeScript types and tag styling
sanity/           — the CMS schema (Article content type)
sanity.config.ts  — the Sanity Studio configuration, embedded at /studio
```

---

Hivig™ — Trademark Class 42, India. Naganarai Media Tech Private Limited.
