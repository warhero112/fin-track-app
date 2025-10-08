'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, MapPin, Bed, Bath, Square, Star, ArrowRight, GitCompare, Share2, Eye } from 'lucide-react'

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
  agent: {
    name: string
    phone: string
    email: string
    avatar: string
  }
  images: string[]
  coordinates: [number, number]
  available: boolean
  virtualTour?: string
}

interface EnhancedPropertyCardProps {
  property: Property
  onToggleFavorite: (id: number) => void
  onAddToComparison: (property: Property) => void
  onViewDetails: (property: Property) => void
  onContactAgent: (property: Property) => void
  isInComparison?: boolean
  canAddToComparison?: boolean
}

export default function EnhancedPropertyCard({
  property,
  onToggleFavorite,
  onAddToComparison,
  onViewDetails,
  onContactAgent,
  isInComparison = false,
  canAddToComparison = true
}: EnhancedPropertyCardProps) {
  const [imageIndex, setImageIndex] = useState(0)
  const [showQuickActions, setShowQuickActions] = useState(false)

  const formatPrice = (price: number, type: 'rent' | 'sale') => {
    if (type === 'rent') {
      return `¥${price.toLocaleString()}/month`
    } else {
      return `¥${(price / 10000).toLocaleString()}万`
    }
  }

  const getPricePerSqm = (price: number, area: number, type: 'rent' | 'sale') => {
    if (type === 'rent') {
      return `¥${Math.round(price / area).toLocaleString()}/m²`
    } else {
      return `¥${Math.round(price / area / 10000).toLocaleString()}万/m²`
    }
  }

  return (
    <div 
      className="card group hover:shadow-xl transition-all duration-300 relative"
      onMouseEnter={() => setShowQuickActions(true)}
      onMouseLeave={() => setShowQuickActions(false)}
    >
      {/* Property Images */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={property.images?.[imageIndex] || property.image}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Image Navigation */}
        {property.images && property.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === imageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Overlay Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            property.priceType === 'rent' 
              ? 'bg-primary-100 text-primary-800' 
              : 'bg-secondary-100 text-secondary-800'
          }`}>
            {property.priceType === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
          {!property.available && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              Unavailable
            </span>
          )}
          {property.virtualTour && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Virtual Tour
            </span>
          )}
        </div>

        {/* Quick Actions Overlay */}
        {showQuickActions && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-2">
            <button
              onClick={() => onViewDetails(property)}
              className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200"
              title="View Details"
            >
              <Eye className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => onContactAgent(property)}
              className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200"
              title="Contact Agent"
            >
              <ArrowRight className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => onAddToComparison(property)}
              disabled={!canAddToComparison || isInComparison}
              className={`p-3 rounded-full transition-colors duration-200 ${
                isInComparison
                  ? 'bg-green-500 text-white cursor-not-allowed'
                  : canAddToComparison
                  ? 'bg-white hover:bg-gray-100'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title={isInComparison ? 'In Comparison' : 'Add to Comparison'}
            >
              <GitCompare className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button
            onClick={() => onToggleFavorite(property.id)}
            className={`p-2 rounded-full transition-colors duration-200 ${
              property.isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${property.isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button className="p-2 bg-white text-gray-600 hover:bg-gray-50 rounded-full transition-colors duration-200">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
              {property.title}
            </h3>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{property.location}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{property.rating}</span>
          </div>
        </div>

        {/* Property Specs */}
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

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between mb-2">
            <div className="text-2xl font-bold text-primary-600">
              {formatPrice(property.price, property.priceType)}
            </div>
            <div className="text-sm text-gray-500">
              {getPricePerSqm(property.price, property.area, property.priceType)}
            </div>
          </div>
          
          {/* Features */}
          <div className="flex flex-wrap gap-1 mb-4">
            {property.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {feature}
              </span>
            ))}
            {property.features.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{property.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Agent Info */}
        <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <Image
            src={property.agent.avatar}
            alt={property.agent.name}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{property.agent.name}</div>
            <div className="text-xs text-gray-600">Real Estate Agent</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button 
            onClick={() => onViewDetails(property)}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onContactAgent(property)}
              className="btn-secondary text-sm py-2"
            >
              Contact Agent
            </button>
            <button 
              onClick={() => onAddToComparison(property)}
              disabled={!canAddToComparison || isInComparison}
              className={`text-sm py-2 rounded-lg transition-colors duration-200 ${
                isInComparison
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : canAddToComparison
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isInComparison ? 'In Comparison' : 'Compare'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}