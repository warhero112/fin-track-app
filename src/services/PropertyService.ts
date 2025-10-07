// Property Service - Centralized property data management

export interface Property {
  id: string
  title: string
  description: string
  price: number
  priceType: 'rent' | 'buy'
  address: string
  ward: string
  city: string
  prefecture: string
  images: string[]
  layout?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  size_sqm?: number
  property_type?: string
  furnished?: boolean
  pets_allowed?: boolean
  has_balcony?: boolean
  has_tatami?: boolean
  nearest_station?: string
  walk_time_minutes?: number
  deposit_amount?: number
  key_money?: number
  agent?: {
    name: string
    phone: string
    email: string
    avatar?: string
    rating?: number
    properties_sold?: number
  }
  availability_status: 'available' | 'pending' | 'sold'
  created_at: string
  updated_at: string
  isFavorite?: boolean
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface PropertyFilters {
  searchType?: 'rent' | 'buy' | 'all'
  location?: string
  propertyType?: string
  priceRange?: { min: number; max: number }
  bedrooms?: number
  bathrooms?: number
  area?: { min: number; max: number }
  features?: string[]
  keywords?: string
  sortBy?: string
}

class PropertyService {
  private properties: Property[] = []
  private favorites: Set<string> = new Set()

  constructor() {
    this.initializeMockData()
    this.loadFavorites()
  }

