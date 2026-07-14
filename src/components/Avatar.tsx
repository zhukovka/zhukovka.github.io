import React from 'react'

interface AvatarProps {
  size?: number
  label?: string
}

export function Avatar({ size = 220, label = 'headshot photo' }: AvatarProps) {
  return (
    <div
      className="rounded-[var(--radius-md)] [background:repeating-linear-gradient(135deg,var(--surface-2),var(--surface-2)_10px,var(--surface-3)_10px,var(--surface-3)_20px)] flex items-center justify-center [font-family:var(--font-mono)] text-[12px] text-[var(--fg-6)] text-center p-[12px] box-border"
      style={{ width: size, height: size }}
    >
      {label}
    </div>
  )
}