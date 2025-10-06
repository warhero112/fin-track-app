'use client'

import { useState } from 'react'
import { X, Plus, Trash2, ArrowRight, Star, MapPin, Bed, Bath, Square } from 'lucide-react'
import Image from 'next/image'

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
  description: string
  agent: {
    name: string
    phone: string
    email: string
  }
}

interface PropertyComparisonProps {
  properties: Property[]
  onRemove: (id: number) => void
  onClear: () => void
  onAddMore: () => void
}

export default function PropertyComparison({ 
  properties, 
  onRemove, 
  onClear, 
  onAddMore 
}: PropertyComparisonProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'location'>('overview')

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

  const allFeatures = Array.from(new Set(properties.flatMap(p => p.features)))

  if (properties.length === 0) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={onAddMore}
          className="bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors duration-200"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 max-h-96">
      <div className="container-custom py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Compare Properties ({properties.length}/4)
            </h3>
            <div className="flex space-x-1">
              {['overview', 'features', 'location'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                    activeTab === tab
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {properties.length < 4 && (
              <button
                onClick={onAddMore}
                className="btn-secondary text-sm px-3 py-1 flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Property</span>
              </button>
            )}
            <button
              onClick={onClear}
              className="text-gray-600 hover:text-red-600 text-sm px-3 py-1 flex items-center space-x-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Property Headers */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}>
              <div className="font-medium text-gray-700">Property</div>
              {properties.map((property) => (
                <div key={property.id} className="relative">
                  <button
                    onClick={() => onRemove(property.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="relative h-24 mb-2">
                      <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
                      {property.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">{property.location}</p>
                    <div className="text-lg font-bold text-primary-600">
                      {formatPrice(property.price, property.priceType)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Rows */}
            {activeTab === 'overview' && (
              <>
                <div className="grid gap-4 py-3 border-t border-gray-100" style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}>
                  <div className="font-medium text-gray-700">Price per m²</div>
                  {properties.map((property) => (
                    <div key={property.id} className="text-sm text-gray-600">
                      {getPricePerSqm(property.price, property.area, property.priceType)}
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 py-3 border-t border-gray-100" style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}>
                  <div className="font-medium text-gray-700">Bedrooms</div>
                  {properties.map((property) => (
                    <div key={property.id} className="text-sm text-gray-600">
                      {property.bedrooms}
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 py-3 border-t border-gray-100" style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}>
                  <div className="font-medium text-gray-700">Bathrooms</div>
                  {properties.map((property) => (
                    <div key={property.id} className="text-sm text-gray-600">
                      {property.bathrooms}
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 py-3 border-t border-gray-100" style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}>
                  <div className="font-medium text-gray-700">Area</div>
                  {properties.map((property) => (
                    <div key={property.id} className="text-sm text-gray-600">
                      {property.area}m²
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 py-3 border-t border-gray-100" style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}>
                  <div className="font-medium text-gray-700">Rating</div>
                  {properties.map((property) => (
                    <div key={property.id} className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{property.rating}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'features' && (
              <div className="grid gap-4 py-3 border-t border-gray-100" style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}>
                <div className="font-medium text-gray-700">Features</div>
                {properties.map((property) => (
                  <div key={property.id} className="space-y-1">
                    {allFeatures.map((feature) => (
                      <div
                        key={feature}
                        className={`text-xs px-2 py-1 rounded ${
                          property.features.includes(feature)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {feature}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'location' && (
              <>
                <div className="grid gap-4 py-3 border-t border-gray-100" style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}>
                  <div className="font-medium text-gray-700">Location</div>
                  {properties.map((property) => (
                    <div key={property.id} className="text-sm text-gray-600">
                      {property.location}
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 py-3 border-t border-gray-100" style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}>
                  <div className="font-medium text-gray-700">Agent</div>
                  {properties.map((property) => (
                    <div key={property.id} className="text-sm text-gray-600">
                      <div>{property.agent.name}</div>
                      <div className="text-xs text-gray-500">{property.agent.phone}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="grid gap-4 py-3 border-t border-gray-100" style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}>
              <div className="font-medium text-gray-700">Actions</div>
              {properties.map((property) => (
                <div key={property.id} className="space-y-2">
                  <button className="w-full btn-primary text-sm py-2 flex items-center justify-center space-x-1">
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button className="w-full btn-secondary text-sm py-2">
                    Contact Agent
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}