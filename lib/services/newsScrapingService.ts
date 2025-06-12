import Exa from 'exa-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ScrapedNews, EnhancedPost } from '../types/news';

export class NewsScrapingService {
  private exa: Exa;
  private genAI: GoogleGenerativeAI;

  constructor() {
    if (!process.env.EXA_API_KEY) {
      throw new Error('EXA_API_KEY is required');
    }
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is required');
    }

    this.exa = new Exa(process.env.EXA_API_KEY);
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  }

  // Configuration constants
  private readonly ALLOWED_DOMAINS = [
    'ghanaweb.com',
    'myjoyonline.com',
    'citinewsroom.com',
    'graphic.com.gh',
    'peacefmonline.com',
    'pulse.com.gh',
    'modernghana.com',
    'starrfm.com.gh'
  ];

  private readonly SEARCH_QUERIES = [
    'latest news Ghana politics economy',
    'Ghana breaking news today',
    'Ghana business technology news',
    'Ghana sports entertainment news'
  ];

  // Core scraping method
  async scrapeGhanaNews(limit: number = 10): Promise<ScrapedNews[]> {
    try {
      console.log(`Starting news scraping with limit: ${limit}`);
      
      const allNews: ScrapedNews[] = [];
      
      for (const query of this.SEARCH_QUERIES) {
        try {
          const searchResults = await this.exa.searchAndContents(query, {
            type: 'neural',
            useAutoprompt: true,
            numResults: Math.ceil(limit / this.SEARCH_QUERIES.length),
            text: {
              maxCharacters: 2000,
              includeHtmlTags: false
            },
            includeDomains: this.ALLOWED_DOMAINS,
            startPublishedDate: this.getDateDaysAgo(7), // Last 7 days
          });          const newsItems = searchResults.results.map(result => ({
            title: result.title || 'Untitled Article',
            content: result.text || '',
            url: result.url,
            publishedDate: result.publishedDate || new Date().toISOString(),
            source: this.extractSourceName(result.url)
          }));

          allNews.push(...newsItems);
          
          // Rate limiting between queries
          await this.delay(1000);
        } catch (error) {
          console.error(`Error with query "${query}":`, error);
          continue;
        }
      }

      // Remove duplicates and limit results
      const uniqueNews = this.removeDuplicates(allNews);
      const limitedNews = uniqueNews.slice(0, limit);

      console.log(`Scraped ${limitedNews.length} unique articles`);
      return limitedNews;

    } catch (error) {
      console.error('Scraping error:', error);
      throw new Error('Failed to scrape news');
    }
  }

  // AI enhancement method
  async enhanceWithAI(news: ScrapedNews): Promise<EnhancedPost> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = this.createEnhancementPrompt(news);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const enhancedData = JSON.parse(text);

      return {
        title: enhancedData.title || news.title,
        content: enhancedData.content || news.content,
        excerpt: enhancedData.excerpt || this.createExcerpt(news.content),
        tags: enhancedData.tags || ['Ghana', 'News'],
        category: enhancedData.category || 'General',
        originalSource: news.source,
        originalUrl: news.url
      };

    } catch (error) {
      console.error('AI enhancement error:', error);
      return this.createFallbackEnhancement(news);
    }
  }

  // Connection testing
  async testGeminiConnection(): Promise<boolean> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent('Hello');
      const response = await result.response;
      return !!response.text();
    } catch (error) {
      console.error('Gemini connection test failed:', error);
      return false;
    }
  }

  // Helper methods
  private removeDuplicates(news: ScrapedNews[]): ScrapedNews[] {
    const seen = new Set<string>();
    return news.filter(item => {
      const key = `${item.title.toLowerCase().trim()}-${item.url}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private createFallbackEnhancement(news: ScrapedNews): EnhancedPost {
    return {
      title: news.title,
      content: news.content,
      excerpt: this.createExcerpt(news.content),
      tags: ['Ghana', 'News'],
      category: 'General',
      originalSource: news.source,
      originalUrl: news.url
    };
  }

  private createEnhancementPrompt(news: ScrapedNews): string {
    return `
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
4. Creating a compelling excerpt (2-3 sentences)
5. Suggesting 5-7 relevant tags
6. Categorizing appropriately (Politics, Economy, Sports, Entertainment, Technology, General)

Return ONLY valid JSON:
{
  "title": "Enhanced title",
  "content": "Enhanced content with proper paragraphs",
  "excerpt": "Compelling 2-3 sentence summary",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "category": "Category name"
}`;
  }

  private extractSourceName(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'Unknown Source';
    }
  }

  private createExcerpt(content: string): string {
    const sentences = content.split('.').filter(s => s.trim().length > 20);
    return sentences.slice(0, 2).join('.') + '.';
  }

  private getDateDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
