// app/_components/Input.tsx
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-3 py-2 bg-hunter_green border border-fern_green rounded-md text-mindaro placeholder-moss_green focus:outline-none focus:ring-2 focus:ring-fern_green focus:border-transparent transition-colors'
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : ''

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-moss_green mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input