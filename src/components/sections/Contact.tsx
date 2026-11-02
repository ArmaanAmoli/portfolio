import { ArrowUpRight, Download, Github, Linkedin, Mail } from 'lucide-react'

import { Reveal } from '@/components/Reveal'
import { portfolio } from '@/data/portfolio'

const RESUME_PATH = `${import.meta.env.BASE_URL}Armaan_Resume.pdf`

export function Contact() {
  const mailto = `mailto:${portfolio.links.email}`

  return (
    <section
      id='contact'
      aria-labelledby='contact-heading'
      className='dot-texture relative border-t border-hot/15 bg-void'
    >
      <div className='mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28'>
        <Reveal>
          <div className='flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between'>
            <div className='max-w-2xl'>
              <div className='flex items-center gap-3'>
                <span className='label-mono text-hot'>06</span>
                <span aria-hidden='true' className='h-px w-8 bg-hot/40' />
                <span className='label-mono text-star'>contact</span>
              </div>

              <h2
                id='contact-heading'
                className='mt-6 text-4xl font-semibold tracking-tight text-star sm:text-6xl'
              >
                {portfolio.contact.heading}
              </h2>

              <p className='mt-5 max-w-xl text-sm leading-relaxed text-star/60 sm:text-base'>
                {portfolio.contact.body}
              </p>
            </div>

            <div className='flex flex-col gap-3'>
              <a
                href={mailto}
                className='label-mono inline-flex items-center justify-between gap-4 border border-hot bg-hot px-6 py-4 text-void transition-colors hover:bg-star hover:border-star'
              >
                <span className='inline-flex items-center gap-3'>
                  <Mail className='size-4' aria-hidden='true' />
                  {portfolio.links.email}
                </span>
                <ArrowUpRight className='size-4' aria-hidden='true' />
              </a>

              <div className='flex flex-wrap gap-3'>
                <a
                  href={portfolio.links.github}
                  target='_blank'
                  rel='noreferrer noopener'
                  className='label-mono inline-flex items-center gap-2 border border-hot/40 px-5 py-3 text-star transition-colors hover:bg-hot hover:text-void'
                >
                  <Github className='size-4' aria-hidden='true' />
                  GitHub
                </a>
                <a
                  href={portfolio.links.linkedin}
                  target='_blank'
                  rel='noreferrer noopener'
                  className='label-mono inline-flex items-center gap-2 border border-hot/40 px-5 py-3 text-star transition-colors hover:bg-hot hover:text-void'
                >
                  <Linkedin className='size-4' aria-hidden='true' />
                  LinkedIn
                </a>
                <a
                  href={RESUME_PATH}
                  className='label-mono inline-flex items-center gap-2 border border-hot/40 px-5 py-3 text-star transition-colors hover:bg-hot hover:text-void'
                >
                  <Download className='size-4' aria-hidden='true' />
                  {portfolio.navbar.resumeLabel}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
