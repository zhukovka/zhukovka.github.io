import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MonoText } from './MonoText'

interface NewsletterPanelProps {
  title?: string
  onSubmit?: (email: string) => void
}

type Status = 'idle' | 'sending' | 'subscribed' | 'invalid' | 'error'

export function NewsletterPanel({
  title = 'Get the next post in your inbox',
  onSubmit,
}: NewsletterPanelProps) {
  const data = useStaticQuery<Queries.NewsletterPanelSiteQuery>(graphql`
    query NewsletterPanelSite {
      site {
        siteMetadata {
          subscribeUrl
        }
      }
    }
  `)
  const subscribeUrl = data.site?.siteMetadata?.subscribeUrl

  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!subscribeUrl) {
      setStatus('error')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(subscribeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('subscribed')
        onSubmit?.(email)
      } else {
        setStatus(res.status === 400 ? 'invalid' : 'error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="subscribe"
      className="grid scroll-mt-16 grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-end gap-8 border-b border-line px-8 py-16"
    >
      <h2 className="m-0 text-[clamp(36px,5vw,56px)] leading-none font-semibold tracking-display text-brand">
        {title}
      </h2>
      <div className="flex flex-col gap-3">
        {status === 'subscribed' ? (
          <Alert variant="success">
            ✓ Subscribed {email}. Check your inbox if beehiiv asks you to confirm.
          </Alert>
        ) : (
          <>
            <form className="flex flex-wrap" onSubmit={handleSubmit}>
              <Input
                type="email"
                required
                placeholder="you@domain.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                disabled={status === 'sending'}
                className="min-w-[200px] flex-1"
              />
              <Button type="submit" className="px-[22px]" disabled={status === 'sending'}>
                {status === 'sending' ? 'Subscribing…' : 'Subscribe →'}
              </Button>
            </form>
            {status === 'invalid' && (
              <Alert role="alert">That email address doesn't look right. Check it and try again.</Alert>
            )}
            {status === 'error' && (
              <Alert role="alert">Couldn't subscribe right now. Try again in a minute.</Alert>
            )}
          </>
        )}
        <MonoText size="xs">two emails a month · unsubscribe anytime</MonoText>
      </div>
    </section>
  )
}
