import path from 'node:path'
import type { GatsbyNode } from 'gatsby'

// Optional frontmatter fields the design uses. Declaring them keeps GraphQL
// queries valid even when no post sets them yet.
export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({ actions }) => {
  actions.createTypes(`
    type MdxFrontmatter {
      tag: String
      read: String
    }
  `)
}

// Resolve the shadcn `@/` alias (mirrors `paths` in tsconfig.json).
export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  })
}
