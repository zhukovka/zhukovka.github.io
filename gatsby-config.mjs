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
    siteUrl: `https://www.yourdomain.tld`,
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
  ],
}

export default config
