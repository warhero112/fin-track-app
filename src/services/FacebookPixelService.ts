// Facebook Pixel Integration Service
// Handles Facebook pixel tracking and conversion events

export interface PixelEvent {
  eventName: string
  eventId?: string
  customData?: Record<string, any>
  value?: number
  currency?: string
  userData?: {
    em?: string // email
    ph?: string // phone
    fn?: string // first name
    ln?: string // last name
    ct?: string // city
    st?: string // state
    zp?: string // zip code
    country?: string
  }
}

export interface PixelConfig {
  pixelId: string
  accessToken: string
  testEventCode?: string
  debugMode?: boolean
}

class FacebookPixelService {
  private config: PixelConfig
  private isInitialized: boolean = false

  constructor(config: PixelConfig) {
    this.config = config
  }

  // Initialize Facebook Pixel
  initialize(): void {
    if (this.isInitialized) return

    // Load Facebook Pixel script
    this.loadPixelScript()
    
    // Initialize pixel
    this.initPixel()
    
    this.isInitialized = true
    console.log('Facebook Pixel initialized')
  }

  // Load Facebook Pixel script
  private loadPixelScript(): void {
    if (typeof window === 'undefined') return

    // Check if script already exists
    if (document.getElementById('facebook-pixel-script')) return

    const script = document.createElement('script')
    script.id = 'facebook-pixel-script'
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
    `
    document.head.appendChild(script)
  }

  // Initialize pixel
  private initPixel(): void {
    if (typeof window === 'undefined') return

    // @ts-ignore
    window.fbq('init', this.config.pixelId)
    
    if (this.config.testEventCode) {
      // @ts-ignore
      window.fbq('init', this.config.pixelId, {}, { testEventCode: this.config.testEventCode })
    }

    if (this.config.debugMode) {
      // @ts-ignore
      window.fbq('init', this.config.pixelId, {}, { debug: true })
    }
  }

  // Track page view
  trackPageView(): void {
    if (typeof window === 'undefined') return

    // @ts-ignore
    window.fbq('track', 'PageView')
    console.log('Facebook Pixel: PageView tracked')
  }

  // Track custom event
  trackEvent(event: PixelEvent): void {
    if (typeof window === 'undefined') return

    const eventData: any = {
      event_name: event.eventName
    }

    if (event.eventId) {
      eventData.event_id = event.eventId
    }

    if (event.customData) {
      eventData.custom_data = event.customData
    }

    if (event.value) {
      eventData.value = event.value
    }

    if (event.currency) {
      eventData.currency = event.currency
    }

    if (event.userData) {
      eventData.user_data = event.userData
    }

    // @ts-ignore
    window.fbq('track', event.eventName, eventData)
    console.log(`Facebook Pixel: ${event.eventName} tracked`, eventData)
  }

  // Track property view
  trackPropertyView(property: any): void {
    this.trackEvent({
      eventName: 'ViewContent',
      customData: {
        content_type: 'property',
        content_ids: [property.id],
        content_name: property.title,
        content_category: property.propertyType,
        value: property.price,
        currency: 'JPY'
      },
      value: property.price,
      currency: 'JPY'
    })
  }

  // Track property search
  trackPropertySearch(searchTerm: string, resultsCount: number): void {
    this.trackEvent({
      eventName: 'Search',
      customData: {
        search_string: searchTerm,
        content_category: 'property'
      }
    })
  }

  // Track property save
  trackPropertySave(property: any): void {
    this.trackEvent({
      eventName: 'AddToWishlist',
      customData: {
        content_type: 'property',
        content_ids: [property.id],
        content_name: property.title,
        content_category: property.propertyType,
        value: property.price,
        currency: 'JPY'
      },
      value: property.price,
      currency: 'JPY'
    })
  }

  // Track property contact
  trackPropertyContact(property: any, contactMethod: string): void {
    this.trackEvent({
      eventName: 'Contact',
      customData: {
        content_type: 'property',
        content_ids: [property.id],
        content_name: property.title,
        contact_method: contactMethod
      }
    })
  }

  // Track lead generation
  trackLeadGeneration(leadData: any): void {
    this.trackEvent({
      eventName: 'Lead',
      customData: {
        content_name: 'Property Inquiry',
        content_category: 'real_estate'
      },
      userData: {
        em: leadData.email,
        ph: leadData.phone,
        fn: leadData.firstName,
        ln: leadData.lastName
      }
    })
  }

  // Track form submission
  trackFormSubmission(formName: string, formData: any): void {
    this.trackEvent({
      eventName: 'CompleteRegistration',
      customData: {
        content_name: formName,
        content_category: 'form'
      },
      userData: {
        em: formData.email,
        ph: formData.phone,
        fn: formData.firstName,
        ln: formData.lastName
      }
    })
  }

  // Track purchase
  trackPurchase(transactionId: string, value: number, currency: string = 'JPY', items: any[] = []): void {
    this.trackEvent({
      eventName: 'Purchase',
      customData: {
        content_type: 'product',
        content_ids: items.map(item => item.id),
        content_name: items.map(item => item.name).join(', '),
        content_category: 'real_estate',
        num_items: items.length
      },
      value: value,
      currency: currency
    })
  }

  // Track add to cart (for property comparison)
  trackAddToCart(property: any): void {
    this.trackEvent({
      eventName: 'AddToCart',
      customData: {
        content_type: 'property',
        content_ids: [property.id],
        content_name: property.title,
        content_category: property.propertyType,
        value: property.price,
        currency: 'JPY'
      },
      value: property.price,
      currency: 'JPY'
    })
  }

  // Track remove from cart
  trackRemoveFromCart(property: any): void {
    this.trackEvent({
      eventName: 'RemoveFromCart',
      customData: {
        content_type: 'property',
        content_ids: [property.id],
        content_name: property.title,
        content_category: property.propertyType,
        value: property.price,
        currency: 'JPY'
      },
      value: property.price,
      currency: 'JPY'
    })
  }

  // Track property comparison
  trackPropertyComparison(properties: any[]): void {
    this.trackEvent({
      eventName: 'InitiateCheckout',
      customData: {
        content_type: 'property',
        content_ids: properties.map(p => p.id),
        content_name: 'Property Comparison',
        content_category: 'real_estate',
        num_items: properties.length,
        value: properties.reduce((sum, p) => sum + p.price, 0),
        currency: 'JPY'
      },
      value: properties.reduce((sum, p) => sum + p.price, 0),
      currency: 'JPY'
    })
  }

  // Track video play
  trackVideoPlay(videoTitle: string): void {
    this.trackEvent({
      eventName: 'VideoPlay',
      customData: {
        content_name: videoTitle,
        content_category: 'video'
      }
    })
  }

  // Track video complete
  trackVideoComplete(videoTitle: string): void {
    this.trackEvent({
      eventName: 'VideoComplete',
      customData: {
        content_name: videoTitle,
        content_category: 'video'
      }
    })
  }

  // Track custom conversion
  trackCustomConversion(conversionName: string, value?: number, currency?: string): void {
    this.trackEvent({
      eventName: conversionName,
      value: value,
      currency: currency || 'JPY'
    })
  }

  // Send server-side event
  async sendServerEvent(event: PixelEvent): Promise<boolean> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.config.pixelId}/events`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: [{
              event_name: event.eventName,
              event_time: Math.floor(Date.now() / 1000),
              event_id: event.eventId || this.generateEventId(),
              custom_data: event.customData || {},
              value: event.value,
              currency: event.currency || 'JPY',
              user_data: event.userData || {}
            }],
            access_token: this.config.accessToken
          })
        }
      )

      return response.ok
    } catch (error) {
      console.error('Error sending server event:', error)
      return false
    }
  }

  // Generate unique event ID
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Get pixel status
  isPixelInitialized(): boolean {
    return this.isInitialized
  }

  // Get pixel configuration
  getConfig(): PixelConfig {
    return { ...this.config }
  }

  // Enable debug mode
  enableDebugMode(): void {
    this.config.debugMode = true
    if (this.isInitialized) {
      this.initPixel()
    }
  }

  // Disable debug mode
  disableDebugMode(): void {
    this.config.debugMode = false
    if (this.isInitialized) {
      this.initPixel()
    }
  }
}

// Default configuration
export const defaultPixelConfig: PixelConfig = {
  pixelId: '',
  accessToken: '',
  debugMode: false
}

export default FacebookPixelService