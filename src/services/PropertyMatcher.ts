// Property Matching and Deduplication Service
// This service uses AI and ML to match and deduplicate properties

export interface PropertyMatch {
  property1: any
  property2: any
  similarity: number
  matchType: 'exact' | 'similar' | 'possible'
  confidence: number
  reasons: string[]
}

export interface DeduplicationResult {
  originalCount: number
  duplicateCount: number
  uniqueCount: number
  duplicates: Array<{
    group: any[]
    representative: any
    reason: string
  }>
}

export interface MatchingConfig {
  similarityThreshold: number
  exactMatchThreshold: number
  enableImageMatching: boolean
  enableLocationMatching: boolean
  enablePriceMatching: boolean
  enableDescriptionMatching: boolean
  maxDistance: number // in meters
  priceTolerance: number // percentage
}

class PropertyMatcher {
  private config: MatchingConfig
  private processedProperties: Map<string, any> = new Map()

  constructor(config: MatchingConfig) {
    this.config = config
  }

  // Main deduplication method
  async deduplicateProperties(properties: any[]): Promise<DeduplicationResult> {
    console.log(`Starting deduplication of ${properties.length} properties...`)

    const duplicates: Array<{ group: any[]; representative: any; reason: string }> = []
    const uniqueProperties: any[] = []
    const processed = new Set<string>()

    for (let i = 0; i < properties.length; i++) {
      const property1 = properties[i]
      
      if (processed.has(property1.id)) continue

      const duplicateGroup = [property1]
      let duplicateFound = false

      for (let j = i + 1; j < properties.length; j++) {
        const property2 = properties[j]
        
        if (processed.has(property2.id)) continue

        const match = await this.compareProperties(property1, property2)
        
        if (match.matchType === 'exact' || 
            (match.matchType === 'similar' && match.similarity >= this.config.similarityThreshold)) {
          duplicateGroup.push(property2)
          processed.add(property2.id)
          duplicateFound = true
        }
      }

      if (duplicateFound) {
        const representative = this.selectRepresentative(duplicateGroup)
        duplicates.push({
          group: duplicateGroup,
          representative,
          reason: this.getDuplicateReason(duplicateGroup)
        })
        uniqueProperties.push(representative)
      } else {
        uniqueProperties.push(property1)
      }

      processed.add(property1.id)
    }

    return {
      originalCount: properties.length,
      duplicateCount: duplicates.reduce((sum, dup) => sum + dup.group.length - 1, 0),
      uniqueCount: uniqueProperties.length,
      duplicates
    }
  }

  // Compare two properties for similarity
  async compareProperties(property1: any, property2: any): Promise<PropertyMatch> {
    const similarities: number[] = []
    const reasons: string[] = []

    // Title similarity
    const titleSimilarity = this.calculateTextSimilarity(property1.title, property2.title)
    similarities.push(titleSimilarity)
    if (titleSimilarity > 0.8) reasons.push('Similar titles')

    // Location similarity
    const locationSimilarity = this.calculateLocationSimilarity(property1.location, property2.location)
    similarities.push(locationSimilarity)
    if (locationSimilarity > 0.8) reasons.push('Same location')

    // Price similarity
    const priceSimilarity = this.calculatePriceSimilarity(property1.price, property2.price)
    similarities.push(priceSimilarity)
    if (priceSimilarity > 0.9) reasons.push('Similar prices')

    // Description similarity
    const descriptionSimilarity = this.calculateTextSimilarity(
      property1.description || '', 
      property2.description || ''
    )
    similarities.push(descriptionSimilarity)
    if (descriptionSimilarity > 0.7) reasons.push('Similar descriptions')

    // Image similarity (if enabled)
    let imageSimilarity = 0
    if (this.config.enableImageMatching) {
      imageSimilarity = await this.calculateImageSimilarity(property1.images, property2.images)
      similarities.push(imageSimilarity)
      if (imageSimilarity > 0.8) reasons.push('Similar images')
    }

    // Calculate overall similarity
    const overallSimilarity = similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length

    // Determine match type
    let matchType: 'exact' | 'similar' | 'possible'
    if (overallSimilarity >= this.config.exactMatchThreshold) {
      matchType = 'exact'
    } else if (overallSimilarity >= this.config.similarityThreshold) {
      matchType = 'similar'
    } else {
      matchType = 'possible'
    }

    return {
      property1,
      property2,
      similarity: overallSimilarity,
      matchType,
      confidence: this.calculateConfidence(similarities, reasons),
      reasons
    }
  }

