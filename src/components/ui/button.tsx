import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { Slot } from 'radix-ui'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 border border-transparent font-mono text-[0.6875rem] uppercase tracking-[0.3em] whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          'border-hot/40 bg-hot text-void hover:bg-star hover:border-star',
        outline:
          'border-hot/40 bg-transparent text-star hover:bg-hot hover:text-void hover:border-hot',
        ghost:
          'border-transparent bg-transparent text-star/60 hover:text-hot',
        link: 'border-transparent bg-transparent text-hot underline-offset-4 hover:text-star',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 px-3 text-[0.625rem]',
        lg: 'h-12 px-7 text-xs',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot='button'
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button }
