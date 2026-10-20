import React from 'react'
import { ToggleGroupItem } from '@/components/ui/toggle-group'

interface TopicTabProps {
  name: string
  count: number
}

/** One topic in the filter. Must be rendered inside a `ToggleGroup` (see PostBrowser). */
export function TopicTab({ name, count }: TopicTabProps) {
  return (
    <ToggleGroupItem
      value={name}
      size="lg"
      className="border-r border-b border-line"
    >
      {name}
      <span className="font-mono text-xs font-normal opacity-70">{count}</span>
    </ToggleGroupItem>
  )
}
