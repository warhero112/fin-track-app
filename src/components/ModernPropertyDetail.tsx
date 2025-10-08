'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  Heart, MapPin, Bed, Bath, Square, Star, Share2, 
  ArrowLeft, ArrowRight, Phone, Mail, Calendar, Users,
  Wifi, Car, Dog, Coffee, Shield, Home, Train, Clock,
  Maximize2, Download, Bookmark, MessageCircle, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
    rating: number
    propertiesSold: number
  }
  amenities: string[]
  nearby: {
    name: string
    type: string
    distance: string
    icon: string
  }[]
  virtualTour?: string
  floorPlan?: string
  availabilityStatus: 'available' | 'pending' | 'rented'
  moveInDate: string
  deposit: number
  keyMoney: number
  managementFee: number
}

interface ModernPropertyDetailProps {
  property: Property
  onClose?: () => void
  onToggleFavorite: (id: number) => void
  onContactAgent: (property: Property) => void
  onScheduleTour: (property: Property) => void
}

export default function ModernPropertyDetail({ 
  property, 
  onClose, 
  onToggleFavorite, 
  onContactAgent, 
  onScheduleTour 
}: ModernPropertyDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'amenities' | 'location' | 'agent'>('overview')

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this amazing property: ${property.title}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'amenities', label: 'Amenities', icon: '✨' },
    { id: 'location', label: 'Location', icon: '📍' },
    { id: 'agent', label: 'Agent', icon: '👤' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{property.title}</h1>
                <p className="text-gray-600">{property.ward}, {property.city}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleFavorite(property.id)}
                className={`p-3 rounded-full transition-all duration-200 ${
                  property.isFavorite
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500 shadow-lg'
                }`}
              >
                <Heart className={`w-5 h-5 ${property.isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-500 rounded-full transition-all duration-200 shadow-lg"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl">
                <Image
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  fill
                  className="object-cover cursor-pointer"
                  onClick={() => setShowImageModal(true)}
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg"
                >
                  <ArrowRight className="w-6 h-6 text-gray-700" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${
                    property.availabilityStatus === 'available' 
                      ? 'bg-green-500/90 text-white' 
                      : property.availabilityStatus === 'pending'
                      ? 'bg-yellow-500/90 text-white'
                      : 'bg-red-500/90 text-white'
                  }`}>
                    {property.availabilityStatus === 'available' ? '✅ Available' : 
                     property.availabilityStatus === 'pending' ? '⏳ Pending' : '❌ Rented'}
                  </span>
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={() => setShowImageModal(true)}
                  className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-lg"
                >
                  <Maximize2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Thumbnail Strip */}
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                      currentImageIndex === index ? 'ring-2 ring-red-500' : 'hover:ring-2 hover:ring-gray-300'
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
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h2>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{property.ward}, {property.city}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{property.rating}</span>
                    </div>
                    <div className="text-gray-500">•</div>
                    <div className="text-gray-600">Posted 2 days ago</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-4xl font-bold text-red-600 mb-1">
                    {formatPrice(property.price, property.priceType)}
                  </div>
                  <div className="text-gray-600">
                    {property.priceType === 'rent' ? 'per month' : 'total price'}
                  </div>
                </div>
              </div>

              {/* Property Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Bed className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Bath className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Square className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.area}</div>
                  <div className="text-sm text-gray-600">m²</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Home className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">2020</div>
                  <div className="text-sm text-gray-600">Built</div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                        <p className="text-gray-700 leading-relaxed">{property.description}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {property.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'amenities' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Wifi className="w-5 h-5 text-red-600" />
                          </div>
                          <span className="font-medium text-gray-900">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'location' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Nearby Places</h3>
                        <div className="space-y-3">
                          {property.nearby.map((place, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{place.icon}</span>
                                <div>
                                  <div className="font-medium text-gray-900">{place.name}</div>
                                  <div className="text-sm text-gray-600">{place.type}</div>
                                </div>
                              </div>
                              <div className="text-sm text-red-600 font-medium">{place.distance}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'agent' && (
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl">
                        <Image
                          src={property.agent.avatar}
                          alt={property.agent.name}
                          width={80}
                          height={80}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.agent.name}</h3>
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              <span className="font-medium">{property.agent.rating}</span>
                            </div>
                            <div className="text-gray-600">{property.agent.propertiesSold} properties sold</div>
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => onContactAgent(property)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <Phone className="w-4 h-4" />
                              <span>Call</span>
                            </button>
                            <button
                              onClick={() => onContactAgent(property)}
                              className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <Mail className="w-4 h-4" />
                              <span>Email</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Interested in this property?</h3>
              
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onScheduleTour(property)}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-red-500/25 flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Schedule Tour</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onContactAgent(property)}
                  className="w-full bg-white text-gray-700 font-semibold py-4 px-6 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Contact Agent</span>
                </motion.button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Deposit:</span>
                    <span className="font-medium">{formatPrice(property.deposit, 'rent')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Key Money:</span>
                    <span className="font-medium">{formatPrice(property.keyMoney, 'rent')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Management Fee:</span>
                    <span className="font-medium">{formatPrice(property.managementFee, 'rent')}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Move-in Date:</span>
                    <span>{property.moveInDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Properties */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Similar Properties</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 cursor-pointer">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm">Similar Property {i}</div>
                      <div className="text-red-600 font-semibold text-sm">¥180,000/month</div>
                      <div className="text-gray-500 text-xs">2LDK • 65m²</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-200"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              
              <Image
                src={property.images[currentImageIndex]}
                alt={property.title}
                width={800}
                height={600}
                className="rounded-lg"
              />
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}