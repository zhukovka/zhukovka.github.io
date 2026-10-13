import React from 'react'
import { graphql, type HeadFC, type PageProps } from 'gatsby'
import Layout from '../components/layout'
import Seo from '../components/seo'
import { PostBrowser } from '../components/PostBrowser'
import { NewsletterPanel } from '../components/NewsletterPanel'

const PostsPage: React.FC<PageProps<Queries.PostsPageQuery>> = ({ data }) => (
  <Layout pageTitle="Posts">
    <PostBrowser posts={data.allMdx.nodes} />
    <NewsletterPanel />
  </Layout>
)

export default PostsPage

export const query = graphql`
  query PostsPage {
    allMdx(sort: { frontmatter: { date: DESC } }) {
      nodes {
        ...PostSummary
      }
    }
  }
`

export const Head: HeadFC = () => <Seo title="Posts" />
