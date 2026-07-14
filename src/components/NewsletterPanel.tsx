import React from 'react'
import { Input } from './Input'
import { Button } from './Button'

interface NewsletterPanelProps {
  title?: string
  body?: string
  onSubmit?: () => void
}

export function NewsletterPanel({
  title = 'Get new posts by email',
  body,
  onSubmit,
}: NewsletterPanelProps) {
  return (
    <div className="bg-[var(--accent)] rounded-[var(--radius-lg)] p-[64px] flex justify-between items-center gap-[40px] flex-wrap">
      <div className="max-w-[520px]">
        <h2 className="text-[36px] font-bold tracking-[-0.02em] text-[var(--on-accent)] mt-0 mb-[12px] [font-family:var(--font-display)]">
          {title}
        </h2>
        {body && (
          <p className="text-[16px] text-[var(--accent-ink)] m-0 leading-[1.6]">{body}</p>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit?.()
        }}
        className="flex gap-[12px] flex-wrap"
      >
        <Input type="email" placeholder="you@email.com" required />
        <Button variant="primary" type="submit">
          Subscribe
        </Button>
      </form>
    </div>
  )
}