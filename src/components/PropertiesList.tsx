'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Heart, MapPin, Bed, Bath, Square, Star, Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react'

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
  isFavorite: boolean
  features: string[]
  description: string
  available: boolean
}

const properties: Property[] = [
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
    isFavorite: false,
    features: ['Furnished', 'Near Station', 'Balcony'],
    description: 'Beautiful modern apartment in the heart of Shibuya with excellent transport links.',
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
    isFavorite: true,
    features: ['Parking', 'Garden', 'Modern Kitchen'],
    description: 'Stunning luxury house with premium finishes and excellent location.',
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
    isFavorite: false,
    features: ['Furnished', 'Near Station', 'Pet Friendly'],
    description: 'Perfect studio apartment for young professionals in trendy Harajuku.',
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
    isFavorite: false,
    features: ['Garden', 'Parking', 'Near School'],
    description: 'Spacious family home in quiet residential area with excellent amenities.',
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
    isFavorite: true,
    features: ['City View', 'Rooftop', 'Concierge'],
    description: 'Exclusive penthouse with panoramic city views in prestigious Ginza district.',
    available: true
  },
  {
    id: 6,
    title: 'Traditional House in Kyoto',
    location: 'Kyoto, Kyoto Prefecture',
    price: 28000000,
    priceType: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.8,
    isFavorite: false,
    features: ['Traditional', 'Garden', 'Tatami Rooms'],
    description: 'Beautiful traditional Japanese house with modern amenities in historic Kyoto.',
    available: true
  }
]

export default function PropertiesList() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<number[]>(
    properties.filter(p => p.isFavorite).map(p => p.id)
  )
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    priceRange: '',
    bedrooms: '',
    features: [] as string[]
  })
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    )
  }

  const formatPrice = (price: number, type: 'rent' | 'sale') => {
    if (type === 'rent') {
      return `¥${price.toLocaleString()}/month`
    } else {
      return `¥${(price / 10000).toLocaleString()}万`
    }
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !filters.type || property.priceType === filters.type
    const matchesLocation = !filters.location || property.location.includes(filters.location)
    const matchesBedrooms = !filters.bedrooms || 
      (filters.bedrooms === 'studio' && property.bedrooms === 0) ||
      (filters.bedrooms !== 'studio' && property.bedrooms.toString() === filters.bedrooms)
    
    return matchesSearch && matchesType && matchesLocation && matchesBedrooms
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Property
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Browse our extensive collection of properties across Japan
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search properties..."
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="input-field"
                  >
                    <option value="">All Types</option>
                    <option value="rent">For Rent</option>
                    <option value="sale">For Sale</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="input-field"
                  >
                    <option value="">All Locations</option>
                    <option value="Shibuya">Shibuya</option>
                    <option value="Roppongi">Roppongi</option>
                    <option value="Harajuku">Harajuku</option>
                    <option value="Setagaya">Setagaya</option>
                    <option value="Ginza">Ginza</option>
                    <option value="Kyoto">Kyoto</option>
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Any</option>
                    <option value="studio">Studio</option>
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
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Any Price</option>
                    <option value="under-50k">Under ¥50,000</option>
                    <option value="50k-100k">¥50,000 - ¥100,000</option>
                    <option value="100k-200k">¥100,000 - ¥200,000</option>
                    <option value="200k-300k">¥200,000 - ¥300,000</option>
                    <option value="over-300k">Over ¥300,000</option>
                  </select>
                </div>

                <button className="w-full btn-primary">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Properties List */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredProperties.length} Properties Found
                </h2>
                <p className="text-gray-600">
                  Showing results for your search criteria
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden btn-secondary flex items-center space-x-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Properties Grid/List */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
              : 'space-y-6'
            }>
              {filteredProperties.map((property) => (
                <div key={property.id} className={`card group hover:shadow-xl transition-shadow duration-300 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}>
                  {/* Property Image */}
                  <div className={`relative overflow-hidden ${
                    viewMode === 'list' ? 'w-80 h-48' : 'h-64'
                  }`}>
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                    <button
                      onClick={() => toggleFavorite(property.id)}
                      className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 ${
                        favorites.includes(property.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(property.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Property Details */}
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                        {property.title}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{property.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-4">
                        {property.bedrooms > 0 && (
                          <div className="flex items-center">
                            <Bed className="w-4 h-4 mr-1" />
                            <span>{property.bedrooms}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Bath className="w-4 h-4 mr-1" />
                          <span>{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <Square className="w-4 h-4 mr-1" />
                          <span>{property.area}m²</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-2xl font-bold text-primary-600 mb-2">
                        {formatPrice(property.price, property.priceType)}
                      </div>
                      {viewMode === 'list' && (
                        <p className="text-gray-600 text-sm mb-3">
                          {property.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {property.features.map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button className="w-full btn-primary">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 text-gray-500 hover:text-gray-700">Previous</button>
                <button className="px-3 py-2 bg-primary-600 text-white rounded">1</button>
                <button className="px-3 py-2 text-gray-500 hover:text-gray-700">2</button>
                <button className="px-3 py-2 text-gray-500 hover:text-gray-700">3</button>
                <button className="px-3 py-2 text-gray-500 hover:text-gray-700">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}