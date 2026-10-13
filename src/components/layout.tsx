import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Header } from './Header'
import { Footer } from './Footer'

interface LayoutProps {
  pageTitle?: string
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div className="min-h-screen bg-paper bg-dots">
      <Header title={data.site.siteMetadata.title} />
      <main className="mx-auto max-w-page border-x border-line">
        {children}
        <Footer />
      </main>
    </div>
  )
}

export default Layout