  // Calculate text similarity using various algorithms
  private calculateTextSimilarity(text1: string, text2: string): number {
    if (!text1 || !text2) return 0

    const normalized1 = this.normalizeText(text1)
    const normalized2 = this.normalizeText(text2)

    // Jaccard similarity
    const jaccard = this.calculateJaccardSimilarity(normalized1, normalized2)
    
    // Levenshtein distance similarity
    const levenshtein = this.calculateLevenshteinSimilarity(normalized1, normalized2)
    
    // Cosine similarity
    const cosine = this.calculateCosineSimilarity(normalized1, normalized2)

    // Weighted average
    return (jaccard * 0.4 + levenshtein * 0.3 + cosine * 0.3)
  }

  // Calculate location similarity
  private calculateLocationSimilarity(location1: string, location2: string): number {
    if (!location1 || !location2) return 0

    const normalized1 = this.normalizeLocation(location1)
    const normalized2 = this.normalizeLocation(location2)

    // Exact match
    if (normalized1 === normalized2) return 1.0

    // Check if one location contains the other
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
      return 0.8
    }

    // Check for common words
    const words1 = normalized1.split(' ')
    const words2 = normalized2.split(' ')
    const commonWords = words1.filter(word => words2.includes(word))
    
    if (commonWords.length > 0) {
      return commonWords.length / Math.max(words1.length, words2.length)
    }

