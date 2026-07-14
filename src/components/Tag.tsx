import React from 'react'

interface TagProps {
  children: React.ReactNode
  mono?: boolean
}

export function Tag({ children, mono = true }: TagProps) {
  return (
    <span
      className={[
        mono ? '[font-family:var(--font-mono)]' : '[font-family:var(--font-display)]',
        'text-[15px] inline-block',
        'px-[20px] py-[12px]',
        'border border-[var(--border-3)] rounded-[var(--radius-pill)]',
        'text-[var(--fg-3)]',
      ].join(' ')}
    >
      {children}
    </span>
  )
}