import { InputHTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
        )}
        <input
          ref={ref}
          className={twMerge(
            'w-full px-4 py-2.5 bg-dark-light border border-muted rounded-lg',
            'text-white placeholder-gray-500',
            'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
            'transition-colors',
            error && 'border-warning',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-warning">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'