// Types for news scraping and enhancement

export interface ScrapedNews {
  title: string;        // Original article title
  content: string;      // Raw article content
  url: string;          // Source URL
  publishedDate: string; // Publication date
  source: string;       // Source website name
}

export interface EnhancedPost {
  title: string;           // AI-optimized title
  content: string;         // Enhanced content
  excerpt: string;         // Compelling summary
  tags: string[];          // Relevant tags
  category: string;        // Auto-categorization
  originalSource: string;  // Source tracking
  originalUrl: string;     // Reference link
}

export interface ScrapingOptions {
  limit?: number;
  autoEnhance?: boolean;
  includeDomains?: string[];
  excludeDomains?: string[];
}

export interface ScrapingResult {
  success: boolean;
  data: ScrapedNews[] | EnhancedPost[];
  count: number;
  error?: string;
}

export interface ConnectionStatus {
  connected: boolean;
  service: string;
  timestamp: string;
  error?: string;
}

export interface CronJobStatus {
  id: string;
  name: string;
  schedule: string;
  running: boolean;
  lastRun?: string;
  nextRun?: string;
}
