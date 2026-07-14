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

## Architecture

This is a **Gatsby 5** blog built with TypeScript, React 18, and Tailwind CSS 4.

**Key config files:**
- `gatsby-config.ts` — plugin registration and site metadata; GraphQL typegen is enabled, so types are auto-generated into `src/gatsby-types.d.ts` on `develop`/`build`
- `gatsby-browser.js` — imports `src/styles/global.css` (the Tailwind entry point)
- `tailwind.config.js` — scans `src/pages/**` and `src/components/**` for class names
- `postcss.config.js` + `gatsby-plugin-postcss` — wires Tailwind into the Gatsby build

**Styling:** Tailwind CSS 4 via PostCSS. `src/styles/global.css` contains only the three `@tailwind` directives. Add component-level styles with Tailwind classes; no CSS Modules or styled-components are used.

**Pages:** File-system based routing under `src/pages/`. Each file exports a default React component and optionally a named `Head` export for `<head>` metadata (Gatsby Head API).

**Images:** Handled by `gatsby-plugin-image` + `gatsby-transformer-sharp`. Source images live in `src/images/` and are exposed via GraphQL (`gatsby-source-filesystem` with `name: "images"`).

**GraphQL:** `graphqlTypegen: true` in `gatsby-config.ts` generates TypeScript types automatically. Use the generated types from `src/gatsby-types.d.ts` rather than typing GraphQL results manually.

**MDX:** `@mdx-js/react` is installed but not yet wired up in `gatsby-config.ts`. To enable blog posts as MDX files, add `gatsby-plugin-mdx` and a `gatsby-source-filesystem` entry pointing at a `content/` directory.

**Google Analytics:** `gatsby-plugin-google-gtag` is installed but not yet configured in `gatsby-config.ts`.