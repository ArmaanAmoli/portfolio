import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { portfolio } from '@/data/portfolio'

export function Skills() {
  return (
    <section
      id='skills'
      aria-labelledby='skills-heading'
      className='dot-texture relative border-t border-hot/15 bg-void'
    >
      <div className='mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28'>
        <Reveal>
          <SectionHeading
            id='skills-heading'
            number='02'
            label='skills'
            description='The tools I reach for, grouped by where they sit in the stack.'
          />
        </Reveal>

        <div className='mt-10 grid gap-px border border-hot/20 bg-hot/20 sm:grid-cols-2 lg:grid-cols-3'>
          {portfolio.skills.map((group, index) => (
            <Reveal key={group.title} delay={(index % 3) as 0 | 1 | 2 | 3}>
              <div className='h-full bg-void p-6 transition-colors duration-300 hover:bg-haze/40'>
                <h3 className='label-accent text-hot'>{group.title}</h3>
                <ul className='mt-5 flex flex-wrap gap-2'>
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className='border border-hot/30 px-3 py-1.5 font-mono text-[0.6875rem] tracking-wider text-star/80 transition-shadow duration-300 hover:shadow-[0_0_18px_rgba(255,31,90,0.35)] hover:text-star'
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
