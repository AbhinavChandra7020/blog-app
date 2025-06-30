// app/_components/ui/Loading.tsx
interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export default function Loading({ 
  size = 'md', 
  className = '',
  text = 'Loading...'
}: LoadingProps) {
  const getSpinnerClasses = () => {
    let classes = 'animate-spin rounded-full border-2 border-sage-300 border-t-fern-green-500'
    
    if (size === 'sm') {
      classes += ' h-4 w-4'
    } else if (size === 'md') {
      classes += ' h-8 w-8'
    } else if (size === 'lg') {
      classes += ' h-12 w-12'
    }
    
    return classes
  }

  const getContainerClasses = () => {
    let classes = 'flex flex-col items-center justify-center space-y-4'
    
    if (className) {
      classes += ` ${className}`
    }
    
    return classes
  }

  return (
    <div className={getContainerClasses()}>
      <div className={getSpinnerClasses()} />
      {text && (
        <p className="text-muted text-sm">{text}</p>
      )}
    </div>
  )
}