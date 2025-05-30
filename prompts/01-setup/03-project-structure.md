# Project Structure

## Directory Organization

```
src/
├── lib/
│   ├── services/
│   │   ├── newsScrapingService.ts
│   │   └── cronService.ts
│   └── types/
│       └── news.ts
├── app/
│   ├── api/
│   │   └── admin/
│   │       └── news/
│   │           ├── scrape/
│   │           │   └── route.ts
│   │           ├── enhance/
│   │           │   └── route.ts
│   │           └── test-connection/
│   │               └── route.ts
│   └── blog/
│       └── admin/
│           └── news/
│               └── page.tsx
└── components/
    └── admin/
        └── NewsScrapingPanel.tsx
```

## Key Components

1. **Services**
   - `newsScrapingService.ts`: Core scraping and AI enhancement logic
   - `cronService.ts`: Automated task scheduling

2. **API Routes**
   - `scrape`: Handles manual news scraping requests
   - `enhance`: Processes individual article enhancement
   - `test-connection`: Verifies AI service connectivity

3. **Frontend**
   - `NewsScrapingPanel.tsx`: Admin interface for news management
   - News management integration in admin dashboard

4. **Types**
   - Type definitions for scraped news and enhanced posts

## Implementation Order

1. Set up type definitions
2. Implement core services
3. Create API routes
4. Develop frontend components
5. Configure automation
