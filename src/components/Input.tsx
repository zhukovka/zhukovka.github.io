import React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...rest }: InputProps) {
  return (
    <input
      className={[
        'min-w-[200px] flex-1 border border-ink bg-surface px-3.5 py-3',
        'font-mono text-[15px] text-ink placeholder:text-muted outline-none',
        'focus-visible:outline-2 focus-visible:outline-brand focus-visible:-outline-offset-2',
        className ?? '',
      ].join(' ')}
      {...rest}
    />
  )
}
