import { ButtonHTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all hover:translate-y-[-2px] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
          variant === 'primary' ? 'bg-primary text-white hover:bg-primary-light' : '',
          variant === 'secondary' ? 'bg-dark-light text-white border border-muted' : '',
          variant === 'ghost' ? 'bg-transparent text-gray-400 hover:text-white' : '',
          size === 'sm' ? 'px-3 py-1.5 text-sm' : '',
          size === 'md' ? 'px-4 py-2 text-base' : '',
          size === 'lg' ? 'px-6 py-3 text-lg' : '',
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'