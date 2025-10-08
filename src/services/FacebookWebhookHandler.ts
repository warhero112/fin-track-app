// Facebook Webhook Handler
// Handles real-time updates from Facebook

export interface WebhookEvent {
  object: string
  entry: Array<{
    id: string
    time: number
    changes: Array<{
      field: string
      value: any
    }>
  }>
}

export interface WebhookConfig {
  verifyToken: string
  secret: string
  pageId: string
  onPostCreated?: (post: any) => void
  onPostUpdated?: (post: any) => void
  onPostDeleted?: (postId: string) => void
  onCommentAdded?: (comment: any) => void
  onMessageReceived?: (message: any) => void
}

class FacebookWebhookHandler {
  private config: WebhookConfig

  constructor(config: WebhookConfig) {
    this.config = config
  }

  // Verify webhook subscription
  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === 'subscribe' && token === this.config.verifyToken) {
      console.log('Webhook verified successfully')
      return challenge
    }
    return null
  }

  // Process webhook events
  async processWebhookEvent(event: WebhookEvent): Promise<void> {
    try {
      console.log('Processing Facebook webhook event:', event)

      for (const entry of event.entry) {
        for (const change of entry.changes) {
          await this.handleChange(change, entry.id)
        }
      }
    } catch (error) {
      console.error('Error processing webhook event:', error)
    }
  }

  // Handle individual change
  private async handleChange(change: any, pageId: string): Promise<void> {
    const { field, value } = change

    switch (field) {
      case 'feed':
        await this.handleFeedChange(value, pageId)
        break
      case 'comments':
        await this.handleCommentChange(value, pageId)
        break
      case 'messages':
        await this.handleMessageChange(value, pageId)
        break
      case 'messaging_postbacks':
        await this.handlePostbackChange(value, pageId)
        break
      default:
        console.log(`Unhandled webhook field: ${field}`)
    }
  }

  // Handle feed changes (posts)
  private async handleFeedChange(value: any, pageId: string): Promise<void> {
    const { item, verb } = value

    switch (verb) {
      case 'add':
        console.log('New post created:', item)
        if (this.config.onPostCreated) {
          await this.config.onPostCreated(item)
        }
        break
      case 'edit':
        console.log('Post updated:', item)
        if (this.config.onPostUpdated) {
          await this.config.onPostUpdated(item)
        }
        break
      case 'remove':
        console.log('Post deleted:', item)
        if (this.config.onPostDeleted) {
          await this.config.onPostDeleted(item)
        }
        break
    }
  }

  // Handle comment changes
  private async handleCommentChange(value: any, pageId: string): Promise<void> {
    const { item, verb } = value

    if (verb === 'add') {
      console.log('New comment added:', item)
      if (this.config.onCommentAdded) {
        await this.config.onCommentAdded(item)
      }
    }
  }

  // Handle message changes
  private async handleMessageChange(value: any, pageId: string): Promise<void> {
    console.log('Message received:', value)
    if (this.config.onMessageReceived) {
      await this.config.onMessageReceived(value)
    }
  }

  // Handle postback changes
  private async handlePostbackChange(value: any, pageId: string): Promise<void> {
    console.log('Postback received:', value)
    // Handle postback events (e.g., button clicks)
  }

  // Send message via Messenger
  async sendMessage(recipientId: string, message: any): Promise<boolean> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/me/messages?access_token=${this.config.pageId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            recipient: { id: recipientId },
            message: message
          })
        }
      )

      return response.ok
    } catch (error) {
      console.error('Error sending message:', error)
      return false
    }
  }

  // Send text message
  async sendTextMessage(recipientId: string, text: string): Promise<boolean> {
    return this.sendMessage(recipientId, { text })
  }

  // Send property card message
  async sendPropertyCard(recipientId: string, property: any): Promise<boolean> {
    const message = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: property.title,
              subtitle: `${property.location} • ¥${property.price?.toLocaleString()}`,
              image_url: property.images?.[0] || '',
              buttons: [
                {
                  type: 'web_url',
                  url: property.url || '',
                  title: 'View Details'
                },
                {
                  type: 'postback',
                  title: 'Contact Agent',
                  payload: `CONTACT_${property.id}`
                }
              ]
            }
          ]
        }
      }
    }

    return this.sendMessage(recipientId, message)
  }

  // Send quick reply
  async sendQuickReply(recipientId: string, text: string, replies: Array<{ title: string; payload: string }>): Promise<boolean> {
    const message = {
      text: text,
      quick_replies: replies.map(reply => ({
        content_type: 'text',
        title: reply.title,
        payload: reply.payload
      }))
    }

    return this.sendMessage(recipientId, message)
  }

  // Send typing indicator
  async sendTypingIndicator(recipientId: string): Promise<boolean> {
    const message = {
      sender_action: 'typing_on'
    }

    return this.sendMessage(recipientId, message)
  }

  // Send read receipt
  async sendReadReceipt(recipientId: string): Promise<boolean> {
    const message = {
      sender_action: 'mark_seen'
    }

    return this.sendMessage(recipientId, message)
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<any> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${userId}?fields=first_name,last_name,profile_pic&access_token=${this.config.pageId}`
      )

      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }

  // Set up persistent menu
  async setupPersistentMenu(): Promise<boolean> {
    try {
      const menu = {
        persistent_menu: [
          {
            locale: 'default',
            composer_input_disabled: false,
            call_to_actions: [
              {
                type: 'postback',
                title: '🏠 Browse Properties',
                payload: 'BROWSE_PROPERTIES'
              },
              {
                type: 'postback',
                title: '💖 Saved Properties',
                payload: 'SAVED_PROPERTIES'
              },
              {
                type: 'postback',
                title: '📞 Contact Us',
                payload: 'CONTACT_US'
              },
              {
                type: 'web_url',
                title: '🌐 Visit Website',
                url: 'https://rentora.jp'
              }
            ]
          }
        ]
      }

      const response = await fetch(
        `https://graph.facebook.com/v18.0/me/messenger_profile?access_token=${this.config.pageId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(menu)
        }
      )

      return response.ok
    } catch (error) {
      console.error('Error setting up persistent menu:', error)
      return false
    }
  }

  // Set up get started button
  async setupGetStartedButton(): Promise<boolean> {
    try {
      const getStarted = {
        get_started: {
          payload: 'GET_STARTED'
        }
      }

      const response = await fetch(
        `https://graph.facebook.com/v18.0/me/messenger_profile?access_token=${this.config.pageId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(getStarted)
        }
      )

      return response.ok
    } catch (error) {
      console.error('Error setting up get started button:', error)
      return false
    }
  }

  // Handle incoming message
  async handleIncomingMessage(message: any): Promise<void> {
    const { sender, message: msg } = message

    if (!msg || !sender) return

    // Send typing indicator
    await this.sendTypingIndicator(sender.id)

    // Handle different message types
    if (msg.text) {
      await this.handleTextMessage(sender.id, msg.text)
    } else if (msg.attachments) {
      await this.handleAttachmentMessage(sender.id, msg.attachments)
    } else if (msg.postback) {
      await this.handlePostbackMessage(sender.id, msg.postback)
    }
  }

  // Handle text message
  private async handleTextMessage(userId: string, text: string): Promise<void> {
    const lowerText = text.toLowerCase()

    if (lowerText.includes('hello') || lowerText.includes('hi')) {
      await this.sendTextMessage(userId, 'Hello! Welcome to Rentora. How can I help you find your perfect home in Japan?')
      await this.sendQuickReply(userId, 'What would you like to do?', [
        { title: '🏠 Browse Properties', payload: 'BROWSE_PROPERTIES' },
        { title: '💖 Saved Properties', payload: 'SAVED_PROPERTIES' },
        { title: '📞 Contact Agent', payload: 'CONTACT_AGENT' }
      ])
    } else if (lowerText.includes('property') || lowerText.includes('apartment') || lowerText.includes('house')) {
      await this.sendTextMessage(userId, 'I can help you find properties! Let me show you some options.')
      // In real implementation, fetch and send property cards
    } else if (lowerText.includes('price') || lowerText.includes('cost')) {
      await this.sendTextMessage(userId, 'Property prices vary by location and type. What\'s your budget range?')
    } else {
      await this.sendTextMessage(userId, 'I\'m here to help you find properties in Japan. You can ask me about apartments, houses, prices, or locations!')
    }
  }

  // Handle attachment message
  private async handleAttachmentMessage(userId: string, attachments: any[]): Promise<void> {
    await this.sendTextMessage(userId, 'Thanks for sharing! I can help you find similar properties. What are you looking for?')
  }

  // Handle postback message
  private async handlePostbackMessage(userId: string, postback: any): Promise<void> {
    const { payload } = postback

    switch (payload) {
      case 'GET_STARTED':
        await this.sendTextMessage(userId, 'Welcome to Rentora! I\'m here to help you find your perfect home in Japan.')
        await this.sendQuickReply(userId, 'What would you like to do?', [
          { title: '🏠 Browse Properties', payload: 'BROWSE_PROPERTIES' },
          { title: '💖 Saved Properties', payload: 'SAVED_PROPERTIES' },
          { title: '📞 Contact Agent', payload: 'CONTACT_AGENT' }
        ])
        break
      case 'BROWSE_PROPERTIES':
        await this.sendTextMessage(userId, 'Let me show you some available properties!')
        // In real implementation, fetch and send property cards
        break
      case 'SAVED_PROPERTIES':
        await this.sendTextMessage(userId, 'Here are your saved properties!')
        // In real implementation, fetch user's saved properties
        break
      case 'CONTACT_AGENT':
        await this.sendTextMessage(userId, 'I\'ll connect you with one of our agents. What\'s your preferred contact method?')
        break
      default:
        if (payload.startsWith('CONTACT_')) {
          const propertyId = payload.replace('CONTACT_', '')
          await this.sendTextMessage(userId, `I\'ll help you contact the agent for property ${propertyId}. What\'s your phone number?`)
        }
    }
  }
}

export default FacebookWebhookHandler