// app/_components/ui/Card.tsx
'use client'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

export default function Card({ 
  children, 
  className = '', 
  hover = true,
  padding = 'md'
}: CardProps) {
  const getCardClasses = () => {
    let classes = 'card rounded-xl shadow-lg transition-all duration-200'
    
    // Add padding
    if (padding === 'sm') {
      classes += ' p-4'
    } else if (padding === 'md') {
      classes += ' p-6'
    } else if (padding === 'lg') {
      classes += ' p-8'
    }
    
    // Add hover effects
    if (hover) {
      classes += ' hover:shadow-xl hover:-translate-y-1'
    }
    
    // Add custom className
    if (className) {
      classes += ` ${className}`
    }
    
    return classes
  }

  return (
    <div className={getCardClasses()}>
      {children}
    </div>
  )
}