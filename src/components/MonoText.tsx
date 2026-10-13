import React from 'react'

interface MonoTextProps {
  children: React.ReactNode
  /** Small helper line (12px, muted) vs. regular meta line (13px). */
  size?: 'xs' | 'sm'
  caps?: boolean
  tone?: 'muted' | 'brand'
  className?: string
}

/** Mono-spaced meta text: dates, counts, helper lines, tags. */
export function MonoText({ children, size = 'sm', caps, tone = 'muted', className }: MonoTextProps) {
  return (
    <span
      className={[
        'font-mono',
        size === 'xs' ? 'text-xs' : 'text-[13px]',
        tone === 'brand' ? 'text-brand' : 'text-muted',
        caps ? 'uppercase tracking-caps' : '',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </span>
  )
}
