// Property Data Gathering Service
// This service handles automated data collection from various property websites

export interface PropertySource {
  name: string
  baseUrl: string
  selectors: {
    propertyList: string
    propertyCard: string
    title: string
    price: string
    location: string
    image: string
    bedrooms?: string
    bathrooms?: string
    area?: string
    description?: string
  }
  pagination?: {
    nextPage: string
    maxPages: number
  }
  rateLimit: {
    requestsPerMinute: number
    delayBetweenRequests: number
  }
}

export interface ScrapedProperty {
  id: string
  source: string
  title: string
  price: number
  priceType: 'rent' | 'sale'
  location: string
  ward?: string
  city: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  image: string
  images: string[]
  description?: string
  url: string
  scrapedAt: Date
  rawData: any
}

export interface DataGatheringConfig {
  sources: PropertySource[]
  updateInterval: number // in minutes
  maxPropertiesPerSource: number
  enableDeduplication: boolean
  enableImageProcessing: boolean
  enableLocationEnrichment: boolean
}

class PropertyDataGatherer {
  private config: DataGatheringConfig
  private isRunning: boolean = false
  private scrapedProperties: ScrapedProperty[] = []
  private rateLimiters: Map<string, { lastRequest: number; requestCount: number }> = new Map()

  constructor(config: DataGatheringConfig) {
    this.config = config
  }

  // Main data gathering orchestrator
  async startDataGathering(): Promise<void> {
    if (this.isRunning) {
      console.log('Data gathering is already running')
      return
    }

    this.isRunning = true
    console.log('Starting automated data gathering...')

    try {
      for (const source of this.config.sources) {
        await this.scrapeSource(source)
        await this.delay(source.rateLimit.delayBetweenRequests)
      }

      // Process and enrich data
      await this.processScrapedData()
      
      // Deduplicate if enabled
      if (this.config.enableDeduplication) {
        await this.deduplicateProperties()
      }

      // Save to database
      await this.saveToDatabase()

      console.log(`Data gathering completed. Found ${this.scrapedProperties.length} properties`)
    } catch (error) {
      console.error('Error during data gathering:', error)
    } finally {
      this.isRunning = false
    }
  }

  // Scrape individual source
  private async scrapeSource(source: PropertySource): Promise<void> {
    console.log(`Scraping ${source.name}...`)
    
    try {
      const properties = await this.scrapePropertiesFromSource(source)
      this.scrapedProperties.push(...properties)
      console.log(`Found ${properties.length} properties from ${source.name}`)
    } catch (error) {
      console.error(`Error scraping ${source.name}:`, error)
    }
  }

  // Scrape properties from a specific source
  private async scrapePropertiesFromSource(source: PropertySource): Promise<ScrapedProperty[]> {
    const properties: ScrapedProperty[] = []
    let currentPage = 1
    const maxPages = source.pagination?.maxPages || 10

    while (currentPage <= maxPages && properties.length < this.config.maxPropertiesPerSource) {
      try {
        // Rate limiting
        await this.enforceRateLimit(source.name, source.rateLimit)

        const pageUrl = this.buildPageUrl(source, currentPage)
        const pageData = await this.fetchPageData(pageUrl)
        
        if (!pageData) break

        const pageProperties = await this.extractPropertiesFromPage(pageData, source, pageUrl)
        properties.push(...pageProperties)

        // Check if there's a next page
        if (!this.hasNextPage(pageData, source)) break

        currentPage++
      } catch (error) {
        console.error(`Error scraping page ${currentPage} of ${source.name}:`, error)
        break
      }
    }

    return properties
  }

  // Build page URL with pagination
  private buildPageUrl(source: PropertySource, page: number): string {
    if (source.pagination?.nextPage) {
      return source.pagination.nextPage.replace('{page}', page.toString())
    }
    return `${source.baseUrl}?page=${page}`
  }

  // Fetch page data (simulated - in real implementation, use proper scraping)
  private async fetchPageData(url: string): Promise<any> {
    // Simulate API call or web scraping
    await this.delay(1000)
    
    // Mock data for demonstration
    return {
      properties: [
        {
          title: 'Modern Apartment in Shibuya',
          price: '¥180,000',
          location: 'Shibuya, Tokyo',
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80',
          bedrooms: '2',
          bathrooms: '1',
          area: '65',
          description: 'Beautiful modern apartment in the heart of Shibuya',
          url: `${url}/property/1`
        }
      ]
    }
  }

