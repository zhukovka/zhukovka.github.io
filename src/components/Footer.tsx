import React from 'react'

export function Footer() {
  return (
    <footer className="flex flex-wrap justify-between gap-4 px-8 py-6 font-mono text-[13px] text-muted">
      <span>© 2026 Lena Zhukova · Software engineer, writing in public</span>
      <span className="flex gap-5">
        <a href="#" className="text-brand hover:text-brand-deep hover:underline">GitHub</a>
        <a href="#" className="text-brand hover:text-brand-deep hover:underline">Mastodon</a>
        <a href="#" className="text-brand hover:text-brand-deep hover:underline">RSS</a>
      </span>
    </footer>
  )
}
