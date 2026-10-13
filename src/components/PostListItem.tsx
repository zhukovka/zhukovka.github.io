import React from 'react'
import { Link } from 'gatsby'
import { MonoText } from './MonoText'

export function PostListItem({ post }: { post: Queries.PostSummaryFragment }) {
  const { title, date, slug, tag, read } = post.frontmatter ?? {}
  return (
    <Link
      to={`/${slug}`}
      className="grid grid-cols-1 items-baseline gap-2 border-b border-line px-8 py-[22px] transition-colors hover:bg-surface md:grid-cols-[minmax(96px,150px)_minmax(0,1fr)_auto] md:gap-6"
    >
      <MonoText>{date}</MonoText>
      <span className="flex flex-col gap-1.5">
        <span className="text-[22px] font-medium leading-tight tracking-title text-pretty">{title}</span>
        <span className="text-[15px] leading-normal text-ink-soft text-pretty">{post.excerpt}</span>
      </span>
      <MonoText size="xs" caps tone="brand" className="whitespace-nowrap">
        {[tag, read].filter(Boolean).join(' · ')}
      </MonoText>
    </Link>
  )
}
