'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Home, TrendingUp, Clock, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchSuggestion {
  id: string
  type: 'location' | 'property' | 'feature' | 'recent' | 'trending'
  text: string
  subtitle?: string
  icon?: string
  count?: number
}

interface ModernSearchSuggestionsProps {
  query: string
  onSelect: (suggestion: SearchSuggestion) => void
  onClose: () => void
  isOpen: boolean
}

const mockSuggestions: SearchSuggestion[] = [
  // Locations
  { id: '1', type: 'location', text: 'Shibuya', subtitle: 'Tokyo, Japan', icon: '🏙️', count: 45 },
  { id: '2', type: 'location', text: 'Shinjuku', subtitle: 'Tokyo, Japan', icon: '🏢', count: 38 },
  { id: '3', type: 'location', text: 'Ginza', subtitle: 'Tokyo, Japan', icon: '💎', count: 22 },
  { id: '4', type: 'location', text: 'Roppongi', subtitle: 'Tokyo, Japan', icon: '🌃', count: 31 },
  { id: '5', type: 'location', text: 'Harajuku', subtitle: 'Tokyo, Japan', icon: '🌸', count: 19 },
  
  // Property Types
  { id: '6', type: 'property', text: '2LDK Apartment', subtitle: '2 bedrooms, living, dining, kitchen', icon: '🏠', count: 156 },
  { id: '7', type: 'property', text: '1K Studio', subtitle: '1 room with kitchen', icon: '🏡', count: 89 },
  { id: '8', type: 'property', text: '3LDK House', subtitle: '3 bedrooms, living, dining, kitchen', icon: '🏘️', count: 67 },
  { id: '9', type: 'property', text: 'Penthouse', subtitle: 'Luxury top floor apartment', icon: '🏰', count: 12 },
  
  // Features
  { id: '10', type: 'feature', text: 'Pet Friendly', subtitle: 'Allows pets', icon: '🐾', count: 78 },
  { id: '11', type: 'feature', text: 'Furnished', subtitle: 'Fully furnished', icon: '🛋️', count: 134 },
  { id: '12', type: 'feature', text: 'Near Station', subtitle: 'Walking distance to station', icon: '🚉', count: 203 },
  { id: '13', type: 'feature', text: 'Balcony', subtitle: 'Private outdoor space', icon: '🌅', count: 98 },
  { id: '14', type: 'feature', text: 'Parking', subtitle: 'Car parking available', icon: '🚗', count: 67 },
  
  // Recent Searches
  { id: '15', type: 'recent', text: 'Shibuya 2LDK under 200k', subtitle: 'Searched 2 hours ago', icon: '🕐' },
  { id: '16', type: 'recent', text: 'Pet friendly apartments', subtitle: 'Searched yesterday', icon: '🕐' },
  { id: '17', type: 'recent', text: 'Roppongi furnished', subtitle: 'Searched 3 days ago', icon: '🕐' },
  
  // Trending
  { id: '18', type: 'trending', text: 'AI-Powered Matching', subtitle: 'Find your perfect match', icon: '🤖', count: 342 },
  { id: '19', type: 'trending', text: 'Virtual Tours', subtitle: '3D property viewing', icon: '🥽', count: 189 },
  { id: '20', type: 'trending', text: 'Instant Booking', subtitle: 'Book tours instantly', icon: '⚡', count: 156 }
]

