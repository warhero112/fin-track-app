// AI-Powered Property Recommendation Engine
// This service provides intelligent property recommendations based on user behavior and preferences

export interface UserProfile {
  id: string
  preferences: {
    priceRange: { min: number; max: number }
    locations: string[]
    propertyTypes: string[]
    amenities: string[]
    bedrooms: { min: number; max: number }
    bathrooms: { min: number; max: number }
    area: { min: number; max: number }
  }
  behavior: {
    viewedProperties: string[]
    savedProperties: string[]
    searchedLocations: string[]
    searchedKeywords: string[]
    sessionDuration: number
    clickThroughRate: number
  }
  demographics: {
    age: number
    occupation: string
    familySize: number
    income: number
    nationality: string
  }
}

export interface Recommendation {
  propertyId: string
  score: number
  reasons: string[]
  confidence: number
  category: 'similar' | 'trending' | 'personalized' | 'budget' | 'luxury'
}

export interface RecommendationConfig {
  maxRecommendations: number
  enableCollaborativeFiltering: boolean
  enableContentBasedFiltering: boolean
  enableDemographicFiltering: boolean
  enableTrendingFiltering: boolean
  minScore: number
  diversityFactor: number
}

class AIRecommendationEngine {
  private config: RecommendationConfig
  private userProfiles: Map<string, UserProfile> = new Map()
  private propertyFeatures: Map<string, any> = new Map()
  private userSimilarityMatrix: Map<string, Map<string, number>> = new Map()

  constructor(config: RecommendationConfig) {
    this.config = config
  }

  // Get recommendations for a user
  async getRecommendations(
    userId: string, 
    properties: any[], 
    limit?: number
  ): Promise<Recommendation[]> {
    console.log(`Getting recommendations for user ${userId}`)

    const userProfile = await this.getUserProfile(userId)
    if (!userProfile) {
      return this.getDefaultRecommendations(properties, limit)
    }

    try {
      const recommendations: Recommendation[] = []

      // Get different types of recommendations
      const [personalized, similar, trending, budget, luxury] = await Promise.all([
        this.getPersonalizedRecommendations(userProfile, properties),
        this.getSimilarPropertyRecommendations(userProfile, properties),
        this.getTrendingRecommendations(properties),
        this.getBudgetRecommendations(userProfile, properties),
        this.getLuxuryRecommendations(userProfile, properties)
      ])

      // Combine and deduplicate recommendations
      const allRecommendations = [
        ...personalized,
        ...similar,
        ...trending,
        ...budget,
        ...luxury
      ]

      // Remove duplicates and sort by score
      const uniqueRecommendations = this.deduplicateRecommendations(allRecommendations)
      const sortedRecommendations = uniqueRecommendations
        .sort((a, b) => b.score - a.score)
        .filter(rec => rec.score >= this.config.minScore)

      // Apply diversity factor
      const diverseRecommendations = this.applyDiversityFactor(sortedRecommendations)

      return diverseRecommendations.slice(0, limit || this.config.maxRecommendations)
    } catch (error) {
      console.error('Error getting recommendations:', error)
      return this.getDefaultRecommendations(properties, limit)
    }
  }

  // Get personalized recommendations based on user profile
  private async getPersonalizedRecommendations(
    userProfile: UserProfile, 
    properties: any[]
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []

    for (const property of properties) {
      const score = this.calculatePersonalizedScore(userProfile, property)
      
      if (score > 0) {
        recommendations.push({
          propertyId: property.id,
          score,
          reasons: this.getPersonalizedReasons(userProfile, property),
          confidence: this.calculateConfidence(userProfile, property),
          category: 'personalized'
        })
      }
    }

    return recommendations
  }

  // Calculate personalized score
  private calculatePersonalizedScore(userProfile: UserProfile, property: any): number {
    let score = 0
    const weights = {
      price: 0.3,
      location: 0.25,
      propertyType: 0.2,
      amenities: 0.15,
      size: 0.1
    }

    // Price score
    const priceScore = this.calculatePriceScore(userProfile.preferences.priceRange, property.price)
    score += priceScore * weights.price

    // Location score
    const locationScore = this.calculateLocationScore(userProfile.preferences.locations, property.location)
    score += locationScore * weights.location

    // Property type score
    const typeScore = this.calculateTypeScore(userProfile.preferences.propertyTypes, property.propertyType)
    score += typeScore * weights.propertyType

    // Amenities score
    const amenitiesScore = this.calculateAmenitiesScore(userProfile.preferences.amenities, property.features)
    score += amenitiesScore * weights.amenities

    // Size score
    const sizeScore = this.calculateSizeScore(userProfile.preferences, property)
    score += sizeScore * weights.size

    return Math.min(1, score)
  }

