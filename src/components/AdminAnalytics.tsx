'use client'

import { useState } from 'react'
import { 
  BarChart3, TrendingUp, TrendingDown, Users, Home, 
  Eye, MessageCircle, Calendar, DollarSign, Star,
  ArrowUpRight, ArrowDownRight, RefreshCw
} from 'lucide-react'
import { motion } from 'framer-motion'

interface AnalyticsData {
  totalProperties: number
  totalUsers: number
  totalViews: number
  totalInquiries: number
  revenue: number
  averageRating: number
  propertiesThisMonth: number
  usersThisMonth: number
  viewsThisMonth: number
  inquiriesThisMonth: number
  revenueThisMonth: number
  topProperties: {
    id: number
    title: string
    views: number
    inquiries: number
    rating: number
  }[]
  monthlyStats: {
    month: string
    properties: number
    views: number
    inquiries: number
    revenue: number
  }[]
  propertyTypes: {
    type: string
    count: number
    percentage: number
  }[]
  locationStats: {
    location: string
    count: number
    percentage: number
  }[]
}

const mockAnalyticsData: AnalyticsData = {
  totalProperties: 156,
  totalUsers: 1247,
  totalViews: 45678,
  totalInquiries: 892,
  revenue: 12500000,
  averageRating: 4.7,
  propertiesThisMonth: 23,
  usersThisMonth: 156,
  viewsThisMonth: 5678,
  inquiriesThisMonth: 123,
  revenueThisMonth: 1800000,
  topProperties: [
    { id: 1, title: 'Modern Apartment in Shibuya', views: 1245, inquiries: 45, rating: 4.8 },
    { id: 2, title: 'Luxury House in Roppongi', views: 1189, inquiries: 38, rating: 4.9 },
    { id: 3, title: 'Cozy Studio in Harajuku', views: 987, inquiries: 32, rating: 4.6 },
    { id: 4, title: 'Family Home in Setagaya', views: 856, inquiries: 28, rating: 4.7 },
    { id: 5, title: 'Penthouse in Ginza', views: 743, inquiries: 25, rating: 4.9 }
  ],
  monthlyStats: [
    { month: 'Jan', properties: 12, views: 3200, inquiries: 65, revenue: 1200000 },
    { month: 'Feb', properties: 18, views: 4100, inquiries: 78, revenue: 1500000 },
    { month: 'Mar', properties: 22, views: 5200, inquiries: 95, revenue: 1800000 },
    { month: 'Apr', properties: 25, views: 6100, inquiries: 112, revenue: 2100000 },
    { month: 'May', properties: 28, views: 7200, inquiries: 135, revenue: 2400000 },
    { month: 'Jun', properties: 31, views: 8300, inquiries: 158, revenue: 2700000 }
  ],
  propertyTypes: [
    { type: 'Apartment', count: 89, percentage: 57 },
    { type: 'House', count: 45, percentage: 29 },
    { type: 'Studio', count: 22, percentage: 14 }
  ],
  locationStats: [
    { location: 'Shibuya', count: 34, percentage: 22 },
    { location: 'Shinjuku', count: 28, percentage: 18 },
    { location: 'Roppongi', count: 25, percentage: 16 },
    { location: 'Ginza', count: 22, percentage: 14 },
    { location: 'Harajuku', count: 18, percentage: 12 },
    { location: 'Others', count: 29, percentage: 18 }
  ]
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData)
  const [isLoading, setIsLoading] = useState(false)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const statsCards = [
    {
      title: 'Total Properties',
      value: data.totalProperties,
      change: getPercentageChange(data.propertiesThisMonth, data.totalProperties - data.propertiesThisMonth),
      icon: Home,
      color: 'blue'
    },
    {
      title: 'Total Users',
      value: data.totalUsers,
      change: getPercentageChange(data.usersThisMonth, data.totalUsers - data.usersThisMonth),
      icon: Users,
      color: 'green'
    },
    {
      title: 'Total Views',
      value: data.totalViews,
      change: getPercentageChange(data.viewsThisMonth, data.totalViews - data.viewsThisMonth),
      icon: Eye,
      color: 'purple'
    },
    {
      title: 'Total Inquiries',
      value: data.totalInquiries,
      change: getPercentageChange(data.inquiriesThisMonth, data.totalInquiries - data.inquiriesThisMonth),
      icon: MessageCircle,
      color: 'orange'
    },
    {
      title: 'Revenue',
      value: data.revenue,
      change: getPercentageChange(data.revenueThisMonth, data.revenue - data.revenueThisMonth),
      icon: DollarSign,
      color: 'red'
    },
    {
      title: 'Average Rating',
      value: data.averageRating,
      change: 0.2,
      icon: Star,
      color: 'yellow'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600',
      red: 'bg-red-50 text-red-600',
      yellow: 'bg-yellow-50 text-yellow-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Overview of your property management performance</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors duration-200 flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${getColorClasses(stat.color)}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center space-x-1">
                  {stat.change > 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : stat.change < 0 ? (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  ) : null}
                  <span className={`text-sm font-medium ${
                    stat.change > 0 ? 'text-green-600' : 
                    stat.change < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change > 0 ? '+' : ''}{stat.change.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.title === 'Revenue' ? formatCurrency(stat.value) : formatNumber(stat.value)}
                </h3>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Stats Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h3>
            <div className="space-y-4">
              {data.monthlyStats.map((stat, index) => (
                <div key={stat.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-red-600">{stat.month}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{stat.properties} Properties</div>
                      <div className="text-xs text-gray-500">{stat.views} views, {stat.inquiries} inquiries</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(stat.revenue)}</div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Properties */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Properties</h3>
            <div className="space-y-4">
              {data.topProperties.map((property, index) => (
                <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">{property.title}</div>
                      <div className="text-xs text-gray-500">{property.views} views</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{property.inquiries} inquiries</div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500">{property.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Property Types */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Types Distribution</h3>
            <div className="space-y-4">
              {data.propertyTypes.map((type, index) => (
                <div key={type.type}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{type.type}</span>
                    <span className="text-sm text-gray-600">{type.count} ({type.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${type.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Distribution</h3>
            <div className="space-y-4">
              {data.locationStats.map((location, index) => (
                <div key={location.location}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{location.location}</span>
                    <span className="text-sm text-gray-600">{location.count} ({location.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${location.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}