# API Endpoints Implementation

## Route Structure

```typescript
/api/admin/news/
├── scrape/            // Manual news scraping
├── enhance/           // Single article enhancement
└── test-connection/   // AI service testing
```

## 1. Scrape Endpoint

```typescript
// /api/admin/news/scrape/route.ts
export async function POST(req: NextRequest) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const { limit = 10, autoEnhance = false } = await req.json();
    const scrapingService = new NewsScrapingService();

    // Test connection if needed
    if (autoEnhance) {
      const connected = await scrapingService.testGeminiConnection();
      if (!connected) {
        return NextResponse.json(
          { error: 'AI service unavailable' },
          { status: 503 }
        );
      }
    }

    // Scrape and enhance
    const news = await scrapingService.scrapeGhanaNews(limit);
    if (autoEnhance) {
      const enhanced = await Promise.all(
        news.map(n => scrapingService.enhanceWithAI(n))
      );
      return NextResponse.json({ success: true, data: enhanced });
    }

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
  }
}
```

## 2. Enhance Endpoint

```typescript
// /api/admin/news/enhance/route.ts
export async function POST(req: NextRequest) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const { newsItem } = await req.json();
    if (!newsItem?.title || !newsItem?.content) {
      return NextResponse.json(
        { error: 'Invalid news item' },
        { status: 400 }
      );
    }

    const scrapingService = new NewsScrapingService();
    const enhanced = await scrapingService.enhanceWithAI(newsItem);

    return NextResponse.json({ success: true, data: enhanced });
  } catch (error) {
    console.error('Enhancement error:', error);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
  }
}
```

## 3. Connection Test Endpoint

```typescript
// /api/admin/news/test-connection/route.ts
export async function GET(req: NextRequest) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const scrapingService = new NewsScrapingService();
    const connected = await scrapingService.testGeminiConnection();

    return NextResponse.json({
      success: true,
      geminiConnected: connected,
      message: connected 
        ? 'AI service connected' 
        : 'AI service unavailable'
    });
  } catch (error) {
    console.error('Connection test error:', error);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
  }
}
```

## Error Handling

All endpoints implement:
1. Authentication verification
2. Input validation
3. Error logging
4. Appropriate status codes
5. Meaningful error messages

## Response Formats

### Success Response
```typescript
{
  success: true,
  data: T[],           // Generic type for data
  count?: number,      // Optional count
  message?: string     // Optional message
}
```

### Error Response
```typescript
{
  error: string,       // Error message
  details?: string,    // Optional details
  status: number      // HTTP status code
}
```

## Testing Endpoints

Use these curl commands for testing:

```bash
# Test connection
curl -X GET http://localhost:3000/api/admin/news/test-connection

# Scrape news
curl -X POST http://localhost:3000/api/admin/news/scrape \
  -H "Content-Type: application/json" \
  -d '{"limit": 5, "autoEnhance": true}'

# Enhance article
curl -X POST http://localhost:3000/api/admin/news/enhance \
  -H "Content-Type: application/json" \
  -d '{"newsItem": {"title": "Test", "content": "Content"}}'
```
