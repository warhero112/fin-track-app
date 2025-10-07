'use client'

import { useState, useRef } from 'react'
import { 
  Upload, Image as ImageIcon, MapPin, DollarSign, Home, 
  Bed, Bath, Square, Save, RefreshCw, X, Plus, Trash2,
  Eye, CheckCircle, AlertCircle, Info
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PropertyFormData {
  title: string
  description: string
  location: string
  ward: string
  city: string
  price: number
  priceType: 'rent' | 'sale'
  bedrooms: number
  bathrooms: number
  area: number
  layout: string
  propertyType: string
  nearestStation: string
  walkTimeMinutes: number
  furnished: boolean
  petsAllowed: boolean
  hasBalcony: boolean
  availabilityStatus: 'available' | 'pending' | 'rented'
  features: string[]
  images: File[]
  agent: {
    name: string
    phone: string
    email: string
  }
  coordinates: {
    lat: number
    lng: number
  }
}

const initialFormData: PropertyFormData = {
  title: '',
  description: '',
  location: '',
  ward: '',
  city: 'Tokyo',
  price: 0,
  priceType: 'rent',
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
  layout: '',
  propertyType: 'apartment',
  nearestStation: '',
  walkTimeMinutes: 0,
  furnished: false,
  petsAllowed: false,
  hasBalcony: false,
  availabilityStatus: 'available',
  features: [],
  images: [],
  agent: {
    name: '',
    phone: '',
    email: ''
  },
  coordinates: {
    lat: 35.6762,
    lng: 139.6503
  }
}

const propertyTypes = [
  'apartment', 'house', 'studio', '1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3K', '3DK', '3LDK'
]

const availableFeatures = [
  'Pet Friendly', 'Furnished', 'Near Station', 'Balcony', 'Parking',
  'Garden', 'Modern Kitchen', 'City View', 'Rooftop', 'Concierge',
  'Gym', 'Pool', 'Security', 'Elevator', 'Air Conditioning'
]

const wards = [
  'Shibuya', 'Shinjuku', 'Ginza', 'Roppongi', 'Harajuku', 
  'Akihabara', 'Ikebukuro', 'Ueno', 'Asakusa', 'Odaiba', 'Setagaya'
]

export default function PropertyUploadForm() {
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData)
  const [currentStep, setCurrentStep] = useState(1)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const steps = [
    { id: 1, title: 'Basic Information', icon: Home },
    { id: 2, title: 'Property Details', icon: Bed },
    { id: 3, title: 'Images & Location', icon: ImageIcon },
    { id: 4, title: 'Agent & Features', icon: MapPin },
    { id: 5, title: 'Review & Submit', icon: CheckCircle }
  ]

  const updateFormData = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const updateNestedFormData = (parent: keyof PropertyFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent] as any,
        [field]: value
      }
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageFiles]
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const addFeature = (feature: string) => {
    if (!formData.features.includes(feature)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }))
    }
  }

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.ward) newErrors.ward = 'Ward is required'
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0'
    if (formData.area <= 0) newErrors.area = 'Area must be greater than 0'
    if (formData.images.length === 0) newErrors.images = 'At least one image is required'
    if (!formData.agent.name.trim()) newErrors.agentName = 'Agent name is required'
    if (!formData.agent.phone.trim()) newErrors.agentPhone = 'Agent phone is required'
    if (!formData.agent.email.trim()) newErrors.agentEmail = 'Agent email is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      setCurrentStep(1)
      return
    }

    setIsUploading(true)
    setUploadStatus('uploading')
    setUploadProgress(0)

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setUploadStatus('success')
      setFormData(initialFormData)
      setCurrentStep(1)
    } catch (error) {
      setUploadStatus('error')
    } finally {
      setIsUploading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Modern 2LDK Apartment in Shibuya"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={4}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe the property in detail..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Shibuya, Tokyo"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ward *
                </label>
                <select
                  value={formData.ward}
                  onChange={(e) => updateFormData('ward', e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                    errors.ward ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Ward</option>
                  {wards.map(ward => (
                    <option key={ward} value={ward}>{ward}</option>
                  ))}
                </select>
                {errors.ward && <p className="text-red-500 text-sm mt-1">{errors.ward}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => updateFormData('price', parseInt(e.target.value) || 0)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                      errors.price ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="180000"
                  />
                </div>
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Type
                </label>
                <select
                  value={formData.priceType}
                  onChange={(e) => updateFormData('priceType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="rent">For Rent (Monthly)</option>
                  <option value="sale">For Sale (Total)</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <div className="relative">
                  <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.bedrooms || ''}
                    onChange={(e) => updateFormData('bedrooms', parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <div className="relative">
                  <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.bathrooms || ''}
                    onChange={(e) => updateFormData('bathrooms', parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area (m²) *
                </label>
                <div className="relative">
                  <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.area || ''}
                    onChange={(e) => updateFormData('area', parseInt(e.target.value) || 0)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                      errors.area ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="65"
                  />
                </div>
                {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Layout
                </label>
                <select
                  value={formData.layout}
                  onChange={(e) => updateFormData('layout', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Layout</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => updateFormData('propertyType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="studio">Studio</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nearest Station
                </label>
                <input
                  type="text"
                  value={formData.nearestStation}
                  onChange={(e) => updateFormData('nearestStation', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Shibuya Station"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Walk Time (minutes)
                </label>
                <input
                  type="number"
                  value={formData.walkTimeMinutes || ''}
                  onChange={(e) => updateFormData('walkTimeMinutes', parseInt(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability Status
              </label>
              <select
                value={formData.availabilityStatus}
                onChange={(e) => updateFormData('availabilityStatus', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="rented">Rented</option>
              </select>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Images *
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-400 hover:bg-red-50 transition-all duration-200 cursor-pointer"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Click to upload images
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB each
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
            </div>

            {formData.images.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Uploaded Images ({formData.images.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Property ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coordinates
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coordinates.lat}
                    onChange={(e) => updateNestedFormData('coordinates', 'lat', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="35.6762"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coordinates.lng}
                    onChange={(e) => updateNestedFormData('coordinates', 'lng', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="139.6503"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Agent Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agent Name *
                  </label>
                  <input
                    type="text"
                    value={formData.agent.name}
                    onChange={(e) => updateNestedFormData('agent', 'name', e.target.value)}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                      errors.agentName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Yuki Tanaka"
                  />
                  {errors.agentName && <p className="text-red-500 text-sm mt-1">{errors.agentName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.agent.phone}
                    onChange={(e) => updateNestedFormData('agent', 'phone', e.target.value)}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                      errors.agentPhone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="+81-90-1234-5678"
                  />
                  {errors.agentPhone && <p className="text-red-500 text-sm mt-1">{errors.agentPhone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.agent.email}
                    onChange={(e) => updateNestedFormData('agent', 'email', e.target.value)}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                      errors.agentEmail ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="yuki@rentora.jp"
                  />
                  {errors.agentEmail && <p className="text-red-500 text-sm mt-1">{errors.agentEmail}</p>}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Property Features</h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {availableFeatures.map((feature) => (
                    <button
                      key={feature}
                      onClick={() => addFeature(feature)}
                      className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                        formData.features.includes(feature)
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {formData.features.includes(feature) ? '✓ ' : '+ '}{feature}
                    </button>
                  ))}
                </div>

                {formData.features.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center space-x-2"
                        >
                          <span>{feature}</span>
                          <button
                            onClick={() => removeFeature(feature)}
                            className="hover:text-red-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Options</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.furnished}
                    onChange={(e) => updateFormData('furnished', e.target.checked)}
                    className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-gray-700">Furnished</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.petsAllowed}
                    onChange={(e) => updateFormData('petsAllowed', e.target.checked)}
                    className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-gray-700">Pets Allowed</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.hasBalcony}
                    onChange={(e) => updateFormData('hasBalcony', e.target.checked)}
                    className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-gray-700">Has Balcony</span>
                </label>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Property Preview</h3>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {formData.images.length > 0 && (
                      <img
                        src={URL.createObjectURL(formData.images[0])}
                        alt="Property preview"
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{formData.title}</h4>
                    <p className="text-gray-600 mb-4">{formData.location}</p>
                    <p className="text-gray-700 text-sm mb-4">{formData.description}</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-red-600 mb-4">
                      {formData.priceType === 'rent' 
                        ? `¥${formData.price.toLocaleString()}/month`
                        : `¥${(formData.price / 10000).toLocaleString()}万`
                      }
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>Bedrooms: {formData.bedrooms}</div>
                      <div>Bathrooms: {formData.bathrooms}</div>
                      <div>Area: {formData.area}m²</div>
                      <div>Layout: {formData.layout}</div>
                      <div>Type: {formData.propertyType}</div>
                      {formData.nearestStation && (
                        <div>Nearest Station: {formData.nearestStation} ({formData.walkTimeMinutes}min walk)</div>
                      )}
                    </div>
                    {formData.features.length > 0 && (
                      <div className="mt-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">Features:</div>
                        <div className="flex flex-wrap gap-1">
                          {formData.features.map((feature) => (
                            <span
                              key={feature}
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Ready to Submit</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Review your property details above. Once submitted, the property will be published on the website.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload New Property</h1>
          <p className="text-gray-600">Add a new property to the website with detailed information</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    currentStep >= step.id
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <div className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-red-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Previous
            </button>

            <div className="flex space-x-3">
              {currentStep < 5 ? (
                <button
                  onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isUploading}
                  className="px-8 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Submit Property</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Upload Status */}
        <AnimatePresence>
          {uploadStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6"
            >
              {uploadStatus === 'uploading' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-900">Uploading Property...</div>
                      <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {uploadStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-sm font-medium text-green-900">Property Uploaded Successfully!</div>
                      <div className="text-sm text-green-700">The property has been published on the website.</div>
                    </div>
                  </div>
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="text-sm font-medium text-red-900">Upload Failed</div>
                      <div className="text-sm text-red-700">Please try again or contact support.</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}