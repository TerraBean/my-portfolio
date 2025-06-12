import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      EXA_API_KEY: !!process.env.EXA_API_KEY,
      GOOGLE_AI_API_KEY: !!process.env.GOOGLE_AI_API_KEY,
      NEWS_SCRAPING_ENABLED: process.env.NEWS_SCRAPING_ENABLED,
      ADMIN_USER_ID: !!process.env.ADMIN_USER_ID,
      DATABASE_URL: !!process.env.DATABASE_URL,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET
    }
  })
}
