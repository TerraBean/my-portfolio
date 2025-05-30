# Data Models

## ScrapedNews Interface

```typescript
interface ScrapedNews {
  title: string;        // Original article title
  content: string;      // Raw article content
  url: string;          // Source URL
  publishedDate: string; // Publication date
  source: string;       // Source website name
}
```

## EnhancedPost Interface

```typescript
interface EnhancedPost {
  title: string;           // AI-optimized title
  content: string;         // Enhanced content
  excerpt: string;         // Compelling summary
  tags: string[];          // Relevant tags
  category: string;        // Auto-categorization
  originalSource: string;  // Source tracking
  originalUrl: string;     // Reference link
}
```

## Database Schema

```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  content   Text
  excerpt   String?
  tags      String[]
  category  String
  published Boolean  @default(false)
  metadata  Json     // Stores source and enhancement info
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Metadata Structure

```typescript
interface PostMetadata {
  source: 'auto-scraper-gemini';
  originalUrl: string;
  originalSource: string;
  scrapedAt: string;
  enhancedAt: string;
}
```

## Usage Guidelines

1. Use ScrapedNews for raw data from Exa API
2. Transform to EnhancedPost using Gemini AI
3. Store final content in Post database model
4. Track origins and processing in metadata
