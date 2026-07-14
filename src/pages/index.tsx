import React from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import { Button } from '../components/Button'
import { Tag } from '../components/Tag'
import { SectionHeader } from '../components/SectionHeader'
import { PostListItem } from '../components/PostListItem'
import { Avatar } from '../components/Avatar'
import { NewsletterPanel } from '../components/NewsletterPanel'

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

const section: React.CSSProperties = {
  maxWidth: 'var(--content-max)',
  margin: '0 auto',
  padding: '90px var(--content-pad)',
  borderBottom: '1px solid var(--border-1)',
}

const IndexPage: React.FC<PageProps> = () => {
  const [subscribed, setSubscribed] = React.useState(false)

  return (
    <div style={{ color: 'var(--fg-1)', minHeight: '100vh', fontFamily: 'var(--font-display)' }}>
      {/* Nav */}
      <div
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '28px var(--content-pad)',
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent)',
              display: 'inline-block',
            }}
          />
          Lena Zhukova
        </div>
        <div
          style={{
            display: 'flex',
            gap: 32,
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--fg-3)',
          }}
        >
          <a href="#posts">Writing</a>
          <a href="#topics">Topics</a>
          <a href="#about">About</a>
        </div>
      </div>

      {/* Hero */}
      <div
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          padding: '80px var(--content-pad) 100px',
          borderBottom: '1px solid var(--border-1)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: 24,
          }}
        >
          Personal blog / software engineering
        </div>
        <h1
          style={{
            fontSize: 72,
            lineHeight: 0.98,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            margin: '0 0 28px',
            maxWidth: 900,
          }}
        >
          Notes from the terminal, shipped as prose.
        </h1>
        <p
          style={{
            fontSize: 20,
            lineHeight: 1.6,
            color: 'var(--fg-3)',
            maxWidth: 600,
            margin: '0 0 40px',
          }}
        >
          I build software for a living and write here about the parts that don't make it into the
          changelog — distributed systems, developer tools, and the occasional rant about
          abstractions.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Button variant="primary" icon={<span>→</span>}>
            Read the latest
          </Button>
          <Button variant="secondary">Subscribe</Button>
        </div>
      </div>

      {/* Posts */}
      <div id="posts" style={section}>
        <SectionHeader title="Latest posts" meta={`0${POSTS.length} essays`} />
        {POSTS.map((p, i) => (
          <PostListItem key={i} {...p} />
        ))}
      </div>

      {/* Topics */}
      <div id="topics" style={section}>
        <h2
          style={{
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: '0 0 40px',
          }}
        >
          What I write about
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {TOPICS.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </div>

      {/* About */}
      <div
        id="about"
        style={{
          ...section,
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: 56,
          alignItems: 'start',
        }}
      >
        <Avatar />
        <div>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              margin: '0 0 20px',
            }}
          >
            About
          </h2>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.7,
              color: 'var(--fg-2)',
              maxWidth: 640,
              margin: '0 0 16px',
            }}
          >
            I'm a software engineer who cares too much about tooling and not enough about
            documentation. This blog is where I think out loud about system design, debugging war
            stories, and the abstractions that were supposed to help.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--fg-2)', maxWidth: 640, margin: 0 }}>
            Previously at a couple of startups you've never heard of.
          </p>
        </div>
      </div>

      {/* Newsletter */}
      <div
        id="newsletter"
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          padding: '90px var(--content-pad)',
        }}
      >
        {subscribed ? (
          <div
            style={{
              background: 'var(--accent)',
              borderRadius: 'var(--radius-lg)',
              padding: 64,
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: 'var(--on-accent)',
                margin: 0,
              }}
            >
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

      {/* Footer */}
      <div
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          padding: '40px var(--content-pad) 60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <span style={{ fontSize: 13, color: 'var(--fg-6)' }}>© 2026 Lena Zhukova</span>
        <div
          style={{
            display: 'flex',
            gap: 24,
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--fg-4)',
          }}
        >
          <a href="#">GitHub</a>
          <a href="#">X / Twitter</a>
          <a href="#">RSS</a>
        </div>
      </div>
    </div>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Lena Zhukova — Software Engineering Blog</title>