  // Calculate price score
  private calculatePriceScore(priceRange: { min: number; max: number }, propertyPrice: number): number {
    if (propertyPrice >= priceRange.min && propertyPrice <= priceRange.max) {
      return 1.0
    } else if (propertyPrice < priceRange.min) {
      return 0.8 // Slightly below budget is acceptable
    } else {
      const excess = (propertyPrice - priceRange.max) / priceRange.max
      return Math.max(0, 1 - excess)
    }
  }

  // Calculate location score
  private calculateLocationScore(preferredLocations: string[], propertyLocation: string): number {
    if (preferredLocations.length === 0) return 0.5

    const normalizedLocation = propertyLocation.toLowerCase()
    const normalizedPreferred = preferredLocations.map(loc => loc.toLowerCase())

    for (const preferred of normalizedPreferred) {
      if (normalizedLocation.includes(preferred)) {
        return 1.0
      }
    }

    return 0.2 // Some score for non-preferred locations
  }

  // Calculate property type score
  private calculateTypeScore(preferredTypes: string[], propertyType: string): number {
    if (preferredTypes.length === 0) return 0.5

    return preferredTypes.includes(propertyType) ? 1.0 : 0.3
  }

  // Calculate amenities score
  private calculateAmenitiesScore(preferredAmenities: string[], propertyFeatures: string[]): number {
    if (preferredAmenities.length === 0) return 0.5

    const matchingAmenities = preferredAmenities.filter(amenity => 
      propertyFeatures.includes(amenity)
    )

    return matchingAmenities.length / preferredAmenities.length
  }

  // Calculate size score
  private calculateSizeScore(preferences: any, property: any): number {
    let score = 0

    // Bedrooms
    if (property.bedrooms >= preferences.bedrooms.min && property.bedrooms <= preferences.bedrooms.max) {
      score += 0.4
    }

    // Bathrooms
    if (property.bathrooms >= preferences.bathrooms.min && property.bathrooms <= preferences.bathrooms.max) {
      score += 0.3
    }

    // Area
    if (property.area >= preferences.area.min && property.area <= preferences.area.max) {
      score += 0.3
    }

    return score
  }

  // Get similar property recommendations
  private async getSimilarPropertyRecommendations(
    userProfile: UserProfile, 
    properties: any[]
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []
    const savedProperties = userProfile.behavior.savedProperties

    for (const propertyId of savedProperties) {
      const savedProperty = properties.find(p => p.id === propertyId)
      if (!savedProperty) continue

      for (const property of properties) {
        if (property.id === propertyId) continue

        const similarity = this.calculatePropertySimilarity(savedProperty, property)
        
        if (similarity > 0.6) {
          recommendations.push({
            propertyId: property.id,
            score: similarity * 0.8, // Slightly lower than personalized
            reasons: [`Similar to your saved property: ${savedProperty.title}`],
            confidence: similarity,
            category: 'similar'
          })
        }
      }
    }

    return recommendations
  }

  // Calculate property similarity
  private calculatePropertySimilarity(property1: any, property2: any): number {
    let similarity = 0

    // Price similarity
    const priceDiff = Math.abs(property1.price - property2.price) / Math.max(property1.price, property2.price)
    similarity += (1 - priceDiff) * 0.3

    // Location similarity
    const locationSimilarity = this.calculateTextSimilarity(property1.location, property2.location)
    similarity += locationSimilarity * 0.3

    // Property type similarity
    const typeSimilarity = property1.propertyType === property2.propertyType ? 1 : 0
    similarity += typeSimilarity * 0.2

    // Features similarity
    const featuresSimilarity = this.calculateFeaturesSimilarity(property1.features, property2.features)
    similarity += featuresSimilarity * 0.2

    return similarity
  }

  // Calculate text similarity
  private calculateTextSimilarity(text1: string, text2: string): number {
    if (!text1 || !text2) return 0

    const words1 = text1.toLowerCase().split(' ')
    const words2 = text2.toLowerCase().split(' ')
    const commonWords = words1.filter(word => words2.includes(word))
    
    return commonWords.length / Math.max(words1.length, words2.length)
  }

  // Calculate features similarity
  private calculateFeaturesSimilarity(features1: string[], features2: string[]): number {
    if (!features1 || !features2 || features1.length === 0 || features2.length === 0) {
      return 0
    }

    const commonFeatures = features1.filter(feature => features2.includes(feature))
    return commonFeatures.length / Math.max(features1.length, features2.length)
  }

  // Get trending recommendations
  private async getTrendingRecommendations(properties: any[]): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []

