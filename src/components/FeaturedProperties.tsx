'use client'

import { useState, useEffect } from 'react'
import { Heart, MapPin, Bed, Bath, Square, Train, Share, Star, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useUser } from '@/contexts/UserContext'
import propertyService, { Property } from '@/services/PropertyService'

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()
  const { user, toggleSavedProperty } = useUser()

  useEffect(() => {
    loadFeaturedProperties()
  }, [])

  const loadFeaturedProperties = async () => {
    try {
      const data = await propertyService.getFeaturedProperties()
      setProperties(data)
    } catch (error) {
      console.error('Error loading featured properties:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number, priceType: string) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleToggleFavorite = async (propertyId: string) => {
    if (user) {
      await toggleSavedProperty(propertyId)
      // Refresh properties to update favorite status
      loadFeaturedProperties()
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

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-gray-600">Discover our handpicked selection of premium properties</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
          <p className="text-gray-600">Discover our handpicked selection of premium properties</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Property Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={property.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Action Buttons */}
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
                  <button
                    onClick={() => handleShare(property)}
                    className="p-2 rounded-full backdrop-blur-sm bg-white/90 text-gray-600 hover:bg-white transition-all duration-200"
                  >
                    <Share className="w-4 h-4" />
                  </button>
                </div>

                {/* Status Badge */}
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-1 bg-white/90 text-gray-900 rounded-full text-xs font-medium">
                    {property.availability_status === 'available' ? '✅ Available' : 
                     property.availability_status === 'pending' ? '⏳ Pending' : '❌ Rented'}
                  </span>
                </div>

                {/* Image Count */}
                {property.images.length > 1 && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-black/50 text-white rounded-full text-xs">
                      📸 {property.images.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="line-clamp-1">{property.ward}, {property.city}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(property.price, property.priceType)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {property.priceType === 'rent' ? '/month' : 'total'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Size</div>
                    <div className="font-semibold text-gray-700">{property.area || property.size_sqm}m²</div>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 rounded-xl p-3 mb-4">
                  {property.layout && (
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1 text-red-500" />
                      <span className="font-medium">{property.layout}</span>
                    </div>
                  )}
                  {property.bathrooms && property.bathrooms > 0 && (
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1 text-blue-500" />
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                  )}
                </div>

                {/* Station Info */}
                {property.nearest_station && (
                  <div className="flex items-center text-sm text-gray-600 bg-green-50 rounded-lg p-2 mb-4">
                    <Train className="w-4 h-4 mr-2 text-green-600" />
                    <span className="line-clamp-1">
                      <span className="font-medium">{property.nearest_station}</span>
                      {property.walk_time_minutes && (
                        <span className="text-gray-500"> • {property.walk_time_minutes} min walk</span>
                      )}
                    </span>
                  </div>
                )}

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {property.property_type && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      🏠 {property.property_type.replace('_', ' ')}
                    </span>
                  )}
                  {property.furnished && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                      🛋️ Furnished
                    </span>
                  )}
                  {property.pets_allowed && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      🐾 Pet OK
                    </span>
                  )}
                  {property.has_balcony && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      🌅 Balcony
                    </span>
                  )}
                </div>

                {/* Agent Info */}
                {property.agent && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {property.agent.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{property.agent.name}</p>
                          {property.agent.rating && (
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600 ml-1">{property.agent.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Contact
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors duration-200 flex items-center space-x-2 mx-auto"
          >
            <span>View All Properties</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </section>
  )
}