import React from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import Layout from '../components/layout'
import Seo from '../components/seo'
import { PostBrowser } from '../components/PostBrowser'
import { NewsletterPanel } from '../components/NewsletterPanel'

const PostsPage: React.FC<PageProps> = () => (
  <Layout pageTitle="Posts">
    <PostBrowser />
    <NewsletterPanel />
  </Layout>
)

export default PostsPage

export const Head: HeadFC = () => <Seo title="Posts" />
