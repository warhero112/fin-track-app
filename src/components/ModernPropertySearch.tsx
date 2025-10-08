'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, MapPin, Home, DollarSign, Filter, X, SlidersHorizontal, Map, Star, Clock, Users, Heart, Share } from 'lucide-react'
import PropertyMap from './PropertyMap'
import ModernSearchSuggestions from './ModernSearchSuggestions'
import ModernLoadingStates from './ModernLoadingStates'
import { motion, AnimatePresence } from 'framer-motion'
import propertyService, { Property, PropertyFilters } from '@/services/PropertyService'
import { useUser } from '@/contexts/UserContext'
import Link from 'next/link'

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

export default function ModernPropertySearch() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const { user, isLoggedIn, toggleSavedProperty } = useUser()

  const [filters, setFilters] = useState<FilterState>({
    searchType: 'all',
    location: '',
    propertyType: '',
    priceRange: { min: 0, max: 1000000 },
    bedrooms: null,
    bathrooms: null,
    area: { min: 0, max: 200 },
    features: [],
    keywords: '',
    sortBy: 'newest'
  })

  useEffect(() => {
    loadProperties()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [properties, filters, searchQuery])

  const loadProperties = async () => {
    setIsLoading(true)
    try {
      const data = await propertyService.getAllProperties()
      setProperties(data)
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = async () => {
    try {
      const searchFilters: PropertyFilters = {
        searchType: filters.searchType,
        location: filters.location,
        propertyType: filters.propertyType,
        priceRange: filters.priceRange,
        bedrooms: filters.bedrooms || undefined,
        bathrooms: filters.bathrooms || undefined,
        area: filters.area,
        features: filters.features,
        keywords: searchQuery || filters.keywords,
        sortBy: filters.sortBy
      }
      const data = await propertyService.searchProperties(searchFilters)
      setFilteredProperties(data)
    } catch (error) {
      console.error('Error filtering properties:', error)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setShowSuggestions(false)
  }

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleToggleFavorite = async (propertyId: string) => {
    if (!isLoggedIn) {
      // Show login modal or redirect
      return
    }
    
    try {
      await toggleSavedProperty(propertyId)
      // Update local state
      setProperties(prev => 
        prev.map(p => 
          p.id === propertyId ? { ...p, isFavorite: !p.isFavorite } : p
        )
      )
      setFilteredProperties(prev => 
        prev.map(p => 
          p.id === propertyId ? { ...p, isFavorite: !p.isFavorite } : p
        )
      )
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const formatPrice = (price: number, type: 'rent' | 'buy') => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0
    }).format(price)
  }

  const PropertyCard = ({ property }: { property: Property }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      <Link href={`/properties/${property.id}`}>
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={property.images[0] || '/placeholder-property.jpg'}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              property.availability_status === 'available' 
                ? 'bg-green-100 text-green-800' 
                : property.availability_status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {property.availability_status === 'available' ? 'Available' : 
               property.availability_status === 'pending' ? 'Pending' : 'Sold'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={(e) => {
                e.preventDefault()
                handleToggleFavorite(property.id)
              }}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                property.isFavorite 
                  ? 'bg-red-500/90 text-white hover:bg-red-600/90' 
                  : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${property.isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                // Handle share
              }}
              className="p-2 rounded-full backdrop-blur-sm bg-white/90 text-gray-600 hover:bg-white hover:text-blue-500 transition-all duration-200"
            >
              <Share className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-200">
            {property.title}
          </h3>
          
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{property.ward}, {property.city}</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(property.price, property.priceType)}
              </span>
              <span className="text-gray-600 ml-1">
                {property.priceType === 'rent' ? '/month' : ''}
              </span>
            </div>
            {property.agent?.rating && (
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">{property.agent.rating}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Home className="w-4 h-4 mr-1" />
              <span>{property.layout || 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{property.bathrooms || 0}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              <span>{property.area || property.size_sqm || 0}m²</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {property.furnished && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Furnished
              </span>
            )}
            {property.pets_allowed && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                Pet OK
              </span>
            )}
            {property.has_balcony && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                Balcony
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        {/* Search Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Home
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing properties across Japan with our advanced search and AI-powered recommendations
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search by location, property type, or keywords..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSuggestions(e.target.value.length > 0)
              }}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <SlidersHorizontal className="w-6 h-6" />
            </button>
          </div>

          {/* Search Suggestions */}
          <AnimatePresence>
            {showSuggestions && (
              <ModernSearchSuggestions
                query={searchQuery}
                isOpen={showSuggestions}
                onSelect={(suggestion) => handleSearch(suggestion.text)}
                onClose={() => setShowSuggestions(false)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { label: 'All', value: 'all' },
            { label: 'Rent', value: 'rent' },
            { label: 'Buy', value: 'buy' }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleFilterChange({ searchType: filter.value as 'rent' | 'buy' | 'all' })}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                filters.searchType === filter.value
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 rounded-2xl p-6 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="City, ward, or station"
                    value={filters.location}
                    onChange={(e) => handleFilterChange({ location: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange({ propertyType: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange.min || ''}
                      onChange={(e) => handleFilterChange({ 
                        priceRange: { 
                          ...filters.priceRange, 
                          min: parseInt(e.target.value) || 0 
                        } 
                      })}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange.max || ''}
                      onChange={(e) => handleFilterChange({ 
                        priceRange: { 
                          ...filters.priceRange, 
                          max: parseInt(e.target.value) || 1000000 
                        } 
                      })}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="area_asc">Area: Small to Large</option>
                    <option value="area_desc">Area: Large to Small</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">
              Showing {filteredProperties.length} properties
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowMap(false)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                !showMap ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowMap(true)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                showMap ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Map className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <ModernLoadingStates type="property-list" />
        ) : showMap ? (
          <PropertyMap
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onPropertySelect={setSelectedProperty}
            height="h-96"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setFilters({
                  searchType: 'all',
                  location: '',
                  propertyType: '',
                  priceRange: { min: 0, max: 1000000 },
                  bedrooms: null,
                  bathrooms: null,
                  area: { min: 0, max: 200 },
                  features: [],
                  keywords: '',
                  sortBy: 'newest'
                })
              }}
              className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}