    // Sort properties by views, inquiries, or other trending metrics
    const trendingProperties = properties
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 10)

    for (const property of trendingProperties) {
      recommendations.push({
        propertyId: property.id,
        score: 0.7, // Fixed score for trending
        reasons: ['Currently trending in your area'],
        confidence: 0.8,
        category: 'trending'
      })
    }

    return recommendations
  }

  // Get budget recommendations
  private async getBudgetRecommendations(
    userProfile: UserProfile, 
    properties: any[]
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []
    const budgetThreshold = userProfile.preferences.priceRange.max * 0.8

    const budgetProperties = properties.filter(p => p.price <= budgetThreshold)

    for (const property of budgetProperties) {
      recommendations.push({
        propertyId: property.id,
        score: 0.6,
        reasons: ['Great value for money'],
        confidence: 0.7,
        category: 'budget'
      })
    }

    return recommendations
  }

  // Get luxury recommendations
  private async getLuxuryRecommendations(
    userProfile: UserProfile, 
    properties: any[]
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []
    const luxuryThreshold = userProfile.preferences.priceRange.max * 1.2

    const luxuryProperties = properties.filter(p => p.price >= luxuryThreshold)

    for (const property of luxuryProperties) {
      recommendations.push({
        propertyId: property.id,
        score: 0.5,
        reasons: ['Premium luxury property'],
        confidence: 0.6,
        category: 'luxury'
      })
    }

    return recommendations
  }

  // Get user profile
  private async getUserProfile(userId: string): Promise<UserProfile | null> {
    // In real implementation, fetch from database
    return this.userProfiles.get(userId) || null
  }

  // Get default recommendations
  private getDefaultRecommendations(properties: any[], limit?: number): Recommendation[] {
    return properties
      .slice(0, limit || 10)
      .map(property => ({
        propertyId: property.id,
        score: 0.5,
        reasons: ['Popular in your area'],
        confidence: 0.5,
        category: 'trending' as const
      }))
  }

  // Deduplicate recommendations
  private deduplicateRecommendations(recommendations: Recommendation[]): Recommendation[] {
    const seen = new Set<string>()
    return recommendations.filter(rec => {
      if (seen.has(rec.propertyId)) {
        return false
      }
      seen.add(rec.propertyId)
      return true
    })
  }

  // Apply diversity factor
  private applyDiversityFactor(recommendations: Recommendation[]): Recommendation[] {
    if (this.config.diversityFactor <= 0) return recommendations

    const diverse: Recommendation[] = []
    const categories = new Set<string>()

    for (const rec of recommendations) {
      if (diverse.length >= this.config.maxRecommendations) break

      if (!categories.has(rec.category) || Math.random() < this.config.diversityFactor) {
        diverse.push(rec)
        categories.add(rec.category)
      }
    }

    return diverse
  }

  // Get personalized reasons
  private getPersonalizedReasons(userProfile: UserProfile, property: any): string[] {
    const reasons: string[] = []

    // Price reason
    if (property.price >= userProfile.preferences.priceRange.min && 
        property.price <= userProfile.preferences.priceRange.max) {
      reasons.push('Within your budget')
    }

    // Location reason
    const preferredLocations = userProfile.preferences.locations
    if (preferredLocations.some(loc => property.location.toLowerCase().includes(loc.toLowerCase()))) {
      reasons.push('In your preferred location')
    }

    // Amenities reason
    const matchingAmenities = userProfile.preferences.amenities.filter(amenity => 
      property.features.includes(amenity)
    )
    if (matchingAmenities.length > 0) {
      reasons.push(`Has ${matchingAmenities.join(', ')}`)
    }

    return reasons
  }

  // Calculate confidence
  private calculateConfidence(userProfile: UserProfile, property: any): number {
    let confidence = 0.5

    // Increase confidence based on user behavior
    if (userProfile.behavior.savedProperties.includes(property.id)) {
      confidence += 0.3
    }

    if (userProfile.behavior.viewedProperties.includes(property.id)) {
      confidence += 0.2
    }

    return Math.min(1, confidence)
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const existing = this.userProfiles.get(userId) || this.getDefaultUserProfile(userId)
    const updated = { ...existing, ...updates }
    this.userProfiles.set(userId, updated)
  }

  // Get default user profile
  private getDefaultUserProfile(userId: string): UserProfile {
    return {
      id: userId,
      preferences: {
        priceRange: { min: 100000, max: 300000 },
        locations: [],
        propertyTypes: ['apartment'],
        amenities: [],
        bedrooms: { min: 1, max: 3 },
        bathrooms: { min: 1, max: 2 },
        area: { min: 30, max: 100 }
      },
      behavior: {
        viewedProperties: [],
        savedProperties: [],
        searchedLocations: [],
        searchedKeywords: [],
        sessionDuration: 0,
        clickThroughRate: 0
      },
      demographics: {
        age: 30,
        occupation: 'Professional',
        familySize: 1,
        income: 5000000,
        nationality: 'Japanese'
      }
    }
  }
}

// Default configuration
export const defaultRecommendationConfig: RecommendationConfig = {
  maxRecommendations: 20,
  enableCollaborativeFiltering: true,
  enableContentBasedFiltering: true,
  enableDemographicFiltering: true,
  enableTrendingFiltering: true,
  minScore: 0.3,
  diversityFactor: 0.3
}

export default AIRecommendationEngine