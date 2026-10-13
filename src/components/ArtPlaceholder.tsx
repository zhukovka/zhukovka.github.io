import React from 'react'

interface ArtPlaceholderProps {
  label?: string
}

/** Slot for the hero halftone illustration (grayscale, transparent background). */
export function ArtPlaceholder({ label = 'halftone illustration — grayscale, transparent bg' }: ArtPlaceholderProps) {
  return (
    <div className="relative flex min-h-[420px] items-end justify-end pt-12 pl-12">
      <div className="flex h-full min-h-[380px] w-full items-center justify-center border-t border-l border-line bg-hatch">
        <span className="bg-surface px-2.5 py-1.5 font-mono text-xs text-muted">{label}</span>
      </div>
    </div>
  )
}
