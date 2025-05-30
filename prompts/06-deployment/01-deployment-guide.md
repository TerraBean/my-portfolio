# Deployment Guide

## Environment Setup

### Production Environment Variables

```env
# API Keys
EXA_API_KEY=prod_key_here
GOOGLE_AI_API_KEY=prod_key_here

# Feature Flags
NODE_ENV=production
NEWS_SCRAPING_ENABLED=true

# Admin Configuration
ADMIN_USER_ID=prod_admin_id

# Optional: Monitoring
ENABLE_METRICS=true
LOG_LEVEL=info
```

## Deployment Checklist

1. **Pre-deployment Verification**
   - [ ] All environment variables configured
   - [ ] API keys validated
   - [ ] Database migrations applied
   - [ ] Admin user created
   - [ ] Cron job configuration verified

2. **Performance Optimization**
   - [ ] API response caching implemented
   - [ ] Rate limiting configured
   - [ ] Error handling tested
   - [ ] Memory usage optimized

3. **Security Measures**
   - [ ] API keys secured
   - [ ] Admin routes protected
   - [ ] Input validation implemented
   - [ ] Rate limiting enforced

## Monitoring Setup

### Logging Configuration

```typescript
// logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'news-scraper' },
  transports: [
    new winston.transports.File({ 
      filename: 'error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'combined.log' 
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

### Health Check Endpoint

```typescript
// /api/admin/health/route.ts
export async function GET() {
  try {
    const status = await healthCheck();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { healthy: false, error: error.message },
      { status: 500 }
    );
  }
}
```

## Scaling Considerations

### Database Optimization

```typescript
// Indexing for performance
model Post {
  // ... other fields

  @@index([title(length: 50)])
  @@index([category])
  @@index([published])
}
```

### Caching Strategy

```typescript
import { cache } from 'react';

export const getEnhancedPosts = cache(async () => {
  const posts = await prisma.post.findMany({
    where: {
      metadata: {
        path: ['source'],
        equals: 'auto-scraper-gemini'
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  return posts;
});
```

## Error Recovery

### Automated Recovery Script

```typescript
async function recoverFailedJobs() {
  const failedJobs = await prisma.job.findMany({
    where: {
      status: 'failed',
      retryCount: { lt: 3 }
    }
  });

  for (const job of failedJobs) {
    try {
      await processJob(job);
      await prisma.job.update({
        where: { id: job.id },
        data: { status: 'completed' }
      });
    } catch (error) {
      await prisma.job.update({
        where: { id: job.id },
        data: {
          retryCount: { increment: 1 },
          lastError: error.message
        }
      });
    }
  }
}
```

## Maintenance Procedures

### Daily Tasks

```bash
# Check logs
tail -f combined.log | grep ERROR

# Verify cron jobs
pm2 logs news-scraper

# Monitor disk usage
du -h /var/log/news-scraper/*
```

### Weekly Tasks

```bash
# Rotate logs
logrotate /etc/logrotate.d/news-scraper

# Clean old data
npm run cleanup-old-posts

# Review metrics
npm run generate-weekly-report
```

## Backup Procedures

### Database Backup

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d)
BACKUP_DIR="/backups/news-scraper"

# Backup database
pg_dump $DATABASE_URL > "$BACKUP_DIR/db_$DATE.sql"

# Compress backup
gzip "$BACKUP_DIR/db_$DATE.sql"

# Remove old backups (keep last 7 days)
find "$BACKUP_DIR" -name "db_*.sql.gz" -mtime +7 -delete
```

## Performance Monitoring

### Metrics Collection

```typescript
interface PerformanceMetrics {
  scraping: {
    success_rate: number;
    average_duration: number;
    articles_per_hour: number;
  };
  enhancement: {
    success_rate: number;
    average_duration: number;
    quality_score: number;
  };
  system: {
    memory_usage: number;
    cpu_usage: number;
    api_latency: number;
  };
}

async function collectMetrics(): Promise<PerformanceMetrics> {
  // Implementation
}
```

## Troubleshooting Guide

### Common Issues

1. **AI Service Unavailable**
   ```typescript
   // Check connection
   const connected = await service.testGeminiConnection();
   if (!connected) {
     // Log detailed error
     logger.error('AI service connection failed', {
       timestamp: new Date(),
       attempts: 3,
       latency: response.duration
     });
   }
   ```

2. **Rate Limiting**
   ```typescript
   // Implement exponential backoff
   const delay = (attempt: number) => 
     Math.min(1000 * Math.pow(2, attempt), 30000);
   ```

3. **Memory Leaks**
   ```typescript
   // Monitor memory usage
   const used = process.memoryUsage();
   logger.info('Memory usage', {
     heapTotal: used.heapTotal / 1024 / 1024,
     heapUsed: used.heapUsed / 1024 / 1024
   });
   ```
