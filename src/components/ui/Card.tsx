import { HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          'bg-dark-light border border-muted rounded-xl p-5',
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'