// Facebook Integration Service
// Handles automated posting and importing between website and Facebook

export interface FacebookConfig {
  pageId: string
  accessToken: string
  appId: string
  appSecret: string
  webhookVerifyToken: string
  marketplaceEnabled: boolean
  messengerEnabled: boolean
  pixelId?: string
}

export interface FacebookPost {
  id: string
  message: string
  link: string
  picture?: string
  name: string
  description: string
  caption?: string
  createdTime: Date
  updatedTime: Date
  likes: number
  comments: number
  shares: number
  reach: number
  impressions: number
}

export interface FacebookProperty {
  id: string
  title: string
  description: string
  price: number
  currency: string
  location: string
  images: string[]
  bedrooms?: number
  bathrooms?: number
  area?: number
  propertyType: string
  availability: 'available' | 'pending' | 'sold'
  contactInfo: {
    phone: string
    email: string
    website: string
  }
  facebookPostId?: string
  lastSynced: Date
}

export interface FacebookAnalytics {
  pageLikes: number
  postReach: number
  postEngagement: number
  clickThroughRate: number
  leadGeneration: number
  conversionRate: number
  topPosts: FacebookPost[]
  demographics: {
    age: Record<string, number>
    gender: Record<string, number>
    location: Record<string, number>
  }
}

class FacebookIntegrationService {
  private config: FacebookConfig
  private baseUrl = 'https://graph.facebook.com/v18.0'
  private isConnected: boolean = false

  constructor(config: FacebookConfig) {
    this.config = config
  }

  // Initialize Facebook connection
  async initialize(): Promise<boolean> {
    try {
      console.log('Initializing Facebook integration...')
      
      // Verify access token
      const isValid = await this.verifyAccessToken()
      if (!isValid) {
        throw new Error('Invalid Facebook access token')
      }

      // Test page access
      const pageInfo = await this.getPageInfo()
      if (!pageInfo) {
        throw new Error('Cannot access Facebook page')
      }

      this.isConnected = true
      console.log('Facebook integration initialized successfully')
      return true
    } catch (error) {
      console.error('Error initializing Facebook integration:', error)
      this.isConnected = false
      return false
    }
  }

