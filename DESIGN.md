# Design system: Paper & Forest

The visual language of the Zhukova blog: warm grey paper, one forest-green accent,
mono interface text, a serif for long reading, and 1px hairlines instead of shadows.

Source of truth in code: `src/styles/global.css` (`@theme` tokens, `.post-body` rules).
Components live in `src/components/`. Do not hard-code hex values or font names in
components; use the Tailwind utilities listed below.

## Principles

1. **Warm paper, not white.** Every surface is a tint of grey-beige. The page carries a 5px dot texture.
2. **One accent.** Forest green carries links, headings, buttons and the active state. Nothing else is coloured.
3. **Hairlines, no shadows.** 1px `line` borders divide the page into a grid. Corners are square. Nothing floats.
4. **Three voices.** Geist Mono labels the interface, Geist sets headings, Source Serif 4 sets long text.

## Colour

| Token | Hex | Utilities | Use |
| --- | --- | --- | --- |
| `paper` | `#E8E6E1` | `bg-paper` | Page background |
| `surface` | `#EFEEE9` | `bg-surface` | Header, inputs, hover rows, code blocks, inline code |
| `surface-hover` | `#DEDCD5` | `bg-surface-hover` | Hover on topic tabs |
| `line` | `#D3D0C9` | `border-line`, `bg-line` | Every 1px border and divider |
| `ink` | `#1C1D1B` | `text-ink` | Titles, primary text, article body |
| `ink-soft` | `#55564F` | `text-ink-soft` | Excerpts and short secondary copy |
| `muted` | `#6B6C66` | `text-muted` | Dates, counts, helper lines |
| `brand` | `#1B6E43` | `text-brand`, `bg-brand` | Links, hero title, tags, primary button, active tab |
| `brand-hover` | `#145634` | `bg-brand-hover` | Primary button hover |
| `brand-deep` | `#0F4A2C` | `text-brand-deep` | Link hover |
| `forest` | `#12241A` | `bg-forest` | Secondary (dark) button |

Texture utilities: `bg-dots` (page background dots), `bg-hatch` (diagonal hatch for image placeholders).

### Contrast (approximate WCAG ratios)

| Pair | Ratio | |
| --- | --- | --- |
| ink on paper | 13.5:1 | pass |
| ink-soft on paper | 5.9:1 | pass |
| brand on paper | 5.0:1 | pass |
| surface on brand (button text) | 5.4:1 | pass |
| muted on surface | 4.6:1 | pass |
| muted on paper | 4.2:1 | **just under AA for small text** |

Known issue: `muted` on `paper` is used for 12 to 13px dates and helper lines. Darkening
`muted` to about `#62635D` would fix it without changing the look.

## Typography

| Family | Token / utility | Weights | Use |
| --- | --- | --- | --- |
| Geist | `--font-sans` / `font-sans` | 400 500 600 700 | Headings, titles, short UI copy |
| Geist Mono | `--font-mono` / `font-mono` | 400 500 | Navigation, buttons, inputs, dates, tags, code |
| Source Serif 4 | `--font-serif` / `font-serif` | 400 600, italic 400 | Article paragraphs and lists only |

Tracking tokens: `tracking-display` (-0.045em), `tracking-heading` (-0.035em),
`tracking-title` (-0.02em), `tracking-label` (0.04em), `tracking-caps` (0.05em).

### Scale

| Role | Family | Size / line height | Weight | Tracking | Colour |
| --- | --- | --- | --- | --- | --- |
| Display (hero, 404) | Geist | clamp(52px, 8vw, 96px) / 0.95 | 600 | display | brand |
| Section heading | Geist | 40px / 1.1 | 600 | heading | ink |
| Article h1 | Geist | clamp(32px, 4vw, 44px) / 1.05 | 600 | display | brand |
| Article h2 | Geist | 30px / 1.15 | 600 | heading | ink |
| Card title | Geist | 24px / 1.2 | 500 | -0.025em | ink |
| List title, article h3 | Geist | 22px / 1.25 | 500 / 600 | title | ink |
| Lede (first article paragraph) | Source Serif 4 | 21px / 1.55 | 400 | normal | ink |
| Article body | Source Serif 4 | 18px / 1.7 | 400 | normal | ink |
| UI body, excerpts | Geist | 15px / 1.5 | 400 | normal | ink-soft |
| Label, nav, buttons | Geist Mono | 14 to 15px | 400 | label | ink |
| Eyebrow, tag | Geist Mono | 12px, uppercase | 400 to 500 | caps | brand |
| Article h4 | Geist Mono | 13px, uppercase | 500 | caps | brand |
| Meta, helper | Geist Mono | 12 to 13px | 400 | normal | muted |

Rules:
- Long text is capped at a **680px** measure (about 66 characters at 18px). Never set it full width.
- Article body is `ink`, not `ink-soft`: sustained reading needs the stronger contrast.
- The serif is for paragraphs and list items only. Headings stay sans, labels stay mono.

