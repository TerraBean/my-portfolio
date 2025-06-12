import { NextResponse } from 'next/server';
import { NewsScrapingService } from '@/lib/services/newsScrapingService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized',
          connected: false,
          timestamp: new Date().toISOString()
        },
        { status: 401 }
      );
    }

    const results = {
      connected: false,
      service: 'Google Gemini AI',
      timestamp: new Date().toISOString(),
      error: null as string | null,
      details: {
        exaApiKey: !!process.env.EXA_API_KEY,
        googleAiApiKey: !!process.env.GOOGLE_AI_API_KEY,
        serviceInitialization: false,
        connectionTest: false
      }
    };

    // Check for required environment variables
    if (!process.env.EXA_API_KEY) {
      results.error = 'EXA_API_KEY environment variable is missing';
      return NextResponse.json({
        success: false,
        ...results
      }, { status: 500 });
    }

    if (!process.env.GOOGLE_AI_API_KEY) {
      results.error = 'GOOGLE_AI_API_KEY environment variable is missing';
      return NextResponse.json({
        success: false,
        ...results
      }, { status: 500 });
    }

    // Test service initialization
    let scrapingService: NewsScrapingService;
    try {
      scrapingService = new NewsScrapingService();
      results.details.serviceInitialization = true;
    } catch (error) {
      results.error = error instanceof Error ? error.message : 'Service initialization failed';
      return NextResponse.json({
        success: false,
        ...results
      }, { status: 500 });
    }

    // Test AI connection
    try {
      const connected = await scrapingService.testGeminiConnection();
      results.details.connectionTest = true;
      results.connected = connected;
      
      if (!connected) {
        results.error = 'AI service connection test failed';
      }

      return NextResponse.json({
        success: connected,
        ...results,
        message: connected ? 'AI service connection successful' : 'AI service connection failed'
      });

    } catch (error) {
      results.error = error instanceof Error ? error.message : 'Connection test failed';
      return NextResponse.json({
        success: false,
        ...results
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Connection test error:', error);
    
    return NextResponse.json({
      success: false,
      connected: false,
      service: 'Google Gemini AI',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: {
        exaApiKey: !!process.env.EXA_API_KEY,
        googleAiApiKey: !!process.env.GOOGLE_AI_API_KEY,
        serviceInitialization: false,
        connectionTest: false
      }
    }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json(
    { 
      error: 'Method not allowed. Use GET to test connection.' 
    },
    { status: 405 }
  );
}