  // Verify Facebook access token
  private async verifyAccessToken(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me?access_token=${this.config.accessToken}`
      )
      return response.ok
    } catch (error) {
      console.error('Error verifying access token:', error)
      return false
    }
  }

  // Get Facebook page information
  async getPageInfo(): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.config.pageId}?fields=name,id,category,fan_count,access_token&access_token=${this.config.accessToken}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch page info')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching page info:', error)
      return null
    }
  }

  // Post property to Facebook
  async postProperty(property: FacebookProperty): Promise<FacebookPost | null> {
    try {
      console.log(`Posting property to Facebook: ${property.title}`)

      const postData = {
        message: this.createPropertyMessage(property),
        link: property.contactInfo.website,
        picture: property.images[0] || '',
        name: property.title,
        description: property.description,
        caption: `¥${property.price.toLocaleString()} • ${property.location}`,
        access_token: this.config.accessToken
      }

      const response = await fetch(
        `${this.baseUrl}/${this.config.pageId}/feed`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Facebook API error: ${error.error?.message || 'Unknown error'}`)
      }

      const result = await response.json()
      console.log('Property posted to Facebook successfully:', result.id)

      return {
        id: result.id,
        message: postData.message,
        link: postData.link,
        picture: postData.picture,
        name: postData.name,
        description: postData.description,
        caption: postData.caption,
        createdTime: new Date(),
        updatedTime: new Date(),
        likes: 0,
        comments: 0,
        shares: 0,
        reach: 0,
        impressions: 0
      }
    } catch (error) {
      console.error('Error posting property to Facebook:', error)
      return null
    }
  }

  // Create property message for Facebook
  private createPropertyMessage(property: FacebookProperty): string {
    const emojis = {
      apartment: '🏠',
      house: '🏘️',
      studio: '🏡',
      available: '✅',
      pending: '⏳',
      sold: '❌'
    }

    const propertyEmoji = emojis[property.propertyType as keyof typeof emojis] || '🏠'
    const statusEmoji = emojis[property.availability] || '✅'

    let message = `${propertyEmoji} ${property.title}\n\n`
    message += `${statusEmoji} ${property.availability.toUpperCase()}\n`
    message += `💰 ¥${property.price.toLocaleString()}\n`
    message += `📍 ${property.location}\n\n`

    if (property.bedrooms) message += `🛏️ ${property.bedrooms} bedrooms\n`
    if (property.bathrooms) message += `🚿 ${property.bathrooms} bathrooms\n`
    if (property.area) message += `📐 ${property.area}m²\n\n`

    message += `📞 Contact: ${property.contactInfo.phone}\n`
    message += `📧 Email: ${property.contactInfo.email}\n\n`
    message += `#RealEstate #Japan #Tokyo #Property #Rent #Buy`

    return message
  }

  // Import properties from Facebook
  async importPropertiesFromFacebook(): Promise<FacebookProperty[]> {
    try {
      console.log('Importing properties from Facebook...')

      // Get posts from Facebook page
      const posts = await this.getPagePosts()
      const properties: FacebookProperty[] = []

      for (const post of posts) {
        const property = this.parsePostAsProperty(post)
        if (property) {
          properties.push(property)
        }
      }

      console.log(`Imported ${properties.length} properties from Facebook`)
      return properties
    } catch (error) {
      console.error('Error importing properties from Facebook:', error)
      return []
    }
  }

  // Get posts from Facebook page
  private async getPagePosts(): Promise<FacebookPost[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.config.pageId}/posts?fields=id,message,link,picture,name,description,caption,created_time,updated_time,likes.summary(true),comments.summary(true),shares&limit=50&access_token=${this.config.accessToken}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch Facebook posts')
      }

      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error('Error fetching Facebook posts:', error)
      return []
    }
  }

  // Parse Facebook post as property
  private parsePostAsProperty(post: FacebookPost): FacebookProperty | null {
    try {
      // Check if post contains property-related keywords
      const propertyKeywords = ['apartment', 'house', 'property', 'rent', 'sale', 'bedroom', 'bathroom', '¥', 'yen']
      const content = `${post.message} ${post.name} ${post.description}`.toLowerCase()

      if (!propertyKeywords.some(keyword => content.includes(keyword))) {
        return null
      }

      // Extract price from content
      const priceMatch = content.match(/¥([\d,]+)/)
      const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0

      // Extract location
      const locationMatch = content.match(/📍\s*([^\n]+)/)
      const location = locationMatch ? locationMatch[1].trim() : 'Tokyo, Japan'

      // Extract contact info
      const phoneMatch = content.match(/📞\s*([^\n]+)/)
      const emailMatch = content.match(/📧\s*([^\n]+)/)

      return {
        id: `fb-${post.id}`,
        title: post.name || 'Property from Facebook',
        description: post.message || post.description || '',
        price,
        currency: 'JPY',
        location,
        images: post.picture ? [post.picture] : [],
        bedrooms: this.extractNumber(content, 'bedroom'),
        bathrooms: this.extractNumber(content, 'bathroom'),
        area: this.extractNumber(content, 'm²'),
        propertyType: this.detectPropertyType(content),
        availability: this.detectAvailability(content),
        contactInfo: {
          phone: phoneMatch ? phoneMatch[1].trim() : '',
          email: emailMatch ? emailMatch[1].trim() : '',
          website: post.link || ''
        },
        facebookPostId: post.id,
        lastSynced: new Date()
      }
    } catch (error) {
      console.error('Error parsing Facebook post as property:', error)
      return null
    }
  }

  // Extract number from text
  private extractNumber(text: string, keyword: string): number | undefined {
    const regex = new RegExp(`(\\d+)\\s*${keyword}`, 'i')
    const match = text.match(regex)
    return match ? parseInt(match[1]) : undefined
  }

  // Detect property type from content
  private detectPropertyType(content: string): string {
    if (content.includes('apartment')) return 'apartment'
    if (content.includes('house')) return 'house'
    if (content.includes('studio')) return 'studio'
    return 'apartment'
  }

  // Detect availability from content
  private detectAvailability(content: string): 'available' | 'pending' | 'sold' {
    if (content.includes('sold') || content.includes('❌')) return 'sold'
    if (content.includes('pending') || content.includes('⏳')) return 'pending'
    return 'available'
  }

  // Get Facebook analytics
  async getAnalytics(): Promise<FacebookAnalytics | null> {
    try {
      console.log('Fetching Facebook analytics...')

      const [pageInsights, postInsights] = await Promise.all([
        this.getPageInsights(),
        this.getPostInsights()
      ])

      return {
        pageLikes: pageInsights.fan_count || 0,
        postReach: postInsights.reach || 0,
        postEngagement: postInsights.engagement || 0,
        clickThroughRate: postInsights.ctr || 0,
        leadGeneration: postInsights.leads || 0,
        conversionRate: postInsights.conversion_rate || 0,
        topPosts: postInsights.top_posts || [],
        demographics: {
          age: postInsights.age_demographics || {},
          gender: postInsights.gender_demographics || {},
          location: postInsights.location_demographics || {}
        }
      }
    } catch (error) {
      console.error('Error fetching Facebook analytics:', error)
      return null
    }
  }

  // Get page insights
  private async getPageInsights(): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.config.pageId}?fields=fan_count&access_token=${this.config.accessToken}`
      )
      return response.ok ? await response.json() : {}
    } catch (error) {
      console.error('Error fetching page insights:', error)
      return {}
    }
  }

  // Get post insights
  private async getPostInsights(): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.config.pageId}/insights?metric=page_impressions,page_reach,page_engaged_users&access_token=${this.config.accessToken}`
      )
      return response.ok ? await response.json() : {}
    } catch (error) {
      console.error('Error fetching post insights:', error)
      return {}
    }
  }

  // Schedule property post
  async schedulePropertyPost(property: FacebookProperty, scheduledTime: Date): Promise<boolean> {
    try {
      console.log(`Scheduling property post for ${scheduledTime}`)

      const postData = {
        message: this.createPropertyMessage(property),
        link: property.contactInfo.website,
        picture: property.images[0] || '',
        name: property.title,
        description: property.description,
        scheduled_publish_time: Math.floor(scheduledTime.getTime() / 1000),
        published: false,
        access_token: this.config.accessToken
      }

      const response = await fetch(
        `${this.baseUrl}/${this.config.pageId}/feed`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        }
      )

      return response.ok
    } catch (error) {
      console.error('Error scheduling property post:', error)
      return false
    }
  }

  // Delete property post from Facebook
  async deletePropertyPost(postId: string): Promise<boolean> {
    try {
      console.log(`Deleting Facebook post: ${postId}`)

      const response = await fetch(
        `${this.baseUrl}/${postId}?access_token=${this.config.accessToken}`,
        {
          method: 'DELETE'
        }
      )

      return response.ok
    } catch (error) {
      console.error('Error deleting Facebook post:', error)
      return false
    }
  }

  // Update property post on Facebook
  async updatePropertyPost(postId: string, property: FacebookProperty): Promise<boolean> {
    try {
      console.log(`Updating Facebook post: ${postId}`)

      const postData = {
        message: this.createPropertyMessage(property),
        access_token: this.config.accessToken
      }

      const response = await fetch(
        `${this.baseUrl}/${postId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        }
      )

      return response.ok
    } catch (error) {
      console.error('Error updating Facebook post:', error)
      return false
    }
  }

  // Get connection status
  isFacebookConnected(): boolean {
    return this.isConnected
  }

  // Get configuration
  getConfig(): FacebookConfig {
    return { ...this.config }
  }
}

// Default configuration
export const defaultFacebookConfig: FacebookConfig = {
  pageId: '',
  accessToken: '',
  appId: '',
  appSecret: '',
  webhookVerifyToken: 'rentora_webhook_verify_token',
  marketplaceEnabled: true,
  messengerEnabled: true,
  pixelId: ''
}

export default FacebookIntegrationService