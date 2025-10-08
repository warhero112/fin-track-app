'use client'

import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useUser } from '@/contexts/UserContext'
import propertyService, { Property } from '@/services/PropertyService'
import ModernPropertyCard from './ModernPropertyCard'

export default function ModernFeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()
  const { user, toggleSavedProperty } = useUser()

  useEffect(() => {
    loadFeaturedProperties()
  }, [])

  const loadFeaturedProperties = async () => {
    try {
      const data = await propertyService.getFeaturedProperties()
      setProperties(data)
    } catch (error) {
      console.error('Error loading featured properties:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleFavorite = async (propertyId: string) => {
    if (user) {
      await toggleSavedProperty(propertyId)
      loadFeaturedProperties()
    }
  }

  const handleShare = (property: Property) => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.origin + `/properties/${property.id}`
      })
    } else {
      navigator.clipboard.writeText(window.location.origin + `/properties/${property.id}`)
    }
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container-padding">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Featured Properties</h2>
            <p className="body-large">Discover our handpicked selection of premium properties</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-2 mb-4">Featured Properties</h2>
          <p className="body-large max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties across Japan's most desirable locations
          </p>
        </motion.div>

        <div className="grid-properties">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ModernPropertyCard
                property={property}
                onToggleFavorite={handleToggleFavorite}
                onShare={handleShare}
              />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary px-8 py-3 flex items-center space-x-2 mx-auto"
          >
            <span>View All Properties</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}