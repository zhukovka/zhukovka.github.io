import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...rest }: InputProps) {
  return (
    <input
      className={[
        'px-[18px] py-[14px]',
        'rounded-[var(--radius-pill)]',
        'border-0 outline-none',
        'text-[15px] [font-family:var(--font-display)]',
        'bg-[var(--bg)] text-[var(--fg-1)]',
        'w-[260px] box-border',
        className ?? '',
      ].join(' ')}
      {...rest}
    />
  )
}