// Facebook Marketplace Integration Service
// Handles property listings on Facebook Marketplace

export interface MarketplaceListing {
  id: string
  title: string
  description: string
  price: number
  currency: string
  location: {
    city: string
    state: string
    country: string
    latitude?: number
    longitude?: number
  }
  category: string
  subcategory: string
  images: string[]
  condition: 'new' | 'used' | 'refurbished'
  availability: 'available' | 'pending' | 'sold'
  contactInfo: {
    phone: string
    email: string
    website?: string
  }
  customFields: Record<string, any>
  facebookListingId?: string
  status: 'draft' | 'active' | 'paused' | 'sold' | 'removed'
  createdAt: Date
  updatedAt: Date
}

export interface MarketplaceConfig {
  accessToken: string
  pageId: string
  categoryId: string
  subcategoryId: string
  autoPublish: boolean
  syncInterval: number // in minutes
}

class FacebookMarketplaceService {
  private config: MarketplaceConfig
  private initialized: boolean = false

  constructor(config: MarketplaceConfig) {
    this.config = config
  }

  // Initialize marketplace service
  async initialize(): Promise<boolean> {
    try {
      console.log('Initializing Facebook Marketplace service...')
      
      // Verify access token and permissions
      const isValid = await this.verifyAccess()
      if (!isValid) {
        throw new Error('Invalid access token or insufficient permissions')
      }

      this.initialized = true
      console.log('Facebook Marketplace service initialized successfully')
      return true
    } catch (error) {
      console.error('Error initializing marketplace service:', error)
      return false
    }
  }

