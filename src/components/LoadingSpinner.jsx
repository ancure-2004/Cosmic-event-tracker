import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} text-cosmic-purple animate-spin`} />
        <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-cosmic-blue/30 rounded-full animate-pulse`} />
      </div>
      {text && (
        <p className={`${textSizeClasses[size]} text-white/80 font-medium`}>
          {text}
        </p>
      )}
    </div>
  )
}

export const LoadingSkeleton = ({ className = '', count = 1 }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card animate-pulse">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-6 bg-white/20 rounded w-1/2"></div>
              <div className="h-5 bg-white/20 rounded-full w-16"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-1/2"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 bg-white/20 rounded w-1/3"></div>
              <div className="h-8 bg-white/20 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const SpinnerOverlay = ({ isVisible, text = 'Loading...' }) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/90 rounded-lg p-8 border border-white/20">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  )
}

export default LoadingSpinner