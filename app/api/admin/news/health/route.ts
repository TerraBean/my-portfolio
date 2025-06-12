import { NextResponse } from 'next/server';
import { CronService } from '@/lib/services/cronService';
import { NewsScrapingService } from '@/lib/services/newsScrapingService';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const healthCheck = {
      timestamp: new Date().toISOString(),
      services: {
        database: false,
        ai: false,
        cron: false
      },
      details: {} as any
    };    // Test database connection
    try {
      await sql`SELECT 1 as test`;
      healthCheck.services.database = true;
    } catch (error) {
      healthCheck.details.database_error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Test AI service connection
    try {
      const newsService = new NewsScrapingService();
      const aiConnected = await newsService.testGeminiConnection();
      healthCheck.services.ai = aiConnected;
      if (!aiConnected) {
        healthCheck.details.ai_error = 'AI service connection failed';
      }
    } catch (error) {
      healthCheck.details.ai_error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Check cron service status
    try {
      const cronService = CronService.getInstance();
      const jobStatuses = cronService.getJobStatus();
      healthCheck.services.cron = jobStatuses.length > 0;
      healthCheck.details.cron_jobs = jobStatuses;
    } catch (error) {
      healthCheck.details.cron_error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Overall health status
    const overallHealth = Object.values(healthCheck.services).every(status => status);

    return NextResponse.json({
      healthy: overallHealth,
      ...healthCheck
    }, {
      status: overallHealth ? 200 : 503
    });

  } catch (error) {
    return NextResponse.json({
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
}
