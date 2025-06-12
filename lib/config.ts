// Configuration for news scraping and AI services
export const config = {
  // API Keys
  exa: {
    apiKey: process.env.EXA_API_KEY,
    baseUrl: 'https://api.exa.ai'
  },
    googleAI: {
    apiKey: process.env.GOOGLE_AI_API_KEY,
    model: 'gemini-1.5-flash'
  },
  
  // Feature Flags
  features: {
    newsScrapingEnabled: process.env.NEWS_SCRAPING_ENABLED === 'true'
  },
  
  // Admin Configuration
  admin: {
    userId: process.env.ADMIN_USER_ID
  },
  
  // Database
  database: {
    url: process.env.DATABASE_URL
  },
  
  // NextAuth
  auth: {
    url: process.env.NEXTAUTH_URL,
    secret: process.env.NEXTAUTH_SECRET
  }
}

// Validation function to check if all required environment variables are set
export function validateConfig() {
  const errors: string[] = []
  
  if (!config.exa.apiKey) {
    errors.push('EXA_API_KEY is required')
  }
  
  if (!config.googleAI.apiKey) {
    errors.push('GOOGLE_AI_API_KEY is required')
  }
  
  if (!config.database.url) {
    errors.push('DATABASE_URL is required')
  }
  
  if (!config.auth.url) {
    errors.push('NEXTAUTH_URL is required')
  }
  
  if (!config.auth.secret) {
    errors.push('NEXTAUTH_SECRET is required')
  }
  
  if (!config.admin.userId) {
    errors.push('ADMIN_USER_ID is required for automated posts')
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`)
  }
  
  return true
}

// Test API key validity with timeout
export async function validateAPIKeys() {
  const results = {
    exa: false,
    googleAI: false
  }
  
  // Helper function to add timeout to promises
  const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), timeoutMs)
      )
    ])
  }
  
  // Test Exa API with timeout
  try {
    const exaPromise = fetch(`${config.exa.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.exa.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: 'test',
        numResults: 1
      })
    })
    
    const exaResponse = await withTimeout(exaPromise, 10000) // 10 second timeout
    results.exa = exaResponse.status !== 401 && exaResponse.status !== 403
  } catch (error) {
    console.warn('Exa API validation failed:', error)
    results.exa = false
  }
  
  // Test Google AI API with timeout
  try {
    const googleAIPromise = (async () => {
      const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const genAI = new GoogleGenerativeAI(config.googleAI.apiKey!)
      const model = genAI.getGenerativeModel({ model: config.googleAI.model })
      
      // Simple test prompt
      await model.generateContent('Hi')
      return true
    })()
    
    await withTimeout(googleAIPromise, 15000) // 15 second timeout
    results.googleAI = true
  } catch (error) {
    console.warn('Google AI API validation failed:', error)
    results.googleAI = false
  }
  
  return results
}

// Check if admin user exists in database
export async function validateAdminUser() {
  if (!config.admin.userId) {
    return false
  }
  
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(config.database.url!)
    
    const users = await sql`
      SELECT id FROM users WHERE id = ${parseInt(config.admin.userId)}
    `
    
    return users.length > 0
  } catch (error) {
    console.warn('Admin user validation failed:', error)
    return false
  }
}

export default config
