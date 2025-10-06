'use client'

import { motion } from 'framer-motion'

interface ModernLoadingStatesProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'property-card' | 'property-list'
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export default function ModernLoadingStates({ 
  type = 'spinner', 
  size = 'md', 
  text,
  className = '' 
}: ModernLoadingStatesProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  if (type === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`${sizeClasses[size]} border-4 border-gray-200 border-t-red-500 rounded-full`}
        />
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 text-sm font-medium"
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  if (type === 'dots') {
    return (
      <div className={`flex items-center justify-center space-x-2 ${className}`}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.2
            }}
            className={`${sizeClasses[size]} bg-red-500 rounded-full`}
          />
        ))}
        {text && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-3 text-gray-600 text-sm font-medium"
          >
            {text}
          </motion.span>
        )}
      </div>
    )
  }

  if (type === 'pulse') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`${sizeClasses[size]} bg-gradient-to-r from-red-500 to-pink-500 rounded-full`}
        />
        {text && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-3 text-gray-600 text-sm font-medium"
          >
            {text}
          </motion.span>
        )}
      </div>
    )
  }

  if (type === 'skeleton') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  if (type === 'property-card') {
    return (
      <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
        {/* Image Skeleton */}
        <div className="relative h-64 bg-gray-200">
          <motion.div
            animate={{
              background: [
                'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
                'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)'
              ]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0"
          />
        </div>
        
        {/* Content Skeleton */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          
          <div className="flex space-x-4">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          
          <div className="flex space-x-2">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            <div className="h-6 bg-gray-200 rounded-full w-14"></div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'property-list') {
    return (
      <div className={`space-y-6 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex space-x-4">
              {/* Image Skeleton */}
              <div className="w-24 h-24 bg-gray-200 rounded-xl flex-shrink-0">
                <motion.div
                  animate={{
                    background: [
                      'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
                      'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)'
                    ]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="w-full h-full rounded-xl"
                />
              </div>
              
              {/* Content Skeleton */}
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="flex space-x-2">
                  <div className="h-5 bg-gray-200 rounded-full w-12"></div>
                  <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return null
}

// Full page loading component
export function FullPageLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-gray-200 border-t-red-500 rounded-full mx-auto mb-4"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 text-lg font-medium"
        >
          {text}
        </motion.p>
      </div>
    </div>
  )
}

// Search loading component
export function SearchLoading() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-center space-x-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-gray-200 border-t-red-500 rounded-full"
        />
        <span className="text-gray-600 font-medium">Searching properties...</span>
      </div>
    </div>
  )
}

// Map loading component
export function MapLoading() {
  return (
    <div className="relative h-96 bg-gray-100 rounded-2xl overflow-hidden">
      <motion.div
        animate={{
          background: [
            'linear-gradient(45deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
            'linear-gradient(45deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
          />
          <p className="text-white font-medium">Loading map...</p>
        </div>
      </div>
    </div>
  )
}