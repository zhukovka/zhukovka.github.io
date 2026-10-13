import React from 'react'
import { ALL_TOPICS, POSTS, TOPICS } from '../data/posts'
import { SectionHeader } from './SectionHeader'
import { TopicTab } from './TopicTab'
import { PostListItem } from './PostListItem'
import { PostCard } from './PostCard'

interface PostBrowserProps {
  layout?: 'list' | 'grid'
}

/** Topic filter + post feed. Owns the selected-topic state. */
export function PostBrowser({ layout = 'list' }: PostBrowserProps) {
  const [topic, setTopic] = React.useState(ALL_TOPICS)

  const posts = topic === ALL_TOPICS ? POSTS : POSTS.filter((p) => p.tag === topic)
  const countLabel = `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`

  return (
    <>
      <section id="topics" className="scroll-mt-16 border-b border-line">
        <div className="border-b border-line px-6 py-3.5 text-center font-mono text-sm tracking-caps uppercase">
          Filter by topic.{' '}
          <span className="text-brand">
            Showing {topic === ALL_TOPICS ? 'all posts' : topic} →
          </span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
          {TOPICS.map((name) => (
            <TopicTab
              key={name}
              name={name}
              count={name === ALL_TOPICS ? POSTS.length : POSTS.filter((p) => p.tag === name).length}
              active={name === topic}
              onSelect={() => setTopic(name)}
            />
          ))}
        </div>
      </section>

      <section id="writing" className="scroll-mt-16 border-b border-line">
        <SectionHeader title="Writing" meta={countLabel} />
        {layout === 'list' ? (
          <div className="border-t border-line">
            {posts.map((p) => (
              <PostListItem key={p.title} {...p} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] border-t border-line">
            {posts.map((p) => (
              <PostCard key={p.title} {...p} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