export default function ModernSearchSuggestions({ 
  query, 
  onSelect, 
  onClose, 
  isOpen 
}: ModernSearchSuggestionsProps) {
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState<SearchSuggestion[]>([])
  const [trendingSearches, setTrendingSearches] = useState<SearchSuggestion[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rentora_recent_searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Load trending searches
  useEffect(() => {
    setTrendingSearches(mockSuggestions.filter(s => s.type === 'trending'))
  }, [])

  // Filter suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredSuggestions([])
      return
    }

    const filtered = mockSuggestions.filter(suggestion =>
      suggestion.text.toLowerCase().includes(query.toLowerCase()) ||
      suggestion.subtitle?.toLowerCase().includes(query.toLowerCase())
    )

    // Sort by relevance and type
    const sorted = filtered.sort((a, b) => {
      const aScore = a.text.toLowerCase().startsWith(query.toLowerCase()) ? 1 : 0
      const bScore = b.text.toLowerCase().startsWith(query.toLowerCase()) ? 1 : 0
      return bScore - aScore
    })

    setFilteredSuggestions(sorted)
    setSelectedIndex(0)
  }, [query])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        )
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredSuggestions[selectedIndex]) {
          handleSelect(filteredSuggestions[selectedIndex])
        }
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredSuggestions, selectedIndex, onClose])

  const handleSelect = (suggestion: SearchSuggestion) => {
    // Save to recent searches
    const newRecent = [suggestion, ...recentSearches.filter(s => s.id !== suggestion.id)].slice(0, 5)
    setRecentSearches(newRecent)
    localStorage.setItem('rentora_recent_searches', JSON.stringify(newRecent))
    
    onSelect(suggestion)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('rentora_recent_searches')
  }

  const getIcon = (suggestion: SearchSuggestion) => {
    if (suggestion.icon) return suggestion.icon
    
    switch (suggestion.type) {
      case 'location': return '📍'
      case 'property': return '🏠'
      case 'feature': return '✨'
      case 'recent': return '🕐'
      case 'trending': return '🔥'
      default: return '🔍'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'location': return 'text-blue-600 bg-blue-50'
      case 'property': return 'text-green-600 bg-green-50'
      case 'feature': return 'text-purple-600 bg-purple-50'
      case 'recent': return 'text-gray-600 bg-gray-50'
      case 'trending': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
    >
      <div className="max-h-96 overflow-y-auto">
        {/* Search Results */}
        {query.trim() && filteredSuggestions.length > 0 && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Search Results</h3>
              <span className="text-xs text-gray-500">{filteredSuggestions.length} found</span>
            </div>
            <div className="space-y-1">
              {filteredSuggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSelect(suggestion)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    index === selectedIndex ? 'bg-red-50 border border-red-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{getIcon(suggestion)}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{suggestion.text}</div>
                    {suggestion.subtitle && (
                      <div className="text-sm text-gray-600">{suggestion.subtitle}</div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(suggestion.type)}`}>
                      {suggestion.type}
                    </span>
                    {suggestion.count && (
                      <span className="text-xs text-gray-500">{suggestion.count}</span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {query.trim() && filteredSuggestions.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">Try searching for a different location or property type</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Shibuya', '2LDK', 'Pet Friendly', 'Furnished'].map((term) => (
                <button
                  key={term}
                  onClick={() => onSelect({ id: term, type: 'location', text: term })}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {!query.trim() && recentSearches.length > 0 && (
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Recent Searches
              </h3>
              <button
                onClick={clearRecentSearches}
                className="text-xs text-gray-500 hover:text-red-600 transition-colors duration-200"
              >
                Clear all
              </button>
            </div>
            <div className="space-y-1">
              {recentSearches.map((suggestion) => (
                <motion.button
                  key={suggestion.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSelect(suggestion)}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  <span className="text-2xl">{getIcon(suggestion)}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{suggestion.text}</div>
                    {suggestion.subtitle && (
                      <div className="text-sm text-gray-600">{suggestion.subtitle}</div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Trending Searches */}
        {!query.trim() && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center mb-3">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending Now
            </h3>
            <div className="space-y-1">
              {trendingSearches.map((suggestion) => (
                <motion.button
                  key={suggestion.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSelect(suggestion)}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  <span className="text-2xl">{getIcon(suggestion)}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{suggestion.text}</div>
                    {suggestion.subtitle && (
                      <div className="text-sm text-gray-600">{suggestion.subtitle}</div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-red-600 font-medium">Trending</span>
                    {suggestion.count && (
                      <span className="text-xs text-gray-500">{suggestion.count}</span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {!query.trim() && (
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2">
              <button className="p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors duration-200 text-left">
                <div className="font-medium text-gray-900 text-sm">Advanced Search</div>
                <div className="text-xs text-gray-600">Use filters</div>
              </button>
              <button className="p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors duration-200 text-left">
                <div className="font-medium text-gray-900 text-sm">Map View</div>
                <div className="text-xs text-gray-600">Browse on map</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}