import { ArrowUpRight } from 'lucide-react'

import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { portfolio } from '@/data/portfolio'

export function CompetitiveProgramming() {
  return (
    <section
      id='competitive-programming'
      aria-labelledby='competitive-heading'
      className='dot-texture relative border-t border-hot/15 bg-void'
    >
      <div className='mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28'>
        <Reveal>
          <SectionHeading
            id='competitive-heading'
            number='05'
            label='competitive programming'
            description='Problems solved outside of work — the habit that keeps my fundamentals sharp.'
          />
        </Reveal>

        <div className='mt-10 grid gap-px border border-hot/20 bg-hot/20 sm:grid-cols-2'>
          {portfolio.competitiveProgramming.map((profile, index) => (
            <Reveal key={profile.platform} delay={(index === 0 ? 1 : 2) as 1 | 2}>
              <a
                href={profile.href}
                target='_blank'
                rel='noreferrer noopener'
                className='group flex h-full flex-col gap-3 bg-void p-8 transition-colors duration-300 hover:bg-haze/40 sm:p-10'
              >
                <span className='label-accent text-hot'>{profile.platform}</span>
                <span className='text-5xl font-semibold tracking-tight text-star sm:text-6xl'>
                  {profile.count}
                </span>
                <span className='text-sm text-star/55'>{profile.label}</span>
                <span className='label-mono mt-2 inline-flex items-center gap-2 text-star/45 transition-colors group-hover:text-hot'>
                  view profile
                  <ArrowUpRight className='size-3.5' aria-hidden='true' />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
