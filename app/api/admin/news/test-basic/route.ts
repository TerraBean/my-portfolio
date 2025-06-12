import { NextResponse } from 'next/server'
import { validateConfig, validateAdminUser } from '@/lib/config'

export async function GET() {
  try {
    const results = {
      configValid: false,
      adminUser: false,
      timestamp: new Date().toISOString()
    }
    
    // Validate basic configuration
    try {
      validateConfig()
      results.configValid = true
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Configuration validation failed',
        results
      }, { status: 400 })
    }
    
    // Validate admin user
    try {
      results.adminUser = await validateAdminUser()
    } catch (error) {
      console.warn('Admin user validation failed:', error)
      results.adminUser = false
    }
    
    return NextResponse.json({
      success: true,
      message: 'Basic configuration checks completed',
      results
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
