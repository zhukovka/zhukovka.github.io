import React from 'react'
import { Link } from 'gatsby'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function PostCard({ post }: { post: Queries.PostSummaryFragment }) {
  const { title, date, slug, tag } = post.frontmatter ?? {}
  return (
    <Link to={`/blog/${slug}`} className="group block">
      <Card className="h-full min-h-60 border-r border-b border-line p-7 transition-colors group-hover:bg-surface">
        <CardHeader>
          <Badge>{tag}</Badge>
          <Badge variant="muted">{date}</Badge>
        </CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardFooter className="items-end">
          <CardDescription>{post.excerpt}</CardDescription>
        </CardFooter>
      </Card>
    </Link>
  )
}