  // Initialize with comprehensive mock data
  private initializeMockData() {
    this.properties = [
      {
        id: '1',
        title: 'Modern Apartment in Shibuya',
        description: 'Beautiful modern apartment in the heart of Shibuya with excellent transportation access. This stunning 2LDK apartment features a spacious living area, modern kitchen, and private balcony with city views. Perfect for professionals working in central Tokyo.',
        price: 180000,
        priceType: 'rent',
        address: '1-2-3 Shibuya, Shibuya-ku, Tokyo',
        ward: 'Shibuya-ku',
        city: 'Tokyo',
        prefecture: 'Tokyo',
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
        ],
        layout: '2LDK',
        bedrooms: 2,
        bathrooms: 1,
        area: 45,
        size_sqm: 45,
        property_type: 'apartment',
        furnished: false,
        pets_allowed: true,
        has_balcony: true,
        has_tatami: false,
        nearest_station: 'Shibuya Station',
        walk_time_minutes: 5,
        deposit_amount: 360000,
        key_money: 180000,
        agent: {
          name: 'Yuki Tanaka',
          phone: '+81-3-1234-5678',
          email: 'yuki@rentora.jp',
          rating: 4.8,
          properties_sold: 156
        },
        availability_status: 'available',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
        coordinates: { lat: 35.6580, lng: 139.7016 }
      },
      {
        id: '2',
        title: 'Luxury House in Roppongi',
        description: 'Stunning luxury house in the prestigious Roppongi area. This beautiful 3LDK house features traditional Japanese elements combined with modern amenities, including a private garden and parking space.',
        price: 450000,
        priceType: 'rent',
        address: '2-3-4 Roppongi, Minato-ku, Tokyo',
        ward: 'Minato-ku',
        city: 'Tokyo',
        prefecture: 'Tokyo',
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
        ],
        layout: '3LDK',
        bedrooms: 3,
        bathrooms: 2,
        area: 85,
        size_sqm: 85,
        property_type: 'house',
        furnished: true,
        pets_allowed: false,
        has_balcony: false,
        has_tatami: true,
        nearest_station: 'Roppongi Station',
        walk_time_minutes: 8,
        deposit_amount: 900000,
        key_money: 450000,
        agent: {
          name: 'Hiroshi Sato',
          phone: '+81-3-2345-6789',
          email: 'hiroshi@rentora.jp',
          rating: 4.9,
          properties_sold: 203
        },
        availability_status: 'available',
        created_at: '2024-01-14T09:00:00Z',
        updated_at: '2024-01-14T09:00:00Z',
        coordinates: { lat: 35.6654, lng: 139.7296 }
      },
      {
        id: '3',
        title: 'Cozy Studio in Harajuku',
        description: 'Charming studio apartment in the trendy Harajuku area. Perfect for young professionals or students, this compact yet well-designed space maximizes every square meter.',
        price: 120000,
        priceType: 'rent',
        address: '3-4-5 Harajuku, Shibuya-ku, Tokyo',
        ward: 'Shibuya-ku',
        city: 'Tokyo',
        prefecture: 'Tokyo',
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
        ],
        layout: '1K',
        bedrooms: 1,
        bathrooms: 1,
        area: 25,
        size_sqm: 25,
        property_type: 'studio',
        furnished: true,
        pets_allowed: false,
        has_balcony: true,
        has_tatami: false,
        nearest_station: 'Harajuku Station',
        walk_time_minutes: 3,
        deposit_amount: 240000,
        key_money: 120000,
        agent: {
          name: 'Mika Yamamoto',
          phone: '+81-3-3456-7890',
          email: 'mika@rentora.jp',
          rating: 4.7,
          properties_sold: 89
        },
        availability_status: 'available',
        created_at: '2024-01-13T14:00:00Z',
        updated_at: '2024-01-13T14:00:00Z',
        coordinates: { lat: 35.6702, lng: 139.7026 }
      },
      {
        id: '4',
        title: 'Traditional House in Kyoto',
        description: 'Beautiful traditional Japanese house in the historic city of Kyoto. This authentic machiya features traditional architecture with modern conveniences, perfect for experiencing Japanese culture.',
        price: 250000,
        priceType: 'rent',
        address: '4-5-6 Gion, Higashiyama-ku, Kyoto',
        ward: 'Higashiyama-ku',
        city: 'Kyoto',
        prefecture: 'Kyoto',
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
        ],
        layout: '2LDK',
        bedrooms: 2,
        bathrooms: 1,
        area: 60,
        size_sqm: 60,
        property_type: 'house',
        furnished: false,
        pets_allowed: true,
        has_balcony: false,
        has_tatami: true,
        nearest_station: 'Gion-Shijo Station',
        walk_time_minutes: 10,
        deposit_amount: 500000,
        key_money: 250000,
        agent: {
          name: 'Takeshi Nakamura',
          phone: '+81-75-1234-5678',
          email: 'takeshi@rentora.jp',
          rating: 4.6,
          properties_sold: 67
        },
        availability_status: 'available',
        created_at: '2024-01-12T11:00:00Z',
        updated_at: '2024-01-12T11:00:00Z',
        coordinates: { lat: 35.0038, lng: 135.7749 }
      },
      {
        id: '5',
        title: 'Modern Apartment in Osaka',
        description: 'Contemporary apartment in the bustling city of Osaka. This 1LDK apartment offers modern living with easy access to shopping, dining, and entertainment districts.',
        price: 150000,
        priceType: 'rent',
        address: '5-6-7 Namba, Chuo-ku, Osaka',
        ward: 'Chuo-ku',
        city: 'Osaka',
        prefecture: 'Osaka',
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
        ],
        layout: '1LDK',
        bedrooms: 1,
        bathrooms: 1,
        area: 35,
        size_sqm: 35,
        property_type: 'apartment',
        furnished: false,
        pets_allowed: true,
        has_balcony: true,
        has_tatami: false,
        nearest_station: 'Namba Station',
        walk_time_minutes: 7,
        deposit_amount: 300000,
        key_money: 150000,
        agent: {
          name: 'Akiko Tanaka',
          phone: '+81-6-1234-5678',
          email: 'akiko@rentora.jp',
          rating: 4.5,
          properties_sold: 112
        },
        availability_status: 'available',
        created_at: '2024-01-11T16:00:00Z',
        updated_at: '2024-01-11T16:00:00Z',
        coordinates: { lat: 34.6937, lng: 135.5023 }
      }
    ]
  }

  // Load favorites from localStorage
  private loadFavorites() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rentora_favorites')
      if (saved) {
        this.favorites = new Set(JSON.parse(saved))
      }
    }
  }

  // Save favorites to localStorage
  private saveFavorites() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rentora_favorites', JSON.stringify(Array.from(this.favorites)))
    }
  }

  // Get all properties
  async getAllProperties(): Promise<Property[]> {
    return this.properties.map(property => ({
      ...property,
      isFavorite: this.favorites.has(property.id)
    }))
  }

  // Get property by ID
  async getPropertyById(id: string): Promise<Property | null> {
    const property = this.properties.find(p => p.id === id)
    if (!property) return null
    
    return {
      ...property,
      isFavorite: this.favorites.has(property.id)
    }
  }

  // Search properties with filters
  async searchProperties(filters: PropertyFilters = {}): Promise<Property[]> {
    let results = [...this.properties]

    // Filter by search type
    if (filters.searchType && filters.searchType !== 'all') {
      results = results.filter(p => p.priceType === filters.searchType)
    }

    // Filter by location
    if (filters.location) {
      const location = filters.location.toLowerCase()
      results = results.filter(p => 
        p.city.toLowerCase().includes(location) ||
        p.ward.toLowerCase().includes(location) ||
        p.prefecture.toLowerCase().includes(location) ||
        p.address.toLowerCase().includes(location)
      )
    }

    // Filter by property type
    if (filters.propertyType) {
      results = results.filter(p => p.property_type === filters.propertyType)
    }

    // Filter by price range
    if (filters.priceRange) {
      results = results.filter(p => 
        p.price >= filters.priceRange!.min && p.price <= filters.priceRange!.max
      )
    }

    // Filter by bedrooms
    if (filters.bedrooms) {
      results = results.filter(p => p.bedrooms === filters.bedrooms)
    }

    // Filter by bathrooms
    if (filters.bathrooms) {
      results = results.filter(p => p.bathrooms === filters.bathrooms)
    }

    // Filter by area
    if (filters.area) {
      results = results.filter(p => 
        p.area && p.area >= filters.area!.min && p.area <= filters.area!.max
      )
    }

    // Filter by features
    if (filters.features && filters.features.length > 0) {
      results = results.filter(p => {
        return filters.features!.every(feature => {
          switch (feature) {
            case 'furnished': return p.furnished
            case 'pets_allowed': return p.pets_allowed
            case 'has_balcony': return p.has_balcony
            case 'has_tatami': return p.has_tatami
            default: return false
          }
        })
      })
    }

    // Filter by keywords
    if (filters.keywords) {
      const keywords = filters.keywords.toLowerCase()
      results = results.filter(p => 
        p.title.toLowerCase().includes(keywords) ||
        p.description.toLowerCase().includes(keywords) ||
        p.address.toLowerCase().includes(keywords)
      )
    }

    // Sort results
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          results.sort((a, b) => a.price - b.price)
          break
        case 'price_desc':
          results.sort((a, b) => b.price - a.price)
          break
        case 'newest':
          results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          break
        case 'oldest':
          results.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          break
        case 'area_asc':
          results.sort((a, b) => (a.area || 0) - (b.area || 0))
          break
        case 'area_desc':
          results.sort((a, b) => (b.area || 0) - (a.area || 0))
          break
      }
    }

    return results.map(property => ({
      ...property,
      isFavorite: this.favorites.has(property.id)
    }))
  }

  // Get featured properties
  async getFeaturedProperties(): Promise<Property[]> {
    return this.properties
      .filter(p => p.availability_status === 'available')
      .slice(0, 6)
      .map(property => ({
        ...property,
        isFavorite: this.favorites.has(property.id)
      }))
  }

  // Toggle favorite status
  async toggleFavorite(propertyId: string): Promise<boolean> {
    if (this.favorites.has(propertyId)) {
      this.favorites.delete(propertyId)
    } else {
      this.favorites.add(propertyId)
    }
    this.saveFavorites()
    return this.favorites.has(propertyId)
  }

  // Get favorite properties
  async getFavoriteProperties(): Promise<Property[]> {
    const favoriteIds = Array.from(this.favorites)
    return this.properties
      .filter(p => favoriteIds.includes(p.id))
      .map(property => ({
        ...property,
        isFavorite: true
      }))
  }

  // Add property to comparison
  async addToComparison(propertyId: string): Promise<boolean> {
    // In a real app, this would be stored in user context or localStorage
    return true
  }

  // Remove property from comparison
  async removeFromComparison(propertyId: string): Promise<boolean> {
    // In a real app, this would be stored in user context or localStorage
    return true
  }

  // Get comparison properties
  async getComparisonProperties(): Promise<Property[]> {
    // In a real app, this would be stored in user context or localStorage
    return []
  }

  // Get property statistics
  async getPropertyStats(): Promise<{
    total: number
    available: number
    pending: number
    sold: number
    averagePrice: number
    averageArea: number
  }> {
    const total = this.properties.length
    const available = this.properties.filter(p => p.availability_status === 'available').length
    const pending = this.properties.filter(p => p.availability_status === 'pending').length
    const sold = this.properties.filter(p => p.availability_status === 'sold').length
    const averagePrice = this.properties.reduce((sum, p) => sum + p.price, 0) / total
    const averageArea = this.properties.reduce((sum, p) => sum + (p.area || 0), 0) / total

    return {
      total,
      available,
      pending,
      sold,
      averagePrice,
      averageArea
    }
  }

  // Get properties by location
  async getPropertiesByLocation(location: string): Promise<Property[]> {
    return this.properties
      .filter(p => 
        p.city.toLowerCase().includes(location.toLowerCase()) ||
        p.ward.toLowerCase().includes(location.toLowerCase()) ||
        p.prefecture.toLowerCase().includes(location.toLowerCase())
      )
      .map(property => ({
        ...property,
        isFavorite: this.favorites.has(property.id)
      }))
  }

  // Get properties by type
  async getPropertiesByType(type: string): Promise<Property[]> {
    return this.properties
      .filter(p => p.property_type === type)
      .map(property => ({
        ...property,
        isFavorite: this.favorites.has(property.id)
      }))
  }

  // Get recent properties
  async getRecentProperties(limit: number = 10): Promise<Property[]> {
    return this.properties
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)
      .map(property => ({
        ...property,
        isFavorite: this.favorites.has(property.id)
      }))
  }
}

// Create singleton instance
const propertyService = new PropertyService()

export default propertyService