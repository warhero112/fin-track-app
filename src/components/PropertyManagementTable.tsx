'use client'

import { useState, useMemo } from 'react'
import { 
  Edit, Trash2, Eye, MoreVertical, Search, Filter, 
  Download, Upload, RefreshCw, Star, MapPin, Home,
  Calendar, DollarSign, Users, Image as ImageIcon
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
  image: string
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
  coordinates: [number, number]
  layout: string
  nearest_station: string
  walk_time_minutes: number
  property_type: string
  furnished: boolean
  pets_allowed: boolean
  has_balcony: boolean
  availability_status: 'available' | 'pending' | 'rented'
  createdAt: string
  updatedAt: string
  views: number
  inquiries: number
}

interface PropertyManagementTableProps {
  searchQuery: string
}

const mockProperties: Property[] = [
  {
    id: 1,
    title: 'Modern Apartment in Shibuya',
    location: 'Shibuya, Tokyo',
    ward: 'Shibuya',
    city: 'Tokyo',
    price: 180000,
    priceType: 'rent',
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80'
    ],
    rating: 4.8,
    isFavorite: false,
    features: ['Furnished', 'Near Station', 'Balcony'],
    description: 'Beautiful modern apartment in the heart of Shibuya with excellent transport links.',
    available: true,
    agent: {
      name: 'Yuki Tanaka',
      phone: '+81-90-1234-5678',
      email: 'yuki@rentora.jp',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    coordinates: [35.6580, 139.7016],
    layout: '2LDK',
    nearest_station: 'Shibuya Station',
    walk_time_minutes: 5,
    property_type: 'apartment',
    furnished: true,
    pets_allowed: false,
    has_balcony: true,
    availability_status: 'available',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    views: 245,
    inquiries: 12
  },
  {
    id: 2,
    title: 'Luxury House in Roppongi',
    location: 'Roppongi, Tokyo',
    ward: 'Roppongi',
    city: 'Tokyo',
    price: 45000000,
    priceType: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    rating: 4.9,
    isFavorite: true,
    features: ['Parking', 'Garden', 'Modern Kitchen'],
    description: 'Stunning luxury house with premium finishes and excellent location.',
    available: true,
    agent: {
      name: 'Sarah Johnson',
      phone: '+81-90-1234-5679',
      email: 'sarah@rentora.jp',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    coordinates: [35.6654, 139.7296],
    layout: '3LDK',
    nearest_station: 'Roppongi Station',
    walk_time_minutes: 8,
    property_type: 'house',
    furnished: false,
    pets_allowed: true,
    has_balcony: false,
    availability_status: 'available',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    views: 189,
    inquiries: 8
  }
]

export default function PropertyManagementTable({ searchQuery }: PropertyManagementTableProps) {
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [selectedProperties, setSelectedProperties] = useState<number[]>([])
  const [sortBy, setSortBy] = useState<'title' | 'price' | 'createdAt' | 'views'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'pending' | 'rented'>('all')
  const [filterType, setFilterType] = useState<'all' | 'rent' | 'sale'>('all')
  const [showBulkActions, setShowBulkActions] = useState(false)

  const filteredAndSortedProperties = useMemo(() => {
    let filtered = properties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || property.availability_status === filterStatus
      const matchesType = filterType === 'all' || property.priceType === filterType
      
      return matchesSearch && matchesStatus && matchesType
    })

    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]
      
      if (sortBy === 'price') {
        aValue = a.price
        bValue = b.price
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [properties, searchQuery, sortBy, sortOrder, filterStatus, filterType])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rented': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSelectProperty = (id: number) => {
    setSelectedProperties(prev => 
      prev.includes(id) 
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedProperties.length === filteredAndSortedProperties.length) {
      setSelectedProperties([])
    } else {
      setSelectedProperties(filteredAndSortedProperties.map(p => p.id))
    }
  }

  const handleDeleteProperty = (id: number) => {
    setProperties(prev => prev.filter(p => p.id !== id))
    setSelectedProperties(prev => prev.filter(pid => pid !== id))
  }

  const handleBulkDelete = () => {
    setProperties(prev => prev.filter(p => !selectedProperties.includes(p.id)))
    setSelectedProperties([])
    setShowBulkActions(false)
  }

  const handleBulkStatusChange = (status: 'available' | 'pending' | 'rented') => {
    setProperties(prev => prev.map(p => 
      selectedProperties.includes(p.id) 
        ? { ...p, availability_status: status }
        : p
    ))
    setSelectedProperties([])
    setShowBulkActions(false)
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Management</h1>
            <p className="text-gray-600">Manage and monitor all properties on the website</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Add Property</span>
            </button>
          </div>
        </div>

        {/* Filters and Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="rented">Rented</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Types</option>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              >
                <option value="createdAt">Date Created</option>
                <option value="title">Title</option>
                <option value="price">Price</option>
                <option value="views">Views</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Properties</p>
                  <p className="text-2xl font-bold text-blue-900">{properties.length}</p>
                </div>
                <Home className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Available</p>
                  <p className="text-2xl font-bold text-green-900">
                    {properties.filter(p => p.availability_status === 'available').length}
                  </p>
                </div>
                <Star className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {properties.filter(p => p.availability_status === 'pending').length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Total Views</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {properties.reduce((sum, p) => sum + p.views, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedProperties.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-red-900">
                    {selectedProperties.length} properties selected
                  </span>
                  <button
                    onClick={() => setSelectedProperties([])}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    onChange={(e) => handleBulkStatusChange(e.target.value as any)}
                    className="px-3 py-1 border border-red-300 rounded text-sm"
                  >
                    <option value="">Change Status</option>
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="rented">Rented</option>
                  </select>
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Properties Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProperties.length === filteredAndSortedProperties.length && filteredAndSortedProperties.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Property</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Views</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedProperties.map((property) => (
                  <motion.tr
                    key={property.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProperties.includes(property.id)}
                        onChange={() => handleSelectProperty(property.id)}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{property.title}</div>
                          <div className="text-sm text-gray-500">
                            {property.bedrooms} bed • {property.bathrooms} bath • {property.area}m²
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500">{property.rating}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{property.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(property.price, property.priceType)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {property.priceType === 'rent' ? 'per month' : 'total'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.availability_status)}`}>
                        {property.availability_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{property.views}</div>
                      <div className="text-xs text-gray-500">{property.inquiries} inquiries</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{property.createdAt}</div>
                      <div className="text-xs text-gray-500">Updated {property.updatedAt}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProperty(property.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedProperties.length === 0 && (
            <div className="text-center py-12">
              <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}