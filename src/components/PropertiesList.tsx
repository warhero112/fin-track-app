'use client'

import { useState, useEffect } from 'react'
import { Heart, MapPin, Bed, Bath, Square, Star, Filter, Grid, List, Search, SlidersHorizontal, Train } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '@/contexts/UserContext'
import { useLanguage } from '@/contexts/LanguageContext'
import propertyService, { Property, PropertyFilters } from '@/services/PropertyService'
import Link from 'next/link'

export default function PropertiesList() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
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
  
  const { user, isLoggedIn, toggleSavedProperty } = useUser()
  const { t } = useLanguage()

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
        ...filters,
        keywords: searchQuery
      }
      const data = await propertyService.searchProperties(searchFilters)
      setFilteredProperties(data)
    } catch (error) {
      console.error('Error filtering properties:', error)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (newFilters: Partial<PropertyFilters>) => {
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

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              handleToggleFavorite(property.id)
            }}
            className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors duration-200"
          >
            <Heart 
              className={`w-5 h-5 ${
                property.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`} 
            />
          </button>
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
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.layout || 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.bathrooms || 0}</span>
            </div>
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span>{property.area || property.size_sqm || 0}m²</span>
            </div>
          </div>

          {property.nearest_station && (
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <Train className="w-4 h-4 mr-1" />
              <span>{property.nearest_station}</span>
              {property.walk_time_minutes && (
                <span className="ml-1">({property.walk_time_minutes}min walk)</span>
              )}
            </div>
          )}

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
            {property.has_tatami && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                Tatami
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )

  const PropertyListItem = ({ property }: { property: Property }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      <Link href={`/properties/${property.id}`}>
        <div className="flex">
          <div className="w-64 h-48 flex-shrink-0">
            <img
              src={property.images[0] || '/placeholder-property.jpg'}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-200">
                  {property.title}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.ward}, {property.city}</span>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleToggleFavorite(property.id)
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <Heart 
                  className={`w-5 h-5 ${
                    property.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`} 
                />
              </button>
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
                <Bed className="w-4 h-4 mr-1" />
                <span>{property.layout || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                <span>{property.bathrooms || 0}</span>
              </div>
              <div className="flex items-center">
                <Square className="w-4 h-4 mr-1" />
                <span>{property.area || property.size_sqm || 0}m²</span>
              </div>
              {property.nearest_station && (
                <div className="flex items-center">
                  <Train className="w-4 h-4 mr-1" />
                  <span>{property.nearest_station} ({property.walk_time_minutes}min)</span>
                </div>
              )}
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {property.description}
            </p>

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
              {property.has_tatami && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  Tatami
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Properties</h1>
          <p className="text-gray-600">Find your perfect home in Japan</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by location, property type, or keywords..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Property Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type
                    </label>
                    <select
                      value={filters.propertyType || ''}
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
                        value={filters.priceRange?.min || ''}
                        onChange={(e) => handleFilterChange({ 
                          priceRange: { 
                            ...filters.priceRange!, 
                            min: parseInt(e.target.value) || 0 
                          } 
                        })}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange?.max || ''}
                        onChange={(e) => handleFilterChange({ 
                          priceRange: { 
                            ...filters.priceRange!, 
                            max: parseInt(e.target.value) || 1000000 
                          } 
                        })}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <select
                      value={filters.bedrooms || 0}
                      onChange={(e) => handleFilterChange({ bedrooms: parseInt(e.target.value) })}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={filters.sortBy || 'newest'}
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
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
        </div>

        {/* Properties Grid/List */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {filteredProperties.map((property) => (
                <PropertyListItem key={property.id} property={property} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results */}
        {filteredProperties.length === 0 && !isLoading && (
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
                  bedrooms: 0,
                  bathrooms: 0,
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
    </div>
  )
}