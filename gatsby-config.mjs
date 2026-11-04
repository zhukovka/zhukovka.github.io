// ESM config: rehype-pretty-code and remark-gfm are ESM-only packages.
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('gatsby').GatsbyConfig} */
const config = {
  siteMetadata: {
    title: `Zhukova blog`,
    description: `Long-form writing on coding agents, AI-native delivery, and the process around the code`,
    // Deployed from the zhukovka.github.io repo (GitHub Pages user site, no path prefix).
    // Absolute URLs in the RSS feed are built from this value, so keep it in sync with the real domain.
    siteUrl: `https://zhukovka.github.io`,
    // Cloudflare Worker that forwards newsletter sign-ups to beehiiv (the API key lives there).
    // Source: ../beehiiv-subscribe. The Worker only accepts requests from the origins it allows.
    subscribeUrl: `https://beehiiv-subscribe.zhukovka.workers.dev`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    'gatsby-plugin-postcss',
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            // Highlighted at build time: no client JS. Colors come from the theme,
            // the block frame and background are styled in global.css (.post-body).
            [rehypePrettyCode, { theme: 'github-light', keepBackground: false }],
          ],
        },
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'images', path: './src/images/' },
      __key: 'images',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'pages', path: './src/pages/' },
      __key: 'pages',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'blog', path: `${__dirname}/blog` },
    },
    {
      // RSS feed at /rss.xml, written at the end of `gatsby build` (not served by `develop`).
      // Items carry the title, date, tag and the auto-generated excerpt, not the full post body.
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `{ site { siteMetadata { title description siteUrl site_url: siteUrl } } }`,
        feeds: [
          {
            output: '/rss.xml',
            title: 'Zhukova blog',
            query: `{
              allMdx(sort: { frontmatter: { date: DESC } }) {
                nodes {
                  excerpt(pruneLength: 280)
                  frontmatter { title date slug tag }
                }
              }
            }`,
            serialize: ({ query: { site, allMdx } }) =>
              allMdx.nodes.map((node) => {
                const url = `${site.siteMetadata.siteUrl}/blog/${node.frontmatter.slug}/`
                return {
                  title: node.frontmatter.title,
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url,
                  guid: url,
                  categories: node.frontmatter.tag ? [node.frontmatter.tag] : [],
                }
              }),
          },
        ],
      },
    },
  ],
}

export default config
