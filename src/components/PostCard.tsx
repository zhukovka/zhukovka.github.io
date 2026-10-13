import React from 'react'
import { MonoText } from './MonoText'
import type { Post } from '../data/posts'

export function PostCard({ date, tag, title, dek }: Post) {
  return (
    <a
      href="#"
      className="flex min-h-60 flex-col gap-3.5 border-r border-b border-line p-7 transition-colors hover:bg-surface"
    >
      <span className="flex justify-between">
        <MonoText size="xs" caps tone="brand">{tag}</MonoText>
        <MonoText size="xs" caps>{date}</MonoText>
      </span>
      <span className="text-2xl font-medium leading-tight tracking-title text-pretty">{title}</span>
      <span className="mt-auto text-[15px] leading-normal text-ink-soft text-pretty">{dek}</span>
    </a>
  )
}
