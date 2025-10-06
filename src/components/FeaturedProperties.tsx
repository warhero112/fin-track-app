'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, MapPin, Bed, Bath, Square, Star, ArrowRight } from 'lucide-react'

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
}

const featuredProperties: Property[] = [
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
    features: ['Furnished', 'Near Station', 'Balcony']
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
    features: ['Parking', 'Garden', 'Modern Kitchen']
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
    features: ['Furnished', 'Near Station', 'Pet Friendly']
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
    features: ['Garden', 'Parking', 'Near School']
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
      return `¥${price.toLocaleString()}/month`
    } else {
      return `¥${(price / 10000).toLocaleString()}万`
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
            <div key={property.id} className="card group hover:shadow-xl transition-shadow duration-300">
              {/* Property Image */}
              <div className="relative h-64 overflow-hidden">
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
              <div className="p-6">
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

                <button className="w-full btn-primary flex items-center justify-center space-x-2">
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
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