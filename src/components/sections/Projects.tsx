import * as React from 'react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'

import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { portfolio, type Project } from '@/data/portfolio'

function TerminalMock() {
  return (
    <div
      aria-hidden='true'
      className='border border-hot/25 bg-void/90 font-mono text-[0.6875rem] leading-relaxed'
    >
      <div className='flex items-center gap-2 border-b border-hot/20 px-4 py-2'>
        <span className='size-2 bg-hot/70' />
        <span className='size-2 bg-wine/70' />
        <span className='size-2 bg-haze' />
        <span className='label-mono-sm ml-2 text-star/40'>babypanda</span>
      </div>
      <div className='space-y-1.5 px-4 py-4 text-star/70'>
        <p>
          <span className='font-semibold text-hot'>$</span> babypanda
        </p>
        <p className='text-star/45'>
          <span className='font-semibold text-hot'>›</span> streaming session · thoughts, answers,
          tool calls
        </p>
        <p className='text-star/45'>
          <span className='font-semibold text-hot'>›</span> mcp tools · filesystem · shell · web
          search
        </p>
        <p className='text-star/45'>
          <span className='font-semibold text-hot'>›</span> memory · project notes persisted
        </p>
        <p>
          <span className='font-semibold text-hot'>$</span>{' '}
          <span className='inline-block h-3 w-1.5 bg-hot/70 align-middle' />
        </p>
      </div>
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = React.useState(false)
  const featured = project.featured === true
  const visibleHighlights = expanded ? project.highlights : project.highlights.slice(0, 5)
  const hasMore = project.highlights.length > 5

  return (
    <article
      className={`relative border border-hot/25 bg-void/85 transition-colors duration-300 hover:border-hot/50 ${
        featured ? 'p-6 sm:p-10' : 'p-6 sm:p-8'
      }`}
    >
      <div className='flex flex-wrap items-center gap-3'>
        {featured ? (
          <span className='border border-hot/60 bg-hot/10 px-3.5 py-1.5 font-mono text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-hot'>
            featured
          </span>
        ) : null}
        <span className='label-mono text-star/40'>0{index + 1} / project</span>
      </div>

      <div className={`mt-5 grid gap-8 ${featured ? 'lg:grid-cols-[1.35fr_1fr]' : ''}`}>
        <div>
          <h3 className='text-2xl font-semibold tracking-tight text-star sm:text-3xl'>
            {project.title}
          </h3>
          <p className='mt-3 max-w-2xl text-sm leading-relaxed text-star/65 sm:text-base'>
            {project.description}
          </p>

          <ul className='mt-6 space-y-2.5'>
            {visibleHighlights.map((highlight) => (
              <li key={highlight} className='flex gap-3 text-sm leading-relaxed text-star/70'>
                <span aria-hidden='true' className='mt-2 size-1.5 shrink-0 bg-hot' />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          {hasMore ? (
            <button
              type='button'
              onClick={() => setExpanded((open) => !open)}
              aria-expanded={expanded}
              className='label-accent mt-5 inline-flex items-center gap-2 text-hot transition-colors hover:text-star'
            >
              {expanded ? 'Fewer details' : 'More details'}
              <ChevronDown
                className={`size-3.5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                aria-hidden='true'
              />
            </button>
          ) : null}

          <ul className='mt-7 flex flex-wrap gap-2'>
            {project.tech.map((tech) => (
              <li
                key={tech}
                className='border border-hot/30 px-3 py-1.5 font-mono text-[0.6875rem] tracking-wider text-star/75'
              >
                {tech}
              </li>
            ))}
          </ul>

          <a
            href={project.repo}
            target='_blank'
            rel='noreferrer noopener'
            className='label-mono mt-8 inline-flex items-center gap-2 border border-hot/40 px-5 py-3 text-star transition-colors hover:bg-hot hover:text-void'
          >
            View on GitHub
            <ArrowUpRight className='size-4' aria-hidden='true' />
          </a>
        </div>

        {featured ? (
          <div className='lg:pt-2'>
            <TerminalMock />
          </div>
        ) : null}
      </div>
    </article>
  )
}

export function Projects() {
  return (
    <section
      id='projects'
      aria-labelledby='projects-heading'
      className='dot-texture relative border-t border-hot/15 bg-void'
    >
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 top-1/4 h-96 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(255,31,90,0.10),transparent_70%)]'
      />

      <div className='relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28'>
        <Reveal>
          <SectionHeading
            id='projects-heading'
            number='03'
            label='projects'
            description='Two builds that cover the space I want to work in: agent tooling and full-stack product surfaces.'
          />
        </Reveal>

        <div className='mt-10 flex flex-col gap-6'>
          {portfolio.projects.map((project, index) => (
            <Reveal key={project.title} delay={1}>
              <ProjectCard project={project} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
