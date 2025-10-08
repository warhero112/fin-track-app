'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Grid, List, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useUser } from '@/contexts/UserContext'
import propertyService, { Property, PropertyFilters } from '@/services/PropertyService'
import ModernPropertyCard from './ModernPropertyCard'

interface ModernSearchInterfaceProps {
  onPropertySelect?: (property: Property) => void
  showFilters?: boolean
  showViewToggle?: boolean
}

export default function ModernSearchInterface({ 
  onPropertySelect, 
  showFilters = true, 
  showViewToggle = true 
}: ModernSearchInterfaceProps) {
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

  const handleToggleFavorite = async (propertyId: string) => {
    if (user) {
      await toggleSavedProperty(propertyId)
      loadProperties()
    }
  }

  const handleShare = (property: Property) => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.origin + `/properties/${property.id}`
      })
    } else {
      navigator.clipboard.writeText(window.location.origin + `/properties/${property.id}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by location, property type, or keywords..."
                className="input pl-12 pr-4 py-3"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="btn-primary px-6 py-3"
          >
            Search
          </button>
          {showFilters && (
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="btn-secondary px-6 py-3 flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                showAdvancedFilters ? 'rotate-180' : ''
              }`} />
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
              className="mt-6 pt-6 border-t border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={filters.searchType}
                    onChange={(e) => handleFilterChange('searchType', e.target.value)}
                    className="input"
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
                    className="input"
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
                    className="input"
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
                    className="input"
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
                    className="input w-32"
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
                    className="input w-32"
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
                          ? 'bg-black text-white'
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
                  className="btn-ghost"
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
          <h2 className="heading-3">
            {filteredProperties.length} Properties Found
          </h2>
          <p className="body-regular">
            {filters.location && `in ${filters.location}`}
            {filters.propertyType && ` • ${filters.propertyType}`}
          </p>
        </div>
        
        {showViewToggle && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === 'grid' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === 'list' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      ) : (
        <div className={`${
          viewMode === 'grid' 
            ? 'grid-properties' 
            : 'space-y-4'
        }`}>
          {filteredProperties.map((property) => (
            <ModernPropertyCard
              key={property.id}
              property={property}
              onToggleFavorite={handleToggleFavorite}
              onShare={handleShare}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="heading-3 mb-2">No properties found</h3>
          <p className="body-regular mb-4">Try adjusting your search criteria or filters</p>
          <button
            onClick={clearFilters}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}