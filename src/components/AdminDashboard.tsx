'use client'

import { useState } from 'react'
import { 
  Home, Users, Settings, BarChart3, Upload, Plus, 
  Edit, Trash2, Eye, Search, Filter, Download,
  Image as ImageIcon, MapPin, DollarSign, Calendar,
  Bell, LogOut, Menu, X, Save, RefreshCw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PropertyUploadForm from './PropertyUploadForm'
import PropertyManagementTable from './PropertyManagementTable'
import AdminAnalytics from './AdminAnalytics'
import AdminSettings from './AdminSettings'

interface AdminDashboardProps {
  onLogout: () => void
}

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3, color: 'text-blue-600' },
  { id: 'properties', label: 'Properties', icon: Home, color: 'text-green-600' },
  { id: 'upload', label: 'Upload Property', icon: Upload, color: 'text-purple-600' },
  { id: 'users', label: 'Users', icon: Users, color: 'text-orange-600' },
  { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600' }
]

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New property uploaded successfully', time: '2 minutes ago', type: 'success' },
    { id: 2, message: 'Property "Modern Apartment" needs review', time: '1 hour ago', type: 'warning' },
    { id: 3, message: '5 new user registrations today', time: '3 hours ago', type: 'info' }
  ])

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminAnalytics />
      case 'properties':
        return <PropertyManagementTable searchQuery={searchQuery} />
      case 'upload':
        return <PropertyUploadForm />
      case 'users':
        return <div className="p-8 text-center text-gray-500">User management coming soon...</div>
      case 'settings':
        return <AdminSettings />
      default:
        return <AdminAnalytics />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Rentora Admin</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id)
                        setSidebarOpen(false)
                      }}
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-white shadow-lg">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Rentora Admin</h2>
                <p className="text-sm text-gray-500">Property Management</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {navigationItems.find(item => item.id === activeTab)?.label}
                </h1>
                {activeTab === 'properties' && (
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search properties..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <Filter className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                    <Bell className="w-5 h-5 text-gray-600" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                </div>
                
                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">Admin User</div>
                    <div className="text-gray-500">Administrator</div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}