import React from 'react'

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost'
type ButtonSize = 'md' | 'sm'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--fg-1)] text-[var(--bg)] hover:bg-white',
  accent: 'bg-[var(--accent)] text-[var(--on-accent)] hover:bg-[var(--accent-hover)]',
  secondary:
    'bg-transparent text-[var(--fg-1)] border border-[var(--border-4)] hover:bg-[oklch(0.28_0.01_95)]',
  ghost: 'bg-transparent text-[var(--fg-3)]',
}

const sizeClasses: Record<ButtonSize, string> = {
  md: 'px-[26px] py-[14px] text-[15px]',
  sm: 'px-[20px] py-[10px] text-[13px]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  disabled,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={[
        '[font-family:var(--font-display)] font-semibold',
        'rounded-[var(--radius-pill)]',
        'inline-flex items-center gap-2',
        'transition-[background-color,color] duration-[var(--duration-standard)] ease-[var(--ease-standard)]',
        disabled ? 'cursor-default opacity-45' : 'cursor-pointer',
        variantClasses[variant],
        sizeClasses[size],
        className ?? '',
      ].join(' ')}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}