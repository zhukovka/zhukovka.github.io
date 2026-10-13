import React from 'react'
import { graphql } from 'gatsby'
import { SectionHeader } from './SectionHeader'
import { TopicTab } from './TopicTab'
import { PostListItem } from './PostListItem'
import { PostCard } from './PostCard'

const ALL_TOPICS = 'All'

interface PostBrowserProps {
  layout?: 'list' | 'grid'
  posts: ReadonlyArray<Queries.PostSummaryFragment>
}

/** Topic filter + post feed. Owns the selected-topic state. */
export function PostBrowser({ posts, layout = 'list' }: PostBrowserProps) {
  const [topic, setTopic] = React.useState(ALL_TOPICS)

  const topics = [
    ALL_TOPICS,
    ...new Set(posts.flatMap((p) => p.frontmatter?.tag ?? [])),
  ]
  const visible =
    topic === ALL_TOPICS ? posts : posts.filter((p) => p.frontmatter?.tag === topic)
  const countLabel = `${visible.length} ${visible.length === 1 ? 'post' : 'posts'}`

  return (
    <>
      {topics.length > 1 && (
        <section id="topics" className="scroll-mt-16 border-b border-line">
          <div className="border-b border-line px-6 py-3.5 text-center font-mono text-sm tracking-caps uppercase">
            Filter by topic.{' '}
            <span className="text-brand">
              Showing {topic === ALL_TOPICS ? 'all posts' : topic} →
            </span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
            {topics.map((name) => (
              <TopicTab
                key={name}
                name={name}
                count={
                  name === ALL_TOPICS
                    ? posts.length
                    : posts.filter((p) => p.frontmatter?.tag === name).length
                }
                active={name === topic}
                onSelect={() => setTopic(name)}
              />
            ))}
          </div>
        </section>
      )}

      <section id="writing" className="scroll-mt-16 border-b border-line">
        <SectionHeader title="Writing" meta={countLabel} />
        {layout === 'list' ? (
          <div className="border-t border-line">
            {visible.map((post) => (
              <PostListItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] border-t border-line">
            {visible.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

/** Shared by the pages that render <PostBrowser>; spread into their page queries. */
export const postSummaryFragment = graphql`
  fragment PostSummary on Mdx {
    id
    excerpt
    frontmatter {
      title
      date(formatString: "YYYY-MM-DD")
      slug
      tag
      read
    }
  }
`
