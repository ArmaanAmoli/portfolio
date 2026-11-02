import { portfolio } from '@/data/portfolio'

// Computed once at module scope: the year cannot change during a session.
const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className='border-t border-hot/20 bg-void'>
      <div className='mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8'>
        <p className='label-mono text-star/45'>
          © {YEAR} {portfolio.identity.name} · {portfolio.footer.note}
        </p>
        <a
          href='#hero'
          className='label-mono text-star/45 transition-colors hover:text-hot'
        >
          back to top ↑
        </a>
      </div>
    </footer>
  )
}
