import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

interface LayoutProps {
  pageTitle: string
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
    <div className="text-[var(--fg-1)] min-h-screen [font-family:var(--font-display)]">
      {/* Nav */}
      <div className="max-w-[var(--content-max)] mx-auto flex items-center justify-between px-[var(--content-pad)] py-[28px]">
        <div className="text-[20px] font-bold tracking-[-0.02em] flex items-center gap-2">
          <span className="w-[10px] h-[10px] rounded-[var(--radius-sm)] bg-[var(--accent)] inline-block" />
          {data.site.siteMetadata.title}
        </div>
        <div className="flex gap-8 text-[14px] font-medium text-[var(--fg-3)]">
          <a href="#posts">Writing</a>
          <a href="#topics">Topics</a>
          <a href="#about">About</a>
        </div>
      </div>
      <main>{children}</main>
    </div>
  )
}

export default Layout