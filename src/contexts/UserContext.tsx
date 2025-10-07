'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role?: 'user' | 'admin'
  preferences: {
    language: 'en' | 'ja'
    currency: 'JPY' | 'USD'
    notifications: boolean
    savedSearches: boolean
  }
  savedProperties: string[]
  comparisonList: string[]
  favoriteProperties: string[]
  searchHistory: string[]
}

interface UserContextType {
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: Partial<User>) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  addToFavorites: (propertyId: string) => void
  removeFromFavorites: (propertyId: string) => void
  addToComparison: (propertyId: string) => void
  removeFromComparison: (propertyId: string) => void
  clearComparison: () => void
  saveSearch: (searchParams: any) => void
  getSavedSearches: () => any[]
  toggleSavedProperty: (propertyId: string) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+81-90-1234-5678',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  preferences: {
    language: 'en',
    currency: 'JPY',
    notifications: true,
    savedSearches: true
  },
  savedProperties: ['1', '3'],
  comparisonList: ['2', '4'],
  favoriteProperties: ['1', '2', '3'],
  searchHistory: ['Shibuya apartments', '2LDK under 200k', 'Pet friendly properties']
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('rentora_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsLoggedIn(true)
    }
  }, [])

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('rentora_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('rentora_user')
    }
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - accept any email/password combination for demo
    if (email && password) {
      const userData = {
        ...mockUser,
        email,
        name: email.split('@')[0]
      }
      setUser(userData)
      setIsLoggedIn(true)
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData))
      }
      return true
    }
    return false
  }

  const register = async (userData: Partial<User>): Promise<boolean> => {
    // Mock registration - in production, this would make an API call
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone,
      avatar: userData.avatar,
      preferences: {
        language: 'en',
        currency: 'JPY',
        notifications: true,
        savedSearches: true
      },
      savedProperties: [],
      comparisonList: [],
      favoriteProperties: [],
      searchHistory: [],
      ...userData
    }
    
    setUser(newUser)
    setIsLoggedIn(true)
    return true
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
      localStorage.removeItem('rentora_user')
    }
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates })
    }
  }

  const addToFavorites = (propertyId: string) => {
    if (user && !user.favoriteProperties.includes(propertyId)) {
      setUser({
        ...user,
        favoriteProperties: [...user.favoriteProperties, propertyId]
      })
    }
  }

  const removeFromFavorites = (propertyId: string) => {
    if (user) {
      setUser({
        ...user,
        favoriteProperties: user.favoriteProperties.filter(id => id !== propertyId)
      })
    }
  }

  const addToComparison = (propertyId: string) => {
    if (user && !user.comparisonList.includes(propertyId) && user.comparisonList.length < 4) {
      setUser({
        ...user,
        comparisonList: [...user.comparisonList, propertyId]
      })
    }
  }

  const removeFromComparison = (propertyId: string) => {
    if (user) {
      setUser({
        ...user,
        comparisonList: user.comparisonList.filter(id => id !== propertyId)
      })
    }
  }

  const clearComparison = () => {
    if (user) {
      setUser({
        ...user,
        comparisonList: []
      })
    }
  }

  const saveSearch = (searchParams: any) => {
    if (user) {
      const searchString = JSON.stringify(searchParams)
      if (!user.searchHistory.includes(searchString)) {
        setUser({
          ...user,
          searchHistory: [searchString, ...user.searchHistory.slice(0, 9)] // Keep last 10 searches
        })
      }
    }
  }

  const getSavedSearches = () => {
    if (user) {
      return user.searchHistory.map(search => JSON.parse(search))
    }
    return []
  }

  const toggleSavedProperty = async (propertyId: string) => {
    if (user) {
      if (user.savedProperties.includes(propertyId)) {
        setUser({
          ...user,
          savedProperties: user.savedProperties.filter(id => id !== propertyId)
        })
      } else {
        setUser({
          ...user,
          savedProperties: [...user.savedProperties, propertyId]
        })
      }
    }
  }

  return (
    <UserContext.Provider value={{
      user,
      isLoggedIn,
      login,
      register,
      logout,
      updateUser,
      addToFavorites,
      removeFromFavorites,
      addToComparison,
      removeFromComparison,
      clearComparison,
      saveSearch,
      getSavedSearches,
      toggleSavedProperty
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}