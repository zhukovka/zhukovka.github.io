import React from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import Layout from '../components/layout'
import Seo from '../components/seo'
import { Hero } from '../components/Hero'
import { PostBrowser } from '../components/PostBrowser'
import { NewsletterPanel } from '../components/NewsletterPanel'

const IndexPage: React.FC<PageProps> = () => (
  <Layout pageTitle="Home Page">
    <Hero />
    <PostBrowser />
    <NewsletterPanel />
  </Layout>
)

export default IndexPage

export const Head: HeadFC = () => <Seo title="Home Page" />
