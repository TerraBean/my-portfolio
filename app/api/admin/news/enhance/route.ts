import { NextRequest, NextResponse } from 'next/server';
import { NewsScrapingService } from '@/lib/services/newsScrapingService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ScrapedNews } from '@/lib/types/news';

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
    const { news } = body;

    // Validate input
    if (!news) {
      return NextResponse.json(
        { error: 'News data is required' },
        { status: 400 }
      );
    }

    // Handle single news item or array
    const newsItems: ScrapedNews[] = Array.isArray(news) ? news : [news];
    
    if (newsItems.length === 0) {
      return NextResponse.json(
        { error: 'At least one news item is required' },
        { status: 400 }
      );
    }

    // Validate news item structure
    for (const item of newsItems) {
      if (!item.title || !item.content || !item.url) {
        return NextResponse.json(
          { error: 'Each news item must have title, content, and url' },
          { status: 400 }
        );
      }
    }

    console.log(`Enhancing ${newsItems.length} news items...`);

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

    // Enhance all news items
    const enhancementResults = await Promise.allSettled(
      newsItems.map(async (item, index) => {
        console.log(`Enhancing item ${index + 1}/${newsItems.length}: ${item.title.substring(0, 50)}...`);
        return await scrapingService.enhanceWithAI(item);
      })
    );

    // Process results
    const successful = enhancementResults
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value);

    const failed = enhancementResults
      .filter(result => result.status === 'rejected')
      .map(result => (result as PromiseRejectedResult).reason);

    const failedCount = failed.length;

    if (successful.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'All enhancement attempts failed',
          details: process.env.NODE_ENV === 'development' ? failed : undefined
        },
        { status: 500 }
      );
    }

    // Log any failures
    if (failedCount > 0) {
      console.warn(`${failedCount} enhancement(s) failed:`, failed);
    }

    return NextResponse.json({
      success: true,
      data: Array.isArray(news) ? successful : successful[0],
      count: successful.length,
      message: `Enhanced ${successful.length} article(s)${failedCount > 0 ? ` (${failedCount} failed)` : ''}`,
      failed: failedCount
    });

  } catch (error) {
    console.error('Enhancement error:', error);
    
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
      error: 'Method not allowed. Use POST to enhance news articles.' 
    },
    { status: 405 }
  );
}
