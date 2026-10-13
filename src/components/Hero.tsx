import React from 'react'
import { Button } from './Button'
import { MonoText } from './MonoText'
import { ArtPlaceholder } from './ArtPlaceholder'

export function Hero() {
  return (
    <section className="grid min-h-[640px] grid-cols-[repeat(auto-fit,minmax(340px,1fr))] border-b border-line">
      <div className="flex flex-col justify-between gap-14 px-8 pt-16 pb-12">
        <h1 className="m-0 text-[clamp(52px,8vw,96px)] leading-[0.95] font-semibold tracking-display text-brand text-balance">
          Notes from the build log
        </h1>
        <div className="flex max-w-[380px] flex-col gap-[22px]">
          <p className="m-0 font-mono text-[15px] leading-[1.55] tracking-label text-brand uppercase">
            Long-form writing on distributed systems, compilers, and the bugs that live between them
          </p>
          <Button href="/#writing">
            Read the latest <span>→</span>
          </Button>
          <MonoText size="xs">new essay every other tuesday · no tracking</MonoText>
        </div>
      </div>
      <ArtPlaceholder />
    </section>
  )
}
