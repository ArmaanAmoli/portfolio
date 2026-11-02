import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { HalftoneNebula } from '@/components/ui/halftone-nebula'
import { portfolio } from '@/data/portfolio'

// Frozen at module scope so the memoised nebula never remounts or re-renders.
const SKY = { planetX: 0.74, planetY: 0.2 } as const

const mailto = `mailto:${portfolio.links.email}`

export function Hero() {
  return (
    <section
      id='hero'
      aria-label='Introduction'
      className='relative w-full overflow-hidden'
    >
      <HalftoneNebula preset='crimson' params={SKY} height='100svh'>
        <div className='flex h-full flex-col justify-between px-5 pt-24 pb-10 sm:px-8 sm:pt-28 sm:pb-12'>
          <div className='flex items-start justify-between gap-6'>
            <span className='label-mono text-star/70'>{portfolio.identity.heroTopLeft}</span>
            <span className='label-mono hidden text-star/70 sm:block'>
              {portfolio.identity.heroTopRight}
            </span>
          </div>

          <div className='relative max-w-3xl'>
            <div
              aria-hidden='true'
              className='pointer-events-none absolute -inset-x-6 -inset-y-8 -z-10 bg-gradient-to-t from-[#050309]/70 to-transparent'
            />

            <p className='label-mono text-hot'>{portfolio.identity.heroLabel}</p>

            <h1 className='mt-4 text-5xl leading-[0.95] font-semibold tracking-tight text-star sm:text-7xl lg:text-8xl'>
              {portfolio.identity.name}
            </h1>

            <p className='mt-5 text-lg text-star/85 sm:text-xl'>
              {portfolio.identity.heroSubline}
            </p>

            <p className='mt-4 max-w-xl text-sm leading-relaxed text-star/60 sm:text-base'>
              {portfolio.identity.summary}
            </p>

            <div className='pointer-events-auto mt-8 flex flex-wrap items-center gap-3'>
              <Button asChild>
                <a href='#projects'>
                  View projects <ArrowUpRight className='size-4' aria-hidden='true' />
                </a>
              </Button>
              <Button asChild variant='outline'>
                <a href='#contact'>Get in touch</a>
              </Button>
            </div>

            <div className='pointer-events-auto mt-6 flex items-center gap-3'>
              <a
                href={portfolio.links.github}
                target='_blank'
                rel='noreferrer noopener'
                aria-label='GitHub profile'
                className='inline-flex size-10 items-center justify-center border border-hot/40 text-star transition-colors hover:bg-hot hover:text-void'
              >
                <Github className='size-4' aria-hidden='true' />
              </a>
              <a
                href={portfolio.links.linkedin}
                target='_blank'
                rel='noreferrer noopener'
                aria-label='LinkedIn profile'
                className='inline-flex size-10 items-center justify-center border border-hot/40 text-star transition-colors hover:bg-hot hover:text-void'
              >
                <Linkedin className='size-4' aria-hidden='true' />
              </a>
              <a
                href={mailto}
                aria-label='Email Armaan Amoli'
                className='inline-flex size-10 items-center justify-center border border-hot/40 text-star transition-colors hover:bg-hot hover:text-void'
              >
                <Mail className='size-4' aria-hidden='true' />
              </a>
            </div>
          </div>

          <div className='flex items-center gap-3 text-star/45'>
            <span aria-hidden='true' className='label-mono'>
              scroll
            </span>
            <span aria-hidden='true' className='h-px w-16 bg-hot/40' />
          </div>
        </div>
      </HalftoneNebula>
    </section>
  )
}
