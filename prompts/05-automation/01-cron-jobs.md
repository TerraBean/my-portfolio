# Automation Implementation

## Cron Service Implementation

```typescript
export class CronService {
  private static instance: CronService;
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  static getInstance(): CronService {
    if (!CronService.instance) {
      CronService.instance = new CronService();
    }
    return CronService.instance;
  }

  startNewsScrapingJob() {
    const job = cron.schedule('0 */6 * * *', async () => {
      console.log('Starting automated news scraping...');
      
      if (!process.env.NEWS_SCRAPING_ENABLED) {
        console.log('News scraping disabled');
        return;
      }

      try {
        const service = new NewsScrapingService();
        
        // Verify AI connection
        const connected = await service.testGeminiConnection();
        if (!connected) {
          console.error('AI service unavailable');
          return;
        }

        // Scrape and enhance
        const news = await service.scrapeGhanaNews(5);
        for (const article of news) {
          try {
            // Check for duplicates
            const exists = await this.checkDuplicate(article);
            if (exists) continue;

            // Enhance and save
            const enhanced = await service.enhanceWithAI(article);
            await this.savePost(enhanced);

            // Rate limiting
            await new Promise(r => setTimeout(r, 2000));
          } catch (error) {
            console.error('Article processing failed:', error);
            continue;
          }
        }
      } catch (error) {
        console.error('Automation error:', error);
      }
    });

    this.jobs.set('news-scraping', job);
    job.start();
  }

  private async checkDuplicate(article: ScrapedNews): Promise<boolean> {
    const existing = await prisma.post.findFirst({
      where: {
        OR: [
          { title: { contains: article.title.substring(0, 50) } },
          { 
            metadata: {
              path: ['originalUrl'],
              equals: article.url
            }
          }
        ]
      }
    });
    return Boolean(existing);
  }

  private async savePost(post: EnhancedPost) {
    await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        category: post.category,
        tags: post.tags,
        published: false,
        metadata: {
          source: 'auto-scraper-gemini',
          originalUrl: post.originalUrl,
          originalSource: post.originalSource,
          scrapedAt: new Date().toISOString(),
          enhancedAt: new Date().toISOString()
        },
        authorId: process.env.ADMIN_USER_ID
      }
    });
  }
}
```

## Scheduling Configuration

### Cron Patterns

```typescript
// Available patterns:
'0 */6 * * *'  // Every 6 hours
'0 */3 * * *'  // Every 3 hours
'0 6 * * *'    // Daily at 6 AM
'*/30 * * * *' // Every 30 minutes
```

### Rate Limiting

```typescript
// Delay between article processing
await new Promise(r => setTimeout(r, 2000));

// Maximum articles per run
const MAX_ARTICLES = 5;

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;
```

## Service Initialization

```typescript
// startup.ts
import { CronService } from './services/cronService';

export function initializeServices() {
  if (process.env.NODE_ENV === 'production') {
    const cronService = CronService.getInstance();
    cronService.startNewsScrapingJob();
    console.log('Cron services initialized');
  }
}

// Add to app layout
if (typeof window === 'undefined') {
  initializeServices();
}
```

## Error Handling

```typescript
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(
        `Attempt ${i + 1} failed:`,
        error.message
      );
      
      if (i < maxRetries - 1) {
        await new Promise(r => 
          setTimeout(r, RETRY_DELAY * Math.pow(2, i))
        );
      }
    }
  }
  
  throw lastError;
}
```

## Monitoring

```typescript
interface JobMetrics {
  startTime: Date;
  endTime: Date;
  articlesProcessed: number;
  successCount: number;
  errorCount: number;
  errors: Error[];
}

class JobMonitor {
  private metrics: JobMetrics;

  startJob() {
    this.metrics = {
      startTime: new Date(),
      endTime: null,
      articlesProcessed: 0,
      successCount: 0,
      errorCount: 0,
      errors: []
    };
  }

  recordSuccess() {
    this.metrics.successCount++;
    this.metrics.articlesProcessed++;
  }

  recordError(error: Error) {
    this.metrics.errorCount++;
    this.metrics.errors.push(error);
    this.metrics.articlesProcessed++;
  }

  endJob() {
    this.metrics.endTime = new Date();
    this.logMetrics();
  }

  private logMetrics() {
    console.log('Job Metrics:', {
      duration: (
        this.metrics.endTime.getTime() - 
        this.metrics.startTime.getTime()
      ) / 1000,
      ...this.metrics
    });
  }
}
```

## Health Checks

```typescript
async function healthCheck() {
  try {
    // Check AI service
    const aiConnected = await service
      .testGeminiConnection();
    
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    
    // Check cron jobs
    const cronService = CronService.getInstance();
    const jobStatus = cronService
      .getJobStatus('news-scraping');

    return {
      healthy: aiConnected && jobStatus,
      services: {
        ai: aiConnected,
        database: true,
        cron: jobStatus
      }
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message
    };
  }
}
```
