import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { portfolio } from '@/data/portfolio'

export function About() {
  return (
    <section
      id='about'
      aria-labelledby='about-heading'
      className='dot-texture relative border-t border-hot/15 bg-void'
    >
      <div className='mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28'>
        <Reveal>
          <SectionHeading
            id='about-heading'
            number='01'
            label='about'
            description='A quick read on where I am and what I am building towards.'
          />
        </Reveal>

        <div className='mt-10 grid gap-8 md:grid-cols-2 md:gap-14'>
          <Reveal delay={1}>
            <p className='text-base leading-relaxed text-star/75 sm:text-lg'>
              {portfolio.about.paragraph}
            </p>
            <p className='mt-5 text-sm leading-relaxed text-star/55'>
              {portfolio.identity.titleLine}
            </p>
          </Reveal>

          <Reveal delay={2}>
            <dl className='border border-hot/25 bg-void/80'>
              {portfolio.about.status.map((row) => (
                <div
                  key={row.key}
                  className='flex flex-col gap-1 border-b border-hot/15 px-5 py-4 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-6'
                >
                  <dt className='label-mono w-32 shrink-0 text-hot/80'>{row.key}</dt>
                  <dd className='text-sm text-star/85'>{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
