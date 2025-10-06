'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, MapPin, Home, DollarSign, Filter, X, SlidersHorizontal, Map } from 'lucide-react'
import PropertyMap from './PropertyMap'

interface Property {
  id: number
  title: string
  location: string
  price: number
  priceType: 'rent' | 'sale'
  bedrooms: number
  bathrooms: number
  area: number
  image: string
  rating: number
  features: string[]
  coordinates: [number, number]
  available: boolean
}

interface SearchFilters {
  searchType: 'rent' | 'buy' | 'all'
  location: string
  propertyType: string
  priceRange: { min: number; max: number }
  bedrooms: number | null
  bathrooms: number | null
  area: { min: number; max: number }
  features: string[]
  keywords: string
}

const mockProperties: Property[] = [
  {
    id: 1,
    title: 'Modern Apartment in Shibuya',
    location: 'Shibuya, Tokyo',
    price: 180000,
    priceType: 'rent',
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.8,
    features: ['Furnished', 'Near Station', 'Balcony'],
    coordinates: [35.6580, 139.7016],
    available: true
  },
  {
    id: 2,
    title: 'Luxury House in Roppongi',
    location: 'Roppongi, Tokyo',
    price: 45000000,
    priceType: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.9,
    features: ['Parking', 'Garden', 'Modern Kitchen'],
    coordinates: [35.6654, 139.7296],
    available: true
  },
  {
    id: 3,
    title: 'Cozy Studio in Harajuku',
    location: 'Harajuku, Tokyo',
    price: 95000,
    priceType: 'rent',
    bedrooms: 0,
    bathrooms: 1,
    area: 25,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.6,
    features: ['Furnished', 'Near Station', 'Pet Friendly'],
    coordinates: [35.6702, 139.7026],
    available: true
  },
  {
    id: 4,
    title: 'Family House in Setagaya',
    location: 'Setagaya, Tokyo',
    price: 32000000,
    priceType: 'sale',
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.7,
    features: ['Garden', 'Parking', 'Near School'],
    coordinates: [35.6368, 139.6503],
    available: true
  },
  {
    id: 5,
    title: 'Penthouse in Ginza',
    location: 'Ginza, Tokyo',
    price: 350000,
    priceType: 'rent',
    bedrooms: 3,
    bathrooms: 2,
    area: 95,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.9,
    features: ['City View', 'Rooftop', 'Concierge'],
    coordinates: [35.6715, 139.7650],
    available: true
  }
]

const locations = [
  'Shibuya', 'Shinjuku', 'Ginza', 'Roppongi', 'Harajuku', 
  'Akihabara', 'Ikebukuro', 'Ueno', 'Asakusa', 'Odaiba', 'Setagaya'
]

const propertyTypes = [
  'Apartment', 'House', 'Studio', '1K', '1DK', '1LDK', '2K', '2DK', '2LDK'
]

const availableFeatures = [
  'Pet Friendly', 'Furnished', 'Near Station', 'Balcony', 'Parking',
  'Garden', 'Modern Kitchen', 'City View', 'Rooftop', 'Concierge'
]

export default function AdvancedPropertySearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    searchType: 'all',
    location: '',
    propertyType: '',
    priceRange: { min: 0, max: 1000000 },
    bedrooms: null,
    bathrooms: null,
    area: { min: 0, max: 500 },
    features: [],
    keywords: ''
  })
  
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [searchResults, setSearchResults] = useState<Property[]>([])

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
    setSearchResults(filteredProperties)
  }, [filteredProperties])

  const updateFilter = (key: keyof SearchFilters, value: any) => {
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
      keywords: ''
    })
  }

  const formatPrice = (price: number, type: 'rent' | 'sale') => {
    if (type === 'rent') {
      return `¥${price.toLocaleString()}/month`
    } else {
      return `¥${(price / 10000).toLocaleString()}万`
    }
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Dream Property
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced search with real-time filtering and interactive map
          </p>
        </div>

        {/* Search Bar */}
        <div className="card max-w-6xl mx-auto p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by keywords, location, or property type..."
                  value={filters.keywords}
                  onChange={(e) => updateFilter('keywords', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center space-x-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {Object.values(filters).some(v => 
                  Array.isArray(v) ? v.length > 0 : v !== '' && v !== null && v !== 0
                ) && (
                  <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    !
                  </span>
                )}
              </button>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <Home className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded ${viewMode === 'map' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <Map className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Type
                  </label>
                  <select
                    value={filters.searchType}
                    onChange={(e) => updateFilter('searchType', e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All Properties</option>
                    <option value="rent">For Rent</option>
                    <option value="buy">For Sale</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => updateFilter('location', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <select
                    value={filters.bedrooms || ''}
                    onChange={(e) => updateFilter('bedrooms', e.target.value ? parseInt(e.target.value) : null)}
                    className="input-field"
                  >
                    <option value="">Any</option>
                    <option value="0">Studio</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4+ Bedrooms</option>
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
                      onChange={(e) => updateFilter('priceRange', { 
                        ...filters.priceRange, 
                        min: parseInt(e.target.value) || 0 
                      })}
                      className="input-field flex-1"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange.max || ''}
                      onChange={(e) => updateFilter('priceRange', { 
                        ...filters.priceRange, 
                        max: parseInt(e.target.value) || 1000000 
                      })}
                      className="input-field flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableFeatures.map((feature) => (
                    <button
                      key={feature}
                      onClick={() => {
                        const newFeatures = filters.features.includes(feature)
                          ? filters.features.filter(f => f !== feature)
                          : [...filters.features, feature]
                        updateFilter('features', newFeatures)
                      }}
                      className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                        filters.features.includes(feature)
                          ? 'bg-primary-100 text-primary-700 border border-primary-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                >
                  <X className="w-4 h-4" />
                  <span>Clear all filters</span>
                </button>
                <div className="text-sm text-gray-600">
                  {searchResults.length} properties found
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="max-w-6xl mx-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((property) => (
                <div key={property.id} className="card group hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        property.priceType === 'rent' 
                          ? 'bg-primary-100 text-primary-800' 
                          : 'bg-secondary-100 text-secondary-800'
                      }`}>
                        {property.priceType === 'rent' ? 'For Rent' : 'For Sale'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {property.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>{property.bedrooms} bed</span>
                      <span>{property.bathrooms} bath</span>
                      <span>{property.area}m²</span>
                    </div>
                    <div className="text-xl font-bold text-primary-600 mb-3">
                      {formatPrice(property.price, property.priceType)}
                    </div>
                    <button 
                      onClick={() => setSelectedProperty(property)}
                      className="w-full btn-primary"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <PropertyMap
              properties={searchResults}
              selectedProperty={selectedProperty}
              onPropertySelect={(property) => setSelectedProperty(property)}
              height="h-96"
            />
          )}
        </div>
      </div>
    </section>
  )
}