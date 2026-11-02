import * as React from 'react'
import { Download, Menu, X } from 'lucide-react'

import { portfolio } from '@/data/portfolio'

const RESUME_PATH = `${import.meta.env.BASE_URL}Armaan_Resume.pdf`

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('hero')
      const threshold = hero ? hero.offsetHeight - 72 : 80
      setScrolled(window.scrollY > threshold)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || menuOpen
          ? 'border-b border-hot/30 bg-[#050309]/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav
        aria-label='Primary'
        className='mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8'
      >
        <a
          href='#hero'
          onClick={closeMenu}
          className='label-mono text-star transition-colors hover:text-hot'
        >
          {portfolio.navbar.wordmark}
        </a>

        <div className='hidden items-center gap-7 md:flex'>
          {portfolio.navbar.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className='label-mono text-star/60 transition-colors hover:text-hot'
            >
              {link.label}
            </a>
          ))}
          {/* <a
            href={RESUME_PATH}
            className='label-mono inline-flex items-center gap-2 border border-hot/40 px-4 py-2 text-star transition-colors hover:bg-hot hover:text-void'
          >
            <Download className='size-3.5' aria-hidden='true' />
            {portfolio.navbar.resumeLabel}
          </a> */}
        </div>

        <button
          type='button'
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls='mobile-menu'
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className='inline-flex size-10 items-center justify-center border border-hot/40 text-star transition-colors hover:bg-hot hover:text-void md:hidden'
        >
          {menuOpen ? (
            <X className='size-5' aria-hidden='true' />
          ) : (
            <Menu className='size-5' aria-hidden='true' />
          )}
        </button>
      </nav>

      {menuOpen ? (
        <div
          id='mobile-menu'
          className='border-t border-hot/30 bg-[#050309]/95 backdrop-blur-md md:hidden'
        >
          <ul className='flex flex-col px-5 py-4 sm:px-8'>
            {portfolio.navbar.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={closeMenu}
                  className='label-mono block border-b border-hot/15 py-3 text-star/70 transition-colors hover:text-hot'
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className='pt-4'>
              <a
                href={RESUME_PATH}
                onClick={closeMenu}
                className='label-mono inline-flex items-center gap-2 border border-hot/40 px-4 py-3 text-star transition-colors hover:bg-hot hover:text-void'
              >
                <Download className='size-3.5' aria-hidden='true' />
                {portfolio.navbar.resumeLabel}
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  )
}
