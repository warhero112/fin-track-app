'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Share, MapPin, Bed, Bath, Square, Train, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useUser } from '@/contexts/UserContext'
import { Property } from '@/services/PropertyService'

interface ModernPropertyCardProps {
  property: Property
  onToggleFavorite?: (propertyId: string) => void
  onShare?: (property: Property) => void
}

export default function ModernPropertyCard({ 
  property, 
  onToggleFavorite, 
  onShare 
}: ModernPropertyCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { t } = useLanguage()
  const { user } = useUser()

  const formatPrice = (price: number, priceType: string) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onToggleFavorite) {
      onToggleFavorite(property.id)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onShare) {
      onShare(property)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Link href={`/properties/${property.id}`} className="block">
        <div className="card overflow-hidden h-full">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={imageError ? '/placeholder-property.jpg' : property.images[0] || '/placeholder-property.jpg'}
              alt={property.title}
              fill
              className={`object-cover transition-transform duration-500 ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
              onError={() => setImageError(true)}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                  property.isFavorite
                    ? 'bg-red-500 text-white'
                    : 'bg-white/90 text-gray-600 hover:bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${property.isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full backdrop-blur-sm bg-white/90 text-gray-600 hover:bg-white transition-all duration-200"
              >
                <Share className="w-4 h-4" />
              </button>
            </div>

            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                property.availability_status === 'available'
                  ? 'bg-green-100 text-green-800'
                  : property.availability_status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {property.availability_status === 'available' ? 'Available' : 
                 property.availability_status === 'pending' ? 'Pending' : 'Rented'}
              </span>
            </div>

            {/* Image Count */}
            {property.images.length > 1 && (
              <div className="absolute bottom-3 right-3">
                <span className="px-2 py-1 bg-black/50 text-white rounded-full text-xs backdrop-blur-sm">
                  {property.images.length} photos
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Title and Location */}
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-black transition-colors duration-200">
                {property.title}
              </h3>
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="line-clamp-1">{property.ward}, {property.city}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {formatPrice(property.price, property.priceType)}
                </div>
                <div className="text-sm text-gray-600">
                  {property.priceType === 'rent' ? 'per month' : 'total'}
                </div>
              </div>
              {property.area && (
                <div className="text-right">
                  <div className="text-sm text-gray-500">Size</div>
                  <div className="font-semibold text-gray-700">{property.area}m²</div>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                {property.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1 text-gray-400" />
                    <span>{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1 text-gray-400" />
                    <span>{property.bathrooms}</span>
                  </div>
                )}
                {property.layout && (
                  <div className="flex items-center">
                    <Square className="w-4 h-4 mr-1 text-gray-400" />
                    <span>{property.layout}</span>
                  </div>
                )}
              </div>
              {property.walk_time_minutes && (
                <div className="flex items-center text-gray-500">
                  <Train className="w-4 h-4 mr-1" />
                  <span>{property.walk_time_minutes}min</span>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-1">
              {property.property_type && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  {property.property_type.replace('_', ' ')}
                </span>
              )}
              {property.furnished && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  Furnished
                </span>
              )}
              {property.pets_allowed && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  Pet OK
                </span>
              )}
              {property.has_balcony && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                  Balcony
                </span>
              )}
            </div>

            {/* View Details Button */}
            <div className="pt-2">
              <div className="flex items-center text-gray-600 hover:text-black transition-colors duration-200">
                <Eye className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">View Details</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}