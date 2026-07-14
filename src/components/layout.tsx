import React from 'react'
import {useStaticQuery, graphql, Link} from 'gatsby'

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
    <div className="text-(--fg-1) min-h-screen [font-family:var(--font-display)]">
      {/* Nav */}
      <div className="max-w-(--content-max) mx-auto flex items-center justify-between px-(--content-pad) py-7">
        <div className="text-[20px] font-bold tracking-[-0.02em] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-(--accent) inline-block" />
          {data.site.siteMetadata.title}
        </div>
        <div className="flex gap-8 text-[14px] font-medium text-(--fg-3)">
          <Link to="/posts">Posts</Link>
          <Link to="/about">About</Link>
        </div>
      </div>
      <main>{children}</main>
      {/* Footer */}
      <div className="max-w-(--content-max) mx-auto px-(--content-pad) pt-10 pb-15 flex justify-between items-center flex-wrap gap-4">
        <span className="text-[13px] text-(--fg-6)">© 2026 Lena Zhukova</span>
        <div className="flex gap-6 font-mono text-[13px] text-(--fg-4)">
          <a href="#">GitHub</a>
          <a href="#">X / Twitter</a>
          <a href="#">RSS</a>
        </div>
      </div>
    </div>
  )
}

export default Layout