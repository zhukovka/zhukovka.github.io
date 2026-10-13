import React from 'react'
import { graphql, type HeadFC, type PageProps } from 'gatsby'
import Layout from '../../components/layout'
import Seo from '../../components/seo'
import { MonoText } from '../../components/MonoText'

const PostPage: React.FC<PageProps<Queries.PostPageQuery>> = ({ data, children }) => (
  <Layout pageTitle={data.mdx?.frontmatter?.title ?? 'Post'}>
    <article className="border-b border-line bg-surface/50 px-8 pt-16 pb-12">
      <MonoText>{data.mdx?.frontmatter?.date}</MonoText>
      <h1 className="mt-3 mb-10 text-[clamp(36px,5vw,64px)] leading-none font-semibold tracking-display text-brand text-balance">
        {data.mdx?.frontmatter?.title}
      </h1>
      <div className="flex max-w-[680px] flex-col gap-4 text-[17px] leading-[1.7] text-ink-soft [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink">
        {children}
      </div>
    </article>
  </Layout>
)

export default PostPage

export const query = graphql`
  query PostPage($id: String) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
      }
    }
  }
`

export const Head: HeadFC<Queries.PostPageQuery> = ({ data }) => (
  <Seo title={data.mdx?.frontmatter?.title ?? 'Post'} />
)
