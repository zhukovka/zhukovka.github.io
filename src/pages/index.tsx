import React from 'react'
import { graphql, type HeadFC, type PageProps } from 'gatsby'
import Layout from '../components/layout'
import Seo from '../components/seo'
import { Hero } from '../components/Hero'
import { PostBrowser } from '../components/PostBrowser'
import { NewsletterPanel } from '../components/NewsletterPanel'

const IndexPage: React.FC<PageProps<Queries.IndexPageQuery>> = ({ data }) => (
  <Layout pageTitle="Home Page">
    <Hero />
    <PostBrowser posts={data.allMdx.nodes} />
    <NewsletterPanel />
  </Layout>
)

export default IndexPage

export const query = graphql`
  query IndexPage {
    allMdx(sort: { frontmatter: { date: DESC } }) {
      nodes {
        ...PostSummary
      }
    }
  }
`

export const Head: HeadFC = () => <Seo title="Home Page" />