  // Extract properties from page data
  private async extractPropertiesFromPage(
    pageData: any, 
    source: PropertySource, 
    baseUrl: string
  ): Promise<ScrapedProperty[]> {
    const properties: ScrapedProperty[] = []

    for (const propertyData of pageData.properties || []) {
      try {
        const property = await this.parsePropertyData(propertyData, source, baseUrl)
        if (property) {
          properties.push(property)
        }
      } catch (error) {
        console.error('Error parsing property data:', error)
      }
    }

    return properties
  }

  // Parse individual property data
  private async parsePropertyData(
    data: any, 
    source: PropertySource, 
    baseUrl: string
  ): Promise<ScrapedProperty | null> {
    try {
      const price = this.parsePrice(data.price)
      const location = this.parseLocation(data.location)
      
      return {
        id: this.generatePropertyId(data, source.name),
        source: source.name,
        title: data.title || 'Untitled Property',
        price: price.amount,
        priceType: price.type,
        location: data.location || '',
        ward: location.ward,
        city: location.city,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : undefined,
        bathrooms: data.bathrooms ? parseInt(data.bathrooms) : undefined,
        area: data.area ? parseInt(data.area) : undefined,
        image: data.image || '',
        images: data.images || [data.image].filter(Boolean),
        description: data.description || '',
        url: data.url || baseUrl,
        scrapedAt: new Date(),
        rawData: data
      }
    } catch (error) {
      console.error('Error parsing property:', error)
      return null
    }
  }

  // Parse price from various formats
  private parsePrice(priceStr: string): { amount: number; type: 'rent' | 'sale' } {
    const cleanPrice = priceStr.replace(/[^\d,]/g, '')
    const amount = parseInt(cleanPrice.replace(/,/g, '')) || 0
    
    // Determine if it's rent or sale based on common patterns
    const isRent = priceStr.includes('月') || priceStr.includes('month') || amount < 10000000
    const isSale = priceStr.includes('万') || priceStr.includes('million') || amount >= 10000000
    
    return {
      amount: isSale ? amount * 10000 : amount, // Convert 万 to actual amount
      type: isSale ? 'sale' : 'rent'
    }
  }

  // Parse location to extract ward and city
  private parseLocation(location: string): { ward?: string; city: string } {
    const parts = location.split(',').map(p => p.trim())
    const city = parts[parts.length - 1] || 'Tokyo'
    const ward = parts.length > 1 ? parts[0] : undefined
    
    return { ward, city }
  }

  // Generate unique property ID
  private generatePropertyId(data: any, source: string): string {
    const title = data.title || ''
    const location = data.location || ''
    const price = data.price || ''
    
    const hash = this.simpleHash(`${source}-${title}-${location}-${price}`)
    return `${source}-${hash}`
  }

