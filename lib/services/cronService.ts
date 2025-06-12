import * as cron from 'node-cron';
import { NewsScrapingService } from './newsScrapingService';
import { ScrapedNews, CronJobStatus } from '../types/news';
import { sql, saveScrapedNews, getAllScrapedNews } from '../db';

export class CronService {
  private static instance: CronService;
  private jobs: Map<string, cron.ScheduledTask> = new Map();
  private newsScrapingService: NewsScrapingService;

  constructor() {
    this.newsScrapingService = new NewsScrapingService();
  }

  static getInstance(): CronService {
    if (!CronService.instance) {
      CronService.instance = new CronService();
    }
    return CronService.instance;
  }

  // Start automated news scraping job
  startNewsScrapingJob(): void {
    const jobId = 'news-scraping';
    
    // Stop existing job if running
    this.stopJob(jobId);

    const job = cron.schedule('0 */6 * * *', async () => {
      console.log('Starting automated news scraping...');
      
      if (!process.env.NEWS_SCRAPING_ENABLED || process.env.NEWS_SCRAPING_ENABLED !== 'true') {
        console.log('News scraping disabled via environment variable');
        return;
      }

      try {
        // Verify AI connection first
        const connected = await this.newsScrapingService.testGeminiConnection();
        if (!connected) {
          console.error('AI service unavailable, skipping automated scraping');
          return;
        }

        // Scrape news articles
        const news = await this.newsScrapingService.scrapeGhanaNews(5);
        console.log(`Scraped ${news.length} articles for processing`);

        let processedCount = 0;
        let savedCount = 0;

        for (const article of news) {
          try {
            processedCount++;
            console.log(`Processing article ${processedCount}/${news.length}: ${article.title.substring(0, 50)}...`);

            // Check for duplicates
            const exists = await this.checkDuplicate(article);
            if (exists) {
              console.log('Article already exists, skipping...');
              continue;
            }

            // Enhance with AI
            const enhanced = await this.newsScrapingService.enhanceWithAI(article);
            
            // Save to database using the news-specific function
            const savedNews = await saveScrapedNews([{
              title: enhanced.title || article.title,
              content: enhanced.content || article.content,
              url: article.url,
              publishedDate: article.publishedDate,
              source: article.source,
              enhancedContent: enhanced.content !== article.content ? enhanced.content : undefined
            }]);

            if (savedNews.length > 0) {
              savedCount++;
              console.log(`Saved enhanced article: ${enhanced.title || article.title}`);
            }

            // Rate limiting between articles
            await new Promise(resolve => setTimeout(resolve, 2000));

          } catch (error) {
            console.error(`Error processing article "${article.title}":`, error);
            continue;
          }
        }

        console.log(`Automation completed: ${savedCount}/${processedCount} articles saved`);

      } catch (error) {
        console.error('Automation error:', error);
      }
    });

    this.jobs.set(jobId, job);
    job.start();
    
    console.log('News scraping job scheduled (every 6 hours)');
  }

  // Stop a specific job
  stopJob(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (job) {
      job.stop();
      this.jobs.delete(jobId);
      console.log(`Stopped job: ${jobId}`);
    }
  }

  // Stop all jobs
  stopAllJobs(): void {
    this.jobs.forEach((job, jobId) => {
      job.stop();
      console.log(`Stopped job: ${jobId}`);
    });
    this.jobs.clear();
  }

  // Get job status
  getJobStatus(): CronJobStatus[] {
    const statuses: CronJobStatus[] = [];
    
    this.jobs.forEach((job, jobId) => {
      statuses.push({
        id: jobId,
        name: this.getJobName(jobId),
        schedule: this.getJobSchedule(jobId),
        running: (job as any).running || false,
        lastRun: undefined, // Would need to track this separately
        nextRun: undefined  // Would need to calculate this
      });
    });

    return statuses;
  }

  // Check if article already exists in database
  private async checkDuplicate(article: ScrapedNews): Promise<boolean> {
    try {
      const existing = await sql`
        SELECT id FROM scraped_news 
        WHERE url = ${article.url} 
        OR title = ${article.title}
        LIMIT 1
      `;

      return existing.length > 0;
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      return false; // Assume no duplicate on error
    }
  }

  // Helper methods
  private createSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private getJobName(jobId: string): string {
    const names: Record<string, string> = {
      'news-scraping': 'Automated News Scraping'
    };
    return names[jobId] || jobId;
  }

  private getJobSchedule(jobId: string): string {
    const schedules: Record<string, string> = {
      'news-scraping': '0 */6 * * *' // Every 6 hours
    };
    return schedules[jobId] || 'Unknown';
  }
}