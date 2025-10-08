'use client'

import { useState, useEffect } from 'react'
import { 
  Facebook, Share2, Download, Upload, Calendar, 
  BarChart3, Users, MessageCircle, Eye, Heart,
  RefreshCw, Play, Pause, Settings, AlertCircle,
  CheckCircle, Clock, TrendingUp, Globe, Zap,
  ShoppingCart, Tag, Bell, Link, Image as ImageIcon, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import FacebookIntegrationService from '@/services/FacebookIntegrationService'
import FacebookWebhookHandler from '@/services/FacebookWebhookHandler'
import FacebookPixelService from '@/services/FacebookPixelService'
import FacebookMarketplaceService from '@/services/FacebookMarketplaceService'

interface FacebookIntegrationPanelProps {
  onClose: () => void
}

export default function FacebookIntegrationPanel({ onClose }: FacebookIntegrationPanelProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [services, setServices] = useState({
    integration: null as FacebookIntegrationService | null,
    webhook: null as FacebookWebhookHandler | null,
    pixel: null as FacebookPixelService | null,
    marketplace: null as FacebookMarketplaceService | null
  })
  const [analytics, setAnalytics] = useState<any>(null)
  const [marketplaceListings, setMarketplaceListings] = useState<any[]>([])
  const [autoPosting, setAutoPosting] = useState(false)
  const [autoImporting, setAutoImporting] = useState(false)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'blue' },
    { id: 'posting', label: 'Auto Posting', icon: Share2, color: 'green' },
    { id: 'importing', label: 'Auto Import', icon: Download, color: 'purple' },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart, color: 'orange' },
    { id: 'messenger', label: 'Messenger', icon: MessageCircle, color: 'pink' },
    { id: 'pixel', label: 'Pixel Tracking', icon: Eye, color: 'indigo' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'teal' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'gray' }
  ]

  useEffect(() => {
    initializeFacebookServices()
  }, [])

  const initializeFacebookServices = async () => {
    setIsLoading(true)
    try {
      // Initialize all Facebook services
      const config = {
        pageId: 'your-page-id',
        accessToken: 'your-access-token',
        appId: 'your-app-id',
        appSecret: 'your-app-secret',
        webhookVerifyToken: 'rentora_webhook_verify_token',
        marketplaceEnabled: true,
        messengerEnabled: true,
        pixelId: 'your-pixel-id'
      }

      // Initialize integration service
      const integrationService = new FacebookIntegrationService(config)
      const connected = await integrationService.initialize()

      // Initialize webhook handler
      const webhookHandler = new FacebookWebhookHandler({
        verifyToken: config.webhookVerifyToken,
        secret: config.appSecret,
        pageId: config.pageId
      })

      // Initialize pixel service
      const pixelService = new FacebookPixelService({
        pixelId: config.pixelId,
        accessToken: config.accessToken
      })
      pixelService.initialize()

      // Initialize marketplace service
      const marketplaceService = new FacebookMarketplaceService({
        accessToken: config.accessToken,
        pageId: config.pageId,
        categoryId: 'housing',
        subcategoryId: 'apartments',
        autoPublish: true,
        syncInterval: 60
      })
      await marketplaceService.initialize()

      setServices({
        integration: integrationService,
        webhook: webhookHandler,
        pixel: pixelService,
        marketplace: marketplaceService
      })

      setIsConnected(connected)
      
      if (connected) {
        await loadAnalytics()
        await loadMarketplaceListings()
      }
    } catch (error) {
      console.error('Error initializing Facebook services:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadAnalytics = async () => {
    if (!services.integration) return

    try {
      const analyticsData = await services.integration.getAnalytics()
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  const loadMarketplaceListings = async () => {
    if (!services.marketplace) return

    try {
      const listings = await services.marketplace.getListings()
      setMarketplaceListings(listings)
    } catch (error) {
      console.error('Error loading marketplace listings:', error)
    }
  }

  const handleAutoPosting = async (enabled: boolean) => {
    setAutoPosting(enabled)
    // In real implementation, configure auto-posting
    console.log(`Auto posting ${enabled ? 'enabled' : 'disabled'}`)
  }

  const handleAutoImporting = async (enabled: boolean) => {
    setAutoImporting(enabled)
    // In real implementation, configure auto-importing
    console.log(`Auto importing ${enabled ? 'enabled' : 'disabled'}`)
  }

  const handleSyncToMarketplace = async () => {
    if (!services.marketplace) return

    setIsLoading(true)
    try {
      // In real implementation, sync properties to marketplace
      console.log('Syncing properties to marketplace...')
    } catch (error) {
      console.error('Error syncing to marketplace:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Facebook Integration Status</h3>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            isConnected 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        
        {!isConnected && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Connect to Facebook</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Connect your Facebook page to enable automatic posting, importing, and marketplace integration.
                </p>
                <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                  Connect Facebook Page
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Service Status */}
      {isConnected && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Page Integration</p>
                <p className="text-3xl font-bold">Active</p>
              </div>
              <Facebook className="w-8 h-8 text-blue-200" />
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
                <p className="text-green-100 text-sm">Auto Posting</p>
                <p className="text-3xl font-bold">{autoPosting ? 'ON' : 'OFF'}</p>
              </div>
              <Share2 className="w-8 h-8 text-green-200" />
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
                <p className="text-purple-100 text-sm">Auto Import</p>
                <p className="text-3xl font-bold">{autoImporting ? 'ON' : 'OFF'}</p>
              </div>
              <Download className="w-8 h-8 text-purple-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Marketplace</p>
                <p className="text-3xl font-bold">{marketplaceListings.length}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-orange-200" />
            </div>
          </motion.div>
        </div>
      )}

      {/* Quick Actions */}
      {isConnected && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200 text-left">
              <Share2 className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium text-gray-900">Post Property</p>
              <p className="text-sm text-gray-600">Post to Facebook</p>
            </button>
            
            <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-200 text-left">
              <Download className="w-6 h-6 text-green-600 mb-2" />
              <p className="font-medium text-gray-900">Import Posts</p>
              <p className="text-sm text-gray-600">Import from Facebook</p>
            </button>
            
            <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-200 text-left">
              <ShoppingCart className="w-6 h-6 text-purple-600 mb-2" />
              <p className="font-medium text-gray-900">Sync Marketplace</p>
              <p className="text-sm text-gray-600">Update listings</p>
            </button>
            
            <button className="p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors duration-200 text-left">
              <MessageCircle className="w-6 h-6 text-pink-600 mb-2" />
              <p className="font-medium text-gray-900">Messenger Bot</p>
              <p className="text-sm text-gray-600">Configure bot</p>
            </button>
          </div>
        </div>
      )}
    </div>
  )

  const renderAutoPosting = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Automatic Posting</h3>
        <p className="text-gray-600 mb-6">
          Automatically post new properties to your Facebook page and marketplace as soon as they're added.
        </p>
        
        <div className="space-y-6">
          {/* Auto Posting Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900">Enable Auto Posting</h4>
              <p className="text-sm text-gray-600">Automatically post new properties to Facebook</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={autoPosting}
                onChange={(e) => handleAutoPosting(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Posting Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posting Frequency
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                <option value="immediate">Immediate</option>
                <option value="hourly">Every Hour</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Format
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                <option value="detailed">Detailed with all info</option>
                <option value="summary">Summary format</option>
                <option value="minimal">Minimal format</option>
              </select>
            </div>
          </div>

          {/* Posting Channels */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Posting Channels</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                <span className="text-sm text-gray-700">Facebook Page Posts</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                <span className="text-sm text-gray-700">Facebook Marketplace</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="text-sm text-gray-700">Facebook Groups</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAutoImporting = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Automatic Importing</h3>
        <p className="text-gray-600 mb-6">
          Automatically import properties that have been posted on your Facebook page to add them to your website.
        </p>
        
        <div className="space-y-6">
          {/* Auto Importing Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900">Enable Auto Importing</h4>
              <p className="text-sm text-gray-600">Automatically import properties from Facebook posts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={autoImporting}
                onChange={(e) => handleAutoImporting(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Import Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Import Frequency
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200">
                <option value="realtime">Real-time</option>
                <option value="hourly">Every Hour</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type Filter
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200">
                <option value="all">All Types</option>
                <option value="apartment">Apartments Only</option>
                <option value="house">Houses Only</option>
                <option value="studio">Studios Only</option>
              </select>
            </div>
          </div>

          {/* Import Sources */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Import Sources</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" defaultChecked />
                <span className="text-sm text-gray-700">Facebook Page Posts</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                <span className="text-sm text-gray-700">Facebook Marketplace</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                <span className="text-sm text-gray-700">Facebook Groups</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMarketplace = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Facebook Marketplace</h3>
        <p className="text-gray-600 mb-6">
          Manage your property listings on Facebook Marketplace for maximum visibility and reach.
        </p>
        
        <div className="space-y-6">
          {/* Marketplace Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-orange-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-900">Active Listings</span>
                <ShoppingCart className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-900">
                {marketplaceListings.filter(l => l.status === 'active').length}
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Total Views</span>
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-900">1,234</div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-900">Inquiries</span>
                <MessageCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-900">56</div>
            </div>
          </div>

          {/* Sync Controls */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900">Sync to Marketplace</h4>
              <p className="text-sm text-gray-600">Sync all properties to Facebook Marketplace</p>
            </div>
            <button
              onClick={handleSyncToMarketplace}
              disabled={isLoading}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Sync Now</span>
                </>
              )}
            </button>
          </div>

          {/* Marketplace Listings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Marketplace Listings</h4>
            <div className="space-y-3">
              {marketplaceListings.slice(0, 5).map((listing, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">{listing.title}</p>
                      <p className="text-sm text-gray-600">{listing.location?.city} • ¥{listing.price?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      listing.status === 'active' ? 'bg-green-100 text-green-700' :
                      listing.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {listing.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMessenger = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Facebook Messenger Bot</h3>
        <p className="text-gray-600 mb-6">
          Configure your Facebook Messenger bot to automatically respond to property inquiries and help users find homes.
        </p>
        
        <div className="space-y-6">
          {/* Bot Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900">Messenger Bot</h4>
              <p className="text-sm text-gray-600">Automated responses to property inquiries</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-700">Active</span>
            </div>
          </div>

          {/* Bot Features */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Bot Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { feature: 'Property Search', description: 'Help users find properties', status: 'active' },
                { feature: 'Property Details', description: 'Provide detailed property info', status: 'active' },
                { feature: 'Contact Agent', description: 'Connect users with agents', status: 'active' },
                { feature: 'Schedule Viewing', description: 'Book property viewings', status: 'active' },
                { feature: 'Price Alerts', description: 'Notify about price changes', status: 'active' },
                { feature: 'Saved Properties', description: 'Manage saved properties', status: 'active' }
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
          </div>

          {/* Bot Configuration */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Bot Configuration</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Welcome Message
                </label>
                <textarea
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="Welcome to Rentora! I can help you find your perfect home in Japan..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Language
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200">
                  <option value="en">English</option>
                  <option value="ja">Japanese</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPixel = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Facebook Pixel Tracking</h3>
        <p className="text-gray-600 mb-6">
          Track user interactions and conversions with Facebook Pixel for better ad targeting and analytics.
        </p>
        
        <div className="space-y-6">
          {/* Pixel Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900">Pixel Status</h4>
              <p className="text-sm text-gray-600">Track user interactions and conversions</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-700">Active</span>
            </div>
          </div>

          {/* Tracked Events */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Tracked Events</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { event: 'PageView', description: 'Page visits', status: 'active' },
                { event: 'ViewContent', description: 'Property views', status: 'active' },
                { event: 'Search', description: 'Property searches', status: 'active' },
                { event: 'AddToWishlist', description: 'Saved properties', status: 'active' },
                { event: 'Contact', description: 'Agent contact', status: 'active' },
                { event: 'Lead', description: 'Lead generation', status: 'active' },
                { event: 'Purchase', description: 'Property purchases', status: 'active' },
                { event: 'CompleteRegistration', description: 'User registration', status: 'active' }
              ].map((event, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    event.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{event.event}</p>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pixel Configuration */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Pixel Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pixel ID
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="123456789012345"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Event Code
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="TEST12345"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Facebook Analytics</h3>
        <p className="text-gray-600 mb-6">
          Track the performance of your Facebook integration and optimize your social media strategy.
        </p>
        
        {analytics ? (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Page Likes</span>
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {analytics.pageLikes?.toLocaleString() || 0}
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-900">Post Reach</span>
                  <Eye className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-900">
                  {analytics.postReach?.toLocaleString() || 0}
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-900">Engagement</span>
                  <Heart className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-900">
                  {analytics.postEngagement?.toLocaleString() || 0}
                </div>
              </div>
            </div>

            {/* Conversion Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-orange-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-orange-900">Click Rate</span>
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-900">
                  {analytics.clickThroughRate?.toFixed(1) || 0}%
                </div>
              </div>
              
              <div className="p-4 bg-pink-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-pink-900">Leads</span>
                  <MessageCircle className="w-4 h-4 text-pink-600" />
                </div>
                <div className="text-2xl font-bold text-pink-900">
                  {analytics.leadGeneration || 0}
                </div>
              </div>
              
              <div className="p-4 bg-teal-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-teal-900">Conversions</span>
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-2xl font-bold text-teal-900">
                  {analytics.conversionRate?.toFixed(1) || 0}%
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No analytics data available</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Facebook Integration Settings</h3>
        <p className="text-gray-600 mb-6">
          Configure your Facebook integration settings and preferences.
        </p>
        
        <div className="space-y-6">
          {/* Connection Settings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Connection Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page ID
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                  placeholder="Your Facebook Page ID"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Token
                </label>
                <input
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                  placeholder="Your Facebook Access Token"
                />
              </div>
            </div>
          </div>

          {/* Integration Preferences */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Integration Preferences</h4>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                <span className="text-sm text-gray-700">Enable automatic posting</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                <span className="text-sm text-gray-700">Enable automatic importing</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                <span className="text-sm text-gray-700">Enable marketplace sync</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                <span className="text-sm text-gray-700">Enable pixel tracking</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="text-sm text-gray-700">Enable messenger bot</span>
              </label>
            </div>
          </div>

          {/* Save Settings */}
          <div className="flex justify-end">
            <button className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview()
      case 'posting': return renderAutoPosting()
      case 'importing': return renderAutoImporting()
      case 'marketplace': return renderMarketplace()
      case 'messenger': return renderMessenger()
      case 'pixel': return renderPixel()
      case 'analytics': return renderAnalytics()
      case 'settings': return renderSettings()
      default: return renderOverview()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Facebook className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Facebook Integration</h2>
              <p className="text-gray-600">Complete Facebook integration for your real estate business</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:bg-white hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}