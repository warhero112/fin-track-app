'use client'

import { useState, useEffect } from 'react'
import { 
  Bot, Database, RefreshCw, TrendingUp, AlertCircle, 
  CheckCircle, Settings, BarChart3, Zap, Globe,
  Play, Pause, Stop, Activity, Users, Home
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PropertyDataGatherer from '@/services/PropertyDataGatherer'
import AIPropertyProcessor from '@/services/AIPropertyProcessor'
import PropertyMatcher from '@/services/PropertyMatcher'
import DataSyncService from '@/services/DataSyncService'
import AIRecommendationEngine from '@/services/AIRecommendationEngine'

interface ModernAdminPanelProps {
  onLogout: () => void
}

export default function ModernAdminPanel({ onLogout }: ModernAdminPanelProps) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isDataGathering, setIsDataGathering] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [stats, setStats] = useState({
    totalProperties: 0,
    processedProperties: 0,
    duplicatesRemoved: 0,
    lastUpdate: null as Date | null,
    errors: 0
  })

  // Initialize services
  const dataGatherer = new PropertyDataGatherer(require('@/services/PropertyDataGatherer').defaultConfig)
  const aiProcessor = new AIPropertyProcessor('demo-api-key')
  const propertyMatcher = new PropertyMatcher(require('@/services/PropertyMatcher').defaultMatchingConfig)
  const syncService = new DataSyncService(require('@/services/DataSyncService').defaultSyncConfig)
  const recommendationEngine = new AIRecommendationEngine(require('@/services/AIRecommendationEngine').defaultRecommendationConfig)

  useEffect(() => {
    // Initialize services
    syncService.start()
    
    // Update stats periodically
    const interval = setInterval(updateStats, 5000)
    return () => clearInterval(interval)
  }, [])

  const updateStats = () => {
    setStats(prev => ({
      ...prev,
      totalProperties: Math.floor(Math.random() * 1000) + 500,
      processedProperties: Math.floor(Math.random() * 100) + 50,
      duplicatesRemoved: Math.floor(Math.random() * 50) + 10,
      lastUpdate: new Date(),
      errors: Math.floor(Math.random() * 5)
    }))
  }

  const handleStartDataGathering = async () => {
    setIsDataGathering(true)
    try {
      await dataGatherer.startDataGathering()
      console.log('Data gathering started')
    } catch (error) {
      console.error('Error starting data gathering:', error)
    } finally {
      setIsDataGathering(false)
    }
  }

  const handleStartProcessing = async () => {
    setIsProcessing(true)
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      console.log('AI processing completed')
    } catch (error) {
      console.error('Error during processing:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStartSync = async () => {
    setIsSyncing(true)
    try {
      await syncService.forceSync()
      console.log('Sync completed')
    } catch (error) {
      console.error('Error during sync:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'blue' },
    { id: 'data-gathering', label: 'Data Gathering', icon: Globe, color: 'green' },
    { id: 'ai-processing', label: 'AI Processing', icon: Bot, color: 'purple' },
    { id: 'sync', label: 'Sync & Updates', icon: RefreshCw, color: 'orange' },
    { id: 'recommendations', label: 'Recommendations', icon: TrendingUp, color: 'pink' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'gray' }
  ]

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Properties</p>
              <p className="text-3xl font-bold">{stats.totalProperties.toLocaleString()}</p>
            </div>
            <Home className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Processed</p>
              <p className="text-3xl font-bold">{stats.processedProperties.toLocaleString()}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Duplicates Removed</p>
              <p className="text-3xl font-bold">{stats.duplicatesRemoved.toLocaleString()}</p>
            </div>
            <Database className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Errors</p>
              <p className="text-3xl font-bold">{stats.errors}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-200" />
          </div>
        </motion.div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="font-medium text-gray-900">Data Gathering</p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div>
              <p className="font-medium text-gray-900">AI Processing</p>
              <p className="text-sm text-gray-600">Running</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            <div>
              <p className="font-medium text-gray-900">Sync Service</p>
              <p className="text-sm text-gray-600">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'New properties scraped from Suumo', time: '2 minutes ago', type: 'success' },
            { action: 'AI processing completed for 15 properties', time: '5 minutes ago', type: 'info' },
            { action: '3 duplicate properties removed', time: '8 minutes ago', type: 'warning' },
            { action: 'Data sync completed successfully', time: '12 minutes ago', type: 'success' }
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderDataGathering = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Automated Data Gathering</h3>
        <p className="text-gray-600 mb-6">
          Automatically collect property data from various real estate websites using advanced web scraping technology.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Configured Sources</h4>
            {[
              { name: 'Suumo', status: 'active', properties: 150, lastUpdate: '2 min ago' },
              { name: 'Homes', status: 'active', properties: 120, lastUpdate: '5 min ago' },
              { name: 'AtHome', status: 'active', properties: 80, lastUpdate: '8 min ago' }
            ].map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    source.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{source.name}</p>
                    <p className="text-sm text-gray-600">{source.properties} properties</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{source.lastUpdate}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Controls</h4>
            <div className="space-y-3">
              <button
                onClick={handleStartDataGathering}
                disabled={isDataGathering}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-xl hover:bg-green-600 disabled:opacity-50 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isDataGathering ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gathering Data...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Start Data Gathering</span>
                  </>
                )}
              </button>
              
              <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2">
                <Pause className="w-4 h-4" />
                <span>Pause Gathering</span>
              </button>
              
              <button className="w-full bg-red-100 text-red-700 py-3 px-4 rounded-xl hover:bg-red-200 transition-colors duration-200 flex items-center justify-center space-x-2">
                <Stop className="w-4 h-4" />
                <span>Stop Gathering</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAIProcessing = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Processing</h3>
        <p className="text-gray-600 mb-6">
          Advanced AI algorithms process and enrich property data with intelligent analysis and recommendations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">AI Features</h4>
            {[
              { feature: 'Property Analysis', description: 'Analyze property characteristics and market value', status: 'active' },
              { feature: 'Image Processing', description: 'Categorize and optimize property images', status: 'active' },
              { feature: 'Location Enrichment', description: 'Add coordinates and nearby amenities', status: 'active' },
              { feature: 'Price Prediction', description: 'Predict market value and trends', status: 'active' },
              { feature: 'Content Generation', description: 'Generate property descriptions', status: 'active' }
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  feature.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">{feature.feature}</p>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Processing Queue</h4>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Properties in Queue</span>
                  <span className="text-sm text-blue-600">23</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <button
                onClick={handleStartProcessing}
                disabled={isProcessing}
                className="w-full bg-purple-500 text-white py-3 px-4 rounded-xl hover:bg-purple-600 disabled:opacity-50 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    <span>Start AI Processing</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSync = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Synchronization</h3>
        <p className="text-gray-600 mb-6">
          Keep your property database synchronized with real-time updates from multiple sources.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Sync Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-900">Last Sync</span>
                <span className="text-sm text-green-600">2 minutes ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-900">Next Sync</span>
                <span className="text-sm text-blue-600">28 minutes</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-purple-900">Properties Updated</span>
                <span className="text-sm text-purple-600">15 today</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Sync Controls</h4>
            <div className="space-y-3">
              <button
                onClick={handleStartSync}
                disabled={isSyncing}
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Force Sync Now</span>
                  </>
                )}
              </button>
              
              <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Configure Sync</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderRecommendations = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations Engine</h3>
        <p className="text-gray-600 mb-6">
          Intelligent recommendation system that learns from user behavior to suggest the most relevant properties.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Recommendation Types</h4>
            {[
              { type: 'Personalized', description: 'Based on user preferences and behavior', accuracy: '92%' },
              { type: 'Similar Properties', description: 'Properties similar to saved ones', accuracy: '88%' },
              { type: 'Trending', description: 'Popular properties in the area', accuracy: '85%' },
              { type: 'Budget', description: 'Great value for money', accuracy: '90%' },
              { type: 'Luxury', description: 'Premium properties', accuracy: '87%' }
            ].map((rec, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{rec.type}</p>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">{rec.accuracy}</p>
                  <p className="text-xs text-gray-500">accuracy</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Performance Metrics</h4>
            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-900">Click-through Rate</span>
                  <span className="text-sm text-green-600">24.5%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '24.5%' }}></div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Conversion Rate</span>
                  <span className="text-sm text-blue-600">8.2%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '8.2%' }}></div>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-900">User Satisfaction</span>
                  <span className="text-sm text-purple-600">4.7/5</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard()
      case 'data-gathering': return renderDataGathering()
      case 'ai-processing': return renderAIProcessing()
      case 'sync': return renderSync()
      case 'recommendations': return renderRecommendations()
      case 'settings': return <div className="p-8 text-center text-gray-500">Settings coming soon...</div>
      default: return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI-Powered Admin Panel</h1>
                <p className="text-gray-600">Automated property management system</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Activity className="w-4 h-4" />
                <span>System Online</span>
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <nav className="p-6">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className={`w-5 h-5`} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
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
  )
}