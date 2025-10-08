'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Home, Users, Star, ArrowRight, Play, Sparkles } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { motion } from 'framer-motion'

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0)
  const { t } = useLanguage()
  
  const heroImages = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentImage ? 1 : 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={image}
              alt={`Tokyo real estate ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/60" />
          </motion.div>
        ))}
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm"
        />
        <motion.div
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-32 left-16 w-12 h-12 bg-red-500/20 rounded-full backdrop-blur-sm"
        />
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 left-1/4 w-8 h-8 bg-yellow-400/20 rounded-full backdrop-blur-sm"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container-custom">
          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <span className="text-yellow-400 font-medium text-sm uppercase tracking-wider">
                  AI-Enhanced Rentals
                </span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
                Find Your Perfect
                <span className="block bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Home in Japan
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl leading-relaxed">
                {t('hero.subtitle')} Discover properties with our AI-powered matching system.
              </p>
            </motion.div>
            
            {/* Quick Stats with Animation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
            >
              {[
                { number: "500+", label: "Properties", icon: "🏠" },
                { number: "1000+", label: "Happy Clients", icon: "😊" },
                { number: "15+", label: "Years Experience", icon: "⭐" },
                { number: "24/7", label: "Support", icon: "🛟" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="text-center group"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold text-lg px-8 py-4 rounded-2xl flex items-center justify-center space-x-3 shadow-2xl hover:shadow-red-500/25 transition-all duration-300"
              >
                <Search className="w-6 h-6" />
                <span>{t('search.properties')}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg px-8 py-4 rounded-2xl flex items-center justify-center space-x-3 hover:bg-white/20 transition-all duration-300"
              >
                <Play className="w-6 h-6" />
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex items-center gap-6 text-gray-300 text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Property Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>AI-Powered Matching</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>24/7 Support</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}