'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Navigation, Maximize2 } from 'lucide-react'

interface Property {
  id: number
  title: string
  location: string
  ward: string
  city: string
  price: number
  priceType: 'rent' | 'sale'
  coordinates: [number, number]
  image: string
  images: string[]
  bedrooms: number
  bathrooms: number
  area: number
  rating: number
  features: string[]
  available: boolean
  isFavorite: boolean
  description: string
  agent: {
    name: string
    phone: string
    email: string
    avatar: string
  }
  layout: string
  nearest_station: string
  walk_time_minutes: number
  property_type: string
  furnished: boolean
  pets_allowed: boolean
  has_balcony: boolean
  availability_status: 'available' | 'pending' | 'rented'
}

interface PropertyMapProps {
  properties: Property[]
  selectedProperty?: Property | null
  onPropertySelect?: (property: Property) => void
  height?: string
}

export default function PropertyMap({ 
  properties, 
  selectedProperty, 
  onPropertySelect,
  height = 'h-96'
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Mock map implementation - in production, you'd use Google Maps or Mapbox
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setMapLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const formatPrice = (price: number, type: 'rent' | 'sale') => {
    if (type === 'rent') {
      return `¥${price.toLocaleString()}/月`
    } else {
      return `¥${(price / 10000).toLocaleString()}万`
    }
  }

  return (
    <div className={`relative ${height} ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Map Container */}
      <div 
        ref={mapRef}
        className={`w-full h-full bg-gray-100 rounded-lg overflow-hidden ${
          isFullscreen ? 'rounded-none' : ''
        }`}
      >
        {!mapLoaded ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
              <div className="absolute inset-0 opacity-20">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#94a3b8" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>
            </div>

            {/* Property Markers */}
            {properties.map((property) => (
              <button
                key={property.id}
                onClick={() => onPropertySelect?.(property)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                  selectedProperty?.id === property.id 
                    ? 'scale-125 z-20' 
                    : 'hover:scale-110 z-10'
                }`}
                style={{
                  left: `${30 + (property.id * 15) % 60}%`,
                  top: `${20 + (property.id * 20) % 60}%`
                }}
              >
                <div className={`relative ${
                  selectedProperty?.id === property.id 
                    ? 'text-primary-600' 
                    : 'text-red-500'
                }`}>
                  <MapPin className="w-8 h-8 drop-shadow-lg" />
                  {selectedProperty?.id === property.id && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 min-w-max">
                      <div className="text-xs font-medium text-gray-900 whitespace-nowrap">
                        {property.title}
                      </div>
                      <div className="text-xs text-primary-600">
                        {formatPrice(property.price, property.priceType)}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors duration-200"
                title="Toggle fullscreen"
              >
                <Maximize2 className="w-4 h-4 text-gray-600" />
              </button>
              <button
                className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors duration-200"
                title="Get directions"
              >
                <Navigation className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
              <div className="text-sm font-medium text-gray-900 mb-2">Legend</div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Properties</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
                <div className="w-4 h-4 bg-primary-100 rounded-full"></div>
                <span>Selected</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Property List Overlay */}
      <div className="absolute top-4 left-4 max-w-xs">
        <div className="bg-white rounded-lg shadow-lg p-4 max-h-80 overflow-y-auto">
          <div className="text-sm font-medium text-gray-900 mb-3">
            Properties on Map ({properties.length})
          </div>
          <div className="space-y-2">
            {properties.map((property) => (
              <button
                key={property.id}
                onClick={() => onPropertySelect?.(property)}
                className={`w-full text-left p-2 rounded-lg transition-colors duration-200 ${
                  selectedProperty?.id === property.id 
                    ? 'bg-primary-50 border border-primary-200' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="text-xs font-medium text-gray-900 truncate">
                  {property.title}
                </div>
                <div className="text-xs text-gray-600">
                  {formatPrice(property.price, property.priceType)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Close Button */}
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <span className="text-lg">×</span>
        </button>
      )}
    </div>
  )
}