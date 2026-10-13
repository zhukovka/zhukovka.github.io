import React from 'react'
import { MonoText } from './MonoText'
import type { Post } from '../data/posts'

export function PostListItem({ date, tag, read, title, dek }: Post) {
  return (
    <a
      href="#"
      className="grid grid-cols-1 items-baseline gap-2 border-b border-line px-8 py-[22px] transition-colors hover:bg-surface md:grid-cols-[minmax(96px,150px)_minmax(0,1fr)_auto] md:gap-6"
    >
      <MonoText>{date}</MonoText>
      <span className="flex flex-col gap-1.5">
        <span className="text-[22px] font-medium leading-tight tracking-title text-pretty">{title}</span>
        <span className="text-[15px] leading-normal text-ink-soft text-pretty">{dek}</span>
      </span>
      <MonoText size="xs" caps tone="brand" className="whitespace-nowrap">
        {tag} · {read}
      </MonoText>
    </a>
  )
}
