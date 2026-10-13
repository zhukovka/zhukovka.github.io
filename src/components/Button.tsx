import React from 'react'
import { Link } from 'gatsby'

type ButtonVariant = 'primary' | 'dark'
type ButtonSize = 'md' | 'sm'

interface CommonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children?: React.ReactNode
}

type ButtonProps = CommonProps &
  (
    | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
    | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>)
  )

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-surface hover:bg-brand-hover',
  dark: 'bg-forest text-surface hover:bg-ink',
}

const sizeClasses: Record<ButtonSize, string> = {
  md: 'px-5 py-3 text-[15px]',
  sm: 'px-4 py-[9px] text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    'inline-flex items-center justify-center gap-2.5 font-mono tracking-label',
    'transition-colors duration-150',
    variantClasses[variant],
    sizeClasses[size],
    className ?? '',
  ].join(' ')

  if ('href' in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest
    // Internal routes go through Gatsby; hashes and external URLs stay plain anchors.
    if (href.startsWith('/')) {
      return (
        <Link to={href} className={classes} {...anchorRest}>
          {children}
        </Link>
      )
    }
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
      </a>
    )
  }

  const { type = 'button', ...buttonRest } = rest as React.ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button type={type} className={`${classes} cursor-pointer`} {...buttonRest}>
      {children}
    </button>
  )
}
