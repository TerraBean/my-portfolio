# Frontend Components Implementation

## Component Architecture

```typescript
/components/admin/
└── NewsScrapingPanel/
    ├── index.tsx           // Main component
    ├── ScrapedNews.tsx    // News item display
    ├── EnhancedPost.tsx   // Enhanced post display
    └── ConnectionStatus.tsx // AI service status
```

## Main Panel Component

```typescript
// components/admin/NewsScrapingPanel/index.tsx

export default function NewsScrapingPanel() {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedNews, setScrapedNews] = useState<ScrapedNews[]>([]);
  const [enhancedPosts, setEnhancedPosts] = useState<EnhancedPost[]>([]);
  const [geminiConnected, setGeminiConnected] = useState<boolean | null>(null);

  // Core functionality
  const handleScrapeNews = async (autoEnhance = false) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/news/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 10, autoEnhance }),
      });

      const result = await response.json();
      
      if (result.success) {
        if (autoEnhance) {
          setEnhancedPosts(result.data);
          toast.success(`Enhanced ${result.count} articles`);
        } else {
          setScrapedNews(result.data);
          toast.success(`Scraped ${result.count} articles`);
        }
      } else {
        toast.error(result.error || 'Operation failed');
      }
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Render component
  return (
    <div className="space-y-6">
      <ConnectionStatus connected={geminiConnected} />
      <ActionButtons 
        onScrape={handleScrapeNews}
        disabled={isLoading || !geminiConnected}
      />
      <ScrapedNewsList news={scrapedNews} />
      <EnhancedPostsList posts={enhancedPosts} />
    </div>
  );
}
```

## UI Components

### Connection Status

```typescript
function ConnectionStatus({ connected }: { connected: boolean | null }) {
  return (
    <Alert
      className={cn(
        'border',
        connected ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
      )}
    >
      <div className="flex items-center gap-2">
        {connected ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <XCircle className="h-4 w-4 text-red-600" />
        )}
        <AlertDescription>
          {connected === null 
            ? 'Checking connection...'
            : connected 
              ? 'AI service connected'
              : 'AI service unavailable'}
        </AlertDescription>
      </div>
    </Alert>
  );
}
```

### Action Buttons

```typescript
function ActionButtons({ 
  onScrape, 
  disabled 
}: { 
  onScrape: (autoEnhance: boolean) => Promise<void>;
  disabled: boolean;
}) {
  return (
    <div className="flex gap-4">
      <Button 
        onClick={() => onScrape(false)}
        disabled={disabled}
      >
        Scrape Latest News
      </Button>
      <Button 
        onClick={() => onScrape(true)}
        disabled={disabled}
        variant="outline"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Scrape & Auto-Enhance
      </Button>
    </div>
  );
}
```

### News Lists

```typescript
function ScrapedNewsList({ news }: { news: ScrapedNews[] }) {
  return (
    <div className="space-y-4">
      {news.map((item, index) => (
        <div key={index} className="border p-4 rounded-lg">
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm text-gray-600 mt-2">
            {item.content.substring(0, 200)}...
          </p>
          <div className="flex justify-between items-center mt-3">
            <Badge variant="secondary">{item.source}</Badge>
            <Button size="sm">Enhance with AI</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function EnhancedPostsList({ posts }: { posts: EnhancedPost[] }) {
  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <div key={index} className="border p-4 rounded-lg">
          <h3 className="font-semibold">{post.title}</h3>
          <p className="text-sm text-gray-600 mt-2">{post.excerpt}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge>{post.category}</Badge>
            {post.tags.map(tag => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
          <div className="mt-3">
            <Button size="sm">Create Post</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Styling

```typescript
// Components use Tailwind CSS classes
// Customize the theme in tailwind.config.js

const customColors = {
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
  },
  // ... other custom colors
};
```

## Component Integration

Add to admin layout:

```typescript
// app/blog/admin/layout.tsx

import { NewsScrapingPanel } from '@/components/admin/NewsScrapingPanel';

export default function AdminLayout() {
  return (
    <div className="container mx-auto py-6">
      <NewsScrapingPanel />
      {/* Other admin components */}
    </div>
  );
}
```
