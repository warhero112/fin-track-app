'use client'

import { useState } from 'react'
import { 
  Settings, User, Bell, Shield, Database, Globe, 
  Save, RefreshCw, Upload, Download, Trash2,
  Eye, EyeOff, Key, Mail, Phone, MapPin
} from 'lucide-react'
import { motion } from 'framer-motion'

interface AdminSettingsProps {}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'website', label: 'Website Settings', icon: Globe }
  ]

  const [settings, setSettings] = useState({
    general: {
      siteName: 'Rentora',
      siteDescription: 'Japan Real Estate for Foreigners',
      defaultLanguage: 'en',
      timezone: 'Asia/Tokyo',
      currency: 'JPY',
      dateFormat: 'YYYY-MM-DD'
    },
    profile: {
      name: 'Admin User',
      email: 'admin@rentora.jp',
      phone: '+81-90-1234-5678',
      avatar: '',
      role: 'Administrator',
      department: 'Property Management'
    },
    notifications: {
      emailNotifications: true,
      propertyAlerts: true,
      userRegistrations: true,
      systemUpdates: true,
      weeklyReports: true,
      monthlyReports: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
      ipWhitelist: '',
      auditLogs: true
    },
    data: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionPeriod: 365,
      exportFormat: 'csv',
      dataAnonymization: false
    },
    website: {
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: true,
      maxFileSize: 10,
      allowedFileTypes: 'jpg,jpeg,png,gif,pdf',
      googleAnalytics: '',
      facebookPixel: '',
      metaTitle: 'Rentora - Japan Real Estate for Foreigners',
      metaDescription: 'Find your perfect home in Japan with our comprehensive property listings and expert guidance.'
    }
  })

  const updateSetting = (category: keyof typeof settings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Site Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
            <input
              type="text"
              value={settings.general.siteName}
              onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
            <select
              value={settings.general.defaultLanguage}
              onChange={(e) => updateSetting('general', 'defaultLanguage', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            >
              <option value="en">English</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={settings.general.timezone}
              onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            >
              <option value="Asia/Tokyo">Asia/Tokyo</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={settings.general.currency}
              onChange={(e) => updateSetting('general', 'currency', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            >
              <option value="JPY">Japanese Yen (¥)</option>
              <option value="USD">US Dollar ($)</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
          <textarea
            value={settings.general.siteDescription}
            onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>
    </div>
  )

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={settings.profile.name}
              onChange={(e) => updateSetting('profile', 'name', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => updateSetting('profile', 'email', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={settings.profile.phone}
              onChange={(e) => updateSetting('profile', 'phone', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <input
              type="text"
              value={settings.profile.department}
              onChange={(e) => updateSetting('profile', 'department', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium text-gray-900">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </div>
                <div className="text-sm text-gray-500">
                  {key === 'emailNotifications' && 'Receive email notifications for important events'}
                  {key === 'propertyAlerts' && 'Get notified when new properties are added'}
                  {key === 'userRegistrations' && 'Receive alerts for new user registrations'}
                  {key === 'systemUpdates' && 'Get notified about system updates and maintenance'}
                  {key === 'weeklyReports' && 'Receive weekly performance reports'}
                  {key === 'monthlyReports' && 'Receive monthly analytics reports'}
                </div>
              </div>
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Configuration</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <div className="font-medium text-gray-900">Two-Factor Authentication</div>
              <div className="text-sm text-gray-500">Add an extra layer of security to your account</div>
            </div>
            <input
              type="checkbox"
              checked={settings.security.twoFactorAuth}
              onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
              className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
              <input
                type="number"
                value={settings.security.passwordExpiry}
                onChange={(e) => updateSetting('security', 'passwordExpiry', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">IP Whitelist</label>
            <textarea
              value={settings.security.ipWhitelist}
              onChange={(e) => updateSetting('security', 'ipWhitelist', e.target.value)}
              rows={3}
              placeholder="Enter IP addresses separated by commas"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <div className="font-medium text-gray-900">Automatic Backup</div>
              <div className="text-sm text-gray-500">Automatically backup data on a schedule</div>
            </div>
            <input
              type="checkbox"
              checked={settings.data.autoBackup}
              onChange={(e) => updateSetting('data', 'autoBackup', e.target.checked)}
              className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
              <select
                value={settings.data.backupFrequency}
                onChange={(e) => updateSetting('data', 'backupFrequency', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period (days)</label>
              <input
                type="number"
                value={settings.data.retentionPeriod}
                onChange={(e) => updateSetting('data', 'retentionPeriod', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Import Data</span>
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Clear Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderWebsiteSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Website Configuration</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <div className="font-medium text-gray-900">Maintenance Mode</div>
              <div className="text-sm text-gray-500">Temporarily disable the website for maintenance</div>
            </div>
            <input
              type="checkbox"
              checked={settings.website.maintenanceMode}
              onChange={(e) => updateSetting('website', 'maintenanceMode', e.target.checked)}
              className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
              <input
                type="number"
                value={settings.website.maxFileSize}
                onChange={(e) => updateSetting('website', 'maxFileSize', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Allowed File Types</label>
              <input
                type="text"
                value={settings.website.allowedFileTypes}
                onChange={(e) => updateSetting('website', 'allowedFileTypes', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
            <input
              type="text"
              value={settings.website.metaTitle}
              onChange={(e) => updateSetting('website', 'metaTitle', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
            <textarea
              value={settings.website.metaDescription}
              onChange={(e) => updateSetting('website', 'metaDescription', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings()
      case 'profile': return renderProfileSettings()
      case 'notifications': return renderNotificationSettings()
      case 'security': return renderSecuritySettings()
      case 'data': return renderDataSettings()
      case 'website': return renderWebsiteSettings()
      default: return renderGeneralSettings()
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Configure your admin panel and website settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-2">
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
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}