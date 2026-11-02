import { cn } from 'cn'

interface SectionHeadingProps {
  /** Two-digit section number, e.g. "01". */
  number: string
  /** Lowercase section slug, e.g. "about". */  label: string
  /** Optional supporting line under the heading. */
  description?: string
  className?: string
  id?: string
}

export function SectionHeading({
  number,
  label,
  description,
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className='flex items-center gap-3'>
        <span className='label-mono text-hot'>{number}</span>
        <span aria-hidden='true' className='h-px w-8 bg-hot/40' />
        <h2 id={id} className='label-mono text-star'>
          {label}
        </h2>
      </div>
      {description ? (
        <p className='max-w-2xl text-sm leading-relaxed text-star/60'>{description}</p>
      ) : null}
    </div>
  )
}
