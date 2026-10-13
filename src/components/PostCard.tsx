import React from 'react'
import { Link } from 'gatsby'
import { MonoText } from './MonoText'

export function PostCard({ post }: { post: Queries.PostSummaryFragment }) {
  const { title, date, slug, tag } = post.frontmatter ?? {}
  return (
    <Link
      to={`/${slug}`}
      className="flex min-h-60 flex-col gap-3.5 border-r border-b border-line p-7 transition-colors hover:bg-surface"
    >
      <span className="flex justify-between">
        <MonoText size="xs" caps tone="brand">{tag}</MonoText>
        <MonoText size="xs" caps>{date}</MonoText>
      </span>
      <span className="text-2xl font-medium leading-tight tracking-title text-pretty">{title}</span>
      <span className="mt-auto text-[15px] leading-normal text-ink-soft text-pretty">{post.excerpt}</span>
    </Link>
  )
}
