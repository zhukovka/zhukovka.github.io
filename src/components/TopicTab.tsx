import React from 'react'

interface TopicTabProps {
  name: string
  count: number
  active: boolean
  onSelect: () => void
}

export function TopicTab({ name, count, active, onSelect }: TopicTabProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={[
        'flex cursor-pointer items-center justify-center gap-2.5 border-r border-b border-line px-3 py-5',
        'text-xl font-semibold tracking-title transition-colors',
        active ? 'bg-brand text-surface' : 'bg-transparent text-ink-soft hover:bg-surface-hover',
      ].join(' ')}
    >
      {name}
      <span className="font-mono text-xs font-normal opacity-70">{count}</span>
    </button>
  )
}
