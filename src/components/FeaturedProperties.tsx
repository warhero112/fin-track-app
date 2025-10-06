'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, MapPin, Bed, Bath, Square, Star, ArrowRight, Share, Train } from 'lucide-react'

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
  layout: string
  nearest_station: string
  walk_time_minutes: number
  property_type: string
  furnished: boolean
  pets_allowed: boolean
  has_balcony: boolean
  availability_status: 'available' | 'pending' | 'rented'
}

const featuredProperties: Property[] = [
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
    layout: '3LDK',
    nearest_station: 'Roppongi Station',
    walk_time_minutes: 8,
    property_type: 'house',
    furnished: false,
    pets_allowed: true,
    has_balcony: false,
    availability_status: 'available'
  },
  {
    id: 3,
    title: 'Cozy Studio in Harajuku',
    location: 'Harajuku, Tokyo',
    ward: 'Harajuku',
    city: 'Tokyo',
    price: 95000,
    priceType: 'rent',
    bedrooms: 0,
    bathrooms: 1,
    area: 25,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    rating: 4.6,
    isFavorite: false,
    features: ['Furnished', 'Near Station', 'Pet Friendly'],
    layout: 'Studio',
    nearest_station: 'Harajuku Station',
    walk_time_minutes: 3,
    property_type: 'studio',
    furnished: true,
    pets_allowed: true,
    has_balcony: false,
    availability_status: 'available'
  },
  {
    id: 4,
    title: 'Family House in Setagaya',
    location: 'Setagaya, Tokyo',
    ward: 'Setagaya',
    city: 'Tokyo',
    price: 32000000,
    priceType: 'sale',
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    rating: 4.7,
    isFavorite: false,
    features: ['Garden', 'Parking', 'Near School'],
    layout: '4LDK',
    nearest_station: 'Setagaya Station',
    walk_time_minutes: 10,
    property_type: 'house',
    furnished: false,
    pets_allowed: true,
    has_balcony: true,
    availability_status: 'available'
  }
]

export default function FeaturedProperties() {
  const [favorites, setFavorites] = useState<number[]>(
    featuredProperties.filter(p => p.isFavorite).map(p => p.id)
  )

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    )
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

  const handleShare = (property: Property) => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this amazing property: ${property.title}`,
        url: window.location.origin + `/properties/${property.id}`
      })
    } else {
      navigator.clipboard.writeText(window.location.origin + `/properties/${property.id}`)
    }
  }

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties across Tokyo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProperties.map((property) => (
            <div key={property.id} className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white group h-full flex flex-col rounded-lg">
              {/* Property Image */}
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Social-style action buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <button
                    onClick={() => toggleFavorite(property.id)}
                    className={`rounded-full backdrop-blur-sm transition-all duration-200 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center ${
                      favorites.includes(property.id) 
                        ? 'bg-red-500/90 text-white hover:bg-red-600/90' 
                        : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${favorites.includes(property.id) ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleShare(property)}
                    className="rounded-full backdrop-blur-sm bg-white/90 text-gray-600 hover:bg-white hover:text-blue-500 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
                  >
                    <Share className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {/* Property status with emoji */}
                <div className="absolute bottom-3 left-3">
                  <span className="bg-white/95 text-gray-900 backdrop-blur-sm border-0 font-semibold text-xs px-3 py-1 rounded-full">
                    {property.availability_status === 'available' ? '✅ Available' : 
                     property.availability_status === 'pending' ? '⏳ Pending' : '❌ Rented'}
                  </span>
                </div>

                {/* Instagram-style photo count */}
                {property.images?.length > 1 && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-black/50 text-white border-0 text-xs backdrop-blur-sm px-2 py-1 rounded-full">
                      📸 {property.images.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="p-4 sm:p-5 space-y-3 sm:space-y-4 flex-1 flex flex-col">
                <div className="space-y-3 h-full flex flex-col">
                  <div>
                    <h3 className="font-bold text-lg sm:text-xl text-gray-900 line-clamp-2 hover:text-red-600 transition-colors group-hover:text-red-600">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{property.ward}, {property.city}</span>
                    </div>
                  </div>

                  {/* Price with emphasis */}
                  <div className="flex items-baseline justify-between">
                    <div className="flex-1">
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                        {formatPrice(property.price, property.priceType)}
                      </div>
                      <span className="text-sm font-medium text-gray-600">/month</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Size</div>
                      <div className="font-semibold text-gray-700">{property.area}m²</div>
                    </div>
                  </div>

                  {/* Modern stats layout */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
                    {property.layout && (
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1 text-red-500" />
                        <span className="font-medium">{property.layout}</span>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1 text-blue-500" />
                        <span className="font-medium">{property.bathrooms}</span>
                      </div>
                    )}
                  </div>

                  {property.nearest_station && (
                    <div className="flex items-center text-sm text-gray-600 bg-green-50 rounded-lg p-2">
                      <Train className="w-4 h-4 mr-2 flex-shrink-0 text-green-600" />
                      <span className="line-clamp-1">
                        <span className="font-medium">{property.nearest_station}</span>
                        {property.walk_time_minutes && (
                          <span className="text-gray-500"> • {property.walk_time_minutes} min walk</span>
                        )}
                      </span>
                    </div>
                  )}

                  {/* Trendy badges */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {property.property_type && (
                      <span className="px-2 py-1 text-xs border border-gray-200 bg-white rounded-full">
                        🏠 {property.property_type.replace('_', ' ')}
                      </span>
                    )}
                    {property.furnished && (
                      <span className="px-2 py-1 text-xs border border-purple-200 bg-purple-50 text-purple-600 rounded-full">
                        🛋️ Furnished
                      </span>
                    )}
                    {property.pets_allowed && (
                      <span className="px-2 py-1 text-xs border border-green-200 bg-green-50 text-green-600 rounded-full">
                        🐾 Pet OK
                      </span>
                    )}
                    {property.has_balcony && (
                      <span className="px-2 py-1 text-xs border border-blue-200 bg-blue-50 text-blue-600 rounded-full">
                        🌅 Balcony
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2 mx-auto">
            <span>View All Properties</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}