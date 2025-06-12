import { NextRequest, NextResponse } from 'next/server';
import { NewsScrapingService } from '@/lib/services/newsScrapingService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { limit = 10, autoEnhance = false } = body;

    // Validate limit
    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 50' },
        { status: 400 }
      );
    }

    console.log(`Scraping request: limit=${limit}, autoEnhance=${autoEnhance}`);

    // Initialize service
    const scrapingService = new NewsScrapingService();

    // Test connection first
    const connected = await scrapingService.testGeminiConnection();
    if (!connected) {
      return NextResponse.json(
        { error: 'AI service connection failed' },
        { status: 503 }
      );
    }

    // Scrape news
    const news = await scrapingService.scrapeGhanaNews(limit);
    
    if (news.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        message: 'No news articles found'
      });
    }

    // Auto-enhance if requested
    if (autoEnhance) {
      console.log(`Auto-enhancing ${news.length} articles...`);
      
      const enhanced = await Promise.allSettled(
        news.map(article => scrapingService.enhanceWithAI(article))
      );

      const successfulEnhancements = enhanced
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => result.value);

      const failedCount = enhanced.length - successfulEnhancements.length;
      if (failedCount > 0) {
        console.warn(`${failedCount} enhancements failed`);
      }

      return NextResponse.json({
        success: true,
        data: successfulEnhancements,
        count: successfulEnhancements.length,
        message: `Enhanced ${successfulEnhancements.length} articles${failedCount > 0 ? ` (${failedCount} failed)` : ''}`
      });
    }

    // Return scraped news without enhancement
    return NextResponse.json({
      success: true,
      data: news,
      count: news.length,
      message: `Scraped ${news.length} articles`
    });

  } catch (error) {
    console.error('Scraping error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      error: 'Method not allowed. Use POST to scrape news.' 
    },
    { status: 405 }
  );
}
