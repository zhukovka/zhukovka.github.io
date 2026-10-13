import React from 'react'
import { Input } from './Input'
import { Button } from './Button'
import { MonoText } from './MonoText'

interface NewsletterPanelProps {
  title?: string
  onSubmit?: (email: string) => void
}

export function NewsletterPanel({
  title = 'Get the next post in your inbox',
  onSubmit,
}: NewsletterPanelProps) {
  const [email, setEmail] = React.useState('')
  const [subscribed, setSubscribed] = React.useState(false)

  return (
    <section
      id="subscribe"
      className="grid scroll-mt-16 grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-end gap-8 border-b border-line px-8 py-16"
    >
      <h2 className="m-0 text-[clamp(36px,5vw,56px)] leading-none font-semibold tracking-display text-brand">
        {title}
      </h2>
      <div className="flex flex-col gap-3">
        {subscribed ? (
          <div className="border border-brand px-3.5 py-3 font-mono text-[15px] text-brand">
            ✓ Confirmation sent to {email}
          </div>
        ) : (
          <form
            className="flex flex-wrap"
            onSubmit={(e) => {
              e.preventDefault()
              setSubscribed(true)
              onSubmit?.(email)
            }}
          >
            <Input
              type="email"
              required
              placeholder="you@domain.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <Button type="submit" className="px-[22px]">
              Subscribe →
            </Button>
          </form>
        )}
        <MonoText size="xs">two emails a month · unsubscribe anytime</MonoText>
      </div>
    </section>
  )
}
