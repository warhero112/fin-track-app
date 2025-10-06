'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, MapPin, Home, DollarSign, Filter, X, SlidersHorizontal, Map, Star, Clock, Users } from 'lucide-react'
import PropertyMap from './PropertyMap'
import ModernSearchSuggestions from './ModernSearchSuggestions'
import ModernLoadingStates from './ModernLoadingStates'
import { motion, AnimatePresence } from 'framer-motion'

interface Property {
  id: number
  title: string
  location: string
  ward: string
  city: string
  price: number
  priceType: 'rent' | 'sale'
  bedrooms: number
  bathrooms: number
  area: number
  image: string
  images: string[]
  rating: number
  isFavorite: boolean
  features: string[]
  description: string
  available: boolean
  agent: {
    name: string
    phone: string
    email: string
    avatar: string
  }
  coordinates: [number, number]
  layout: string
  nearest_station: string
  walk_time_minutes: number
  property_type: string
  furnished: boolean
  pets_allowed: boolean
  has_balcony: boolean
  availability_status: 'available' | 'pending' | 'rented'
}

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

const mockProperties: Property[] = [
  {
    id: 1,
    title: 'Modern Apartment in Shibuya',
    location: 'Shibuya, Tokyo',
    ward: 'Shibuya',
    city: 'Tokyo',
    price: 180000,
    priceType: 'rent',
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80'
    ],
    rating: 4.8,
    isFavorite: false,
    features: ['Furnished', 'Near Station', 'Balcony'],
    description: 'Beautiful modern apartment in the heart of Shibuya with excellent transport links.',
    available: true,
    agent: {
      name: 'Yuki Tanaka',
      phone: '+81-90-1234-5678',
      email: 'yuki@rentora.jp',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    coordinates: [35.6580, 139.7016],
    layout: '2LDK',
    nearest_station: 'Shibuya Station',
    walk_time_minutes: 5,
    property_type: 'apartment',
    furnished: true,
    pets_allowed: false,
    has_balcony: true,
    availability_status: 'available'
  },
  {
    id: 2,
    title: 'Luxury House in Roppongi',
    location: 'Roppongi, Tokyo',
    ward: 'Roppongi',
    city: 'Tokyo',
    price: 45000000,
    priceType: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    rating: 4.9,
    isFavorite: true,
    features: ['Parking', 'Garden', 'Modern Kitchen'],
    description: 'Stunning luxury house with premium finishes and excellent location.',
    available: true,
    agent: {
      name: 'Sarah Johnson',
      phone: '+81-90-1234-5679',
      email: 'sarah@rentora.jp',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    coordinates: [35.6654, 139.7296],
    layout: '3LDK',
    nearest_station: 'Roppongi Station',
    walk_time_minutes: 8,
    property_type: 'house',
    furnished: false,
    pets_allowed: true,
    has_balcony: false,
    availability_status: 'available'
  }
]

export default function ModernPropertySearch() {
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
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Real-time filtering
  const filteredProperties = useMemo(() => {
    return mockProperties.filter(property => {
      // Search type filter
      if (filters.searchType !== 'all' && property.priceType !== filters.searchType) {
        return false
      }

      // Location filter
      if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false
      }

      // Keywords filter
      if (filters.keywords && !property.title.toLowerCase().includes(filters.keywords.toLowerCase())) {
        return false
      }

      // Price range filter
      if (property.price < filters.priceRange.min || property.price > filters.priceRange.max) {
        return false
      }

      // Bedrooms filter
      if (filters.bedrooms !== null && property.bedrooms !== filters.bedrooms) {
        return false
      }

      // Bathrooms filter
      if (filters.bathrooms !== null && property.bathrooms !== filters.bathrooms) {
        return false
      }

      // Area filter
      if (property.area < filters.area.min || property.area > filters.area.max) {
        return false
      }

      // Features filter
      if (filters.features.length > 0) {
        const hasAllFeatures = filters.features.every(feature => 
          property.features.includes(feature)
        )
        if (!hasAllFeatures) return false
      }

      return true
    })
  }, [filters])

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [filters])

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
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
  }

  const formatPrice = (price: number, type: 'rent' | 'sale') => {
    if (type === 'rent') {
      return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
        maximumFractionDigits: 0
      }).format(price)
    } else {
      return `¥${(price / 10000).toLocaleString()}万`
    }
  }

  const activeFiltersCount = Object.values(filters).filter(v => 
    Array.isArray(v) ? v.length > 0 : v !== '' && v !== null && v !== 0 && v !== 'newest'
  ).length

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Dream Property
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced search with real-time filtering and interactive map
          </p>
        </motion.div>

        {/* Modern Search Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto mb-8"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Main Search Bar */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by keywords, location, or property type..."
                      value={filters.keywords}
                      onChange={(e) => {
                        updateFilter('keywords', e.target.value)
                        setShowSuggestions(true)
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-lg"
                    />
                  </div>
                  
                  {/* Search Suggestions */}
                  <ModernSearchSuggestions
                    query={filters.keywords}
                    onSelect={(suggestion) => {
                      updateFilter('keywords', suggestion.text)
                      setShowSuggestions(false)
                    }}
                    onClose={() => setShowSuggestions(false)}
                    isOpen={showSuggestions}
                  />
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
                          <option value="Shibuya">Shibuya</option>
                          <option value="Shinjuku">Shinjuku</option>
                          <option value="Ginza">Ginza</option>
                          <option value="Roppongi">Roppongi</option>
                          <option value="Harajuku">Harajuku</option>
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
                          <option value="apartment">Apartment</option>
                          <option value="house">House</option>
                          <option value="studio">Studio</option>
                        </select>
                      </div>

                      {/* Bedrooms */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Bedrooms
                        </label>
                        <select
                          value={filters.bedrooms || ''}
                          onChange={(e) => updateFilter('bedrooms', e.target.value ? parseInt(e.target.value) : null)}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Any</option>
                          <option value="0">Studio</option>
                          <option value="1">1 Bedroom</option>
                          <option value="2">2 Bedrooms</option>
                          <option value="3">3 Bedrooms</option>
                          <option value="4">4+ Bedrooms</option>
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
                          {filteredProperties.length} properties found
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          {isLoading ? (
            <ModernLoadingStates type="property-list" text="Searching properties..." />
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300"
                >
                  {/* Property Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        property.priceType === 'rent' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.priceType === 'rent' ? 'For Rent' : 'For Sale'}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                        ⭐ {property.rating}
                      </span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-200">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{property.ward}, {property.city}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Home className="w-4 h-4 mr-1 text-red-500" />
                          <span>{property.layout}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-blue-500" />
                          <span>{property.walk_time_minutes}min</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1 text-green-500" />
                          <span>{property.area}m²</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-2xl font-bold text-red-600 mb-2">
                        {formatPrice(property.price, property.priceType)}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {property.features.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                        {property.features.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{property.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-red-500/25">
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <PropertyMap
              properties={filteredProperties}
              selectedProperty={selectedProperty}
              onPropertySelect={(property) => setSelectedProperty(property)}
              height="h-96"
            />
          )}
        </motion.div>
      </div>
    </section>
  )
}