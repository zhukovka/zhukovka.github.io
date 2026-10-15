# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run develop      # start dev server at http://localhost:8000
npm run build        # production build
npm run serve        # serve the production build locally
npm run clean        # clear .cache and public directories (run when builds behave strangely)
npm run typecheck    # TypeScript type check without emitting
```

There is no test suite configured yet.

Use `npm`: `package-lock.json` is the lockfile (the `packageManager` field in `package.json` mentions pnpm, but there is no pnpm lockfile).

`src/gatsby-types.d.ts` is generated and git-ignored. On a fresh clone, run `npm run develop` or `npm run build` once before `npm run typecheck`, or the `Queries.*` types will be missing.

## Architecture

This is a **Gatsby 5** blog built with TypeScript, React 19, Tailwind CSS 4 and MDX.

The visual language is documented in **`DESIGN.md`** (tokens, type scale, components, post body rules). Read it before changing styles, and keep it in sync with `src/styles/global.css`.

**Key config files:**
- `gatsby-config.mjs`: plugin registration and site metadata. It is ESM because `rehype-pretty-code` and `remark-gfm` are ESM-only. GraphQL typegen is enabled, so types are generated into `src/gatsby-types.d.ts` on `develop`/`build` and exposed as the global `Queries` namespace.
- `gatsby-node.ts`: declares the optional `tag` and `read` MDX frontmatter fields so queries stay valid when no post sets them.
- `gatsby-browser.js`: imports `src/styles/global.css` (the Tailwind entry point).
- `postcss.config.js` + `gatsby-plugin-postcss`: wires Tailwind into the Gatsby build.
- `tailwind.config.js` is a leftover and is not used: Tailwind 4 is configured in CSS.

**Styling:** Tailwind CSS 4, configured in CSS. `src/styles/global.css` holds the Google Fonts import, the `@theme` design tokens (colours, fonts, tracking, container width), the `bg-dots` and `bg-hatch` utilities, and the `.post-body` rules for MDX content (headings, serif body text, code blocks, tables). Style components with Tailwind utilities generated from those tokens (`bg-paper`, `text-ink-soft`, `border-line`, `font-mono`, `font-serif`, `tracking-display`, `max-w-page`). Do not hard-code hex values or font names. No CSS Modules or styled-components.

**Pages:** File-system routing under `src/pages/`. Each file exports a default React component and optionally a named `Head` export for `<head>` metadata (Gatsby Head API).
- `index.tsx`: home (hero, topic filter, post list, newsletter)
- `blog/index.tsx`: the post list at `/blog`
- `blog/{mdx.frontmatter__slug}.tsx`: file-system route for a single post at `/blog/<slug>`; MDX content arrives as `children`
- `404.tsx`

**Content (MDX):** posts are `blog/*.mdx`, sourced with `gatsby-source-filesystem` (`name: "blog"`) and compiled by `gatsby-plugin-mdx` (v5, MDX 2, so `@mdx-js/react` is pinned to v2). Frontmatter:

```yaml
title: "Post title"   # required; becomes the page h1, so do not use # in the body
date: "2026-10-13"    # required
slug: "post-slug"     # required; served at /blog/<slug>
tag: "Agents"         # optional; drives the topic filter
read: "6 min"         # optional
```

MDX options (in `gatsby-config.mjs`): `remark-gfm` v3 (v4 breaks the build with this MDX version) and `rehype-pretty-code` with the `github-light` Shiki theme, so code blocks are highlighted at build time. The post list teaser is the post's auto-generated `excerpt`.

**GraphQL:** page queries only run in page files. `PostBrowser.tsx` exports a shared `PostSummary` fragment that `index.tsx` and `blog/index.tsx` spread into their own queries, and the components receive the nodes directly as `Queries.PostSummaryFragment`. Use the generated types from `src/gatsby-types.d.ts` rather than typing GraphQL results by hand. Static data in components goes through `useStaticQuery` (see `layout.tsx`).

**Images:** `gatsby-plugin-image` + `gatsby-transformer-sharp`. Source images live in `src/images/` (the hero uses `StaticImage` with `src/images/hero.jpg`).

**Components:** `src/components/`. Primitives (`Button`, `Input`, `MonoText`, `TopicTab`, `SectionHeader`), post UI (`PostBrowser`, `PostListItem`, `PostCard`), and page chrome (`Header`, `Footer`, `Hero`, `NewsletterPanel`, `layout`, `seo`). The `About` nav link, the RSS links and the footer GitHub and Mastodon links are placeholders (`#`).

**Google Analytics:** `gatsby-plugin-google-gtag` is installed but not configured in `gatsby-config.mjs`.

**Not yet wired:** the newsletter form only shows a confirmation on screen; it does not send the email anywhere.
