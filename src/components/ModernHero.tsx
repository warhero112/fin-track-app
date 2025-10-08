'use client'

import { useState } from 'react'
import { Search, MapPin, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ModernHero() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const { t } = useLanguage()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/properties?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.02),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.02),transparent_50%)]" />
      </div>

      <div className="relative container-padding text-center">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-black text-white text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            Trusted by 10,000+ foreigners in Japan
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="heading-1 mb-6 text-balance"
          >
            Find your perfect home in{' '}
            <span className="gradient-text">Japan</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="body-large mb-12 max-w-2xl mx-auto text-balance"
          >
            Discover amazing properties across Tokyo and other major Japanese cities. 
            We speak your language and understand your needs.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by location, property type, or keywords..."
                className="input-search pl-12 pr-32"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Toggle filters"
                >
                  <Filter className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={handleSearch}
                  className="btn-primary px-6 py-2"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Quick Filters */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: showFilters ? 1 : 0, 
                height: showFilters ? 'auto' : 0 
              }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 justify-center">
                {['Shibuya', 'Roppongi', 'Harajuku', 'Ginza', 'Shinjuku'].map((location) => (
                  <button
                    key={location}
                    onClick={() => setSearchQuery(location)}
                    className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    {location}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">5,000+</div>
              <div className="text-sm text-gray-600">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">10,000+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">50+</div>
              <div className="text-sm text-gray-600">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}