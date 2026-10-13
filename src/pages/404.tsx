import React from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import Layout from '../components/layout'
import Seo from '../components/seo'
import { Button } from '../components/Button'
import { MonoText } from '../components/MonoText'

const NotFoundPage: React.FC<PageProps> = () => (
  <Layout pageTitle="Not found">
    <section className="flex min-h-[520px] flex-col justify-between gap-14 border-b border-line px-8 pt-16 pb-12">
      <h1 className="m-0 text-[clamp(52px,8vw,96px)] leading-[0.95] font-semibold tracking-display text-brand text-balance">
        Page not found
      </h1>
      <div className="flex max-w-[380px] flex-col gap-[22px]">
        <MonoText caps tone="brand" className="text-[15px] leading-[1.55] tracking-label">
          The page you were looking for has moved, or never existed
        </MonoText>
        <Button href="/">← Back to the log</Button>
      </div>
    </section>
  </Layout>
)

export default NotFoundPage

export const Head: HeadFC = () => <Seo title="Not found" />
