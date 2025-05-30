# News Scraping Service

## Service Implementation

```typescript
export class NewsScrapingService {
  constructor() {
    this.exa = new Exa(process.env.EXA_API_KEY!);
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  }

  // Core scraping method
  async scrapeGhanaNews(limit: number = 10): Promise<ScrapedNews[]>

  // AI enhancement method
  async enhanceWithAI(news: ScrapedNews): Promise<EnhancedPost>

  // Connection testing
  async testGeminiConnection(): Promise<boolean>

  // Helper methods
  private removeDuplicates(news: ScrapedNews[]): ScrapedNews[]
  private createFallbackEnhancement(news: ScrapedNews): EnhancedPost
}
```

## Key Features

1. **Web Scraping**
   - Multiple search queries for comprehensive coverage
   - Source filtering for reliable news sites
   - Duplicate detection and removal
   - Recent content prioritization

2. **AI Enhancement**
   - Content improvement with Gemini AI
   - SEO optimization
   - Automatic categorization
   - Error handling with fallbacks

3. **Quality Control**
   - Connection testing
   - Rate limiting
   - Error recovery
   - Content validation

## Configuration

```typescript
const ALLOWED_DOMAINS = [
  'ghanaweb.com',
  'myjoyonline.com',
  'citinewsroom.com',
  'graphic.com.gh',
  'peacefmonline.com',
  'pulse.com.gh'
];

const SEARCH_QUERIES = [
  'latest news Ghana politics economy',
  'Ghana breaking news today',
  'Ghana business technology news',
  'Ghana sports entertainment news'
];
```

## AI Prompt Template

```typescript
const ENHANCEMENT_PROMPT = `
  You are a professional content editor specializing in Ghana news.
  Enhance this Ghana news article for a modern blog post while
  maintaining journalistic integrity and factual accuracy.

  Original Article:
  Title: ${news.title}
  Content: ${news.content}
  Source: ${news.source}
  URL: ${news.url}

  Please enhance by:
  1. Creating an engaging, SEO-optimized title
  2. Rewriting while preserving facts and quotes
  3. Adding proper structure with paragraphs
  4. Creating a compelling excerpt
  5. Suggesting 5-7 relevant tags
  6. Categorizing appropriately

  Return as JSON:
  {
    "title": "Enhanced title",
    "content": "Enhanced content",
    "excerpt": "Compelling summary",
    "tags": ["tag1", "tag2"],
    "category": "Category name"
  }
`;
```

## Error Handling

```typescript
try {
  // Primary enhancement attempt
  const enhancedData = await this.enhanceWithAI(news);
  return enhancedData;
} catch (error) {
  console.error('Enhancement failed:', error);
  // Fallback to basic enhancement
  return this.createFallbackEnhancement(news);
}
```

## Usage Example

```typescript
const service = new NewsScrapingService();

// Test connection
const isConnected = await service.testGeminiConnection();
if (!isConnected) {
  console.error('AI service not available');
  return;
}

// Scrape and enhance
const news = await service.scrapeGhanaNews(5);
const enhancedPosts = await Promise.all(
  news.map(article => service.enhanceWithAI(article))
);
```

## Best Practices

1. Always test connection before bulk operations
2. Implement rate limiting between API calls
3. Use fallback enhancement for AI failures
4. Log all operations for monitoring
5. Validate enhanced content before saving
