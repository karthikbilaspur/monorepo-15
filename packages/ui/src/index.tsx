import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@repo/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50',
          variant === 'primary' && 'bg-black text-white hover:bg-gray-800',
          variant === 'secondary' && 'border border-gray-300 bg-white hover:bg-gray-50',
          variant === 'ghost' && 'hover:bg-gray-100',
          size === 'sm' && 'px-3 py-1.5 text-sm',
          size === 'md' && 'px-4 py-2 text-sm',
          size === 'lg' && 'px-6 py-3 text-base',
          className
        )}
        {...props}
      />
    )
  }
)

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('bg-white border rounded-lg p-6', className)} {...props} />
)

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn('w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500', className)}
      {...props}
    />
  )
)

export const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'error' | 'warning' }) => (
  <span className={cn(
    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
    variant === 'default' && 'bg-gray-100 text-gray-800',
    variant === 'success' && 'bg-green-100 text-green-800',
    variant === 'error' && 'bg-red-100 text-red-800',
    variant === 'warning' && 'bg-yellow-100 text-yellow-800'
  )}>
    {children}
  </span>
)