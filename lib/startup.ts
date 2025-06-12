import { CronService } from './services/cronService';

/**
 * Initialize application services
 * This function sets up cron jobs and other background services
 */
export function initializeServices() {
  // Only run cron jobs in production or when explicitly enabled
  if (process.env.NODE_ENV === 'production' || process.env.NEWS_SCRAPING_ENABLED === 'true') {
    try {
      const cronService = CronService.getInstance();
      cronService.startNewsScrapingJob();
      console.log('✅ News scraping cron service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize cron services:', error);
    }
  } else {
    console.log('ℹ️ Cron services skipped (not in production)');
  }
}

/**
 * Cleanup function for graceful shutdown
 */
export function cleanupServices() {
  try {
    const cronService = CronService.getInstance();
    cronService.stopAllJobs();
    console.log('✅ Services cleaned up successfully');
  } catch (error) {
    console.error('❌ Error during service cleanup:', error);
  }
}