  // Verify access token and permissions
  private async verifyAccess(): Promise<boolean> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/me?fields=id,name&access_token=${this.config.accessToken}`
      )
      return response.ok
    } catch (error) {
      console.error('Error verifying access:', error)
      return false
    }
  }

  // Create marketplace listing
  async createListing(listing: MarketplaceListing): Promise<string | null> {
    try {
      console.log(`Creating marketplace listing: ${listing.title}`)

      const listingData = {
        title: listing.title,
        description: listing.description,
        price: listing.price,
        currency: listing.currency,
        location: {
          city: listing.location.city,
          state: listing.location.state,
          country: listing.location.country,
          latitude: listing.location.latitude,
          longitude: listing.location.longitude
        },
        category: listing.category,
        subcategory: listing.subcategory,
        condition: listing.condition,
        availability: listing.availability,
        images: listing.images,
        custom_fields: listing.customFields,
        contact_info: listing.contactInfo
      }

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.config.pageId}/marketplace_listings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.accessToken}`
          },
          body: JSON.stringify(listingData)
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Marketplace API error: ${error.error?.message || 'Unknown error'}`)
      }

      const result = await response.json()
      console.log('Marketplace listing created successfully:', result.id)
      return result.id
    } catch (error) {
      console.error('Error creating marketplace listing:', error)
      return null
    }
  }

  // Update marketplace listing
  async updateListing(listingId: string, updates: Partial<MarketplaceListing>): Promise<boolean> {
    try {
      console.log(`Updating marketplace listing: ${listingId}`)

      const updateData: any = {}
      
      if (updates.title) updateData.title = updates.title
      if (updates.description) updateData.description = updates.description
      if (updates.price) updateData.price = updates.price
      if (updates.availability) updateData.availability = updates.availability
      if (updates.images) updateData.images = updates.images
      if (updates.customFields) updateData.custom_fields = updates.customFields

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${listingId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.accessToken}`
          },
          body: JSON.stringify(updateData)
        }
      )

      return response.ok
    } catch (error) {
      console.error('Error updating marketplace listing:', error)
      return false
    }
  }

  // Delete marketplace listing
  async deleteListing(listingId: string): Promise<boolean> {
    try {
      console.log(`Deleting marketplace listing: ${listingId}`)

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${listingId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`
          }
        }
      )

      return response.ok
    } catch (error) {
      console.error('Error deleting marketplace listing:', error)
      return false
    }
  }

  // Get marketplace listings
  async getListings(): Promise<MarketplaceListing[]> {
    try {
      console.log('Fetching marketplace listings...')

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.config.pageId}/marketplace_listings?fields=id,title,description,price,currency,location,category,subcategory,condition,availability,images,status,created_time,updated_time&access_token=${this.config.accessToken}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch marketplace listings')
      }

      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error('Error fetching marketplace listings:', error)
      return []
    }
  }

  // Get listing details
  async getListingDetails(listingId: string): Promise<MarketplaceListing | null> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${listingId}?fields=id,title,description,price,currency,location,category,subcategory,condition,availability,images,status,created_time,updated_time&access_token=${this.config.accessToken}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch listing details')
      }

      const data = await response.json()
      return this.parseListingData(data)
    } catch (error) {
      console.error('Error fetching listing details:', error)
      return null
    }
  }

  // Parse listing data from Facebook API
  private parseListingData(data: any): MarketplaceListing {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      currency: data.currency,
      location: {
        city: data.location?.city || '',
        state: data.location?.state || '',
        country: data.location?.country || '',
        latitude: data.location?.latitude,
        longitude: data.location?.longitude
      },
      category: data.category,
      subcategory: data.subcategory,
      images: data.images || [],
      condition: data.condition || 'used',
      availability: data.availability || 'available',
      contactInfo: {
        phone: '',
        email: '',
        website: ''
      },
      customFields: data.custom_fields || {},
      facebookListingId: data.id,
      status: data.status || 'active',
      createdAt: new Date(data.created_time),
      updatedAt: new Date(data.updated_time)
    }
  }

  // Sync property to marketplace
  async syncPropertyToMarketplace(property: any): Promise<string | null> {
    try {
      const listing: MarketplaceListing = {
        id: `prop-${property.id}`,
        title: property.title,
        description: property.description,
        price: property.price,
        currency: 'JPY',
        location: {
          city: property.city || 'Tokyo',
          state: 'Tokyo',
          country: 'Japan',
          latitude: property.coordinates?.lat,
          longitude: property.coordinates?.lng
        },
        category: this.mapPropertyTypeToCategory(property.propertyType),
        subcategory: this.mapPropertyTypeToSubcategory(property.propertyType),
        images: property.images || [],
        condition: 'new',
        availability: property.availability_status === 'available' ? 'available' : 'pending',
        contactInfo: {
          phone: property.agent?.phone || '',
          email: property.agent?.email || '',
          website: property.contactInfo?.website || ''
        },
        customFields: {
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          property_type: property.propertyType,
          furnished: property.furnished,
          pets_allowed: property.pets_allowed,
          has_balcony: property.has_balcony
        },
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      return await this.createListing(listing)
    } catch (error) {
      console.error('Error syncing property to marketplace:', error)
      return null
    }
  }

  // Map property type to marketplace category
  private mapPropertyTypeToCategory(propertyType: string): string {
    const categoryMap: Record<string, string> = {
      'apartment': 'Housing',
      'house': 'Housing',
      'studio': 'Housing',
      'office': 'Commercial',
      'commercial': 'Commercial'
    }
    return categoryMap[propertyType] || 'Housing'
  }

  // Map property type to marketplace subcategory
  private mapPropertyTypeToSubcategory(propertyType: string): string {
    const subcategoryMap: Record<string, string> = {
      'apartment': 'Apartments',
      'house': 'Houses',
      'studio': 'Studios',
      'office': 'Office Space',
      'commercial': 'Commercial Space'
    }
    return subcategoryMap[propertyType] || 'Apartments'
  }

  // Bulk sync properties
  async bulkSyncProperties(properties: any[]): Promise<{ success: number; failed: number }> {
    let success = 0
    let failed = 0

    for (const property of properties) {
      try {
        const listingId = await this.syncPropertyToMarketplace(property)
        if (listingId) {
          success++
        } else {
          failed++
        }
      } catch (error) {
        console.error(`Error syncing property ${property.id}:`, error)
        failed++
      }
    }

    return { success, failed }
  }

  // Get marketplace analytics
  async getMarketplaceAnalytics(): Promise<any> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.config.pageId}/insights?metric=page_impressions,page_reach,page_engaged_users&access_token=${this.config.accessToken}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch marketplace analytics')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching marketplace analytics:', error)
      return null
    }
  }

  // Search marketplace listings
  async searchListings(query: string, filters?: any): Promise<MarketplaceListing[]> {
    try {
      let url = `https://graph.facebook.com/v18.0/search?q=${encodeURIComponent(query)}&type=marketplace_listing&access_token=${this.config.accessToken}`
      
      if (filters) {
        if (filters.category) url += `&category=${filters.category}`
        if (filters.location) url += `&location=${filters.location}`
        if (filters.priceMin) url += `&price_min=${filters.priceMin}`
        if (filters.priceMax) url += `&price_max=${filters.priceMax}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to search marketplace listings')
      }

      const data = await response.json()
      return (data.data || []).map((item: any) => this.parseListingData(item))
    } catch (error) {
      console.error('Error searching marketplace listings:', error)
      return []
    }
  }

  // Get marketplace categories
  async getCategories(): Promise<any[]> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/marketplace_categories?access_token=${this.config.accessToken}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch marketplace categories')
      }

      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error('Error fetching marketplace categories:', error)
      return []
    }
  }

  // Get initialization status
  isInitialized(): boolean {
    return this.initialized
  }

  // Get configuration
  getConfig(): MarketplaceConfig {
    return { ...this.config }
  }
}

// Default configuration
export const defaultMarketplaceConfig: MarketplaceConfig = {
  accessToken: '',
  pageId: '',
  categoryId: 'housing',
  subcategoryId: 'apartments',
  autoPublish: true,
  syncInterval: 60 // 1 hour
}

export default FacebookMarketplaceService