  // Simple hash function
  private simpleHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36)
  }

  // Check if there's a next page
  private hasNextPage(pageData: any, source: PropertySource): boolean {
    // Implement logic to check for next page
    return false // Simplified for demo
  }

  // Enforce rate limiting
  private async enforceRateLimit(sourceName: string, rateLimit: any): Promise<void> {
    const now = Date.now()
    const limiter = this.rateLimiters.get(sourceName) || { lastRequest: 0, requestCount: 0 }
    
    // Reset counter if minute has passed
    if (now - limiter.lastRequest > 60000) {
      limiter.requestCount = 0
    }
    
    // Check if we've exceeded rate limit
    if (limiter.requestCount >= rateLimit.requestsPerMinute) {
      const waitTime = 60000 - (now - limiter.lastRequest)
      if (waitTime > 0) {
        await this.delay(waitTime)
      }
      limiter.requestCount = 0
    }
    
    limiter.lastRequest = now
    limiter.requestCount++
    this.rateLimiters.set(sourceName, limiter)
    
    // Additional delay between requests
    await this.delay(rateLimit.delayBetweenRequests)
  }

  // Process and enrich scraped data
  private async processScrapedData(): Promise<void> {
    console.log('Processing scraped data...')
    
    for (const property of this.scrapedProperties) {
      // Enrich with additional data
      if (this.config.enableImageProcessing) {
        await this.processImages(property)
      }
      
      if (this.config.enableLocationEnrichment) {
        await this.enrichLocation(property)
      }
      
      // Validate property data
      this.validateProperty(property)
    }
  }

  // Process and optimize images
  private async processImages(property: ScrapedProperty): Promise<void> {
    // In real implementation, download, resize, and optimize images
    console.log(`Processing images for ${property.title}`)
  }

  // Enrich location data
  private async enrichLocation(property: ScrapedProperty): Promise<void> {
    // In real implementation, use geocoding services
    console.log(`Enriching location for ${property.title}`)
  }

  // Validate property data
  private validateProperty(property: ScrapedProperty): void {
    if (!property.title || !property.price || !property.location) {
      console.warn(`Invalid property data: ${property.id}`)
    }
  }

  // Deduplicate properties
  private async deduplicateProperties(): Promise<void> {
    console.log('Deduplicating properties...')
    
    const uniqueProperties = new Map<string, ScrapedProperty>()
    
    for (const property of this.scrapedProperties) {
      const key = this.generateDeduplicationKey(property)
      
      if (!uniqueProperties.has(key)) {
        uniqueProperties.set(key, property)
      } else {
        // Keep the most recent or highest quality property
        const existing = uniqueProperties.get(key)!
        if (property.scrapedAt > existing.scrapedAt) {
          uniqueProperties.set(key, property)
        }
      }
    }
    
    this.scrapedProperties = Array.from(uniqueProperties.values())
    console.log(`Deduplication complete. ${this.scrapedProperties.length} unique properties`)
  }

  // Generate deduplication key
  private generateDeduplicationKey(property: ScrapedProperty): string {
    const normalizedTitle = property.title.toLowerCase().replace(/[^\w\s]/g, '')
    const normalizedLocation = property.location.toLowerCase().replace(/[^\w\s]/g, '')
    return `${normalizedTitle}-${normalizedLocation}-${property.price}`
  }

  // Save to database
  private async saveToDatabase(): Promise<void> {
    console.log('Saving properties to database...')
    
    // In real implementation, save to database
    for (const property of this.scrapedProperties) {
      // await database.saveProperty(property)
      console.log(`Saved property: ${property.title}`)
    }
  }

  // Utility delay function
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Get scraping status
  getStatus(): { isRunning: boolean; scrapedCount: number; lastUpdate: Date | null } {
    return {
      isRunning: this.isRunning,
      scrapedCount: this.scrapedProperties.length,
      lastUpdate: this.scrapedProperties.length > 0 ? 
        new Date(Math.max(...this.scrapedProperties.map(p => p.scrapedAt.getTime()))) : 
        null
    }
  }

  // Get scraped properties
  getScrapedProperties(): ScrapedProperty[] {
    return [...this.scrapedProperties]
  }
}

// Default configuration
export const defaultConfig: DataGatheringConfig = {
  sources: [
    {
      name: 'Suumo',
      baseUrl: 'https://suumo.jp',
      selectors: {
        propertyList: '.property-list',
        propertyCard: '.property-card',
        title: '.property-title',
        price: '.property-price',
        location: '.property-location',
        image: '.property-image img',
        bedrooms: '.property-bedrooms',
        bathrooms: '.property-bathrooms',
        area: '.property-area'
      },
      pagination: {
        nextPage: 'https://suumo.jp/chintai/tokyo/?page={page}',
        maxPages: 50
      },
      rateLimit: {
        requestsPerMinute: 30,
        delayBetweenRequests: 2000
      }
    },
    {
      name: 'Homes',
      baseUrl: 'https://www.homes.co.jp',
      selectors: {
        propertyList: '.property-list',
        propertyCard: '.property-card',
        title: '.property-title',
        price: '.property-price',
        location: '.property-location',
        image: '.property-image img'
      },
      pagination: {
        nextPage: 'https://www.homes.co.jp/chintai/tokyo/?page={page}',
        maxPages: 30
      },
      rateLimit: {
        requestsPerMinute: 20,
        delayBetweenRequests: 3000
      }
    }
  ],
  updateInterval: 60, // 1 hour
  maxPropertiesPerSource: 1000,
  enableDeduplication: true,
  enableImageProcessing: true,
  enableLocationEnrichment: true
}

export default PropertyDataGatherer