import React from 'react'
import { Link } from 'gatsby'
import { Button } from './Button'

const NAV = [
  { label: 'Writing', href: '/posts' },
  { label: 'Topics', href: '/#topics' },
  { label: 'About', href: '#' },
]

export function Header({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-surface">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-5 px-7 py-3">
        <Link to="/" className="flex items-center gap-2.5 text-brand">
          <span className="block size-3.5 rotate-45 bg-brand" />
          <span className="text-lg font-semibold tracking-title">{title}</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1.5 font-mono text-sm">
          {NAV.map((item, i) => (
            <React.Fragment key={item.label}>
              {i > 0 && <span className="h-4 w-px bg-line" />}
              {item.href.startsWith('/') ? (
                <Link to={item.href} className="px-3 py-2">{item.label}</Link>
              ) : (
                <a href={item.href} className="px-3 py-2">{item.label}</a>
              )}
            </React.Fragment>
          ))}
          <Button href="#" variant="dark" size="sm" className="ml-3">RSS</Button>
          <Button href="/#subscribe" size="sm">Subscribe</Button>
        </nav>
      </div>
    </header>
  )
}
