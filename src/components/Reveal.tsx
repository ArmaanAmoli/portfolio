import * as React from 'react'

import { cn } from '@/lib/utils'

interface RevealProps extends React.ComponentProps<'div'> {
  /** Stagger the transition slightly. */
  delay?: 0 | 1 | 2 | 3
  /** Fraction of the element that must be visible before revealing it. */
  threshold?: number
}

/**
 * Fade-up wrapper driven by an IntersectionObserver.
 * Uses CSS transitions only and degrades to fully visible content when
 * `prefers-reduced-motion` is enabled (see `.reveal` in index.css).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  threshold = 0.12,
  ...props
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  // Without IntersectionObserver there is nothing to observe, so the content
  // is shown immediately instead of waiting for a scroll event.
  const [visible, setVisible] = React.useState(
    () => typeof IntersectionObserver === 'undefined',
  )

  React.useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <div
      ref={ref}
      data-visible={visible}
      className={cn(
        'reveal',
        delay === 1 && 'reveal-delay-1',
        delay === 2 && 'reveal-delay-2',
        delay === 3 && 'reveal-delay-3',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
