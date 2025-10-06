'use client'

import { useState } from 'react'
import { Search, MapPin, Home, DollarSign, Filter, X, SlidersHorizontal, Map, Star, Clock, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FilterState {
  searchType: 'rent' | 'buy' | 'all'
  location: string
  propertyType: string
  priceRange: { min: number; max: number }
  bedrooms: number | null
  bathrooms: number | null
  area: { min: number; max: number }
  features: string[]
  keywords: string
  sortBy: string
}

interface ModernPropertyFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  onSearch: () => void
  resultCount: number
}

const locations = [
  'Shibuya', 'Shinjuku', 'Ginza', 'Roppongi', 'Harajuku', 
  'Akihabara', 'Ikebukuro', 'Ueno', 'Asakusa', 'Odaiba', 'Setagaya'
]

const propertyTypes = [
  'Apartment', 'House', 'Studio', '1K', '1DK', '1LDK', '2K', '2DK', '2LDK'
]

const availableFeatures = [
  'Pet Friendly', 'Furnished', 'Near Station', 'Balcony', 'Parking',
  'Garden', 'Modern Kitchen', 'City View', 'Rooftop', 'Concierge',
  'Gym', 'Pool', 'Security', 'Elevator', 'Air Conditioning'
]

const sortOptions = [
  { value: 'newest', label: 'Newest First', icon: '🆕' },
  { value: 'price-low', label: 'Price: Low to High', icon: '💰' },
  { value: 'price-high', label: 'Price: High to Low', icon: '💎' },
  { value: 'area-large', label: 'Largest First', icon: '📐' },
  { value: 'rating', label: 'Highest Rated', icon: '⭐' }
]

export default function ModernPropertyFilters({ onFiltersChange, onSearch, resultCount }: ModernPropertyFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchType: 'all',
    location: '',
    propertyType: '',
    priceRange: { min: 0, max: 1000000 },
    bedrooms: null,
    bathrooms: null,
    area: { min: 0, max: 500 },
    features: [],
    keywords: '',
    sortBy: 'newest'
  })
  
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      searchType: 'all',
      location: '',
      propertyType: '',
      priceRange: { min: 0, max: 1000000 },
      bedrooms: null,
      bathrooms: null,
      area: { min: 0, max: 500 },
      features: [],
      keywords: '',
      sortBy: 'newest'
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const activeFiltersCount = Object.values(filters).filter(v => 
    Array.isArray(v) ? v.length > 0 : v !== '' && v !== null && v !== 0 && v !== 'newest'
  ).length

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Main Search Bar */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by keywords, location, or property type..."
                value={filters.keywords}
                onChange={(e) => updateFilter('keywords', e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-lg"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium px-6 py-4 rounded-2xl flex items-center space-x-2 transition-all duration-200"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </motion.button>
            
            <div className="flex bg-gray-100 rounded-2xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <Home className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  viewMode === 'map' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <Map className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-wrap gap-3">
          <span className="text-sm font-medium text-gray-700 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Quick Filters:
          </span>
          {['Pet Friendly', 'Furnished', 'Near Station', 'Balcony', 'Parking'].map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const newFeatures = filters.features.includes(filter)
                  ? filters.features.filter(f => f !== filter)
                  : [...filters.features, filter]
                updateFilter('features', newFeatures)
              }}
              className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                filters.features.includes(filter)
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-gray-50 space-y-6">
              {/* Filter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Search Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Search Type
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All Properties', icon: '🏠' },
                      { value: 'rent', label: 'For Rent', icon: '🔑' },
                      { value: 'buy', label: 'For Sale', icon: '💰' }
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => updateFilter('searchType', option.value)}
                        className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                          filters.searchType === option.value
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <span className="mr-2">{option.icon}</span>
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => updateFilter('location', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Home className="w-4 h-4 inline mr-1" />
                    Property Type
                  </label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => updateFilter('propertyType', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Types</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilter('sortBy', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Price Range (¥)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={filters.priceRange.min || ''}
                      onChange={(e) => updateFilter('priceRange', { 
                        ...filters.priceRange, 
                        min: parseInt(e.target.value) || 0 
                      })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={filters.priceRange.max || ''}
                      onChange={(e) => updateFilter('priceRange', { 
                        ...filters.priceRange, 
                        max: parseInt(e.target.value) || 1000000 
                      })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Features & Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableFeatures.map((feature) => (
                    <motion.button
                      key={feature}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const newFeatures = filters.features.includes(feature)
                          ? filters.features.filter(f => f !== feature)
                          : [...filters.features, feature]
                        updateFilter('features', newFeatures)
                      }}
                      className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                        filters.features.includes(feature)
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {feature}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={clearFilters}
                    className="text-gray-600 hover:text-red-600 flex items-center space-x-2 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear all filters</span>
                  </button>
                  <div className="text-sm text-gray-600">
                    {resultCount} properties found
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onSearch}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-red-500/25"
                >
                  Search Properties
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}