## Layout

- Page container: `max-w-page` (1200px), centred, with 1px `border-line` on left and right.
- Gutters: 32px (`px-8`) inside sections; header uses 28px (`px-7`).
- Sections are separated by a 1px bottom border, never by spacing alone.
- Section vertical padding: 64px (`py-16`) for bands, 48px top for list headings.
- Grids use `repeat(auto-fit, minmax(...))` so columns collapse without breakpoints
  (hero 340px, topic tabs 180px, cards 300px, newsletter 320px).
- Sticky header, `z-10`. Anchor targets use `scroll-mt-16`.
- No border radius. No box shadows.

## Components

| Component | File | Spec |
| --- | --- | --- |
| Button | `Button.tsx` | Mono, `tracking-label`. `primary`: `bg-brand`, hover `bg-brand-hover`. `dark`: `bg-forest`, hover `bg-ink`. `md`: `px-5 py-3`, 15px. `sm`: `px-4 py-[9px]`, 14px. Text `surface`. 150ms colour transition. |
| Input | `Input.tsx` | 1px `ink` border, `bg-surface`, mono 15px, `px-3.5 py-3`. Joined flush to the submit button. Focus: 2px brand outline, inset. |
| Header | `Header.tsx` | Sticky, `bg-surface`, bottom 1px `line`. Diamond mark (14px, rotated 45deg, brand) + site name. Mono nav links with 1px dividers, then RSS (dark) and Subscribe (primary). |
| Topic tab | `TopicTab.tsx` | 20px / 600 Geist with mono count at 70% opacity. Default: transparent, `ink-soft`. Hover: `surface-hover`. Active: `bg-brand`, `surface` text. `aria-pressed` reflects state. |
| Post row | `PostListItem.tsx` | Grid: date (mono, muted) / title + excerpt / tag + read time. Bottom 1px `line`. Hover: `bg-surface`. Single column below `md`. |
| Post card | `PostCard.tsx` | `p-7`, `min-h-60`, right and bottom 1px `line`. Tag (brand caps) and date (muted caps) on top, 24px title, excerpt pinned to the bottom. Hover: `bg-surface`. |
| Section header | `SectionHeader.tsx` | 40px / 600 `tracking-heading` title with a mono muted count, baseline aligned. |
| Newsletter | `NewsletterPanel.tsx` | Two columns: 36 to 56px brand heading, form. Success state is a 1px brand-bordered box in mono. |
| Hero | `Hero.tsx` | Display title, mono caps description, primary button, image in a frame with top and left 1px `line`. |

### Post body (`.post-body`, MDX)

- Headings: one treatment per level (see scale). h2 carries a 1px `line` rule above it with 1.5rem padding.
  The first element in a post has no top margin or rule.
- Code blocks: highlighted at build time with Shiki (`github-light`) through `rehype-pretty-code`,
  framed with `bg-surface` + 1px `line`, mono 13px / 1.65, language label in muted caps above the code.
  Unlabelled fences render as plain framed blocks (use these for diagrams).
- Inline code: `bg-surface` chip with 1px `line` border, mono at 0.88em.
- Links: brand, underlined with a 0.2em offset, `brand-deep` on hover.
- Tables (GFM): 1px `line` borders, header row on `surface` in mono 13px.
- Article container: `bg-surface/50` over the dotted page, max width 680px for text.
- Do not write `# h1` inside MDX. The page title comes from frontmatter and is the only h1.

## Interaction

- Hover changes colour only (background or text). No movement, scale or shadow.
- Transition: colour, 150ms.
- Focus: `:focus-visible` shows a 2px `brand` outline with 2px offset.

## Content model (MDX frontmatter)

```yaml
title: "Post title"        # required, becomes the page h1
date: "2026-10-13"         # required, shown as YYYY-MM-DD
slug: "post-slug"          # required, served at /blog/<slug>
tag: "Agents"              # optional, drives the topic filter
read: "6 min"              # optional, shown next to the tag
```

The list teaser is the post's auto-generated excerpt, so the first paragraph should
stand on its own.

## Do and don't

- **Do** use tokens (`bg-surface`, `text-ink-soft`, `border-line`) and the font utilities.
- **Do** use hairlines to separate content, and keep everything on the square grid.
- **Do** keep brand green for meaning: links, the active state, primary actions, hero text.
- **Don't** add shadows, gradients, rounded corners or emoji.
- **Don't** introduce another accent colour or a second sans family.
- **Don't** set long reading text in Geist or full width.
- **Don't** use `muted` for text that carries essential information at small sizes (see contrast).

## Reference

The visual board for this system is the "Paper & Forest Design System" canvas
(four boards: foundations, typography, components, article page). A downloaded copy of its
files is in `reference/design-system/` (untracked).
