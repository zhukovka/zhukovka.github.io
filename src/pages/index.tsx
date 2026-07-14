import React from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import { Button } from '../components/Button'
import { Tag } from '../components/Tag'
import { SectionHeader } from '../components/SectionHeader'
import { PostListItem } from '../components/PostListItem'
import { Avatar } from '../components/Avatar'
import { NewsletterPanel } from '../components/NewsletterPanel'
import Layout from '../components/layout'

const POSTS = [
  {
    date: 'Jul 2026',
    title: 'Why your service mesh is probably overkill',
    excerpt: 'Most teams reach for a mesh before they need one. Here is how to tell if you actually do.',
  },
  {
    date: 'Jun 2026',
    title: 'A postmortem on a self-inflicted outage',
    excerpt: 'How a one-line config change took down staging, prod, and my afternoon.',
  },
  {
    date: 'May 2026',
    title: 'TypeScript types are documentation that compiles',
    excerpt: 'Stop writing JSDoc comments for things that the type system already says.',
  },
  {
    date: 'Apr 2026',
    title: 'Notes on writing better runbooks',
    excerpt: 'The difference between a runbook nobody reads and one that saves you at 3am.',
  },
]

const TOPICS = [
  'distributed systems',
  'typescript',
  'javascript',
  'developer tools',
  'debugging',
  'infrastructure',
  'postmortems',
  'CLI design',
]

const section = 'max-w-[var(--content-max)] mx-auto px-[var(--content-pad)] py-[90px] border-b border-[var(--border-1)]'

const IndexPage: React.FC<PageProps> = () => {
  const [subscribed, setSubscribed] = React.useState(false)

  return (
    <Layout pageTitle="Home Page">
      {/* Hero */}
      <div className="max-w-[var(--content-max)] mx-auto px-[var(--content-pad)] pt-[80px] pb-[100px] border-b border-[var(--border-1)]">
        <div className="[font-family:var(--font-mono)] text-[13px] tracking-[0.08em] uppercase text-[var(--accent)] mb-[24px]">
          Personal blog / software engineering
        </div>
        <h1 className="text-[72px] leading-[0.98] font-bold tracking-[-0.03em] mt-0 mb-[28px] max-w-[900px]">
          Notes from the terminal, shipped as prose.
        </h1>
        <p className="text-[20px] leading-[1.6] text-[var(--fg-3)] max-w-[600px] mt-0 mb-[40px]">
          I build software for a living and write here about the parts that don't make it into the
          changelog — distributed systems, developer tools, and the occasional rant about abstractions.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Button variant="primary" icon={<span>→</span>}>
            Read the latest
          </Button>
          <Button variant="secondary">Subscribe</Button>
        </div>
      </div>

      {/* Posts */}
      <div id="posts" className={section}>
        <SectionHeader title="Latest posts" meta={`0${POSTS.length} essays`} />
        {POSTS.map((p, i) => (
          <PostListItem key={i} {...p} />
        ))}
      </div>

      {/* Topics */}
      <div id="topics" className={section}>
        <h2 className="text-[32px] font-bold tracking-[-0.02em] mt-0 mb-[40px]">
          What I write about
        </h2>
        <div className="flex flex-wrap gap-[14px]">
          {TOPICS.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </div>

      {/* About */}
      <div
        id="about"
        className={`${section} grid grid-cols-[220px_1fr] gap-[56px] items-start`}
      >
        <Avatar />
        <div>
          <h2 className="text-[32px] font-bold tracking-[-0.02em] mt-0 mb-[20px]">About</h2>
          <p className="text-[17px] leading-[1.7] text-[var(--fg-2)] max-w-[640px] mt-0 mb-[16px]">
            I'm a software engineer who cares too much about tooling and not enough about
            documentation. This blog is where I think out loud about system design, debugging war
            stories, and the abstractions that were supposed to help.
          </p>
          <p className="text-[17px] leading-[1.7] text-[var(--fg-2)] max-w-[640px] m-0">
            Previously at a couple of startups you've never heard of.
          </p>
        </div>
      </div>

      {/* Newsletter */}
      <div id="newsletter" className="max-w-[var(--content-max)] mx-auto px-[var(--content-pad)] py-[90px]">
        {subscribed ? (
          <div className="bg-[var(--accent)] rounded-[var(--radius-lg)] p-[64px] text-center">
            <h2 className="text-[28px] font-bold text-[var(--on-accent)] m-0">
              You're in. Check your inbox →
            </h2>
          </div>
        ) : (
          <NewsletterPanel
            body="No spam, no drip campaigns — just an email when I publish something new. Roughly once a month."
            onSubmit={() => setSubscribed(true)}
          />
        )}
      </div>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Lena Zhukova — Software Engineering Blog</title>