import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { portfolio } from '@/data/portfolio'

export function Education() {
  return (
    <section
      id='education'
      aria-labelledby='education-heading'
      className='dot-texture relative border-t border-hot/15 bg-void'
    >
      <div className='mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28'>
        <Reveal>
          <SectionHeading
            id='education-heading'
            number='04'
            label='education'
            description='Where the foundations came from.'
          />
        </Reveal>

        <ol className='mt-10 border-l border-hot/25 pl-6 sm:pl-10'>
          {portfolio.education.map((entry, index) => (
            <li key={entry.institution} className='relative pb-10 last:pb-0'>
              <Reveal delay={index === 0 ? 1 : 2}>
                <span
                  aria-hidden='true'
                  className='absolute -left-[1.85rem] top-2 size-2.5 bg-hot sm:-left-[2.85rem]'
                />
                <div className='flex flex-col gap-2 border border-hot/25 bg-void/80 p-6 sm:p-7'>
                  <div className='flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1'>
                    <h3 className='text-lg font-semibold text-star sm:text-xl'>
                      {entry.institution}
                    </h3>
                    <span className='label-mono text-star/45'>{entry.years}</span>
                  </div>
                  <p className='text-sm text-star/65'>
                    {entry.qualification}
                    {entry.detail ? ` · ${entry.detail}` : ''}
                  </p>
                  <p className='text-sm text-star/45'>{entry.location}</p>
                  <p className='label-mono mt-2 text-hot'>{entry.result}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
