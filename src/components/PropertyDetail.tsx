'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  Heart, MapPin, Bed, Bath, Square, Star, Share2, 
  ArrowLeft, ArrowRight, Phone, Mail, Calendar,
  Wifi, Car, Dog, Coffee, Shield, Users, Home
} from 'lucide-react'

interface Property {
  id: number
  title: string
  location: string
  price: number
  priceType: 'rent' | 'sale'
  bedrooms: number
  bathrooms: number
  area: number
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
  amenities: string[]
  nearby: {
    name: string
    type: string
    distance: string
  }[]
}

const mockProperty: Property = {
  id: 1,
  title: 'Modern Apartment in Shibuya',
  location: 'Shibuya, Tokyo',
  price: 180000,
  priceType: 'rent',
  bedrooms: 2,
  bathrooms: 1,
  area: 65,
  images: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  ],
  rating: 4.8,
  isFavorite: false,
  features: ['Furnished', 'Near Station', 'Balcony'],
  description: 'Beautiful modern apartment in the heart of Shibuya with excellent transport links. This stunning 2-bedroom apartment offers contemporary living in one of Tokyo\'s most vibrant districts. The property features high-quality finishes, modern appliances, and a private balcony with city views.',
  available: true,
  agent: {
    name: 'Yuki Tanaka',
    phone: '+81-90-1234-5678',
    email: 'yuki@rentora.jp',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  amenities: ['WiFi', 'Air Conditioning', 'Parking', 'Pet Friendly', 'Gym', 'Concierge'],
  nearby: [
    { name: 'Shibuya Station', type: 'Train Station', distance: '2 min walk' },
    { name: 'Shibuya Crossing', type: 'Landmark', distance: '5 min walk' },
    { name: 'Shibuya Sky', type: 'Observation Deck', distance: '3 min walk' },
    { name: 'Yoyogi Park', type: 'Park', distance: '10 min walk' }
  ]
}

export default function PropertyDetail({ propertyId }: { propertyId: string }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(mockProperty.isFavorite)
  const [showAllImages, setShowAllImages] = useState(false)

  const property = mockProperty // In a real app, fetch based on propertyId

  const formatPrice = (price: number, type: 'rent' | 'sale') => {
    if (type === 'rent') {
      return `¥${price.toLocaleString()}/month`
    } else {
      return `¥${(price / 10000).toLocaleString()}万`
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Image Gallery */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <Image
          src={property.images[currentImageIndex]}
          alt={property.title}
          fill
          className="object-cover"
        />
        
        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200"
        >
          <ArrowRight className="w-6 h-6 text-gray-700" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {property.images.length}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={toggleFavorite}
            className={`p-3 rounded-full transition-colors duration-200 ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button className="p-3 bg-white text-gray-600 hover:bg-gray-50 rounded-full transition-colors duration-200">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{property.rating}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.priceType === 'rent' 
                        ? 'bg-primary-100 text-primary-800' 
                        : 'bg-secondary-100 text-secondary-800'
                    }`}>
                      {property.priceType === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {formatPrice(property.price, property.priceType)}
                  </div>
                  {property.priceType === 'rent' && (
                    <div className="text-sm text-gray-600">
                      ¥{Math.round(property.price * 0.1).toLocaleString()} deposit
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <Bed className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <Bath className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <Square className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.area}</div>
                  <div className="text-sm text-gray-600">m²</div>
                </div>
                <div className="text-center">
                  <Home className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">2020</div>
                  <div className="text-sm text-gray-600">Built</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                      <Wifi className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Places */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Nearby Places</h2>
              <div className="space-y-3">
                {property.nearby.map((place, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium text-gray-900">{place.name}</div>
                      <div className="text-sm text-gray-600">{place.type}</div>
                    </div>
                    <div className="text-sm text-primary-600 font-medium">{place.distance}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Agent */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Agent</h3>
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src={property.agent.avatar}
                  alt={property.agent.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900">{property.agent.name}</div>
                  <div className="text-sm text-gray-600">Real Estate Agent</div>
                </div>
              </div>
              <div className="space-y-3">
                <button className="w-full btn-primary flex items-center justify-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </button>
                <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Tour</span>
                </button>
              </div>
            </div>

            {/* Quick Inquiry */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Inquiry</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="input-field"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="input-field"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="input-field"
                />
                <textarea
                  placeholder="Your Message"
                  rows={3}
                  className="input-field"
                />
                <button type="submit" className="w-full btn-primary">
                  Send Inquiry
                </button>
              </form>
            </div>

            {/* Image Gallery Thumbnails */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Photos</h3>
              <div className="grid grid-cols-2 gap-2">
                {property.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-20 rounded-lg overflow-hidden ${
                      currentImageIndex === index ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Property image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
                {property.images.length > 4 && (
                  <button
                    onClick={() => setShowAllImages(true)}
                    className="relative h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
                  >
                    <span className="text-sm font-medium text-gray-600">
                      +{property.images.length - 4} more
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}