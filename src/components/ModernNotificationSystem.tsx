'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, Heart, Bell, Star, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  icon?: string
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number
  persistent?: boolean
}

interface ModernNotificationSystemProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

export default function ModernNotificationSystem({ notifications, onRemove }: ModernNotificationSystemProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm"
          >
            <div className={`p-4 ${
              notification.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' :
              notification.type === 'error' ? 'bg-red-50 border-l-4 border-red-500' :
              notification.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
              'bg-blue-50 border-l-4 border-blue-500'
            }`}>
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  notification.type === 'success' ? 'bg-green-100 text-green-600' :
                  notification.type === 'error' ? 'bg-red-100 text-red-600' :
                  notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {notification.icon ? (
                    <span className="text-lg">{notification.icon}</span>
                  ) : (
                    <>
                      {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                      {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
                      {notification.type === 'warning' && <AlertCircle className="w-5 h-5" />}
                      {notification.type === 'info' && <Info className="w-5 h-5" />}
                    </>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {notification.message}
                  </p>
                  
                  {notification.action && (
                    <button
                      onClick={notification.action.onClick}
                      className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors duration-200"
                    >
                      {notification.action.label}
                    </button>
                  )}
                </div>
                
                <button
                  onClick={() => onRemove(notification.id)}
                  className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    const newNotification = { ...notification, id }
    
    setNotifications(prev => [...prev, newNotification])
    
    // Auto remove after duration (default 5 seconds)
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration || 5000)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  // Predefined notification types
  const notify = {
    success: (title: string, message: string, options?: Partial<Notification>) => 
      addNotification({ type: 'success', title, message, ...options }),
    
    error: (title: string, message: string, options?: Partial<Notification>) => 
      addNotification({ type: 'error', title, message, ...options }),
    
    warning: (title: string, message: string, options?: Partial<Notification>) => 
      addNotification({ type: 'warning', title, message, ...options }),
    
    info: (title: string, message: string, options?: Partial<Notification>) => 
      addNotification({ type: 'info', title, message, ...options }),
    
    propertySaved: (propertyTitle: string) => 
      addNotification({
        type: 'success',
        title: 'Property Saved! 💖',
        message: `${propertyTitle} has been added to your favorites.`,
        icon: '💖',
        action: {
          label: 'View Favorites',
          onClick: () => console.log('Navigate to favorites')
        }
      }),
    
    propertyRemoved: (propertyTitle: string) => 
      addNotification({
        type: 'info',
        title: 'Property Removed',
        message: `${propertyTitle} has been removed from your favorites.`,
        icon: '🗑️'
      }),
    
    comparisonAdded: (propertyTitle: string, count: number) => 
      addNotification({
        type: 'success',
        title: 'Added to Comparison! ⚖️',
        message: `${propertyTitle} added to comparison (${count}/4)`,
        icon: '⚖️',
        action: {
          label: 'View Comparison',
          onClick: () => console.log('Navigate to comparison')
        }
      }),
    
    comparisonFull: () => 
      addNotification({
        type: 'warning',
        title: 'Comparison Full',
        message: 'You can only compare up to 4 properties. Remove one to add another.',
        icon: '⚠️',
        persistent: true
      }),
    
    searchSaved: (searchQuery: string) => 
      addNotification({
        type: 'success',
        title: 'Search Saved! 🔍',
        message: `Your search for "${searchQuery}" has been saved.`,
        icon: '🔍'
      }),
    
    tourScheduled: (propertyTitle: string, date: string) => 
      addNotification({
        type: 'success',
        title: 'Tour Scheduled! 📅',
        message: `Tour scheduled for ${propertyTitle} on ${date}`,
        icon: '📅',
        action: {
          label: 'View Details',
          onClick: () => console.log('Navigate to tour details')
        }
      }),
    
    agentContacted: (agentName: string) => 
      addNotification({
        type: 'success',
        title: 'Message Sent! 💬',
        message: `Your message has been sent to ${agentName}`,
        icon: '💬'
      }),
    
    newPropertyAlert: (propertyTitle: string, location: string) => 
      addNotification({
        type: 'info',
        title: 'New Property Alert! 🏠',
        message: `New property matching your criteria: ${propertyTitle} in ${location}`,
        icon: '🏠',
        action: {
          label: 'View Property',
          onClick: () => console.log('Navigate to property')
        }
      }),
    
    priceDrop: (propertyTitle: string, oldPrice: string, newPrice: string) => 
      addNotification({
        type: 'info',
        title: 'Price Drop! 📉',
        message: `${propertyTitle} price dropped from ${oldPrice} to ${newPrice}`,
        icon: '📉',
        action: {
          label: 'View Property',
          onClick: () => console.log('Navigate to property')
        }
      })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    notify
  }
}