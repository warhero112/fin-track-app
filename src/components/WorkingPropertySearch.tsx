'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Filter, Grid, List, Heart, Share, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useUser } from '@/contexts/UserContext'
import propertyService, { Property, PropertyFilters } from '@/services/PropertyService'

interface WorkingPropertySearchProps {
  onPropertySelect?: (property: Property) => void
  showFilters?: boolean
  showViewToggle?: boolean
}

export default function WorkingPropertySearch({ 
  onPropertySelect, 
  showFilters = true, 
  showViewToggle = true 
}: WorkingPropertySearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<PropertyFilters>({
    searchType: 'all',
    location: '',
    propertyType: '',
    priceRange: { min: 0, max: 1000000 },
    bedrooms: 0,
    bathrooms: 0,
    area: { min: 0, max: 200 },
    features: [],
    keywords: '',
    sortBy: 'newest'
  })
  
  const { t } = useLanguage()
  const { user, toggleSavedProperty } = useUser()

  // Load properties on component mount
  useEffect(() => {
    loadProperties()
  }, [])

  // Filter properties when filters change
  useEffect(() => {
    filterProperties()
  }, [properties, filters])

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

  const filterProperties = async () => {
    try {
      const filtered = await propertyService.searchProperties(filters)
      setFilteredProperties(filtered)
    } catch (error) {
      console.error('Error filtering properties:', error)
    }
  }

  const handleSearch = async () => {
    setFilters(prev => ({
      ...prev,
      keywords: searchQuery,
      location: searchQuery
    }))
  }

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleFeatureToggle = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features?.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...(prev.features || []), feature]
    }))
  }

  const clearFilters = () => {
    setFilters({
      searchType: 'all',
      location: '',
      propertyType: '',
      priceRange: { min: 0, max: 1000000 },
      bedrooms: 0,
      bathrooms: 0,
      area: { min: 0, max: 200 },
      features: [],
      keywords: '',
      sortBy: 'newest'
    })
    setSearchQuery('')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handlePropertyClick = (property: Property) => {
    if (onPropertySelect) {
      onPropertySelect(property)
    }
  }

  const handleToggleFavorite = async (propertyId: string) => {
    if (user) {
      await toggleSavedProperty(propertyId)
      // Refresh properties to update favorite status
      loadProperties()
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t('search.placeholder')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 font-semibold"
          >
            {t('search.properties')}
          </button>
          {showFilters && (
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>{t('search.filters')}</span>
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={filters.searchType}
                    onChange={(e) => handleFilterChange('searchType', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">All</option>
                    <option value="rent">Rent</option>
                    <option value="buy">Buy</option>
                  </select>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value={0}>Any</option>
                    <option value={1}>1+</option>
                    <option value={2}>2+</option>
                    <option value={3}>3+</option>
                    <option value={4}>4+</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="area_asc">Area: Small to Large</option>
                    <option value="area_desc">Area: Large to Small</option>
                  </select>
                </div>
              </div>

              {/* Price Range */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={filters.priceRange?.min || 0}
                    onChange={(e) => handleFilterChange('priceRange', {
                      ...filters.priceRange,
                      min: parseInt(e.target.value) || 0
                    })}
                    placeholder="Min"
                    className="w-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    value={filters.priceRange?.max || 1000000}
                    onChange={(e) => handleFilterChange('priceRange', {
                      ...filters.priceRange,
                      max: parseInt(e.target.value) || 1000000
                    })}
                    placeholder="Max"
                    className="w-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Features */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'furnished', label: 'Furnished' },
                    { key: 'pets_allowed', label: 'Pets Allowed' },
                    { key: 'has_balcony', label: 'Balcony' },
                    { key: 'has_tatami', label: 'Tatami' }
                  ].map((feature) => (
                    <button
                      key={feature.key}
                      onClick={() => handleFeatureToggle(feature.key)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                        filters.features?.includes(feature.key)
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {feature.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredProperties.length} Properties Found
          </h2>
          <p className="text-gray-600">
            {filters.location && `in ${filters.location}`}
            {filters.propertyType && ` • ${filters.propertyType}`}
          </p>
        </div>
        
        {showViewToggle && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === 'grid' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === 'list' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Properties Grid/List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }`}>
          {filteredProperties.map((property) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Property Image */}
              <div className={`relative ${viewMode === 'list' ? 'w-64 h-48' : 'h-48'}`}>
                <img
                  src={property.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => handleToggleFavorite(property.id)}
                    className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                      property.isFavorite
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${property.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 rounded-full backdrop-blur-sm bg-white/90 text-gray-600 hover:bg-white transition-all duration-200">
                    <Share className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-1 bg-white/90 text-gray-900 rounded-full text-xs font-medium">
                    {property.availability_status}
                  </span>
                </div>
              </div>

              {/* Property Details */}
              <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {formatPrice(property.price)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {property.priceType === 'rent' ? '/month' : 'total'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="line-clamp-1">{property.address}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-4">
                    {property.bedrooms && (
                      <span>{property.bedrooms} bed</span>
                    )}
                    {property.bathrooms && (
                      <span>{property.bathrooms} bath</span>
                    )}
                    {property.area && (
                      <span>{property.area}m²</span>
                    )}
                  </div>
                  {property.walk_time_minutes && (
                    <div className="flex items-center">
                      <span>{property.walk_time_minutes}min walk</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {property.property_type && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {property.property_type}
                      </span>
                    )}
                    {property.furnished && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Furnished
                      </span>
                    )}
                    {property.pets_allowed && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        Pet OK
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handlePropertyClick(property)}
                    className="flex items-center text-red-600 hover:text-red-700 transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">View Details</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}