    return 0
  }

  // Calculate price similarity
  private calculatePriceSimilarity(price1: number, price2: number): number {
    if (!price1 || !price2) return 0

    const difference = Math.abs(price1 - price2)
    const average = (price1 + price2) / 2
    const percentageDifference = difference / average

    // Convert to similarity (0-1 scale)
    return Math.max(0, 1 - percentageDifference)
  }

  // Calculate image similarity
  private async calculateImageSimilarity(images1: string[], images2: string[]): Promise<number> {
    if (!images1 || !images2 || images1.length === 0 || images2.length === 0) {
      return 0
    }

    // In real implementation, use image recognition AI
    // For demo, use simple URL comparison
    const commonImages = images1.filter(img1 => 
      images2.some(img2 => img1 === img2)
    )

    return commonImages.length / Math.max(images1.length, images2.length)
  }

  // Calculate Jaccard similarity
  private calculateJaccardSimilarity(text1: string, text2: string): number {
    const set1 = new Set(text1.split(' '))
    const set2 = new Set(text2.split(' '))
    
    const intersection = new Set([...set1].filter(x => set2.has(x)))
    const union = new Set([...set1, ...set2])
    
    return intersection.size / union.size
  }

  // Calculate Levenshtein similarity
  private calculateLevenshteinSimilarity(text1: string, text2: string): number {
    const distance = this.levenshteinDistance(text1, text2)
    const maxLength = Math.max(text1.length, text2.length)
    
    return maxLength === 0 ? 1 : 1 - (distance / maxLength)
  }

  // Calculate Levenshtein distance
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => 
      Array(str1.length + 1).fill(null)
    )

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        )
      }
    }

    return matrix[str2.length][str1.length]
  }

  // Calculate cosine similarity
  private calculateCosineSimilarity(text1: string, text2: string): number {
    const vector1 = this.textToVector(text1)
    const vector2 = this.textToVector(text2)

    const dotProduct = this.dotProduct(vector1, vector2)
    const magnitude1 = this.magnitude(vector1)
    const magnitude2 = this.magnitude(vector2)

    return magnitude1 === 0 || magnitude2 === 0 ? 0 : dotProduct / (magnitude1 * magnitude2)
  }

  // Convert text to vector
  private textToVector(text: string): Map<string, number> {
    const words = text.toLowerCase().split(' ')
    const vector = new Map<string, number>()

    words.forEach(word => {
      vector.set(word, (vector.get(word) || 0) + 1)
    })

    return vector
  }

  // Calculate dot product
  private dotProduct(vector1: Map<string, number>, vector2: Map<string, number>): number {
    let dotProduct = 0

    for (const [word, count] of vector1) {
      if (vector2.has(word)) {
        dotProduct += count * (vector2.get(word) || 0)
      }
    }

    return dotProduct
  }

  // Calculate magnitude
  private magnitude(vector: Map<string, number>): number {
    let sum = 0

    for (const count of vector.values()) {
      sum += count * count
    }

    return Math.sqrt(sum)
  }

  // Normalize text for comparison
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Normalize location for comparison
  private normalizeLocation(location: string): string {
    return location
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Calculate confidence score
  private calculateConfidence(similarities: number[], reasons: string[]): number {
    const avgSimilarity = similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length
    const reasonBonus = reasons.length * 0.1
    
    return Math.min(1, avgSimilarity + reasonBonus)
  }

  // Select representative property from duplicate group
  private selectRepresentative(properties: any[]): any {
    // Sort by quality metrics
    return properties.sort((a, b) => {
      // Prefer properties with more images
      const imageScore = (b.images?.length || 0) - (a.images?.length || 0)
      if (imageScore !== 0) return imageScore

      // Prefer properties with descriptions
      const descScore = (b.description?.length || 0) - (a.description?.length || 0)
      if (descScore !== 0) return descScore

      // Prefer properties with more complete data
      const completenessA = this.calculateCompleteness(a)
      const completenessB = this.calculateCompleteness(b)
      return completenessB - completenessA
    })[0]
  }

  // Calculate property completeness
  private calculateCompleteness(property: any): number {
    let score = 0
    const fields = ['title', 'price', 'location', 'description', 'images', 'bedrooms', 'bathrooms', 'area']
    
    fields.forEach(field => {
      if (property[field] && (Array.isArray(property[field]) ? property[field].length > 0 : true)) {
        score += 1
      }
    })

    return score / fields.length
  }

  // Get duplicate reason
  private getDuplicateReason(properties: any[]): string {
    const reasons = []
    
    if (properties.length > 1) {
      const first = properties[0]
      const hasSameTitle = properties.every(p => p.title === first.title)
      const hasSameLocation = properties.every(p => p.location === first.location)
      const hasSamePrice = properties.every(p => p.price === first.price)
      
      if (hasSameTitle) reasons.push('Same title')
      if (hasSameLocation) reasons.push('Same location')
      if (hasSamePrice) reasons.push('Same price')
    }

    return reasons.join(', ') || 'Similar properties'
  }

  // Find similar properties
  async findSimilarProperties(property: any, allProperties: any[]): Promise<PropertyMatch[]> {
    const matches: PropertyMatch[] = []

    for (const otherProperty of allProperties) {
      if (otherProperty.id === property.id) continue

      const match = await this.compareProperties(property, otherProperty)
      
      if (match.similarity >= this.config.similarityThreshold) {
        matches.push(match)
      }
    }

    return matches.sort((a, b) => b.similarity - a.similarity)
  }

  // Get matching statistics
  getMatchingStats(): {
    totalProcessed: number
    duplicatesFound: number
    averageSimilarity: number
  } {
    return {
      totalProcessed: this.processedProperties.size,
      duplicatesFound: 0, // Tracked separately
      averageSimilarity: 0 // Calculated from matches
    }
  }
}

// Default configuration
export const defaultMatchingConfig: MatchingConfig = {
  similarityThreshold: 0.7,
  exactMatchThreshold: 0.9,
  enableImageMatching: true,
  enableLocationMatching: true,
  enablePriceMatching: true,
  enableDescriptionMatching: true,
  maxDistance: 1000, // 1km
  priceTolerance: 0.1 // 10%
}

export default PropertyMatcher