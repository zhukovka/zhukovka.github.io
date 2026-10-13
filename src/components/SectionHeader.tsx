import React from 'react'
import { MonoText } from './MonoText'

interface SectionHeaderProps {
  title: string
  meta?: string
}

export function SectionHeader({ title, meta }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-4 px-8 pt-12 pb-5">
      <h2 className="m-0 text-[40px] font-semibold tracking-heading">{title}</h2>
      {meta && <MonoText>{meta}</MonoText>}
    </div>
  )
}
