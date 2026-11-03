import React from 'react'
import { withPrefix } from 'gatsby'
import { Button } from '@/components/ui/button'

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/zhukovka' },
  { label: 'RSS', href: withPrefix('/rss.xml') },
]

export function Footer() {
  return (
    <footer className="flex flex-wrap justify-between gap-4 px-8 py-6 font-mono text-[13px] text-muted">
      <span>© 2026 Lena Zhukova · Software engineer, writing in public</span>
      <span className="flex gap-5">
        {LINKS.map(({ label, href }) => (
          <Button key={label} variant="link" size="inline" asChild>
            <a href={href}>{label}</a>
          </Button>
        ))}
      </span>
    </footer>
  )
}
