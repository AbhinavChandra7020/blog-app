// app/_components/Button.tsx
'use client'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-fern_green text-dark_green hover:bg-fern_green/90 focus:ring-fern_green'
      case 'secondary':
        return 'bg-moss_green text-dark_green hover:bg-moss_green/90 focus:ring-moss_green'
      case 'outline':
        return 'border border-fern_green text-fern_green hover:bg-fern_green hover:text-dark_green focus:ring-fern_green'
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
      default:
        return 'bg-fern_green text-dark_green hover:bg-fern_green/90 focus:ring-fern_green'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm'
      case 'md':
        return 'px-4 py-2 text-base'
      case 'lg':
        return 'px-6 py-3 text-lg'
      default:
        return 'px-4 py-2 text-base'
    }
  }

  const baseClasses = 'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark_green transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  
  return (
    <button
      className={`${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}