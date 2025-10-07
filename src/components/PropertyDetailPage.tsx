'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  ArrowLeft, Heart, Share, MapPin, Bed, Bath, Square, Train, 
  Calendar, Shield, Sparkles, Eye, ChevronLeft, ChevronRight,
  Phone, Mail, MessageCircle, Star, Clock, Users, Home
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import { useLanguage } from '@/contexts/LanguageContext'
import propertyService from '@/services/PropertyService'

interface Property {
  id: string
  title: string
  description: string
  price: number
  priceType: 'rent' | 'buy'
  address: string
  ward: string
  city: string
  prefecture: string
  images: string[]
  layout?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  size_sqm?: number
  property_type?: string
  furnished?: boolean
  pets_allowed?: boolean
  has_balcony?: boolean
  has_tatami?: boolean
  nearest_station?: string
  walk_time_minutes?: number
  deposit_amount?: number
  key_money?: number
  agent?: {
    name: string
    phone: string
    email: string
    avatar?: string
    rating?: number
    properties_sold?: number
  }
  availability_status: 'available' | 'pending' | 'sold'
  created_at: string
  updated_at: string
}

interface PropertyDetailPageProps {
  property: Property
}

export default function PropertyDetailPage({ property }: PropertyDetailPageProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const router = useRouter()
  const { user, isLoggedIn, toggleSavedProperty } = useUser()
  const { t } = useLanguage()

  useEffect(() => {
    if (user && property) {
      const saved = user.savedProperties?.includes(property.id) || false
      setIsSaved(saved)
    }
  }, [user, property])

  const handleSaveProperty = async () => {
    if (!isLoggedIn) {
      // Redirect to login or show auth modal
      router.push('/login')
      return
    }

    setIsLoading(true)
    try {
      await toggleSavedProperty(property.id)
      setIsSaved(!isSaved)
    } catch (error) {
      console.error('Error saving property:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const formatPrice = (price: number, type: 'rent' | 'buy' = 'rent') => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0
    }).format(price)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
          <button 
            onClick={() => router.push('/properties')}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Back to Properties
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Share className="w-4 h-4" />
              </button>
              <button
                onClick={handleSaveProperty}
                disabled={isLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isSaved 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                {property.images.length > 0 ? (
                  <>
                    <div className="relative h-96 md:h-[500px]">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentImageIndex}
                          src={property.images[currentImageIndex]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </AnimatePresence>
                      
                      {property.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      {/* Image counter */}
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {property.images.length}
                      </div>
                    </div>
                    
                    {/* Photo navigation */}
                    {property.images.length > 1 && (
                      <div className="flex gap-2 p-4 overflow-x-auto">
                        {property.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                              index === currentImageIndex ? 'border-red-500' : 'border-gray-200'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`View ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-96 bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <Home className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No photos available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{property.address}</span>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${
                      property.availability_status === 'available' ? 'bg-green-500' :
                      property.availability_status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {property.availability_status}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <Bed className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Layout</p>
                      <p className="text-xl font-semibold">{property.layout || 'N/A'}</p>
                    </div>
                    <div className="text-center">
                      <Bath className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Bathrooms</p>
                      <p className="text-xl font-semibold">{property.bathrooms || 0}</p>
                    </div>
                    <div className="text-center">
                      <Square className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Size</p>
                      <p className="text-xl font-semibold">{property.area || property.size_sqm || 0}m²</p>
                    </div>
                    <div className="text-center">
                      <Train className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Station</p>
                      <p className="text-sm font-semibold">{property.walk_time_minutes || 0}min</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {property.description || "No description available."}
                  </p>
                </div>

                {/* Features */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-3">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.property_type && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {property.property_type.replace('_', ' ')}
                      </span>
                    )}
                    {property.furnished && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Furnished
                      </span>
                    )}
                    {property.pets_allowed && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        Pets Allowed
                      </span>
                    )}
                    {property.has_tatami && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        Tatami Rooms
                      </span>
                    )}
                    {property.has_balcony && (
                      <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
                        Balcony
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & Contact */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatPrice(property.price, property.priceType)}
                  </p>
                  <p className="text-gray-600">
                    {property.priceType === 'rent' ? 'per month' : 'total price'}
                  </p>
                </div>

                {(property.deposit_amount || property.key_money) && (
                  <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                    {property.deposit_amount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deposit:</span>
                        <span className="font-medium">{formatPrice(property.deposit_amount)}</span>
                      </div>
                    )}
                    {property.key_money && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Key Money:</span>
                        <span className="font-medium">{formatPrice(property.key_money)}</span>
                      </div>
                    )}
                  </div>
                )}

                <button 
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Contact Agent
                </button>
                <button 
                  onClick={() => setShowScheduleModal(true)}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Schedule Viewing
                </button>
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Location</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Prefecture</p>
                  <p className="font-medium">{property.prefecture}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">City/Ward</p>
                  <p className="font-medium">{property.ward}, {property.city}</p>
                </div>
                {property.nearest_station && (
                  <div>
                    <p className="text-sm text-gray-600">Nearest Station</p>
                    <p className="font-medium">{property.nearest_station}</p>
                    {property.walk_time_minutes && (
                      <p className="text-sm text-gray-500">{property.walk_time_minutes} minute walk</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Agent Info */}
            {property.agent && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-lg mb-4">Agent</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium">{property.agent.name}</p>
                    {property.agent.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{property.agent.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
                    <Phone className="w-4 h-4" />
                    <span>{property.agent.phone}</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
                    <Mail className="w-4 h-4" />
                    <span>{property.agent.email}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-4">Contact Agent</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Your message..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200">
                  Send Message
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-4">Schedule Viewing</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">Select time</option>
                  <option value="morning">Morning (9:00-12:00)</option>
                  <option value="afternoon">Afternoon (12:00-17:00)</option>
                  <option value="evening">Evening (17:00-20:00)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200">
                  Schedule
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}