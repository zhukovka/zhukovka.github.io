import React from 'react'

interface SectionHeaderProps {
  title: string
  meta?: string
}

export function SectionHeader({ title, meta }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-baseline mb-[48px]">
      <h2 className="text-[var(--text-h2-size)] font-bold tracking-[var(--text-h2-tracking)] m-0 text-[var(--fg-1)] [font-family:var(--font-display)]">
        {title}
      </h2>
      {meta && (
        <span className="[font-family:var(--font-mono)] text-[13px] text-[var(--fg-6)]">{meta}</span>
      )}
    </div>
  )
}