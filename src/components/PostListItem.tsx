import React from 'react'

interface PostListItemProps {
  date: string
  title: string
  excerpt: string
  href?: string
}

export function PostListItem({ date, title, excerpt, href = '#' }: PostListItemProps) {
  return (
    <a
      href={href}
      className="group grid grid-cols-[140px_1fr_auto] gap-[32px] items-center py-[28px] border-t border-[var(--border-2)] no-underline text-inherit"
    >
      <span className="[font-family:var(--font-mono)] text-[13px] text-[var(--fg-6)]">{date}</span>
      <div>
        <div className="text-[var(--text-title-size)] font-semibold tracking-[var(--text-title-tracking)] mb-[8px] text-[var(--fg-1)] [font-family:var(--font-display)]">
          {title}
        </div>
        <div className="text-[15px] text-[var(--fg-4)] leading-[1.5] max-w-[640px]">{excerpt}</div>
      </div>
      <span className="text-[22px] text-[var(--accent)] transition-transform duration-[var(--duration-standard)] ease-[var(--ease-standard)] group-hover:translate-x-1">
        →
      </span>
    </a>
  )
}