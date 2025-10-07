'use client'

import { useState, useEffect } from 'react'
import { 
  Facebook, Share2, Download, Upload, Calendar, 
  BarChart3, Users, MessageCircle, Eye, Heart,
  RefreshCw, Play, Pause, Settings, AlertCircle,
  CheckCircle, Clock, TrendingUp, Globe, Zap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import FacebookIntegrationService from '@/services/FacebookIntegrationService'

interface FacebookManagementDashboardProps {
  onClose: () => void
}

export default function FacebookManagementDashboard({ onClose }: FacebookManagementDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [facebookService, setFacebookService] = useState<FacebookIntegrationService | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([])
  const [recentPosts, setRecentPosts] = useState<any[]>([])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'blue' },
    { id: 'posting', label: 'Auto Posting', icon: Share2, color: 'green' },
    { id: 'importing', label: 'Import from FB', icon: Download, color: 'purple' },
    { id: 'scheduling', label: 'Scheduling', icon: Calendar, color: 'orange' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'pink' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'gray' }
  ]

  useEffect(() => {
    initializeFacebook()
  }, [])

  const initializeFacebook = async () => {
    setIsLoading(true)
    try {
      // In real implementation, get config from environment or database
      const config = {
        pageId: 'your-page-id',
        accessToken: 'your-access-token',
        appId: 'your-app-id',
        appSecret: 'your-app-secret',
        webhookVerifyToken: 'rentora_webhook_verify_token',
        marketplaceEnabled: true,
        messengerEnabled: true
      }

      const service = new FacebookIntegrationService(config)
      const connected = await service.initialize()
      
      if (connected) {
        setFacebookService(service)
        setIsConnected(true)
        await loadAnalytics()
        await loadRecentPosts()
      }
    } catch (error) {
      console.error('Error initializing Facebook:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadAnalytics = async () => {
    if (!facebookService) return

    try {
      const analyticsData = await facebookService.getAnalytics()
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  const loadRecentPosts = async () => {
    if (!facebookService) return

    try {
      const posts = await facebookService.importPropertiesFromFacebook()
      setRecentPosts(posts.slice(0, 10))
    } catch (error) {
      console.error('Error loading recent posts:', error)
    }
  }

  const handleAutoPosting = async (enabled: boolean) => {
    if (!facebookService) return

    setIsLoading(true)
    try {
      // In real implementation, configure auto-posting settings
      console.log(`Auto posting ${enabled ? 'enabled' : 'disabled'}`)
    } catch (error) {
      console.error('Error configuring auto posting:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportFromFacebook = async () => {
    if (!facebookService) return

    setIsLoading(true)
    try {
      const properties = await facebookService.importPropertiesFromFacebook()
      console.log(`Imported ${properties.length} properties from Facebook`)
    } catch (error) {
      console.error('Error importing from Facebook:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Facebook Connection</h3>
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
                  Connect your Facebook page to enable automatic posting and importing.
                </p>
                <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                  Connect Facebook Page
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Page Likes</p>
                <p className="text-3xl font-bold">{analytics.pageLikes?.toLocaleString() || 0}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
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
                <p className="text-green-100 text-sm">Post Reach</p>
                <p className="text-3xl font-bold">{analytics.postReach?.toLocaleString() || 0}</p>
              </div>
              <Eye className="w-8 h-8 text-green-200" />
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
                <p className="text-purple-100 text-sm">Engagement</p>
                <p className="text-3xl font-bold">{analytics.postEngagement?.toLocaleString() || 0}</p>
              </div>
              <Heart className="w-8 h-8 text-purple-200" />
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
                <p className="text-orange-100 text-sm">Click Rate</p>
                <p className="text-3xl font-bold">{analytics.clickThroughRate?.toFixed(1) || 0}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-200" />
            </div>
          </motion.div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Property posted to Facebook', time: '2 minutes ago', type: 'success' },
            { action: '5 properties imported from Facebook', time: '1 hour ago', type: 'info' },
            { action: 'Scheduled post published', time: '3 hours ago', type: 'success' },
            { action: 'Facebook analytics updated', time: '6 hours ago', type: 'info' }
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

  const renderAutoPosting = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Automatic Posting</h3>
        <p className="text-gray-600 mb-6">
          Automatically post new properties to your Facebook page as soon as they're added to the website.
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

          {/* Post Template */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Template
            </label>
            <textarea
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="🏠 {title} - {price} - {location} #RealEstate #Japan"
            />
            <p className="text-sm text-gray-500 mt-2">
              Use {title}, {price}, {location}, {bedrooms}, {bathrooms} as placeholders
            </p>
          </div>

          {/* Test Post */}
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Test Post</span>
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderImporting = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Import from Facebook</h3>
        <p className="text-gray-600 mb-6">
          Import properties that have been posted on your Facebook page to add them to your website.
        </p>
        
        <div className="space-y-6">
          {/* Import Controls */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900">Import Properties</h4>
              <p className="text-sm text-gray-600">Import properties from Facebook posts</p>
            </div>
            <button
              onClick={handleImportFromFacebook}
              disabled={isLoading || !isConnected}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Import Now</span>
                </>
              )}
            </button>
          </div>

          {/* Import Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Import Range
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200">
                <option value="last_week">Last Week</option>
                <option value="last_month">Last Month</option>
                <option value="last_3_months">Last 3 Months</option>
                <option value="all">All Time</option>
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

          {/* Imported Properties */}
          {recentPosts.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Recently Imported Properties</h4>
              <div className="space-y-3">
                {recentPosts.map((property, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{property.title}</p>
                      <p className="text-sm text-gray-600">{property.location} • ¥{property.price?.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{property.lastSynced?.toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderScheduling = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Scheduling</h3>
        <p className="text-gray-600 mb-6">
          Schedule property posts to be published at optimal times for maximum engagement.
        </p>
        
        <div className="space-y-6">
          {/* Schedule New Post */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-4">Schedule New Post</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Property
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200">
                  <option value="">Choose a property...</option>
                  <option value="1">Modern Apartment in Shibuya</option>
                  <option value="2">Luxury House in Roppongi</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Schedule Post</span>
            </button>
          </div>

          {/* Scheduled Posts */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Scheduled Posts</h4>
            <div className="space-y-3">
              {[
                { title: 'Modern Apartment in Shibuya', scheduledTime: '2024-01-25 14:00', status: 'scheduled' },
                { title: 'Luxury House in Roppongi', scheduledTime: '2024-01-26 10:00', status: 'scheduled' },
                { title: 'Cozy Studio in Harajuku', scheduledTime: '2024-01-27 16:00', status: 'scheduled' }
              ].map((post, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{post.title}</p>
                    <p className="text-sm text-gray-600">Scheduled for {post.scheduledTime}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                      {post.status}
                    </span>
                    <button className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200">
                      <Pause className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
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
          Track the performance of your property posts and optimize your Facebook strategy.
        </p>
        
        {analytics ? (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Engagement Rate</span>
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {analytics.postEngagement ? (analytics.postEngagement / analytics.postReach * 100).toFixed(1) : 0}%
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-900">Click Rate</span>
                  <Eye className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-900">
                  {analytics.clickThroughRate?.toFixed(1) || 0}%
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-900">Lead Generation</span>
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-900">
                  {analytics.leadGeneration || 0}
                </div>
              </div>
            </div>

            {/* Top Performing Posts */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Top Performing Posts</h4>
              <div className="space-y-3">
                {analytics.topPosts?.slice(0, 5).map((post: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-gray-900">{post.name || 'Property Post'}</p>
                        <p className="text-sm text-gray-600">{post.createdTime}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{post.likes || 0} likes</p>
                      <p className="text-xs text-gray-500">{post.reach || 0} reach</p>
                    </div>
                  </div>
                ))}
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Facebook Settings</h3>
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

          {/* Posting Preferences */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Posting Preferences</h4>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="text-sm text-gray-700">Include property images in posts</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="text-sm text-gray-700">Add hashtags to posts</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="text-sm text-gray-700">Include contact information</span>
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
      case 'importing': return renderImporting()
      case 'scheduling': return renderScheduling()
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Facebook className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Facebook Integration</h2>
              <p className="text-gray-600">Manage your Facebook page integration</p>
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