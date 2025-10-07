// API Configuration
export const API_CONFIG = {
  DEEPSEEK_API_KEY: 'sk-4c69b785568145419d360a84e3055b40',
  DEEPSEEK_BASE_URL: 'https://api.deepseek.com/v1',
  DEEPSEEK_MODEL: 'deepseek-chat',
  
  // Other API configurations
  PROPERTY_API_BASE_URL: process.env.NEXT_PUBLIC_PROPERTY_API_URL || '/api/properties',
  CONTACT_API_URL: process.env.NEXT_PUBLIC_CONTACT_API_URL || '/api/contact',
  UPLOAD_API_URL: process.env.NEXT_PUBLIC_UPLOAD_API_URL || '/api/upload',
  
  // Rate limiting
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 1000
  }
}

export default API_CONFIG